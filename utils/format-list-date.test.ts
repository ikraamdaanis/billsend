import { describe, expect, it } from "vitest";
import { formatFullDate, formatListDate } from "~/utils/format-list-date";

const NOW = new Date(2026, 9, 18, 14, 0);

describe("formatListDate", () => {
  it("shows only the time for today", () => {
    expect(formatListDate(new Date(2026, 9, 18, 6, 39), NOW)).toBe("06:39");
  });

  it("says Yesterday for the day before", () => {
    expect(formatListDate(new Date(2026, 9, 17, 23, 59), NOW)).toBe(
      "Yesterday"
    );
  });

  it("drops the year within this year", () => {
    expect(formatListDate(new Date(2026, 3, 1, 10, 36), NOW)).toBe("1 Apr");
  });

  it("keeps the year for earlier years", () => {
    expect(formatListDate(new Date(2025, 11, 3), NOW)).toBe("3 Dec 2025");
  });

  it("returns a placeholder for an Invalid Date instead of throwing", () => {
    expect(() => formatListDate(new Date("nonsense"))).not.toThrow();
    expect(formatListDate(new Date("nonsense"))).toBe("–");
  });

  it("returns a placeholder for an unparseable string", () => {
    expect(formatListDate("not a date")).toBe("–");
  });
});

describe("formatFullDate", () => {
  it("spells out the date and time", () => {
    expect(formatFullDate(new Date(2026, 4, 31, 2, 32))).toBe(
      "31 May 2026, 02:32"
    );
  });

  it("returns a placeholder for an Invalid Date", () => {
    expect(formatFullDate("not a date")).toBe("–");
  });
});
