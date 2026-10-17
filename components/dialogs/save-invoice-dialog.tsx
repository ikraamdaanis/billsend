import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import { NativeSelect } from "~/components/ui/select";
import "~/lib/configure-zod";
import type { InvoiceDocument } from "~/types";

const saveInvoiceSchema = z.object({
  name: z
    .string()
    .trim()
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
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>("new");

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

  // Start every open fresh: a new invoice under the current suggested name, so
  // neither an earlier overwrite target nor a typed name carries over. Done on
  // open rather than after close, so a reopen within the close animation can't
  // be overwritten by a reset holding the previous suggestion.
  useEffect(() => {
    if (!open) return;

    setSelectedInvoiceId("new");
    form.reset({ name: defaultName });
  }, [open, defaultName, form]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
  }

  function handleSubmit(data: SaveInvoiceFormData) {
    startTransition(async () => {
      const overwriteId =
        selectedInvoiceId !== "new" ? selectedInvoiceId : undefined;

      try {
        await onSave(data.name.trim(), overwriteId);
        handleOpenChange(false);
      } catch {
        // onSave surfaces its own error toast; keep the dialog open to retry.
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle>Save Invoice</DialogTitle>
          <DialogDescription>
            Save your invoice with a custom name or overwrite an existing one.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4 px-4 pb-4">
              <div className="flex flex-col gap-2">
                <FormLabel htmlFor="invoice-select">Invoice</FormLabel>
                <NativeSelect
                  id="invoice-select"
                  value={selectedInvoiceId}
                  onChange={({ target: { value } }) =>
                    handleInvoiceSelect(value)
                  }
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
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
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
