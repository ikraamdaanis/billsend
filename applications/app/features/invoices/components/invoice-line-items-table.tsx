import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "components/table";
import type { InvoiceLineItem } from "features/invoices/types";

export function InvoiceLineItemsTable({
  lineItems,
  currency
}: {
  lineItems: InvoiceLineItem[];
  currency: string;
}) {
  const columns: ColumnDef<InvoiceLineItem>[] = [
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        return (
          <div className="font-medium text-gray-900">
            {row.getValue<string>("description")}
          </div>
        );
      }
    },
    {
      accessorKey: "quantity",
      header: () => <div className="text-right">Quantity</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right text-gray-900">
            {row.getValue<number>("quantity")}
          </div>
        );
      }
    },
    {
      accessorKey: "unitPrice",
      header: () => <div className="text-right">Unit Price</div>,
      cell: ({ row }) => {
        const unitPrice = row.getValue<number>("unitPrice");
        return (
          <div className="text-right text-gray-900">
            {currency} {unitPrice.toFixed(2)}
          </div>
        );
      }
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => {
        const total = row.getValue<number>("total");
        return (
          <div className="text-right font-medium text-gray-900">
            {currency} {total.toFixed(2)}
          </div>
        );
      }
    }
  ];

  if (lineItems.length === 0) {
    return <p className="py-4 text-sm text-gray-500">No line items found</p>;
  }

  return <DataTable data={lineItems} columns={columns} />;
}
