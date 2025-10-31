import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "components/ui/table";
import { invoiceQuery } from "features/invoices/queries/invoice-query";
import type { InvoiceStatus } from "features/invoices/types";
import { AlertCircle, ArrowLeft, FileX } from "lucide-react";

export const Route = createFileRoute("/dashboard/invoices/$invoiceId")({
  component: InvoiceDetailPage,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
  loader: async ({ context, params }) => {
    try {
      return await context.queryClient.ensureQueryData(
        invoiceQuery(params.invoiceId)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.toLowerCase().includes("not found") ||
        errorMessage.toLowerCase().includes("doesn't exist")
      ) {
        throw notFound();
      }
      throw error;
    }
  }
});

function NotFoundComponent() {
  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/invoices">
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
                <FileX className="h-8 w-8 text-gray-400" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Invoice Not Found
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                The invoice you&apos;re looking for doesn&apos;t exist or you
                don&apos;t have permission to view it.
              </p>
              <Link to="/dashboard/invoices" className="mt-6">
                <Button>Back to Invoices</Button>
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
          <Link to="/dashboard/invoices">
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
                Error Loading Invoice
              </h2>
              <p className="mt-2 text-center text-sm text-gray-500">
                Something went wrong while loading the invoice. Please try again
                later.
              </p>
              <div className="mt-6 flex gap-3">
                <Link to="/dashboard/invoices">
                  <Button variant="outline">Back to Invoices</Button>
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

function InvoiceDetailPage() {
  const { invoiceId } = Route.useParams();
  const { data: invoice } = useSuspenseQuery(invoiceQuery(invoiceId));

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
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {invoice.invoiceNumber}
              </h2>
              <p className="text-sm text-gray-500">Invoice details</p>
            </div>
            <StatusBadge status={invoice.status as InvoiceStatus} />
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Invoice Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Due Date
                    </p>
                    <p className="text-sm text-gray-900">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  {invoice.notes && (
                    <>
                      <Separator className="my-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Notes
                        </p>
                        <p className="text-sm text-gray-900">{invoice.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent>
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
                      <p className="mb-2 text-xs font-medium text-gray-500">
                        Address
                      </p>
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
            <Card>
              <CardHeader>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>
                  Items and services on this invoice
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lineItems.length === 0 ? (
                  <p className="py-4 text-sm text-gray-500">
                    No line items found
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lineItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-right">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {currency} {item.unitPrice.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {currency} {item.total.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="ml-auto w-full max-w-sm space-y-2">
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
        </div>
      </main>
    </div>
  );
}
