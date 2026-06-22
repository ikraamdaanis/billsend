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
import { FolderOpenIcon, SparklesIcon } from "lucide-react";
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
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (open) {
      setSelectedInvoiceId(null);
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

  function handleOpenSelected() {
    const selectedInvoice = invoices.find(
      invoice => invoice.id === selectedInvoiceId
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
      <DialogContent className="flex max-h-[85vh] min-h-112 w-full flex-col sm:max-w-3xl">
        <DialogHeader className="border-border border-b">
          <DialogTitle>Open Invoice</DialogTitle>
          <DialogDescription>
            Select an invoice to open. You can also delete invoices from here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading invoices...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FolderOpenIcon className="text-muted-foreground mb-4 size-12" />
              <h3 className="text-foreground mb-2 text-lg font-medium">
                No invoices available
              </h3>
              <p className="text-muted-foreground">
                You haven&#39;t saved any invoices yet. Create a new invoice and
                save it to get started.
              </p>
            </div>
          ) : (
            <>
              <InvoiceListTable
                invoices={invoices}
                currentInvoiceId={currentInvoiceId}
                selectedInvoiceId={selectedInvoiceId}
                onSelectInvoice={invoice =>
                  setSelectedInvoiceId(current =>
                    current === invoice.id ? null : invoice.id
                  )
                }
                onOpenInvoice={handleOpenInvoice}
                onRenameInvoice={handleRenameInvoice}
                onDeleteInvoice={handleDeleteInvoice}
                deletePendingId={deletePendingId}
                deleting={pending}
              />
              <InvoiceListStripeFiller rowCount={invoices.length} />
            </>
          )}
        </div>
        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <span className="text-muted-foreground text-sm">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}{" "}
            available
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
            <Button disabled={!selectedInvoiceId} onClick={handleOpenSelected}>
              Open
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
