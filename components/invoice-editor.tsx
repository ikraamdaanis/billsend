import { Link } from "@tanstack/react-router";
import { DownloadInvoice } from "components/download-invoice";
import { InvoiceCanvas } from "components/invoice-canvas";
import { InvoiceClientDetails } from "components/invoice-client-details";
import { InvoiceDetails } from "components/invoice-details";
import { InvoiceFileMenu } from "components/invoice-file-menu";
import { InvoiceImage } from "components/invoice-image";
import { InvoiceLineItems } from "components/invoice-line-items";
import { InvoicePricing } from "components/invoice-pricing";
import { InvoiceSellerDetails } from "components/invoice-seller-details";
import { InvoiceTerms } from "components/invoice-terms";
import { InvoiceThemeControls } from "components/invoice-theme-controls";
import { InvoiceTitle } from "components/invoice-title";
import { RenameInvoiceDialog } from "components/rename-invoice-dialog";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "components/ui/select";
import { currencySymbols } from "consts/currencies";
import {
  updateCurrentInvoiceDocument,
  useInvoiceDocument
} from "context/invoice-document-context";
import { getInvoice, saveInvoice } from "db";
import { CheckIcon, Loader2Icon } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useCurrencySlice,
  useInvoiceDataAndActions
} from "stores/invoice-selectors";
import type { Currency } from "types";

const TOOLBAR_HEIGHT = 50;

export function InvoiceEditor() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="h-dvh w-full">
        <Toolbar setIsModalOpen={setIsModalOpen} />
        <div
          className="relative flex w-full flex-col bg-zinc-200"
          style={{
            height: `calc(100dvh - ${TOOLBAR_HEIGHT}px)`
          }}
        >
          <CanvasArea />
        </div>
      </div>
      <LeavePageDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

function Toolbar({
  setIsModalOpen
}: {
  setIsModalOpen: (open: boolean) => void;
}) {
  const { currentDocumentId, currentDocumentName, setCurrentDocumentName } =
    useInvoiceDocument();
  const displayName = currentDocumentName || "Untitled invoice";
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  async function handleRename(newName: string) {
    const trimmedName = newName.trim();

    if (currentDocumentId) {
      const existingDoc = await getInvoice(currentDocumentId);
      if (!existingDoc) {
        throw new Error("Invoice document not found");
      }
      await saveInvoice({
        ...existingDoc,
        name: trimmedName,
        updatedAt: new Date()
      });
    }

    setCurrentDocumentName(trimmedName);
    toast.success("Invoice renamed successfully");
  }

  function handleTitleClick() {
    if (currentDocumentId) {
      setRenameDialogOpen(true);
    } else {
      setSaveDialogOpen(true);
    }
  }

  return (
    <nav
      className="bg-background border-border sticky top-0 z-50 flex w-full items-center justify-between border-b px-4"
      style={{ height: `${TOOLBAR_HEIGHT}px` }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="unstyled"
          size="unstyled"
          onClick={() => setIsModalOpen(true)}
        >
          <h1 className="font-bricolage-grotesque text-brand-500 text-lg font-bold">
            billsend
          </h1>
        </Button>
        <InvoiceFileMenu
          saveDialogOpen={saveDialogOpen}
          onSaveDialogOpenChange={setSaveDialogOpen}
        />
      </div>
      <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
        <button
          type="button"
          onClick={handleTitleClick}
          className="hover:bg-accent flex cursor-text items-center rounded-md px-2 py-1 transition-colors"
        >
          <h2 className="text-foreground text-sm font-medium">{displayName}</h2>
        </button>
        <span className="bg-border h-4 w-px" aria-hidden="true" />
        <CurrencyPicker />
        <span className="bg-border h-4 w-px" aria-hidden="true" />
        <InvoiceThemeControls />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <SaveStatus onRequestSaveAs={() => setSaveDialogOpen(true)} />
        <DownloadInvoice />
      </div>
      <RenameInvoiceDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={displayName}
        onRename={handleRename}
      />
    </nav>
  );
}

function SaveStatus({ onRequestSaveAs }: { onRequestSaveAs: () => void }) {
  const { currentDocumentId, hasUnsavedChanges, setLastSavedInvoice } =
    useInvoiceDocument();
  const { invoice } = useInvoiceDataAndActions();
  const [saving, setSaving] = useState(false);

  const handleClick = useCallback(() => {
    if (!currentDocumentId) {
      onRequestSaveAs();

      return;
    }

    if (!hasUnsavedChanges) return;

    setSaving(true);
    updateCurrentInvoiceDocument(
      currentDocumentId,
      invoice,
      setLastSavedInvoice
    )
      .then(() => toast.success("Invoice saved"))
      .catch(error =>
        toast.error(
          error instanceof Error ? error.message : "Failed to save invoice"
        )
      )
      .finally(() => setSaving(false));
  }, [
    currentDocumentId,
    hasUnsavedChanges,
    invoice,
    setLastSavedInvoice,
    onRequestSaveAs
  ]);

  const isSaved = Boolean(currentDocumentId) && !hasUnsavedChanges;
  const label = saving
    ? "Saving"
    : isSaved
      ? "Saved"
      : currentDocumentId
        ? "Unsaved changes"
        : "Not saved";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving || isSaved}
      aria-label={label}
      className="text-muted-foreground hover:bg-accent flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:cursor-default disabled:hover:bg-transparent"
    >
      {saving ? (
        <Loader2Icon className="size-3.5 animate-spin" />
      ) : isSaved ? (
        <CheckIcon className="size-3.5 text-emerald-600" />
      ) : (
        <span className="size-1.5 rounded-full bg-amber-500" />
      )}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function CurrencyPicker() {
  const { currency, setCurrency } = useCurrencySlice();
  const current = currencySymbols.find(item => item.code === currency);

  return (
    <Select
      value={currency}
      onValueChange={value => setCurrency(value as Currency)}
    >
      <SelectTrigger
        aria-label="Currency"
        className="hover:bg-accent focus-visible:bg-accent h-7 gap-1.5 rounded-md border-0 bg-transparent px-2 shadow-none focus-visible:ring-0 focus-visible:outline-none"
      >
        <span className="text-foreground text-sm font-medium">
          {current?.symbol}
        </span>
        <span className="text-muted-foreground text-xs">
          {current?.currency}
        </span>
      </SelectTrigger>
      <SelectContent align="center" className="max-h-72">
        {currencySymbols.map(({ code, symbol, currency: currencyName }) => (
          <SelectItem key={code} value={code} className="text-xs">
            {symbol} - {currencyName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CanvasArea() {
  return (
    <InvoiceCanvas>
      <Top />
      <Mid />
      <Bottom />
    </InvoiceCanvas>
  );
}

function LeavePageDialog({
  isModalOpen,
  setIsModalOpen
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-md">
        <DialogTitle>Leave this page?</DialogTitle>
        <DialogDescription>
          Are you sure you want to leave this page and go back to the home page?
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Link to="/">
            <Button variant="destructive">Leave</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Top() {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
      <div className="flex w-full flex-col gap-4">
        <InvoiceTitle />
        <InvoiceSellerDetails />
      </div>
      <InvoiceImage />
    </div>
  );
}

function Mid() {
  return (
    <>
      <div className="mt-2 grid gap-8 sm:grid-cols-2">
        <InvoiceClientDetails />
        <InvoiceDetails />
      </div>
    </>
  );
}

function Bottom() {
  return (
    <>
      <div className="mt-6 max-w-full">
        <InvoiceLineItems />
        <InvoicePricing />
      </div>
      <div className="mt-6">
        <InvoiceTerms />
      </div>
    </>
  );
}
