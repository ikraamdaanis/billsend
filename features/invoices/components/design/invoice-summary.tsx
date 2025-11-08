import type { InvoiceTemplateTokens } from "features/invoices/templates/types";
import { textSizeStyles } from "features/invoices/components/design/utils";
import { cn } from "lib/utils";

export function InvoiceSummary({
  subtotal,
  tax,
  currency,
  total,
  tokens,
  visibility
}: {
  subtotal: number;
  tax: number;
  currency: string;
  total: number;
  tokens: InvoiceTemplateTokens;
  visibility: {
    taxRow: boolean;
    discountRow: boolean;
  };
}) {
  const textSize = tokens.baseTextSize;
  const accentColorStyle = { color: tokens.accentColorHex };

  return (
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
  );
}

