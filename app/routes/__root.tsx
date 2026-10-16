import geistFont from "@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url";
import {
  HeadContent,
  ScriptOnce,
  Scripts,
  createRootRoute
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { StrictMode } from "react";
import { Toaster } from "sonner";
import { NotFound } from "~/components/not-found";
import { RootErrorBoundary } from "~/components/root-error-boundary";
import appCss from "~/styles/globals.css?url";
import { REGISTER_SERVICE_WORKER_SCRIPT } from "~/utils/register-service-worker";
import {
  HIDE_UNTIL_SCROLL_RESTORED_SCRIPT,
  REVEAL_AFTER_SCROLL_RESTORED_SCRIPT
} from "~/utils/scroll-restoration-cloak";
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
        content: "#005fca"
      },
      ...siteMeta()
    ],
    links: [
      // Geist is the base font on every route, so its latin subset preloads
      // globally. Route-specific fonts (the homepage's Inter)
      // preload from their own route's head instead, so other pages don't
      // download files they never render.
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
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png"
      },
      { rel: "shortcut icon", href: "/favicon.ico" },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png"
      },
      { rel: "manifest", href: "/site.webmanifest" }
    ],
    scripts: [
      { children: HIDE_UNTIL_SCROLL_RESTORED_SCRIPT },
      ...(import.meta.env.PROD
        ? [{ children: REGISTER_SERVICE_WORKER_SCRIPT }]
        : [])
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
        <ScriptOnce>{REVEAL_AFTER_SCROLL_RESTORED_SCRIPT}</ScriptOnce>
        <Toaster richColors />
        <Scripts />
      </body>
    </html>
  );
}
