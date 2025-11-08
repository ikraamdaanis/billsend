import type { CSSProperties } from "react";
import type {
  InvoiceSectionVisibility,
  InvoiceTemplateTokens
} from "features/invoices/templates/types";

export function getFontFamilyClass(fontFamily: string): string {
  switch (fontFamily) {
    case "system":
      return "font-sans";
    case "geist":
      return "font-geist";
    case "inter":
      return 'font-["Inter",sans-serif]';
    default:
      return "font-sans";
  }
}

export function getTextSizeClass(textSize: string): string {
  switch (textSize) {
    case "sm":
      return "text-sm";
    case "md":
      return "text-base";
    case "lg":
      return "text-lg";
    default:
      return "text-base";
  }
}

export function getSpacingClass(spacing: string): string {
  switch (spacing) {
    case "compact":
      return "gap-3";
    case "comfortable":
      return "gap-5";
    default:
      return "gap-4";
  }
}

export function getBorderColorClass(borderStyle: string): string {
  switch (borderStyle) {
    case "subtle":
      return "border-gray-100";
    case "strong":
      return "border-gray-300";
    default:
      return "border-gray-200";
  }
}

export const textSizeStyles = {
  logoTop: {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl"
  },
  logoSide: {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl"
  },
  invoiceHeading: {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl"
  },
  sectionHeader: {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm"
  },
  body: {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  },
  tableHeader: {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm"
  },
  tableRow: {
    sm: "text-sm",
    md: "text-base",
    lg: "text-base"
  },
  total: {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl"
  },
  footer: {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm"
  }
} as const;

export function getBorderClass(tokens: InvoiceTemplateTokens): string {
  if (tokens.borderStyle === "none") return "";
  const borderColorClass = getBorderColorClass(tokens.borderStyle);
  return tokens.borderStyle === "subtle"
    ? `border ${borderColorClass}`
    : `border-2 ${borderColorClass}`;
}

export function getBorderStyle(
  tokens: InvoiceTemplateTokens
): CSSProperties | undefined {
  if (tokens.borderStyle === "none") return undefined;
  return {
    borderBottomWidth: tokens.borderStyle === "strong" ? "2px" : "1px"
  };
}

