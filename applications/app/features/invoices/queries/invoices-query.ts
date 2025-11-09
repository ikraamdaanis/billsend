import { queryOptions } from "@tanstack/react-query";
import { fetchInvoices } from "features/invoices/api/fetch-invoices";

export function invoicesQuery() {
  return queryOptions({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
    staleTime: 30 * 1000, // 30 seconds
    placeholderData: prev => prev
  });
}

export type InvoicesQueryResult = Awaited<ReturnType<typeof fetchInvoices>>;
