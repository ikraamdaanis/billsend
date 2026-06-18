import {
  Document,
  Font,
  Page,
  pdf,
  Image as PDFImage,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
import { Button } from "components/ui/button";
import { formatCurrency } from "consts/currencies";
import { useImageLoader } from "hooks/use-image-loader";
import { DownloadIcon } from "lucide-react";
import type { ComponentProps } from "react";
import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  useTransition
} from "react";
import { useInvoiceData } from "stores/invoice-selectors";
import type { Invoice, TextRole } from "types";
import { getRoleSettings } from "utils/get-role-settings";
import { pdfStyle } from "utils/pdf-styles";

// Only register fonts on the client side
if (typeof window !== "undefined") {
  Font.register({
    family: "Geist",
    fonts: [
      {
        src: "/fonts/Geist-Regular.ttf",
        fontWeight: 400
      },
      {
        src: "/fonts/Geist-Medium.ttf",
        fontWeight: 500
      },
      {
        src: "/fonts/Geist-SemiBold.ttf",
        fontWeight: 600
      },
      {
        src: "/fonts/Geist-Bold.ttf",
        fontWeight: 700
      }
    ]
  });
}

// Dynamically import PDFViewer to reduce initial bundle size
const PDFViewer = lazy(() =>
  import("@react-pdf/renderer").then(module => ({
    default: module.PDFViewer
  }))
);

