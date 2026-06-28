import { Document, Page, StyleSheet } from "@react-pdf/renderer";
import { InvoicePdfDetails } from "~/components/pdf/invoice-pdf-details";
import { InvoicePdfHeader } from "~/components/pdf/invoice-pdf-header";
import { InvoicePdfItemsTable } from "~/components/pdf/invoice-pdf-items-table";
import { InvoicePdfTerms } from "~/components/pdf/invoice-pdf-terms";
import { InvoicePdfTotals } from "~/components/pdf/invoice-pdf-totals";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import type { Invoice } from "~/types";
import { buildInvoiceViewModel } from "~/utils/build-invoice-view-model";
import { registerInvoicePdfFonts } from "~/utils/register-invoice-pdf-fonts";

registerInvoicePdfFonts();

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  // invoice.image should already be a blob URL or empty string
  const imageUrl = invoice.image || "";
  const baseFont = getInvoiceFontDefinition(invoice.theme.font);
  const { detailRows, lineItems, summaryRows } = buildInvoiceViewModel(invoice);
  const styles = StyleSheet.create({
    page: {
      fontFamily: baseFont.pdfFamily,
      fontSize: 12,
      padding: 40,
      backgroundColor: invoice.pdfSettings.backgroundColor
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <InvoicePdfHeader invoice={invoice} imageUrl={imageUrl} />
        <InvoicePdfDetails invoice={invoice} detailRows={detailRows} />
        <InvoicePdfItemsTable invoice={invoice} lineItems={lineItems} />
        <InvoicePdfTotals invoice={invoice} summaryRows={summaryRows} />
        <InvoicePdfTerms invoice={invoice} />
      </Page>
    </Document>
  );
}
