import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { DashboardHeader } from "components/dashboard-header";
import { NotFoundMessage } from "components/not-found-message";
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
import { Skeleton } from "components/ui/skeleton";
import dayjs from "dayjs";
import { clientQuery } from "features/clients/queries/client-query";
import type { ClientInvoicesQueryResult } from "features/invoices/queries/client-invoices-query";
import { clientInvoicesQuery } from "features/invoices/queries/client-invoices-query";
import type { InvoiceStatus } from "features/invoices/types";
import { useDocumentTitle } from "hooks/use-document-title";
import { useGoBack } from "hooks/use-go-back";
import { getErrorMessage } from "lib/get-error-message";
import { ArrowLeft, ArrowUpDown, Mail, Phone } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/(root)/clients/$clientId")({
  component: ClientDetailPage,
  errorComponent: ErrorComponent,
  loader: ({ context, params }) => {
    Promise.all([
      context.queryClient.prefetchQuery(clientQuery(params.clientId)),
      context.queryClient.prefetchQuery(clientInvoicesQuery(params.clientId))
    ]);
  },
  head: () => ({
    meta: [
      {
        title: "Client - billsend"
      }
    ]
  })
});

function ClientDetailPage() {
  const { clientId } = Route.useParams();

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <ClientDetailContent clientId={clientId} />
    </Suspense>
  );
}

function ClientDetailContent({ clientId }: { clientId: string }) {
  const { goBack } = useGoBack({ to: "/dashboard/clients" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader className="pl-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={goBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <Suspense fallback={<Skeleton className="h-6 w-32 rounded-sm" />}>
            <ClientHeader clientId={clientId} />
          </Suspense>
        </div>
      </DashboardHeader>
      <main className="flex-1 sm:p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <ClientInfo clientId={clientId} />
          </div>
          <Suspense
            fallback={
              <Card className="sm:border-border border-transparent">
                <CardHeader>
                  <CardTitle>Invoices</CardTitle>
                  <CardDescription>
                    All invoices for this client
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-0 sm:pb-4">
                  <DataTable data={[]} columns={[]} />
                </CardContent>
              </Card>
            }
          >
            <ClientInvoices clientId={clientId} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function ClientHeader({ clientId }: { clientId: string }) {
  const { data: client } = useSuspenseQuery(clientQuery(clientId));

  useDocumentTitle(`${client.name} | billsend`);

  return (
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-semibold text-gray-900">{client.name}</h2>
    </div>
  );
}

function ClientInfo({ clientId }: { clientId: string }) {
  const { data: client } = useSuspenseQuery(clientQuery(clientId));

  return (
    <Card className="sm:border-border col-span-2 border-transparent">
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
        <CardDescription>
          Contact and address details for this client
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pb-0 sm:flex-row sm:pb-4">
        {(client.email || client.phone) && (
          <div className="flex w-full flex-col gap-3">
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
          </div>
        )}
        {client.address && (
          <div className="w-full">
            <p className="mb-1 text-sm font-medium text-gray-500">Address</p>
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
    <Card className="sm:border-border border-transparent">
      <CardHeader>
        <CardTitle>Invoices</CardTitle>
        <CardDescription>
          All invoices for this client ({invoices.length})
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 sm:pb-4">
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

function SkeletonComponent() {
  const { goBack } = useGoBack({ to: "/dashboard/clients" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader className="pl-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={goBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <Skeleton className="h-6 w-32 rounded-sm" />
        </div>
      </DashboardHeader>
      <main className="flex-1 sm:p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <Card className="sm:border-border border-transparent">
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
              <CardDescription>
                Contact and address details for this client
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pb-0 sm:flex-row sm:pb-4">
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <Skeleton className="mt-1 h-4 w-48" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <Skeleton className="mt-1 h-4 w-40" />
                  </div>
                </div>
              </div>
              <div className="w-ful flex w-full flex-col gap-1">
                <p className="mb-1 text-sm font-medium text-gray-500">
                  Address
                </p>
                <div className="">
                  <Skeleton className="mb-1 h-4 w-48" />
                  <Skeleton className="mb-1 h-4 w-36" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="sm:border-border border-transparent">
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>All invoices for this client</CardDescription>
            </CardHeader>
            <CardContent className="pb-0 sm:pb-4">
              <DataTable data={[]} columns={[]} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  const errorMessage = getErrorMessage(error);
  const { goBack } = useGoBack({ to: "/dashboard/clients" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader className="pl-1">
        <Button variant="ghost" size="icon-sm" onClick={goBack}>
          <ArrowLeft className="size-4 shrink-0" />
        </Button>
      </DashboardHeader>
      <main className="grid flex-1 place-items-center p-4">
        <NotFoundMessage
          title="Error loading the client"
          description={errorMessage}
          to="/dashboard/clients"
          backText="Back to Clients"
          retryText="Retry"
        />
      </main>
    </div>
  );
}
