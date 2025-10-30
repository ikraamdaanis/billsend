import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) throw new Error("DATABASE_URL is not set");

export const db = drizzle(connectionString, { schema });
