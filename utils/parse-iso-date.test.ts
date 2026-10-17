import { describe, expect, it } from "vitest";
import { parseIsoDate } from "~/utils/parse-iso-date";

describe("parseIsoDate", () => {
  it("reads a yyyy-MM-dd date as local midnight", () => {
    expect(parseIsoDate("2026-10-17")).toEqual(new Date(2026, 9, 17));
  });

  it("rejects anything that isn't a whole yyyy-MM-dd date", () => {
    for (const value of [
      "",
      "2026",
      "2026-10",
      "20261017",
      "2026-W10",
      "2026-10-17T00:00:00.000Z",
      "17/10/2026",
      "2026-02-30"
    ]) {
      expect(parseIsoDate(value)).toBeNull();
    }
  });
});
