import { createFileRoute } from "@tanstack/react-router";
import {
  generatePdfForInvoice,
  generatePrintTokenForInvoice
} from "features/invoices/api/pdf-helpers";

export const Route = createFileRoute("/api/pdf/$invoiceId")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          const { invoiceId } = params;

          // Generate token server-side (authenticated user required)
          const { token, exp } = await generatePrintTokenForInvoice(
            invoiceId,
            request.headers
          );

          // Generate PDF server-side
          const pdfResponse = await generatePdfForInvoice(
            invoiceId,
            token,
            exp,
            request.headers
          );

          return pdfResponse;
        } catch (error) {
          const errorMessage =
            process.env.NODE_ENV === "production"
              ? "Internal server error"
              : error instanceof Error
                ? error.message
                : "Internal server error";

          return new Response(errorMessage, { status: 500 });
        }
      }
    }
  }
});

