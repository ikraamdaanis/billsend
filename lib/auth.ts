import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { db } from "../db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true
  },
  // React Start Cookies must be last
  plugins: [organization(), reactStartCookies()]
});
