import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { invoice as invoiceSchema } from "db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { z } from "zod";

const generatePrintTokenSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required")
});

export const generatePrintToken = createServerFn({
  method: "POST"
})
  .inputValidator(generatePrintTokenSchema)
  .handler(async ({ data }) => {
    // Authenticate user
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Get user's organizations
    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) {
      throw new Error("No organization found");
    }

    const organizationId = organizations[0]?.id;

    if (!organizationId) {
      throw new Error("No organization found");
    }

    // Verify invoice belongs to user's organization
    const invoiceData = await db
      .select()
      .from(invoiceSchema)
      .where(
        and(
          eq(invoiceSchema.id, data.invoiceId),
          eq(invoiceSchema.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!invoiceData.length) {
      throw new Error("Invoice not found");
    }

    const secret = process.env.PRINT_ROUTE_SECRET;

    if (!secret) {
      throw new Error("PRINT_ROUTE_SECRET not configured");
    }

    // Generate secure token with expiry (5 minutes)
    const exp = Date.now() + 5 * 60 * 1000; // 5 minutes from now
    const message = `${data.invoiceId}.${exp}`;

    // Generate HMAC signature
    const { createHmac } = await import("node:crypto");
    const token = createHmac("sha256", secret)
      .update(message)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    return { token, exp };
  });
