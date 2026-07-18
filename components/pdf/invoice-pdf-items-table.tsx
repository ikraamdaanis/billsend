import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Invoice, InvoiceLineItemRow } from "~/types";
import { pdfRoleStyle } from "~/utils/pdf-styles";

export function InvoicePdfItemsTable({
  invoice,
  lineItems
}: {
  invoice: Invoice;
  lineItems: InvoiceLineItemRow[];
}) {
  const theme = invoice.theme;
  const styles = StyleSheet.create({
    table: {
      display: "flex",
      width: "100%",
      marginBottom: 20,
      borderWidth: 1,
      borderColor: invoice.tableSettings.borderColor,
      borderRadius: 4,
      overflow: "hidden"
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: invoice.tableSettings.backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: invoice.tableSettings.borderColor
    },
    tableRow: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: invoice.tableSettings.borderColor
    },
    tableLastRow: {
      flexDirection: "row"
    },
    tableCell: {
      padding: 8
    }
  });

  return (
    <View style={styles.table}>
      <View
        style={[
          styles.tableHeader,
          { borderTopLeftRadius: 4, borderTopRightRadius: 4 }
        ]}
      >
        <View style={[styles.tableCell, { width: "34%" }]}>
          <Text style={pdfRoleStyle(theme, "tableHeaderLeft")}>
            {invoice.tableSettings.columnLabels.description}
          </Text>
        </View>
        <View style={[styles.tableCell, { width: "14%" }]}>
          <Text style={pdfRoleStyle(theme, "tableHeaderCenter")}>
            {invoice.tableSettings.columnLabels.quantity}
          </Text>
        </View>
        <View style={[styles.tableCell, { width: "14%" }]}>
          <Text style={pdfRoleStyle(theme, "tableHeaderCenter")}>
            {invoice.tableSettings.columnLabels.unit}
          </Text>
        </View>
        <View style={[styles.tableCell, { width: "19%" }]}>
          <Text style={pdfRoleStyle(theme, "tableHeaderCenter")}>
            {invoice.tableSettings.columnLabels.unitPrice}
          </Text>
        </View>
        <View style={[styles.tableCell, { width: "19%" }]}>
          <Text style={pdfRoleStyle(theme, "tableHeaderRight")}>
            {invoice.tableSettings.columnLabels.amount}
          </Text>
        </View>
      </View>
      {lineItems.map((row, index) => {
        const isLastItem = index === lineItems.length - 1;

        return (
          <View
            key={row.id}
            style={isLastItem ? styles.tableLastRow : styles.tableRow}
          >
            <View style={[styles.tableCell, { width: "34%" }]}>
              <Text style={pdfRoleStyle(theme, "tableRowLeft")}>
                {row.description}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "14%" }]}>
              <Text style={pdfRoleStyle(theme, "tableRowCenter")}>
                {row.quantity}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "14%" }]}>
              <Text style={pdfRoleStyle(theme, "tableRowCenter")}>
                {row.unit}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "19%" }]}>
              <Text style={pdfRoleStyle(theme, "tableRowCenter")}>
                {row.unitPrice}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "19%" }]}>
              <Text style={pdfRoleStyle(theme, "tableRowRight")}>
                {row.amount}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
