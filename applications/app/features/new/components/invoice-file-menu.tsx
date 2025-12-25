import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from "components/ui/menubar";
import { OpenInvoiceDialog } from "features/new/components/open-invoice-dialog";
import { SaveInvoiceDialog } from "features/new/components/save-invoice-dialog";
import type { UnsavedChangesAction } from "features/new/components/unsaved-changes-dialog";
import { UnsavedChangesDialog } from "features/new/components/unsaved-changes-dialog";
import { getAllInvoices } from "features/new/db";
import {
  currentInvoiceDocumentIdAtom,
  currentInvoiceDocumentNameAtom,
  generateDefaultInvoiceName,
  hasUnsavedChangesAtom,
  invoiceAtom,
  invoiceDefault,
  lastSavedInvoiceAtom,
  loadInvoiceDocumentIntoAtom,
  resetToNewInvoice,
  saveCurrentInvoiceAsDocument,
  updateCurrentInvoiceDocument
} from "features/new/state";
import type { InvoiceDocument } from "features/new/types";
import { useAtom, useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import { FileIcon, FilePlusIcon, FolderOpenIcon, SaveIcon } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export function InvoiceFileMenu() {
  const [invoice] = useAtom(invoiceAtom);
  const [currentDocumentId, setCurrentDocumentId] = useAtom(
    currentInvoiceDocumentIdAtom
  );
  const [, setCurrentDocumentName] = useAtom(currentInvoiceDocumentNameAtom);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useAtom(
    hasUnsavedChangesAtom
  );
  const [lastSavedInvoice, setLastSavedInvoice] = useAtom(lastSavedInvoiceAtom);
  const setInvoice = useSetAtom(invoiceAtom);

  const [openDialogOpen, setOpenDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [defaultName, setDefaultName] = useState<string>("Invoice 001");
  const [existingInvoices, setExistingInvoices] = useState<InvoiceDocument[]>(
    []
  );
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    async function loadData() {
      try {
        const invoices = await getAllInvoices();
        setExistingInvoices(invoices);
        const name = generateDefaultInvoiceName(invoices);
        setDefaultName(name);
      } catch {
        // Silently fail - default name will be used
      }
    }
    loadData();
  }, [saveAsDialogOpen]);

  const handleNewInvoice = useCallback(() => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        resetToNewInvoice(
          setInvoice,
          setCurrentDocumentId,
          setCurrentDocumentName,
          setLastSavedInvoice
        );
        setHasUnsavedChanges(false);
      });
      setUnsavedDialogOpen(true);
      return;
    }

    resetToNewInvoice(
      setInvoice,
      setCurrentDocumentId,
      setCurrentDocumentName,
      setLastSavedInvoice
    );
    setHasUnsavedChanges(false);
  }, [
    hasUnsavedChanges,
    setInvoice,
    setCurrentDocumentId,
    setCurrentDocumentName,
    setLastSavedInvoice,
    setHasUnsavedChanges
  ]);

  const handleOpenInvoice = useCallback(() => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setOpenDialogOpen(true);
      });
      setUnsavedDialogOpen(true);
      return;
    }

    setOpenDialogOpen(true);
  }, [hasUnsavedChanges]);

  const handleSave = useCallback(() => {
    if (!currentDocumentId) return setSaveAsDialogOpen(true);

    startTransition(async () => {
      try {
        await updateCurrentInvoiceDocument(
          currentDocumentId,
          invoice,
          setLastSavedInvoice
        );
        toast.success("Invoice saved successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save invoice"
        );
      }
    });
  }, [currentDocumentId, invoice, setLastSavedInvoice]);

  const handleSaveAs = useCallback(() => {
    setSaveAsDialogOpen(true);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modKey = isMac ? event.metaKey : event.ctrlKey;

      if (!modKey) return;

      if (event.key === "n" && !event.shiftKey) {
        event.preventDefault();
        handleNewInvoice();
      } else if (event.key === "o") {
        event.preventDefault();
        handleOpenInvoice();
      } else if (event.key === "s" && !event.shiftKey) {
        event.preventDefault();
        handleSave();
      } else if (event.key === "s" && event.shiftKey) {
        event.preventDefault();
        handleSaveAs();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNewInvoice, handleOpenInvoice, handleSave, handleSaveAs]);

  useEffect(() => {
    // If we're in a blank invoice (no document ID), compare with default
    if (currentDocumentId === null) {
      const hasChanges = !isEqual(invoice, invoiceDefault);
      return setHasUnsavedChanges(hasChanges);
    }

    // If we're in an existing invoice, compare with last saved version
    if (lastSavedInvoice === null) {
      // No saved version yet, so there are changes
      return setHasUnsavedChanges(true);
    }

    const hasChanges = !isEqual(invoice, lastSavedInvoice);
    setHasUnsavedChanges(hasChanges);
  }, [invoice, currentDocumentId, lastSavedInvoice, setHasUnsavedChanges]);

  async function handleSaveInvoice(name: string, overwriteId?: string) {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          if (overwriteId) {
            await updateCurrentInvoiceDocument(
              overwriteId,
              invoice,
              setLastSavedInvoice
            );
            setCurrentDocumentId(overwriteId);
            // Update name from existing invoices
            const invoices = await getAllInvoices();
            const existingInvoice = invoices.find(
              inv => inv.id === overwriteId
            );
            if (existingInvoice) {
              setCurrentDocumentName(existingInvoice.name);
            }
            toast.success("Invoice saved successfully");
            resolve();
          } else {
            await saveCurrentInvoiceAsDocument(
              invoice,
              name,
              null,
              setCurrentDocumentId,
              setCurrentDocumentName,
              setLastSavedInvoice
            );
            toast.success("Invoice saved successfully");
            resolve();
          }
        } catch (error) {
          toast.error(
            error instanceof Error ? error.message : "Failed to save invoice"
          );
          reject(error);
        }
      });
    });
  }

  function handleSelectInvoice(invoiceDoc: InvoiceDocument) {
    startTransition(async () => {
      try {
        await loadInvoiceDocumentIntoAtom(
          invoiceDoc.id,
          setInvoice,
          setCurrentDocumentId,
          setCurrentDocumentName,
          setLastSavedInvoice
        );
        toast.success(`Opened invoice: ${invoiceDoc.name}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to open invoice"
        );
      }
    });
  }

  function handleUnsavedAction(action: UnsavedChangesAction) {
    if (action === "save") {
      handleSave();
      // Note: handleSave uses startTransition, so we execute pendingAction after a short delay
      // to ensure the save has been initiated
      setTimeout(() => {
        if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      }, 100);
    } else if (action === "discard") {
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    }
  }

  return (
    <>
      <Menubar className="h-full rounded-none border-0 bg-transparent p-0 shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="text-foreground hover:bg-accent/50 data-[state=open]:bg-accent/50 rounded-none border-0 px-3 py-1.5 text-sm font-normal">
            File
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={handleNewInvoice} disabled={pending}>
              <FilePlusIcon className="mr-2 h-4 w-4" />
              New Invoice
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleOpenInvoice} disabled={pending}>
              <FolderOpenIcon className="mr-2 h-4 w-4" />
              Open Invoice
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleSave} disabled={pending}>
              <SaveIcon className="mr-2 h-4 w-4" />
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleSaveAs} disabled={pending}>
              <FileIcon className="mr-2 h-4 w-4" />
              Save As...
              <MenubarShortcut>⇧⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <OpenInvoiceDialog
        open={openDialogOpen}
        onOpenChange={setOpenDialogOpen}
        onSelectInvoice={handleSelectInvoice}
        currentInvoiceId={currentDocumentId}
      />
      <SaveInvoiceDialog
        open={saveAsDialogOpen}
        onOpenChange={setSaveAsDialogOpen}
        defaultName={defaultName}
        existingInvoices={existingInvoices}
        onSave={handleSaveInvoice}
      />
      <UnsavedChangesDialog
        open={unsavedDialogOpen}
        onOpenChange={setUnsavedDialogOpen}
        onAction={handleUnsavedAction}
      />
    </>
  );
}
