import { Document, Page } from "@react-pdf/renderer";
import { InvoicePdfPreview } from "features/invoices/components/pdf/invoice-pdf-preview";
import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import type { InvoiceTemplate } from "features/invoices/templates/types";

export function InvoicePdfDocument({
  invoice,
  organization,
  template,
  overrides
}: {
  invoice: InvoiceQueryResult;
  organization: {
    name: string;
    logo?: string | null;
  };
  template: InvoiceTemplate;
  overrides?: {
    templateId: string;
    tokens?: Partial<InvoiceTemplate["defaultTokens"]>;
    visibility?: Partial<InvoiceTemplate["defaultVisibility"]>;
  };
}) {
  // Use standard A4/Letter size
  // React-PDF will automatically create pages as content extends
  // Short content = single A4/Letter page (no extra space)
  // Long content = multiple pages (standard PDF behavior)
  const pageSize =
    template.defaultTokens.pageSize === "Letter" ? "LETTER" : "A4";

  return (
    <Document>
      <Page size={pageSize} style={{ padding: 0 }}>
        <InvoicePdfPreview
          invoice={invoice}
          organization={organization}
          template={template}
          overrides={overrides}
        />
      </Page>
    </Document>
  );
}
