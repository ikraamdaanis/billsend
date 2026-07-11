import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const renameInvoiceSchema = z.object({
  name: z
    .string()
    .min(1, "Invoice name is required")
    .max(100, "Invoice name must be less than 100 characters")
});

type RenameInvoiceFormData = z.infer<typeof renameInvoiceSchema>;

export function RenameInvoiceDialog({
  open,
  onOpenChange,
  currentName,
  onRename
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentName: string;
  onRename: (newName: string) => Promise<void>;
}) {
  const [pending, setPending] = useState(false);

  const form = useForm<RenameInvoiceFormData>({
    resolver: zodResolver(renameInvoiceSchema),
    defaultValues: { name: currentName },
    values: { name: currentName }
  });

  async function handleSubmit(data: RenameInvoiceFormData) {
    setPending(true);

    try {
      await onRename(data.name.trim());

      onOpenChange(false);

      setTimeout(() => {
        form.reset({ name: data.name.trim() });
        setPending(false);
      }, 500);
    } catch (error) {
      setPending(false);
      toast.error(
        error instanceof Error ? error.message : "Failed to rename invoice"
      );
    }
  }

  function handleCancel() {
    onOpenChange(false);

    setTimeout(() => {
      form.reset({ name: currentName });
    }, 500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-lg">
        <DialogHeader>
          <DialogTitle>Rename Invoice</DialogTitle>
          <DialogDescription>
            Enter a new name for this invoice.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 px-4 pb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Invoice Name <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter invoice name"
                        autoFocus
                        data-1p-ignore
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                Rename
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
