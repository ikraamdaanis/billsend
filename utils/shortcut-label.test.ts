import { describe, expect, it } from "vitest";
import { shortcutLabel } from "~/utils/shortcut-label";

describe("shortcut labels", () => {
  it("keeps the Mac symbols on Apple platforms", () => {
    expect(shortcutLabel("⇧⌘S", true)).toBe("⇧⌘S");
  });

  it("spells the keys out elsewhere", () => {
    expect(shortcutLabel("⌘K", false)).toBe("Ctrl+K");
    expect(shortcutLabel("⇧⌘S", false)).toBe("Ctrl+Shift+S");
    expect(shortcutLabel("⇧1", false)).toBe("Shift+1");
    expect(shortcutLabel("P", false)).toBe("P");
  });
});
