import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";
import { eq } from "drizzle-orm";
// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { member } from "../db/schema";
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
  databaseHooks: {
    session: {
      create: {
        before: async session => {
          if (session.userId) {
            // Get user's organizations
            const members = await db
              .select({ organizationId: member.organizationId })
              .from(member)
              .where(eq(member.userId, session.userId))
              .limit(1);

            if (members.length === 1) {
              return {
                data: {
                  ...session,
                  activeOrganizationId: members[0].organizationId
                }
              };
            }
          }
          return { data: session };
        }
      }
    }
  },

  // React Start Cookies must be last
  plugins: [organization(), reactStartCookies()]
});
