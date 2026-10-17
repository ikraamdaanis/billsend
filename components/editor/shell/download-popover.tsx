import { IconDownload, IconFileTypePdf } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover";
import { formatCurrencyWithCode } from "~/consts/currencies";
import { useFileActions } from "~/context/file-actions-context";
import {
  useDocumentName,
  useInvoiceDocument
} from "~/context/invoice-document-context";
import { getInvoice } from "~/db";
import { useInvoicePdf } from "~/hooks/use-invoice-pdf";
import { useCurrencySlice, useInvoiceTotals } from "~/stores/invoice-selectors";

// Download opens a small summary first, like Framer's Publish: what file you
// get, its total and when it was last saved, then the PDF itself.
export function DownloadPopover() {
  const [open, setOpen] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const { pending, openPdf, prefetch } = useInvoicePdf();
  const { exportData } = useFileActions();
  const { libraryDocumentId } = useInvoiceDocument();
  const documentName = useDocumentName();
  const { total } = useInvoiceTotals();
  const { currency, currencyCode } = useCurrencySlice();
  const fileName = `${documentName}.pdf`;

  function handleOpenChange(next: boolean) {
    setOpen(next);

    if (!next) return;

    prefetch();
    setSavedAt(null);

    if (libraryDocumentId) {
      void getInvoice(libraryDocumentId)
        .then(document => setSavedAt(document?.updatedAt ?? null))
        .catch(() => setSavedAt(null));
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        onPointerEnter={prefetch}
        render={
          <Button
            variant="primary"
            size="sm"
            className="h-8 px-3 pointer-coarse:h-11 pointer-coarse:px-4"
          />
        }
      >
        <IconDownload aria-hidden="true" className="sm:hidden" />
        <span className="max-sm:sr-only">Download</span>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 gap-3 p-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-md">
            <IconFileTypePdf aria-hidden="true" className="size-5" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="text-foreground truncate font-medium">
              {fileName}
            </span>
            <span className="text-muted-foreground text-xs">
              PDF · A4 · opens in a new tab
            </span>
          </div>
        </div>
        <dl className="border-border flex flex-col gap-1.5 border-y py-2.5 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Total</dt>
            <dd className="text-foreground tabular-nums">
              {formatCurrencyWithCode(total, currency, currencyCode)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-muted-foreground">Last saved</dt>
            <dd className="text-foreground">
              {libraryDocumentId
                ? savedAt
                  ? formatDistanceToNow(savedAt, { addSuffix: true })
                  : "…"
                : "Saves once you edit it"}
            </dd>
          </div>
        </dl>
        <div className="flex flex-col gap-1.5">
          <Button
            variant="primary"
            disabled={pending}
            onClick={() => {
              openPdf();
              setOpen(false);
            }}
          >
            <IconDownload aria-hidden="true" />
            Download PDF
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              exportData();
              setOpen(false);
            }}
          >
            Export Data
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
