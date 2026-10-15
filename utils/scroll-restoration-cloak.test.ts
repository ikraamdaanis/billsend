import { storageKey } from "@tanstack/router-core";
import { describe, expect, it } from "vitest";
import { SCROLL_RESTORATION_STORAGE_KEY } from "~/utils/scroll-restoration-cloak";

describe("scroll restoration cloak", () => {
  it("reads the key TanStack Router saves scroll positions under", () => {
    expect(SCROLL_RESTORATION_STORAGE_KEY).toBe(storageKey);
  });
});
