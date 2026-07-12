import { describe, expect, it } from "vitest";
import { formatListDate } from "~/utils/format-list-date";

describe("formatListDate", () => {
  it("formats a valid date", () => {
    expect(formatListDate(new Date("2026-07-12T12:00:00Z"))).toContain("2026");
  });

  it("returns a placeholder for an Invalid Date instead of throwing", () => {
    expect(() => formatListDate(new Date("nonsense"))).not.toThrow();
    expect(formatListDate(new Date("nonsense"))).toBe("—");
  });

  it("returns a placeholder for an unparseable string", () => {
    expect(formatListDate("not a date")).toBe("—");
  });
});
