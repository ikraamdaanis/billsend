import type { InvoiceTemplateTokens } from "features/invoices/templates/types";
import { getBorderColorClass, textSizeStyles } from "features/invoices/components/design/utils";
import { cn } from "lib/utils";

export function InvoiceItemsTable({
  lineItems,
  currency,
  tokens
}: {
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  currency: string;
  tokens: InvoiceTemplateTokens;
}) {
  const accentColorStyle = { color: tokens.accentColorHex };
  const textSize = tokens.baseTextSize;
  const borderColorClass = getBorderColorClass(tokens.borderStyle);

  return (
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
                tokens.borderStyle !== "none" && `border-b ${borderColorClass}`,
                textSizeStyles.tableRow[textSize]
              )}
            >
              <td className="px-4 py-4 font-medium">{item.description}</td>
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
  );
}

