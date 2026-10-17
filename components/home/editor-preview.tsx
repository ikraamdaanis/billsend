import {
  IconChevronDown,
  IconCommand,
  IconEye,
  IconLayoutSidebar,
  IconLayoutSidebarRight,
  IconMinus,
  IconMoon,
  IconPencil,
  IconPlayerPlay,
  IconPlus
} from "@tabler/icons-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { InvoiceFont, InvoiceTheme, TextRole } from "~/types";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

// Static replicas of the editor for the homepage, built from the editor's own
// chrome and role styles at its native pixel size, then scaled down as a
// whole, so a preview is the real layout at a smaller scale rather than a
// drawing of it. Class names mirror components/editor/*; keep them in step
// when the editor changes.

// The A4 page in CSS pixels (210mm x 297mm), and the editor's top bar height.
export const PAGE_WIDTH = 793.7;

export const PAGE_HEIGHT = 1122.5;

const TOP_BAR_HEIGHT = 48;

function getSampleTheme(font: InvoiceFont): InvoiceTheme {
  return { font, fontWeight: "Normal", size: "medium", accent: "#1a1a1a" };
}

function roleStyle(
  theme: InvoiceTheme,
  role: TextRole,
  remove: "align"[] = []
): CSSProperties {
  return getTextStyles({ settings: getRoleSettings(theme, role), remove });
}

/**
 * Shows a `width` x `height` window onto native-size content, scaled to the
 * width of its container (never above 1:1 unless `fill` is set), with `x` and
 * `y` picking the region. The first paint scales in pure CSS, where
 * tan(atan2(a, b)) turns the ratio of two lengths into a number. Once hydrated
 * the frame measures itself instead: iOS Safari resolves that 100cqw before a
 * flex item grows and never updates it, which left grown frames drawn tiny.
 */
export function ScaledFrame({
  width,
  height,
  x = 0,
  y = 0,
  fill = false,
  className,
  children
}: {
  width: number;
  height: number;
  x?: number;
  y?: number;
  fill?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [measuredScale, setMeasuredScale] = useState<number | null>(null);

  useEffect(() => {
    const frame = frameRef.current;

    if (!frame) return;

    const observer = new ResizeObserver(entries => {
      const frameWidth = entries[0]?.contentRect.width;

      if (frameWidth) setMeasuredScale(frameWidth / width);
    });

    observer.observe(frame);

    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      inert
      className={cn("@container relative w-full overflow-hidden", className)}
      style={{
        maxWidth: fill ? undefined : width,
        aspectRatio: `${width} / ${height}`
      }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width,
          height,
          scale: measuredScale ?? `tan(atan2(100cqw, ${width}px))`
        }}
      >
        <div className="absolute" style={{ left: -x, top: -y }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * The editor on a desktop window, with its side panels closed: the top bar,
 * the desk with the canvas pill, and, as `children`, the invoice page at 100%.
 * `data-editor-chrome` gives it the editor's own light palette.
 */
export function EditorWindow({
  documentName,
  width,
  height,
  children
}: {
  documentName: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <div
      data-editor-chrome
      className="bg-background text-foreground font-geist relative flex flex-col [font-feature-settings:normal] antialiased"
      style={{ width, height }}
    >
      <EditorTopBar documentName={documentName} />
      <div className="bg-desk relative flex min-h-0 w-full flex-1 flex-col">
        <div className="relative flex h-full flex-col items-center-safe justify-center-safe overflow-hidden p-8 pb-20">
          <div
            className="shrink-0"
            style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
          >
            {children}
          </div>
        </div>
        <CanvasPill />
      </div>
    </div>
  );
}

// Mirrors components/editor/shell/editor-top-bar.tsx.
function EditorTopBar({ documentName }: { documentName: string }) {
  return (
    <div
      className="bg-background border-border grid w-full shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 border-b px-3"
      style={{ height: TOP_BAR_HEIGHT }}
    >
      <div className="flex min-w-0 items-center gap-1">
        <span className="text-muted-foreground flex h-8 items-center gap-0.5 rounded-md pr-1 pl-0.5">
          <img src="/favicon.svg" alt="" className="size-6 rounded-[6px]" />
          <IconChevronDown aria-hidden="true" className="size-3.5" />
        </span>
        <span className="text-muted-foreground flex size-7 items-center justify-center">
          <IconLayoutSidebar aria-hidden="true" className="size-4" />
        </span>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-foreground flex h-7 items-center px-2 text-sm font-medium">
          {documentName}
        </span>
        <span className="flex size-6 items-center justify-center">
          <span aria-hidden="true" className="bg-success size-2 rounded-full" />
          <span className="sr-only">Draft on this device</span>
        </span>
      </div>
      <div className="flex min-w-0 items-center justify-end gap-1">
        <span className="text-muted-foreground flex size-7 items-center justify-center">
          <IconLayoutSidebarRight aria-hidden="true" className="size-4" />
        </span>
        <span className="text-muted-foreground mr-1 flex size-7 items-center justify-center">
          <IconPlayerPlay aria-hidden="true" className="size-4" />
        </span>
        <span
          className={buttonVariants({
            variant: "primary",
            size: "sm",
            className: "h-8 px-3"
          })}
        >
          Download
        </span>
      </div>
    </div>
  );
}

// Mirrors components/editor/shell/canvas-pill.tsx.
function CanvasPill() {
  return (
    <div className="bg-popover ring-foreground/10 shadow-menu absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl p-1 ring-1">
      <div className="bg-muted flex items-center rounded-lg p-0.5">
        <span className="bg-popover text-foreground ring-foreground/10 flex h-6 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium shadow-xs ring-1">
          <IconPencil aria-hidden="true" className="size-3.5" />
          Edit
        </span>
        <span className="text-muted-foreground flex h-6 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium">
          <IconEye aria-hidden="true" className="size-3.5" />
          Preview
        </span>
      </div>
      <PillDivider />
      <span className="text-muted-foreground flex size-7 items-center justify-center">
        <IconMinus aria-hidden="true" className="size-4" />
      </span>
      <span className="flex h-7 min-w-16 items-center justify-center gap-0.5 px-1.5 text-xs font-medium tabular-nums">
        100%
        <IconChevronDown
          aria-hidden="true"
          className="text-muted-foreground size-3"
        />
      </span>
      <span className="text-muted-foreground flex size-7 items-center justify-center">
        <IconPlus aria-hidden="true" className="size-4" />
      </span>
      <PillDivider />
      <span className="text-muted-foreground flex size-7 items-center justify-center">
        <IconMoon aria-hidden="true" className="size-4" />
      </span>
      <span className="text-muted-foreground flex size-7 items-center justify-center">
        <IconCommand aria-hidden="true" className="size-4" />
      </span>
    </div>
  );
}

function PillDivider() {
  return <span aria-hidden="true" className="bg-border mx-0.5 h-5 w-px" />;
}

/**
 * The invoice title as the editor sets it, in the given face.
 */
export function getTitleStyle(font: InvoiceFont): CSSProperties {
  return roleStyle(getSampleTheme(font), "title");
}
