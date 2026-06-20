import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";

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
          <DialogTitle>Unsaved Changes</DialogTitle>
          <DialogDescription>
            You have unsaved changes. What would you like to do?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => {
              onAction("cancel");
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
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
