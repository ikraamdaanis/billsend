import { Button } from "components/ui/button";
import { deleteImage, getImageBlob, saveImage } from "features/new/db";
import { imageAtom } from "features/new/state";
import { useAtom } from "jotai";
import { cn } from "lib/utils";
import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "sonner";

export function InvoiceImage() {
  const [imageId, setImageId] = useAtom(imageAtom);

  const [imageUrl, setImageUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  const currentUrlRef = useRef<string | null>(null);
  const lastUploadedIdRef = useRef<string | null>(null);

  async function handleImageUpload(files: File[]) {
    if (files.length === 0) return;

    const file = files[0];
    const newImageId = crypto.randomUUID();

    // Revoke previous image URL if it exists
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    // Immediately show the uploaded image
    const previewUrl = URL.createObjectURL(file);
    currentUrlRef.current = previewUrl;
    setImageUrl(previewUrl);

    try {
      // Save image blob to IndexedDB
      await saveImage(newImageId, file, file.type);

      // Verify it was saved
      const verifyBlob = await getImageBlob(newImageId);

      if (!verifyBlob) throw new Error("Image was not saved correctly");

      // Track that we just uploaded this image
      lastUploadedIdRef.current = newImageId;

      // Store image ID in invoice state
      setImageId(newImageId);
    } catch (error) {
      // On error, revoke preview URL and clear
      if (currentUrlRef.current === previewUrl) {
        URL.revokeObjectURL(previewUrl);
        currentUrlRef.current = null;
        setImageUrl("");
      }
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save image. Please try again."
      );
    }
  }

  async function handleRemoveImage() {
    // Revoke current image URL
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    setImageUrl("");

    if (imageId) {
      try {
        await deleteImage(imageId);
      } catch (error) {
        // Failed to delete from DB, but still clear the UI
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to remove image from storage."
        );
      }
    }

    setImageId("");
  }

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
    };
  }, []);

  // Load image from IndexedDB when imageId changes
  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      if (!imageId) {
        // Revoke previous URL if it exists
        if (currentUrlRef.current) {
          URL.revokeObjectURL(currentUrlRef.current);
          currentUrlRef.current = null;
        }
        setImageUrl("");
        lastUploadedIdRef.current = null;
        return;
      }

      // If we just uploaded this image and already have a URL, don't reload
      if (imageId === lastUploadedIdRef.current && currentUrlRef.current) {
        return;
      }

      try {
        const blob = await getImageBlob(imageId);

        // Revoke previous URL before creating new one
        if (currentUrlRef.current) {
          URL.revokeObjectURL(currentUrlRef.current);
        }

        if (blob) {
          const url = URL.createObjectURL(blob);

          if (cancelled) return URL.revokeObjectURL(url);

          currentUrlRef.current = url;
          setImageUrl(url);
        } else {
          currentUrlRef.current = null;
          setImageUrl("");
        }
      } catch (error) {
        if (!cancelled) {
          if (currentUrlRef.current) {
            URL.revokeObjectURL(currentUrlRef.current);
            currentUrlRef.current = null;
          }

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
      // Always clean up blob URL on unmount or when imageId changes
      if (currentUrlRef.current) {
        URL.revokeObjectURL(currentUrlRef.current);
        currentUrlRef.current = null;
      }
    };
  }, [imageId]);

  return (
    <Dropzone
      onDrop={handleImageUpload}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      accept={{
        "image/*": [".png", ".jpg", ".jpeg", ".webp"]
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className={cn(
            "flex aspect-square h-32 min-w-32 items-center justify-center overflow-hidden rounded-lg",
            isDragging
              ? "bg-brand-100 border-brand-500 border-2 border-dashed"
              : "bg-zinc-100",
            "cursor-pointer"
          )}
        >
          <input {...getInputProps()} />
          {imageUrl ? (
            <div className="group relative">
              <img
                src={imageUrl}
                alt="Invoice Image"
                width={128}
                height={128}
                className="h-32 w-32 rounded-lg object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-600 text-xs hover:bg-red-500"
                  onClick={event => {
                    event.stopPropagation();
                    handleRemoveImage();
                  }}
                >
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-2 text-zinc-500">
              <Upload className="mb-2 h-8 w-8" />
              <span className="text-center text-xs">Upload logo</span>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
}
