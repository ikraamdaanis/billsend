import geistFont from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import type { QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext
} from "@tanstack/react-router";
import { FileQuestion } from "lucide-react";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { RootErrorBoundary } from "~/components/root-error-boundary";
import { Button } from "~/components/ui/button";
import appCss from "~/styles/globals.css?url";
import { siteMeta } from "~/utils/site-meta";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
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
        name: "theme-color",
        content: "#5e3d7a"
      },
      ...siteMeta()
    ],
    links: [
      {
        rel: "preload",
        href: geistFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorBoundary
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-neutral-50 px-6 text-neutral-900 antialiased">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-[3px] border border-neutral-200 bg-white p-10 text-center shadow-xl shadow-neutral-900/5">
        <div className="border-brand-200 bg-brand-50 text-brand-600 flex size-12 items-center justify-center rounded-[3px] border">
          <FileQuestion className="size-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
            Page not found
          </h1>
          <p className="text-sm text-pretty text-neutral-600">
            We couldn&apos;t find the page you were looking for. It may have
            moved, or the link might be wrong.
          </p>
        </div>
        <Link to="/">
          <Button className="h-9 px-4 text-sm">Back to home</Button>
        </Link>
      </div>
    </div>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster richColors />

        <Scripts />
      </body>
    </html>
  );
}
