import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import db from "@/db/drizzle";
import { users, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { locale = "fr" } = await req.json();

    // Check if already premium
    const [user] = await db
      .select({
        isPremium: users.isPremium,
        stripeCustomerId: users.stripeCustomerId,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user?.isPremium) {
      return Response.json({ error: "Already premium" }, { status: 400 });
    }

    // Get or create Stripe customer
    let customerId = user?.stripeCustomerId;
    if (customerId) {
      // Verify customer still exists in Stripe (handles test/live mode switch)
      try {
        await stripe.customers.retrieve(customerId);
      } catch {
        customerId = null;
      }
    }
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        name: session.user.name || undefined,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, session.user.id));
    }

    const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";

    // Create Checkout Session (one-time payment)
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/${locale}/account?payment=success`,
      cancel_url: `${baseUrl}/${locale}/account?payment=cancelled`,
      metadata: {
        userId: session.user.id,
      },
    });

    // Create pending payment record
    await db.insert(payments).values({
      userId: session.user.id,
      stripeSessionId: checkoutSession.id,
      amount: checkoutSession.amount_total || 0,
      currency: checkoutSession.currency || "eur",
      status: "pending",
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    logger.error("stripe", "Stripe checkout error", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
