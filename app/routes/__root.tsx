import geistFont from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import instrumentSerifFont from "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { StrictMode } from "react";
import { Toaster } from "sonner";
import { NotFound } from "~/components/not-found";
import { RootErrorBoundary } from "~/components/root-error-boundary";
import appCss from "~/styles/globals.css?url";
import { siteMeta } from "~/utils/site-meta";

export const Route = createRootRoute({
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
        rel: "preload",
        href: instrumentSerifFont,
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
  notFoundComponent: NotFound,
  errorComponent: RootErrorBoundary
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <StrictMode>{children}</StrictMode>
        <Toaster richColors />

        <Scripts />
      </body>
    </html>
  );
}
