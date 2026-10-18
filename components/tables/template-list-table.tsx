import {
  IconFilePlus,
  IconPencil,
  IconTemplate,
  IconTrash
} from "@tabler/icons-react";
import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { RowActionsCell } from "~/components/tables/row-actions-cell";
import { RowMenuItems } from "~/components/tables/row-menu-items";
import { SortHeaderCell } from "~/components/tables/sort-header-cell";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger
} from "~/components/ui/context-menu";
import { cn } from "~/lib/utils";
import type { InvoiceTemplate, SortDirection } from "~/types";
import { formatFullDate, formatListDate } from "~/utils/format-list-date";

type SortKey = "name" | "updatedAt";

const nameCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base"
});

export function TemplateListTable({
  templates,
  selectedIds,
  deletingIds,
  onSelectionChange,
  onOpenTemplate,
  onRenameTemplate,
  onDeleteTemplates
}: {
  templates: InvoiceTemplate[];
  selectedIds: string[];
  deletingIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onOpenTemplate: (template: InvoiceTemplate) => void;
  onRenameTemplate: (template: InvoiceTemplate, newName: string) => void;
  onDeleteTemplates: (templates: InvoiceTemplate[]) => void;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("updatedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [contextMenuRowId, setContextMenuRowId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const editingIdRef = useRef<string | null>(null);
  const anchorIdRef = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  useEffect(() => {
    if (!editingId) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });

    return () => cancelAnimationFrame(frame);
  }, [editingId]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));

      return;
    }

    // A name sort starts A to Z; a date sort starts with the newest.
    setSortKey(key);
    setSortDirection(key === "name" ? "asc" : "desc");
  }

  function startRename(template: InvoiceTemplate) {
    editingIdRef.current = template.id;
    anchorIdRef.current = template.id;
    setEditingId(template.id);
    setEditingValue(template.name);
    onSelectionChange([template.id]);
  }

  function finishRename(template: InvoiceTemplate, shouldSave: boolean) {
    if (editingIdRef.current !== template.id) return;

    editingIdRef.current = null;
    setEditingId(null);

    const trimmed = editingValue.trim();

    if (shouldSave && trimmed && trimmed !== template.name) {
      onRenameTemplate(template, trimmed);
    }
  }

  function handleEditKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
    template: InvoiceTemplate
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      finishRename(template, true);

      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      finishRename(template, false);
    }
  }

  // Names compare naturally ("Template 2" before "Template 10"); ties go to
  // the most recently edited.
  const sortedTemplates = [...templates].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    const byUpdated =
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();

    if (sortKey === "name") {
      return nameCollator.compare(a.name, b.name) * direction || -byUpdated;
    }

    return byUpdated * direction;
  });
  const tabbableId = sortedTemplates.some(template => template.id === activeId)
    ? activeId
    : sortedTemplates[0]?.id;

  const selectedSet = new Set(selectedIds);
  const deletingSet = new Set(deletingIds);
  const selectedTemplates = sortedTemplates.filter(template =>
    selectedSet.has(template.id)
  );

  function focusRow(targetIndex: number) {
    const row = tbodyRef.current?.querySelector<HTMLTableRowElement>(
      `tr[data-index="${targetIndex}"]`
    );
    row?.focus();
  }

  function selectRange(targetId: string) {
    const anchorId = anchorIdRef.current;
    const anchorIndex = sortedTemplates.findIndex(
      template => template.id === anchorId
    );
    const targetIndex = sortedTemplates.findIndex(
      template => template.id === targetId
    );

    if (anchorIndex === -1) {
      onSelectionChange([targetId]);

      return;
    }

    const start = Math.min(anchorIndex, targetIndex);
    const end = Math.max(anchorIndex, targetIndex);

    onSelectionChange(
      sortedTemplates.slice(start, end + 1).map(template => template.id)
    );
  }

  function handleRowClick(
    event: MouseEvent<HTMLTableRowElement>,
    template: InvoiceTemplate
  ) {
    if (editingId) return;

    if (event.shiftKey && anchorIdRef.current) {
      selectRange(template.id);

      return;
    }

    if (event.metaKey || event.ctrlKey) {
      anchorIdRef.current = template.id;

      onSelectionChange(
        selectedSet.has(template.id)
          ? selectedIds.filter(selectedId => selectedId !== template.id)
          : [...selectedIds, template.id]
      );

      return;
    }

    anchorIdRef.current = template.id;

    const isOnlySelection =
      selectedSet.has(template.id) && selectedIds.length === 1;

    onSelectionChange(isOnlySelection ? [] : [template.id]);
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLTableSectionElement>) {
    if (editingId) return;
    // The row's ⋯ menu handles its own keys.
    if ((event.target as HTMLElement).closest("[data-slot='row-actions']"))
      return;

    const rowElement = (event.target as HTMLElement).closest<HTMLElement>(
      "tr[data-index]"
    );

    if (!rowElement) return;

    const index = Number(rowElement.dataset.index);

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= sortedTemplates.length
    )
      return;

    const template = sortedTemplates[index];

    const handled = () => {
      event.preventDefault();
      event.stopPropagation();
    };

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      handled();

      const lastIndex = sortedTemplates.length - 1;
      const nextIndex =
        event.key === "ArrowDown"
          ? Math.min(index + 1, lastIndex)
          : Math.max(index - 1, 0);

      if (nextIndex === index) return;

      const nextTemplate = sortedTemplates[nextIndex];
      setActiveId(nextTemplate.id);
      focusRow(nextIndex);

      if (event.shiftKey) {
        selectRange(nextTemplate.id);

        return;
      }

      anchorIdRef.current = nextTemplate.id;
      onSelectionChange([nextTemplate.id]);

      return;
    }

    if (event.key === "Enter") {
      handled();
      onOpenTemplate(template);

      return;
    }

    if (event.key === " ") {
      handled();
      anchorIdRef.current = template.id;

      onSelectionChange(
        selectedSet.has(template.id)
          ? selectedIds.filter(selectedId => selectedId !== template.id)
          : [...selectedIds, template.id]
      );

      return;
    }

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a") {
      handled();
      onSelectionChange(
        sortedTemplates.map(currentTemplate => currentTemplate.id)
      );

      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      handled();
      onDeleteTemplates(
        selectedIds.length > 0 ? selectedTemplates : [template]
      );

      return;
    }

    if (event.key === "F2") {
      handled();
      startRename(template);
    }
  }

  return (
    <table
      role="grid"
      aria-multiselectable
      className="w-full table-fixed text-[0.8125rem]/5"
    >
      <colgroup>
        <col />
        <col className="w-24" />
        <col className="w-7 pointer-coarse:hidden" />
      </colgroup>
      <thead>
        <tr className="text-muted-foreground text-left text-xs">
          <SortHeaderCell
            label="Name"
            active={sortKey === "name"}
            direction={sortDirection}
            onClick={() => toggleSort("name")}
            className="pl-4"
          />
          <SortHeaderCell
            label="Modified"
            active={sortKey === "updatedAt"}
            direction={sortDirection}
            onClick={() => toggleSort("updatedAt")}
          />
          <th className="bg-popover sticky top-0 shadow-[inset_0_-1px_0_0_var(--border)] pointer-coarse:hidden">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody ref={tbodyRef} onKeyDownCapture={handleListKeyDown}>
        {sortedTemplates.map((template, index) => {
          const isSelected = selectedSet.has(template.id);
          const isDeleting = deletingSet.has(template.id);
          const isEditing = editingId === template.id;
          const isStriped = index % 2 === 1;
          const isContextFocused = contextMenuRowId === template.id;
          const showBulkDelete = isSelected && selectedIds.length > 1;
          const isTabbable = template.id === tabbableId;
          const rowActions = showBulkDelete
            ? [
                {
                  label: `Delete ${selectedIds.length} templates`,
                  icon: IconTrash,
                  onSelect: () => onDeleteTemplates(selectedTemplates),
                  destructive: true
                }
              ]
            : [
                {
                  label: "Use template",
                  icon: IconFilePlus,
                  onSelect: () => onOpenTemplate(template)
                },
                {
                  label: "Rename",
                  icon: IconPencil,
                  onSelect: () => startRename(template)
                },
                {
                  label: "Delete",
                  icon: IconTrash,
                  onSelect: () => onDeleteTemplates([template]),
                  destructive: true,
                  separated: true
                }
              ];

          return (
            <ContextMenu
              key={template.id}
              onOpenChange={isOpen =>
                setContextMenuRowId(prev =>
                  isOpen ? template.id : prev === template.id ? null : prev
                )
              }
            >
              <ContextMenuTrigger
                render={
                  <tr
                    data-index={index}
                    role="row"
                    aria-selected={isSelected}
                    tabIndex={isTabbable ? 0 : -1}
                    onClick={event => handleRowClick(event, template)}
                    onDoubleClick={() => {
                      if (isEditing) return;

                      onOpenTemplate(template);
                    }}
                    onFocus={() => setActiveId(template.id)}
                    className={cn(
                      "group/row h-6 cursor-pointer scroll-mt-6 outline-none select-none pointer-coarse:h-11",
                      !isSelected && !isDeleting && isStriped && "bg-muted/50",
                      !isSelected && !isDeleting && "hover:bg-accent",
                      isSelected &&
                        !isDeleting &&
                        "bg-brand-100 dark:bg-brand-500/20",
                      isDeleting && "bg-destructive/10 text-destructive",
                      isContextFocused &&
                        !isDeleting &&
                        "outline-brand-500 outline-2 -outline-offset-2",
                      isDeleting &&
                        "outline-destructive/50 outline-2 -outline-offset-2",
                      isEditing && !isSelected && "bg-accent",
                      "focus-visible:outline-brand-500 focus-visible:outline-2 focus-visible:-outline-offset-2"
                    )}
                  />
                }
              >
                <td
                  role="gridcell"
                  className="overflow-hidden py-0.5 pr-4 pl-4"
                  onClick={
                    isEditing ? event => event.stopPropagation() : undefined
                  }
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <IconTemplate
                      aria-hidden="true"
                      className={cn(
                        "size-3.5 shrink-0",
                        isDeleting
                          ? "text-destructive"
                          : isSelected
                            ? "text-brand-600 dark:text-brand-400"
                            : "text-muted-foreground"
                      )}
                    />
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        name="templateName"
                        aria-label="Template name"
                        maxLength={100}
                        value={editingValue}
                        onChange={event => setEditingValue(event.target.value)}
                        onFocus={event => event.currentTarget.select()}
                        onKeyDown={event => handleEditKeyDown(event, template)}
                        onBlur={() => finishRename(template, true)}
                        className="bg-background text-foreground outline-brand-500 rounded-surface -my-0.5 -ml-1 h-5 w-full min-w-0 px-1 text-[0.8125rem] font-medium outline-2 -outline-offset-1"
                      />
                    ) : (
                      <span className="min-w-0 truncate font-medium">
                        {template.name}
                      </span>
                    )}
                  </div>
                </td>
                <td
                  role="gridcell"
                  title={formatFullDate(template.updatedAt)}
                  className={cn(
                    "py-0.5 pr-4 whitespace-nowrap tabular-nums",
                    isDeleting ? "text-destructive/70" : "text-muted-foreground"
                  )}
                >
                  {formatListDate(template.updatedAt)}
                </td>
                <RowActionsCell
                  label={`Actions for ${template.name}`}
                  selected={isSelected && !isDeleting}
                >
                  <RowMenuItems menu="dropdown" actions={rowActions} />
                </RowActionsCell>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <RowMenuItems menu="context" actions={rowActions} />
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </tbody>
    </table>
  );
}
