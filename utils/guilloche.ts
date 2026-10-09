// Guilloche geometry for the homepage's security-print world. Every pattern is
// computed from its parameters on the device, the way an engraving lathe turns
// a few ratios into a fine interlaced line, so nothing is a downloaded image.

function toPath(points: [number, number][]) {
  return points
    .map(
      ([pointX, pointY], index) =>
        `${index === 0 ? "M" : "L"}${pointX.toFixed(2)} ${pointY.toFixed(2)}`
    )
    .join("");
}

// A hypotrochoid rosette centred on (0, 0): a circle of radius `inner` rolling
// inside one of radius `outer`, traced by a pen `pen` from its centre. Integer
// ratios close the curve after `inner / gcd(outer, inner)` turns.
export function rosettePath({
  outer,
  inner,
  pen,
  stepsPerTurn = 240
}: {
  outer: number;
  inner: number;
  pen: number;
  stepsPerTurn?: number;
}) {
  const difference = outer - inner;
  const turns = inner / greatestCommonDivisor(outer, inner);
  const steps = Math.round(turns * stepsPerTurn);
  const points: [number, number][] = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2 * turns;

    points.push([
      difference * Math.cos(angle) +
        pen * Math.cos((difference / inner) * angle),
      difference * Math.sin(angle) -
        pen * Math.sin((difference / inner) * angle)
    ]);
  }

  return `${toPath(points)}Z`;
}

// A band of phase-shifted sine lines whose amplitude swells and narrows along
// the band, so neighbouring strands cross into the interlaced ribbon printed
// along a cheque's border. Returns one path per strand.
export function waveBandPaths({
  width,
  height,
  strands = 7,
  wavelength = 24,
  swell = 160
}: {
  width: number;
  height: number;
  strands?: number;
  wavelength?: number;
  swell?: number;
}) {
  const middle = height / 2;
  const sampleCount = Math.ceil(width / 2);

  return Array.from({ length: strands }, (_, strand) => {
    const phase = (strand / strands) * Math.PI;
    const points: [number, number][] = [];

    for (let i = 0; i <= sampleCount; i++) {
      const x = (i / sampleCount) * width;
      const envelope = 0.55 + 0.45 * Math.cos((x / swell) * Math.PI * 2);
      const y =
        middle +
        middle *
          0.92 *
          envelope *
          Math.sin((x / wavelength) * Math.PI * 2 + phase);

      points.push([x, y]);
    }

    return toPath(points);
  });
}

function greatestCommonDivisor(first: number, second: number): number {
  return second === 0 ? first : greatestCommonDivisor(second, first % second);
}
