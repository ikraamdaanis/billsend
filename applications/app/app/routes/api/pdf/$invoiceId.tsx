import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/pdf/$invoiceId")({
  // This is just a parent route for the catch-all child route
  // The actual handler is in the child route
});

