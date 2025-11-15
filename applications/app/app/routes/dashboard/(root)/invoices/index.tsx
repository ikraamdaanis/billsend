import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DashboardHeader } from "components/dashboard-header";
import { StatusBadge } from "components/status-badge";
import { DataTable } from "components/table";
import { Button } from "components/ui/button";
import { Skeleton } from "components/ui/skeleton";
import dayjs from "dayjs";
import type { InvoicesQueryResult } from "features/invoices/queries/invoices-query";
import { invoicesQuery } from "features/invoices/queries/invoices-query";
import type { InvoiceStatus } from "features/invoices/types";
import { ArrowUpDown, Plus } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/(root)/invoices/")({
  component: InvoicesList,
  loader: ({ context }) => {
    return context.queryClient.prefetchQuery(invoicesQuery());
  }
});

function InvoicesTableSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoicesList() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader>
        <div>
          <h2 className="text-base font-medium text-gray-900">Invoices</h2>
        </div>
        <Link to="/dashboard/invoices/create" className="ml-auto">
          <Button size="sm">
            <Plus className="size-3 shrink-0" />
            Add Invoice
          </Button>
        </Link>
      </DashboardHeader>
      <main className="flex-1 p-4">
        <Suspense fallback={<InvoicesTableSkeleton />}>
          <InvoicesTableContent />
        </Suspense>
      </main>
    </div>
  );
}

function InvoicesTableContent() {
  const { data: invoices } = useSuspenseQuery(invoicesQuery());

  const columns: ColumnDef<InvoicesQueryResult[number]>[] = [
    {
      accessorKey: "invoiceNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="table-header"
            size="table-header"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice Number
            <ArrowUpDown className="size-4 shrink-0" />
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
            preload="render"
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
            variant="table-header"
            size="table-header"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Client
            <ArrowUpDown className="size-4 shrink-0" />
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
            variant="table-header"
            size="table-header"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Invoice Date
            <ArrowUpDown className="size-4 shrink-0" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue<Date>("invoiceDate");
        return (
          <div className="text-sm text-gray-900">
            {dayjs(date).format("YYYY-MM-DD")}
          </div>
        );
      }
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => {
        return (
          <Button
            variant="table-header"
            size="table-header"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Due Date
            <ArrowUpDown className="size-4 shrink-0" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue<Date>("dueDate");
        return (
          <div className="text-sm text-gray-900">
            {dayjs(date).format("YYYY-MM-DD")}
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="table-header"
            size="table-header"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="size-4 shrink-0" />
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
            variant="table-header"
            size="table-header"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total
            <ArrowUpDown className="size-4 shrink-0" />
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
    <>
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
        <DataTable data={invoices} columns={columns} />
      )}
    </>
  );
}
