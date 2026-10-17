// Shortcut hints are written the Mac way (⌘K, ⇧⌘S). Elsewhere the same keys
// are Ctrl and Shift, so they read "Ctrl+K" and "Ctrl+Shift+S" there.
export function isApplePlatform(): boolean {
  if (typeof navigator === "undefined") return true;

  return /Mac|iPhone|iPad/i.test(
    `${navigator.platform} ${navigator.userAgent}`
  );
}

// Whether a key press holds the platform's command key: ⌘ on Apple devices,
// Ctrl elsewhere. Only that one counts, so Ctrl+K stays the text fields' own
// "delete to end of line" on a Mac.
export function hasPrimaryModifier(
  event: KeyboardEvent,
  apple: boolean = isApplePlatform()
): boolean {
  return apple
    ? event.metaKey && !event.ctrlKey
    : event.ctrlKey && !event.metaKey;
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
