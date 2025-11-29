"use client";

import { pdf } from "@react-pdf/renderer";
import { Button } from "components/ui/button";
import { InvoicePDF } from "features/new/components/invoice-generator";
import { invoiceAtom } from "features/new/state";
import { useAtomValue } from "jotai";
import { cn } from "lib/utils";
import type { ComponentProps } from "react";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";

export function DownloadInvoice({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick">) {
  const invoice = useAtomValue(invoiceAtom);

  const [pending, startTransition] = useTransition();

  // Create a stable copy of the invoice data to avoid unnecessary re-renders
  const stableInvoice = useMemo(() => ({ ...invoice }), [invoice]);

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
