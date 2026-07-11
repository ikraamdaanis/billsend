import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getImageBlob } from "~/db";
import { isDirectImageUrl } from "~/utils/is-direct-image-url";
import { revokeBlobUrl } from "~/utils/revoke-blob-url";

/**
 * Hook to load an image from IndexedDB and manage blob URL lifecycle.
 * Handles cleanup of blob URLs on unmount or when imageId changes.
 *
 * @param imageId - The image ID to load from IndexedDB, or a blob:/data: URL
 * @returns The resolved image URL (blob URL or passthrough)
 */
export function useImageLoader(imageId: string) {
  const [imageUrl, setImageUrl] = useState("");
  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      if (!imageId) {
        revokeBlobUrl(imageUrlRef);

        return setImageUrl("");
      }

      // Passthrough blob: or data: URLs directly
      if (isDirectImageUrl(imageId)) {
        revokeBlobUrl(imageUrlRef, false);
        imageUrlRef.current = imageId;
        return setImageUrl(imageId);
      }

      try {
        const blob = await getImageBlob(imageId);

        // Bail before touching the ref: a newer effect run may already own the
        // live URL, and revoking it here would break the newer load's image.
        if (cancelled) return;

        if (blob) {
          revokeBlobUrl(imageUrlRef, false);

          const url = URL.createObjectURL(blob);

          imageUrlRef.current = url;
          setImageUrl(url);
        } else {
          revokeBlobUrl(imageUrlRef);
          setImageUrl("");
        }
      } catch (error) {
        if (!cancelled) {
          revokeBlobUrl(imageUrlRef);
          setImageUrl("");
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load image from storage."
          );
        }
      }
    }

    loadImage();

    return () => {
      cancelled = true;
      revokeBlobUrl(imageUrlRef);
    };
  }, [imageId]);

  return imageUrl;
}
