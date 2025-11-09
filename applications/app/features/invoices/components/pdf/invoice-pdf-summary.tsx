import { Text, View } from "@react-pdf/renderer";
import type { PdfStyles } from "features/invoices/utils/pdf-styles";

export function InvoicePdfSummary({
  subtotal,
  tax,
  currency,
  total,
  visibility,
  styles
}: {
  subtotal: number;
  tax: number;
  currency: string;
  total: number;
  visibility: {
    taxRow: boolean;
    discountRow: boolean;
  };
  styles: PdfStyles;
}) {
  return (
    <View style={styles.summaryContainer}>
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>
            {currency} {subtotal.toFixed(2)}
          </Text>
        </View>
        {visibility.taxRow && tax > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>
              {currency} {tax.toFixed(2)}
            </Text>
          </View>
        )}
        {visibility.discountRow && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.summaryValue}>{currency} 0.00</Text>
          </View>
        )}
        <View style={styles.summaryTotal}>
          <Text>Total</Text>
          <Text>
            {currency} {total.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}
