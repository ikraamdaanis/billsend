import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { validatePrintToken } from "features/invoices/api/validate-print-token";
import { z } from "zod";

const generatePdfSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  token: z.string(),
  exp: z.number().optional()
});

export const generatePdf = createServerFn({
  method: "POST"
})
  .inputValidator(generatePdfSchema)
  .handler(async ({ data }) => {
    // Validate token first
    await validatePrintToken({
      data: {
        invoiceId: data.invoiceId,
        token: data.token,
        exp: data.exp
      }
    });

    // Get PDF service configuration
    const pdfServiceUrl = process.env.API_URL;
    const pdfServiceKey = process.env.API_KEY;

    if (!pdfServiceUrl || !pdfServiceKey) {
      throw new Error("PDF service not configured");
    }

    // Generate print URL with token
    const request = getRequest();
    const appUrl =
      process.env.APP_URL ||
      (request.headers.get("host")
        ? `${request.headers.get("x-forwarded-proto") || "http"}://${request.headers.get("host")}`
        : `http://localhost:${process.env.PORT || 3000}`);
    const printUrl = `${appUrl}/print/${data.invoiceId}?token=${encodeURIComponent(data.token)}${data.exp ? `&exp=${data.exp}` : ""}`;

    // Validate PDF service URL format
    try {
      new URL(pdfServiceUrl);
    } catch {
      throw new Error("Invalid PDF service configuration");
    }

    // Call PDF service with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    let response: Response;
    try {
      response = await fetch(`${pdfServiceUrl}/generate-pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${pdfServiceKey}`
        },
        body: JSON.stringify({
          url: printUrl,
          fileName: `invoice-${data.invoiceId}.pdf`,
          disposition: "inline"
        }),
        signal: controller.signal
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        throw new Error("PDF generation timeout");
      }
      throw fetchError;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Failed to generate PDF"
      }));

      const errorMessage =
        process.env.NODE_ENV === "production"
          ? "Failed to generate PDF"
          : error.error || "Failed to generate PDF";

      throw new Error(errorMessage);
    }

    // Return PDF blob as Response
    const pdfBlob = await response.blob();
    return new Response(pdfBlob, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="invoice-${data.invoiceId}.pdf"`
      }
    });
  });
