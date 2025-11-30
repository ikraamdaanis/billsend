import {
  getCanvasLockState,
  setCanvasLockState
} from "features/new/utils/canvas-lock";
import { atom } from "jotai";

const baseAtom = atom<boolean>(false);

export const canvasLockAtom = atom(
  get => get(baseAtom),
  (get, set, value: boolean | ((prev: boolean) => boolean)) => {
    const current = get(baseAtom);
    const newValue = typeof value === "function" ? value(current) : value;
    set(baseAtom, newValue);
    setCanvasLockState(newValue);
  }
);

// Helper to initialize from cookie (call in useEffect on mount)
export function initializeCanvasLock(setLocked: (value: boolean) => void) {
  if (typeof document !== "undefined") {
    const cookieValue = getCanvasLockState();
    setLocked(cookieValue);
  }
}
