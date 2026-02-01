import type { ReactNode } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { SettingsType } from "types";
import { getCanvasLockState, setCanvasLockState } from "utils/canvas-lock";

type UIContextValue = {
  activeSettings: SettingsType;
  setActiveSettings: (settings: SettingsType) => void;
  canvasLock: boolean;
  setCanvasLock: (locked: boolean) => void;
};

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [activeSettings, setActiveSettings] = useState<SettingsType>("main");
  const [canvasLock, setCanvasLockState_internal] = useState(false);

  // Initialize canvas lock from cookie on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookieValue = getCanvasLockState();
      setCanvasLockState_internal(cookieValue);
    }
  }, []);

  const setCanvasLock = useCallback((locked: boolean) => {
    setCanvasLockState_internal(locked);
    setCanvasLockState(locked); // Persist to cookie
  }, []);

  const value = useMemo(
    () => ({
      activeSettings,
      setActiveSettings,
      canvasLock,
      setCanvasLock
    }),
    [activeSettings, canvasLock, setCanvasLock]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
