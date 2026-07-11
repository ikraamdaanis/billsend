import { createRouter } from "@tanstack/react-router";
import { routeTree } from "~/app/routeTree.gen";

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: "intent",
    defaultPreloadDelay: 0,
    defaultPendingMinMs: 0,
    scrollRestoration: true
  });
}
