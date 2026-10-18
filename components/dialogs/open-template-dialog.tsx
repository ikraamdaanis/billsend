import {
  IconFolderOpen,
  IconLoader2,
  IconSearch,
  IconTemplate,
  IconX
} from "@tabler/icons-react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { InvoiceListStripeFiller } from "~/components/tables/invoice-list-table";
import { TemplateListTable } from "~/components/tables/template-list-table";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
  DialogTitle
} from "~/components/ui/dialog";
import { deleteTemplates, renameTemplate, watchTemplates } from "~/db";
import type { InvoiceTemplate } from "~/types";

function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

export function OpenTemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: InvoiceTemplate) => void;
}) {
  const [templates, setTemplates] = useState<InvoiceTemplate[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [selection, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<
    { mode: "selection" } | { mode: "single"; template: InvoiceTemplate } | null
  >(null);

  useEffect(() => {
    if (!open) return;

    setSelectedIds([]);
    setDeleteTarget(null);
    setQuery("");
    setLoading(true);

    // Live while open, so changes made elsewhere show straight away.
    return watchTemplates(
      next => {
        setTemplates(next);
        setLoading(false);
      },
      error => {
        toast.error(error.message);
        setLoading(false);
      }
    );
  }, [open]);

  const searchWords = query.toLowerCase().split(/\s+/).filter(Boolean);
  const visibleTemplates = templates.filter(template =>
    searchWords.every(word =>
      `${template.name} ${template.description ?? ""}`
        .toLowerCase()
        .includes(word)
    )
  );
  // Only what's on screen counts as selected: a template hidden by the search
  // or deleted elsewhere is never opened or deleted with the rest.
  const visibleIds = new Set(visibleTemplates.map(template => template.id));
  const selectedIds = selection.filter(id => visibleIds.has(id));

  useEffect(() => {
    if (deleteTarget?.mode === "selection" && selectedIds.length === 0) {
      setDeleteTarget(null);
    }
  }, [deleteTarget, selectedIds]);

  const pendingDeleteTemplates =
    deleteTarget === null
      ? []
      : deleteTarget.mode === "single"
        ? [deleteTarget.template]
        : visibleTemplates.filter(template =>
            selectedIds.includes(template.id)
          );

  const deletePrompt =
    pendingDeleteTemplates.length === 1
      ? `Delete “${truncate(pendingDeleteTemplates[0].name, 42)}”?`
      : `Delete ${pendingDeleteTemplates.length} templates?`;

  const footerLabel =
    pendingDeleteTemplates.length > 0 || selectedIds.length === 0
      ? `${templates.length} template${templates.length !== 1 ? "s" : ""} available`
      : `${selectedIds.length} selected`;

  function handleOpenTemplate(template: InvoiceTemplate) {
    onSelectTemplate(template);
    onOpenChange(false);
  }

  function handleContentClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

    // A row menu's items are portaled, but their clicks still bubble here
    // through React; they act on their own row.
    if (target.closest("[role='menu'], [role='menuitem']")) return;

    if (pendingDeleteTemplates.length > 0) {
      if (target.closest("[data-slot='delete-confirm']")) return;

      if (target.closest("thead")) return;

      const isSelectionGesture =
        target.closest("tr") &&
        (event.shiftKey || event.metaKey || event.ctrlKey);

      if (isSelectionGesture) return;

      setDeleteTarget(null);

      return;
    }

    if (selectedIds.length === 0) return;

    if (target.closest("tr, button, a, input, textarea, [role='menuitem']")) {
      return;
    }

    setSelectedIds([]);
  }

  function handleContentKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && pendingDeleteTemplates.length > 0) {
      event.preventDefault();
      event.stopPropagation();
      setDeleteTarget(null);
    }
  }

  function handleOpenSelected() {
    if (selectedIds.length !== 1) return;

    const selectedTemplate = templates.find(
      template => template.id === selectedIds[0]
    );

    if (!selectedTemplate) {
      return;
    }

    handleOpenTemplate(selectedTemplate);
  }

  function handleRequestDelete(targets: InvoiceTemplate[]) {
    if (targets.length === 0) return;

    const followsSelection = targets.every(template =>
      selectedIds.includes(template.id)
    );

    if (followsSelection) {
      setDeleteTarget({ mode: "selection" });

      return;
    }

    setSelectedIds([]);
    setDeleteTarget({ mode: "single", template: targets[0] });
  }

  function handleConfirmDelete() {
    const targets = pendingDeleteTemplates;

    if (targets.length === 0) return;

    const targetIds = new Set(targets.map(template => template.id));

    startTransition(async () => {
      try {
        await deleteTemplates([...targetIds]);

        setSelectedIds(prev => prev.filter(id => !targetIds.has(id)));
        setDeleteTarget(null);
        toast.success(
          targets.length === 1
            ? "Template deleted"
            : `Deleted ${targets.length} templates`
        );
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete templates"
        );
      }
    });
  }

  async function handleRenameTemplate(
    template: InvoiceTemplate,
    newName: string
  ) {
    try {
      await renameTemplate(template.id, newName);

      toast.success("Template renamed successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to rename template"
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[85vh] min-h-112 w-full flex-col sm:max-w-3xl"
        onClick={handleContentClick}
        onKeyDown={handleContentKeyDown}
      >
        <DialogHeader
          align="start"
          className="border-border border-b"
          icon={
            <DialogIcon tone="sky">
              <IconTemplate />
            </DialogIcon>
          }
        >
          <DialogTitle>Open Template</DialogTitle>
          <DialogDescription>
            Select a template to start from, or use its ⋯ menu to rename or
            delete it.
          </DialogDescription>
        </DialogHeader>
        {templates.length > 0 && (
          <div className="border-border flex items-center gap-2 border-b px-4 py-2">
            <label className="bg-muted text-muted-foreground focus-within:border-ring flex h-7 min-w-0 flex-1 items-center gap-1.5 rounded-md border border-transparent px-2">
              <IconSearch aria-hidden="true" className="size-3.5 shrink-0" />
              <span className="sr-only">Search templates</span>
              <input
                type="search"
                value={query}
                onChange={event => setQuery(event.target.value)}
                placeholder="Search templates"
                className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-[0.8125rem] outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setQuery("")}
                  className="hover:text-foreground rounded-sm"
                >
                  <IconX aria-hidden="true" className="size-3.5" />
                </button>
              )}
            </label>
          </div>
        )}
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {loading ? (
              <div className="text-muted-foreground flex flex-1 items-center justify-center gap-2 text-sm">
                <IconLoader2 className="size-4 shrink-0 animate-spin" />
                Loading templates
              </div>
            ) : templates.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <IconFolderOpen className="text-muted-foreground/70 size-8 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-foreground text-base font-medium">
                    No saved templates yet
                  </h3>
                  <p className="text-muted-foreground max-w-sm text-sm">
                    Save a template and it will appear here, ready to reopen
                    anytime.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <TemplateListTable
                  templates={visibleTemplates}
                  selectedIds={selectedIds}
                  deletingIds={pendingDeleteTemplates.map(
                    template => template.id
                  )}
                  onSelectionChange={setSelectedIds}
                  onOpenTemplate={handleOpenTemplate}
                  onRenameTemplate={handleRenameTemplate}
                  onDeleteTemplates={handleRequestDelete}
                />
                {visibleTemplates.length === 0 && (
                  <p className="text-muted-foreground px-4 py-4 text-center text-sm">
                    No templates match “{query.trim()}”.
                  </p>
                )}
                <InvoiceListStripeFiller rowCount={visibleTemplates.length} />
              </>
            )}
          </div>
          {pendingDeleteTemplates.length > 0 && (
            <div
              data-slot="delete-confirm"
              className="border-border bg-popover absolute inset-x-3 bottom-2 z-10 flex items-center justify-between gap-3 rounded-[6px] border px-3 py-1.5 shadow-sm"
            >
              <span className="text-foreground min-w-0 truncate text-sm">
                {deletePrompt}{" "}
                <span className="text-muted-foreground">
                  This cannot be undone.
                </span>
              </span>
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteTarget(null)}
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleConfirmDelete}
                  disabled={pending}
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter
          layout="bar"
          className="flex-row items-center justify-between sm:justify-between"
        >
          <span className="text-muted-foreground text-sm">{footerLabel}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              disabled={selectedIds.length !== 1}
              title={
                selectedIds.length !== 1
                  ? "Select a single template to open"
                  : undefined
              }
              onClick={handleOpenSelected}
            >
              Open
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
