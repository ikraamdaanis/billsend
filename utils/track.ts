import type { AnalyticsEvent, PageViewPath } from "~/types";

// Counts one anonymous usage event (app/analytics-event.ts).
export function track(event: Exclude<AnalyticsEvent, "page_view">) {
  sendEvent(event);
}

// A page view names the route pattern, never the URL.
export function trackPageView(path: PageViewPath) {
  sendEvent(`page_view ${path}`);
}

// Fire and forget: a beacon that fails (offline, blocked) is never noticed by
// the app. Nothing is kept on the device for it, so there is no visitor id,
// and nothing is sent in development or when the browser asks for Global
// Privacy Control.
function sendEvent(body: string) {
  if (import.meta.env.DEV) return;
  if (typeof navigator === "undefined") return;
  if (prefersNoTracking(navigator)) return;

  try {
    navigator.sendBeacon("/api/event", body);
  } catch {
    // Counting is never worth an error.
  }
}

function prefersNoTracking(browser: Navigator) {
  return (
    "globalPrivacyControl" in browser && browser.globalPrivacyControl === true
  );
}
