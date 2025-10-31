import { useForm } from "@tanstack/react-form";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "components/ui/card";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { clientsQuery } from "features/clients/queries/clients-query";
import { createInvoice } from "features/invoices/api/create-invoice";
import { invoicesQuery } from "features/invoices/queries/invoices-query";
import { getErrorMessage } from "lib/get-error-message";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { z } from "zod";

const createInvoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  invoiceDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: z
    .enum(["draft", "sent", "paid", "overdue", "cancelled"])
    .default("draft"),
  lineItems: z
    .array(
      z.object({
        description: z.string().min(1, "Description is required"),
        quantity: z.number().min(0, "Quantity must be at least 0"),
        unitPrice: z.number().min(0, "Unit price must be at least 0"),
        total: z.number().min(0, "Total must be at least 0")
      })
    )
    .min(1, "At least one line item is required"),
  tax: z.string().default("0"),
  currency: z.string().default("GBP"),
  notes: z.string().optional()
});

export const Route = createFileRoute("/dashboard/invoices/create")({
  component: CreateInvoicePage,
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(clientsQuery());
  }
});

function getDefaultDueDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().split("T")[0];
}

function CreateInvoicePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: clients } = useSuspenseQuery(clientsQuery());

  const [pending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      clientId: "",
      invoiceNumber: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: getDefaultDueDate(),
      status: "draft" as const,
      lineItems: [
        {
          description: "",
          quantity: 0,
          unitPrice: 0,
          total: 0
        }
      ],
      tax: "0",
      currency: "GBP",
      notes: ""
    },
    onSubmit: ({ value }) => {
      startTransition(async () => {
        try {
          const lineItems = value.lineItems.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice
          }));

          const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
          const taxAmount = parseFloat(value.tax || "0");
          const total = subtotal + taxAmount;

          const validated = createInvoiceSchema.parse({
            clientId: value.clientId,
            invoiceNumber: value.invoiceNumber,
            invoiceDate: value.invoiceDate,
            dueDate: value.dueDate,
            status: value.status,
            lineItems: lineItems.map(item => ({
              ...item,
              total: item.total
            })),
            tax: taxAmount.toString(),
            currency: value.currency,
            notes: value.notes || undefined
          });

          await createInvoice({
            data: {
              ...validated,
              subtotal: subtotal.toString(),
              total: total.toString()
            }
          });

          queryClient.invalidateQueries({
            queryKey: invoicesQuery().queryKey
          });

          toast.success("Invoice created successfully");

          await router.navigate({ to: "/dashboard/invoices" });
        } catch (error) {
          toast.error(
            getErrorMessage(error, "An error occurred while creating invoice")
          );
        }
      });
    }
  });

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Create Invoice
            </h2>
            <p className="text-sm text-gray-500">
              Add a new invoice to your organisation
            </p>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
              <CardDescription>
                Enter the invoice details to create a new invoice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="clientId">
                      Client <span className="text-red-500">*</span>
                    </Label>
                    <form.Field name="clientId">
                      {field => (
                        <>
                          <select
                            id="clientId"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            className="border-input bg-background h-10 rounded-md border px-3 py-2 text-sm"
                          >
                            <option value="">Select a client</option>
                            {clients.map(client => (
                              <option key={client.id} value={client.id}>
                                {client.name}
                              </option>
                            ))}
                          </select>
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-600">
                              {String(field.state.meta.errors[0])}
                            </p>
                          )}
                        </>
                      )}
                    </form.Field>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="invoiceNumber">
                      Invoice Number <span className="text-red-500">*</span>
                    </Label>
                    <form.Field name="invoiceNumber">
                      {field => (
                        <>
                          <Input
                            id="invoiceNumber"
                            type="text"
                            placeholder="INV-001"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            autoComplete="off"
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-600">
                              {String(field.state.meta.errors[0])}
                            </p>
                          )}
                        </>
                      )}
                    </form.Field>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="invoiceDate">
                      Invoice Date <span className="text-red-500">*</span>
                    </Label>
                    <form.Field name="invoiceDate">
                      {field => (
                        <>
                          <Input
                            id="invoiceDate"
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            autoComplete="off"
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-600">
                              {String(field.state.meta.errors[0])}
                            </p>
                          )}
                        </>
                      )}
                    </form.Field>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="dueDate">
                      Due Date <span className="text-red-500">*</span>
                    </Label>
                    <form.Field name="dueDate">
                      {field => (
                        <>
                          <Input
                            id="dueDate"
                            type="date"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            autoComplete="off"
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-sm text-red-600">
                              {String(field.state.meta.errors[0])}
                            </p>
                          )}
                        </>
                      )}
                    </form.Field>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="status">Status</Label>
                    <form.Field name="status">
                      {field => (
                        <select
                          id="status"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => {
                            const value = e.target.value;
                            if (
                              value === "draft" ||
                              value === "sent" ||
                              value === "paid" ||
                              value === "overdue" ||
                              value === "cancelled"
                            ) {
                              field.handleChange(
                                value as typeof field.state.value
                              );
                            }
                          }}
                          className="border-input bg-background h-10 rounded-md border px-3 py-2 text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="sent">Sent</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      )}
                    </form.Field>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Line Items
                      </h3>
                      <p className="text-sm text-gray-500">
                        Add items to this invoice
                      </p>
                    </div>
                    <form.Field name="lineItems">
                      {field => (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            field.handleChange([
                              ...field.state.value,
                              {
                                description: "",
                                quantity: 0,
                                unitPrice: 0,
                                total: 0
                              }
                            ]);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                          Add Item
                        </Button>
                      )}
                    </form.Field>
                  </div>
                  <form.Field name="lineItems">
                    {lineItemsField => (
                      <div className="flex flex-col gap-4">
                        {lineItemsField.state.value.map((_, index) => (
                          <div
                            key={index}
                            className="flex gap-4 rounded-lg border border-gray-200 p-4"
                          >
                            <div className="flex flex-1 flex-col gap-2">
                              <Label
                                htmlFor={`lineItems[${index}].description`}
                              >
                                Description
                              </Label>
                              <form.Field
                                name={`lineItems[${index}].description`}
                              >
                                {field => (
                                  <Input
                                    id={`lineItems[${index}].description`}
                                    type="text"
                                    placeholder="Item description"
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={e =>
                                      field.handleChange(e.target.value)
                                    }
                                    autoComplete="off"
                                  />
                                )}
                              </form.Field>
                            </div>
                            <div className="flex w-24 flex-col gap-2">
                              <Label htmlFor={`lineItems[${index}].quantity`}>
                                Quantity
                              </Label>
                              <form.Field name={`lineItems[${index}].quantity`}>
                                {field => {
                                  const updateTotal = () => {
                                    const lineItems = [
                                      ...lineItemsField.state.value
                                    ];
                                    const qty = field.state.value;
                                    const unitPrice =
                                      lineItems[index]?.unitPrice || 0;
                                    lineItems[index] = {
                                      ...lineItems[index],
                                      quantity: qty,
                                      total: qty * unitPrice
                                    };
                                    lineItemsField.handleChange(lineItems);
                                  };
                                  return (
                                    <Input
                                      id={`lineItems[${index}].quantity`}
                                      type="number"
                                      min="0"
                                      step="1"
                                      placeholder="0"
                                      value={field.state.value.toString()}
                                      onBlur={() => {
                                        field.handleBlur();
                                        updateTotal();
                                      }}
                                      onChange={e => {
                                        const qty =
                                          parseFloat(e.target.value) || 0;
                                        field.handleChange(qty);
                                        updateTotal();
                                      }}
                                      autoComplete="off"
                                    />
                                  );
                                }}
                              </form.Field>
                            </div>
                            <div className="flex w-32 flex-col gap-2">
                              <Label htmlFor={`lineItems[${index}].unitPrice`}>
                                Unit Price
                              </Label>
                              <form.Field
                                name={`lineItems[${index}].unitPrice`}
                              >
                                {field => {
                                  const updateTotal = () => {
                                    const lineItems = [
                                      ...lineItemsField.state.value
                                    ];
                                    const price = field.state.value;
                                    const qty = lineItems[index]?.quantity || 0;
                                    lineItems[index] = {
                                      ...lineItems[index],
                                      unitPrice: price,
                                      total: qty * price
                                    };
                                    lineItemsField.handleChange(lineItems);
                                  };
                                  return (
                                    <Input
                                      id={`lineItems[${index}].unitPrice`}
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={field.state.value.toString()}
                                      onBlur={() => {
                                        field.handleBlur();
                                        updateTotal();
                                      }}
                                      onChange={e => {
                                        const price =
                                          parseFloat(e.target.value) || 0;
                                        field.handleChange(price);
                                        updateTotal();
                                      }}
                                      autoComplete="off"
                                    />
                                  );
                                }}
                              </form.Field>
                            </div>
                            <div className="flex w-32 flex-col gap-2">
                              <Label htmlFor={`lineItems[${index}].total`}>
                                Total
                              </Label>
                              <form.Field name={`lineItems[${index}].total`}>
                                {field => (
                                  <Input
                                    id={`lineItems[${index}].total`}
                                    type="number"
                                    value={field.state.value.toFixed(2)}
                                    disabled
                                    className="bg-gray-50"
                                  />
                                )}
                              </form.Field>
                            </div>
                            {lineItemsField.state.value.length > 1 && (
                              <div className="flex items-end">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    lineItemsField.handleChange(
                                      lineItemsField.state.value.filter(
                                        (_item, i) => i !== index
                                      )
                                    );
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </form.Field>
                </div>
                <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      Subtotal:
                    </span>
                    <form.Field name="lineItems">
                      {lineItemsField => (
                        <form.Field name="currency">
                          {currencyField => {
                            const subtotal = lineItemsField.state.value.reduce(
                              (sum, item) =>
                                sum +
                                (item.quantity || 0) * (item.unitPrice || 0),
                              0
                            );
                            return (
                              <span className="text-sm font-medium text-gray-900">
                                {currencyField.state.value || "GBP"}{" "}
                                {subtotal.toFixed(2)}
                              </span>
                            );
                          }}
                        </form.Field>
                      )}
                    </form.Field>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="tax" className="text-sm">
                        Tax:
                      </Label>
                      <form.Field name="tax">
                        {field => (
                          <Input
                            id="tax"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={e => field.handleChange(e.target.value)}
                            className="w-32"
                            autoComplete="off"
                          />
                        )}
                      </form.Field>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-900">
                        Total:
                      </span>
                      <form.Field name="lineItems">
                        {lineItemsField => (
                          <form.Field name="tax">
                            {taxField => (
                              <form.Field name="currency">
                                {currencyField => {
                                  const subtotal =
                                    lineItemsField.state.value.reduce(
                                      (sum, item) =>
                                        sum +
                                        (item.quantity || 0) *
                                          (item.unitPrice || 0),
                                      0
                                    );
                                  const tax = parseFloat(
                                    taxField.state.value || "0"
                                  );
                                  const total = subtotal + tax;
                                  return (
                                    <span className="text-lg font-semibold text-gray-900">
                                      {currencyField.state.value || "GBP"}{" "}
                                      {total.toFixed(2)}
                                    </span>
                                  );
                                }}
                              </form.Field>
                            )}
                          </form.Field>
                        )}
                      </form.Field>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="currency">Currency</Label>
                    <form.Field name="currency">
                      {field => (
                        <select
                          id="currency"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          className="border-input bg-background h-10 rounded-md border px-3 py-2 text-sm"
                        >
                          <option value="GBP">GBP</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                        </select>
                      )}
                    </form.Field>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <form.Field name="notes">
                    {field => (
                      <textarea
                        id="notes"
                        rows={4}
                        placeholder="Optional notes for this invoice"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={e => field.handleChange(e.target.value)}
                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                        autoComplete="off"
                      />
                    )}
                  </form.Field>
                </div>
                <div className="flex gap-4">
                  <Link to="/dashboard/invoices" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={pending || !form.state.canSubmit}
                  >
                    {pending ? "Creating..." : "Create Invoice"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
