import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { deleteTemplate } from "~/db";
import type { InvoiceTemplate } from "~/types";

export function DeleteTemplateModal({
  open,
  onOpenChange,
  template
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: InvoiceTemplate | null;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    if (!template) return;

    startTransition(async () => {
      try {
        await deleteTemplate(template.id);

        toast.success(`Template "${template.name}" deleted successfully.`);

        onOpenChange(false);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete template."
        );
      }
    });
  }

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader className="border-0">
          <DialogTitle>Delete Template</DialogTitle>
          <DialogDescription className="mt-2">
            Are you sure you want to delete the template &quot;{template.name}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={pending}
          >
            {pending ? "Deleting..." : "Delete Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
