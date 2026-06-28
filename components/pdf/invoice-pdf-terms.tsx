import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Invoice } from "~/types";
import { pdfRoleStyle } from "~/utils/pdf-styles";

const styles = StyleSheet.create({
  termsSection: {
    marginTop: 20
  },
  termsTitle: {
    marginBottom: 4,
    fontWeight: "medium",
    fontSize: 12
  },
  termsContent: {
    fontSize: 10,
    color: "#6b7280"
  }
});

export function InvoicePdfTerms({ invoice }: { invoice: Invoice }) {
  const theme = invoice.theme;

  if (!invoice.terms.content) {
    return null;
  }

  return (
    <View style={styles.termsSection}>
      {invoice.terms.label && (
        <Text
          style={{
            ...styles.termsTitle,
            ...pdfRoleStyle(theme, "sectionLabel")
          }}
        >
          {invoice.terms.label}
        </Text>
      )}
      <Text
        style={{
          ...styles.termsContent,
          ...pdfRoleStyle(theme, "termsContent")
        }}
      >
        {invoice.terms.content}
      </Text>
    </View>
  );
}
