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

const MAX_PINCH_ZOOM = 3;

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

  // The field a phone zoomed in on, and the point a pinch, trackpad pinch or
  // double-tap is zooming around; each is brought into view, or back under
  // the fingers, once the new zoom applies.
  const fieldToRevealRef = useRef<HTMLElement | null>(null);
  const zoomAnchorRef = useRef<ZoomAnchor | null>(null);
  const zoomRef = useRef(zoom);
  const setViewRef = useRef(setView);

  useLayoutEffect(() => {
    setZoom(zoom);
    zoomRef.current = zoom;
    setViewRef.current = setView;

    const section = sectionRef.current;
    const page = pageRef.current;
    const field = fieldToRevealRef.current;
    const anchor = zoomAnchorRef.current;

    if (!section || !page) return;

    if (field) {
      fieldToRevealRef.current = null;
      revealField(section, field);
    }

    if (anchor) {
      zoomAnchorRef.current = null;
      keepAnchorInPlace(section, page, anchor, zoom);
    }
  });

  // The browser's own pinch zoom would scale the whole editor, top bar and
  // all, so it is turned off (here for Safari, and with touch-action in
  // globals.css) and pinching the desk zooms the page instead, as in Figma
  // and tldraw. A trackpad pinch (a wheel event with Ctrl held) does the same
  // on a laptop, and double-tapping the desk flips between the whole page and
  // full size.
  useEffect(() => {
    const section = sectionRef.current;
    const page = pageRef.current;

    if (!section || !page) return;

    let pinch: { distance: number; zoom: number; pagePoint: Point } | null =
      null;
    let lastTap: { time: number; point: Point } | null = null;
    let tapStart: { time: number; point: Point } | null = null;

    // Zooms to `nextZoom`, keeping the page point under `screenPoint` there.
    function zoomAround(
      nextZoom: number,
      pagePoint: Point,
      screenPoint: Point
    ) {
      const clamped = Math.min(
        MAX_PINCH_ZOOM,
        Math.max(MIN_PINCH_ZOOM, nextZoom)
      );

      if (Math.abs(clamped - zoomRef.current) < 0.001) return;

      zoomAnchorRef.current = { pagePoint, screenPoint };
      setViewRef.current(clamped);
    }

    function pagePointAt(screenPoint: Point) {
      const pageRect = page?.getBoundingClientRect();

      return {
        x: (screenPoint.x - (pageRect?.left ?? 0)) / zoomRef.current,
        y: (screenPoint.y - (pageRect?.top ?? 0)) / zoomRef.current
      };
    }

    function preventBrowserZoom(event: Event) {
      event.preventDefault();
    }

    function handleTouchStart(event: TouchEvent) {
      if (event.touches.length === 2) {
        tapStart = null;
        pinch = {
          distance: touchDistance(event.touches),
          zoom: zoomRef.current,
          pagePoint: pagePointAt(touchMidpoint(event.touches))
        };

        return;
      }

      const touch = event.touches[0];

      tapStart =
        event.touches.length === 1
          ? {
              time: event.timeStamp,
              point: { x: touch.clientX, y: touch.clientY }
            }
          : null;
    }

    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];

      if (
        tapStart &&
        Math.hypot(
          touch.clientX - tapStart.point.x,
          touch.clientY - tapStart.point.y
        ) > 10
      ) {
        tapStart = null;
      }

      if (!pinch || event.touches.length !== 2) return;

      event.preventDefault();
      zoomAround(
        (pinch.zoom * touchDistance(event.touches)) / pinch.distance,
        pinch.pagePoint,
        touchMidpoint(event.touches)
      );
    }

    function handleTouchEnd(event: TouchEvent) {
      if (event.touches.length < 2) pinch = null;
      if (!tapStart || event.touches.length > 0) return;

      const tap = tapStart;
      tapStart = null;

      if (event.timeStamp - tap.time > 300 || isInteractive(event.target)) {
        lastTap = null;

        return;
      }

      const isDoubleTap =
        lastTap !== null &&
        tap.time - lastTap.time < 350 &&
        Math.hypot(
          tap.point.x - lastTap.point.x,
          tap.point.y - lastTap.point.y
        ) < 30;

      lastTap = isDoubleTap ? null : tap;

      if (!isDoubleTap) return;

      event.preventDefault();

      if (zoomRef.current < FIELD_ZOOM - 0.01) {
        zoomAround(FIELD_ZOOM, pagePointAt(tap.point), tap.point);
      } else {
        setViewRef.current("fit");
      }
    }

    function handleWheel(event: WheelEvent) {
      if (!event.ctrlKey && !event.metaKey) return;

      event.preventDefault();
      const screenPoint = { x: event.clientX, y: event.clientY };

      zoomAround(
        zoomRef.current * Math.exp(-event.deltaY * 0.01),
        pagePointAt(screenPoint),
        screenPoint
      );
    }

    for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
      document.addEventListener(type, preventBrowserZoom);
    }

    section.addEventListener("touchstart", handleTouchStart, { passive: true });
    section.addEventListener("touchmove", handleTouchMove, { passive: false });
    section.addEventListener("touchend", handleTouchEnd, { passive: false });
    section.addEventListener("touchcancel", handleTouchEnd);
    section.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
        document.removeEventListener(type, preventBrowserZoom);
      }

      section.removeEventListener("touchstart", handleTouchStart);
      section.removeEventListener("touchmove", handleTouchMove);
      section.removeEventListener("touchend", handleTouchEnd);
      section.removeEventListener("touchcancel", handleTouchEnd);
      section.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // On a phone the fitted page is too small to type into, so tapping a field
  // zooms in to full size around it; Done in the phone tab bar fits it again.
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
      className="relative flex h-full touch-pan-x touch-pan-y flex-col items-center-safe justify-center-safe overflow-auto overscroll-none p-3 md:p-8 md:pb-20"
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

type Point = { x: number; y: number };

type ZoomAnchor = { pagePoint: Point; screenPoint: Point };

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

// Taps on fields and buttons keep their own meaning; only taps on the page's
// bare paper or the desk count towards a double-tap zoom.
function isInteractive(target: EventTarget | null) {
  return (
    target instanceof Element &&
    target.closest("input, textarea, button, a, label, [role=button]") !== null
  );
}

// Scrolls so the anchored spot on the page sits at its screen point after the
// page has been scaled.
function keepAnchorInPlace(
  section: HTMLElement,
  page: HTMLElement,
  anchor: ZoomAnchor,
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
