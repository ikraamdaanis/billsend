import {
  IconAdjustmentsHorizontal,
  IconCheck,
  IconEye,
  IconFiles,
  IconPencil,
  IconZoomIn,
  IconZoomOut
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import { FIELD_ZOOM, useCanvasView } from "~/context/canvas-view-context";
import { useEditorUi } from "~/context/editor-ui-context";
import { cn } from "~/lib/utils";
import { useDocumentStore } from "~/stores/document-store";

// On a phone the panel toggles, Preview and zoom live in one bar along the
// bottom, as in Canva: the top bar keeps only the menu, the name and Download,
// and the panels open as sheets above this bar. The last tab fits the page, or
// says Done after tapping a field zoomed in to it.
export function PhoneTabBar() {
  const { mode, toggleMode, leftPanelOpen, rightPanelOpen, togglePanel } =
    useEditorUi();
  // Another tab is editing the invoice: the page shows as it prints, so
  // there's no switching to Edit.
  const canEdit = useDocumentStore(
    state => state.status === "editing" || state.status === "unavailable"
  );
  const { view, setView, isZoomedToField } = useCanvasView();
  const isFit = view === "fit";

  function handleZoom() {
    if (isFit) {
      setView(FIELD_ZOOM);

      return;
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    setView("fit");
  }

  return (
    <nav
      aria-label="Editor"
      className="bg-background border-border relative z-30 grid shrink-0 grid-cols-4 border-t px-[max(0.5rem,env(safe-area-inset-left))] pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <Tab
        icon={IconFiles}
        label="Invoices"
        pressed={leftPanelOpen}
        onClick={() => togglePanel("left")}
      />
      <Tab
        icon={IconAdjustmentsHorizontal}
        label="Style"
        pressed={rightPanelOpen}
        onClick={() => togglePanel("right")}
      />
      <Tab
        icon={mode === "preview" || !canEdit ? IconPencil : IconEye}
        label={mode === "preview" || !canEdit ? "Edit" : "Preview"}
        disabled={!canEdit}
        onClick={toggleMode}
      />
      <Tab
        icon={isZoomedToField ? IconCheck : isFit ? IconZoomIn : IconZoomOut}
        label={isZoomedToField ? "Done" : isFit ? "Zoom in" : "Fit page"}
        onClick={handleZoom}
      />
    </nav>
  );
}

function Tab({
  icon: Icon,
  label,
  pressed,
  disabled = false,
  onClick
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "text-muted-foreground focus-visible:ring-ring flex h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-medium outline-none focus-visible:ring-1 focus-visible:ring-inset disabled:opacity-50",
        pressed && "text-foreground"
      )}
    >
      <Icon aria-hidden className="size-5" />
      {label}
    </button>
  );
}
