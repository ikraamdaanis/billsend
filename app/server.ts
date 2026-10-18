import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import {
  CONTENT_SECURITY_POLICY,
  DESIGN_CONTENT_SECURITY_POLICY
} from "~/consts/content-security-policy";
import { SECURITY_HEADERS } from "~/consts/security-headers";

// Every page goes out with a Content-Security-Policy that only lets it talk to
// billsend's own origin, so the browser itself enforces that invoice data has
// nowhere else to go. Every response gets the baseline security headers.
export default createServerEntry({
  async fetch(request) {
    const response = await handler.fetch(request);
    const contentType = response.headers.get("content-type") ?? "";
    const headers = new Headers(response.headers);

    for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
      headers.set(name, value);
    }

    if (contentType.includes("text/html")) {
      headers.set(
        "Content-Security-Policy",
        isDesignPage(request)
          ? DESIGN_CONTENT_SECURITY_POLICY
          : CONTENT_SECURITY_POLICY
      );
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
});

// The design catalogue and its frames; see DESIGN_CONTENT_SECURITY_POLICY.
function isDesignPage(request: Request) {
  const { pathname } = new URL(request.url);

  return pathname === "/design" || pathname.startsWith("/design/");
}
