/**
 * Profile Server Actions
 *
 * Server actions for user profile CRUD operations with proper validation.
 * These actions handle onboarding data and profile management.
 */

"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import db from "../../../db/drizzle";
import { userProfiles } from "../../../db/schema";
import {
  createUserProfileSchema,
  updateUserProfileSchema,
  completeOnboardingSchema,
  type CreateUserProfileInput,
  type UpdateUserProfileInput,
  type CompleteOnboardingInput,
} from "../validations/profile";
import { ActionResponse } from "../types";
import { auth } from "../auth";
import { revalidatePath } from "next/cache";

/**
 * Get user profile by user ID
 */
export async function getUserProfile(userId?: string): Promise<ActionResponse> {
  try {
    // If no userId provided, get from session
    if (!userId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user?.id) {
        return {
          success: false,
          error: "Authentication required",
        };
      }
      userId = session.user.id;
    }

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    if (profile.length === 0) {
      return {
        success: false,
        error: "Profile not found",
        data: false,
      };
    }

    return {
      success: true,
      data: profile[0],
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return {
      success: false,
      error: "Failed to fetch profile",
    };
  }
}

/**
 * Create a new user profile
 */
export async function createUserProfile(
  input: CreateUserProfileInput
): Promise<ActionResponse> {
  try {
    // Get current user from session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Validate input
    const validatedInput = createUserProfileSchema.parse(input);

    // Check if profile already exists
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    if (existingProfile.length > 0) {
      return {
        success: false,
        error: "Profile already exists",
      };
    }

    // Create new profile
    await db
      .insert(userProfiles)
      .values({
        userId: session.user.id,
        experienceLevel: validatedInput.experienceLevel,
        investmentObjectives: validatedInput.investmentObjectives,
        riskTolerance: validatedInput.riskTolerance,
        completedOnboarding: false,
      });

    const newProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    // Revalidate relevant paths
    revalidatePath("/onboarding");
    revalidatePath("/profile");

    return {
      success: true,
      data: newProfile[0],
      message: "Profile created successfully",
    };
  } catch (error) {
    console.error("Error creating user profile:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Failed to create profile",
    };
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  input: UpdateUserProfileInput
): Promise<ActionResponse> {
  try {
    // Get current user from session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Validate input
    const validatedInput = updateUserProfileSchema.parse(input);

    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      return {
        success: false,
        error: "Profile not found",
      };
    }

    // Update profile
    await db
      .update(userProfiles)
      .set({
        ...validatedInput,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.userId, session.user.id));

    const updatedProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    // Revalidate relevant paths
    revalidatePath("/profile");
    revalidatePath("/onboarding");

    return {
      success: true,
      data: updatedProfile[0],
      message: "Profile updated successfully",
    };
  } catch (error) {
    console.error("Error updating user profile:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Failed to update profile",
    };
  }
}

/**
 * Complete onboarding process
 */
export async function completeOnboarding(
  input: CompleteOnboardingInput
): Promise<ActionResponse> {
  try {
    // Get current user from session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Validate input
    const validatedInput = completeOnboardingSchema.parse(input);

    // Check if profile exists, create if not
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    let profile;

    if (existingProfile.length === 0) {
      // Create new profile with onboarding completion
      profile = await db
        .insert(userProfiles)
        .values({
          userId: session.user.id,
          experienceLevel: validatedInput.experienceLevel,
          investmentObjectives: validatedInput.investmentObjectives,
          riskTolerance: validatedInput.riskTolerance,
          completedOnboarding: true,
        });

    } else {
      // Update existing profile and mark onboarding as complete
      profile = await db
        .update(userProfiles)
        .set({
          experienceLevel: validatedInput.experienceLevel,
          investmentObjectives: validatedInput.investmentObjectives,
          riskTolerance: validatedInput.riskTolerance,
          completedOnboarding: true,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, session.user.id));

    }

    profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    // Revalidate relevant paths
    revalidatePath("/onboarding");
    revalidatePath("/profile");
    revalidatePath("/");

    return {
      success: true,
      data: profile[0],
      message: "Onboarding completed successfully",
    };
  } catch (error) {
    console.error("Error completing onboarding:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Failed to complete onboarding",
    };
  }
}

/**
 * Skip onboarding with default settings
 */
export async function skipOnboarding(): Promise<ActionResponse> {
  try {
    // Get current user from session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Check if profile exists
    const existingProfile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    if (existingProfile.length === 0) {
      // Create new profile with default settings
      await db
        .insert(userProfiles)
        .values({
          userId: session.user.id,
          experienceLevel: "beginner",
          investmentObjectives: ["learning"],
          riskTolerance: "low",
          completedOnboarding: true,
        });
    } else {
      // Update existing profile to mark onboarding as complete
      await db
        .update(userProfiles)
        .set({
          completedOnboarding: true,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, session.user.id));
    }

    const profile = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    // Revalidate relevant paths
    revalidatePath("/onboarding");
    revalidatePath("/profile");
    revalidatePath("/");

    return {
      success: true,
      data: profile[0],
      message: "Onboarding skipped successfully",
    };
  } catch (error) {
    console.error("Error skipping onboarding:", error);
    return {
      success: false,
      error: "Failed to skip onboarding",
    };
  }
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(
  userId?: string
): Promise<ActionResponse<boolean>> {
  try {
    // If no userId provided, get from session
    if (!userId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session?.user?.id) {
        return {
          success: false,
          error: "Authentication required",
        };
      }
      userId = session.user.id;
    }

    const profile = await db
      .select({ completedOnboarding: userProfiles.completedOnboarding })
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    // If no profile exists, onboarding is not complete
    const completed =
      profile.length > 0 ? (profile[0].completedOnboarding ?? false) : false;

    return {
      success: true,
      data: completed,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return {
      success: false,
      error: "Failed to check onboarding status",
    };
  }
}

/**
 * Delete user profile
 */
export async function deleteUserProfile(): Promise<ActionResponse> {
  try {
    // Get current user from session
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // Delete profile
    await db
      .delete(userProfiles)
      .where(eq(userProfiles.userId, session.user.id));

    // Revalidate relevant paths
    revalidatePath("/profile");
    revalidatePath("/onboarding");

    return {
      success: true,
      message: "Profile deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting user profile:", error);
    return {
      success: false,
      error: "Failed to delete profile",
    };
  }
}

/**
 * Mark an onboarding tip as seen for the current user
 */
export async function dismissTip(
  tip: "dashboard" | "challenge"
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return { success: false, error: "Authentication required" };
    }

    const field =
      tip === "dashboard" ? "hasSeenDashboardTips" : "hasSeenChallengeTip";

    await db
      .update(userProfiles)
      .set({ [field]: true, updatedAt: new Date() })
      .where(eq(userProfiles.userId, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error dismissing tip:", error);
    return { success: false, error: "Failed to dismiss tip" };
  }
}
