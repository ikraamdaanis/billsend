import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "components/status-badge";
import { DataTable } from "components/table";
import { Button } from "components/ui/button";
import type { InvoicesQueryResult } from "features/invoices/queries/invoices-query";
import { invoicesQuery } from "features/invoices/queries/invoices-query";
import type { InvoiceStatus } from "features/invoices/types";
import { ArrowUpDown, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/invoices/")({
  component: InvoicesList,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(invoicesQuery());
  }
});

function InvoicesList() {
  const { data: invoices } = useSuspenseQuery(invoicesQuery());

  const columns: ColumnDef<InvoicesQueryResult[number]>[] = [
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
        const invoice = row.original;
        const invoiceNumber = row.getValue<string>("invoiceNumber");
        return (
          <Link
            to="/dashboard/invoices/$invoiceId"
            params={{ invoiceId: invoice.id }}
          >
            <div className="text-sm font-medium text-gray-900 hover:text-blue-600">
              {invoiceNumber}
            </div>
          </Link>
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
        const invoice = row.original;
        const clientName = row.getValue<string>("clientName");
        if (!clientName || !invoice.clientId) {
          return <div className="text-sm text-gray-900">-</div>;
        }
        return (
          <Link
            to="/dashboard/clients/$clientId"
            params={{ clientId: invoice.clientId }}
          >
            <div className="text-sm text-gray-900 hover:text-blue-600">
              {clientName}
            </div>
          </Link>
        );
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
        const status = row.getValue<InvoiceStatus>("status");
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

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
            <p className="text-sm text-gray-500">
              Manage your organisation&#39;s invoices
            </p>
          </div>
          <Link to="/dashboard/invoices/create">
            <Button>
              <Plus className="size-5 shrink-0" />
              Add Invoice
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-white p-12">
            <p className="text-sm text-gray-600">No invoices found</p>
            <Link to="/dashboard/invoices/create" className="mt-4">
              <Button>
                <Plus className="size-5 shrink-0" />
                Create your first invoice
              </Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <DataTable data={invoices} columns={columns} />
          </div>
        )}
      </main>
    </div>
  );
}
