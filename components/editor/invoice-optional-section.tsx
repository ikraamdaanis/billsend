import { IconPlus, IconX } from "@tabler/icons-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Editing affordances for optional sections (see useOptionalSection). Like the
// add / remove item buttons, they never appear in the rendered PDF.

/**
 * Wraps an open optional section so its remove button can reveal itself while
 * the section is hovered or focused.
 */
export function OptionalSection({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      {...props}
      className={cn("group/optional flex flex-col", className)}
    />
  );
}

/**
 * Sits beside a section's label. Hidden until the section is hovered or
 * focused on pointer devices; always visible (and finger sized) on touch.
 */
export function RemoveSectionButton({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      size="icon-xs"
      variant="ghost"
      aria-label={label}
      onClick={onClick}
      className="text-paper-muted-foreground hover:text-destructive opacity-0 group-focus-within/optional:opacity-100 group-hover/optional:opacity-100 pointer-coarse:size-11 pointer-coarse:opacity-100"
    >
      <IconX aria-hidden="true" />
    </Button>
  );
}

/**
 * A quiet "+ label" link that opens a collapsed section.
 */
export function AddSectionButton({
  onClick,
  autoFocus,
  children
}: {
  onClick: () => void;
  autoFocus: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      autoFocus={autoFocus}
      className="text-paper-muted-foreground hover:text-brand-700 focus-visible:ring-ring rounded-control -mx-1 flex w-fit items-center gap-1.5 px-1 py-0.5 text-sm transition-colors outline-none focus-visible:ring-1 pointer-coarse:min-h-11"
    >
      <IconPlus className="size-3.5" aria-hidden="true" />
      {children}
    </button>
  );
}
