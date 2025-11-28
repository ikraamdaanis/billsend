import { Button } from "components/ui/button";
import { imageAtom, updateImageAtom } from "features/new/state";
import { useAtomValue, useSetAtom } from "jotai";
import { cn } from "lib/utils";
import { Upload } from "lucide-react";
import { useState } from "react";
import Dropzone from "react-dropzone";

export function InvoiceImage() {
  const image = useAtomValue(imageAtom);
  const updateImage = useSetAtom(updateImageAtom);
  const [isDragging, setIsDragging] = useState(false);

  function handleImageUpload(files: File[]) {
    if (files.length === 0) return;

    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    updateImage(objectUrl);
  }

  function handleRemoveImage() {
    updateImage("");
  }

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
          {image ? (
            <div className="group relative">
              <img
                src={image}
                alt="Invoice Image"
                width={128}
                height={128}
                className="ov rounded-lg object-cover"
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
