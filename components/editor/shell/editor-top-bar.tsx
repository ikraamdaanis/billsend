import { IconPlayerPlay } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { RenameInvoiceDialog } from "~/components/dialogs/rename-invoice-dialog";
import { DownloadPopover } from "~/components/editor/shell/download-popover";
import { ProjectMenu } from "~/components/editor/shell/project-menu";
import { SaveStatusChip } from "~/components/editor/shell/save-status-chip";
import { Button } from "~/components/ui/button";
import { useEditorUi } from "~/context/editor-ui-context";
import { useFileActions } from "~/context/file-actions-context";
import { useInvoiceDocument } from "~/context/invoice-document-context";
import { getInvoice, saveInvoice } from "~/db";

// Framer's three-part bar: the project menu on the left, the invoice's name and
// save state in the middle, and the panel toggles, Preview and Download on the
// right. `start` and `end` take the panel toggles.
export function EditorTopBar({
  onLeave,
  start,
  end
}: {
  onLeave: () => void;
  start?: ReactNode;
  end?: ReactNode;
}) {
  const { mode, toggleMode } = useEditorUi();

  return (
    <header className="bg-background border-border relative z-30 grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b pr-[max(0.75rem,env(safe-area-inset-right))] pl-[max(0.75rem,env(safe-area-inset-left))] pointer-coarse:h-14">
      <div className="flex min-w-0 items-center gap-1">
        <ProjectMenu onLeave={onLeave} />
        {start}
      </div>
      <InvoiceName />
      <div className="flex min-w-0 items-center justify-end gap-1">
        {end}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={mode === "preview" ? "Back to editing" : "Preview"}
          aria-pressed={mode === "preview"}
          title="Preview (P)"
          onClick={toggleMode}
          className="text-muted-foreground aria-pressed:bg-accent aria-pressed:text-foreground mr-1 pointer-coarse:size-11"
        >
          <IconPlayerPlay aria-hidden="true" />
        </Button>
        <DownloadPopover />
      </div>
    </header>
  );
}

// The name stays a heading button: it renames a saved invoice, or saves a new
// one under a name.
function InvoiceName() {
  const { currentDocumentId, currentDocumentName, setCurrentDocumentName } =
    useInvoiceDocument();
  const { saveAs } = useFileActions();
  const [renameOpen, setRenameOpen] = useState(false);
  const displayName = currentDocumentName || "Untitled invoice";

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

  return (
    <div className="flex min-w-0 items-center gap-2">
      <h1 className="flex min-w-0">
        <button
          type="button"
          title={currentDocumentId ? "Rename" : "Save as an invoice"}
          onClick={() => {
            if (currentDocumentId) setRenameOpen(true);
            else saveAs();
          }}
          className="hover:bg-muted focus-visible:ring-ring flex h-7 min-w-0 items-center rounded-md px-2 outline-none focus-visible:ring-1 pointer-coarse:h-10"
        >
          <span className="text-foreground max-w-[min(18rem,36vw)] truncate text-sm font-medium">
            {displayName}
          </span>
        </button>
      </h1>
      <SaveStatusChip />
      <RenameInvoiceDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={displayName}
        onRename={handleRename}
      />
    </div>
  );
}
