import { describe, expect, it } from "vitest";
import { selectOrphanedImageIds } from "~/utils/select-orphaned-images";

describe("selectOrphanedImageIds", () => {
  it("returns blobs that no saved document references", () => {
    const orphans = selectOrphanedImageIds(
      ["used", "orphan"],
      ["used"]
    );

    expect(orphans).toEqual(["orphan"]);
  });

  it("never returns a blob referenced by a saved invoice or template", () => {
    const orphans = selectOrphanedImageIds(
      ["invoice-logo", "template-logo"],
      ["invoice-logo", "template-logo"]
    );

    expect(orphans).toEqual([]);
  });

  it("keeps the active-but-unsaved image via the keep list", () => {
    const orphans = selectOrphanedImageIds(
      ["active", "stale"],
      [],
      ["active"]
    );

    expect(orphans).toEqual(["stale"]);
  });

  it("ignores empty string references and keep ids", () => {
    const orphans = selectOrphanedImageIds(
      ["a", "b"],
      ["", "a"],
      [""]
    );

    expect(orphans).toEqual(["b"]);
  });

  it("returns an empty array when nothing is stored", () => {
    expect(selectOrphanedImageIds([], ["used"], ["active"])).toEqual([]);
  });
});
