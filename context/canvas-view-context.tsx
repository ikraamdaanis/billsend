import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

type CanvasView = "fit" | number;

type CanvasViewContextValue = {
  view: CanvasView;
  setView: (view: CanvasView) => void;
};

const CanvasViewContext = createContext<CanvasViewContextValue | null>(null);

export function CanvasViewProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<CanvasView>(1);

  const value = { view, setView };

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
