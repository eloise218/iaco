import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkTables() {
  const conn = await mysql.createConnection({
    uri: process.env.DATABASE_URL!,
  });

  const [tables] = await conn.query("SHOW TABLES");
  console.log("Tables existantes:");
  (tables as any[]).forEach((t) => console.log("  -", Object.values(t)[0]));

  await conn.end();
}

checkTables();
