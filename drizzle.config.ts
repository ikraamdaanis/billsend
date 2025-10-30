import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error("DATABASE_URL is not set");

export default defineConfig({
  out: "./db",
  schema: "./db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: connectionString }
});
