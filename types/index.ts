import type { FileRouteTypes } from "app/routeTree.gen";
import type { BetterFetchError, RequestContext } from "better-auth/react";

export type ErrorContext = {
  response: Response;
  request: RequestContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: BetterFetchError & Record<string, any>;
};

export type ValidRoute = FileRouteTypes["to"];
