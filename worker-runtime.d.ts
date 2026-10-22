// `bun run cf-typegen` writes the Worker's Env (worker-configuration.d.ts)
// without Cloudflare's runtime types: those redeclare DOM globals such as
// Request and Element for the whole project, editor code included. These are
// the runtime pieces the Worker uses, as Cloudflare's types declare them.

/* global Env */

declare module "cloudflare:workers" {
  export const env: Env;
}

interface AnalyticsEngineDataset {
  writeDataPoint: (event?: AnalyticsEngineDataPoint) => void;
}

interface AnalyticsEngineDataPoint {
  indexes?: ((ArrayBuffer | string) | null)[];
  doubles?: number[];
  blobs?: ((ArrayBuffer | string) | null)[];
}
