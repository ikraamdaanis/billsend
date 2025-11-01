import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "components/ui/button";
import type { InvoicesQueryResult } from "features/invoices/queries/invoices-query";
import { cn } from "lib/utils";
import { ArrowUpDown, CheckCircle, Clock, XCircle } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
    sent: { label: "Sent", className: "bg-blue-100 text-blue-800" },
    paid: { label: "Paid", className: "bg-green-100 text-green-800" },
    overdue: { label: "Overdue", className: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" }
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
        config.className
      )}
    >
      {status === "paid" && <CheckCircle className="mr-1 h-3 w-3" />}
      {status === "sent" && <Clock className="mr-1 h-3 w-3" />}
      {status === "overdue" && <XCircle className="mr-1 h-3 w-3" />}
      {config.label}
    </span>
  );
}

export const columns: ColumnDef<InvoicesQueryResult[number]>[] = [
  {
    accessorKey: "invoiceNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Number
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const invoiceNumber = row.getValue<string>("invoiceNumber");
      return (
        <div className="text-sm font-medium text-gray-900">{invoiceNumber}</div>
      );
    }
  },
  {
    accessorKey: "clientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Client
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const clientName = row.getValue<string>("clientName");
      return <div className="text-sm text-gray-900">{clientName || "-"}</div>;
    }
  },
  {
    accessorKey: "invoiceDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invoice Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue<Date>("invoiceDate");
      return (
        <div className="text-sm text-gray-900">
          {new Date(date).toLocaleDateString()}
        </div>
      );
    }
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue<Date>("dueDate");
      return (
        <div className="text-sm text-gray-900">
          {new Date(date).toLocaleDateString()}
        </div>
      );
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return <StatusBadge status={status} />;
    }
  },
  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const total = row.getValue<string>("total");
      const currency = row.original.currency || "GBP";
      return (
        <div className="text-sm font-medium text-gray-900">
          {currency} {parseFloat(total || "0").toFixed(2)}
        </div>
      );
    }
  }
];
