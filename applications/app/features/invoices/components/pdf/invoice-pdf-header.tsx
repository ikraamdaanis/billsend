import { Image, Text, View } from "@react-pdf/renderer";
import dayjs from "dayjs";
import type { InvoiceTemplateTokens } from "features/invoices/templates/types";
import type { PdfStyles } from "features/invoices/utils/pdf-styles";

export function InvoicePdfHeader({
  organization,
  invoice,
  tokens,
  visibility,
  styles
}: {
  organization: {
    name: string;
    logo?: string | null;
  };
  invoice: {
    invoiceNumber: string;
    invoiceDate: Date | string;
    dueDate: Date | string;
  };
  tokens: InvoiceTemplateTokens;
  visibility: {
    companyDetails: boolean;
  };
  styles: PdfStyles;
}) {
  function formatDate(date: Date | string) {
    return dayjs(date).format("YYYY-MM-DD");
  }

  return (
    <>
      {tokens.logoPosition === "top" && (
        <View style={styles.logoContainerTop}>
          {organization.logo && (
            <Image src={organization.logo} style={styles.logoTop} />
          )}
          <Text style={styles.companyNameTop}>{organization.name}</Text>
        </View>
      )}
      {(tokens.logoPosition === "left" || tokens.logoPosition === "right") && (
        <View
          style={
            tokens.logoPosition === "right"
              ? styles.logoContainerRight
              : styles.logoContainer
          }
        >
          {organization.logo && (
            <Image src={organization.logo} style={styles.logo} />
          )}
          <Text style={styles.companyName}>{organization.name}</Text>
        </View>
      )}
      <View style={styles.header}>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          {visibility.companyDetails && (
            <View style={{ flexDirection: "column", marginTop: 8 }}>
              <Text
                style={{ fontWeight: "600", fontSize: 11, color: "#111827" }}
              >
                {organization.name}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Text style={styles.invoiceNumber}>
            Invoice #{invoice.invoiceNumber}
          </Text>
          <View style={styles.invoiceDetails}>
            <View style={styles.invoiceDetailRow}>
              <Text style={styles.invoiceDetailLabel}>Date:</Text>
              <Text>{formatDate(invoice.invoiceDate)}</Text>
            </View>
            <View style={styles.invoiceDetailRow}>
              <Text style={styles.invoiceDetailLabel}>Due:</Text>
              <Text>{formatDate(invoice.dueDate)}</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
