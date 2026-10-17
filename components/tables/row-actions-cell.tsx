import { IconDots } from "@tabler/icons-react";
import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";

// The last cell of a list row: a ⋯ button holding the row's actions, the same
// ones as its right-click menu. It shows on hover, on focus, on a selected row
// and while open (always on touch). Clicks and keys stay in the cell, so they
// don't also select or open the row.
export function RowActionsCell({
  label,
  selected,
  children
}: {
  label: string;
  selected: boolean;
  children: ReactNode;
}) {
  return (
    <td
      role="gridcell"
      data-slot="row-actions"
      className="py-1 pr-2 text-right"
      onClick={event => event.stopPropagation()}
      onDoubleClick={event => event.stopPropagation()}
      onKeyDown={event => event.stopPropagation()}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={label}
          className={cn(
            "focus-visible:ring-ring ml-auto flex size-7 items-center justify-center rounded-md opacity-0 outline-none group-focus-within/row:opacity-100 group-hover/row:opacity-100 focus-visible:opacity-100 focus-visible:ring-1 aria-expanded:opacity-100 pointer-coarse:size-9 pointer-coarse:opacity-100",
            selected
              ? "text-primary-foreground hover:bg-primary-foreground/15 aria-expanded:bg-primary-foreground/15 opacity-100"
              : "text-muted-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground"
          )}
        >
          <IconDots aria-hidden="true" className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </td>
  );
}
