import { Button } from "components/ui/button";
import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";
import { generatePdfFilename } from "features/invoices/utils/pdf-filename";
import { cn } from "lib/utils";
import { Eye } from "lucide-react";
import type { ComponentProps } from "react";
import { useTransition } from "react";
import { toast } from "sonner";

export function PrintButton({
  invoiceId,
  invoice,
  className,
  ...props
}: {
  invoiceId: string;
  invoice: InvoiceQueryResult;
} & ComponentProps<typeof Button>) {
  const [isPending, startTransition] = useTransition();

  function handleView() {
    startTransition(() => {
      // Generate filename and include it in URL so browser uses it
      const filename = generatePdfFilename(
        invoice.invoiceDate,
        invoice.client.name,
        invoice.invoiceNumber
      );
      const pdfUrl = `/api/pdf/${invoiceId}/${filename}`;
      const newWindow = window.open(pdfUrl, "_blank");

      if (!newWindow) {
        toast.error("Please allow popups to view PDF");
      }
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleView}
      disabled={isPending}
      className={cn("gap-2", className)}
      aria-label="View invoice as PDF"
      {...props}
    >
      <Eye className="size-4" />
      {isPending ? "Generating PDF..." : "View PDF"}
    </Button>
  );
}
