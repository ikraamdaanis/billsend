import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { Input } from "components/ui/input";
import { format } from "date-fns";
import { cn } from "lib/utils";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  FileTextIcon,
  MoreHorizontalIcon,
  PencilIcon,
  TrashIcon
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { InvoiceDocument } from "types";

type SortKey = "name" | "updatedAt";
type SortDirection = "asc" | "desc";

export function InvoiceListTable({
  invoices,
  currentInvoiceId,
  onSelectInvoice,
  onRenameInvoice,
  onDeleteInvoice,
  deletePendingId,
  deleting
}: {
  invoices: InvoiceDocument[];
  currentInvoiceId: string | null;
  onSelectInvoice: (invoice: InvoiceDocument) => void;
  onRenameInvoice: (invoice: InvoiceDocument, newName: string) => void;
  onDeleteInvoice: (invoice: InvoiceDocument) => void;
  deletePendingId: string | null;
  deleting: boolean;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const editingIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingId) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [editingId]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));

      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  }

  function startRename(invoice: InvoiceDocument) {
    editingIdRef.current = invoice.id;
    setEditingId(invoice.id);
    setEditingValue(invoice.name);
  }

  function finishRename(invoice: InvoiceDocument, shouldSave: boolean) {
    if (editingIdRef.current !== invoice.id) {
      return;
    }

    editingIdRef.current = null;
    setEditingId(null);

    const trimmed = editingValue.trim();

    if (shouldSave && trimmed && trimmed !== invoice.name) {
      onRenameInvoice(invoice, trimmed);
    }
  }

  function handleEditKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    invoice: InvoiceDocument
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      finishRename(invoice, true);

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      finishRename(invoice, false);
    }
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
          <th className="bg-popover sticky top-0 py-2 pr-4 pl-4 whitespace-nowrap">
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
          <th className="bg-popover sticky top-0 w-10 py-2 pr-4">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedInvoices.map(invoice => {
          const isCurrent = currentInvoiceId === invoice.id;
          const isEditing = editingId === invoice.id;

          return (
            <tr
              key={invoice.id}
              onClick={() => {
                if (isEditing) {
                  return;
                }

                onSelectInvoice(invoice);
              }}
              className={cn(
                "group/row hover:bg-accent border-border cursor-pointer border-b last:border-b-0",
                isCurrent && "bg-accent"
              )}
            >
              <td
                className="py-2.5 pr-4 pl-4"
                onClick={
                  isEditing ? event => event.stopPropagation() : undefined
                }
              >
                {isEditing ? (
                  <Input
                    ref={inputRef}
                    aria-label="Invoice name"
                    value={editingValue}
                    onChange={event => setEditingValue(event.target.value)}
                    onFocus={event => event.currentTarget.select()}
                    onKeyDown={event => handleEditKeyDown(event, invoice)}
                    onBlur={() => finishRename(invoice, true)}
                    className="h-7 text-sm"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="text-muted-foreground size-4 shrink-0" />
                    <span className="font-medium">{invoice.name}</span>
                    {isCurrent && (
                      <span className="text-muted-foreground text-sm">
                        Current
                      </span>
                    )}
                  </div>
                )}
              </td>
              <td className="text-muted-foreground py-2.5 pr-4 whitespace-nowrap tabular-nums">
                {format(new Date(invoice.updatedAt), "PP, p")}
              </td>
              <td
                className="py-2.5 pr-4 text-right"
                onClick={event => event.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={deletePendingId === invoice.id || deleting}
                        className="text-muted-foreground hover:text-foreground opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100"
                      />
                    }
                  >
                    <MoreHorizontalIcon className="size-4" />
                    <span className="sr-only">Actions for {invoice.name}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" finalFocus={false}>
                    <DropdownMenuItem onClick={() => startRename(invoice)}>
                      <PencilIcon />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => onDeleteInvoice(invoice)}
                    >
                      <TrashIcon />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
