import { pdf } from "@react-pdf/renderer";
import type { ComponentProps } from "react";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { InvoicePDF } from "~/components/pdf/invoice-generator";
import { Button } from "~/components/ui/button";
import { useImageLoader } from "~/hooks/use-image-loader";
import { cn } from "~/lib/utils";
import { useInvoiceData } from "~/stores/invoice-selectors";
import { registerInvoicePdfFonts } from "~/utils/register-invoice-pdf-fonts";

export function DownloadInvoice({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick">) {
  const invoice = useInvoiceData();
  const imageUrl = useImageLoader(invoice.image);

  const [pending, startTransition] = useTransition();

  // Create a stable copy of the invoice data with loaded image URL
  const stableInvoice = useMemo(
    () => ({ ...invoice, image: imageUrl }),
    [invoice, imageUrl]
  );

  // Generate PDF blob URL for "Open in new tab" button
  function handleCreatePdfUrl() {
    // Open window immediately while we still have user interaction context
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      return toast.error("Failed to open new window. Popup may be blocked.");
    }

    startTransition(async () => {
      try {
        registerInvoicePdfFonts();
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
