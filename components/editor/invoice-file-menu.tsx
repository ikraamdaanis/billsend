import {
  IconBookmark,
  IconDeviceFloppy,
  IconDownload,
  IconFile,
  IconFilePlus,
  IconFolderOpen,
  IconUpload
} from "@tabler/icons-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImportDataDialog } from "~/components/dialogs/import-data-dialog";
import { OpenInvoiceDialog } from "~/components/dialogs/open-invoice-dialog";
import { OpenTemplateDialog } from "~/components/dialogs/open-template-dialog";
import { SaveInvoiceDialog } from "~/components/dialogs/save-invoice-dialog";
import { SaveTemplateModal } from "~/components/dialogs/save-template-modal";
import type { UnsavedChangesAction } from "~/components/dialogs/unsaved-changes-dialog";
import { UnsavedChangesDialog } from "~/components/dialogs/unsaved-changes-dialog";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from "~/components/ui/menubar";
import {
  DocumentNotFoundError,
  generateDefaultInvoiceName,
  useHasUnsavedChanges,
  useInvoiceDocument
} from "~/context/invoice-document-context";
import { getAllInvoices, getAllTemplates } from "~/db";
import { useInvoiceDataAndActions } from "~/stores/invoice-selectors";
import type { InvoiceDocument, InvoiceTemplate } from "~/types";
import { ensureItemIds } from "~/utils/ensure-item-ids";
import { exportAllData } from "~/utils/export-data";

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
    setLastSavedInvoice,
    load,
    saveAs,
    update,
    reset
  } = useInvoiceDocument();
  const hasUnsavedChanges = useHasUnsavedChanges();

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
  // The unsaved-changes dialog fires onOpenChange(false) both when the user picks an
  // action (Save/Discard) and when they dismiss it (Cancel/Escape/overlay). Only a
  // dismissal should drop the pending action; this ref marks the action-driven closes
  // so they skip that cleanup.
  const continueAfterUnsavedRef = useRef(false);
  const [defaultName, setDefaultName] = useState<string>("Invoice 001");
  const [existingInvoices, setExistingInvoices] = useState<InvoiceDocument[]>(
    []
  );
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [pending, startTransition] = useTransition();

  function runWithUnsavedGuard(action: () => void) {
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setUnsavedDialogOpen(true);
    } else {
      action();
    }
  }

  function setSaveAsDialogOpen(open: boolean) {
    if (!open) setPendingAction(null);

    setInternalSaveAsDialogOpen(open);
    onExternalSaveDialogOpenChange?.(open);
  }

  function handleNewInvoice() {
    runWithUnsavedGuard(() => {
      reset();
    });
  }

  function handleOpenInvoice() {
    runWithUnsavedGuard(() => {
      setOpenDialogOpen(true);
    });
  }

  function handleOpenTemplate() {
    runWithUnsavedGuard(() => {
      setTemplateDialogOpen(true);
    });
  }

  // Detaches the editor from its saved document without touching the invoice
  // data, so the content lives on as an unsaved document. Used when the current
  // document is deleted or has otherwise vanished from storage.
  function detachCurrentDocument() {
    setCurrentDocumentId(null);
    setCurrentDocumentName(null);
    setLastSavedInvoice(null);
  }

  function handleSave(): Promise<void> {
    if (!currentDocumentId) {
      setSaveAsDialogOpen(true);

      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          await update();
          toast.success("Invoice saved successfully");
          resolve();
        } catch (error) {
          if (error instanceof DocumentNotFoundError) {
            detachCurrentDocument();
            setSaveAsDialogOpen(true);
            resolve();

            return;
          }

          toast.error(
            error instanceof Error ? error.message : "Failed to save invoice"
          );
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
    });
  }

  function handleSaveAs() {
    setSaveAsDialogOpen(true);
  }

  function handleExport() {
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
  }

  function handleSelectTemplate(template: InvoiceTemplate) {
    startTransition(() => {
      try {
        setInvoice(ensureItemIds(template.templateData));
        setCurrentDocumentId(null);
        setCurrentDocumentName(null);
        setLastSavedInvoice(null);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to apply template"
        );
      }
    });
  }

  function runPendingAction() {
    if (!pendingAction) return;

    pendingAction();
    setPendingAction(null);
  }

  async function handleSaveInvoice(name: string, overwriteId?: string) {
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          if (overwriteId) {
            await update({ documentId: overwriteId, name });

            toast.success("Invoice saved successfully");
          } else {
            await saveAs(name);

            toast.success("Invoice saved successfully");
          }

          runPendingAction();
          resolve();
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
        await load(invoiceDoc.id);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to open invoice"
        );
      }
    });
  }

  function handleUnsavedDialogOpenChange(open: boolean) {
    if (!open && !continueAfterUnsavedRef.current) setPendingAction(null);

    continueAfterUnsavedRef.current = false;
    setUnsavedDialogOpen(open);
  }

  async function handleUnsavedAction(action: UnsavedChangesAction) {
    continueAfterUnsavedRef.current = action !== "cancel";

    if (action === "discard") {
      runPendingAction();

      return;
    }

    if (action !== "save") return;

    if (!currentDocumentId) {
      setSaveAsDialogOpen(true);

      return;
    }

    try {
      await handleSave();
      runPendingAction();
    } catch {
      setPendingAction(null);
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

      // Compare case-insensitively: holding Shift reports an uppercase key, so
      // "s" would never match on Cmd+Shift+S without normalising first. Cmd+N is
      // intentionally not bound because Chrome and Safari reserve it for a new
      // browser window and never surface it to the page.
      const key = event.key.toLowerCase();

      if (key === "o" && !event.shiftKey) {
        event.preventDefault();
        handleOpenInvoice();
      } else if (key === "s" && !event.shiftKey) {
        event.preventDefault();
        void handleSave().catch(() => {});
      } else if (key === "s" && event.shiftKey) {
        event.preventDefault();
        handleSaveAs();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleOpenInvoice, handleSave, handleSaveAs]);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="w-auto">
          <MenubarItem onClick={handleNewInvoice} disabled={pending}>
            <IconFilePlus className="mr-2 h-4 w-4" />
            New Invoice
          </MenubarItem>
          <MenubarItem onClick={handleOpenInvoice} disabled={pending}>
            <IconFolderOpen className="mr-2 h-4 w-4" />
            Open Invoice
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem
            onClick={() => void handleSave().catch(() => {})}
            disabled={pending}
          >
            <IconDeviceFloppy className="mr-2 h-4 w-4" />
            Save
          </MenubarItem>
          <MenubarItem onClick={handleSaveAs} disabled={pending}>
            <IconFile className="mr-2 h-4 w-4" />
            Save As...
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleOpenTemplate} disabled={pending}>
            <IconBookmark className="mr-2 h-4 w-4" />
            Open Template
          </MenubarItem>
          <MenubarItem
            onClick={() => setSaveTemplateDialogOpen(true)}
            disabled={pending}
          >
            <IconDeviceFloppy className="mr-2 h-4 w-4" />
            Save As Template
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem onClick={handleExport} disabled={pending}>
            <IconDownload className="mr-2 h-4 w-4" />
            Export Data
          </MenubarItem>
          <MenubarItem
            onClick={() => setImportDialogOpen(true)}
            disabled={pending}
          >
            <IconUpload className="mr-2 h-4 w-4" />
            Import Data
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <OpenInvoiceDialog
        open={openDialogOpen}
        onOpenChange={setOpenDialogOpen}
        onSelectInvoice={handleSelectInvoice}
        currentInvoiceId={currentDocumentId}
        onCurrentInvoiceDeleted={detachCurrentDocument}
        onCurrentInvoiceRenamed={setCurrentDocumentName}
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
        onOpenChange={handleUnsavedDialogOpenChange}
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
