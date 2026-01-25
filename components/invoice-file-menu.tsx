import { OpenInvoiceDialog } from "components/open-invoice-dialog";
import { SaveInvoiceDialog } from "components/save-invoice-dialog";
import { SaveTemplateModal } from "components/save-template-modal";
import { TemplateSelectionModal } from "components/template-selection-modal";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from "components/ui/menubar";
import type { UnsavedChangesAction } from "components/unsaved-changes-dialog";
import { UnsavedChangesDialog } from "components/unsaved-changes-dialog";
import { getAllInvoices, getAllTemplates } from "db";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { isEqual } from "lodash-es";
import {
  BookmarkIcon,
  FileIcon,
  FilePlusIcon,
  FolderOpenIcon,
  SaveIcon
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  currentInvoiceDocumentIdAtom,
  currentInvoiceDocumentNameAtom,
  generateDefaultInvoiceName,
  hasUnsavedChangesAtom,
  invoiceAtom,
  invoiceDefault,
  invoiceTemplatesAtom,
  lastSavedInvoiceAtom,
  loadInvoiceDocumentIntoAtom,
  resetToNewInvoice,
  saveCurrentInvoiceAsDocument,
  updateCurrentInvoiceDocument
} from "state";
import type { InvoiceDocument, InvoiceTemplate } from "types";

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
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [defaultName, setDefaultName] = useState<string>("Invoice 001");
  const [existingInvoices, setExistingInvoices] = useState<InvoiceDocument[]>(
    []
  );
  const templates = useAtomValue(invoiceTemplatesAtom);
  const setTemplates = useSetAtom(invoiceTemplatesAtom);
  const [pending, startTransition] = useTransition();

  const runWithUnsavedGuard = useCallback(
    (action: () => void) => {
      if (hasUnsavedChanges) {
        setPendingAction(() => action);
        setUnsavedDialogOpen(true);
      } else {
        action();
      }
    },
    [hasUnsavedChanges]
  );

  const handleNewInvoice = useCallback(() => {
    runWithUnsavedGuard(() => {
      resetToNewInvoice(
        setInvoice,
        setCurrentDocumentId,
        setCurrentDocumentName,
        setLastSavedInvoice
      );
      setHasUnsavedChanges(false);
    });
  }, [
    runWithUnsavedGuard,
    setInvoice,
    setCurrentDocumentId,
    setCurrentDocumentName,
    setLastSavedInvoice,
    setHasUnsavedChanges
  ]);

  const handleOpenInvoice = useCallback(() => {
    runWithUnsavedGuard(() => {
      setOpenDialogOpen(true);
    });
  }, [runWithUnsavedGuard]);

  const handleOpenTemplate = useCallback(() => {
    runWithUnsavedGuard(() => {
      setTemplateDialogOpen(true);
    });
  }, [runWithUnsavedGuard]);

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
  }, [currentDocumentId, invoice, setLastSavedInvoice, startTransition]);

  const handleSaveAs = useCallback(() => {
    setSaveAsDialogOpen(true);
  }, []);

  function handleSelectTemplate(template: InvoiceTemplate) {
    startTransition(() => {
      try {
        setInvoice(template.templateData);
        setCurrentDocumentId(null);
        setCurrentDocumentName(null);
        setLastSavedInvoice(null);
        setHasUnsavedChanges(false);

        toast.success(`Applied template: ${template.name}`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to apply template"
        );
      }
    });
  }

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

  useEffect(() => {
    async function loadData() {
      try {
        const invoices = await getAllInvoices();

        setExistingInvoices(invoices);
        setDefaultName(generateDefaultInvoiceName(invoices));
      } catch {
        // Silently fail - default name will be used
      }
    }
    loadData();
  }, [saveAsDialogOpen]);

  useEffect(() => {
    async function loadTemplates() {
      try {
        setTemplates(await getAllTemplates());
      } catch {
        // Silently fail
      }
    }
    loadTemplates();
  }, [setTemplates, templateDialogOpen, saveTemplateDialogOpen]);

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
            <MenubarSeparator />
            <MenubarItem onClick={handleOpenTemplate} disabled={pending}>
              <BookmarkIcon className="mr-2 h-4 w-4" />
              Open Template
            </MenubarItem>
            <MenubarItem
              onClick={() => setSaveTemplateDialogOpen(true)}
              disabled={pending}
            >
              <SaveIcon className="mr-2 h-4 w-4" />
              Save As Template
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
      <TemplateSelectionModal
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        templates={templates}
        onTemplateSelect={handleSelectTemplate}
      />
      <SaveTemplateModal
        open={saveTemplateDialogOpen}
        onOpenChange={setSaveTemplateDialogOpen}
        currentInvoiceData={invoice}
        templates={templates}
      />
    </>
  );
}
