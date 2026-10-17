import { subDays, subHours, subMinutes } from "date-fns";
import { describe, expect, it } from "vitest";
import {
  MAX_VERSIONS_PER_INVOICE,
  selectVersionsToDelete
} from "~/utils/version-thinning";

const NOW = new Date(2026, 9, 17, 12);

function versionsAt(dates: Date[]) {
  return dates.map((createdAt, index) => ({ id: `v${index}`, createdAt }));
}

describe("selectVersionsToDelete", () => {
  it("keeps everything from the last 24 hours", () => {
    const versions = versionsAt([
      subMinutes(NOW, 1),
      subMinutes(NOW, 2),
      subHours(NOW, 23)
    ]);

    expect(selectVersionsToDelete(versions, NOW)).toEqual([]);
  });

  it("keeps the newest of each day for 30 days", () => {
    const versions = versionsAt([
      subHours(subDays(NOW, 3), 1),
      subHours(subDays(NOW, 3), 2),
      subDays(NOW, 5)
    ]);

    expect(selectVersionsToDelete(versions, NOW)).toEqual(["v1"]);
  });

  it("keeps the newest of each week after that", () => {
    const versions = versionsAt([
      subDays(NOW, 60),
      subDays(NOW, 61),
      subDays(NOW, 90)
    ]);
    const deleted = selectVersionsToDelete(versions, NOW);

    expect(deleted).not.toContain("v0");
    expect(deleted).not.toContain("v2");
  });

  it("keeps about 50, thinning the last day to one an hour first", () => {
    const dates = [
      ...Array.from({ length: 60 }, (_, i) => subMinutes(NOW, i * 10)),
      ...Array.from({ length: 20 }, (_, i) => subDays(NOW, i + 2))
    ];
    const versions = versionsAt(dates);
    const deleted = new Set(selectVersionsToDelete(versions, NOW));
    const kept = versions.filter(version => !deleted.has(version.id));

    expect(kept.length).toBeLessThanOrEqual(MAX_VERSIONS_PER_INVOICE);
    expect(kept.some(version => version.id === "v0")).toBe(true);
    expect(
      kept.filter(version => Number(version.id.slice(1)) >= 60).length
    ).toBe(20);
  });
});
