import { Image as PDFImage, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfMultilineText } from "~/components/pdf/invoice-pdf-text";
import type { Invoice } from "~/types";
import { PDF_ROW_LINE_HEIGHT, pdfRoleStyle } from "~/utils/pdf-styles";

const styles = StyleSheet.create({
  header: {
    // The editor's 8px gap plus the two fields' 1px borders, at the PDF's
    // 0.75 scale.
    marginBottom: 7.5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  headerContent: {
    flex: 1,
    flexDirection: "column",
    gap: 16
  },
  logo: {
    width: 96,
    height: 96,
    objectFit: "cover",
    borderRadius: 4,
    backgroundColor: "#FFF3E8",
    marginLeft: 24
  },
  sellerLabel: {
    fontWeight: "medium",
    fontSize: 12,
    lineHeight: PDF_ROW_LINE_HEIGHT
  }
});

export function InvoicePdfHeader({
  invoice,
  imageUrl
}: {
  invoice: Invoice;
  imageUrl: string;
}) {
  const theme = invoice.theme;

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={pdfRoleStyle(theme, "title")}>{invoice.title}</Text>
        <View>
          {invoice.seller.label && (
            <Text
              style={{
                ...styles.sellerLabel,
                ...pdfRoleStyle(theme, "sectionLabel")
              }}
            >
              {invoice.seller.label}
            </Text>
          )}
          <PdfMultilineText
            text={invoice.seller.content}
            style={pdfRoleStyle(theme, "sectionContent", {
              lineHeight: PDF_ROW_LINE_HEIGHT
            })}
          />
        </View>
      </View>
      {!!imageUrl && <PDFImage src={imageUrl} style={styles.logo} />}
    </View>
  );
}
