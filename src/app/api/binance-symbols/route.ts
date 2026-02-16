import { NextRequest, NextResponse } from "next/server";

interface BinanceSymbol {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
  status: string;
}

let cachedSymbols: { symbol: string; baseAsset: string }[] = [];
let cacheTimestamp = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

async function fetchBinanceSymbols() {
  const now = Date.now();
  if (cachedSymbols.length > 0 && now - cacheTimestamp < CACHE_TTL) {
    return cachedSymbols;
  }

  const response = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  if (!response.ok) throw new Error("Failed to fetch Binance exchange info");

  const data = await response.json();
  cachedSymbols = data.symbols
    .filter(
      (s: BinanceSymbol) => s.quoteAsset === "USDT" && s.status === "TRADING"
    )
    .map((s: BinanceSymbol) => ({
      symbol: s.symbol,
      baseAsset: s.baseAsset,
    }));

  cacheTimestamp = now;
  return cachedSymbols;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.toUpperCase() || "";

    const symbols = await fetchBinanceSymbols();

    let filtered = symbols;
    if (query) {
      filtered = symbols.filter(
        (s) => s.baseAsset.includes(query) || s.symbol.includes(query)
      );
    }

    return NextResponse.json(filtered.slice(0, 50));
  } catch (error) {
    console.error("Error fetching Binance symbols:", error);
    return NextResponse.json(
      { error: "Failed to fetch symbols" },
      { status: 500 }
    );
  }
}
