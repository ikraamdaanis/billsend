import { pdf } from "@react-pdf/renderer";
import { Button } from "components/ui/button";
import { InvoicePDF } from "features/new/components/invoice-generator";
import { getImageBlob } from "features/new/db";
import { imageAtom, invoiceAtom } from "features/new/state";
import { useAtomValue } from "jotai";
import { cn } from "lib/utils";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

export function DownloadInvoice({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick">) {
  const invoice = useAtomValue(invoiceAtom);
  const imageId = useAtomValue(imageAtom);
  const [imageUrl, setImageUrl] = useState("");

  const [pending, startTransition] = useTransition();

  // Load image from IndexedDB when imageId changes
  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      if (!imageId) {
        setImageUrl("");
        return;
      }

      // Check if it's already a blob URL or data URL
      if (imageId.startsWith("blob:") || imageId.startsWith("data:")) {
        setImageUrl(imageId);
        return;
      }

      try {
        const blob = await getImageBlob(imageId);
        if (cancelled) return;
        if (blob) {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        } else {
          setImageUrl("");
        }
      } catch {
        if (!cancelled) setImageUrl("");
      }
    }

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [imageId]);

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
      toast.error("Failed to open new window. Popup may be blocked.");
      return;
    }
    startTransition(async () => {
      try {
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
      className={cn("h-7 rounded-sm px-2", className)}
      {...props}
    >
      Download
    </Button>
  );
}
