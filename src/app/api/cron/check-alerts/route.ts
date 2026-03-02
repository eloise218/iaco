import { eq, and } from 'drizzle-orm';
import db from '@/db/drizzle';
import { cryptoAlerts } from '@/db/schema';
import { sendPushNotification } from '@/lib/push';
import { logger } from '@/lib/logger';

interface BinancePriceTicker {
  symbol: string;
  price: string;
}

interface Binance24hrTicker {
  symbol: string;
  priceChangePercent: string;
  lastPrice: string;
}

export async function GET(req: Request) {
  // Protect with secret
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get ALL active alerts across ALL users
    const activeAlerts = await db
      .select()
      .from(cryptoAlerts)
      .where(
        and(
          eq(cryptoAlerts.triggered, false),
          eq(cryptoAlerts.acknowledged, false),
          eq(cryptoAlerts.isActive, true),
        ),
      );

    if (activeAlerts.length === 0) {
      return Response.json({ checked: 0, triggered: 0 });
    }

    const priceAlerts = activeAlerts.filter((a) => !a.alertType || a.alertType === 'price');
    const volatilityAlerts = activeAlerts.filter((a) => a.alertType === 'volatility');
    const triggered: typeof activeAlerts = [];

    // --- Check price alerts ---
    if (priceAlerts.length > 0) {
      const res = await fetch('https://api.binance.com/api/v3/ticker/price');
      if (res.ok) {
        const allPrices: BinancePriceTicker[] = await res.json();
        const priceMap = new Map(allPrices.map((p) => [p.symbol, parseFloat(p.price)]));

        for (const alert of priceAlerts) {
          const currentPrice = priceMap.get(alert.pairSymbol);
          if (currentPrice === undefined) continue;

          const threshold = parseFloat(alert.threshold);
          const currentSide = currentPrice >= threshold ? 'above' : 'below';

          if (currentSide !== alert.initialSide) {
            await db
              .update(cryptoAlerts)
              .set({ triggered: true, triggeredAt: new Date(), triggeredPrice: String(currentPrice) })
              .where(eq(cryptoAlerts.id, alert.id));

            triggered.push({ ...alert, triggeredPrice: String(currentPrice) });
          }
        }
      }
    }

    // --- Check volatility alerts ---
    if (volatilityAlerts.length > 0) {
      const symbols = [...new Set(volatilityAlerts.map((a) => a.pairSymbol))];

      const tickers = await Promise.all(
        symbols.map(async (symbol) => {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
          if (!res.ok) return null;
          return (await res.json()) as Binance24hrTicker;
        }),
      );

      const tickerMap = new Map<string, Binance24hrTicker>();
      for (const t of tickers) {
        if (t) tickerMap.set(t.symbol, t);
      }

      for (const alert of volatilityAlerts) {
        const ticker = tickerMap.get(alert.pairSymbol);
        if (!ticker) continue;

        const changePercent = Math.abs(parseFloat(ticker.priceChangePercent));
        const threshold = parseFloat(alert.threshold);

        if (changePercent >= threshold) {
          await db
            .update(cryptoAlerts)
            .set({ triggered: true, triggeredAt: new Date(), triggeredPrice: ticker.lastPrice })
            .where(eq(cryptoAlerts.id, alert.id));

          triggered.push({ ...alert, triggeredPrice: ticker.lastPrice });
        }
      }
    }

    // --- Send push notifications for triggered alerts ---
    for (const alert of triggered) {
      const price = parseFloat(alert.triggeredPrice || '0');
      const isPrice = !alert.alertType || alert.alertType === 'price';

      await sendPushNotification(alert.userId, {
        title: `${alert.symbol} Alert`,
        body: isPrice
          ? `${alert.symbol} a atteint ${price.toLocaleString('fr-FR')}$ (seuil: ${parseFloat(alert.threshold).toLocaleString('fr-FR')}$)`
          : `${alert.symbol} a bougé de ${price}% en 24h`,
        url: '/dashboard',
      }).catch((err) => logger.error('cron', `Push error for user ${alert.userId}`, err));
    }

    return Response.json({
      checked: activeAlerts.length,
      triggered: triggered.length,
    });
  } catch (error) {
    logger.error('cron', 'Cron check-alerts error', error);
    return Response.json({ error: 'Internal error' }, { status: 500 });
  }
}
