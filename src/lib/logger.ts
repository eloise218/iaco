import fs from "fs";
import path from "path";

const MAX_LOG_SIZE = 5 * 1024 * 1024; // 5 Mo
const LOG_DIR = path.join(process.cwd(), "logs");
const LOG_FILE = path.join(LOG_DIR, "app.log");

type LogLevel = "ERROR" | "WARN" | "INFO";

function ensureLogDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  } catch {
    // Silently fail - will fallback to console
  }
}

function rotateIfNeeded() {
  try {
    const stats = fs.statSync(LOG_FILE);
    if (stats.size > MAX_LOG_SIZE) {
      // Keep last 50% of the file
      const content = fs.readFileSync(LOG_FILE, "utf-8");
      const lines = content.split("\n");
      const half = Math.floor(lines.length / 2);
      fs.writeFileSync(LOG_FILE, lines.slice(half).join("\n"));
    }
  } catch {
    // File doesn't exist yet or can't be read - that's fine
  }
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.message}${error.stack ? `\n${error.stack}` : ""}`;
  }
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function writeLog(level: LogLevel, category: string, message: string, error?: unknown) {
  const timestamp = new Date().toISOString();
  const errorStr = error ? ` — ${formatError(error)}` : "";
  const line = `[${timestamp}] [${level}] [${category}] ${message}${errorStr}\n`;

  // Always log to console too
  if (level === "ERROR") {
    console.error(line.trim());
  } else if (level === "WARN") {
    console.warn(line.trim());
  } else {
    console.log(line.trim());
  }

  // Write to file
  try {
    ensureLogDir();
    rotateIfNeeded();
    fs.appendFileSync(LOG_FILE, line);
  } catch {
    // File write failed - console fallback already happened above
  }
}

export const logger = {
  error(category: string, message: string, error?: unknown) {
    writeLog("ERROR", category, message, error);
  },
  warn(category: string, message: string, error?: unknown) {
    writeLog("WARN", category, message, error);
  },
  info(category: string, message: string) {
    writeLog("INFO", category, message);
  },
};
