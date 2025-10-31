import { queryOptions } from "@tanstack/react-query";
import { fetchInvoices } from "features/invoices/api/fetch-invoices";

export function invoicesQuery() {
  return queryOptions({
    queryKey: ["invoices"],
    queryFn: fetchInvoices
  });
}

export type InvoicesQueryResult = Awaited<ReturnType<typeof fetchInvoices>>;
