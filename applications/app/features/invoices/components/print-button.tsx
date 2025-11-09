import { Button } from "components/ui/button";
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
        const printRouteSecret = import.meta.env.VITE_PRINT_ROUTE_SECRET;

        if (!printRouteSecret) {
          throw new Error("PDF service configuration missing");
        }

        // Generate secure token with expiry (5 minutes)
        const exp = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        const message = `${invoiceId}.${exp}`;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(printRouteSecret);
        const messageData = encoder.encode(message);

        // Import key for HMAC
        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );

        // Sign with HMAC
        const signature = await crypto.subtle.sign(
          "HMAC",
          cryptoKey,
          messageData
        );
        const signatureArray = Array.from(new Uint8Array(signature));
        const token = btoa(String.fromCharCode(...signatureArray))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=/g, "");

        // Fetch PDF first to ensure it's ready before opening
        const viewUrl = `/api/pdf/view?invoiceId=${encodeURIComponent(invoiceId)}&token=${encodeURIComponent(token)}&exp=${exp}`;
        const response = await fetch(viewUrl);

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
