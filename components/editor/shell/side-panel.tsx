import { IconLayoutSidebar, IconLayoutSidebarRight } from "@tabler/icons-react";
import type { ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { useEditorUi } from "~/context/editor-ui-context";
import { cn } from "~/lib/utils";

// A panel beside the canvas that slides closed to nothing. Its content keeps a
// fixed width while the panel animates, so nothing reflows mid-slide. On a
// phone it opens over the canvas instead of pushing it aside.
export function SidePanel({
  side,
  label,
  children
}: {
  side: "left" | "right";
  label: string;
  children: ReactNode;
}) {
  const { leftPanelOpen, rightPanelOpen } = useEditorUi();
  const open = side === "left" ? leftPanelOpen : rightPanelOpen;

  return (
    <aside
      aria-label={label}
      inert={!open}
      className={cn(
        "bg-background border-border relative shrink-0 overflow-hidden transition-[width,translate] duration-200 ease-out motion-reduce:transition-none",
        "max-md:shadow-floating max-md:absolute max-md:inset-y-0 max-md:z-30 max-md:w-[min(19rem,88vw)]",
        side === "left"
          ? "w-64 border-r max-md:left-0"
          : "w-72 border-l max-md:right-0",
        !open && "w-0 border-0 max-md:shadow-none",
        !open &&
          (side === "left"
            ? "max-md:-translate-x-full"
            : "max-md:translate-x-full")
      )}
    >
      <div
        className={cn(
          "flex h-full min-h-0 flex-col max-md:w-full",
          side === "left" ? "w-64" : "w-72"
        )}
      >
        {children}
      </div>
    </aside>
  );
}

// On a phone the open panel covers the page; tapping the dimmed page beside it
// closes it, like a sheet.
export function PanelBackdrop() {
  const { isNarrow, leftPanelOpen, rightPanelOpen, closePanels } =
    useEditorUi();

  if (!isNarrow || (!leftPanelOpen && !rightPanelOpen)) return null;

  return (
    <button
      type="button"
      aria-label="Close panel"
      onClick={closePanels}
      className="animate-in fade-in-0 absolute inset-0 z-20 bg-black/30 md:hidden"
    />
  );
}

export function PanelToggle({ side }: { side: "left" | "right" }) {
  const { leftPanelOpen, rightPanelOpen, togglePanel } = useEditorUi();
  const open = side === "left" ? leftPanelOpen : rightPanelOpen;
  const name = side === "left" ? "invoices panel" : "inspector";
  const Icon = side === "left" ? IconLayoutSidebar : IconLayoutSidebarRight;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={`${open ? "Hide" : "Show"} ${name}`}
      aria-pressed={open}
      onClick={() => togglePanel(side)}
      className="text-muted-foreground aria-pressed:text-foreground pointer-coarse:size-11"
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
