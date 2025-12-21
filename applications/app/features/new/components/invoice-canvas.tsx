import { useCanvasTransform } from "features/new/hooks/use-canvas-transform";
import type { ReactNode } from "react";

export function InvoiceCanvas({
  children,
  onSectionClick
}: {
  children: ReactNode;
  onSectionClick?: () => void;
}) {
  const { containerRef, canvasRef, transform } = useCanvasTransform();

  return (
    <section
      ref={containerRef}
      className="relative h-full touch-none overflow-hidden"
      onClick={onSectionClick}
    >
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0) translateZ(0)`
        }}
      >
        <div
          ref={canvasRef}
          className="h-fit w-[210mm] border border-zinc-300 bg-white p-4 text-zinc-900 shadow-md sm:p-8 lg:p-16 xl:p-20"
          onClick={event => event.stopPropagation()}
          style={{
            marginTop: "16px",
            marginBottom: "16px",
            WebkitFontSmoothing: "antialiased",
            MozOsxFontSmoothing: "grayscale",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
