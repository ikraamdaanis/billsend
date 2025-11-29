"use client";

import { pdf } from "@react-pdf/renderer";
import { Button } from "components/ui/button";
import { InvoicePDF } from "features/new/components/invoice-generator";
import { invoiceAtom } from "features/new/state";
import { useAtomValue } from "jotai";
import { cn } from "lib/utils";
import { CheckIcon, ExternalLinkIcon, SaveIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

export function DownloadInvoice({
  className,
  ...props
}: Omit<ComponentProps<typeof Button>, "onClick">) {
  const invoice = useAtomValue(invoiceAtom);

  const [pending, startTransition] = useTransition();

  const [isSaved, setIsSaved] = useState(false);

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

  function handleSave() {
    try {
      setIsSaved(true);

      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Failed to save invoice: ${error.message}`
          : "Failed to save invoice"
      );
    }
  }

  return (
    <section className="flex items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        className={cn(
          "w-22 transition",
          isSaved && "bg-green-100 text-green-700 hover:bg-green-100"
        )}
        onClick={handleSave}
      >
        {isSaved ? (
          <CheckIcon className="size-4" />
        ) : (
          <SaveIcon className="size-4" />
        )}
        {isSaved ? "Saved" : "Save"}
      </Button>
      <Button
        type="button"
        variant="default"
        onClick={handleCreatePdfUrl}
        disabled={pending}
        className={cn(className)}
        {...props}
      >
        <ExternalLinkIcon className="size-4" />
        Download Invoice
      </Button>
    </section>
  );
}
