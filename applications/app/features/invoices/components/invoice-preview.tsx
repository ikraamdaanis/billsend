import { InvoiceHeader } from "features/invoices/components/design/invoice-header";
import { InvoiceItemsTable } from "features/invoices/components/design/invoice-items-table";
import { InvoiceSections } from "features/invoices/components/design/invoice-sections";
import { InvoiceSummary } from "features/invoices/components/design/invoice-summary";
import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import type {
  InvoiceDesignOverrides,
  InvoiceTemplate,
  InvoiceTemplateTokens
} from "features/invoices/templates/types";
import {
  getFontFamilyClass,
  getSpacingClass,
  getTextSizeClass
} from "features/invoices/utils/utils";
import { cn } from "lib/utils";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

function mergeTokens(
  defaultTokens: InvoiceTemplateTokens,
  overrides?: Partial<InvoiceTemplateTokens>
): InvoiceTemplateTokens {
  return {
    ...defaultTokens,
    ...overrides
  };
}

function mergeVisibility(
  defaultVisibility: InvoiceTemplate["defaultVisibility"],
  overrides?: Partial<InvoiceTemplate["defaultVisibility"]>
): InvoiceTemplate["defaultVisibility"] {
  return {
    ...defaultVisibility,
    ...overrides
  };
}

export function InvoicePreview({
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
  overrides?: InvoiceDesignOverrides;
}) {
  const tokens = mergeTokens(template.defaultTokens, overrides?.tokens);
  const visibility = mergeVisibility(
    template.defaultVisibility,
    overrides?.visibility
  );

  const lineItems = invoice.lineItems || [];
  const subtotal = parseFloat(invoice.subtotal || "0");
  const tax = parseFloat(invoice.tax || "0");
  const total = parseFloat(invoice.total || "0");
  const currency = invoice.currency || "GBP";

  const fontFamilyClass = getFontFamilyClass(tokens.fontFamily);
  const baseTextSizeClass = getTextSizeClass(tokens.baseTextSize);
  const spacingClass = getSpacingClass(tokens.spacingScale);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty(
        "--accent-color",
        tokens.accentColorHex
      );
    }
  }, [tokens.accentColorHex]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "invoice-page w-full text-gray-800",
        fontFamilyClass,
        baseTextSizeClass
      )}
      style={{ "--accent-color": tokens.accentColorHex } as CSSProperties}
    >
      <div className={cn("flex flex-col", spacingClass)}>
        <InvoiceHeader
          organization={organization}
          invoice={{
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate,
            dueDate: invoice.dueDate
          }}
          tokens={tokens}
          visibility={{ companyDetails: visibility.companyDetails }}
        />
        <div
          className={cn(
            "flex flex-col",
            spacingClass === "gap-3" ? "gap-4" : "gap-6"
          )}
        >
          {visibility.clientDetails && (
            <InvoiceSections
              invoice={invoice}
              tokens={tokens}
              visibility={{
                clientDetails: true,
                notes: false,
                terms: false,
                paymentDetails: false,
                footer: false
              }}
            />
          )}
          <InvoiceItemsTable
            lineItems={lineItems}
            currency={currency}
            tokens={tokens}
          />
          <InvoiceSummary
            subtotal={subtotal}
            tax={tax}
            currency={currency}
            total={total}
            tokens={tokens}
            visibility={{
              taxRow: visibility.taxRow,
              discountRow: visibility.discountRow
            }}
          />
          <InvoiceSections
            invoice={invoice}
            tokens={tokens}
            visibility={{
              clientDetails: false,
              notes: visibility.notes,
              terms: visibility.terms,
              paymentDetails: visibility.paymentDetails,
              footer: visibility.footer
            }}
          />
        </div>
      </div>
    </div>
  );
}
