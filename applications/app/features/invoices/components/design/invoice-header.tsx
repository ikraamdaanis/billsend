import type { InvoiceTemplateTokens } from "features/invoices/templates/types";
import { textSizeStyles } from "features/invoices/utils/utils";
import { cn } from "lib/utils";

export function InvoiceHeader({
  organization,
  invoice,
  tokens,
  visibility
}: {
  organization: {
    name: string;
    logo?: string | null;
  };
  invoice: {
    invoiceNumber: string;
    invoiceDate: Date | string;
    dueDate: Date | string;
  };
  tokens: InvoiceTemplateTokens;
  visibility: {
    companyDetails: boolean;
  };
}) {
  const textSize = tokens.baseTextSize;
  const borderColorClass =
    tokens.borderStyle === "subtle"
      ? "border-gray-100"
      : tokens.borderStyle === "strong"
        ? "border-gray-300"
        : "border-gray-200";

  return (
    <>
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
              "font-bold tracking-tight text-(--accent-color)",
              textSizeStyles.logoTop[textSize]
            )}
          >
            {organization.name}
          </h1>
        </div>
      )}
      {(tokens.logoPosition === "left" || tokens.logoPosition === "right") && (
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
              "font-bold tracking-tight text-(--accent-color)",
              textSizeStyles.logoSide[textSize]
            )}
          >
            {organization.name}
          </h1>
        </div>
      )}
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
              "mb-3 font-bold tracking-tight text-(--accent-color)",
              textSizeStyles.invoiceHeading[textSize]
            )}
            style={{ letterSpacing: "-0.02em" }}
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
          <div className="mb-2 text-lg font-bold text-(--accent-color)">
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
    </>
  );
}
