import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type CanvasView = "fit" | number;

// Below this width the A4 page is wider than the screen, so the editor opens
// fitted to show the whole invoice and the user zooms in to edit.
const NARROW_VIEWPORT_QUERY = "(max-width: 767px)";

const CanvasViewContext = createContext<{
  view: CanvasView;
  setView: (view: CanvasView) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
} | null>(null);

export function CanvasViewProvider({ children }: { children: ReactNode }) {
  // The editor only renders on the client, so the viewport is known here.
  const [view, setView] = useState<CanvasView>(() =>
    window.matchMedia(NARROW_VIEWPORT_QUERY).matches ? "fit" : 1
  );
  // The scale actually applied to the page; equals `view` unless fitting.
  const [zoom, setZoom] = useState(1);

  const value = { view, setView, zoom, setZoom };

  return (
    <CanvasViewContext.Provider value={value}>
      {children}
    </CanvasViewContext.Provider>
  );
}

export function useCanvasView() {
  const context = useContext(CanvasViewContext);

  if (!context) {
    throw new Error("useCanvasView must be used within a CanvasViewProvider");
  }

  return context;
}
