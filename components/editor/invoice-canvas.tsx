import type { CSSProperties, FocusEvent, ReactNode } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import { FIELD_ZOOM, useCanvasView } from "~/context/canvas-view-context";
import { useEditorUi } from "~/context/editor-ui-context";
import { useTheme } from "~/stores/invoice-selectors";

const CANVAS_STATIC_STYLES: CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale"
};

const MIN_PINCH_ZOOM = 0.25;

const MAX_PINCH_ZOOM = 2;

export function InvoiceCanvas({ children }: { children: ReactNode }) {
  const { view, setView, setZoom, zoomToField } = useCanvasView();
  const { mode, isNarrow } = useEditorUi();
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
      const styles = getComputedStyle(section);
      const paddingX =
        parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
      const paddingY =
        parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

      setContainerSize({
        width: section.clientWidth - paddingX,
        height: section.clientHeight - paddingY
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

  // The field a phone zoomed in on, and the point a pinch is zooming around;
  // each is brought back under the finger or into view once the zoom applies.
  const fieldToRevealRef = useRef<HTMLElement | null>(null);
  const pinchAnchorRef = useRef<PinchAnchor | null>(null);
  const zoomRef = useRef(zoom);
  const setViewRef = useRef(setView);

  useLayoutEffect(() => {
    setZoom(zoom);
    zoomRef.current = zoom;
    setViewRef.current = setView;

    const section = sectionRef.current;
    const page = pageRef.current;
    const field = fieldToRevealRef.current;
    const anchor = pinchAnchorRef.current;

    if (!section || !page) return;

    if (field) {
      fieldToRevealRef.current = null;
      revealField(section, field);
    }

    if (anchor) keepAnchorUnderFingers(section, page, anchor, zoom);
  });

  // Pinching the canvas zooms the page rather than the whole editor.
  useEffect(() => {
    const section = sectionRef.current;
    const page = pageRef.current;

    if (!section || !page) return;

    let pinch: { distance: number; zoom: number } | null = null;

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length !== 2 || !page) return;

      pinch = { distance: touchDistance(event.touches), zoom: zoomRef.current };
      pinchAnchorRef.current = pinchAnchor(
        page,
        event.touches,
        zoomRef.current
      );
    }

    function handleTouchMove(event: TouchEvent) {
      if (!pinch || event.touches.length !== 2 || !page) return;

      event.preventDefault();
      const nextZoom =
        (pinch.zoom * touchDistance(event.touches)) / pinch.distance;
      const anchor = pinchAnchorRef.current;

      if (anchor) anchor.screenPoint = touchMidpoint(event.touches);
      setViewRef.current(
        Math.min(MAX_PINCH_ZOOM, Math.max(MIN_PINCH_ZOOM, nextZoom))
      );
    }

    function handleTouchEnd(event: TouchEvent) {
      if (event.touches.length >= 2) return;

      pinch = null;
      pinchAnchorRef.current = null;
    }

    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    section.addEventListener("touchend", handleTouchEnd);
    section.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("touchend", handleTouchEnd);
      section.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  // On a phone the fitted page is too small to type into, so tapping a field
  // zooms in to full size around it; Done in the canvas pill fits it again.
  function handleFocus(event: FocusEvent<HTMLElement>) {
    const field = event.target;
    const isTextField =
      field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement;

    if (!isNarrow || mode !== "edit" || !isTextField) return;
    if (zoom >= FIELD_ZOOM || !pageRef.current?.contains(field)) return;

    fieldToRevealRef.current = field;
    zoomToField();
  }

  return (
    <section
      ref={sectionRef}
      onFocus={handleFocus}
      className="relative flex h-full touch-pan-x touch-pan-y flex-col items-center-safe justify-center-safe overflow-auto overscroll-none p-3 pb-20 md:p-8 md:pb-20"
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
          data-paper
          className="border-paper-border bg-paper text-paper-foreground min-h-[297mm] w-[210mm] border p-[40pt] shadow-md"
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

  return Math.min(
    containerSize.width / pageSize.width,
    containerSize.height / pageSize.height
  );
}

type PinchAnchor = {
  pagePoint: { x: number; y: number };
  screenPoint: { x: number; y: number };
};

function touchDistance(touches: TouchList) {
  const [first, second] = [touches[0], touches[1]];

  return Math.hypot(
    first.clientX - second.clientX,
    first.clientY - second.clientY
  );
}

function touchMidpoint(touches: TouchList) {
  const [first, second] = [touches[0], touches[1]];

  return {
    x: (first.clientX + second.clientX) / 2,
    y: (first.clientY + second.clientY) / 2
  };
}

// The spot on the unscaled page under the middle of the two fingers.
function pinchAnchor(
  page: HTMLElement,
  touches: TouchList,
  zoom: number
): PinchAnchor {
  const pageRect = page.getBoundingClientRect();
  const screenPoint = touchMidpoint(touches);

  return {
    pagePoint: {
      x: (screenPoint.x - pageRect.left) / zoom,
      y: (screenPoint.y - pageRect.top) / zoom
    },
    screenPoint
  };
}

// Scrolls so the pinched spot stays between the fingers as the page scales.
function keepAnchorUnderFingers(
  section: HTMLElement,
  page: HTMLElement,
  anchor: PinchAnchor,
  zoom: number
) {
  const pageRect = page.getBoundingClientRect();

  section.scrollLeft +=
    pageRect.left + anchor.pagePoint.x * zoom - anchor.screenPoint.x;
  section.scrollTop +=
    pageRect.top + anchor.pagePoint.y * zoom - anchor.screenPoint.y;
}

// Brings a field into view high on the canvas, clear of the keyboard that is
// about to cover the lower half of the screen. A field that fits ends at the
// right edge, so its label (to its left on the page) stays in view; a wider
// one starts at the left edge.
function revealField(section: HTMLElement, field: HTMLElement) {
  const sectionRect = section.getBoundingClientRect();
  const fieldRect = field.getBoundingClientRect();
  const margin = 16;
  const left =
    fieldRect.width > sectionRect.width - margin * 2
      ? fieldRect.left - sectionRect.left - margin
      : fieldRect.right - sectionRect.right + margin;

  section.scrollTo({
    left: section.scrollLeft + left,
    top:
      section.scrollTop +
      fieldRect.top -
      sectionRect.top -
      sectionRect.height * 0.15
  });
}
