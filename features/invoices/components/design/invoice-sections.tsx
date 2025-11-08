import type { InvoiceTemplateTokens } from "features/invoices/templates/types";
import { getBorderClass, textSizeStyles } from "features/invoices/utils/utils";
import { cn } from "lib/utils";

export function InvoiceSections({
  invoice,
  tokens,
  visibility
}: {
  invoice: {
    notes?: string | null;
    client: {
      name: string;
      email?: string | null;
      address?: {
        line1?: string;
        line2?: string;
        city?: string;
        postalCode?: string;
        country?: string;
      } | null;
    };
  };
  tokens: InvoiceTemplateTokens;
  visibility: {
    clientDetails: boolean;
    notes: boolean;
    terms: boolean;
    paymentDetails: boolean;
    footer: boolean;
  };
}) {
  const textSize = tokens.baseTextSize;
  const borderClass = getBorderClass(tokens);

  return (
    <>
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
              "mb-3 font-bold tracking-wide text-(--accent-color) uppercase",
              textSizeStyles.sectionHeader[textSize]
            )}
          >
            Bill To:
          </div>
          <div className={textSizeStyles.body[textSize]}>
            <div className="mb-1 font-semibold text-gray-900">
              {invoice.client.name}
            </div>
            {invoice.client.email && (
              <div className="mb-1 text-gray-600">{invoice.client.email}</div>
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
      {visibility.notes && invoice.notes && (
        <div className="avoid-break pt-2">
          <div
            className={cn(
              "mb-2 font-bold tracking-wide text-(--accent-color) uppercase",
              textSizeStyles.sectionHeader[textSize]
            )}
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
              "mb-2 font-bold tracking-wide text-(--accent-color) uppercase",
              textSizeStyles.sectionHeader[textSize]
            )}
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
              "mb-3 font-bold tracking-wide text-(--accent-color) uppercase",
              textSizeStyles.sectionHeader[textSize]
            )}
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
    </>
  );
}