export function InvoicePDF({ invoice }: { invoice: Invoice }) {
  // invoice.image should already be a blob URL or empty string
  const imageUrl = invoice.image || "";
  const theme = invoice.theme;

  function roleStyle(
    role: TextRole,
    overrides?: Record<string, string | number>
  ) {
    return pdfStyle(getRoleSettings(theme, role), overrides);
  }
  const styles = StyleSheet.create({
    page: {
      fontFamily: "Geist",
      fontSize: 12,
      padding: 40,
      backgroundColor: invoice.pdfSettings.backgroundColor
    },
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
    logoPlaceholder: {
      padding: 12,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%"
    },
    logoText: {
      color: "#F97316",
      fontSize: 16,
      textAlign: "center"
    },
    sellerInfo: {
      marginBottom: 4
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
      gap: 40
    },
    clientInfo: {
      flex: 1
    },
    invoiceDetails: {
      flex: 1
    },
    clientTitle: {
      marginBottom: 4,
      fontWeight: "medium",
      fontSize: 12
    },
    detailsField: {
      flexDirection: "row",
      marginBottom: 4,
      alignItems: "center"
    },
    detailsLabel: {
      width: "40%",
      fontSize: 10,
      color: "#6b7280"
    },
    detailsValue: {
      flex: 1
    },
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
    },
    totalSection: {
      marginTop: 20,
      paddingTop: 10,
      alignItems: "flex-end"
    },
    totalRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginBottom: 5,
      width: "40%"
    },
    totalLabel: {
      width: "40%"
    },
    totalValue: {
      width: "60%"
    },
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

  // Helper to render multiline text
  function renderMultilineText(
    text: string,
    textStyle: ComponentProps<typeof Text>["style"]
  ) {
    return text.split("\n").map((line, i) => (
      // @ts-expect-error - Types in react-pdf are not fully compatible
      <Text key={i} style={textStyle}>
        {line}
      </Text>
    ));
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={roleStyle("title")}>{invoice.title}</Text>
            <View style={styles.sellerInfo}>
              {invoice.seller.label && (
                <Text
                  style={{
                    ...styles.clientTitle,
                    ...roleStyle("sectionLabel")
                  }}
                >
                  {invoice.seller.label}
                </Text>
              )}
              {renderMultilineText(
                invoice.seller.content,
                roleStyle("sectionContent", { marginBottom: 2 })
              )}
            </View>
          </View>
          {!!imageUrl && <PDFImage src={imageUrl} style={styles.logo} />}
        </View>
        <View>
          {invoice.client.label && (
            <Text
              style={{
                ...styles.clientTitle,
                ...roleStyle("sectionLabel")
              }}
            >
              {invoice.client.label}
            </Text>
          )}
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.clientInfo}>
            {renderMultilineText(
              invoice.client.content,
              roleStyle("sectionContent", { marginBottom: 2 })
            )}
          </View>
          <View style={styles.invoiceDetails}>
            <View style={styles.detailsField}>
              <Text
                style={{
                  ...styles.detailsLabel,
                  ...roleStyle("detailLabel")
                }}
              >
                Invoice number:
              </Text>
              <Text
                style={{
                  ...styles.detailsValue,
                  ...roleStyle("detailValue")
                }}
              >
                {invoice.number}
              </Text>
            </View>
            <View style={styles.detailsField}>
              <Text
                style={{
                  ...styles.detailsLabel,
                  ...roleStyle("detailLabel")
                }}
              >
                Invoice date:
              </Text>
              <Text
                style={{
                  ...styles.detailsValue,
                  ...roleStyle("detailValue")
                }}
              >
                {invoice.invoiceDate}
              </Text>
            </View>
            <View style={styles.detailsField}>
              <Text
                style={{
                  ...styles.detailsLabel,
                  ...roleStyle("detailLabel")
                }}
              >
                Payment due:
              </Text>
              <Text
                style={{
                  ...styles.detailsValue,
                  ...roleStyle("detailValue")
                }}
              >
                {invoice.dueDate}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.table, { overflow: "hidden" }]}>
          <View
            style={[
              styles.tableHeader,
              { borderTopLeftRadius: 4, borderTopRightRadius: 4 }
            ]}
          >
            <View style={[styles.tableCell, { width: "40%" }]}>
              <Text style={roleStyle("tableHeaderLeft")}>
                {invoice.tableSettings.columnLabels.description}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text style={roleStyle("tableHeaderCenter")}>
                {invoice.tableSettings.columnLabels.quantity}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text style={roleStyle("tableHeaderCenter")}>
                {invoice.tableSettings.columnLabels.unitPrice}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text style={roleStyle("tableHeaderRight")}>
                {invoice.tableSettings.columnLabels.amount}
              </Text>
            </View>
          </View>
          {[...invoice.items].map((item, index) => {
            const isLastItem = index === invoice.items.length - 1;

            return (
              <View
                key={item.id}
                style={isLastItem ? styles.tableLastRow : styles.tableRow}
              >
                <View style={[styles.tableCell, { width: "40%" }]}>
                  <Text style={roleStyle("tableRowLeft")}>
                    {item.description}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "20%" }]}>
                  <Text style={roleStyle("tableRowCenter")}>
                    {item.quantity}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "20%" }]}>
                  <Text style={roleStyle("tableRowCenter")}>
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "20%" }]}>
                  <Text style={roleStyle("tableRowRight")}>
                    {formatCurrency(
                      item.quantity * item.unitPrice,
                      invoice.currency
                    )}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={{ ...styles.totalLabel, ...roleStyle("totalsLabel") }}>
              Subtotal
            </Text>
            <Text style={{ ...styles.totalValue, ...roleStyle("totalsValue") }}>
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
          {invoice.tax.percentage > 0 && (
            <View style={styles.totalRow}>
              <Text
                style={{ ...styles.totalLabel, ...roleStyle("totalsLabel") }}
              >
                Tax {invoice.tax.percentage}%
              </Text>
              <Text
                style={{ ...styles.totalValue, ...roleStyle("totalsValue") }}
              >
                {formatCurrency(invoice.tax.amount, invoice.currency)}
              </Text>
            </View>
          )}
          {invoice.fees > 0 && (
            <View style={styles.totalRow}>
              <Text
                style={{ ...styles.totalLabel, ...roleStyle("totalsLabel") }}
              >
                Fees
              </Text>
              <Text
                style={{ ...styles.totalValue, ...roleStyle("totalsValue") }}
              >
                {formatCurrency(invoice.fees, invoice.currency)}
              </Text>
            </View>
          )}
          {invoice.discounts > 0 && (
            <View style={styles.totalRow}>
              <Text
                style={{ ...styles.totalLabel, ...roleStyle("totalsLabel") }}
              >
                Discounts
              </Text>
              <Text
                style={{ ...styles.totalValue, ...roleStyle("totalsValue") }}
              >
                {formatCurrency(invoice.discounts, invoice.currency)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text
              style={{ ...styles.totalLabel, ...roleStyle("grandTotalLabel") }}
            >
              Total
            </Text>
            <Text
              style={{ ...styles.totalValue, ...roleStyle("grandTotalValue") }}
            >
              {formatCurrency(invoice.total, invoice.currency)}
            </Text>
          </View>
        </View>
        {!!invoice.terms.content && (
          <View style={styles.termsSection}>
            {invoice.terms.label && (
              <Text
                style={{
                  ...styles.termsTitle,
                  ...roleStyle("sectionLabel")
                }}
              >
                {invoice.terms.label}
              </Text>
            )}
            <Text
              style={{
                ...styles.termsContent,
                ...roleStyle("termsContent")
              }}
            >
              {invoice.terms.content}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export function InvoiceGenerator() {
  const invoice = useInvoiceData();
  const imageUrl = useImageLoader(invoice.image);

  const [_isPending, startTransition] = useTransition();
  const [key, setKey] = useState(0);

  // Create stable invoice with loaded image URL
  const stableInvoice = useMemo(
    () => ({ ...invoice, image: imageUrl }),
    [invoice, imageUrl]
  );

  // Update key when invoice or image changes to force PDFViewer remount
  useEffect(() => {
    startTransition(() => {
      setKey(prev => prev + 1);
    });
  }, [invoice, imageUrl]);

  return (
    <div className="mx-auto flex h-full w-full flex-col overflow-y-scroll border-t-8 border-t-neutral-200 bg-white p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Invoice Preview</div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              const blob = pdf(<InvoicePDF invoice={stableInvoice} />).toBlob();
              blob.then(blobData => {
                const url = URL.createObjectURL(blobData);
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.click();
                // Don't revoke URL immediately to allow tab to load
                setTimeout(() => URL.revokeObjectURL(url), 1000);
              });
            }}
          >
            <DownloadIcon className="h-4 w-4" />
            Open PDF
          </Button>
        </div>
      </div>
      <div
        key={key}
        className="h-full w-full rounded-md border border-zinc-300 bg-white shadow-md"
      >
        <Suspense>
          <PDFViewer showToolbar={false} className="h-full w-full">
            <InvoicePDF invoice={stableInvoice} />
          </PDFViewer>
        </Suspense>
      </div>
    </div>
  );
}
