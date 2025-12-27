import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { AlertTriangleIcon } from "lucide-react";

export type UnsavedChangesAction = "save" | "discard" | "cancel";

export function UnsavedChangesDialog({
  open,
  onOpenChange,
  onAction
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAction: (action: UnsavedChangesAction) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangleIcon className="text-destructive h-5 w-5" />
            Unsaved Changes
          </DialogTitle>
          <DialogDescription>
            You have unsaved changes. What would you like to do?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => {
              onAction("cancel");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onAction("discard");
              onOpenChange(false);
            }}
          >
            Discard Changes
          </Button>
          <Button
            onClick={() => {
              onAction("save");
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
