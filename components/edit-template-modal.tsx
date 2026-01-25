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
import { Textarea } from "components/ui/textarea";
import { getAllTemplates, saveTemplate } from "db";
import { useSetAtom } from "jotai";
import { PencilIcon } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { invoiceTemplatesAtom } from "state";
import type { InvoiceTemplate } from "types";
import { z } from "zod";

const editTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(100, "Template name must be less than 100 characters"),
  description: z.string().optional()
});

type EditTemplateFormData = z.infer<typeof editTemplateSchema>;

/**
 * EditTemplateModal allows users to update the name and description of an
 * existing invoice template. It provides a form for editing these details
 * and handles the submission of updates to the template. This modal ensures
 * template details are updated with feedback, supporting future invoice
 * creation workflows.
 */
export function EditTemplateModal({
  open,
  onOpenChange,
  template,
  onComplete
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: InvoiceTemplate | null;
  onComplete?: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const setTemplates = useSetAtom(invoiceTemplatesAtom);

  const form = useForm<EditTemplateFormData>({
    resolver: zodResolver(editTemplateSchema),
    defaultValues: {
      name: template?.name || "",
      description: template?.description || ""
    },
    values: {
      name: template?.name || "",
      description: template?.description || ""
    }
  });

  function handleSubmit(data: EditTemplateFormData) {
    if (!template) return;

    startTransition(async () => {
      try {
        const updatedTemplate: InvoiceTemplate = {
          ...template,
          name: data.name.trim(),
          description: data.description?.trim() || null,
          updatedAt: new Date()
        };

        await saveTemplate(updatedTemplate);

        const updatedTemplates = await getAllTemplates();

        setTemplates(updatedTemplates);

        toast.success("Template updated successfully!");

        handleClose();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update template"
        );
      }
    });
  }

  function handleClose() {
    onOpenChange(false);
    onComplete?.();

    setTimeout(() => {
      form.reset();
    }, 500);
  }

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PencilIcon className="h-5 w-5" />
            Edit Template
          </DialogTitle>
          <DialogDescription>
            Update the template name and description.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Template Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter template name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter template description (optional)"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={pending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={form.handleSubmit(handleSubmit)}
            disabled={pending}
            className="flex items-center gap-2"
          >
            <PencilIcon className="h-4 w-4" />
            Update Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
