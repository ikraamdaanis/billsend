import type {
  InvoiceSectionVisibility,
  InvoiceTemplate,
  InvoiceTemplateTokens
} from "features/invoices/templates/types";

const classicTokens: InvoiceTemplateTokens = {
  fontFamily: "geist",
  baseTextSize: "md",
  accentColorHex: "#1e40af",
  spacingScale: "comfortable",
  borderStyle: "strong",
  logoPosition: "left",
  pageSize: "A4"
};

const classicVisibility: InvoiceSectionVisibility = {
  companyDetails: true,
  clientDetails: true,
  notes: true,
  terms: true,
  paymentDetails: false,
  taxRow: true,
  discountRow: false,
  footer: true
};

const modernTokens: InvoiceTemplateTokens = {
  fontFamily: "inter",
  baseTextSize: "lg",
  accentColorHex: "#3b82f6",
  spacingScale: "comfortable",
  borderStyle: "subtle",
  logoPosition: "top",
  pageSize: "A4"
};

const modernVisibility: InvoiceSectionVisibility = {
  companyDetails: true,
  clientDetails: true,
  notes: true,
  terms: true,
  paymentDetails: true,
  taxRow: true,
  discountRow: true,
  footer: true
};

const minimalTokens: InvoiceTemplateTokens = {
  fontFamily: "system",
  baseTextSize: "sm",
  accentColorHex: "#64748b",
  spacingScale: "compact",
  borderStyle: "none",
  logoPosition: "top",
  pageSize: "A4"
};

const minimalVisibility: InvoiceSectionVisibility = {
  companyDetails: false,
  clientDetails: true,
  notes: false,
  terms: false,
  paymentDetails: false,
  taxRow: true,
  discountRow: false,
  footer: false
};

export const INVOICE_TEMPLATES: Record<string, InvoiceTemplate> = {
  classic: {
    id: "classic",
    name: "Classic",
    description:
      "Traditional formal layout with strong borders and left-aligned logo",
    defaultTokens: classicTokens,
    defaultVisibility: classicVisibility
  },
  modern: {
    id: "modern",
    name: "Modern",
    description:
      "Contemporary design with larger text, subtle borders, and centred logo",
    defaultTokens: modernTokens,
    defaultVisibility: modernVisibility
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    description:
      "Ultra-clean design with compact spacing, no borders, and essential sections only",
    defaultTokens: minimalTokens,
    defaultVisibility: minimalVisibility
  }
};
