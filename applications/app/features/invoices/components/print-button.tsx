import { Button } from "components/ui/button";
import { generatePdf } from "features/invoices/api/generate-pdf";
import { generatePrintToken } from "features/invoices/api/generate-print-token";
import { cn } from "lib/utils";
import { Eye } from "lucide-react";
import type { ComponentProps } from "react";
import { useTransition } from "react";
import { toast } from "sonner";

export function PrintButton({
  invoiceId,
  className,
  ...props
}: { invoiceId: string } & ComponentProps<typeof Button>) {
  const [isPending, startTransition] = useTransition();

  function handleView() {
    startTransition(async () => {
      try {
        // Generate token server-side (secret stays secure)
        const { token, exp } = await generatePrintToken({
          data: { invoiceId }
        });

        // Generate PDF server-side
        const response = await generatePdf({
          data: { invoiceId, token, exp }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to generate PDF");
        }

        // Create blob URL and open in new tab once ready
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const newWindow = window.open(blobUrl, "_blank");

        if (!newWindow) {
          window.URL.revokeObjectURL(blobUrl);
          toast.error("Please allow popups to view PDF");
        } else {
          // Clean up blob URL after a delay (browser will have loaded it)
          setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
          }, 1000);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.error("PDF generation error:", error);
        }
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to view PDF. Please try again."
        );
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
