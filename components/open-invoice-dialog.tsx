import {
  InvoiceListStripeFiller,
  InvoiceListTable
} from "components/invoice-list-table";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { deleteInvoice, getAllInvoices, saveInvoice } from "db";
import { FolderOpenIcon, Loader2Icon, SparklesIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { InvoiceDocument } from "types";
import { seedDummyInvoice } from "utils/seed-dummy-invoice";

export function OpenInvoiceDialog({
  open,
  onOpenChange,
  onSelectInvoice,
  currentInvoiceId
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectInvoice: (invoice: InvoiceDocument) => void;
  currentInvoiceId: string | null;
}) {
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [seeding, startSeedTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingDelete, setPendingDelete] = useState<InvoiceDocument[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedIds([]);
      setPendingDelete([]);
      loadInvoices();
    }
  }, [open]);

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

    if (pendingDelete.length > 0) {
      if (!target.closest("[data-slot='dialog-footer']")) {
        setPendingDelete([]);
      }

      return;
    }

    if (selectedIds.length === 0) return;

    if (target.closest("tr, button, a, input, textarea, [role='menuitem']")) {
      return;
    }

    setSelectedIds([]);
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

  function handleConfirmDelete() {
    const targets = pendingDelete;
    const targetIds = new Set(targets.map(invoice => invoice.id));

    startTransition(async () => {
      try {
        await Promise.all(targets.map(invoice => deleteInvoice(invoice.id)));
        await loadInvoices();

        setSelectedIds(prev => prev.filter(id => !targetIds.has(id)));
        setPendingDelete([]);
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
      >
        <DialogHeader className="border-border border-b">
          <DialogTitle>Open Invoice</DialogTitle>
          <DialogDescription>
            Select an invoice to open. You can also delete invoices from here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {loading ? (
            <div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 text-sm">
              <Loader2Icon className="size-4 shrink-0 animate-spin" />
              Loading invoices
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
              <FolderOpenIcon className="text-muted-foreground/70 size-8 shrink-0" />
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
                onSelectionChange={setSelectedIds}
                onOpenInvoice={handleOpenInvoice}
                onRenameInvoice={handleRenameInvoice}
                onDeleteInvoices={setPendingDelete}
                deleting={pending}
              />
              <InvoiceListStripeFiller rowCount={invoices.length} />
            </>
          )}
        </div>
        {pendingDelete.length > 0 ? (
          <DialogFooter className="flex-row items-center justify-between sm:justify-between">
            <span className="text-foreground text-sm">
              Delete {pendingDelete.length} invoice
              {pendingDelete.length !== 1 ? "s" : ""}?{" "}
              <span className="text-muted-foreground">
                This cannot be undone.
              </span>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setPendingDelete([])}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={pending}
              >
                Delete
              </Button>
            </div>
          </DialogFooter>
        ) : (
          <DialogFooter className="flex-row items-center justify-between sm:justify-between">
            <span className="text-muted-foreground text-sm">
              {selectedIds.length > 0
                ? `${selectedIds.length} selected`
                : `${invoices.length} invoice${invoices.length !== 1 ? "s" : ""} available`}
            </span>
            <div className="flex items-center gap-2">
              {import.meta.env.DEV && (
                <Button
                  variant="outline"
                  onClick={handleSeedDummyInvoice}
                  disabled={seeding}
                >
                  <SparklesIcon />
                  Add dummy
                </Button>
              )}
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                disabled={selectedIds.length !== 1}
                onClick={handleOpenSelected}
              >
                Open
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
