import { createFileRoute } from "@tanstack/react-router";
import {
  generatePdfForInvoice,
  validateInvoiceAccess
} from "features/invoices/api/pdf-helpers";

export const Route = createFileRoute("/api/pdf/$invoiceId/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        try {
          // Extract invoiceId from params (filename in catch-all is ignored)
          const { invoiceId } = params;

          // Validate user has access to this invoice
          await validateInvoiceAccess(invoiceId, request.headers);

          // Generate PDF server-side
          const pdfResponse = await generatePdfForInvoice(invoiceId);

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

