import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { migrate } from "drizzle-orm/mysql2/migrator";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

/**
 * Run database migrations automatically
 * This function is called on server startup to ensure the database schema is up to date
 */
export async function runMigrations() {
  // Only run migrations in development or if explicitly enabled
  const shouldRunMigrations =
    process.env.NODE_ENV === "development" ||
    process.env.RUN_MIGRATIONS === "true";

  if (!shouldRunMigrations) {
    console.log("⏩ Skipping migrations (not in development mode)");
    return;
  }

  console.log("🔄 Running database migrations...");

  let connection: mysql.Connection | undefined;

  try {
    // Create a dedicated connection for migrations
    connection = await mysql.createConnection({
      uri: process.env.DATABASE_URL!,
    });

    const db = drizzle(connection);

    // Run migrations from the drizzle folder
    await migrate(db, { migrationsFolder: "./drizzle" });

    console.log("✅ Database migrations completed successfully");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    // Don't throw in production to prevent server crash
    if (process.env.NODE_ENV === "development") {
      throw error;
    }
  } finally {
    // Close the connection
    await connection?.end();
  }
}
