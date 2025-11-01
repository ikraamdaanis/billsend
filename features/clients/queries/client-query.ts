import { queryOptions } from "@tanstack/react-query";
import { fetchClientById } from "features/clients/api/fetch-client-by-id";
import { z } from "zod";

export function clientQuery(clientId: string) {
  return queryOptions({
    queryKey: ["client", clientId],
    queryFn: () => fetchClientById({ data: { clientId } }),
    placeholderData: prev => prev
  });
}

export type ClientQueryResult = Awaited<
  ReturnType<typeof fetchClientById>
>;

