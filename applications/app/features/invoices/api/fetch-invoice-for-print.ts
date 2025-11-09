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
