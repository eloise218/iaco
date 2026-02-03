import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },    //"mysql://root:password@172.22.80.1:3306/iaco_db"
    //"postgresql://postgres:postgres@172.22.80.1:5432/drizzle_db",
} satisfies Config;
