"use client";

import {
  Document,
  Font,
  Page,
  pdf,
  Image as PDFImage,
  PDFViewer,
  StyleSheet,
  Text,
  View
} from "@react-pdf/renderer";
import { Button } from "components/ui/button";
import { formatCurrency } from "consts/currencies";
import { getImageBlob } from "features/new/db";
import { imageAtom, invoiceAtom } from "features/new/state";
import type { Invoice } from "features/new/types";
import { getFontWeight } from "features/new/utils/get-font-weight";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { scaleFontSize } from "features/new/utils/scale-font-size";
import { useAtomValue } from "jotai";
import { DownloadIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { memo, useEffect, useMemo, useState, useTransition } from "react";

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

export const InvoicePDF = memo(function InvoicePDF({
  invoice
}: {
  invoice: Invoice;
}) {
  // invoice.image should already be a blob URL or empty string
  const imageUrl = invoice.image || "";
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
      marginBottom: 20
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
            <Text
              style={{
                textAlign: invoice.titleSettings.align,
                fontSize: scaleFontSize(invoice.titleSettings.size),
                fontWeight: getFontWeight(invoice.titleSettings.weight),
                color: invoice.titleSettings.color
              }}
            >
              {invoice.title}
            </Text>
            <View style={styles.sellerInfo}>
              {renderMultilineText(invoice.seller.content, {
                textAlign: invoice.sellerSettings.align,
                fontSize: scaleFontSize(invoice.sellerSettings.size),
                fontWeight: getFontWeight(invoice.sellerSettings.weight),
                color: invoice.sellerSettings.color,
                marginBottom: 2
              })}
            </View>
          </View>
          {!!imageUrl && <PDFImage src={imageUrl} style={styles.logo} />}
        </View>
        <View>
          <Text style={styles.clientTitle}>Bill to:</Text>
        </View>
        <View style={styles.detailsRow}>
          <View style={styles.clientInfo}>
            {renderMultilineText(invoice.client.content, {
              fontSize: scaleFontSize(invoice.clientSettings.size),
              fontWeight: getFontWeight(invoice.clientSettings.weight),
              color: invoice.clientSettings.color,
              marginBottom: 2,
              textAlign: invoice.clientSettings.align
            })}
          </View>
          <View style={styles.invoiceDetails}>
            <View style={styles.detailsField}>
              <Text
                style={{
                  ...styles.detailsLabel,
                  ...getTextStyles({
                    settings: invoice.numberSettings.label,
                    isPdf: true
                  })
                }}
              >
                Invoice number:
              </Text>
              <Text
                style={{
                  ...styles.detailsValue,
                  ...getTextStyles({
                    settings: invoice.numberSettings.value,
                    isPdf: true
                  })
                }}
              >
                {invoice.number}
              </Text>
            </View>
            <View style={styles.detailsField}>
              <Text
                style={{
                  ...styles.detailsLabel,
                  ...getTextStyles({
                    settings: invoice.invoiceDateSettings.label,
                    isPdf: true
                  })
                }}
              >
                Invoice date:
              </Text>
              <Text
                style={{
                  ...styles.detailsValue,
                  ...getTextStyles({
                    settings: invoice.invoiceDateSettings.value,
                    isPdf: true
                  })
                }}
              >
                {invoice.invoiceDate}
              </Text>
            </View>
            <View style={styles.detailsField}>
              <Text
                style={{
                  ...styles.detailsLabel,
                  ...getTextStyles({
                    settings: invoice.dueDateSettings.label,
                    isPdf: true
                  })
                }}
              >
                Payment due:
              </Text>
              <Text
                style={{
                  ...styles.detailsValue,
                  ...getTextStyles({
                    settings: invoice.dueDateSettings.value,
                    isPdf: true
                  })
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
              <Text
                style={{
                  textAlign:
                    invoice.tableSettings.descriptionHeaderSettings.align,
                  fontSize: scaleFontSize(
                    invoice.tableSettings.descriptionHeaderSettings.size
                  ),
                  fontWeight: getFontWeight(
                    invoice.tableSettings.descriptionHeaderSettings.weight
                  ),
                  color: invoice.tableSettings.descriptionHeaderSettings.color
                }}
              >
                {invoice.tableSettings.descriptionHeaderSettings.label}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text
                style={{
                  textAlign: invoice.tableSettings.quantityHeaderSettings.align,
                  fontSize: scaleFontSize(
                    invoice.tableSettings.quantityHeaderSettings.size
                  ),
                  fontWeight: getFontWeight(
                    invoice.tableSettings.quantityHeaderSettings.weight
                  ),
                  color: invoice.tableSettings.quantityHeaderSettings.color
                }}
              >
                {invoice.tableSettings.quantityHeaderSettings.label}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text
                style={{
                  textAlign:
                    invoice.tableSettings.unitPriceHeaderSettings.align,
                  fontSize: scaleFontSize(
                    invoice.tableSettings.unitPriceHeaderSettings.size
                  ),
                  fontWeight: getFontWeight(
                    invoice.tableSettings.unitPriceHeaderSettings.weight
                  ),
                  color: invoice.tableSettings.unitPriceHeaderSettings.color
                }}
              >
                {invoice.tableSettings.unitPriceHeaderSettings.label}
              </Text>
            </View>
            <View style={[styles.tableCell, { width: "20%" }]}>
              <Text
                style={{
                  textAlign: invoice.tableSettings.amountHeaderSettings.align,
                  fontSize: scaleFontSize(
                    invoice.tableSettings.amountHeaderSettings.size
                  ),
                  fontWeight: getFontWeight(
                    invoice.tableSettings.amountHeaderSettings.weight
                  ),
                  color: invoice.tableSettings.amountHeaderSettings.color
                }}
              >
                {invoice.tableSettings.amountHeaderSettings.label}
              </Text>
            </View>
          </View>
          {[...invoice.items].map((item, index) => {
            const isLastItem = index === invoice.items.length - 1;

            return (
              <View
                key={index}
                style={isLastItem ? styles.tableLastRow : styles.tableRow}
              >
                <View style={[styles.tableCell, { width: "40%" }]}>
                  <Text
                    style={{
                      textAlign:
                        invoice.tableSettings.descriptionRowSettings.align,
                      fontSize: scaleFontSize(
                        invoice.tableSettings.descriptionRowSettings.size
                      ),
                      fontWeight: getFontWeight(
                        invoice.tableSettings.descriptionRowSettings.weight
                      ),
                      color: invoice.tableSettings.descriptionRowSettings.color
                    }}
                  >
                    {item.description}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "20%" }]}>
                  <Text
                    style={{
                      textAlign:
                        invoice.tableSettings.quantityRowSettings.align,
                      fontSize: scaleFontSize(
                        invoice.tableSettings.quantityRowSettings.size
                      ),
                      fontWeight: getFontWeight(
                        invoice.tableSettings.quantityRowSettings.weight
                      ),
                      color: invoice.tableSettings.quantityRowSettings.color
                    }}
                  >
                    {item.quantity}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "20%" }]}>
                  <Text
                    style={{
                      textAlign:
                        invoice.tableSettings.unitPriceRowSettings.align,
                      fontSize: scaleFontSize(
                        invoice.tableSettings.unitPriceRowSettings.size
                      ),
                      fontWeight: getFontWeight(
                        invoice.tableSettings.unitPriceRowSettings.weight
                      ),
                      color: invoice.tableSettings.unitPriceRowSettings.color
                    }}
                  >
                    {formatCurrency(item.unitPrice, invoice.currency)}
                  </Text>
                </View>
                <View style={[styles.tableCell, { width: "20%" }]}>
                  <Text
                    style={{
                      textAlign: invoice.tableSettings.amountRowSettings.align,
                      fontSize: scaleFontSize(
                        invoice.tableSettings.amountRowSettings.size
                      ),
                      fontWeight: getFontWeight(
                        invoice.tableSettings.amountRowSettings.weight
                      ),
                      color: invoice.tableSettings.amountRowSettings.color
                    }}
                  >
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
            <Text
              style={{
                ...styles.totalLabel,
                ...getTextStyles({
                  settings: invoice.subtotalSettings.label,
                  isPdf: true
                })
              }}
            >
              Subtotal
            </Text>
            <Text
              style={{
                ...styles.totalValue,
                ...getTextStyles({
                  settings: invoice.subtotalSettings.value,
                  isPdf: true
                })
              }}
            >
              {formatCurrency(invoice.subtotal, invoice.currency)}
            </Text>
          </View>
          {invoice.tax.percentage > 0 && (
            <View style={styles.totalRow}>
              <Text
                style={{
                  ...styles.totalLabel,
                  ...getTextStyles({
                    settings: invoice.taxSettings.label,
                    isPdf: true
                  })
                }}
              >
                Tax {invoice.tax.percentage}%
              </Text>
              <Text
                style={{
                  ...styles.totalValue,
                  ...getTextStyles({
                    settings: invoice.taxSettings.value,
                    isPdf: true
                  })
                }}
              >
                {formatCurrency(invoice.tax.amount, invoice.currency)}
              </Text>
            </View>
          )}
          {invoice.fees > 0 && (
            <View style={styles.totalRow}>
              <Text
                style={{
                  ...styles.totalLabel,
                  ...getTextStyles({
                    settings: invoice.feesSettings.label,
                    isPdf: true
                  })
                }}
              >
                Fees
              </Text>
              <Text
                style={{
                  ...styles.totalValue,
                  ...getTextStyles({
                    settings: invoice.feesSettings.value,
                    isPdf: true
                  })
                }}
              >
                {formatCurrency(invoice.fees, invoice.currency)}
              </Text>
            </View>
          )}
          {invoice.discounts > 0 && (
            <View style={styles.totalRow}>
              <Text
                style={{
                  ...styles.totalLabel,
                  ...getTextStyles({
                    settings: invoice.discountsSettings.label,
                    isPdf: true
                  })
                }}
              >
                Discounts
              </Text>
              <Text
                style={{
                  ...styles.totalValue,
                  ...getTextStyles({
                    settings: invoice.discountsSettings.value,
                    isPdf: true
                  })
                }}
              >
                {formatCurrency(invoice.discounts, invoice.currency)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text
              style={{
                ...styles.totalLabel,
                ...getTextStyles({
                  settings: invoice.totalSettings.label,
                  isPdf: true
                })
              }}
            >
              Total
            </Text>
            <Text
              style={{
                ...styles.totalValue,
                ...getTextStyles({
                  settings: invoice.totalSettings.value,
                  isPdf: true
                })
              }}
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
                  ...getTextStyles({
                    settings: invoice.termsSettings.label,
                    isPdf: true
                  })
                }}
              >
                {invoice.terms.label}
              </Text>
            )}
            <Text
              style={{
                ...styles.termsContent,
                ...getTextStyles({
                  settings: invoice.termsSettings.content,
                  isPdf: true
                })
              }}
            >
              {invoice.terms.content}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  );
});

