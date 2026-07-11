import { IconUpload } from "@tabler/icons-react";
import { useState } from "react";
import type { FileRejection } from "react-dropzone";
import Dropzone from "react-dropzone";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { cleanupOrphanedImages, getImageBlob, saveImage } from "~/db";
import { useImageLoader } from "~/hooks/use-image-loader";
import { cn } from "~/lib/utils";
import { useImageSlice } from "~/stores/invoice-selectors";

export function InvoiceImage() {
  const { image: imageId, setImage } = useImageSlice();
  const imageUrl = useImageLoader(imageId);
  const [isDragging, setIsDragging] = useState(false);

  async function handleDrop(
    acceptedFiles: File[],
    fileRejections: FileRejection[]
  ) {
    setIsDragging(false);

    if (fileRejections.length > 0) {
      return toast.error(
        "That file isn't a supported image. Upload a PNG, JPG, or WebP."
      );
    }

    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const newImageId = crypto.randomUUID();

    try {
      await saveImage(newImageId, file, file.type);

      const verifyBlob = await getImageBlob(newImageId);
      if (!verifyBlob) throw new Error("Image was not saved correctly");

      setImage(newImageId);

      void cleanupOrphanedImages([newImageId]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to save image. Please try again."
      );
    }
  }

  function handleRemoveImage() {
    setImage("");

    // Only detach the blob from the live invoice; never hard-delete it. Save As
    // clones the image id, so the same blob can back other saved invoices,
    // templates, or the draft. Let the reference-counting orphan sweep decide
    // whether it is now unreferenced and safe to collect.
    void cleanupOrphanedImages();
  }

  return (
    <Dropzone
      onDrop={handleDrop}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      accept={{
        "image/*": [".png", ".jpg", ".jpeg", ".webp"]
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          role="button"
          aria-label={`${imageUrl ? "Change" : "Upload"} invoice logo. Drop an image or activate to browse.`}
          className={cn(
            "rounded-surface flex aspect-square h-32 min-w-32 items-center justify-center overflow-hidden",
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
                alt="Invoice logo"
                width={128}
                height={128}
                className="rounded-surface h-32 w-32 object-cover"
              />
              <div className="rounded-surface absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100">
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
              <IconUpload className="mb-2 h-8 w-8" aria-hidden="true" />
              <span className="text-center text-xs">Upload logo</span>
            </div>
          )}
        </div>
      )}
    </Dropzone>
  );
}
