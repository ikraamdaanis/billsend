import { Image as PDFImage, StyleSheet, Text, View } from "@react-pdf/renderer";
import { PdfMultilineText } from "~/components/pdf/invoice-pdf-text";
import type { Invoice } from "~/types";
import { pdfRoleStyle } from "~/utils/pdf-styles";

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
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
  sellerInfo: {
    marginBottom: 4
  },
  sellerLabel: {
    marginBottom: 4,
    fontWeight: "medium",
    fontSize: 12
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
        <View style={styles.sellerInfo}>
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
            style={pdfRoleStyle(theme, "sectionContent", { marginBottom: 2 })}
          />
        </View>
      </View>
      {!!imageUrl && <PDFImage src={imageUrl} style={styles.logo} />}
    </View>
  );
}
