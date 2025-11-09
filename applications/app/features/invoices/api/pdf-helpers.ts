import { db } from "db";
import { invoice as invoiceSchema } from "db/schema";
import { and, eq } from "drizzle-orm";
import { fetchInvoiceForPrint } from "features/invoices/api/fetch-invoice-for-print";
import { generatePdfReact } from "features/invoices/api/generate-pdf-react";
import { generatePdfFilename } from "features/invoices/utils/pdf-filename";
import { auth } from "lib/auth";

export async function validateInvoiceAccess(
  invoiceId: string,
  headers: Headers
): Promise<void> {
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
}

export async function generatePdfForInvoice(
  invoiceId: string
): Promise<Response> {
  // Fetch invoice data for filename generation
  const loaderData = await fetchInvoiceForPrint({ data: { invoiceId } });
  const { invoice } = loaderData;

  // Generate PDF using react-pdf
  const pdfBuffer = await generatePdfReact(invoiceId);

  // Generate filename: YYYY-mm-dd-$clientname-kebab-case-$invoicenumber-kebab-case
  const filename = generatePdfFilename(
    invoice.invoiceDate,
    invoice.client.name,
    invoice.invoiceNumber
  );

  // Encode filename for Content-Disposition header (RFC 5987)
  // Use both filename (for compatibility) and filename* (for UTF-8)
  const encodedFilename = encodeURIComponent(filename);

  // Convert Buffer to Uint8Array for Response
  const pdfArray = new Uint8Array(pdfBuffer);

  // Return PDF as Response
  return new Response(pdfArray, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0"
    }
  });
}
