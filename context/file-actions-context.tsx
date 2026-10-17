import { useNavigate, useSearch } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useTransition
} from "react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "~/components/dialogs/confirm-delete-dialog";
import { ImportDataDialog } from "~/components/dialogs/import-data-dialog";
import { OpenInvoiceDialog } from "~/components/dialogs/open-invoice-dialog";
import { OpenTemplateDialog } from "~/components/dialogs/open-template-dialog";
import { RenameInvoiceDialog } from "~/components/dialogs/rename-invoice-dialog";
import { SaveInvoiceDialog } from "~/components/dialogs/save-invoice-dialog";
import { SaveTemplateModal } from "~/components/dialogs/save-template-modal";
import type { UnsavedChangesAction } from "~/components/dialogs/unsaved-changes-dialog";
import { UnsavedChangesDialog } from "~/components/dialogs/unsaved-changes-dialog";
import {
  DocumentNotFoundError,
  generateDefaultInvoiceName,
  useHasUnsavedChanges,
  useInvoiceDocument
} from "~/context/invoice-document-context";
import {
  deleteInvoice,
  deleteTemplate,
  getAllInvoices,
  getAllTemplates,
  saveInvoice,
  saveTemplate
} from "~/db";
import { useInvoiceDataAndActions } from "~/stores/invoice-selectors";
import type { InvoiceDocument, InvoiceTemplate } from "~/types";
import { ensureItemIds } from "~/utils/ensure-item-ids";
import { exportAllData } from "~/utils/export-data";
import { hasOpenModal } from "~/utils/open-overlay";
import { hasPrimaryModifier } from "~/utils/shortcut-label";

// Everything the editor can do with files: new, open, save, templates, import
// and export. The project menu, the invoices panel and the command palette all
// call these, so the unsaved-changes guard and the dialogs behave the same
// whichever one started the action.
const FileActionsContext = createContext<{
  pending: boolean;
  newInvoice: () => void;
  showOpenInvoice: () => void;
  openInvoice: (documentId: string) => void;
  save: () => void;
  saveAs: () => void;
  showOpenTemplate: () => void;
  applyTemplate: (template: InvoiceTemplate) => void;
  saveAsTemplate: () => void;
  exportData: () => void;
  importData: () => void;
  renameInvoice: (document: InvoiceDocument) => void;
  duplicateInvoice: (document: InvoiceDocument) => void;
  deleteInvoice: (document: InvoiceDocument) => void;
  renameTemplate: (template: InvoiceTemplate) => void;
  deleteTemplate: (template: InvoiceTemplate) => void;
} | null>(null);

// A saved invoice or template that a row's menu is acting on.
type LibraryTarget =
  | { kind: "invoice"; document: InvoiceDocument }
  | { kind: "template"; template: InvoiceTemplate };

function targetName(target: LibraryTarget) {
  return target.kind === "invoice"
    ? target.document.name
    : target.template.name;
}

// "Name copy", or "Name copy 2" and so on when that's taken.
function nextCopyName(name: string, takenNames: string[]) {
  const taken = new Set(takenNames.map(takenName => takenName.toLowerCase()));
  let candidate = `${name} copy`;

  for (let i = 2; taken.has(candidate.toLowerCase()); i++) {
    candidate = `${name} copy ${i}`;
  }

  return candidate;
}

