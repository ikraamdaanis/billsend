/**
 * Returns true when the value is already a usable image URL (a blob: or data:
 * URL) that can be rendered directly, rather than an IndexedDB image id that
 * must first be loaded from storage.
 */
export function isDirectImageUrl(value: string) {
  return value.startsWith("blob:") || value.startsWith("data:");
}
