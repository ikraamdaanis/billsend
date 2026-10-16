import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: Number(process.env.PORT) || 3000
  },
  resolve: {
    tsconfigPaths: true
  },
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    // The homepage and the privacy page are the same for every visitor, so
    // they are rendered once at build time and served as static files instead
    // of by the Worker on each request. Their security headers then come from
    // public/_headers. The privacy page is written as privacy.html, not
    // privacy/index.html, so it is served at /privacy with no redirect to a
    // trailing slash. Every page listed here goes into the generated
    // sitemap.xml; the editor is listed but rendered by the Worker.
    tanstackStart({
      srcDirectory: "./app",
      router: {
        routesDirectory: "./routes"
      },
      prerender: {
        enabled: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false
      },
      sitemap: {
        host: "https://billsend.io"
      },
      pages: [
        { path: "/", prerender: { enabled: true } },
        { path: "/create", prerender: { enabled: false } },
        {
          path: "/privacy",
          prerender: { enabled: true, autoSubfolderIndex: false }
        }
      ]
    }),
    viteReact()
  ]
});
