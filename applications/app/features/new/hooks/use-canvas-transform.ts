import { useGesture } from "@use-gesture/react";
import {
  canvasLockAtom,
  initializeCanvasLock
} from "features/new/state/canvas-lock";
import { useAtomValue, useSetAtom } from "jotai";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

// Zoom levels as decimal values (80% = 0.8, 100% = 1, etc.)
const ZOOM_LEVELS = [0.8, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4];
const MIN_SCALE = ZOOM_LEVELS[0];
const MAX_SCALE = ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
const DEFAULT_SCALE = 1;
const MAX_VERTICAL_OFFSET = 1000;
const MAX_HORIZONTAL_OFFSET = 1000;

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const DEFAULT_TRANSFORM: Transform = { x: 0, y: 0, scale: DEFAULT_SCALE };

export function useCanvasTransform(): {
  containerRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLDivElement | null>;
  transform: Transform;
  isAnimating: boolean;
  locked: boolean;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  handleLock: () => void;
} {
  const locked = useAtomValue(canvasLockAtom);
  const setLocked = useSetAtom(canvasLockAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initialize lock state from cookie on mount
  useEffect(() => {
    initializeCanvasLock(setLocked);
  }, [setLocked]);

  // Use ref to avoid stale closure in gesture callbacks
  const scaleRef = useRef(DEFAULT_SCALE);

  useEffect(() => {
    scaleRef.current = transform.scale;
  }, [transform.scale]);

  // Calculate max vertical offset based on canvas height, viewport, and zoom
  const getMaxVerticalOffset = useCallback((scale: number) => {
    if (!canvasRef.current || !containerRef.current) {
      return MAX_VERTICAL_OFFSET;
    }

    const canvasHeight = canvasRef.current.scrollHeight;
    const viewportHeight = containerRef.current.clientHeight;
    const visualCanvasHeight = canvasHeight * scale;

    if (visualCanvasHeight > viewportHeight) {
      return (visualCanvasHeight - viewportHeight) / 2 + MAX_VERTICAL_OFFSET;
    }

    return MAX_VERTICAL_OFFSET;
  }, []);

  // Calculate max horizontal offset based on canvas width, viewport, and zoom
  const getMaxHorizontalOffset = useCallback((scale: number) => {
    if (!canvasRef.current || !containerRef.current) {
      return MAX_HORIZONTAL_OFFSET;
    }

    const canvasWidth = canvasRef.current.scrollWidth;
    const viewportWidth = containerRef.current.clientWidth;
    const visualCanvasWidth = canvasWidth * scale;

    if (visualCanvasWidth > viewportWidth) {
      return (visualCanvasWidth - viewportWidth) / 2 + MAX_HORIZONTAL_OFFSET;
    }

    return MAX_HORIZONTAL_OFFSET;
  }, []);

  // Gesture handlers - disabled when locked (except vertical panning within limits)
  useGesture(
    {
      onWheel: ({ delta: [dx, dy], event, pinching }) => {
        if (pinching) return;

        event.preventDefault();
        setIsAnimating(false);

        if (locked) {
          return setTransform(t => {
            const maxVerticalOffset = getMaxVerticalOffset(t.scale);
            const newY = t.y - dy;
            const clampedY = Math.max(
              -maxVerticalOffset,
              Math.min(maxVerticalOffset, newY)
            );

            return { ...t, x: 0, y: clampedY };
          });
        }

        // Cmd + wheel = zoom
        if (event.metaKey) {
          const delta = -dy * 0.002;

          return setTransform(t => ({
            ...t,
            scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale + delta))
          }));
        }

        // Two-finger scroll = pan
        setTransform(t => {
          const maxVerticalOffset = getMaxVerticalOffset(t.scale);
          const maxHorizontalOffset = getMaxHorizontalOffset(t.scale);
          const clampedX = Math.max(
            -maxHorizontalOffset,
            Math.min(maxHorizontalOffset, t.x - dx)
          );
          const clampedY = Math.max(
            -maxVerticalOffset,
            Math.min(maxVerticalOffset, t.y - dy)
          );

          return { ...t, x: clampedX, y: clampedY };
        });
      },
      onPinch: ({ offset: [scale], event }) => {
        if (locked) return;

        event.preventDefault();

        setIsAnimating(false);
        setTransform(t => ({
          ...t,
          scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale))
        }));
      }
    },
    {
      target: containerRef,
      wheel: { eventOptions: { passive: false } },
      pinch: {
        scaleBounds: { min: MIN_SCALE, max: MAX_SCALE },
        from: () => [scaleRef.current, 0]
      }
    }
  );

  const zoomIn = useCallback(() => {
    setIsAnimating(true);

    setTransform(t => {
      const nextLevel = ZOOM_LEVELS.find(level => level > t.scale);
      return { ...t, scale: nextLevel ?? MAX_SCALE };
    });
  }, []);

  const zoomOut = useCallback(() => {
    setIsAnimating(true);

    setTransform(t => {
      const prevLevel = [...ZOOM_LEVELS]
        .reverse()
        .find(level => level < t.scale);
      return { ...t, scale: prevLevel ?? MIN_SCALE };
    });
  }, []);

  const resetZoom = useCallback(() => {
    setIsAnimating(true);
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  const handleLock = useCallback(() => {
    const wasLocked = locked;

    setLocked(!wasLocked);

    if (!wasLocked) {
      setIsAnimating(true);
      setTransform(t => ({ ...t, x: 0 }));
    }
  }, [locked, setLocked]);

  return {
    containerRef,
    canvasRef,
    transform,
    isAnimating,
    locked,
    zoomIn,
    zoomOut,
    resetZoom,
    handleLock
  };
}
