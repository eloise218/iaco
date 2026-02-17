/**
 * Next.js Instrumentation File
 * This file runs once when the Next.js server starts
 * Used to initialize services and run database migrations
 */

export async function register() {
  // Only run on the server, not in edge runtime
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("./db/migrate");

    try {
      await runMigrations();
    } catch (error) {
      console.error("Failed to run migrations on startup:", error);
    }
  }
}
