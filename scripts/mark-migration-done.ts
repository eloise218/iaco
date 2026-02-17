import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function markMigrationAsDone() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
  });

  try {
    console.log("🔧 Creating migrations tracking table if not exists...");
    await connection.query(`
      CREATE TABLE IF NOT EXISTS \`__drizzle_migrations\` (
        \`id\` SERIAL PRIMARY KEY,
        \`hash\` text NOT NULL,
        \`created_at\` bigint
      )
    `);

    console.log("✅ Marking migration 0000_aromatic_invaders as applied...");
    await connection.query(`
      INSERT INTO \`__drizzle_migrations\` (\`hash\`, \`created_at\`)
      VALUES ('0000_aromatic_invaders', ?)
    `, [Date.now()]);

    console.log("✅ Migration marked as done successfully!");
  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.log("ℹ️  Migration already marked as done");
    } else {
      console.error("❌ Error:", error);
      throw error;
    }
  } finally {
    await connection.end();
  }
}

markMigrationAsDone();
