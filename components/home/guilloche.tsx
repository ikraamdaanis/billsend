import { cn } from "~/lib/utils";
import { rosettePath, waveBandPaths } from "~/utils/guilloche";

// Each pattern is a few ratios turned into line work, computed once when the
// module loads, so the server and the browser render identical paths.
const ROSETTE_PATHS = [
  rosettePath({ outer: 132, inner: 48, pen: 66 }),
  rosettePath({ outer: 132, inner: 48, pen: 40 }),
  rosettePath({ outer: 120, inner: 45, pen: 70 })
];

// One seamless tile of the border ribbon: the envelope repeats every 160 units
// and the wave every 20, so tiles join without a seam.
const BAND_TILE_WIDTH = 160;
const BAND_TILE_HEIGHT = 24;
const BAND_TILE_PATHS = waveBandPaths({
  width: BAND_TILE_WIDTH,
  height: BAND_TILE_HEIGHT,
  strands: 6,
  wavelength: 20,
  swell: BAND_TILE_WIDTH
});

const UNDERPRINT_TILE = waveBandPaths({
  width: 120,
  height: 36,
  strands: 3,
  wavelength: 40,
  swell: 120
});

/**
 * The underprint: a faint field of interlaced lines laid under a surface, the
 * way safety paper is printed before anything goes on it. Returned as a CSS
 * background so it costs no extra DOM.
 */
export function underprintBackground(colour: string) {
  const strokes = UNDERPRINT_TILE.map(
    path =>
      `<path d='${path}' fill='none' stroke='${colour}' stroke-width='0.5'/>`
  ).join("");
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='36'>${strokes}</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/**
 * The rosette engraved in a document's corner. It draws itself once on load;
 * with reduced motion it is simply there.
 */
export function Rosette({
  className,
  animate = false
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      aria-hidden
      viewBox="-200 -200 400 400"
      className={cn("pointer-events-none", className)}
      fill="none"
      stroke="currentColor"
    >
      {ROSETTE_PATHS.map((path, pathIndex) => (
        <path
          key={path}
          d={path}
          pathLength={1}
          strokeWidth={0.6}
          vectorEffect="non-scaling-stroke"
          transform={`rotate(${pathIndex * 7.5})`}
          className={animate ? "guilloche-draw" : undefined}
          style={
            animate
              ? { animationDelay: `${0.2 + pathIndex * 0.25}s` }
              : undefined
          }
        />
      ))}
    </svg>
  );
}

/**
 * The interlaced ribbon printed along a security document's edge, tiled to
 * any length. A vertical band turns the same tile on its side, so all four
 * edges of a document carry one continuous pattern.
 */
export function GuillocheBand({
  id,
  orientation = "horizontal",
  className
}: {
  id: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}) {
  const isVertical = orientation === "vertical";

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none block",
        isVertical ? "h-full" : "w-full",
        className
      )}
      width={isVertical ? BAND_TILE_HEIGHT : undefined}
      height={isVertical ? undefined : BAND_TILE_HEIGHT}
    >
      <defs>
        <pattern
          id={id}
          width={BAND_TILE_WIDTH}
          height={BAND_TILE_HEIGHT}
          patternUnits="userSpaceOnUse"
          patternTransform={
            isVertical
              ? `translate(${BAND_TILE_HEIGHT} 0) rotate(90)`
              : undefined
          }
        >
          {BAND_TILE_PATHS.map(path => (
            <path
              key={path}
              d={path}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.6}
            />
          ))}
        </pattern>
      </defs>
      <rect
        width={isVertical ? BAND_TILE_HEIGHT : "100%"}
        height={isVertical ? "100%" : BAND_TILE_HEIGHT}
        fill={`url(#${id})`}
      />
    </svg>
  );
}

// Where two border bands meet, a small rosette covers the crossing, the way a
// cheque's corners carry their own ornament.
export function CornerRosette({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "bg-tint absolute flex size-6 items-center justify-center",
        className
      )}
    >
      <Rosette className="size-6" />
    </span>
  );
}

/**
 * A line of microprint: text too small to read at a glance, printed as a
 * rule. Decorative, so it is hidden from assistive tech.
 */
export function Microprint({
  text,
  className
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "font-engraved overflow-hidden text-[5px] leading-none font-semibold tracking-[0.2em] whitespace-nowrap uppercase [font-stretch:125%] select-none",
        className
      )}
    >
      {Array.from({ length: 24 }, () => text).join(" · ")}
    </div>
  );
}
