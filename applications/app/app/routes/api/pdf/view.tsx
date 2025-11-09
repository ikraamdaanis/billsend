import { createFileRoute } from "@tanstack/react-router";
import { validatePrintToken } from "features/invoices/api/fetch-invoice-for-print";

export const Route = createFileRoute("/api/pdf/view")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const invoiceId = url.searchParams.get("invoiceId");
          const token = url.searchParams.get("token");

          if (!invoiceId || !token) {
            return new Response("Missing invoiceId or token", { status: 400 });
          }

          // Validate token
          const exp = url.searchParams.get("exp");
          await validatePrintToken({
            data: {
              invoiceId,
              token,
              exp: exp ? parseInt(exp, 10) : undefined
            }
          });

          // Get PDF service configuration
          const pdfServiceUrl = process.env.API_URL;
          const pdfServiceKey = process.env.API_KEY;

          if (!pdfServiceUrl || !pdfServiceKey) {
            return new Response("PDF service not configured", { status: 500 });
          }

          // Generate print URL with token
          const appUrl =
            process.env.APP_URL ||
            (request.headers.get("host")
              ? `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`
              : `http://localhost:${process.env.PORT || 3000}`);
          const printUrl = `${appUrl}/print/${invoiceId}?token=${encodeURIComponent(token)}${exp ? `&exp=${exp}` : ""}`;

          // Call PDF service
          const response = await fetch(`${pdfServiceUrl}/generate-pdf`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${pdfServiceKey}`
            },
            body: JSON.stringify({
              url: printUrl,
              fileName: `invoice-${invoiceId}.pdf`,
              disposition: "inline"
            })
          });

          if (!response.ok) {
            const error = await response.json().catch(() => ({
              error: "Failed to generate PDF"
            }));

            return new Response(error.error || "Failed to generate PDF", {
              status: response.status
            });
          }

          // Stream PDF back with inline disposition
          const pdfBlob = await response.blob();
          return new Response(pdfBlob, {
            headers: {
              "Content-Type": "application/pdf",
              "Content-Disposition": `inline; filename="invoice-${invoiceId}.pdf"`
            }
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Internal server error";
          return new Response(errorMessage, { status: 500 });
        }
      }
    }
  }
});
