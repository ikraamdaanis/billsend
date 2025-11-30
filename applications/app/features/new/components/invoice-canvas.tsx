import { useGesture } from "@use-gesture/react";
import { ZoomControls } from "features/new/components/zoom-controls";
import {
  canvasLockAtom,
  initializeCanvasLock
} from "features/new/state/canvas-lock";
import { useAtomValue, useSetAtom } from "jotai";
import type { MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const MIN_SCALE = 0.8; // 80% minimum zoom
const MAX_SCALE = 4; // 400% maximum zoom
const DEFAULT_SCALE = 1;
const MAX_VERTICAL_OFFSET = 1002; // 2rem in pixels
const MAX_HORIZONTAL_OFFSET = 1002; // 2rem in pixels

interface Transform {
  x: number;
  y: number;
  scale: number;
}

const DEFAULT_TRANSFORM: Transform = { x: 0, y: 0, scale: DEFAULT_SCALE };

interface InvoiceCanvasProps {
  children: ReactNode;
  onSectionClick?: () => void;
}

export function InvoiceCanvas({
  children,
  onSectionClick
}: InvoiceCanvasProps) {
  const locked = useAtomValue(canvasLockAtom);
  const setLocked = useSetAtom(canvasLockAtom);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);

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
  // transform.y is in visual pixels (translate happens after scale in CSS)
  const getMaxVerticalOffset = useCallback((scale: number) => {
    if (!canvasRef.current || !containerRef.current) {
      return MAX_VERTICAL_OFFSET;
    }

    const canvasHeight = canvasRef.current.scrollHeight;
    const viewportHeight = containerRef.current.clientHeight;

    // Calculate the visual height of the canvas at current zoom
    const visualCanvasHeight = canvasHeight * scale;

    // If canvas is taller than viewport when zoomed, allow scrolling to see all of it
    // plus the 2rem buffer
    if (visualCanvasHeight > viewportHeight) {
      // How much extra we need to scroll to see the full canvas (in visual pixels)
      const extraScrollNeeded = (visualCanvasHeight - viewportHeight) / 2;
      // Add the 2rem buffer
      return extraScrollNeeded + MAX_VERTICAL_OFFSET;
    }

    // Otherwise, just the 2rem buffer
    return MAX_VERTICAL_OFFSET;
  }, []);

  // Calculate max horizontal offset based on canvas width, viewport, and zoom
  // transform.x is in visual pixels (translate happens after scale in CSS)
  const getMaxHorizontalOffset = useCallback((scale: number) => {
    if (!canvasRef.current || !containerRef.current) {
      return MAX_HORIZONTAL_OFFSET;
    }

    const canvasWidth = canvasRef.current.scrollWidth;
    const viewportWidth = containerRef.current.clientWidth;

    // Calculate the visual width of the canvas at current zoom
    const visualCanvasWidth = canvasWidth * scale;

    // If canvas is wider than viewport when zoomed, allow scrolling to see all of it
    // plus the 2rem buffer
    if (visualCanvasWidth > viewportWidth) {
      // How much extra we need to scroll to see the full canvas (in visual pixels)
      const extraScrollNeeded = (visualCanvasWidth - viewportWidth) / 2;
      // Add the 2rem buffer
      return extraScrollNeeded + MAX_HORIZONTAL_OFFSET;
    }

    // Otherwise, just the 2rem buffer
    return MAX_HORIZONTAL_OFFSET;
  }, []);

  // Gesture handlers - disabled when locked (except vertical panning within limits)
  useGesture(
    {
      onWheel: ({ delta: [dx, dy], event, pinching }) => {
        if (pinching) return;
        event.preventDefault();

        if (locked) {
          // When locked, only allow vertical panning within calculated limits
          setTransform(t => {
            const maxVerticalOffset = getMaxVerticalOffset(t.scale);
            const newY = t.y - dy;
            const clampedY = Math.max(
              -maxVerticalOffset,
              Math.min(maxVerticalOffset, newY)
            );
            return {
              ...t,
              x: 0, // Always center horizontally when locked
              y: clampedY
            };
          });
          return;
        }

        // Cmd + wheel = zoom
        if (event.metaKey) {
          const delta = -dy * 0.002;
          setTransform(t => ({
            ...t,
            scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale + delta))
          }));
          return;
        }

        // Two-finger scroll = pan (with ±2rem limits)
        setTransform(t => {
          const maxVerticalOffset = getMaxVerticalOffset(t.scale);
          const maxHorizontalOffset = getMaxHorizontalOffset(t.scale);
          const newX = t.x - dx;
          const clampedX = Math.max(
            -maxHorizontalOffset,
            Math.min(maxHorizontalOffset, newX)
          );
          const newY = t.y - dy;
          const clampedY = Math.max(
            -maxVerticalOffset,
            Math.min(maxVerticalOffset, newY)
          );
          return {
            ...t,
            x: clampedX,
            y: clampedY
          };
        });
      },
      onPinch: ({ offset: [scale], event }) => {
        if (locked) return;
        event.preventDefault();
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
        // Use ref to get current scale, avoiding stale closure
        from: () => [scaleRef.current, 0]
      }
    }
  );

  const zoomIn = useCallback(() => {
    setTransform(t => ({
      ...t,
      scale: Math.min(MAX_SCALE, t.scale + 0.1)
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(t => ({
      ...t,
      scale: Math.max(MIN_SCALE, t.scale - 0.1)
    }));
  }, []);

  const resetZoom = useCallback(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, []);

  const handleLock = useCallback(() => {
    const wasLocked = locked;
    setLocked(!wasLocked);
    // When locking, center horizontally but keep current zoom and vertical position
    if (!wasLocked) {
      setTransform(t => ({
        ...t,
        x: 0 // Center horizontally, keep current y and scale
      }));
    }
  }, [locked, setLocked]);

  function handleCanvasClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
  }

  return (
    <section
      ref={containerRef}
      className="relative h-full touch-none overflow-hidden"
      onClick={onSectionClick}
    >
      {/* Canvas with GPU-accelerated transforms - optimized for crisp rendering in Chrome */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) translateZ(0)`
        }}
      >
        <div
          style={{
            transform: `scale(${transform.scale}) translateZ(0)`,
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          <div
            ref={canvasRef}
            className="h-fit w-[210mm] border border-zinc-300 bg-white p-4 text-zinc-900 shadow-md sm:p-8 lg:p-16 xl:p-20"
            onClick={handleCanvasClick}
            style={{
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden"
            }}
          >
            {children}
          </div>
        </div>
      </div>
      <ZoomControls
        scale={transform.scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
        onLock={handleLock}
      />
    </section>
  );
}
