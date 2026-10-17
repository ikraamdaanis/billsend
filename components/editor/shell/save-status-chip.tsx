import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "~/components/ui/tooltip";
import { useEditorUi } from "~/context/editor-ui-context";
import { useFileActions } from "~/context/file-actions-context";
import {
  useHasUnsavedChanges,
  useInvoiceDocument
} from "~/context/invoice-document-context";
import { cn } from "~/lib/utils";
import { shortcutLabel } from "~/utils/shortcut-label";

// Says where the invoice stands as a coloured dot beside the name, with the
// words in a tooltip (and for screen readers). The working draft is always
// written to this browser as you type, so a draft reads as kept; a saved
// invoice with edits since its last save offers to save them. On a phone the
// dot sits ahead of the name, so it doesn't read as part of the buttons to its
// right.
export function SaveStatusChip() {
  const { mode } = useEditorUi();
  const { currentDocumentId } = useInvoiceDocument();
  const hasUnsavedChanges = useHasUnsavedChanges();
  const { save } = useFileActions();
  const canSave =
    mode !== "preview" && !!currentDocumentId && hasUnsavedChanges;
  const status =
    mode === "preview"
      ? { label: "Previewing the PDF", dotClassName: "bg-ring" }
      : canSave
        ? { label: "Unsaved changes", dotClassName: "bg-warning" }
        : {
            label: currentDocumentId
              ? "Saved on this device"
              : "Draft on this device",
            dotClassName: "bg-success"
          };

  // Keyed so the tooltip remounts when the trigger swaps between a plain dot
  // and the save button; otherwise it keeps listening on the old element.
  return (
    <Tooltip key={canSave ? "save" : "status"}>
      <TooltipTrigger
        delay={200}
        render={canSave ? <button type="button" onClick={save} /> : <span />}
        className={cn(
          "focus-visible:ring-ring flex size-6 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-1 max-md:order-first",
          canSave && "hover:bg-muted"
        )}
      >
        <span
          aria-hidden="true"
          className={cn("size-2 rounded-full", status.dotClassName)}
        />
        <span className="sr-only">{status.label}</span>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {status.label}
        {canSave && (
          <span className="opacity-60">{`Save ${shortcutLabel("⌘S")}`}</span>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
