import { InvoiceListTable } from "components/invoice-list-table";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { deleteInvoice, getAllInvoices } from "db";
import { FolderOpenIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import type { InvoiceDocument } from "types";

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
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
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

  function handleSelectInvoice(invoice: InvoiceDocument) {
    onSelectInvoice(invoice);
    onOpenChange(false);
  }

  function handleDeleteInvoice(invoice: InvoiceDocument, event: MouseEvent) {
    event.stopPropagation();

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] min-h-112 w-full flex-col sm:max-w-3xl">
        <DialogHeader className="border-border border-b pb-4">
          <DialogTitle>Open Invoice</DialogTitle>
          <DialogDescription>
            Select an invoice to open. You can also delete invoices from here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
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
            <InvoiceListTable
              invoices={invoices}
              currentInvoiceId={currentInvoiceId}
              onSelectInvoice={handleSelectInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              deletePendingId={deletePendingId}
              deleting={pending}
            />
          )}
        </div>
        <DialogFooter className="flex-row items-center justify-between rounded-b-[3px] sm:justify-between">
          <span className="text-muted-foreground text-sm">
            {invoices.length} invoice{invoices.length !== 1 ? "s" : ""}{" "}
            available
          </span>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
