import { StyleSheet } from "@react-pdf/renderer";
import type { InvoiceTemplateTokens } from "features/invoices/templates/types";

export function getPdfFontFamily(): string {
  // react-pdf only supports system fonts by default
  // All custom fonts map to Helvetica for now
  // To use custom fonts, you need to bundle TTF/OTF files
  return "Helvetica";
}

export function getPdfFontSize(
  textSize: "sm" | "md" | "lg",
  type: keyof typeof textSizeStyles
): number {
  return textSizeStyles[type][textSize];
}

export const textSizeStyles = {
  logoTop: {
    sm: 18,
    md: 22,
    lg: 26
  },
  logoSide: {
    sm: 16,
    md: 18,
    lg: 22
  },
  invoiceHeading: {
    sm: 18,
    md: 22,
    lg: 26
  },
  sectionHeader: {
    sm: 9,
    md: 10,
    lg: 11
  },
  body: {
    sm: 10,
    md: 11,
    lg: 12
  },
  tableHeader: {
    sm: 9,
    md: 10,
    lg: 11
  },
  tableRow: {
    sm: 10,
    md: 11,
    lg: 12
  },
  total: {
    sm: 12,
    md: 14,
    lg: 16
  },
  footer: {
    sm: 9,
    md: 10,
    lg: 11
  }
} as const;

export function getPdfSpacing(spacing: "compact" | "comfortable"): number {
  switch (spacing) {
    case "compact":
      return 12;
    case "comfortable":
      return 20;
    default:
      return 16;
  }
}

export function getPdfBorderColor(
  borderStyle: "none" | "subtle" | "strong"
): string {
  switch (borderStyle) {
    case "subtle":
      return "#f3f4f6";
    case "strong":
      return "#d1d5db";
    default:
      return "#e5e7eb";
  }
}

export function getPdfBorderWidth(
  borderStyle: "none" | "subtle" | "strong"
): number {
  switch (borderStyle) {
    case "strong":
      return 2;
    case "subtle":
      return 1;
    default:
      return 0;
  }
}

export function createPdfStyles(tokens: InvoiceTemplateTokens) {
  const baseFontSize = getPdfFontSize(tokens.baseTextSize, "body");
  const spacing = getPdfSpacing(tokens.spacingScale);
  const borderColor = getPdfBorderColor(tokens.borderStyle);
  const borderWidth = getPdfBorderWidth(tokens.borderStyle);
  const accentColor = tokens.accentColorHex;

  return StyleSheet.create({
    page: {
      padding: 16,
      paddingBottom: 40, // Extra padding at bottom for longer content
      fontFamily: getPdfFontFamily(),
      fontSize: baseFontSize,
      color: "#1f2937"
    },
    container: {
      width: "100%",
      flexDirection: "column"
    },
    header: {
      marginBottom: 12,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      paddingBottom: 12,
      borderBottomWidth: borderWidth,
      borderBottomColor: borderColor,
      ...(borderWidth > 0 && { borderBottomStyle: "solid" })
    },
    logoContainer: {
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: 16
    },
    logoContainerTop: {
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 16
    },
    logoContainerRight: {
      flexDirection: "column",
      alignItems: "flex-end",
      marginBottom: 16
    },
    logo: {
      height: 48,
      width: "auto",
      marginBottom: 8
    },
    logoTop: {
      height: 60,
      width: "auto",
      marginBottom: 8
    },
    companyName: {
      fontWeight: "bold",
      color: accentColor,
      fontSize: getPdfFontSize(tokens.baseTextSize, "logoSide")
    },
    companyNameTop: {
      fontWeight: "bold",
      color: accentColor,
      fontSize: getPdfFontSize(tokens.baseTextSize, "logoTop")
    },
    invoiceTitle: {
      fontWeight: "bold",
      color: accentColor,
      fontSize: getPdfFontSize(tokens.baseTextSize, "invoiceHeading"),
      marginBottom: 8,
      letterSpacing: -0.5
    },
    invoiceNumber: {
      fontSize: 14,
      fontWeight: "bold",
      color: accentColor,
      marginBottom: 6
    },
    invoiceDetails: {
      flexDirection: "column",
      fontSize: 11,
      color: "#4b5563"
    },
    invoiceDetailRow: {
      flexDirection: "row",
      marginBottom: 4
    },
    invoiceDetailLabel: {
      fontWeight: "600",
      marginRight: 4
    },
    section: {
      marginBottom: 0,
      padding: 12,
      backgroundColor:
        tokens.borderStyle === "none" ? "#f9fafb" : "transparent",
      ...(borderWidth > 0 && {
        borderWidth,
        borderColor,
        borderStyle: "solid"
      })
    },
    sectionHeader: {
      fontWeight: "bold",
      color: accentColor,
      fontSize: getPdfFontSize(tokens.baseTextSize, "sectionHeader"),
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.5
    },
    sectionContent: {
      fontSize: getPdfFontSize(tokens.baseTextSize, "body"),
      color: "#374151",
      lineHeight: 1.6
    },
    table: {
      width: "100%",
      marginBottom: 0
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#f9fafb",
      paddingVertical: 8,
      paddingHorizontal: 12,
      ...(borderWidth > 0 && {
        borderBottomWidth: borderWidth,
        borderBottomColor: borderColor,
        borderBottomStyle: "solid"
      })
    },
    tableHeaderCell: {
      fontWeight: "bold",
      color: accentColor,
      fontSize: getPdfFontSize(tokens.baseTextSize, "tableHeader"),
      textTransform: "uppercase",
      letterSpacing: 0.5
    },
    tableRow: {
      flexDirection: "row",
      paddingVertical: 10,
      paddingHorizontal: 12,
      ...(borderWidth > 0 && {
        borderBottomWidth: borderWidth,
        borderBottomColor: borderColor,
        borderBottomStyle: "solid"
      })
    },
    tableRowAlternate: {
      backgroundColor: "#f9fafb"
    },
    tableCell: {
      fontSize: getPdfFontSize(tokens.baseTextSize, "tableRow"),
      color: "#374151"
    },
    tableCellBold: {
      fontSize: getPdfFontSize(tokens.baseTextSize, "tableRow"),
      fontWeight: "600",
      color: "#111827"
    },
    tableCellRight: {
      textAlign: "right"
    },
    tableCellGray: {
      color: "#4b5563"
    },
    summaryContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginBottom: 0
    },
    summaryBox: {
      width: 288,
      flexDirection: "column"
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 3,
      marginBottom: 8,
      fontSize: getPdfFontSize(tokens.baseTextSize, "tableRow")
    },
    summaryLabel: {
      color: "#4b5563"
    },
    summaryValue: {
      fontWeight: "600",
      color: "#111827"
    },
    summaryTotal: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 6,
      paddingTop: 8,
      borderTopWidth: 2,
      borderTopColor: accentColor,
      borderTopStyle: "solid",
      fontWeight: "bold",
      fontSize: getPdfFontSize(tokens.baseTextSize, "total"),
      color: accentColor
    },
    footer: {
      marginTop: spacing * 2,
      paddingTop: spacing * 1.5,
      borderTopWidth: 1,
      borderTopColor: "#e5e7eb",
      borderTopStyle: "solid",
      textAlign: "center",
      fontSize: getPdfFontSize(tokens.baseTextSize, "footer"),
      color: "#6b7280"
    },
    footerText: {
      fontWeight: "600"
    }
  });
}

export type PdfStyles = ReturnType<typeof createPdfStyles>;
