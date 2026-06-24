/**
 * Decide which stored image blobs are safe to delete.
 *
 * A blob is orphaned when no saved invoice or template references it and it is
 * not in the explicit keep list (e.g. the image currently in use but not yet
 * persisted to a document). Anything referenced by a saved invoice/template is
 * never returned, so callers can delete the result without risking live data.
 */
export function selectOrphanedImageIds(
  storedImageIds: string[],
  referencedImageIds: Iterable<string>,
  keepImageIds: Iterable<string> = []
): string[] {
  const keep = new Set<string>();

  for (const referencedImageId of referencedImageIds) {
    if (referencedImageId) keep.add(referencedImageId);
  }

  for (const keepImageId of keepImageIds) {
    if (keepImageId) keep.add(keepImageId);
  }

  return storedImageIds.filter(storedImageId => !keep.has(storedImageId));
}
