import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { invoice } from "db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { z } from "zod";

const fetchInvoicesByClientIdSchema = z.object({
  clientId: z.string().min(1, "Client ID is required")
});

export const fetchInvoicesByClientId = createServerFn({
  method: "POST"
})
  .inputValidator(fetchInvoicesByClientIdSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) throw new Error("Unauthorized");

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) return [];

    const organizationId = organizations[0]?.id;

    if (!organizationId) return [];

    const invoices = await db
      .select()
      .from(invoice)
      .where(
        and(
          eq(invoice.clientId, data.clientId),
          eq(invoice.organizationId, organizationId)
        )
      );

    return invoices;
  });

