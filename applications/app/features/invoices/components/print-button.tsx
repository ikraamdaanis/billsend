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
    startTransition(() => {
      // Open PDF route in new tab - no popup blocker since it's a direct navigation
      const pdfUrl = `/api/pdf/${invoiceId}`;
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
