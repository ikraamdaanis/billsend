import { IconMinus, IconPlus } from "@tabler/icons-react";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { InvoiceFont, InvoiceTheme, TextRole } from "~/types";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

// Static replicas of the editor for the homepage, built from the editor's own
// chrome and role styles at its native pixel size, then scaled down as a
// whole, so a preview is the real layout at a smaller scale rather than a
// drawing of it. Class names mirror components/editor/*; keep them in step
// when the editor changes.

// The A4 page in CSS pixels (210mm x 297mm), and the editor's toolbar height.
export const PAGE_WIDTH = 793.7;

export const PAGE_HEIGHT = 1122.5;

const TOOLBAR_HEIGHT = 64;

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
 * The editor on a desktop window: the toolbar, the desk and, as `children`,
 * the invoice page at 100%.
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
      className="bg-background text-foreground font-geist relative [font-feature-settings:normal] antialiased"
      style={{ width, height }}
    >
      <EditorToolbar documentName={documentName} />
      <div
        className="bg-desk relative flex w-full flex-col"
        style={{ height: height - TOOLBAR_HEIGHT }}
      >
        <div className="relative flex h-full flex-col items-center-safe justify-center-safe overflow-hidden p-8 pb-20">
          <div
            className="shrink-0"
            style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
          >
            {children}
          </div>
        </div>
        <ZoomControl />
      </div>
    </div>
  );
}

function EditorToolbar({ documentName }: { documentName: string }) {
  return (
    <div
      className="bg-background border-border flex w-full items-center gap-1 border-b px-3"
      style={{ height: TOOLBAR_HEIGHT }}
    >
      <img
        src="/favicon.svg"
        alt=""
        className="rounded-surface size-9 shrink-0"
      />
      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex min-w-0 self-start">
          <span className="rounded-surface flex h-6 min-w-0 items-center px-2 py-0">
            <span className="text-foreground truncate text-base font-medium">
              {documentName}
            </span>
          </span>
        </div>
        <div className="rounded-surface flex h-6 items-center gap-0.5 px-[3px]">
          {["File", "Edit", "View"].map(menu => (
            <span
              key={menu}
              className="rounded-surface flex items-center px-1.5 py-[2px] text-sm font-medium select-none"
            >
              {menu}
            </span>
          ))}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button>Download</Button>
      </div>
    </div>
  );
}

function ZoomControl() {
  return (
    <div className="bg-background border-border rounded-control shadow-menu absolute right-3 bottom-3 z-10 flex items-center border p-0.5">
      <Button variant="ghost" size="icon">
        <IconMinus aria-hidden="true" />
      </Button>
      <Button variant="ghost" className="min-w-14 px-1.5 tabular-nums">
        100%
      </Button>
      <Button variant="ghost" size="icon">
        <IconPlus aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * The invoice title as the editor sets it, in the given face.
 */
export function getTitleStyle(font: InvoiceFont): CSSProperties {
  return roleStyle(getSampleTheme(font), "title");
}
