"use client";

import { pdf } from "@react-pdf/renderer";
import { Button } from "components/ui/button";
import { InvoicePDF } from "features/new/components/invoice-generator";
import { invoiceAtom } from "features/new/state";
import { useAtomValue } from "jotai";
import { cn } from "lib/utils";
import { ExternalLinkIcon } from "lucide-react";
import type { ComponentProps } from "react";
import { useMemo, useTransition } from "react";

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
    startTransition(async () => {
      const blob = await pdf(<InvoicePDF invoice={stableInvoice} />).toBlob();
      const url = URL.createObjectURL(blob);

      // Open URL in new tab
      window.open(url, "_blank");

      // Clean up URL object after a delay to ensure the tab has loaded
      setTimeout(() => URL.revokeObjectURL(url), 1000);
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
      <ExternalLinkIcon className="mr-2 h-4 w-4" />
      Download Invoice
    </Button>
  );
}
