import { mutation } from "convex/_generated/server";
import { authComponent, createAuth } from "convex/auth";
import { v } from "convex/values";

export const updateUserPassword = mutation({
  args: {
    email: v.string(),
    password: v.string()
  },
  handler: async (ctx, args) => {
    const { auth, headers } = await authComponent.getAuth(createAuth, ctx);

    await auth.api.signUpEmail({
      body: {
        email: args.email,
        password: args.password,
        name: args.email
      },
      headers
    });
  }
});
