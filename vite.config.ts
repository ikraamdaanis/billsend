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
    // The homepage is the same for every visitor, so it is rendered once at
    // build time and served as a static file instead of by the Worker on each
    // request. Its security headers then come from public/_headers.
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
      pages: [{ path: "/", prerender: { enabled: true } }]
    }),
    viteReact()
  ]
});
