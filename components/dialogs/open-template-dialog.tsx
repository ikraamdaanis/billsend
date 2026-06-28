import { IconFolderOpen, IconLoader2 } from "@tabler/icons-react";
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
  DialogTitle
} from "~/components/ui/dialog";
import { deleteTemplate, getAllTemplates, saveTemplate } from "~/db";
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
  const [loading, setLoading] = useState(true);
  const [pending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<
    { mode: "selection" } | { mode: "single"; template: InvoiceTemplate } | null
  >(null);

  useEffect(() => {
    if (open) {
      setSelectedIds([]);
      setDeleteTarget(null);
      loadTemplates();
    }
  }, [open]);

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
        : templates.filter(template => selectedIds.includes(template.id));

  const deletePrompt =
    pendingDeleteTemplates.length === 1
      ? `Delete “${truncate(pendingDeleteTemplates[0].name, 42)}”?`
      : `Delete ${pendingDeleteTemplates.length} templates?`;

  const footerLabel =
    pendingDeleteTemplates.length > 0 || selectedIds.length === 0
      ? `${templates.length} template${templates.length !== 1 ? "s" : ""} available`
      : `${selectedIds.length} selected`;

  async function loadTemplates() {
    try {
      setLoading(true);
      const loadedTemplates = await getAllTemplates();
      setTemplates(loadedTemplates);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load templates from storage."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleOpenTemplate(template: InvoiceTemplate) {
    onSelectTemplate(template);
    onOpenChange(false);
  }

  function handleContentClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;

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
        await Promise.all(targets.map(template => deleteTemplate(template.id)));
        await loadTemplates();

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
      await saveTemplate({ ...template, name: newName, updatedAt: new Date() });
      await loadTemplates();

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
        <DialogHeader className="border-border border-b">
          <DialogTitle>Open Template</DialogTitle>
          <DialogDescription>
            Select a template to open. You can also rename or delete templates
            from here.
          </DialogDescription>
        </DialogHeader>
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
                  templates={templates}
                  selectedIds={selectedIds}
                  deletingIds={pendingDeleteTemplates.map(
                    template => template.id
                  )}
                  onSelectionChange={setSelectedIds}
                  onOpenTemplate={handleOpenTemplate}
                  onRenameTemplate={handleRenameTemplate}
                  onDeleteTemplates={handleRequestDelete}
                />
                <InvoiceListStripeFiller rowCount={templates.length} />
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
        <DialogFooter className="flex-row items-center justify-between sm:justify-between">
          <span className="text-muted-foreground text-sm">{footerLabel}</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
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
