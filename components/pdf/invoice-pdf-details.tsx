import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfMultilineText } from "~/components/pdf/invoice-pdf-text";
import type { Invoice, InvoiceDetailRow } from "~/types";
import { pdfRoleStyle } from "~/utils/pdf-styles";

const styles = StyleSheet.create({
  detailsSection: {
    marginBottom: 20
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40
  },
  clientInfo: {
    flex: 1
  },
  invoiceDetails: {
    flex: 1
  },
  clientLabel: {
    marginBottom: 4,
    fontWeight: "medium",
    fontSize: 12
  },
  shippingBlock: {
    marginTop: 12
  },
  detailsField: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "center"
  },
  detailsLabel: {
    width: "40%",
    fontSize: 10,
    color: "#6b7280"
  },
  detailsValue: {
    flex: 1
  }
});

export function InvoicePdfDetails({
  invoice,
  detailRows
}: {
  invoice: Invoice;
  detailRows: InvoiceDetailRow[];
}) {
  const theme = invoice.theme;
  const hasShipping = invoice.shipping.content.trim().length > 0;
  // Optional detail rows (PO number, service period) only appear once filled;
  // the always-present rows (number, dates) render even when blank.
  const visibleDetailRows = detailRows.filter(
    row => !row.isOptional || row.value.trim().length > 0
  );

  return (
    <View style={styles.detailsSection}>
      {invoice.client.label && (
        <Text
          style={{
            ...styles.clientLabel,
            ...pdfRoleStyle(theme, "sectionLabel")
          }}
        >
          {invoice.client.label}
        </Text>
      )}
      <View style={styles.detailsRow}>
        <View style={styles.clientInfo}>
          <PdfMultilineText
            text={invoice.client.content}
            style={pdfRoleStyle(theme, "sectionContent", { marginBottom: 2 })}
          />
          {hasShipping && (
            <View style={styles.shippingBlock}>
              {invoice.shipping.label && (
                <Text
                  style={{
                    ...styles.clientLabel,
                    ...pdfRoleStyle(theme, "sectionLabel")
                  }}
                >
                  {invoice.shipping.label}
                </Text>
              )}
              <PdfMultilineText
                text={invoice.shipping.content}
                style={pdfRoleStyle(theme, "sectionContent", {
                  marginBottom: 2
                })}
              />
            </View>
          )}
        </View>
        <View style={styles.invoiceDetails}>
          {visibleDetailRows.map(row => (
            <View key={row.id} style={styles.detailsField}>
              <Text
                style={{
                  ...styles.detailsLabel,
                  ...pdfRoleStyle(theme, "detailLabel")
                }}
              >
                {row.label}
              </Text>
              <Text
                style={{
                  ...styles.detailsValue,
                  ...pdfRoleStyle(theme, "detailValue")
                }}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
