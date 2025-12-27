import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    viteTsConfigPaths({
      projects: ["./tsconfig.json"]
    }),
    tailwindcss(),
    tanstackStart({
      srcDirectory: "./app",
      router: {
        routesDirectory: "./routes"
      }
    }),
    netlify(),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"]
      }
    })
  ]
});
