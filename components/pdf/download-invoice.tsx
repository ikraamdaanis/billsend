import { pdf } from "@react-pdf/renderer";
import type { ComponentProps } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { InvoicePDF } from "~/components/pdf/invoice-generator";
import { Button } from "~/components/ui/button";
import { getImageBlob } from "~/db";
import { cn } from "~/lib/utils";
import { useInvoiceData } from "~/stores/invoice-selectors";
import { isDirectImageUrl } from "~/utils/is-direct-image-url";
import { registerInvoicePdfFonts } from "~/utils/register-invoice-pdf-fonts";

export function DownloadInvoice({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick">) {
  const invoice = useInvoiceData();

  const [pending, startTransition] = useTransition();

  // Generate PDF blob URL for "Open in new tab" button
  function handleCreatePdfUrl() {
    // Open window immediately while we still have user interaction context
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      return toast.error("Failed to open new window. Popup may be blocked.");
    }

    startTransition(async () => {
      let logoUrl = "";
      let logoUrlIsOwned = false;

      try {
        registerInvoicePdfFonts();

        // Resolve the logo from IndexedDB up front. The reactive image loader
        // can still be an empty string right after opening a saved invoice, so
        // reading the blob here guarantees the PDF is built with the logo.
        if (isDirectImageUrl(invoice.image)) {
          logoUrl = invoice.image;
        } else if (invoice.image) {
          const blob = await getImageBlob(invoice.image);

          if (blob) {
            logoUrl = URL.createObjectURL(blob);
            logoUrlIsOwned = true;
          }
        }

        const stableInvoice = { ...invoice, image: logoUrl };
        const blob = await pdf(<InvoicePDF invoice={stableInvoice} />).toBlob();
        const url = URL.createObjectURL(blob);

        // Update the window location with the blob URL
        newWindow.location.href = url;

        // Don't revoke the URL - Chrome's PDF viewer needs it to persist
        // The browser will automatically clean it up when the tab is closed
      } catch (error) {
        toast.error(
          error instanceof Error
            ? `Failed to generate PDF: ${error.message}`
            : "Failed to generate PDF"
        );

        newWindow.close();
      } finally {
        // toBlob() has already embedded the logo, so the source URL we minted
        // for it can be released regardless of success.
        if (logoUrlIsOwned) URL.revokeObjectURL(logoUrl);
      }
    });
  }

  return (
    <Button
      variant="default"
      onClick={handleCreatePdfUrl}
      disabled={pending}
      className={cn(className)}
      {...props}
    >
      Download
    </Button>
  );
}
