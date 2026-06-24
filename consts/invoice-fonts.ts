import type { InvoiceFont, TextRole } from "types";

export type InvoiceFontCategory = "sans-serif" | "serif" | "monospace";

export interface InvoiceFontDefinition {
  id: InvoiceFont;
  name: string;
  category: InvoiceFontCategory;
  cssFamily: string;
  pdfFamily: string;
  previewClassName: string;
}

export const INVOICE_FONTS: InvoiceFontDefinition[] = [
  {
    id: "geist",
    name: "Geist",
    category: "sans-serif",
    cssFamily: '"Geist Variable", sans-serif',
    pdfFamily: "Invoice Geist",
    previewClassName: "font-geist"
  },
  {
    id: "inter",
    name: "Inter",
    category: "sans-serif",
    cssFamily: '"Inter Variable", sans-serif',
    pdfFamily: "Invoice Inter",
    previewClassName: "font-sans"
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    category: "sans-serif",
    cssFamily: '"DM Sans Variable", sans-serif',
    pdfFamily: "Invoice DM Sans",
    previewClassName: "font-dm-sans"
  },
  {
    id: "ibm-plex-sans",
    name: "IBM Plex Sans",
    category: "sans-serif",
    cssFamily: '"IBM Plex Sans Variable", sans-serif',
    pdfFamily: "Invoice IBM Plex Sans",
    previewClassName: "font-ibm-plex-sans"
  },
  {
    id: "bricolage-grotesque",
    name: "Bricolage Grotesque",
    category: "sans-serif",
    cssFamily: '"Bricolage Grotesque Variable", sans-serif',
    pdfFamily: "Invoice Bricolage Grotesque",
    previewClassName: "font-bricolage-grotesque"
  },
  {
    id: "lora",
    name: "Lora",
    category: "serif",
    cssFamily: '"Lora Variable", serif',
    pdfFamily: "Invoice Lora",
    previewClassName: "font-lora"
  },
  {
    id: "libre-baskerville",
    name: "Libre Baskerville",
    category: "serif",
    cssFamily: '"Libre Baskerville Variable", serif',
    pdfFamily: "Invoice Libre Baskerville",
    previewClassName: "font-libre-baskerville"
  },
  {
    id: "geist-mono",
    name: "Geist Mono",
    category: "monospace",
    cssFamily: '"Geist Mono Variable", monospace',
    pdfFamily: "Invoice Geist Mono",
    previewClassName: "font-geist-mono"
  },
  {
    id: "jetbrains-mono",
    name: "JetBrains Mono",
    category: "monospace",
    cssFamily: '"JetBrains Mono Variable", monospace',
    pdfFamily: "Invoice JetBrains Mono",
    previewClassName: "font-jetbrains-mono"
  },
  {
    id: "ibm-plex-mono",
    name: "IBM Plex Mono",
    category: "monospace",
    cssFamily: '"IBM Plex Mono", monospace',
    pdfFamily: "Invoice IBM Plex Mono",
    previewClassName: "font-ibm-plex-mono"
  }
];


const NUMBER_FONT_ROLES = new Set<TextRole>([
  "detailValue",
  "tableRowCenter",
  "tableRowRight",
  "totalsValue",
  "grandTotalValue"
]);

export function roleUsesNumberFont(role: TextRole): boolean {
  return NUMBER_FONT_ROLES.has(role);
}

export function getInvoiceFontDefinition(
  fontId: InvoiceFont
): InvoiceFontDefinition {
  return INVOICE_FONTS.find(font => font.id === fontId) ?? INVOICE_FONTS[0];
}

export function resolveInvoiceFont(
  theme: {
    font: InvoiceFont;
    textFontOverride: InvoiceFont | null;
    numberFontOverride: InvoiceFont | null;
  },
  role: TextRole,
  options?: { useNumberFont?: boolean }
): InvoiceFontDefinition {
  const useNumberFont = options?.useNumberFont ?? roleUsesNumberFont(role);
  const fontId = useNumberFont
    ? (theme.numberFontOverride ?? theme.font)
    : (theme.textFontOverride ?? theme.font);

  return getInvoiceFontDefinition(fontId);
}
