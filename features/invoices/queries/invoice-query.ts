import { queryOptions } from "@tanstack/react-query";
import { fetchInvoiceById } from "features/invoices/api/fetch-invoice-by-id";

export function invoiceQuery(invoiceId: string) {
  return queryOptions({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoiceById({ data: { invoiceId } })
  });
}

export type InvoiceQueryResult = Awaited<
  ReturnType<typeof fetchInvoiceById>
>;

