import { useEditorUi } from "~/context/editor-ui-context";
import { useFileActions } from "~/context/file-actions-context";
import {
  useHasUnsavedChanges,
  useInvoiceDocument
} from "~/context/invoice-document-context";
import { cn } from "~/lib/utils";
import { shortcutLabel } from "~/utils/shortcut-label";

const chipClassName =
  "bg-muted text-muted-foreground flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-xs whitespace-nowrap";

// Says where the invoice stands. The working draft is always written to this
// browser as you type, so a draft reads as kept; a saved invoice with edits
// since its last save offers to save them.
export function SaveStatusChip() {
  const { mode } = useEditorUi();
  const { currentDocumentId } = useInvoiceDocument();
  const hasUnsavedChanges = useHasUnsavedChanges();
  const { save } = useFileActions();

  if (mode === "preview") {
    return (
      <span className={chipClassName}>
        <span aria-hidden="true" className="bg-ring size-1.5 rounded-full" />
        <span className="max-sm:sr-only">Previewing the PDF</span>
      </span>
    );
  }

  if (currentDocumentId && hasUnsavedChanges) {
    return (
      <button
        type="button"
        onClick={save}
        title={`Save (${shortcutLabel("⌘S")})`}
        className={cn(
          chipClassName,
          "hover:text-foreground focus-visible:ring-ring outline-none focus-visible:ring-1"
        )}
      >
        <span aria-hidden="true" className="bg-warning size-1.5 rounded-full" />
        <span className="max-sm:sr-only">Unsaved changes</span>
      </button>
    );
  }

  return (
    <span className={chipClassName}>
      <span aria-hidden="true" className="bg-success size-1.5 rounded-full" />
      <span className="max-sm:sr-only">
        {currentDocumentId ? "Saved on this device" : "Draft on this device"}
      </span>
    </span>
  );
}
