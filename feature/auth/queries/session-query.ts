import { queryOptions } from "@tanstack/react-query";
import { fetchSession } from "feature/auth/api/fetch-session";

export function sessionQuery() {
  return queryOptions({
    queryKey: ["user"],
    queryFn: ({ signal }) => fetchSession({ signal })
  });
}

export type SessionQueryResult = Awaited<ReturnType<typeof fetchSession>>;
