import type { RefObject } from "react";

/**
 * Revokes a blob URL stored in a ref if it exists and starts with "blob:".
 * Optionally nullifies the ref after revoking.
 *
 * @param ref - A ref containing the blob URL string or null
 * @param nullify - Whether to set the ref to null after revoking (default: true)
 */
export function revokeBlobUrl(
  ref: RefObject<string | null>,
  nullify = true
) {
  if (ref.current?.startsWith("blob:")) {
    URL.revokeObjectURL(ref.current);

    if (nullify) ref.current = null;
  }
}
