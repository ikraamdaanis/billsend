import { IconPlayerPlay } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { RenameInvoiceDialog } from "~/components/dialogs/rename-invoice-dialog";
import { DownloadPopover } from "~/components/editor/shell/download-popover";
import { HistoryButtons } from "~/components/editor/shell/history-buttons";
import { ProjectMenu } from "~/components/editor/shell/project-menu";
import { Button } from "~/components/ui/button";
import { useEditorUi } from "~/context/editor-ui-context";
import {
  useDocumentName,
  useInvoiceDocument
} from "~/context/invoice-document-context";

// Framer's three-part bar: the project menu on the left, the invoice's name in
// the middle, and the panel toggles, Preview and Download on the right.
// `start` and `end` take the panel toggles. Phones keep the menu, the name,
// undo and redo, and Download; the panel toggles and Preview move to the tab
// bar. Every edit saves itself, so there's no save state to show here while
// saving works; problems show in the banner under the bar.
export function EditorTopBar({
  start,
  end
}: {
  start?: ReactNode;
  end?: ReactNode;
}) {
  const { mode, toggleMode, isNarrow } = useEditorUi();
  const { status } = useInvoiceDocument();
  const canEdit = status === "editing" || status === "unavailable";

  return (
    <header className="bg-background border-border relative z-30 grid h-12 shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b pr-[max(0.75rem,env(safe-area-inset-right))] pl-[max(0.75rem,env(safe-area-inset-left))] max-md:flex max-md:gap-2 pointer-coarse:h-14">
      <div className="flex min-w-0 items-center gap-1 max-md:shrink-0">
        <ProjectMenu />
        <div className="contents max-md:hidden">{start}</div>
      </div>
      <InvoiceName />
      <div className="flex min-w-0 items-center justify-end gap-1 max-md:shrink-0">
        <div className="contents max-md:hidden">{end}</div>
        {isNarrow && mode === "edit" && canEdit && (
          <HistoryButtons className="flex items-center" />
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={mode === "preview" ? "Back to editing" : "Preview"}
          aria-pressed={mode === "preview"}
          title="Preview (P)"
          onClick={toggleMode}
          className="text-muted-foreground aria-pressed:bg-accent aria-pressed:text-foreground mr-1 max-md:hidden pointer-coarse:size-11"
        >
          <IconPlayerPlay aria-hidden="true" />
        </Button>
        <DownloadPopover />
      </div>
    </header>
  );
}

// The name is a heading button that renames the invoice. Naming a new invoice
// that isn't in the library yet adds it under that name.
function InvoiceName() {
  const { renameCurrent } = useInvoiceDocument();
  const displayName = useDocumentName();
  const [renameOpen, setRenameOpen] = useState(false);

  async function handleRename(newName: string) {
    await renameCurrent(newName);
    toast.success("Invoice renamed");
  }

  return (
    <div className="flex min-w-0 items-center gap-2 max-md:flex-1 max-md:justify-center">
      <h1 className="flex min-w-0">
        <button
          type="button"
          title="Rename"
          onClick={() => setRenameOpen(true)}
          className="hover:bg-muted focus-visible:ring-ring flex h-7 min-w-0 items-center rounded-md px-2 outline-none focus-visible:ring-1 pointer-coarse:h-10"
        >
          <span className="text-foreground max-w-[min(18rem,36vw)] truncate text-sm font-medium max-md:max-w-none">
            {displayName}
          </span>
        </button>
      </h1>
      <RenameInvoiceDialog
        open={renameOpen}
        onOpenChange={setRenameOpen}
        currentName={displayName}
        onRename={handleRename}
      />
    </div>
  );
}
