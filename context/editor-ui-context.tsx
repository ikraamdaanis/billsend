import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { useMediaQuery } from "~/hooks/use-media-query";

type EditorMode = "edit" | "preview";

type PanelState = { left: boolean; right: boolean };

const PANELS_STORAGE_KEY = "billsend-editor-panels";

// Below this width the side panels open over the canvas instead of beside it,
// so they start closed there.
export const NARROW_VIEWPORT_QUERY = "(max-width: 767px)";

function readStoredPanels(): PanelState {
  if (window.matchMedia(NARROW_VIEWPORT_QUERY).matches) {
    return { left: false, right: false };
  }

  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(PANELS_STORAGE_KEY) ?? "null"
    );

    if (
      typeof stored === "object" &&
      stored !== null &&
      "left" in stored &&
      "right" in stored
    ) {
      return { left: stored.left === true, right: stored.right === true };
    }
  } catch {
    // Unreadable or blocked storage falls through to the default.
  }

  return { left: true, right: true };
}

function storePanels(panels: PanelState) {
  if (window.matchMedia(NARROW_VIEWPORT_QUERY).matches) return;

  try {
    localStorage.setItem(PANELS_STORAGE_KEY, JSON.stringify(panels));
  } catch {
    // Not remembering the layout is fine.
  }
}

// The editor shell's own state: whether the page is being edited or previewed,
// and which side panels are open. Previewing hides both panels and leaving it
// puts back whichever were open.
const EditorUiContext = createContext<{
  mode: EditorMode;
  setMode: (mode: EditorMode) => void;
  toggleMode: () => void;
  isNarrow: boolean;
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  setPanelOpen: (side: keyof PanelState, open: boolean) => void;
  togglePanel: (side: keyof PanelState) => void;
  toggleAllPanels: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
} | null>(null);

export function EditorUiProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<EditorMode>("edit");
  const [panels, setPanels] = useState<PanelState>(readStoredPanels);
  const [panelsBeforePreview, setPanelsBeforePreview] =
    useState<PanelState | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const isNarrow = useMediaQuery(NARROW_VIEWPORT_QUERY);

  function applyPanels(next: PanelState) {
    setPanels(next);
    storePanels(next);
  }

  function setMode(next: EditorMode) {
    if (next === mode) return;

    if (next === "preview") {
      setPanelsBeforePreview(panels);
      setPanels({ left: false, right: false });
    } else {
      setPanels(panelsBeforePreview ?? panels);
      setPanelsBeforePreview(null);
    }

    setModeState(next);
  }

  // Opening a panel while previewing goes back to editing first; on a phone
  // only one panel is open at a time, since each covers most of the screen.
  function setPanelOpen(side: keyof PanelState, open: boolean) {
    const base = mode === "preview" ? (panelsBeforePreview ?? panels) : panels;
    const next = { ...base, [side]: open };

    if (isNarrow && open) next[side === "left" ? "right" : "left"] = false;

    if (mode === "preview") {
      setModeState("edit");
      setPanelsBeforePreview(null);
    }

    applyPanels(next);
  }

  const leftPanelOpen = panels.left;
  const rightPanelOpen = panels.right;

  const value = {
    mode,
    setMode,
    toggleMode: () => setMode(mode === "edit" ? "preview" : "edit"),
    isNarrow,
    leftPanelOpen,
    rightPanelOpen,
    setPanelOpen,
    togglePanel: (side: keyof PanelState) => setPanelOpen(side, !panels[side]),
    toggleAllPanels: () => {
      const anyOpen = leftPanelOpen || rightPanelOpen;

      if (mode === "preview") setModeState("edit");
      setPanelsBeforePreview(null);
      applyPanels({ left: !anyOpen, right: !anyOpen && !isNarrow });
    },
    paletteOpen,
    setPaletteOpen
  };

  return (
    <EditorUiContext.Provider value={value}>
      {children}
    </EditorUiContext.Provider>
  );
}

export function useEditorUi() {
  const context = useContext(EditorUiContext);

  if (!context) {
    throw new Error("useEditorUi must be used within an EditorUiProvider");
  }

  return context;
}
