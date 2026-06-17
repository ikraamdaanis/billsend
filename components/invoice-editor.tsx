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
import { InvoiceTitle } from "components/invoice-title";
import { RenameInvoiceDialog } from "components/rename-invoice-dialog";
import { SettingsPanel } from "components/settings-panel";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger
} from "components/ui/drawer";
import {
  updateCurrentInvoiceDocument,
  useInvoiceDocument
} from "context/invoice-document-context";
import { useUI } from "context/ui-context";
import { getInvoice, saveInvoice } from "db";
import { useInvoiceHistory } from "hooks/use-invoice-history";
import {
  CheckIcon,
  Loader2Icon,
  PenLineIcon,
  Redo2Icon,
  SlidersHorizontalIcon,
  Undo2Icon
} from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useInvoiceDataAndActions } from "stores/invoice-selectors";

const TOOLBAR_HEIGHT = 50;

export function InvoiceEditor() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="h-dvh w-full">
        <Toolbar setIsModalOpen={setIsModalOpen} />
        <div
          className="relative flex w-full grid-cols-[1fr_240px] flex-col bg-zinc-200 lg:grid"
          style={{
            height: `calc(100dvh - ${TOOLBAR_HEIGHT}px)`
          }}
        >
          <CanvasArea />
          <SettingsArea />
        </div>
      </div>
      <MobileSettingsDrawer />
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
        <span className="bg-border hidden h-5 w-px sm:block" />
        <UndoRedoButtons />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <button
          type="button"
          onClick={handleTitleClick}
          className="group hover:bg-accent flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 transition-colors"
        >
          <h2 className="text-foreground text-sm font-medium">{displayName}</h2>
          <PenLineIcon className="text-muted-foreground size-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
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

function UndoRedoButtons() {
  const { undo, redo, canUndo, canRedo } = useInvoiceHistory();

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-7"
        onClick={undo}
        disabled={!canUndo}
        aria-label="Undo"
        title="Undo (⌘Z)"
      >
        <Undo2Icon className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-7"
        onClick={redo}
        disabled={!canRedo}
        aria-label="Redo"
        title="Redo (⇧⌘Z)"
      >
        <Redo2Icon className="size-4" />
      </Button>
    </div>
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

function CanvasArea() {
  const { setActiveSettings } = useUI();

  function handleSectionClick() {
    setActiveSettings("main");
  }

  return (
    <InvoiceCanvas onSectionClick={handleSectionClick}>
      <Top />
      <Mid />
      <Bottom />
    </InvoiceCanvas>
  );
}

function SettingsArea() {
  return (
    <section className="bg-background border-border relative z-20 hidden h-full overflow-y-auto border-l pb-4 lg:block">
      <SettingsPanel />
    </section>
  );
}

function MobileSettingsDrawer() {
  return (
    <div className="bg-background border-border fixed bottom-0 flex h-12 w-full items-center justify-center border-t lg:hidden">
      <Drawer>
        <DrawerTrigger className="text-muted-foreground flex h-full w-full cursor-pointer items-center justify-center gap-2 text-sm font-medium">
          <SlidersHorizontalIcon className="size-4" />
          Settings
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">Settings</DrawerTitle>
          <SettingsPanel />
        </DrawerContent>
      </Drawer>
    </div>
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
