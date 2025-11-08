import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import type {
  InvoiceDesignOverrides,
  InvoiceSectionVisibility,
  InvoiceTemplate,
  InvoiceTemplateTokens
} from "features/invoices/templates/types";
import { cn } from "lib/utils";

function mergeTokens(
  defaultTokens: InvoiceTemplateTokens,
  overrides?: Partial<InvoiceTemplateTokens>
): InvoiceTemplateTokens {
  return {
    ...defaultTokens,
    ...overrides
  };
}

function mergeVisibility(
  defaultVisibility: InvoiceSectionVisibility,
  overrides?: Partial<InvoiceSectionVisibility>
): InvoiceSectionVisibility {
  return {
    ...defaultVisibility,
    ...overrides
  };
}

function getFontFamilyClass(fontFamily: string): string {
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

function getTextSizeClass(textSize: string): string {
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

function getSpacingClass(spacing: string): string {
  switch (spacing) {
    case "compact":
      return "gap-3";
    case "comfortable":
      return "gap-5";
    default:
      return "gap-4";
  }
}

function getBorderColorClass(borderStyle: string): string {
  switch (borderStyle) {
    case "subtle":
      return "border-gray-100";
    case "strong":
      return "border-gray-300";
    default:
      return "border-gray-200";
  }
}

const textSizeStyles = {
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

export function InvoicePreview({
  invoice,
  organization,
  template,
  overrides
}: {
  invoice: InvoiceQueryResult;
  organization: {
    name: string;
    logo?: string | null;
  };
  template: InvoiceTemplate;
  overrides?: InvoiceDesignOverrides;
}) {
  const tokens = mergeTokens(template.defaultTokens, overrides?.tokens);
  const visibility = mergeVisibility(
    template.defaultVisibility,
    overrides?.visibility
  );

  const lineItems = invoice.lineItems || [];
  const subtotal = parseFloat(invoice.subtotal || "0");
  const tax = parseFloat(invoice.tax || "0");
  const total = parseFloat(invoice.total || "0");
  const currency = invoice.currency || "GBP";

  const fontFamilyClass = getFontFamilyClass(tokens.fontFamily);
  const baseTextSizeClass = getTextSizeClass(tokens.baseTextSize);
  const spacingClass = getSpacingClass(tokens.spacingScale);
  const borderColorClass = getBorderColorClass(tokens.borderStyle);

  const borderClass =
    tokens.borderStyle === "none"
      ? ""
      : tokens.borderStyle === "subtle"
        ? `border ${borderColorClass}`
        : `border-2 ${borderColorClass}`;

  const accentColorStyle = { color: tokens.accentColorHex };
  const textSize = tokens.baseTextSize;

  return (
    <div
      className={cn(
        "invoice-page w-full text-gray-800",
        fontFamilyClass,
        baseTextSizeClass
      )}
    >
      <div className={cn("flex flex-col", spacingClass)}>
        {tokens.logoPosition === "top" && (
          <div className="avoid-break mb-6 flex flex-col items-center">
            {organization.logo && (
              <img
                src={organization.logo}
                alt={organization.name}
                className="mb-3 h-20 w-auto"
              />
            )}
            <h1
              className={cn(
                "font-bold tracking-tight",
                textSizeStyles.logoTop[textSize]
              )}
              style={accentColorStyle}
            >
              {organization.name}
            </h1>
          </div>
        )}
        {(tokens.logoPosition === "left" ||
          tokens.logoPosition === "right") && (
          <div
            className={cn(
              "avoid-break mb-6 flex flex-col",
              tokens.logoPosition === "right" ? "items-end" : "items-start"
            )}
          >
            {organization.logo && (
              <img
                src={organization.logo}
                alt={organization.name}
                className="mb-2 h-16 w-auto"
              />
            )}
            <h1
              className={cn(
                "font-bold tracking-tight",
                textSizeStyles.logoSide[textSize]
              )}
              style={accentColorStyle}
            >
              {organization.name}
            </h1>
          </div>
        )}
        <div
          className={cn(
            "flex flex-col",
            spacingClass === "gap-3" ? "gap-4" : "gap-6"
          )}
        >
          <div
            className={cn(
              "avoid-break flex items-start justify-between pb-4",
              tokens.borderStyle !== "none" && `border-b ${borderColorClass}`
            )}
            style={
              tokens.borderStyle !== "none"
                ? {
                    borderBottomWidth:
                      tokens.borderStyle === "strong" ? "2px" : "1px"
                  }
                : undefined
            }
          >
            <div className="flex flex-col">
              <h2
                className={cn(
                  "mb-3 font-bold tracking-tight",
                  textSizeStyles.invoiceHeading[textSize]
                )}
                style={{ ...accentColorStyle, letterSpacing: "-0.02em" }}
              >
                INVOICE
              </h2>
              {visibility.companyDetails && (
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="font-semibold text-gray-900">
                    {organization.name}
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1 text-right text-sm">
              <div className="mb-2 text-lg font-bold" style={accentColorStyle}>
                Invoice #{invoice.invoiceNumber}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {new Date(invoice.invoiceDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </div>
              <div className="text-gray-600">
                <span className="font-medium">Due:</span>{" "}
                {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
              </div>
            </div>
          </div>
          {visibility.clientDetails && (
            <div
              className={cn(
                "avoid-break",
                borderClass,
                "rounded-lg p-5",
                tokens.borderStyle === "none" && "bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "mb-3 font-bold tracking-wide uppercase",
                  textSizeStyles.sectionHeader[textSize]
                )}
                style={accentColorStyle}
              >
                Bill To:
              </div>
              <div className={textSizeStyles.body[textSize]}>
                <div className="mb-1 font-semibold text-gray-900">
                  {invoice.client.name}
                </div>
                {invoice.client.email && (
                  <div className="mb-1 text-gray-600">
                    {invoice.client.email}
                  </div>
                )}
                {invoice.client.address && (
                  <div className="leading-relaxed text-gray-600">
                    {invoice.client.address.line1 && (
                      <div>{invoice.client.address.line1}</div>
                    )}
                    {invoice.client.address.line2 && (
                      <div>{invoice.client.address.line2}</div>
                    )}
                    <div>
                      {[
                        invoice.client.address.city,
                        invoice.client.address.postalCode,
                        invoice.client.address.country
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="avoid-break">
            <table className="w-full border-collapse">
              <thead>
                <tr
                  className={cn(
                    "text-left",
                    tokens.borderStyle !== "none" &&
                      `border-b ${borderColorClass} bg-gray-50/50`
                  )}
                  style={
                    tokens.borderStyle !== "none"
                      ? {
                          borderBottomWidth:
                            tokens.borderStyle === "strong" ? "2px" : "1px"
                        }
                      : undefined
                  }
                >
                  <th
                    className={cn(
                      "px-4 py-3 font-bold tracking-wide uppercase",
                      textSizeStyles.tableHeader[textSize]
                    )}
                    style={accentColorStyle}
                  >
                    Description
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-right font-bold tracking-wide uppercase",
                      textSizeStyles.tableHeader[textSize]
                    )}
                    style={accentColorStyle}
                  >
                    Quantity
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-right font-bold tracking-wide uppercase",
                      textSizeStyles.tableHeader[textSize]
                    )}
                    style={accentColorStyle}
                  >
                    Unit Price
                  </th>
                  <th
                    className={cn(
                      "px-4 py-3 text-right font-bold tracking-wide uppercase",
                      textSizeStyles.tableHeader[textSize]
                    )}
                    style={accentColorStyle}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, index) => (
                  <tr
                    key={index}
                    className={cn(
                      index % 2 === 0 ? "" : "bg-gray-50/50",
                      tokens.borderStyle !== "none" &&
                        `border-b ${borderColorClass}`,
                      textSizeStyles.tableRow[textSize]
                    )}
                  >
                    <td className="px-4 py-4 font-medium">
                      {item.description}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-4 text-right text-gray-600">
                      {currency} {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right font-semibold">
                      {currency} {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="avoid-break flex justify-end">
            <div
              className={cn(
                "flex w-72 flex-col gap-3",
                textSizeStyles.tableRow[textSize]
              )}
            >
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-900">
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>
              {visibility.taxRow && tax > 0 && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold text-gray-900">
                    {currency} {tax.toFixed(2)}
                  </span>
                </div>
              )}
              {visibility.discountRow && (
                <div className="flex justify-between py-1">
                  <span className="text-gray-600">Discount</span>
                  <span className="font-semibold text-gray-900">
                    {currency} 0.00
                  </span>
                </div>
              )}
              <div
                className={cn(
                  "mt-2 flex justify-between border-t-2 pt-3 font-bold",
                  textSizeStyles.total[textSize]
                )}
                style={{
                  borderColor: tokens.accentColorHex,
                  color: tokens.accentColorHex
                }}
              >
                <span>Total</span>
                <span>
                  {currency} {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          {visibility.notes && invoice.notes && (
            <div className="avoid-break pt-2">
              <div
                className={cn(
                  "mb-2 font-bold tracking-wide uppercase",
                  textSizeStyles.sectionHeader[textSize]
                )}
                style={accentColorStyle}
              >
                Notes:
              </div>
              <div
                className={cn(
                  "leading-relaxed whitespace-pre-wrap text-gray-700",
                  textSizeStyles.body[textSize]
                )}
              >
                {invoice.notes}
              </div>
            </div>
          )}
          {visibility.terms && (
            <div className="avoid-break pt-2">
              <div
                className={cn(
                  "mb-2 font-bold tracking-wide uppercase",
                  textSizeStyles.sectionHeader[textSize]
                )}
                style={accentColorStyle}
              >
                Terms & Conditions:
              </div>
              <div
                className={cn(
                  "leading-relaxed text-gray-700",
                  textSizeStyles.body[textSize]
                )}
              >
                Payment is due within 30 days of invoice date.
              </div>
            </div>
          )}
          {visibility.paymentDetails && (
            <div
              className={cn(
                "avoid-break",
                borderClass,
                "rounded-lg p-5",
                tokens.borderStyle === "none" && "bg-gray-50"
              )}
            >
              <div
                className={cn(
                  "mb-3 font-bold tracking-wide uppercase",
                  textSizeStyles.sectionHeader[textSize]
                )}
                style={accentColorStyle}
              >
                Payment Details:
              </div>
              <div
                className={cn(
                  "leading-relaxed text-gray-700",
                  textSizeStyles.body[textSize]
                )}
              >
                Please make payment to the account details provided.
              </div>
            </div>
          )}
          {visibility.footer && (
            <div
              className={cn(
                "avoid-break mt-8 border-t pt-6 text-center text-gray-500",
                textSizeStyles.footer[textSize]
              )}
            >
              <div className="font-medium">Thank you for your business!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
