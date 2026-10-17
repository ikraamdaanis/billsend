// Shortcut hints are written the Mac way (⌘K, ⇧⌘S). Elsewhere the same keys
// are Ctrl and Shift, so they read "Ctrl+K" and "Ctrl+Shift+S" there.
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return true;

  return /Mac|iPhone|iPad/i.test(
    `${navigator.platform} ${navigator.userAgent}`
  );
}

export function shortcutLabel(
  shortcut: string,
  apple: boolean = isApplePlatform()
): string {
  if (apple) return shortcut;

  const modifiers = [
    shortcut.includes("⌘") && "Ctrl",
    shortcut.includes("⇧") && "Shift"
  ].filter(Boolean);
  const key = shortcut.replace(/[⌘⇧]/g, "");

  return [...modifiers, key].join("+");
}
