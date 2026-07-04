import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Invoice } from "~/types";
import { pdfRoleStyle } from "~/utils/pdf-styles";

const styles = StyleSheet.create({
  section: {
    marginTop: 20
  },
  title: {
    marginBottom: 4,
    fontWeight: "medium",
    fontSize: 12
  },
  row: {
    fontSize: 10,
    color: "#6b7280"
  },
  fieldLabel: {
    color: "#374151"
  }
});

const FIELDS = [
  { key: "bankName", label: "Bank name" },
  { key: "accountNumber", label: "Account number" },
  { key: "iban", label: "IBAN" },
  { key: "sortCode", label: "Sort code" }
] as const;

export function InvoicePdfPaymentDetails({ invoice }: { invoice: Invoice }) {
  const theme = invoice.theme;
  const { paymentDetails } = invoice;
  const rows = FIELDS.filter(field => paymentDetails[field.key].trim());

  if (rows.length === 0 && !paymentDetails.terms.trim()) {
    return null;
  }

  return (
    <View style={styles.section}>
      {paymentDetails.label && (
        <Text
          style={{
            ...styles.title,
            ...pdfRoleStyle(theme, "sectionLabel")
          }}
        >
          {paymentDetails.label}
        </Text>
      )}
      {rows.map(field => (
        <Text
          key={field.key}
          style={{
            ...styles.row,
            ...pdfRoleStyle(theme, "termsContent")
          }}
        >
          <Text style={styles.fieldLabel}>{field.label}: </Text>
          {paymentDetails[field.key]}
        </Text>
      ))}
      {paymentDetails.terms && (
        <Text
          style={{
            ...styles.row,
            ...pdfRoleStyle(theme, "termsContent")
          }}
        >
          {paymentDetails.terms}
        </Text>
      )}
    </View>
  );
}
