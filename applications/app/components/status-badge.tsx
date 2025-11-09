import type { InvoiceStatus } from "features/invoices/types";
import { cn } from "lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react";

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  const statusConfig = {
    draft: { label: "Draft", className: "bg-gray-100 text-gray-800" },
    sent: { label: "Sent", className: "bg-blue-100 text-blue-800" },
    paid: { label: "Paid", className: "bg-green-100 text-green-800" },
    overdue: { label: "Overdue", className: "bg-red-100 text-red-800" },
    cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800" }
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        config.className
      )}
    >
      {status === "paid" && <CheckCircle className="mr-1 h-3 w-3" />}
      {status === "sent" && <Clock className="mr-1 h-3 w-3" />}
      {status === "overdue" && <XCircle className="mr-1 h-3 w-3" />}
      {config.label}
    </span>
  );
}
