import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { format } from "date-fns";
import { deleteInvoice, getAllInvoices } from "db";
import { cn } from "lib/utils";
import { FileTextIcon, FolderOpenIcon, TrashIcon } from "lucide-react";
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
      <DialogContent className="flex max-h-[85vh] w-full flex-col rounded-[3px] sm:max-w-[640px]">
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
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-border border-b text-left text-xs">
                  <th className="bg-popover sticky top-0 py-2 pr-4 font-medium whitespace-nowrap">
                    Name
                  </th>
                  <th className="bg-popover sticky top-0 py-2 pr-4 font-medium whitespace-nowrap">
                    Date modified
                  </th>
                  <th className="bg-popover sticky top-0 w-10 py-2">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => {
                  const isCurrent = currentInvoiceId === invoice.id;

                  return (
                    <tr
                      key={invoice.id}
                      onClick={() => handleSelectInvoice(invoice)}
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
                            <span className="text-muted-foreground text-xs">
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
                          onClick={event => handleDeleteInvoice(invoice, event)}
                          disabled={deletePendingId === invoice.id || pending}
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
