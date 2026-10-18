import { IconExternalLink } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import {
  DESIGN_BLOCKS,
  DESIGN_VIEWPORTS
} from "~/components/design/design-blocks";
import { usePersistentState } from "~/hooks/use-persistent-state";
import { cn } from "~/lib/utils";
import type { DesignBlock, DesignViewport } from "~/types";

const THEME_FILTERS = ["both", "light", "dark"] as const;

const GROUPS = [...new Set(DESIGN_BLOCKS.map(block => block.group))];

function parseThemeFilter(stored: unknown) {
  return THEME_FILTERS.find(filter => filter === stored);
}

function frameUrl(block: DesignBlock, theme: "light" | "dark") {
  return `/design/frame?${new URLSearchParams({ block: block.id, theme })}`;
}

// A working page, not part of the site: every state of the editor's chrome,
// each in sandboxed frames at phone, tablet and desktop widths, in the light
// and dark editor themes. Nothing is linked to it.
export function DesignCatalogue() {
  const [themeFilter, setThemeFilter] = usePersistentState<
    (typeof THEME_FILTERS)[number]
  >("billsend-design-theme-filter", "both", parseThemeFilter);
  const themes =
    themeFilter === "both" ? (["light", "dark"] as const) : [themeFilter];

  return (
    <div className="bg-muted/40 text-foreground min-h-svh">
      <header className="bg-background/90 border-border sticky top-0 z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-6 py-3 backdrop-blur">
        <h1 className="text-sm font-semibold">billsend design catalogue</h1>
        <nav aria-label="Groups" className="flex flex-wrap items-center gap-1">
          {GROUPS.map(group => (
            <a
              key={group}
              href={`#${slug(group)}`}
              className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-2 py-1 text-[13px]"
            >
              {group}
            </a>
          ))}
        </nav>
        <div
          role="group"
          aria-label="Themes"
          className="bg-muted ml-auto flex items-center rounded-lg p-0.5"
        >
          {THEME_FILTERS.map(filter => (
            <button
              key={filter}
              type="button"
              aria-pressed={themeFilter === filter}
              onClick={() => setThemeFilter(filter)}
              className={cn(
                "text-muted-foreground hover:text-foreground h-6 rounded-md px-2.5 text-xs font-medium capitalize",
                themeFilter === filter &&
                  "bg-background text-foreground shadow-xs"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>
      <main className="flex flex-col gap-16 px-6 py-10">
        {GROUPS.map(group => (
          <section
            key={group}
            id={slug(group)}
            aria-labelledby={`${slug(group)}-heading`}
            className="flex scroll-mt-20 flex-col gap-10"
          >
            <h2
              id={`${slug(group)}-heading`}
              className="text-lg font-semibold tracking-tight"
            >
              {group}
            </h2>
            {DESIGN_BLOCKS.filter(block => block.group === group).map(block => (
              <BlockEntry key={block.id} block={block} themes={themes} />
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}

function BlockEntry({
  block,
  themes
}: {
  block: DesignBlock;
  themes: readonly ("light" | "dark")[];
}) {
  return (
    <article className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-sm font-medium">{block.title}</h3>
        {block.note && (
          <p className="text-muted-foreground text-[13px]">{block.note}</p>
        )}
      </div>
      {themes.map(theme => (
        <div key={theme} className="flex flex-col gap-2">
          <span className="text-muted-foreground text-xs capitalize">
            {theme}
          </span>
          <div className="flex flex-wrap items-start gap-4">
            {block.viewports.map(viewport => (
              <ScaledFrame
                key={viewport}
                block={block}
                theme={theme}
                viewport={viewport}
              />
            ))}
          </div>
        </div>
      ))}
    </article>
  );
}

// The frame renders at the viewport's real size and is scaled down to fit,
// so its media queries see a real phone, tablet or desktop.
function ScaledFrame({
  block,
  theme,
  viewport
}: {
  block: DesignBlock;
  theme: "light" | "dark";
  viewport: DesignViewport;
}) {
  const { label, width, scale: preferredScale } = DESIGN_VIEWPORTS[viewport];
  const height = block.height ?? DESIGN_VIEWPORTS[viewport].height;
  const url = frameUrl(block, theme);
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const scale = Math.min(
    preferredScale,
    availableWidth === null ? preferredScale : availableWidth / width
  );

  useEffect(() => {
    const parent = containerRef.current?.parentElement;

    if (!parent) return;

    const observer = new ResizeObserver(([entry]) =>
      setAvailableWidth(entry.contentRect.width)
    );

    observer.observe(parent);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="flex max-w-full flex-col gap-1.5">
      <div className="text-muted-foreground flex items-center justify-between gap-3 text-xs">
        <span>
          {label} · {width} × {height}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="hover:text-foreground flex items-center gap-1"
        >
          Open
          <IconExternalLink aria-hidden="true" className="size-3.5" />
        </a>
      </div>
      <div
        className="ring-foreground/10 bg-background overflow-hidden rounded-md shadow-sm ring-1"
        style={{ width: width * scale, height: height * scale }}
      >
        <iframe
          src={url}
          title={`${block.title}, ${label.toLowerCase()}, ${theme}`}
          loading="lazy"
          width={width}
          height={height}
          className="origin-top-left border-0"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    </div>
  );
}

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
