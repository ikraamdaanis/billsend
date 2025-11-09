import { db } from "db";
import { invoice as invoiceSchema } from "db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "lib/auth";

export async function generatePrintTokenForInvoice(
  invoiceId: string,
  headers: Headers
): Promise<{ token: string; exp: number }> {
  // Authenticate user
  const session = await auth.api.getSession({ headers });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // Get user's organizations
  const organizations = await auth.api.listOrganizations({ headers });

  if (organizations.length === 0) {
    throw new Error("No organization found");
  }

  const organizationId = organizations[0]?.id;

  if (!organizationId) {
    throw new Error("No organization found");
  }

  // Verify invoice belongs to user's organization
  const invoiceData = await db
    .select()
    .from(invoiceSchema)
    .where(
      and(
        eq(invoiceSchema.id, invoiceId),
        eq(invoiceSchema.organizationId, organizationId)
      )
    )
    .limit(1);

  if (!invoiceData.length) {
    throw new Error("Invoice not found");
  }

  const secret = process.env.PRINT_ROUTE_SECRET;

  if (!secret) {
    throw new Error("PRINT_ROUTE_SECRET not configured");
  }

  // Generate secure token with expiry (5 minutes)
  const exp = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  const message = `${invoiceId}.${exp}`;

  // Generate HMAC signature
  const { createHmac } = await import("node:crypto");
  const token = createHmac("sha256", secret)
    .update(message)
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");

  return { token, exp };
}

export async function generatePdfForInvoice(
  invoiceId: string,
  token: string,
  exp: number | undefined,
  requestHeaders: Headers
): Promise<Response> {
  // Validate token first
  const { validatePrintToken } = await import("features/invoices/api/validate-print-token");
  await validatePrintToken({
    data: {
      invoiceId,
      token,
      exp
    }
  });

  // Get PDF service configuration
  const pdfServiceUrl = process.env.API_URL;
  const pdfServiceKey = process.env.API_KEY;

  if (!pdfServiceUrl || !pdfServiceKey) {
    throw new Error("PDF service not configured");
  }

  // Generate print URL with token
  const appUrl =
    process.env.APP_URL ||
    (requestHeaders.get("host")
      ? `${requestHeaders.get("x-forwarded-proto") || "http"}://${requestHeaders.get("host")}`
      : `http://localhost:${process.env.PORT || 3000}`);
  const printUrl = `${appUrl}/print/${invoiceId}?token=${encodeURIComponent(token)}${exp ? `&exp=${exp}` : ""}`;

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
        fileName: `invoice-${invoiceId}.pdf`,
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
      "Content-Disposition": `inline; filename="invoice-${invoiceId}.pdf"`
    }
  });
}

