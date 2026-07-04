import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Invoice } from "~/types";
import { pdfRoleStyle } from "~/utils/pdf-styles";
import { SCALE_FACTOR } from "~/utils/scale-font-size";

const styles = StyleSheet.create({
  section: {
    marginTop: 20
  },
  fields: {
    marginTop: 6,
    flexDirection: "column",
    gap: 3
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  fieldLabel: {
    width: 96,
    flexShrink: 0
  },
  fieldValue: {
    flex: 1
  },
  terms: {
    marginTop: 6
  }
});

const FIELDS = [
  { key: "bankName", label: "Bank name" },
  { key: "accountNumber", label: "Account number" },
  { key: "iban", label: "IBAN" },
  { key: "bic", label: "BIC / SWIFT" },
  { key: "sortCode", label: "Sort code" }
] as const;

export function InvoicePdfPaymentDetails({ invoice }: { invoice: Invoice }) {
  const { theme, paymentDetails } = invoice;
  const rows = FIELDS.filter(field => paymentDetails[field.key].trim());

  if (rows.length === 0 && !paymentDetails.terms.trim()) {
    return null;
  }

  // The editor renders each label as a plain `text-sm text-zinc-500` span (a
  // fixed 14px that never scales with the theme). Scale it to PDF without the
  // rounding scaleFontSize applies: rounding 10.5 up to 11 would swallow the
  // gap to the section heading (11pt on medium, 12pt on large), which the
  // editor keeps because its heading scales while the label stays 14px.
  const labelStyle = pdfRoleStyle(theme, "termsContent", {
    ...styles.fieldLabel,
    fontSize: 14 * SCALE_FACTOR,
    fontWeight: 400,
    color: "#71717a"
  });
  const valueStyle = pdfRoleStyle(theme, "termsContent", styles.fieldValue);

  return (
    <View style={styles.section}>
      {paymentDetails.label && (
        <Text style={pdfRoleStyle(theme, "sectionLabel")}>
          {paymentDetails.label}
        </Text>
      )}
      {rows.length > 0 && (
        <View style={styles.fields}>
          {rows.map(field => (
            <View key={field.key} style={styles.field}>
              <Text style={labelStyle}>{field.label}</Text>
              <Text style={valueStyle}>{paymentDetails[field.key]}</Text>
            </View>
          ))}
        </View>
      )}
      {paymentDetails.terms && (
        <Text style={pdfRoleStyle(theme, "termsContent", styles.terms)}>
          {paymentDetails.terms}
        </Text>
      )}
    </View>
  );
}
