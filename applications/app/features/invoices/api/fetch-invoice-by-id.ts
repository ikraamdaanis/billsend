import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { client, invoice } from "db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { z } from "zod";

const fetchInvoiceByIdSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required")
});

export const fetchInvoiceById = createServerFn({
  method: "POST"
})
  .inputValidator(fetchInvoiceByIdSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) throw new Error("Unauthorized");

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) throw new Error("No organization found");

    const organizationId = organizations[0]?.id;

    if (!organizationId) throw new Error("No organization found");

    const invoiceData = await db
      .select({
        invoice,
        client
      })
      .from(invoice)
      .innerJoin(client, eq(invoice.clientId, client.id))
      .where(
        and(
          eq(invoice.id, data.invoiceId),
          eq(invoice.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!invoiceData.length) throw new Error("Invoice not found");

    return {
      ...invoiceData[0].invoice,
      client: invoiceData[0].client
    };
  });
