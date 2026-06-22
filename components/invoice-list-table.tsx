import { Button } from "components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "components/ui/context-menu";
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
import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import type { InvoiceDocument } from "types";

type SortKey = "name" | "updatedAt";
type SortDirection = "asc" | "desc";

const STRIPE_ROW_HEIGHT = 48;
const STRIPE_COLOR = "color-mix(in oklab, var(--muted) 50%, transparent)";

export function InvoiceListStripeFiller({ rowCount }: { rowCount: number }) {
  const single = STRIPE_ROW_HEIGHT;
  const double = STRIPE_ROW_HEIGHT * 2;
  const stops =
    rowCount % 2 === 1
      ? `${STRIPE_COLOR} 0, ${STRIPE_COLOR} ${single}px, transparent ${single}px, transparent ${double}px`
      : `transparent 0, transparent ${single}px, ${STRIPE_COLOR} ${single}px, ${STRIPE_COLOR} ${double}px`;
  const backgroundImage = `repeating-linear-gradient(to bottom, ${stops})`;

  return <div aria-hidden className="flex-1" style={{ backgroundImage }} />;
}

export function InvoiceListTable({
  invoices,
  currentInvoiceId,
  selectedIds,
  onSelectionChange,
  onOpenInvoice,
  onRenameInvoice,
  onDeleteInvoice,
  onDeleteInvoices,
  deletePendingId,
  deleting
}: {
  invoices: InvoiceDocument[];
  currentInvoiceId: string | null;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onOpenInvoice: (invoice: InvoiceDocument) => void;
  onRenameInvoice: (invoice: InvoiceDocument, newName: string) => void;
  onDeleteInvoice: (invoice: InvoiceDocument) => void;
  onDeleteInvoices: (invoices: InvoiceDocument[]) => void;
  deletePendingId: string | null;
  deleting: boolean;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const editingIdRef = useRef<string | null>(null);
  const anchorIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingId) return;

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
    if (editingIdRef.current !== invoice.id) return;

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

  const selectedSet = new Set(selectedIds);
  const selectedInvoices = sortedInvoices.filter(invoice =>
    selectedSet.has(invoice.id)
  );

  function selectRange(targetId: string) {
    const anchorId = anchorIdRef.current;
    const anchorIndex = sortedInvoices.findIndex(
      invoice => invoice.id === anchorId
    );
    const targetIndex = sortedInvoices.findIndex(
      invoice => invoice.id === targetId
    );

    if (anchorIndex === -1) {
      onSelectionChange([targetId]);

      return;
    }

    const start = Math.min(anchorIndex, targetIndex);
    const end = Math.max(anchorIndex, targetIndex);

    onSelectionChange(
      sortedInvoices.slice(start, end + 1).map(invoice => invoice.id)
    );
  }

  function handleRowClick(
    event: MouseEvent<HTMLTableRowElement>,
    invoice: InvoiceDocument
  ) {
    if (editingId) return;

    if (event.shiftKey && anchorIdRef.current) {
      selectRange(invoice.id);

      return;
    }

    if (event.metaKey || event.ctrlKey) {
      anchorIdRef.current = invoice.id;

      onSelectionChange(
        selectedSet.has(invoice.id)
          ? selectedIds.filter(selectedId => selectedId !== invoice.id)
          : [...selectedIds, invoice.id]
      );

      return;
    }

    anchorIdRef.current = invoice.id;

    const isOnlySelection =
      selectedSet.has(invoice.id) && selectedIds.length === 1;

    onSelectionChange(isOnlySelection ? [] : [invoice.id]);
  }

  function handleRowContextMenu(invoice: InvoiceDocument) {
    if (selectedSet.has(invoice.id)) return;

    anchorIdRef.current = invoice.id;
    onSelectionChange([invoice.id]);
  }

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
        {sortedInvoices.map((invoice, index) => {
          const isCurrent = currentInvoiceId === invoice.id;
          const isSelected = selectedSet.has(invoice.id);
          const isEditing = editingId === invoice.id;
          const isStriped = index % 2 === 1;
          const showBulkDelete = isSelected && selectedIds.length > 1;

          return (
            <ContextMenu key={invoice.id}>
              <ContextMenuTrigger
                render={
                  <tr
                    onClick={event => handleRowClick(event, invoice)}
                    onDoubleClick={() => {
                      if (isEditing) return;

                      onOpenInvoice(invoice);
                    }}
                    onContextMenu={() => handleRowContextMenu(invoice)}
                    className={cn(
                      "group/row cursor-pointer select-none",
                      !isSelected && isStriped && "bg-muted/50",
                      !isSelected && "hover:bg-accent",
                      isSelected && "bg-brand-500 text-primary-foreground"
                    )}
                  />
                }
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
                      <FileTextIcon
                        className={cn(
                          "size-4 shrink-0",
                          isSelected
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                        )}
                      />
                      <span className="font-medium">{invoice.name}</span>
                      {isCurrent && (
                        <span
                          className={cn(
                            "text-sm",
                            isSelected
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          Current
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td
                  className={cn(
                    "py-2.5 pr-4 whitespace-nowrap tabular-nums",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}
                >
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
                          className={cn(
                            "opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 aria-expanded:opacity-100",
                            isSelected
                              ? "text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        />
                      }
                    >
                      <MoreHorizontalIcon className="size-4" />
                      <span className="sr-only">
                        Actions for {invoice.name}
                      </span>
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
              </ContextMenuTrigger>
              <ContextMenuContent>
                {showBulkDelete ? (
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => onDeleteInvoices(selectedInvoices)}
                  >
                    <TrashIcon />
                    Delete {selectedIds.length} invoices
                  </ContextMenuItem>
                ) : (
                  <>
                    <ContextMenuItem onClick={() => startRename(invoice)}>
                      <PencilIcon />
                      Rename
                    </ContextMenuItem>
                    <ContextMenuItem
                      variant="destructive"
                      onClick={() => onDeleteInvoice(invoice)}
                    >
                      <TrashIcon />
                      Delete
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
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
