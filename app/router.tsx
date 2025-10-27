import { createRouter } from "@tanstack/react-router";
import { routeTree } from "app/routeTree.gen";

export const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
};
