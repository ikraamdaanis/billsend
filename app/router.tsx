import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "app/routeTree.gen";

export function getRouter() {
  const queryClient: QueryClient = new QueryClient({});

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: "intent",
      defaultPreloadDelay: 0,
      defaultPendingMinMs: 150,
      scrollRestoration: true,
      context: { queryClient }
    }),
    queryClient
  );

  return router;
}
