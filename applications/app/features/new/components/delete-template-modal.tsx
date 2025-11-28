import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
// import { deleteInvoiceTemplate } from "features/new/api/delete-invoice-template";
import type { InvoiceTemplate } from "features/new/types";
import { TrashIcon } from "lucide-react";
import { useTransition } from "react";

export function DeleteTemplateModal({
  open,
  onOpenChange,
  template
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: InvoiceTemplate | null;
}) {
  // const router = useRouter();

  const [pending] = useTransition();

  function handleDelete() {
    return;
    // if (!template) return;

    // startTransition(async () => {
    //   try {
    //     const { error } = await deleteInvoiceTemplate({ id: template.id });

    //     if (error) throw new Error(error);

    //     router.refresh();

    //     toast.success(`Template "${template.name}" deleted successfully.`);

    //     onOpenChange(false);
    //   } catch (error) {
    //     toast.error(
    //       error instanceof Error ? error.message : "Failed to delete template."
    //     );
    //   }
    // });
  }

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader className="border-0">
          <DialogTitle className="flex items-center gap-2">
            <TrashIcon className="text-destructive h-5 w-5" />
            Delete Template
          </DialogTitle>
          <DialogDescription className="mt-2">
            Are you sure you want to delete the template &quot;{template.name}
            &quot;? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center gap-2">
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
            className="flex items-center gap-2"
          >
            <TrashIcon className="h-4 w-4" />
            {pending ? "Deleting..." : "Delete Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
