import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { StatusBadge } from "components/status-badge";
import { DataTable } from "components/table";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "components/ui/card";
import { Separator } from "components/ui/separator";
import { Skeleton } from "components/ui/skeleton";
import { clientQuery } from "features/clients/queries/client-query";
import type { ClientInvoicesQueryResult } from "features/invoices/queries/client-invoices-query";
import { clientInvoicesQuery } from "features/invoices/queries/client-invoices-query";
import type { InvoiceStatus } from "features/invoices/types";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpDown,
  Mail,
  Phone,
  UserX
} from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/clients/$clientId")({
  component: ClientDetailPage,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  loader: ({ context, params }) => {
    return Promise.all([
      context.queryClient.prefetchQuery(clientQuery(params.clientId)),
      context.queryClient.prefetchQuery(clientInvoicesQuery(params.clientId))
    ]);
  }
});

function ClientInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="mb-2 h-6 w-40" />
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 h-5 w-5" />
          <div>
            <Skeleton className="mb-2 h-4 w-12" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Separator />
        <div className="flex items-start gap-3">
          <Skeleton className="mt-0.5 h-5 w-5" />
          <div>
            <Skeleton className="mb-2 h-4 w-12" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ClientInvoicesTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="mb-2 h-6 w-32" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotFoundComponent() {
  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <UserX className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Client Not Found
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                The client you&apos;re looking for doesn&apos;t exist or you
                don&apos;t have permission to view it.
              </p>
              <Link to="/dashboard/clients" className="mt-6">
                <Button>Back to Clients</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ErrorComponent() {
  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-md">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Error Loading Client
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Something went wrong while loading the client. Please try again
                later.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/dashboard/clients">
                  <Button variant="outline">Back to Clients</Button>
                </Link>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ClientDetailPage() {
  const { clientId } = Route.useParams();

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/clients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Suspense
            fallback={
              <div className="flex items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div>
                  <Skeleton className="mb-2 h-7 w-48" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            }
          >
            <ClientHeader clientId={clientId} />
          </Suspense>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <Suspense fallback={<ClientInfoSkeleton />}>
                <ClientInfo clientId={clientId} />
              </Suspense>
            </div>
            <div className="lg:col-span-2">
              <Suspense fallback={<ClientInvoicesTableSkeleton />}>
                <ClientInvoices clientId={clientId} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ClientHeader({ clientId }: { clientId: string }) {
  const { data: client } = useSuspenseQuery(clientQuery(clientId));

  const initials = client.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
        <span className="text-lg font-medium text-gray-600">{initials}</span>
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{client.name}</h2>
        <p className="text-sm text-gray-500">Client details</p>
      </div>
    </div>
  );
}

function ClientInfo({ clientId }: { clientId: string }) {
  const { data: client } = useSuspenseQuery(clientQuery(clientId));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>
          Contact and address details for this client
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {client.email && (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{client.email}</p>
            </div>
          </div>
        )}
        {client.phone && (
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm text-gray-900">{client.phone}</p>
            </div>
          </div>
        )}
        {client.address && (
          <>
            {(client.email || client.phone) && <Separator className="my-2" />}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-500">Address</p>
              <div className="text-sm text-gray-900">
                {client.address.line1 && <div>{client.address.line1}</div>}
                {client.address.line2 && <div>{client.address.line2}</div>}
                <div>
                  {[
                    client.address.city,
                    client.address.postalCode,
                    client.address.country
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </div>
              </div>
            </div>
          </>
        )}
        {!client.email && !client.phone && !client.address && (
          <p className="text-sm text-gray-500">
            No contact information available
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ClientInvoices({ clientId }: { clientId: string }) {
  const { data: invoices } = useSuspenseQuery(clientInvoicesQuery(clientId));

  const columns: ColumnDef<ClientInvoicesQueryResult[number]>[] = [
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
    <Card>
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>
          All invoices for this client ({invoices.length})
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-sm text-gray-600">
              No invoices found for this client
            </p>
            <Link to="/dashboard/invoices/create" className="mt-4">
              <Button variant="outline">Create Invoice</Button>
            </Link>
          </div>
        ) : (
          <DataTable data={invoices} columns={columns} />
        )}
      </CardContent>
    </Card>
  );
}
