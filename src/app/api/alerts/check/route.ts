import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkAndTriggerAlerts, getUserAlerts } from "@/lib/actions/alerts";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check and trigger any crossing alerts
    await checkAndTriggerAlerts(session.user.id);

    // Return all user alerts (with updated status)
    const result = await getUserAlerts();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error checking alerts:", error);
    return NextResponse.json(
      { error: "Failed to check alerts" },
      { status: 500 }
    );
  }
}
