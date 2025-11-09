import { View } from "@react-pdf/renderer";
import { InvoicePdfHeader } from "features/invoices/components/pdf/invoice-pdf-header";
import { InvoicePdfItemsTable } from "features/invoices/components/pdf/invoice-pdf-items-table";
import { InvoicePdfSections } from "features/invoices/components/pdf/invoice-pdf-sections";
import { InvoicePdfSummary } from "features/invoices/components/pdf/invoice-pdf-summary";
import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import type {
  InvoiceDesignOverrides,
  InvoiceTemplate
} from "features/invoices/templates/types";
import { createPdfStyles } from "features/invoices/utils/pdf-styles";

function mergeTokens(
  defaultTokens: InvoiceTemplate["defaultTokens"],
  overrides?: Partial<InvoiceTemplate["defaultTokens"]>
): InvoiceTemplate["defaultTokens"] {
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

export function InvoicePdfPreview({
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

  const styles = createPdfStyles(tokens);

  const lineItems = invoice.lineItems || [];
  const subtotal = parseFloat(invoice.subtotal || "0");
  const tax = parseFloat(invoice.tax || "0");
  const total = parseFloat(invoice.total || "0");
  const currency = invoice.currency || "GBP";

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        <InvoicePdfHeader
          organization={organization}
          invoice={{
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: invoice.invoiceDate,
            dueDate: invoice.dueDate
          }}
          tokens={tokens}
          visibility={{ companyDetails: visibility.companyDetails }}
          styles={styles}
        />
        <View style={{ flexDirection: "column" }}>
          {visibility.clientDetails && (
            <View style={{ marginBottom: 8 }}>
              <InvoicePdfSections
                invoice={invoice}
                visibility={{
                  clientDetails: true,
                  notes: false,
                  terms: false,
                  paymentDetails: false,
                  footer: false
                }}
                styles={styles}
              />
            </View>
          )}
          <View style={{ marginBottom: 8 }}>
            <InvoicePdfItemsTable
              lineItems={lineItems}
              currency={currency}
              styles={styles}
            />
          </View>
          <View style={{ marginBottom: 8 }}>
            <InvoicePdfSummary
              subtotal={subtotal}
              tax={tax}
              currency={currency}
              total={total}
              visibility={{
                taxRow: visibility.taxRow,
                discountRow: visibility.discountRow
              }}
              styles={styles}
            />
          </View>
          <InvoicePdfSections
            invoice={invoice}
            visibility={{
              clientDetails: false,
              notes: visibility.notes,
              terms: visibility.terms,
              paymentDetails: visibility.paymentDetails,
              footer: visibility.footer
            }}
            styles={styles}
          />
        </View>
      </View>
    </View>
  );
}