export function FileActionsProvider({ children }: { children: ReactNode }) {
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
  const { open: openRequest } = useSearch({ from: "/create" });
  const navigate = useNavigate();
  const [openDialogOpen, setOpenDialogOpen] = useState(false);
  const [saveAsDialogOpen, setSaveAsDialogOpenState] = useState(false);
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
  const [renameTarget, setRenameTarget] = useState<LibraryTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LibraryTarget | null>(null);

  function runWithUnsavedGuard(action: () => void) {
    if (hasUnsavedChanges) {
      setPendingAction(() => action);
      setUnsavedDialogOpen(true);
    } else {
      action();
    }
  }

  // Opening reads the saved invoices first, so the suggested name and the
  // overwrite check reflect every save so far, including one that has only
  // just landed.
  function setSaveAsDialogOpen(open: boolean) {
    if (!open) {
      setPendingAction(null);
      setSaveAsDialogOpenState(false);

      return;
    }

    getAllInvoices()
      .then(invoices => {
        setExistingInvoices(invoices);
        setDefaultName(generateDefaultInvoiceName(invoices));
      })
      .catch(() => {
        // The fallback name is used.
      })
      .finally(() => setSaveAsDialogOpenState(true));
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

  // A link to `/create?open=invoices` lands here. It goes through the same
  // unsaved-changes guard as the menu item, then the param is cleared so a
  // reload doesn't reopen the list.
  const onOpenRequested = useEffectEvent(() => {
    handleOpenInvoice();
    void navigate({
      to: "/create",
      search: previous => ({ ...previous, open: undefined }),
      replace: true
    });
  });

  useEffect(() => {
    if (openRequest === "invoices") onOpenRequested();
  }, [openRequest]);

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

  // Resolves with "saved" when the document was written, or "deferred" when the
  // save was routed to the Save As dialog instead (no current document, or the
  // current one has vanished from storage). Rejects only on a genuine failure.
  // Callers must not treat "deferred" as saved: the pending action is left for
  // the Save As dialog to run on completion, so nothing destructive runs before
  // the edits are actually persisted.
  function handleSave(): Promise<"saved" | "deferred"> {
    if (!currentDocumentId) {
      setSaveAsDialogOpen(true);

      return Promise.resolve("deferred");
    }

    // Nothing to write: saving again would only move the invoice up the
    // "last edited" order.
    if (!hasUnsavedChanges) {
      toast.success("Invoice saved");

      return Promise.resolve("saved");
    }

    return new Promise<"saved" | "deferred">((resolve, reject) => {
      startTransition(async () => {
        try {
          await update();
          toast.success("Invoice saved successfully");
          resolve("saved");
        } catch (error) {
          if (error instanceof DocumentNotFoundError) {
            detachCurrentDocument();
            setSaveAsDialogOpen(true);
            resolve("deferred");

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

  function loadInvoice(documentId: string) {
    startTransition(async () => {
      try {
        await load(documentId);
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
      const result = await handleSave();

      // Only run the pending (often destructive) action once the save actually
      // landed. When the save was deferred to the Save As dialog, that dialog
      // runs the pending action itself after it persists, so running it here
      // would wipe the edits before they were saved.
      if (result === "saved") {
        runPendingAction();
      }
    } catch {
      setPendingAction(null);
    }
  }

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

  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (!hasPrimaryModifier(event)) return;

    // Compare case-insensitively: holding Shift reports an uppercase key, so
    // "s" would never match on Cmd+Shift+S without normalising first. Cmd+N is
    // intentionally not bound because Chrome and Safari reserve it for a new
    // browser window and never surface it to the page.
    const key = event.key.toLowerCase();

    if (key !== "o" && key !== "s") return;

    event.preventDefault();

    // A modal dialog owns keyboard focus; swallow file shortcuts underneath it
    // rather than firing them (which could stack a second dialog and silently
    // replace the pending action). Popovers are dialogs too, but not modal, so
    // they don't block a save. A held key repeats the save; once is enough,
    // and nothing waits while a save or an open is under way.
    if (hasOpenModal() || event.repeat || pending) return;

    if (key === "o" && !event.shiftKey) {
      handleOpenInvoice();
    } else if (key === "s" && !event.shiftKey) {
      void handleSave().catch(() => {});
    } else if (key === "s" && event.shiftKey) {
      handleSaveAs();
    }
  });

  useEffect(() => {
    function listener(event: KeyboardEvent) {
      handleKeyDown(event);
    }

    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  async function handleLibraryRename(newName: string) {
    if (!renameTarget) return;

    if (renameTarget.kind === "invoice") {
      const { document } = renameTarget;

      await saveInvoice({ ...document, name: newName, updatedAt: new Date() });

      if (document.id === currentDocumentId) setCurrentDocumentName(newName);
      toast.success("Invoice renamed");
    } else {
      await saveTemplate({
        ...renameTarget.template,
        name: newName,
        updatedAt: new Date()
      });
      toast.success("Template renamed");
    }
  }

  async function handleLibraryDelete() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.kind === "invoice") {
        await deleteInvoice(deleteTarget.document.id);

        if (deleteTarget.document.id === currentDocumentId) {
          detachCurrentDocument();
        }

        toast.success("Invoice deleted");
      } else {
        await deleteTemplate(deleteTarget.template.id);
        toast.success("Template deleted");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  }

  function handleDuplicateInvoice(document: InvoiceDocument) {
    startTransition(async () => {
      try {
        const saved = await getAllInvoices();
        const now = new Date();
        const name = nextCopyName(
          document.name,
          saved.map(savedInvoice => savedInvoice.name)
        );

        await saveInvoice({
          ...document,
          id: crypto.randomUUID(),
          name,
          invoiceData: structuredClone(document.invoiceData),
          createdAt: now,
          updatedAt: now
        });
        toast.success(`Duplicated as “${name}”`);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to duplicate invoice"
        );
      }
    });
  }

  const value = {
    pending,
    newInvoice: handleNewInvoice,
    showOpenInvoice: handleOpenInvoice,
    openInvoice: (documentId: string) => {
      if (documentId === currentDocumentId) return;
      runWithUnsavedGuard(() => loadInvoice(documentId));
    },
    save: () => void handleSave().catch(() => {}),
    saveAs: handleSaveAs,
    showOpenTemplate: handleOpenTemplate,
    applyTemplate: (template: InvoiceTemplate) =>
      runWithUnsavedGuard(() => handleSelectTemplate(template)),
    saveAsTemplate: () => setSaveTemplateDialogOpen(true),
    exportData: handleExport,
    importData: () => setImportDialogOpen(true),
    renameInvoice: (document: InvoiceDocument) =>
      setRenameTarget({ kind: "invoice", document }),
    duplicateInvoice: handleDuplicateInvoice,
    deleteInvoice: (document: InvoiceDocument) =>
      setDeleteTarget({ kind: "invoice", document }),
    renameTemplate: (template: InvoiceTemplate) =>
      setRenameTarget({ kind: "template", template }),
    deleteTemplate: (template: InvoiceTemplate) =>
      setDeleteTarget({ kind: "template", template })
  };

  return (
    <FileActionsContext.Provider value={value}>
      {children}
      <OpenInvoiceDialog
        open={openDialogOpen}
        onOpenChange={setOpenDialogOpen}
        onSelectInvoice={invoiceDoc => loadInvoice(invoiceDoc.id)}
        currentInvoiceId={currentDocumentId}
        onCurrentInvoiceDeleted={detachCurrentDocument}
        onCurrentInvoiceRenamed={setCurrentDocumentName}
        onDuplicateInvoice={handleDuplicateInvoice}
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
      <RenameInvoiceDialog
        open={renameTarget !== null}
        onOpenChange={open => {
          if (!open) setRenameTarget(null);
        }}
        currentName={renameTarget ? targetName(renameTarget) : ""}
        subject={renameTarget?.kind === "template" ? "Template" : "Invoice"}
        onRename={handleLibraryRename}
      />
      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={open => {
          if (!open) setDeleteTarget(null);
        }}
        subject={deleteTarget?.kind ?? "invoice"}
        name={deleteTarget ? targetName(deleteTarget) : ""}
        onConfirm={handleLibraryDelete}
      />
      <ImportDataDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
      />
    </FileActionsContext.Provider>
  );
}

export function useFileActions() {
  const context = useContext(FileActionsContext);

  if (!context) {
    throw new Error("useFileActions must be used within a FileActionsProvider");
  }

  return context;
}
