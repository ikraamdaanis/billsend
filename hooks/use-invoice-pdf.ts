import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { getImageBlob } from "~/db";
import { useInvoiceData } from "~/stores/invoice-selectors";
import { isDirectImageUrl } from "~/utils/is-direct-image-url";
import { track } from "~/utils/track";

// react-pdf can only decode PNG and JPEG. Any other logo format the uploader
// accepts (WebP, GIF, ...) is silently dropped from the PDF, so re-encode it as
// PNG first.
async function toPdfSafeImageBlob(blob: Blob): Promise<Blob> {
  if (blob.type === "image/png" || blob.type === "image/jpeg") return blob;

  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(pngBlob => {
      if (pngBlob) {
        resolve(pngBlob);
      } else {
        reject(new Error("Failed to convert the logo to PNG"));
      }
    }, "image/png");
  });
}

// The PDF engine is most of the editor's code, so it stays out of the
// editor's first load. It is fetched once the editor is idle (so a PDF can
// still be made after going offline), or sooner when the button is hovered
// or focused; a click awaits whichever request is already under way.
function loadPdfBuilder() {
  return import("~/components/pdf/build-invoice-pdf");
}

function prefetchPdfBuilder() {
  loadPdfBuilder().catch(() => {
    // A click tries again and reports the failure.
  });
}

// Builds the invoice PDF and opens it in a new tab. `prefetch` warms the PDF
// engine early (call it on hover or focus of whatever leads to a download).
export function useInvoicePdf() {
  const invoice = useInvoiceData();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (typeof requestIdleCallback === "undefined") {
      const timeout = setTimeout(prefetchPdfBuilder, 2000);

      return () => clearTimeout(timeout);
    }

    const idleCallback = requestIdleCallback(prefetchPdfBuilder, {
      timeout: 5000
    });

    return () => cancelIdleCallback(idleCallback);
  }, []);

  function openPdf() {
    // Open window immediately while we still have user interaction context
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      return toast.error("Failed to open new window. Popup may be blocked.");
    }

    startTransition(async () => {
      let logoUrl = "";
      let logoUrlIsOwned = false;

      try {
        // Resolve the logo from IndexedDB up front. The reactive image loader
        // can still be an empty string right after opening a saved invoice, so
        // reading the blob here guarantees the PDF is built with the logo.
        if (isDirectImageUrl(invoice.image)) {
          logoUrl = invoice.image;
        } else if (invoice.image) {
          const blob = await getImageBlob(invoice.image);

          if (blob) {
            logoUrl = URL.createObjectURL(await toPdfSafeImageBlob(blob));
            logoUrlIsOwned = true;
          }
        }

        const stableInvoice = { ...invoice, image: logoUrl };
        const { buildInvoicePdfBlob } = await loadPdfBuilder();
        const blob = await buildInvoicePdfBlob(stableInvoice);
        const url = URL.createObjectURL(blob);

        // Update the window location with the blob URL
        newWindow.location.href = url;

        if (!newWindow.closed) track("pdf_opened");

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

  return { pending, openPdf, prefetch: prefetchPdfBuilder };
}
