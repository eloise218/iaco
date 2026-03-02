import { stripe } from "@/lib/stripe";
import db from "@/db/drizzle";
import { users, payments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    logger.error("stripe", "Webhook signature verification failed", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (!userId) {
      logger.error("stripe", "No userId in session metadata");
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    // Activate premium
    await db
      .update(users)
      .set({
        isPremium: true,
        premiumSince: new Date(),
      })
      .where(eq(users.id, userId));

    // Update payment record
    await db
      .update(payments)
      .set({
        status: "completed",
        stripePaymentIntentId: session.payment_intent as string,
      })
      .where(eq(payments.stripeSessionId, session.id));

    logger.info("stripe", `Premium activated for user ${userId}`);
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const paymentIntentId = charge.payment_intent as string;

    if (paymentIntentId) {
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, paymentIntentId))
        .limit(1);

      if (payment) {
        await db
          .update(users)
          .set({ isPremium: false })
          .where(eq(users.id, payment.userId));

        await db
          .update(payments)
          .set({ status: "refunded" })
          .where(eq(payments.id, payment.id));
      }
    }
  }

  return Response.json({ received: true });
}
