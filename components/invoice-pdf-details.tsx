import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfMultilineText } from "~/components/invoice-pdf-text";
import type { Invoice, InvoiceDetailRow } from "~/types";
import { pdfRoleStyle } from "~/utils/pdf-styles";

const styles = StyleSheet.create({
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
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

  return (
    <View style={styles.detailsRow}>
      <View style={styles.clientInfo}>
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
        <PdfMultilineText
          text={invoice.client.content}
          style={pdfRoleStyle(theme, "sectionContent", { marginBottom: 2 })}
        />
      </View>
      <View style={styles.invoiceDetails}>
        {detailRows.map(row => (
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
  );
}
