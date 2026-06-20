import { Button } from "components/ui/button";
import { format } from "date-fns";
import { cn } from "lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileTextIcon,
  TrashIcon
} from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import type { InvoiceDocument } from "types";

type SortKey = "name" | "updatedAt";
type SortDirection = "asc" | "desc";

export function InvoiceListTable({
  invoices,
  currentInvoiceId,
  onSelectInvoice,
  onDeleteInvoice,
  deletePendingId,
  deleting
}: {
  invoices: InvoiceDocument[];
  currentInvoiceId: string | null;
  onSelectInvoice: (invoice: InvoiceDocument) => void;
  onDeleteInvoice: (invoice: InvoiceDocument, event: MouseEvent) => void;
  deletePendingId: string | null;
  deleting: boolean;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));

      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  const sortedInvoices = [...invoices].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortKey === "name") {
      return a.name.localeCompare(b.name) * direction;
    }

    return (
      (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
      direction
    );
  });

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-muted-foreground border-border border-b text-left text-sm">
          <th className="bg-popover sticky top-0 py-2 pr-4 whitespace-nowrap">
            <SortHeader
              label="Name"
              active={sortKey === "name"}
              direction={sortDirection}
              onClick={() => toggleSort("name")}
            />
          </th>
          <th className="bg-popover sticky top-0 py-2 pr-4 whitespace-nowrap">
            <SortHeader
              label="Date modified"
              active={sortKey === "updatedAt"}
              direction={sortDirection}
              onClick={() => toggleSort("updatedAt")}
            />
          </th>
          <th className="bg-popover sticky top-0 w-10 py-2">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedInvoices.map(invoice => {
          const isCurrent = currentInvoiceId === invoice.id;

          return (
            <tr
              key={invoice.id}
              onClick={() => onSelectInvoice(invoice)}
              className={cn(
                "group/row hover:bg-accent border-border cursor-pointer border-b last:border-b-0",
                isCurrent && "bg-accent"
              )}
            >
              <td className="py-2.5 pr-4">
                <div className="flex items-center gap-2">
                  <FileTextIcon className="text-muted-foreground size-4 shrink-0" />
                  <span className="font-medium">{invoice.name}</span>
                  {isCurrent && (
                    <span className="text-muted-foreground text-sm">
                      Current
                    </span>
                  )}
                </div>
              </td>
              <td className="text-muted-foreground py-2.5 pr-4 whitespace-nowrap tabular-nums">
                {format(new Date(invoice.updatedAt), "PP, p")}
              </td>
              <td className="py-2.5 text-right">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={event => onDeleteInvoice(invoice, event)}
                  disabled={deletePendingId === invoice.id || deleting}
                  className="text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100"
                >
                  <TrashIcon className="size-4" />
                  <span className="sr-only">Delete {invoice.name}</span>
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function SortHeader({
  label,
  active,
  direction,
  onClick
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className="hover:text-foreground data-[active=true]:text-foreground flex w-full items-center gap-1 font-medium"
    >
      {label}
      {active &&
        (direction === "asc" ? (
          <ArrowUpIcon className="size-3.5" />
        ) : (
          <ArrowDownIcon className="size-3.5" />
        ))}
    </button>
  );
}
