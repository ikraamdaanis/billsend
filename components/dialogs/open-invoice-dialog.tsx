import { IconFolderOpen, IconLoader2 } from "@tabler/icons-react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  InvoiceListStripeFiller,
  InvoiceListTable
} from "~/components/tables/invoice-list-table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { deleteInvoice, getAllInvoices, saveInvoice } from "~/db";
import type { InvoiceDocument } from "~/types";
import { seedDummyInvoice } from "~/utils/seed-dummy-invoice";

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function OpenInvoiceDialog({
  open,
  onOpenChange,
  onSelectInvoice,
  currentInvoiceId,
  onCurrentInvoiceDeleted,
  onCurrentInvoiceRenamed
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInvoice: (invoice: InvoiceDocument) => void;
  currentInvoiceId: string | null;
  onCurrentInvoiceDeleted: () => void;
  onCurrentInvoiceRenamed: (newName: string) => void;
}) {
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [seeding, startSeedTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<
    { mode: "selection" } | { mode: "single"; invoice: InvoiceDocument } | null
  >(null);

  useEffect(() => {
    if (open) {
      setSelectedIds([]);
      setDeleteTarget(null);
      loadInvoices();
    }
  }, [open]);

  useEffect(() => {
    if (deleteTarget?.mode === "selection" && selectedIds.length === 0) {
      setDeleteTarget(null);
    }
  }, [deleteTarget, selectedIds]);

  const pendingDeleteInvoices =
    deleteTarget === null
      ? []
      : deleteTarget.mode === "single"
        ? [deleteTarget.invoice]
        : invoices.filter(invoice => selectedIds.includes(invoice.id));

  const deletePrompt =
    pendingDeleteInvoices.length === 1
      ? `Delete “${truncate(pendingDeleteInvoices[0].name, 42)}”?`
      : `Delete ${pendingDeleteInvoices.length} invoices?`;

  const footerLabel =
    pendingDeleteInvoices.length > 0 || selectedIds.length === 0
      ? `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""} available`
      : `${selectedIds.length} selected`;

  async function loadInvoices() {
    try {
      setLoading(true);
      const loadedInvoices = await getAllInvoices();
      setInvoices(loadedInvoices);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load invoices from storage."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenInvoice(invoice: InvoiceDocument) {
    onSelectInvoice(invoice);
    onOpenChange(false);
  }

  function handleContentClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    if (pendingDeleteInvoices.length > 0) {
      if (target.closest("[data-slot='delete-confirm']")) return;

      if (target.closest("thead")) return;

      const isSelectionGesture =
        target.closest("tr") &&
        (event.shiftKey || event.metaKey || event.ctrlKey);

      if (isSelectionGesture) return;

      setDeleteTarget(null);

      return;
    }

    if (selectedIds.length === 0) return;

    if (target.closest("tr, button, a, input, textarea, [role='menuitem']")) {
      return;
    }

    setSelectedIds([]);
  }

  function handleContentKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && pendingDeleteInvoices.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      setDeleteTarget(null);
    }
  }

  function handleOpenSelected() {
    if (selectedIds.length !== 1) return;

    const selectedInvoice = invoices.find(
      invoice => invoice.id === selectedIds[0]
    );

    if (!selectedInvoice) {
      return;
    }

    handleOpenInvoice(selectedInvoice);
  }

  function handleSeedDummyInvoice() {
    startSeedTransition(async () => {
      try {
        await seedDummyInvoice();
        await loadInvoices();
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to seed a dummy invoice."
        );
      }
    });
  }

  function handleRequestDelete(targets: InvoiceDocument[]) {
    if (targets.length === 0) return;

    const followsSelection = targets.every(invoice =>
      selectedIds.includes(invoice.id)
    );

    if (followsSelection) {
      setDeleteTarget({ mode: "selection" });

      return;
    }

    setSelectedIds([]);
    setDeleteTarget({ mode: "single", invoice: targets[0] });
  }

  function handleConfirmDelete() {
    const targets = pendingDeleteInvoices;

    if (targets.length === 0) return;

    const targetIds = new Set(targets.map(invoice => invoice.id));

    startTransition(async () => {
      try {
        await Promise.all(targets.map(invoice => deleteInvoice(invoice.id)));
        await loadInvoices();

        if (currentInvoiceId !== null && targetIds.has(currentInvoiceId)) {
          onCurrentInvoiceDeleted();
        }

        setSelectedIds(prev => prev.filter(id => !targetIds.has(id)));
        setDeleteTarget(null);
        toast.success(
          targets.length === 1
            ? "Invoice deleted"
            : `Deleted ${targets.length} invoices`
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete invoices"
        );
      }
    });
  }

  async function handleRenameInvoice(
    invoice: InvoiceDocument,
    newName: string
  ) {
    try {
      await saveInvoice({ ...invoice, name: newName, updatedAt: new Date() });
      await loadInvoices();

      if (invoice.id === currentInvoiceId) {
        onCurrentInvoiceRenamed(newName);
      }

      toast.success("Invoice renamed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to rename invoice"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[85vh] min-h-112 w-full flex-col sm:max-w-3xl"
        onClick={handleContentClick}
        onKeyDown={handleContentKeyDown}
      >
        <DialogHeader className="border-border border-b">
          <DialogTitle>Open Invoice</DialogTitle>
          <DialogDescription>
            Select an invoice to open. You can also delete invoices from here.
          </DialogDescription>
        </DialogHeader>
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {loading ? (
              <div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 text-sm">
                <IconLoader2 className="size-4 shrink-0 animate-spin" />
                Loading invoices
              </div>
            ) : invoices.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <IconFolderOpen className="text-muted-foreground/70 size-8 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-foreground text-base font-medium">
                    No saved invoices yet
                  </h3>
                  <p className="text-muted-foreground max-w-sm text-sm">
                    Save an invoice and it will appear here, ready to reopen
                    anytime.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <InvoiceListTable
                  invoices={invoices}
                  currentInvoiceId={currentInvoiceId}
                  selectedIds={selectedIds}
                  deletingIds={pendingDeleteInvoices.map(invoice => invoice.id)}
                  onSelectionChange={setSelectedIds}
                  onOpenInvoice={handleOpenInvoice}
                  onRenameInvoice={handleRenameInvoice}
                  onDeleteInvoices={handleRequestDelete}
                />
                <InvoiceListStripeFiller rowCount={invoices.length} />
              </>
            )}
          </div>
          {pendingDeleteInvoices.length > 0 && (
            <div
              data-slot="delete-confirm"
              className="border-border bg-popover absolute inset-x-3 bottom-2 z-10 flex items-center justify-between gap-3 rounded-[6px] border px-3 py-1.5 shadow-sm"
            >
              <span className="text-foreground min-w-0 truncate text-sm">
                {deletePrompt}{" "}
                <span className="text-muted-foreground">
                  This cannot be undone.
                </span>
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(null)}
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmDelete}
                  disabled={pending}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <span className="text-muted-foreground text-sm">{footerLabel}</span>
          <div className="flex items-center gap-2">
            {import.meta.env.DEV && (
              <Button
                variant="outline"
                onClick={handleSeedDummyInvoice}
                disabled={seeding}
              >
                Add dummy
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              disabled={selectedIds.length !== 1}
              title={
                selectedIds.length !== 1
                  ? "Select a single invoice to open"
                  : undefined
              }
              onClick={handleOpenSelected}
            >
              Open
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
