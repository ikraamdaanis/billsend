import type { DocumentProps } from "@react-pdf/renderer";
import { renderToBuffer } from "@react-pdf/renderer";
import { fetchInvoiceForPrint } from "features/invoices/api/fetch-invoice-for-print";
import { InvoicePdfDocument } from "features/invoices/components/pdf/invoice-pdf-document";
import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import type { Buffer } from "node:buffer";
import type { ReactElement } from "react";
import { createElement } from "react";

export async function generatePdfReact(invoiceId: string): Promise<Buffer> {
  // Fetch invoice data
  const loaderData = await fetchInvoiceForPrint({ data: { invoiceId } });

  const { invoice, organization: org, customTemplates } = loaderData;

  // Get template (either from defaults or custom templates)
  const getTemplate = (templateId: string): InvoiceTemplate => {
    if (templateId in INVOICE_TEMPLATES) {
      return INVOICE_TEMPLATES[templateId as keyof typeof INVOICE_TEMPLATES];
    }

    const customTemplate = customTemplates.find(t => t.id === templateId);
    if (customTemplate) {
      return {
        id: customTemplate.id,
        name: customTemplate.name,
        description: customTemplate.description || "",
        defaultTokens: customTemplate.tokens,
        defaultVisibility: customTemplate.visibility
      };
    }

    return INVOICE_TEMPLATES.classic;
  };

  // Determine template from invoice snapshot or default
  const initialTemplateId = invoice.designSnapshotTemplateId || "classic";
  const selectedTemplate = getTemplate(initialTemplateId);

  // Get tokens/visibility from invoice snapshot or template defaults
  const designTokens =
    invoice.designSnapshotTokens || selectedTemplate.defaultTokens;
  const designVisibility =
    invoice.designSnapshotVisibility || selectedTemplate.defaultVisibility;

  const templateForPreview: InvoiceTemplate = {
    ...selectedTemplate,
    defaultTokens: designTokens,
    defaultVisibility: designVisibility
  };

  // Generate PDF using react-pdf
  const pdfElement = createElement(InvoicePdfDocument, {
    invoice: invoice as InvoiceQueryResult,
    organization: org,
    template: templateForPreview,
    overrides: {
      templateId: initialTemplateId,
      tokens: designTokens,
      visibility: designVisibility
    }
  });

  // renderToBuffer expects a Document element, cast to satisfy type checker
  // InvoicePdfDocument returns a Document component, so this is safe at runtime
  const pdfBuffer = (await renderToBuffer(
    pdfElement as ReactElement<DocumentProps>
  )) as Buffer;

  return pdfBuffer;
}
