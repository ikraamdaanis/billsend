import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "components/ui/form";
import { Input } from "components/ui/input";
import { NativeSelect } from "components/ui/select";
import { SaveIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import type { InvoiceDocument } from "types";
import { z } from "zod";

const saveInvoiceSchema = z.object({
  name: z
    .string()
    .min(1, "Invoice name is required")
    .max(100, "Invoice name must be less than 100 characters")
});

type SaveInvoiceFormData = z.infer<typeof saveInvoiceSchema>;

export function SaveInvoiceDialog({
  open,
  onOpenChange,
  defaultName,
  existingInvoices,
  onSave
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName: string;
  existingInvoices: InvoiceDocument[];
  onSave: (name: string, overwriteId?: string) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("");

  const selectedInvoice = existingInvoices.find(
    invoice => invoice.id === selectedInvoiceId
  );

  const form = useForm<SaveInvoiceFormData>({
    resolver: zodResolver(saveInvoiceSchema),
    defaultValues: {
      name: defaultName
    },
    values: {
      name: selectedInvoice?.name || defaultName
    }
  });

  function handleInvoiceSelect(invoiceId: string) {
    setSelectedInvoiceId(invoiceId);
  }

  function handleSubmit(data: SaveInvoiceFormData) {
    startTransition(async () => {
      const overwriteId =
        selectedInvoiceId && selectedInvoiceId !== "new"
          ? selectedInvoiceId
          : undefined;

      await onSave(data.name.trim(), overwriteId);

      onOpenChange(false);

      setTimeout(() => {
        setSelectedInvoiceId("");
        form.reset({ name: defaultName });
      }, 500);
    });
  }

  function handleCancel() {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedInvoiceId("");
      form.reset({ name: defaultName });
    }, 500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SaveIcon className="h-5 w-5" />
            Save Invoice
          </DialogTitle>
          <DialogDescription>
            Save your invoice with a custom name or overwrite an existing one.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex flex-col gap-2">
              <FormLabel htmlFor="invoice-select">Invoice</FormLabel>
              <NativeSelect
                id="invoice-select"
                value={selectedInvoiceId}
                onChange={({ target: { value } }) => handleInvoiceSelect(value)}
              >
                <option value="new">Create New Invoice</option>
                {existingInvoices.map(invoice => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.name}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Invoice Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter invoice name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                {pending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
