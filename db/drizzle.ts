import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema";

// Create MySQL connection pool
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL!, // mysql://user:pass@host:3306/db
  connectionLimit: Number(process.env.DB_POOL_MAX || 10),
  waitForConnections: true,
  queueLimit: 0,
});

// Create Drizzle instance
const db = drizzle(pool, { 
  schema,
  mode: "default",
 });

export { pool };
export default db;
