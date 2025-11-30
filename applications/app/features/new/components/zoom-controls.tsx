import { Button } from "components/ui/button";
import { canvasLockAtom } from "features/new/state/canvas-lock";
import { useAtomValue } from "jotai";
import {
  LockIcon,
  MinusIcon,
  PlusIcon,
  RotateCcwIcon,
  UnlockIcon
} from "lucide-react";

export function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  onLock
}: {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onLock: () => void;
}) {
  const locked = useAtomValue(canvasLockAtom);

  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 rounded-lg border border-zinc-300 bg-white p-1 shadow-md">
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onZoomOut}
        disabled={locked}
      >
        <MinusIcon className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="size-8" onClick={onReset}>
        <RotateCcwIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onZoomIn}
        disabled={locked}
      >
        <PlusIcon className="h-4 w-4" />
      </Button>
      <span className="px-2 text-xs text-zinc-500">
        {Math.round(scale * 100)}%
      </span>
      <div className="h-6 w-px bg-zinc-300" />
      <Button
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={onLock}
        title={locked ? "Unlock canvas" : "Lock canvas"}
      >
        {locked ? (
          <LockIcon className="h-4 w-4" />
        ) : (
          <UnlockIcon className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
