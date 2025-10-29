import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";
import { routeTree } from "app/routeTree.gen";
import { ConvexProvider } from "convex/react";
import type { ReactNode } from "react";

export function getRouter() {
  const CONVEX_URL = import.meta.env.VITE_CONVEX_URL!;

  if (!CONVEX_URL) {
    // eslint-disable-next-line no-console
    console.error("missing envar VITE_CONVEX_URL");
  }

  const convexQueryClient = new ConvexQueryClient(CONVEX_URL);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn()
      }
    }
  });
  convexQueryClient.connect(queryClient);

  const router = routerWithQueryClient(
    createRouter({
      routeTree,
      defaultPreload: "intent",
      context: { queryClient },
      scrollRestoration: true,
      Wrap: ({ children }: { children: ReactNode }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      )
    }),
    queryClient
  );

  return router;
}
