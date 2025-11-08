import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "components/dashboard-header";
import { NotFoundMessage } from "components/not-found-message";
import { StatusBadge } from "components/status-badge";
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
import { InvoiceLineItemsTable } from "features/invoices/components/invoice-line-items-table";
import { invoiceQuery } from "features/invoices/queries/invoice-query";
import type { InvoiceStatus } from "features/invoices/types";
import { useDocumentTitle } from "hooks/use-document-title";
import { useGoBack } from "hooks/use-go-back";
import { getErrorMessage } from "lib/get-error-message";
import { ArrowLeft, Palette } from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/(root)/invoices/$invoiceId/")({
  component: InvoiceDetailPage,
  errorComponent: ErrorComponent,
  loader: ({ context, params }) => {
    context.queryClient.prefetchQuery(invoiceQuery(params.invoiceId));
  },
  head: () => ({
    meta: [
      {
        title: "Invoice - billsend"
      }
    ]
  })
});

function InvoiceDetailPage() {
  const { invoiceId } = Route.useParams();

  return (
    <Suspense fallback={<SkeletonComponent />}>
      <InvoiceDetailContent invoiceId={invoiceId} />
    </Suspense>
  );
}

function InvoiceDetailContent({ invoiceId }: { invoiceId: string }) {
  const { data: invoice } = useSuspenseQuery(invoiceQuery(invoiceId));

  useDocumentTitle(`Invoice #${invoice.invoiceNumber} | billsend`);

  const { goBack } = useGoBack({ to: "/dashboard/invoices" });

  const lineItems = invoice.lineItems || [];
  const subtotal = parseFloat(invoice.subtotal || "0");
  const tax = parseFloat(invoice.tax || "0");
  const total = parseFloat(invoice.total || "0");
  const currency = invoice.currency || "GBP";

  const clientInitials = invoice.client.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader className="pl-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={goBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-base font-medium text-gray-900">
            Invoice # {invoice.invoiceNumber}
          </h2>
          <StatusBadge status={invoice.status as InvoiceStatus} />
          <div className="ml-auto">
            <Link
              to="/dashboard/invoices/$invoiceId/design"
              params={{ invoiceId }}
            >
              <Button variant="outline" size="sm" className="gap-2">
                <Palette className="size-4" />
                Design Invoice
              </Button>
            </Link>
          </div>
        </div>
      </DashboardHeader>
      <main className="flex-1 sm:p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="sm:border-border border-transparent">
              <CardHeader>
                <CardTitle>Invoice Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-0 sm:pb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Invoice Date
                  </p>
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.invoiceDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </p>
                </div>
                {invoice.notes && (
                  <>
                    <Separator className="hidden sm:block" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Notes</p>
                      <p className="text-sm text-gray-900">{invoice.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="sm:border-border border-transparent">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="pb-0 sm:pb-4">
                <Link
                  to="/dashboard/clients/$clientId"
                  params={{ clientId: invoice.client.id }}
                  className="flex items-center gap-3 hover:text-blue-600"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300">
                    <span className="text-sm font-medium text-gray-600">
                      {clientInitials}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.client.name}
                    </p>
                    {invoice.client.email && (
                      <p className="text-xs text-gray-500">
                        {invoice.client.email}
                      </p>
                    )}
                  </div>
                </Link>
                {invoice.client.address && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <div className="text-xs text-gray-900">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <Card className="sm:border-border border-transparent">
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>
                Items and services on this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 sm:pb-4">
              <InvoiceLineItemsTable
                lineItems={lineItems}
                currency={currency}
              />
            </CardContent>
          </Card>
          <Card className="sticky bottom-0 z-10 ml-auto w-full min-w-[300px] border-0 border-t bg-white/70 backdrop-blur-sm sm:relative sm:w-fit sm:border-0">
            <CardContent className="pb-0 sm:pb-4">
              <div className="ml-auto w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {currency} {subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    {currency} {tax.toFixed(2)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>
                    {currency} {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function SkeletonComponent() {
  const { goBack } = useGoBack({ to: "/dashboard/invoices" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader className="pl-1">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={goBack}>
            <ArrowLeft className="size-4 shrink-0" />
          </Button>
          <h2 className="text-base font-medium text-gray-900">
            Invoice #{" "}
            <Skeleton className="inline-block h-5 w-20 rounded-sm align-middle" />
          </h2>
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </DashboardHeader>
      <main className="flex-1 sm:p-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-4">
          <div className="divide-border grid gap-4 sm:grid-cols-2">
            <Card className="sm:border-border border-transparent">
              <CardHeader>
                <CardTitle>Invoice Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 pb-0 sm:pb-4">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">
                    Invoice Date
                  </p>
                  <Skeleton className="inline-block h-4 w-24" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">Due Date</p>
                  <Skeleton className="inline-block h-4 w-24" />
                </div>
                <Separator className="hidden sm:block" />
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <Skeleton className="h-4 w-48" />
                </div>
              </CardContent>
            </Card>
            <Card className="sm:border-border border-transparent">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="pb-0 sm:pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <div className="text-xs text-gray-900">
                    <Skeleton className="mb-1 h-3 w-48" />
                    <Skeleton className="mb-1 h-3 w-36" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="sm:border-border border-transparent">
            <CardHeader>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>
                Items and services on this invoice
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0 sm:pb-4">
              <InvoiceLineItemsTable lineItems={[]} currency="GBP" />
            </CardContent>
          </Card>
          <Card className="sticky bottom-0 z-10 ml-auto w-full min-w-[300px] border-0 border-t bg-white/70 backdrop-blur-sm sm:relative sm:w-fit sm:border-0">
            <CardContent className="pb-0 sm:pb-4">
              <div className="ml-auto w-full space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    <Skeleton className="inline-block h-4 w-20 align-middle" />
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    <Skeleton className="inline-block h-4 w-16 align-middle" />
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>
                    <Skeleton className="inline-block h-5 w-24 align-middle" />
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  const errorMessage = getErrorMessage(error);

  const { goBack } = useGoBack({ to: "/dashboard/invoices" });

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader className="pl-1">
        <Button variant="ghost" size="icon-sm" onClick={goBack}>
          <ArrowLeft className="size-4 shrink-0" />
        </Button>
      </DashboardHeader>
      <main className="grid flex-1 place-items-center p-4">
        <NotFoundMessage
          title="Error loading the invoice"
          description={errorMessage}
          to="/dashboard/invoices"
          backText="Back to Invoices"
          retryText="Retry"
        />
      </main>
    </div>
  );
}
