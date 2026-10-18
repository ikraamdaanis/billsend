import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";
import { cn } from "~/lib/utils";
import type { SortDirection } from "~/types";

// A list column's header that sorts by it. The header cell says which way the
// list is sorted, so screen readers announce it with the column.
export function SortHeaderCell({
  label,
  active,
  direction,
  onClick,
  align = "start",
  className
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
  align?: "start" | "end";
  className?: string;
}) {
  const Arrow = direction === "asc" ? IconArrowUp : IconArrowDown;

  return (
    <th
      aria-sort={
        active ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
      className={cn(
        "bg-popover sticky top-0 py-1 pr-4 whitespace-nowrap shadow-[inset_0_-1px_0_0_var(--border)]",
        className
      )}
    >
      <button
        type="button"
        onClick={onClick}
        data-active={active}
        className={cn(
          "hover:text-foreground data-[active=true]:text-foreground flex w-full items-center gap-1 font-medium",
          align === "end" && "justify-end"
        )}
      >
        {label}
        {active && <Arrow aria-hidden="true" className="size-3" />}
      </button>
    </th>
  );
}
