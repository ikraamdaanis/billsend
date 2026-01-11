import { pdf } from "@react-pdf/renderer";
import { Button } from "components/ui/button";
import { InvoicePDF } from "features/new/components/invoice-generator";
import { getImageBlob } from "features/new/db";
import { imageAtom, invoiceAtom } from "features/new/state";
import { useAtomValue } from "jotai";
import { cn } from "lib/utils";
import type { ComponentProps } from "react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { toast } from "sonner";

export function DownloadInvoice({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick">) {
  const invoice = useAtomValue(invoiceAtom);
  const imageId = useAtomValue(imageAtom);

  const [imageUrl, setImageUrl] = useState("");
  const imageUrlRef = useRef<string | null>(null);

  const [pending, startTransition] = useTransition();

  // Load image from IndexedDB when imageId changes
  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      if (!imageId) {
        // Clean up previous blob URL if it exists
        if (imageUrlRef.current && imageUrlRef.current.startsWith("blob:")) {
          URL.revokeObjectURL(imageUrlRef.current);
          imageUrlRef.current = null;
        }

        return setImageUrl("");
      }

      // Check if it's already a blob URL or data URL
      if (imageId.startsWith("blob:") || imageId.startsWith("data:")) {
        // Clean up previous blob URL if it exists
        if (imageUrlRef.current && imageUrlRef.current.startsWith("blob:")) {
          URL.revokeObjectURL(imageUrlRef.current);
        }

        imageUrlRef.current = imageId;
        return setImageUrl(imageId);
      }

      try {
        const blob = await getImageBlob(imageId);

        if (blob) {
          // Clean up previous blob URL before creating new one
          if (imageUrlRef.current && imageUrlRef.current.startsWith("blob:")) {
            URL.revokeObjectURL(imageUrlRef.current);
          }

          const url = URL.createObjectURL(blob);

          if (cancelled) return URL.revokeObjectURL(url);

          imageUrlRef.current = url;
          setImageUrl(url);
        } else {
          if (imageUrlRef.current && imageUrlRef.current.startsWith("blob:")) {
            URL.revokeObjectURL(imageUrlRef.current);
            imageUrlRef.current = null;
          }

          setImageUrl("");
        }
      } catch (error) {
        if (!cancelled) {
          if (imageUrlRef.current && imageUrlRef.current.startsWith("blob:")) {
            URL.revokeObjectURL(imageUrlRef.current);
            imageUrlRef.current = null;
          }

          setImageUrl("");

          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load image from storage."
          );
        }
      }
    }

    loadImage();

    return () => {
      cancelled = true;

      // Clean up blob URL on unmount or when imageId changes
      if (imageUrlRef.current && imageUrlRef.current.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrlRef.current);
        imageUrlRef.current = null;
      }
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
      return toast.error("Failed to open new window. Popup may be blocked.");
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
      className={cn("roundeds-xs h-7 px-2", className)}
      {...props}
    >
      Download
    </Button>
  );
}
