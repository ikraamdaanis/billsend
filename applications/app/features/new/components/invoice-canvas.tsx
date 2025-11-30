import { ZoomControls } from "features/new/components/zoom-controls";
import { useCanvasTransform } from "features/new/hooks/use-canvas-transform";
import { useZoomShortcuts } from "features/new/hooks/use-zoom-shortcuts";
import type { ReactNode } from "react";

export function InvoiceCanvas({
  children,
  onSectionClick
}: {
  children: ReactNode;
  onSectionClick?: () => void;
}) {
  const {
    containerRef,
    canvasRef,
    transform,
    isAnimating,
    locked,
    zoomIn,
    zoomOut,
    resetZoom,
    handleLock
  } = useCanvasTransform();

  useZoomShortcuts({
    locked,
    onZoomIn: zoomIn,
    onZoomOut: zoomOut,
    onReset: resetZoom
  });

  return (
    <section
      ref={containerRef}
      className="relative h-full touch-none overflow-hidden"
      onClick={onSectionClick}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) translateZ(0)`,
          transition: isAnimating ? `transform 200ms ease-out` : "none"
        }}
      >
        <div
          style={{
            transform: `scale(${transform.scale}) translateZ(0)`,
            transformOrigin: "center center",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transition: isAnimating ? `transform 200ms ease-out` : "none"
          }}
        >
          <div
            ref={canvasRef}
            className="h-fit w-[210mm] border border-zinc-300 bg-white p-4 text-zinc-900 shadow-md sm:p-8 lg:p-16 xl:p-20"
            onClick={event => event.stopPropagation()}
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
