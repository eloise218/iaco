import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function resetDatabase() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
  });

  try {
    console.log("🗑️  Dropping all tables...");

    // Disable foreign key checks to allow dropping tables
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    // Get all tables
    const [tables] = await conn.query("SHOW TABLES");
    const tableNames = (tables as any[]).map((t) => Object.values(t)[0]);

    console.log(`Found ${tableNames.length} tables to drop`);

    // Drop each table
    for (const tableName of tableNames) {
      console.log(`  Dropping table: ${tableName}`);
      await conn.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }

    // Re-enable foreign key checks
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("✅ Database reset complete!");
    console.log("ℹ️  Run 'npm run dev' to apply migrations and recreate tables");
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await conn.end();
  }
}

resetDatabase();
