import { ImportDataDialog } from "components/import-data-dialog";
import { OpenInvoiceDialog } from "components/open-invoice-dialog";
import { OpenTemplateDialog } from "components/open-template-dialog";
import { SaveInvoiceDialog } from "components/save-invoice-dialog";
import { SaveTemplateModal } from "components/save-template-modal";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from "components/ui/menubar";
import type { UnsavedChangesAction } from "components/unsaved-changes-dialog";
import { UnsavedChangesDialog } from "components/unsaved-changes-dialog";
import {
  generateDefaultInvoiceName,
  loadInvoiceDocument,
  resetToNewInvoice,
  saveCurrentInvoiceAsDocument,
  updateCurrentInvoiceDocument,
  useInvoiceDocument
} from "context/invoice-document-context";
import { getAllInvoices, getAllTemplates } from "db";
import { isEqual } from "lodash-es";
import {
  BookmarkIcon,
  DownloadIcon,
  FileIcon,
  FilePlusIcon,
  FolderOpenIcon,
  SaveIcon,
  UploadIcon
} from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useInvoiceDataAndActions } from "stores/invoice-selectors";
import { invoiceDefault } from "stores/invoice-store";
import type { InvoiceDocument, InvoiceTemplate } from "types";
import { ensureItemIds } from "utils/ensure-item-ids";
import { exportAllData } from "utils/export-data";

export function InvoiceFileMenu({
  saveDialogOpen: externalSaveDialogOpen,
  onSaveDialogOpenChange: onExternalSaveDialogOpenChange
}: {
  saveDialogOpen?: boolean;
  onSaveDialogOpenChange?: (open: boolean) => void;
} = {}) {
  const { invoice, setInvoice } = useInvoiceDataAndActions();
  const {
    currentDocumentId,
    setCurrentDocumentId,
    setCurrentDocumentName,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    lastSavedInvoice,
    setLastSavedInvoice
  } = useInvoiceDocument();

  const [openDialogOpen, setOpenDialogOpen] = useState(false);
  const [internalSaveAsDialogOpen, setInternalSaveAsDialogOpen] =
    useState(false);
  const saveAsDialogOpen =
    internalSaveAsDialogOpen || (externalSaveDialogOpen ?? false);

  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [saveTemplateDialogOpen, setSaveTemplateDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [defaultName, setDefaultName] = useState<string>("Invoice 001");
  const [existingInvoices, setExistingInvoices] = useState<InvoiceDocument[]>(
    []
  );
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
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

  const setSaveAsDialogOpen = useCallback(
    (open: boolean) => {
      setInternalSaveAsDialogOpen(open);
      onExternalSaveDialogOpenChange?.(open);
    },
    [onExternalSaveDialogOpenChange]
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
  }, [currentDocumentId, invoice, setLastSavedInvoice, setSaveAsDialogOpen]);

  const handleSaveAs = useCallback(() => {
    setSaveAsDialogOpen(true);
  }, [setSaveAsDialogOpen]);

  const handleExport = useCallback(() => {
    startTransition(async () => {
      try {
        await exportAllData();
        toast.success("Data exported successfully");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to export data"
        );
      }
    });
  }, []);

  function handleSelectTemplate(template: InvoiceTemplate) {
    startTransition(() => {
      try {
        setInvoice(ensureItemIds(template.templateData));
        setCurrentDocumentId(null);
        setCurrentDocumentName(null);
        setLastSavedInvoice(null);
        setHasUnsavedChanges(false);
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
            setCurrentDocumentName(name);

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
        await loadInvoiceDocument(
          invoiceDoc.id,
          setInvoice,
          setCurrentDocumentId,
          setCurrentDocumentName,
          setLastSavedInvoice
        );
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
  }, [saveTemplateDialogOpen]);

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
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="w-auto">
          <MenubarItem onClick={handleNewInvoice} disabled={pending}>
            <FilePlusIcon className="mr-2 h-4 w-4" />
            New Invoice
          </MenubarItem>
          <MenubarItem onClick={handleOpenInvoice} disabled={pending}>
            <FolderOpenIcon className="mr-2 h-4 w-4" />
            Open Invoice
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleSave} disabled={pending}>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save
          </MenubarItem>
          <MenubarItem onClick={handleSaveAs} disabled={pending}>
            <FileIcon className="mr-2 h-4 w-4" />
            Save As...
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
          <MenubarSeparator />
          <MenubarItem onClick={handleExport} disabled={pending}>
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Data
          </MenubarItem>
          <MenubarItem
            onClick={() => setImportDialogOpen(true)}
            disabled={pending}
          >
            <UploadIcon className="mr-2 h-4 w-4" />
            Import Data
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
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
      <OpenTemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        onSelectTemplate={handleSelectTemplate}
      />
      <SaveTemplateModal
        open={saveTemplateDialogOpen}
        onOpenChange={setSaveTemplateDialogOpen}
        currentInvoiceData={invoice}
        templates={templates}
      />
      <ImportDataDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </>
  );
}
