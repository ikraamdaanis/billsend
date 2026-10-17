import {
  differenceInDays,
  differenceInHours,
  format,
  startOfISOWeek
} from "date-fns";

// About this many versions are kept per invoice.
export const MAX_VERSIONS_PER_INVOICE = 50;

function newestPerBucket<TVersion extends { createdAt: Date }>(
  versions: TVersion[],
  bucketOf: (version: TVersion) => string
): TVersion[] {
  const newest = new Map<string, TVersion>();

  for (const version of versions) {
    const bucket = bucketOf(version);
    const kept = newest.get(bucket);

    if (!kept || version.createdAt > kept.createdAt) {
      newest.set(bucket, version);
    }
  }

  return [...newest.values()];
}

// Which of an invoice's versions to let go: everything from the last 24 hours
// stays, then the newest of each day for 30 days, then the newest of each
// week. Past about 50, the last day keeps only the newest of each hour, and if
// that's still too many the oldest go.
export function selectVersionsToDelete<
  TVersion extends { id: string; createdAt: Date }
>(versions: TVersion[], now: Date): string[] {
  const lastDay = versions.filter(
    version => differenceInHours(now, version.createdAt) < 24
  );
  const lastMonth = versions.filter(
    version =>
      differenceInHours(now, version.createdAt) >= 24 &&
      differenceInDays(now, version.createdAt) < 30
  );
  const older = versions.filter(
    version => differenceInDays(now, version.createdAt) >= 30
  );
  const daily = newestPerBucket(lastMonth, version =>
    format(version.createdAt, "yyyy-MM-dd")
  );
  const weekly = newestPerBucket(older, version =>
    format(startOfISOWeek(version.createdAt), "yyyy-MM-dd")
  );
  let recent = lastDay;

  if (recent.length + daily.length + weekly.length > MAX_VERSIONS_PER_INVOICE) {
    recent = newestPerBucket(lastDay, version =>
      format(version.createdAt, "yyyy-MM-dd HH")
    );
  }

  const keep = [...recent, ...daily, ...weekly]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, MAX_VERSIONS_PER_INVOICE);
  const keepIds = new Set(keep.map(version => version.id));

  return versions
    .filter(version => !keepIds.has(version.id))
    .map(version => version.id);
}