export function InvoiceGenerator() {
  const invoice = useAtomValue(invoiceAtom);
  const imageId = useAtomValue(imageAtom);
  const [_isPending, startTransition] = useTransition();
  const [key, setKey] = useState(0);
  const [imageUrl, setImageUrl] = useState("");

  // Load image from IndexedDB when imageId changes
  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      if (!imageId) {
        setImageUrl("");
        return;
      }

      // Check if it's already a blob URL or data URL
      if (imageId.startsWith("blob:") || imageId.startsWith("data:")) {
        setImageUrl(imageId);
        return;
      }

      try {
        const blob = await getImageBlob(imageId);
        if (cancelled) return;
        if (blob) {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } else {
          setImageUrl("");
        }
      } catch {
        if (!cancelled) setImageUrl("");
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [imageId]);

  // Update key when invoice or image changes to force PDFViewer remount
  useEffect(() => {
    startTransition(() => {
      setKey(prev => prev + 1);
    });
  }, [invoice, imageUrl]);

  // Create stable invoice with loaded image URL
  const stableInvoice = useMemo(
    () => ({ ...invoice, image: imageUrl }),
    [invoice, imageUrl]
  );

  return (
    <div className="mx-auto flex h-full w-full flex-col overflow-y-scroll border-t-8 border-t-neutral-200 bg-white p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Invoice Preview</div>
        <div className="flex gap-2">
          <Button
            variant="outline"
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
        className="h-full w-full rounded-lg border border-zinc-300 bg-white shadow-md"
      >
        <PDFViewer showToolbar={false} className="h-full w-full">
          <InvoicePDF invoice={stableInvoice} />
        </PDFViewer>
      </div>
    </div>
  );
}
