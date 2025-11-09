import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { invoice } from "db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { z } from "zod";

const updateInvoiceDesignSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  designSnapshotTemplateId: z.string().nullable(),
  designSnapshotTokens: z.object({
    fontFamily: z.enum(["system", "geist", "inter"]),
    baseTextSize: z.enum(["sm", "md", "lg"]),
    accentColorHex: z.string().min(1),
    spacingScale: z.enum(["compact", "comfortable"]),
    borderStyle: z.enum(["none", "subtle", "strong"]),
    logoPosition: z.enum(["left", "right", "top"]),
    pageSize: z.enum(["A4", "Letter"])
  }),
  designSnapshotVisibility: z.object({
    companyDetails: z.boolean(),
    clientDetails: z.boolean(),
    notes: z.boolean(),
    terms: z.boolean(),
    paymentDetails: z.boolean(),
    taxRow: z.boolean(),
    discountRow: z.boolean(),
    footer: z.boolean()
  }),
  designSnapshotLogoPosition: z.enum(["top", "left", "right"])
});

export const updateInvoiceDesign = createServerFn({
  method: "POST"
})
  .inputValidator(updateInvoiceDesignSchema)
  .handler(async ({ data: updates }) => {
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

    // Verify the invoice belongs to the user's active organization
    const existingInvoice = await db.query.invoice.findFirst({
      where: (invoices, { eq: eqOp, and: andOp }) =>
        andOp(
          eqOp(invoices.id, updates.invoiceId),
          eqOp(invoices.organizationId, organizationId)
        )
    });

    if (!existingInvoice) {
      throw new Error("Invoice not found");
    }

    await db
      .update(invoice)
      .set({
        designSnapshotTemplateId: updates.designSnapshotTemplateId,
        designSnapshotTokens: updates.designSnapshotTokens,
        designSnapshotVisibility: updates.designSnapshotVisibility,
        designSnapshotLogoPosition: updates.designSnapshotLogoPosition,
        designSnapshotTakenAt: new Date(),
        updatedAt: new Date()
      })
      .where(
        and(
          eq(invoice.id, updates.invoiceId),
          eq(invoice.organizationId, organizationId)
        )
      );

    return { success: true };
  });
