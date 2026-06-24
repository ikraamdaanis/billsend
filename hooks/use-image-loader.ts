import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getImageBlob } from "~/db";
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
      if (imageId.startsWith("blob:") || imageId.startsWith("data:")) {
        revokeBlobUrl(imageUrlRef, false);
        imageUrlRef.current = imageId;
        return setImageUrl(imageId);
      }

      try {
        const blob = await getImageBlob(imageId);

        if (blob) {
          revokeBlobUrl(imageUrlRef, false);

          const url = URL.createObjectURL(blob);

          if (cancelled) {
            URL.revokeObjectURL(url);
            return;
          }

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
