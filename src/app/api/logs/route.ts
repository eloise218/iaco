import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "logs", "app.log");

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const lines = parseInt(request.nextUrl.searchParams.get("lines") || "100", 10);
  const level = request.nextUrl.searchParams.get("level")?.toUpperCase(); // ERROR, WARN, INFO

  try {
    if (!fs.existsSync(LOG_FILE)) {
      return NextResponse.json({ logs: [], message: "No log file yet" });
    }

    const content = fs.readFileSync(LOG_FILE, "utf-8");
    let allLines = content.split("\n").filter(Boolean);

    if (level) {
      allLines = allLines.filter((line) => line.includes(`[${level}]`));
    }

    const lastLines = allLines.slice(-lines);

    return NextResponse.json({
      total: allLines.length,
      showing: lastLines.length,
      logs: lastLines,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read logs", details: String(error) },
      { status: 500 }
    );
  }
}
