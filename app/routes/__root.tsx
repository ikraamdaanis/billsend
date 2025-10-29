import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import type { ConvexQueryClient } from "@convex-dev/react-query";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouteContext
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ConvexClientProvider } from "context/convex-provider";
import type { ConvexReactClient } from "convex/react";
import { authClient } from "lib/auth-client";
import type { ReactNode } from "react";
import appCss from "styles/globals.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      },
      {
        title: "billsend"
      }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  // beforeLoad: async ctx => {
  //   // all queries, mutations and action made with TanStack Query will be
  //   // authenticated by an identity token.
  //   const { userId, token } = await fetchAuth();
  //   // During SSR only (the only time serverHttpClient exists),
  //   // set the auth token to make HTTP queries with.
  //   if (token) {
  //     ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
  //   }
  //   return { userId, token };
  // },
  shellComponent: RootDocument
});

function RootDocument({ children }: { children: ReactNode }) {
  const context = useRouteContext({ from: Route.id });

  return (
    <ConvexBetterAuthProvider
      client={context.convexClient}
      authClient={authClient}
    >
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <ConvexClientProvider>{children}</ConvexClientProvider>
          <TanStackDevtools
            config={{
              position: "bottom-right"
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />
              }
            ]}
          />
          <Scripts />
        </body>
      </html>
    </ConvexBetterAuthProvider>
  );
}
