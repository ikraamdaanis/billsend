import {
  IconCheck,
  IconChevronDown,
  IconCommand,
  IconEye,
  IconMinus,
  IconPencil,
  IconPlus
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { EditorThemeToggle } from "~/components/editor/editor-theme-toggle";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "~/components/ui/dropdown-menu";
import { useCanvasView } from "~/context/canvas-view-context";
import { useEditorUi } from "~/context/editor-ui-context";
import { cn } from "~/lib/utils";
import { shortcutLabel } from "~/utils/shortcut-label";

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2];

// The floating toolbar under the page, as in Framer: edit or preview, zoom,
// and the light/dark switch. Extra controls (quick actions) slot in at the end.
// Phones use the tab bar along the bottom instead.
export function CanvasPill({ children }: { children?: ReactNode }) {
  return (
    <div
      role="toolbar"
      aria-label="Canvas"
      className="bg-popover ring-foreground/10 shadow-menu absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl p-1 ring-1 max-md:hidden"
    >
      <ModeSwitch />
      <PillDivider />
      <ZoomControls />
      <PillDivider />
      <EditorThemeToggle size="icon-sm" className="pointer-coarse:size-11" />
      <QuickActionsButton />
      {children}
    </div>
  );
}

function QuickActionsButton() {
  const { setPaletteOpen } = useEditorUi();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Quick actions"
      title={`Quick actions (${shortcutLabel("⌘K")})`}
      onClick={() => setPaletteOpen(true)}
      className="max-md:hidden"
    >
      <IconCommand aria-hidden="true" />
    </Button>
  );
}

export function PillDivider() {
  return <span aria-hidden="true" className="bg-border mx-0.5 h-5 w-px" />;
}

function ModeSwitch() {
  const { mode, setMode } = useEditorUi();
  const options = [
    { value: "edit", label: "Edit", icon: IconPencil },
    { value: "preview", label: "Preview", icon: IconEye }
  ] as const;

  return (
    <div
      role="group"
      aria-label="Mode"
      className="bg-muted flex items-center rounded-lg p-0.5"
    >
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          aria-pressed={mode === option.value}
          onClick={() => setMode(option.value)}
          className={cn(
            "text-muted-foreground hover:text-foreground focus-visible:ring-ring flex h-6 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium outline-none focus-visible:ring-1 pointer-coarse:h-10",
            mode === option.value &&
              "bg-popover text-foreground ring-foreground/10 shadow-xs ring-1"
          )}
        >
          <option.icon aria-hidden="true" className="size-3.5" />
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ZoomControls() {
  const { view, setView, zoom } = useCanvasView();
  // Step from the applied zoom, so leaving Fit lands on the nearest preset.
  const zoomOutStep = ZOOM_STEPS.filter(step => step < zoom - 0.001).at(-1);
  const zoomInStep = ZOOM_STEPS.find(step => step > zoom + 0.001);
  const zoomPercent = `${Math.round(zoom * 100)}%`;
  const isFit = view === "fit";

  return (
    <div role="group" aria-label="Zoom" className="flex items-center">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Zoom out"
        disabled={zoomOutStep === undefined}
        onClick={() => {
          if (zoomOutStep !== undefined) setView(zoomOutStep);
        }}
        className="pointer-coarse:size-11"
      >
        <IconMinus aria-hidden="true" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label={`Zoom ${zoomPercent}${isFit ? ", fitted to screen" : ""}`}
          className="hover:bg-muted aria-expanded:bg-accent focus-visible:ring-ring flex h-7 min-w-16 items-center justify-center gap-0.5 rounded-md px-1.5 text-xs font-medium tabular-nums outline-none focus-visible:ring-1 pointer-coarse:h-11"
        >
          {zoomPercent}
          <IconChevronDown
            aria-hidden="true"
            className="text-muted-foreground size-3"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="center" className="w-44">
          <DropdownMenuItem onClick={() => setView("fit")}>
            Zoom to fit
            {isFit ? (
              <IconCheck aria-hidden="true" className="ml-auto" />
            ) : (
              <DropdownMenuShortcut>{shortcutLabel("⇧1")}</DropdownMenuShortcut>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {ZOOM_STEPS.map(step => (
            <DropdownMenuItem key={step} onClick={() => setView(step)}>
              {`${step * 100}%`}
              {view === step ? (
                <IconCheck aria-hidden="true" className="ml-auto" />
              ) : (
                step === 1 && (
                  <DropdownMenuShortcut>
                    {shortcutLabel("⇧0")}
                  </DropdownMenuShortcut>
                )
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Zoom in"
        disabled={zoomInStep === undefined}
        onClick={() => {
          if (zoomInStep !== undefined) setView(zoomInStep);
        }}
        className="pointer-coarse:size-11"
      >
        <IconPlus aria-hidden="true" />
      </Button>
    </div>
  );
}
