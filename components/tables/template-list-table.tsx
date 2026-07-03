import {
  IconArrowDown,
  IconArrowUp,
  IconPencil,
  IconTemplate,
  IconTrash
} from "@tabler/icons-react";
import { format } from "date-fns";
import type { KeyboardEvent, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from "~/components/ui/context-menu";
import { cn } from "~/lib/utils";
import type { InvoiceTemplate } from "~/types";

type SortKey = "name" | "updatedAt";
type SortDirection = "asc" | "desc";

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

    setSortKey(key);
    setSortDirection("asc");
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

  const sortedTemplates = [...templates].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;

    if (sortKey === "name") {
      return a.name.localeCompare(b.name) * direction;
    }

    return (
      (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) *
      direction
    );
  });

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
      className="w-full table-fixed text-sm"
    >
      <colgroup>
        <col />
        <col className="w-43" />
      </colgroup>
      <thead>
        <tr className="text-muted-foreground text-left text-sm">
          <th className="bg-popover sticky top-0 py-2 pr-4 pl-4 shadow-[inset_0_-1px_0_0_var(--border)]">
            <SortHeader
              label="Name"
              active={sortKey === "name"}
              direction={sortDirection}
              onClick={() => toggleSort("name")}
            />
          </th>
          <th className="bg-popover sticky top-0 py-2 pr-4 whitespace-nowrap shadow-[inset_0_-1px_0_0_var(--border)]">
            <SortHeader
              label="Date modified"
              active={sortKey === "updatedAt"}
              direction={sortDirection}
              onClick={() => toggleSort("updatedAt")}
            />
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
          const isTabbable =
            activeId === template.id || (activeId === null && index === 0);

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
                      "group/row cursor-pointer scroll-mt-9 outline-none select-none",
                      !isSelected && !isDeleting && isStriped && "bg-muted/50",
                      !isSelected && !isDeleting && "hover:bg-accent",
                      isSelected &&
                        !isDeleting &&
                        "bg-brand-500 text-primary-foreground",
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
                  className="overflow-hidden py-2.5 pr-4 pl-4"
                  onClick={
                    isEditing ? event => event.stopPropagation() : undefined
                  }
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <IconTemplate
                      className={cn(
                        "size-4 shrink-0",
                        isDeleting
                          ? "text-destructive"
                          : isSelected
                            ? "text-primary-foreground"
                            : "text-muted-foreground"
                      )}
                    />
                    {isEditing ? (
                      <input
                        ref={inputRef}
                        name="templateName"
                        aria-label="Template name"
                        value={editingValue}
                        onChange={event => setEditingValue(event.target.value)}
                        onFocus={event => event.currentTarget.select()}
                        onKeyDown={event => handleEditKeyDown(event, template)}
                        onBlur={() => finishRename(template, true)}
                        className="bg-background text-foreground outline-brand-500 rounded-surface -my-0.5 -ml-1 h-6 w-full min-w-0 px-1 text-sm font-medium outline-2 -outline-offset-1"
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
                  className={cn(
                    "py-2.5 pr-4 whitespace-nowrap tabular-nums",
                    isDeleting
                      ? "text-destructive/70"
                      : isSelected
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                  )}
                >
                  {format(new Date(template.updatedAt), "PP, p")}
                </td>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {showBulkDelete ? (
                  <ContextMenuItem
                    variant="destructive"
                    onClick={() => onDeleteTemplates(selectedTemplates)}
                  >
                    <IconTrash />
                    Delete {selectedIds.length} templates
                  </ContextMenuItem>
                ) : (
                  <>
                    <ContextMenuItem onClick={() => startRename(template)}>
                      <IconPencil className="size-3 shrink-0" />
                      Rename
                    </ContextMenuItem>
                    <ContextMenuItem
                      variant="destructive"
                      onClick={() => onDeleteTemplates([template])}
                    >
                      <IconTrash className="size-3 shrink-0" />
                      Delete
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </tbody>
    </table>
  );
}

function SortHeader({
  label,
  active,
  direction,
  onClick
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active}
      className="hover:text-foreground data-[active=true]:text-foreground flex w-full items-center gap-1 font-medium"
    >
      {label}
      {active &&
        (direction === "asc" ? (
          <IconArrowUp className="size-3.5" />
        ) : (
          <IconArrowDown className="size-3.5" />
        ))}
    </button>
  );
}
