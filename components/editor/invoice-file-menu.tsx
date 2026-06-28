import {
  IconBookmark,
  IconDeviceFloppy,
  IconDownload,
  IconFile,
  IconFilePlus,
  IconFolderOpen,
  IconUpload
} from "@tabler/icons-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { ImportDataDialog } from "~/components/dialogs/import-data-dialog";
import { OpenInvoiceDialog } from "~/components/dialogs/open-invoice-dialog";
import { OpenTemplateDialog } from "~/components/dialogs/open-template-dialog";
import { SaveInvoiceDialog } from "~/components/dialogs/save-invoice-dialog";
import { SaveTemplateModal } from "~/components/dialogs/save-template-modal";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from "~/components/ui/menubar";
import type { UnsavedChangesAction } from "~/components/dialogs/unsaved-changes-dialog";
import { UnsavedChangesDialog } from "~/components/dialogs/unsaved-changes-dialog";
import {
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
      if (!open) setPendingAction(null);

      setInternalSaveAsDialogOpen(open);
      onExternalSaveDialogOpenChange?.(open);
    },
    [onExternalSaveDialogOpenChange]
  );

  const handleNewInvoice = useCallback(() => {
    runWithUnsavedGuard(() => {
      reset();
    });
  }, [runWithUnsavedGuard, reset]);

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

  const handleSave = useCallback((): Promise<void> => {
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
          toast.error(
            error instanceof Error ? error.message : "Failed to save invoice"
          );
          reject(error instanceof Error ? error : new Error(String(error)));
        }
      });
    });
  }, [currentDocumentId, update, setSaveAsDialogOpen]);

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

  async function handleUnsavedAction(action: UnsavedChangesAction) {
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
          <MenubarItem onClick={handleSave} disabled={pending}>
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
