export type InvoiceTemplateId = "classic" | "modern" | "minimal";

export interface InvoiceSectionVisibility {
  companyDetails: boolean;
  clientDetails: boolean;
  notes: boolean;
  terms: boolean;
  paymentDetails: boolean;
  taxRow: boolean;
  discountRow: boolean;
  footer: boolean;
}

export interface InvoiceTemplateTokens {
  fontFamily: "system" | "geist" | "inter";
  baseTextSize: "sm" | "md" | "lg";
  accentColorHex: string;
  spacingScale: "compact" | "comfortable";
  borderStyle: "none" | "subtle" | "strong";
  logoPosition: "left" | "right" | "top";
  pageSize: "A4" | "Letter";
}

export interface InvoiceTemplate {
  id: InvoiceTemplateId;
  name: string;
  description: string;
  defaultTokens: InvoiceTemplateTokens;
  defaultVisibility: InvoiceSectionVisibility;
}

export interface InvoiceDesignOverrides {
  templateId: InvoiceTemplateId;
  tokens?: Partial<InvoiceTemplateTokens>;
  visibility?: Partial<InvoiceSectionVisibility>;
}
