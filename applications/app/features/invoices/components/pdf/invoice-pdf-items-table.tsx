import { Text, View } from "@react-pdf/renderer";
import type { PdfStyles } from "features/invoices/utils/pdf-styles";

export function InvoicePdfItemsTable({
  lineItems,
  currency,
  styles
}: {
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  currency: string;
  styles: PdfStyles;
}) {
  // Table column widths (total page width minus padding = ~730px)
  const colWidths = {
    description: 350,
    quantity: 100,
    unitPrice: 140,
    total: 140
  };

  return (
    <View style={styles.table}>
      {/* Table Header */}
      <View style={styles.tableHeader}>
        <View style={{ width: colWidths.description }}>
          <Text style={styles.tableHeaderCell}>Description</Text>
        </View>
        <View style={{ width: colWidths.quantity }}>
          <Text style={[styles.tableHeaderCell, { textAlign: "right" }]}>
            Quantity
          </Text>
        </View>
        <View style={{ width: colWidths.unitPrice }}>
          <Text style={[styles.tableHeaderCell, { textAlign: "right" }]}>
            Unit Price
          </Text>
        </View>
        <View style={{ width: colWidths.total }}>
          <Text style={[styles.tableHeaderCell, { textAlign: "right" }]}>
            Total
          </Text>
        </View>
      </View>
      {/* Table Rows */}
      {lineItems.map((item, index) => (
        <View
          key={index}
          style={[
            styles.tableRow,
            index % 2 !== 0 ? styles.tableRowAlternate : {}
          ]}
        >
          <View style={{ width: colWidths.description }}>
            <Text style={styles.tableCellBold}>{item.description}</Text>
          </View>
          <View style={{ width: colWidths.quantity }}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellRight,
                styles.tableCellGray
              ]}
            >
              {item.quantity}
            </Text>
          </View>
          <View style={{ width: colWidths.unitPrice }}>
            <Text
              style={[
                styles.tableCell,
                styles.tableCellRight,
                styles.tableCellGray
              ]}
            >
              {currency} {item.unitPrice.toFixed(2)}
            </Text>
          </View>
          <View style={{ width: colWidths.total }}>
            <Text style={[styles.tableCell, styles.tableCellRight]}>
              {currency} {item.total.toFixed(2)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
