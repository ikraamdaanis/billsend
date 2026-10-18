import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogIcon,
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
          <DialogIcon tone="destructive">
            <IconTrash />
          </DialogIcon>
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
            className="bg-destructive hover:bg-destructive/90 dark:bg-destructive dark:hover:bg-destructive/90 text-white"
          >
            Delete {subject}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
