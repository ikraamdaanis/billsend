import { InvoicePreview } from "features/invoices/components/invoice-preview";
import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import type { InvoiceTemplate } from "features/invoices/templates/types";
import type { RefObject } from "react";

export function InvoicePreviewContainer({
  previewRef,
  invoice,
  organization,
  template,
  overrides
}: {
  previewRef?: RefObject<HTMLDivElement | null>;
  invoice: InvoiceQueryResult;
  organization: {
    name: string;
    logo?: string | null;
  };
  template: InvoiceTemplate;
  overrides?: Parameters<typeof InvoicePreview>[0]["overrides"];
}) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div
        ref={previewRef}
        className="invoice-preview-container w-full bg-white shadow-sm"
        data-page-size={template.defaultTokens.pageSize}
      >
        <div className="p-4 pb-12 sm:p-8">
          <InvoicePreview
            invoice={invoice}
            organization={organization}
            template={template}
            overrides={overrides}
          />
        </div>
      </div>
      <div className="no-print h-8 shrink-0" />
    </div>
  );
}
