import { queryOptions } from "@tanstack/react-query";
import { fetchInvoicesByClientId } from "features/invoices/api/fetch-invoices-by-client-id";

export function clientInvoicesQuery(clientId: string) {
  return queryOptions({
    queryKey: ["invoices", "client", clientId],
    queryFn: () => fetchInvoicesByClientId({ data: { clientId } }),
    placeholderData: prev => prev
  });
}

export type ClientInvoicesQueryResult = Awaited<
  ReturnType<typeof fetchInvoicesByClientId>
>;

