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
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pendingBulkDelete, setPendingBulkDelete] = useState<InvoiceDocument[]>(
    []
  );

  useEffect(() => {
    if (open) {
      setSelectedIds([]);
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

  function handleDeselectClick(event: MouseEvent<HTMLDivElement>) {
    if (selectedIds.length === 0) return;

    const target = event.target as HTMLElement;

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

  function handleDeleteInvoice(invoice: InvoiceDocument) {
    startTransition(async () => {
      try {
        setDeletePendingId(invoice.id);

        await deleteInvoice(invoice.id);
        await loadInvoices();

        setSelectedIds(prev => prev.filter(id => id !== invoice.id));
        toast.success("Invoice deleted successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete invoice"
        );
      } finally {
        setDeletePendingId(null);
      }
    });
  }

  function handleConfirmBulkDelete() {
    const targets = pendingBulkDelete;

    startTransition(async () => {
      try {
        await Promise.all(targets.map(invoice => deleteInvoice(invoice.id)));
        await loadInvoices();

        setSelectedIds([]);
        setPendingBulkDelete([]);
        toast.success(`Deleted ${targets.length} invoices`);
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
        onClick={handleDeselectClick}
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
                onDeleteInvoice={handleDeleteInvoice}
                onDeleteInvoices={setPendingBulkDelete}
                deletePendingId={deletePendingId}
                deleting={pending}
              />
              <InvoiceListStripeFiller rowCount={invoices.length} />
            </>
          )}
        </div>
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
        <Dialog
          open={pendingBulkDelete.length > 0}
          onOpenChange={isOpen => {
            if (!isOpen) setPendingBulkDelete([]);
          }}
        >
          <DialogContent showCloseButton={false} className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                Delete {pendingBulkDelete.length} invoice
                {pendingBulkDelete.length !== 1 ? "s" : ""}?
              </DialogTitle>
              <DialogDescription>
                This permanently removes the selected invoices from this device.
                This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setPendingBulkDelete([])}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmBulkDelete}
                disabled={pending}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}
