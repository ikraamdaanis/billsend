import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { InvoiceTheme } from "~/types";
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
  content: {
    fontSize: 10,
    color: "#6b7280"
  }
});

// A labelled free-text block (notes, late-payment terms) for the PDF, mirroring
// the terms section. An empty block renders nothing.
export function InvoicePdfTextSection({
  theme,
  label,
  content
}: {
  theme: InvoiceTheme;
  label: string;
  content: string;
}) {
  if (!content.trim()) {
    return null;
  }

  return (
    <View style={styles.section}>
      {label && (
        <Text
          style={{ ...styles.title, ...pdfRoleStyle(theme, "sectionLabel") }}
        >
          {label}
        </Text>
      )}
      <Text
        style={{ ...styles.content, ...pdfRoleStyle(theme, "termsContent") }}
      >
        {content}
      </Text>
    </View>
  );
}
