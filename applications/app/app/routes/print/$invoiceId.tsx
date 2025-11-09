import { createFileRoute } from "@tanstack/react-router";
import { fetchInvoiceForPrint } from "features/invoices/api/fetch-invoice-for-print";
import { validatePrintToken } from "features/invoices/api/validate-print-token";
import { InvoicePreviewContainer } from "features/invoices/components/invoice-preview-container";
import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type { InvoiceTemplate } from "features/invoices/templates/types";

export const Route = createFileRoute("/print/$invoiceId")({
  component: PrintInvoicePage,
  head: () => ({
    meta: [
      {
        title: "Invoice Print View"
      }
    ]
  }),
  beforeLoad: async ({ params, location }) => {
    const { invoiceId } = params;
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const exp = searchParams.get("exp");

    if (!token) {
      throw new Error("Unauthorized: Missing token");
    }

    await validatePrintToken({
      data: {
        invoiceId,
        token,
        exp: exp ? parseInt(exp, 10) : undefined
      }
    });
  },
  loader: async ({ params }) => {
    const { invoiceId } = params;
    return await fetchInvoiceForPrint({ data: { invoiceId } });
  }
});

function PrintInvoicePage() {
  const loaderData = Route.useLoaderData();

  return <PrintInvoiceContent loaderData={loaderData} />;
}

function PrintInvoiceContent({
  loaderData
}: {
  loaderData: {
    invoice: {
      id: string;
      invoiceNumber: string;
      invoiceDate: Date | string;
      dueDate: Date | string;
      client: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        address: {
          line1?: string;
          line2?: string;
          city?: string;
          country?: string;
          postalCode?: string;
        } | null;
      };
      lineItems: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }> | null;
      subtotal: string;
      tax: string;
      total: string;
      currency: string;
      notes: string | null;
      designSnapshotTemplateId: string | null;
      designSnapshotTokens: InvoiceTemplate["defaultTokens"] | null;
      designSnapshotVisibility: InvoiceTemplate["defaultVisibility"] | null;
    };
    organization: {
      name: string;
      logo: string | null;
    };
    customTemplates: Array<{
      id: string;
      name: string;
      description: string | null;
      tokens: InvoiceTemplate["defaultTokens"];
      visibility: InvoiceTemplate["defaultVisibility"];
    }>;
  };
}) {
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

  return (
    <div className="print-view m-0 bg-white p-0">
      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }
        }
        .print-view {
          height: auto !important;
          min-height: auto !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .print-view > div {
          max-width: 100% !important;
          margin: 0 !important;
        }
        .print-view .invoice-preview-container {
          max-width: 100% !important;
          margin: 0 !important;
          box-shadow: none !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;
          height: auto !important;
        }
        .print-view .invoice-preview-container > div {
          padding: 8mm !important;
          page-break-after: avoid !important;
        }
        .print-view .no-print {
          display: none !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        @page {
          margin: 8mm;
          size: A4;
        }
      `}</style>
      <InvoicePreviewContainer
        invoice={loaderData.invoice as InvoiceQueryResult}
        organization={org}
        template={templateForPreview}
        overrides={{
          templateId: initialTemplateId,
          tokens: designTokens,
          visibility: designVisibility
        }}
      />
    </div>
  );
}
