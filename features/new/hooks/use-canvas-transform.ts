import { useGesture } from "@use-gesture/react";
import {
  canvasLockAtom,
  initializeCanvasLock
} from "features/new/state/canvas-lock";
import { useAtomValue, useSetAtom } from "jotai";
import type { RefObject } from "react";
import { useEffect, useRef, useState } from "react";

const VERTICAL_PADDING = 16;

type Transform = {
  x: number;
  y: number;
};

const DEFAULT_TRANSFORM: Transform = { x: 0, y: 0 };

export function useCanvasTransform(): {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLDivElement | null>;
  transform: Transform;
  locked: boolean;
  handleLock: () => void;
} {
  const locked = useAtomValue(canvasLockAtom);
  const setLocked = useSetAtom(canvasLockAtom);

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);

  function handleLock() {
    setLocked(!locked);

    // Reset position when locking/unlocking
    setTransform(DEFAULT_TRANSFORM);
  }

  // Calculate max vertical offset based on canvas height and margin
  function getMaxVerticalOffset() {
    if (!canvasRef.current || !containerRef.current) return Infinity;

    // offsetHeight includes padding and border, but not margins
    const canvasHeight = canvasRef.current.offsetHeight;
    const viewportHeight = containerRef.current.clientHeight;
    // Add margins (top + bottom)
    const totalHeight = canvasHeight + VERTICAL_PADDING * 2;

    // If canvas fits in viewport, no scrolling needed
    if (totalHeight <= viewportHeight) return 0;

    // Calculate how much we can scroll to show full canvas with margin
    // When centered (y=0), canvas is in middle
    // To see top: scroll up (negative y) by (totalHeight - viewportHeight) / 2
    // To see bottom: scroll down (positive y) by same amount
    return (totalHeight - viewportHeight) / 2;
  }

  // Gesture handlers - vertical scrolling with padding above and below canvas
  useGesture(
    {
      onWheel: ({ delta: [, dy], event }) => {
        event.preventDefault();

        setTransform(t => {
          const maxVerticalOffset = getMaxVerticalOffset();
          const newY = t.y - dy;

          // Clamp to allow scrolling through full canvas with padding
          const clampedY = Math.max(
            -maxVerticalOffset,
            Math.min(maxVerticalOffset, newY)
          );

          return { x: 0, y: clampedY };
        });
      }
    },
    {
      target: containerRef,
      wheel: { eventOptions: { passive: false } }
    }
  );

  // Initialize lock state from cookie on mount
  useEffect(() => {
    initializeCanvasLock(setLocked);
  }, [setLocked]);

  return {
    containerRef,
    canvasRef,
    transform,
    locked,
    handleLock
  };
}
