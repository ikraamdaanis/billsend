import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { invoice } from "db/schema";
import { auth } from "lib/auth";
import { z } from "zod";

const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: z
    .enum(["draft", "sent", "paid", "overdue", "cancelled"])
    .default("draft"),
  lineItems: z.array(
    z.object({
      description: z.string().min(1, "Description is required"),
      quantity: z.number().min(0, "Quantity must be at least 0"),
      unitPrice: z.number().min(0, "Unit price must be at least 0"),
      total: z.number().min(0, "Total must be at least 0")
    })
  ),
  subtotal: z.string(),
  tax: z.string().default("0"),
  total: z.string(),
  currency: z.string().default("GBP"),
  notes: z.string().optional()
});

export const createInvoice = createServerFn({
  method: "POST"
})
  .inputValidator(createInvoiceSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) throw new Error("Unauthorized");

    const validatedData = createInvoiceSchema.parse(data);

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) throw new Error("No organization found");

    const organizationId = organizations[0]?.id;

    if (!organizationId) throw new Error("No organization found");

    const [newInvoice] = await db
      .insert(invoice)
      .values({
        id: crypto.randomUUID(),
        clientId: validatedData.clientId,
        invoiceNumber: validatedData.invoiceNumber,
        invoiceDate: validatedData.invoiceDate,
        dueDate: validatedData.dueDate,
        status: validatedData.status,
        lineItems: validatedData.lineItems,
        subtotal: validatedData.subtotal,
        tax: validatedData.tax,
        total: validatedData.total,
        currency: validatedData.currency,
        notes: validatedData.notes || null,
        organizationId
      })
      .returning();

    return newInvoice;
  });
