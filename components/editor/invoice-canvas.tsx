import type { CSSProperties, ReactNode } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import { useCanvasView } from "~/context/canvas-view-context";
import { useTheme } from "~/stores/invoice-selectors";

const CANVAS_STATIC_STYLES: CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale"
};

const FIT_PADDING = 16;

export function InvoiceCanvas({ children }: { children: ReactNode }) {
  const { view } = useCanvasView();
  const theme = useTheme();
  const baseFont = getInvoiceFontDefinition(theme.font);
  const sectionRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const page = pageRef.current;
    const section = sectionRef.current;

    if (!page || !section) return;

    const pageObserver = new ResizeObserver(() => {
      setPageSize({ width: page.offsetWidth, height: page.offsetHeight });
    });
    const sectionObserver = new ResizeObserver(() => {
      setContainerSize({
        width: section.clientWidth,
        height: section.clientHeight
      });
    });

    pageObserver.observe(page);
    sectionObserver.observe(section);

    return () => {
      pageObserver.disconnect();
      sectionObserver.disconnect();
    };
  }, []);

  const zoom = resolveZoom(view, pageSize, containerSize);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-full flex-col items-center-safe justify-center-safe overflow-auto overscroll-none p-3 md:p-8"
    >
      <div
        className="shrink-0"
        style={
          pageSize.width
            ? { width: pageSize.width * zoom, height: pageSize.height * zoom }
            : undefined
        }
      >
        <div
          ref={pageRef}
          className="min-h-[297mm] w-[210mm] border border-zinc-300 bg-white p-[40pt] text-zinc-900 shadow-md"
          style={{
            ...CANVAS_STATIC_STYLES,
            fontFamily: baseFont.cssFamily,
            letterSpacing: baseFont.letterSpacing,
            transform: `scale(${zoom})`,
            transformOrigin: "top left"
          }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function resolveZoom(
  view: "fit" | number,
  pageSize: { width: number; height: number },
  containerSize: { width: number; height: number }
) {
  if (typeof view === "number") return view;

  if (!pageSize.width || !pageSize.height || !containerSize.width) return 1;

  const availableWidth = containerSize.width - FIT_PADDING * 2;
  const availableHeight = containerSize.height - FIT_PADDING * 2;

  return Math.min(
    availableWidth / pageSize.width,
    availableHeight / pageSize.height
  );
}
