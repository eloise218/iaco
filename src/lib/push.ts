import webpush from 'web-push';
import db from '@/db/drizzle';
import { pushSubscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:contact@iaco.fr',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

export async function sendPushNotification(userId: string, payload: PushPayload) {
  const subscriptions = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
      } catch (error: unknown) {
        const statusCode = (error as { statusCode?: number }).statusCode;
        // 410 Gone = subscription expired, clean it up
        if (statusCode === 410 || statusCode === 404) {
          await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
        }
        throw error;
      }
    }),
  );

  const sent = results.filter((r) => r.status === 'fulfilled').length;
  const failed = results.filter((r) => r.status === 'rejected').length;
  return { sent, failed };
}
