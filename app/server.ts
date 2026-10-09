import handler, { createServerEntry } from "@tanstack/react-start/server-entry";
import { CONTENT_SECURITY_POLICY } from "~/consts/content-security-policy";

// Every page goes out with a Content-Security-Policy that only lets it talk to
// billsend's own origin, so the browser itself enforces that invoice data has
// nowhere else to go.
export default createServerEntry({
  async fetch(request) {
    const response = await handler.fetch(request);
    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html")) return response;

    const headers = new Headers(response.headers);
    headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
});
