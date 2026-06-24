import { describe, expect, it } from "vitest";
import { reconcilePricingInput } from "~/utils/reconcile-pricing-input";

describe("reconcilePricingInput", () => {
  it("keeps the local input while it represents the store value", () => {
    expect(reconcilePricingInput("5", 5)).toBe("5");
  });

  it("preserves in-progress formatting that still parses to the store value", () => {
    expect(reconcilePricingInput("5.", 5)).toBe("5.");
    expect(reconcilePricingInput("0.0", 0)).toBe("0.0");
    expect(reconcilePricingInput("5.50", 5.5)).toBe("5.50");
  });

  it("refreshes the input when the store value diverges (document loaded)", () => {
    expect(reconcilePricingInput("5", 20)).toBe("20");
  });

  it("refreshes a stale input back to defaults on reset to a new invoice", () => {
    expect(reconcilePricingInput("99", 0)).toBe("0");
  });

  it("refreshes when applying a template changes the value", () => {
    expect(reconcilePricingInput("0", 7.25)).toBe("7.25");
  });
});
