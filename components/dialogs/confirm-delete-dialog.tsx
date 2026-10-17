import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";

// Asks before deleting a saved invoice or template, since nothing in IndexedDB
// can be brought back.
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  subject,
  name,
  onConfirm
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject: "invoice" | "template";
  name: string;
  onConfirm: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);

    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-md">
        <DialogHeader>
          <DialogTitle>Delete this {subject}?</DialogTitle>
          <DialogDescription className="text-pretty">
            “{name}” will be removed from this browser. This can’t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => void handleConfirm()}
            disabled={pending}
          >
            Delete {subject}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
