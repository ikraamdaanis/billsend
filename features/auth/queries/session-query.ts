import { queryOptions } from "@tanstack/react-query";
import { fetchSession } from "features/auth/api/fetch-session";

export function sessionQuery() {
  return queryOptions({
    queryKey: ["user"],
    queryFn: ({ signal }) => fetchSession({ signal }),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}

export type SessionQueryResult = Awaited<ReturnType<typeof fetchSession>>;
