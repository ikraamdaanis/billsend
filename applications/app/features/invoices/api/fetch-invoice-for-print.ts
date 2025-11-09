import { createServerFn } from "@tanstack/react-start";
import { db } from "db";
import {
  client,
  invoice as invoiceSchema,
  invoiceTemplate,
  organization
} from "db/schema";
import { and, eq } from "drizzle-orm";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import { z } from "zod";

const validatePrintTokenSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  token: z.string(),
  exp: z.number().optional()
});

export const validatePrintToken = createServerFn({
  method: "POST"
})
  .inputValidator(validatePrintTokenSchema)
  .handler(async ({ data }) => {
    const secret = process.env.PRINT_ROUTE_SECRET;

    if (!secret) {
      throw new Error("PRINT_ROUTE_SECRET not configured");
    }

    // Check expiry if provided
    if (data.exp) {
      const now = Date.now();
      const skew = 60 * 1000; // 1 minute clock skew tolerance
      if (now > data.exp + skew) {
        throw new Error("Unauthorized: Token expired");
      }
    }

    // Verify HMAC signature
    const { createHmac } = await import("node:crypto");
    const message = data.exp ? `${data.invoiceId}.${data.exp}` : data.invoiceId;
    const expectedSignature = createHmac("sha256", secret)
      .update(message)
      .digest("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");

    if (data.token !== expectedSignature) {
      throw new Error("Unauthorized: Invalid token");
    }

    return true;
  });

const fetchInvoiceForPrintSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required")
});

export const fetchInvoiceForPrint = createServerFn({
  method: "POST"
})
  .inputValidator(fetchInvoiceForPrintSchema)
  .handler(async ({ data }) => {
    const invoiceData = await db
      .select({
        invoice: invoiceSchema,
        client,
        organization
      })
      .from(invoiceSchema)
      .innerJoin(client, eq(invoiceSchema.clientId, client.id))
      .innerJoin(
        organization,
        eq(invoiceSchema.organizationId, organization.id)
      )
      .where(eq(invoiceSchema.id, data.invoiceId))
      .limit(1);

    if (!invoiceData.length) {
      throw new Error("Invoice not found");
    }

    const invoiceRecord = invoiceData[0].invoice;
    const clientRecord = invoiceData[0].client;
    const orgRecord = invoiceData[0].organization;

    let customTemplates: Array<{
      id: string;
      name: string;
      description: string | null;
      tokens: InvoiceTemplate["defaultTokens"];
      visibility: InvoiceTemplate["defaultVisibility"];
    }> = [];

    if (invoiceRecord.designSnapshotTemplateId) {
      const template = await db
        .select()
        .from(invoiceTemplate)
        .where(
          and(
            eq(invoiceTemplate.id, invoiceRecord.designSnapshotTemplateId),
            eq(invoiceTemplate.organizationId, invoiceRecord.organizationId)
          )
        )
        .limit(1);

      if (template.length > 0) {
        customTemplates = [
          {
            id: template[0].id,
            name: template[0].name,
            description: template[0].description,
            tokens: template[0].tokens,
            visibility: template[0].visibility
          }
        ];
      }
    }

    return {
      invoice: {
        ...invoiceRecord,
        client: clientRecord
      },
      organization: {
        name: orgRecord.name,
        logo: orgRecord.logo
      },
      customTemplates
    };
  });
