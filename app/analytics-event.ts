import type { env } from "cloudflare:workers";
import { ANALYTICS_EVENTS, PAGE_VIEW_PATHS } from "~/consts/analytics-events";
import { bucketUserAgent, isBotUserAgent } from "~/utils/user-agent";

// The longest body an event can have ("page_view /privacy" and the like). A
// longer one isn't an event, so it's dropped without being read in full.
const MAX_BODY_BYTES = 128;

// POST /api/event: one anonymous count. The body is an event name from
// consts/analytics-events.ts, or "page_view" and a route pattern. It answers
// 204 whatever happens, so a dropped event looks the same as a counted one,
// and nothing here is logged: not the IP, the User-Agent or the body.
//
// The data point's fields are positional, so their order is fixed: the index
// and blob1 are the event, then country, browser, OS, device and the page
// view's path.
export async function handleAnalyticsEvent(
  request: Request,
  dataset: typeof env.ANALYTICS | undefined
): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  const event = dataset ? await readEvent(request) : null;

  if (dataset && event) {
    const { browser, os, device } = bucketUserAgent(
      request.headers.get("User-Agent") ?? ""
    );

    try {
      dataset.writeDataPoint({
        indexes: [event.name],
        blobs: [
          event.name,
          requestCountry(request),
          browser,
          os,
          device,
          event.path
        ],
        doubles: [1]
      });
    } catch {
      // A count that can't be written is skipped; the page never hears of it.
    }
  }

  return new Response(null, { status: 204 });
}

// The event the request carries, or null when it isn't one to count: sent
// from another site, by a bot, under Global Privacy Control, or with a body
// that isn't a known event.
async function readEvent(request: Request) {
  const userAgent = request.headers.get("User-Agent") ?? "";

  if (request.headers.get("Sec-Fetch-Site") !== "same-origin") return null;
  if (request.headers.get("Sec-GPC") === "1") return null;
  if (!userAgent || isBotUserAgent(userAgent)) return null;

  let body: string | null;

  try {
    body = await readBody(request);
  } catch {
    return null;
  }

  if (!body) return null;

  const [eventName, ...rest] = body.split(" ");
  const name = ANALYTICS_EVENTS.find(known => known === eventName);

  if (!name) return null;
  if (name !== "page_view") return rest.length ? null : { name, path: "" };

  const path =
    rest.length === 1
      ? PAGE_VIEW_PATHS.find(known => known === rest[0])
      : undefined;

  return path ? { name, path } : null;
}

// The body as text, or null when it's longer than an event can be. A declared
// Content-Length turns a long body away unread; without one (the edge doesn't
// promise to pass it on), reading stops as soon as the body passes the cap.
async function readBody(request: Request) {
  const declared = request.headers.get("Content-Length");

  if (declared !== null && !(Number(declared) <= MAX_BODY_BYTES)) return null;
  if (!request.body) return null;

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";

  for (;;) {
    const { done, value } = await reader.read();

    if (done) return body + decoder.decode();

    size += value.byteLength;

    if (size > MAX_BODY_BYTES) {
      await reader.cancel();

      return null;
    }

    body += decoder.decode(value, { stream: true });
  }
}

// Cloudflare attaches `cf` to the requests a Worker receives (the DOM's
// Request type doesn't know it). Only its country is read; the region, city,
// postcode and coordinates beside it are not.
function requestCountry(request: Request) {
  const cf: { country?: unknown } | undefined = Reflect.get(request, "cf");
  const country = cf?.country;

  return typeof country === "string" && /^[A-Z0-9]{2}$/.test(country)
    ? country
    : "XX";
}
