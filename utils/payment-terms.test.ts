import { describe, expect, it } from "vitest";
import { addDaysToIsoDate, getPaymentTermsDays } from "~/utils/payment-terms";

describe("payment terms", () => {
  it("reads a preset from the gap between the dates", () => {
    expect(getPaymentTermsDays("2026-07-01", "2026-07-01")).toBe(0);
    expect(getPaymentTermsDays("2026-07-01", "2026-07-08")).toBe(7);
    expect(getPaymentTermsDays("2026-07-01", "2026-07-31")).toBe(30);
  });

  it("treats any other gap, or a bad date, as custom", () => {
    expect(getPaymentTermsDays("2026-07-01", "2026-07-10")).toBeNull();
    expect(getPaymentTermsDays("2026-07-01", "")).toBeNull();
    expect(getPaymentTermsDays("not a date", "2026-07-08")).toBeNull();
  });

  it("counts calendar days across month and year ends", () => {
    expect(addDaysToIsoDate("2026-12-20", 14)).toBe("2027-01-03");
    expect(addDaysToIsoDate("2026-02-15", 14)).toBe("2026-03-01");
    expect(getPaymentTermsDays("2026-12-20", "2027-01-19")).toBe(30);
  });

  it("returns null for a date it can't read", () => {
    expect(addDaysToIsoDate("", 7)).toBeNull();
  });
});
