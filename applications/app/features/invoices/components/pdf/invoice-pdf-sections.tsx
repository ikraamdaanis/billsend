import { Text, View } from "@react-pdf/renderer";
import type { PdfStyles } from "features/invoices/utils/pdf-styles";

export function InvoicePdfSections({
  invoice,
  visibility,
  styles
}: {
  invoice: {
    notes?: string | null;
    client: {
      name: string;
      email?: string | null;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        postalCode?: string;
        country?: string;
      } | null;
    };
  };
  visibility: {
    clientDetails: boolean;
    notes: boolean;
    terms: boolean;
    paymentDetails: boolean;
    footer: boolean;
  };
  styles: PdfStyles;
}) {
  return (
    <>
      {visibility.clientDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Bill To:</Text>
          <View style={styles.sectionContent}>
            <Text
              style={{ fontWeight: "600", marginBottom: 4, color: "#111827" }}
            >
              {invoice.client.name}
            </Text>
            {invoice.client.email && (
              <Text style={{ marginBottom: 4, color: "#4b5563" }}>
                {invoice.client.email}
              </Text>
            )}
            {invoice.client.address && (
              <View style={{ color: "#4b5563", lineHeight: 1.6 }}>
                {invoice.client.address.line1 && (
                  <Text>{invoice.client.address.line1}</Text>
                )}
                {invoice.client.address.line2 && (
                  <Text>{invoice.client.address.line2}</Text>
                )}
                <Text>
                  {[
                    invoice.client.address.city,
                    invoice.client.address.postalCode,
                    invoice.client.address.country
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}
      {visibility.notes && invoice.notes && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.sectionHeader}>Notes:</Text>
          <Text style={[styles.sectionContent, { marginTop: 8 }]}>
            {invoice.notes.split("\n").map((line, i) => (
              <Text key={i}>
                {line}
                {i < invoice.notes!.split("\n").length - 1 ? "\n" : ""}
              </Text>
            ))}
          </Text>
        </View>
      )}
      {visibility.terms && (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.sectionHeader}>Terms & Conditions:</Text>
          <Text style={[styles.sectionContent, { marginTop: 8 }]}>
            Payment is due within 30 days of invoice date.
          </Text>
        </View>
      )}
      {visibility.paymentDetails && (
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Payment Details:</Text>
          <Text style={[styles.sectionContent, { marginTop: 8 }]}>
            Please make payment to the account details provided.
          </Text>
        </View>
      )}
      {visibility.footer && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for your business!</Text>
        </View>
      )}
    </>
  );
}
