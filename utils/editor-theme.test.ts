import { describe, expect, it } from "vitest";
import {
  EDITOR_THEME_SCRIPT,
  EDITOR_THEME_STORAGE_KEY,
  isEditorThemePreference,
  resolveEditorTheme
} from "~/utils/editor-theme";

// Runs the head script against a stand-in page and returns what it set.
function runThemeScript({
  stored,
  prefersDark,
  storageThrows = false
}: {
  stored: string | null;
  prefersDark: boolean;
  storageThrows?: boolean;
}) {
  const attributes = new Map<string, string>();
  const classes = new Set<string>();
  const page = {
    localStorage: {
      getItem: (key: string) => {
        if (storageThrows) throw new Error("Storage blocked");

        return key === EDITOR_THEME_STORAGE_KEY ? stored : null;
      }
    },
    matchMedia: () => ({ matches: prefersDark }),
    document: {
      documentElement: {
        setAttribute: (name: string, value: string) =>
          attributes.set(name, value),
        classList: {
          toggle: (name: string, force: boolean) => {
            if (force) classes.add(name);
            else classes.delete(name);
          }
        }
      }
    }
  };

  new Function("localStorage", "matchMedia", "document", EDITOR_THEME_SCRIPT)(
    page.localStorage,
    page.matchMedia,
    page.document
  );

  return {
    theme: attributes.get("data-editor-theme"),
    dark: classes.has("dark")
  };
}

describe("editor theme", () => {
  it("follows the system scheme unless a choice was made", () => {
    expect(resolveEditorTheme("system", true)).toBe("dark");
    expect(resolveEditorTheme("system", false)).toBe("light");
    expect(resolveEditorTheme("light", true)).toBe("light");
    expect(resolveEditorTheme("dark", false)).toBe("dark");
  });

  it("only accepts known preferences from storage", () => {
    expect(isEditorThemePreference("dark")).toBe(true);
    expect(isEditorThemePreference("system")).toBe(true);
    expect(isEditorThemePreference("sepia")).toBe(false);
    expect(isEditorThemePreference(null)).toBe(false);
  });

  it("themes the first paint the same way the hook resolves it", () => {
    expect(runThemeScript({ stored: "dark", prefersDark: false })).toEqual({
      theme: "dark",
      dark: true
    });
    expect(runThemeScript({ stored: "light", prefersDark: true })).toEqual({
      theme: "light",
      dark: false
    });
    expect(runThemeScript({ stored: null, prefersDark: true })).toEqual({
      theme: "dark",
      dark: true
    });
  });

  it("falls back to the system scheme when storage is blocked", () => {
    expect(
      runThemeScript({
        stored: "light",
        prefersDark: true,
        storageThrows: true
      })
    ).toEqual({ theme: "dark", dark: true });
  });
});
