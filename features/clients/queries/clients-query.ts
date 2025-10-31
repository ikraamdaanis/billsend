import { queryOptions } from "@tanstack/react-query";
import { fetchClients } from "features/clients/api/fetch-clients";

export function clientsQuery() {
  return queryOptions({
    queryKey: ["clients"],
    queryFn: fetchClients
  });
}

export type ClientsQueryResult = Awaited<ReturnType<typeof fetchClients>>;
