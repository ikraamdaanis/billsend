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
import { Textarea } from "components/ui/textarea";
import type { Invoice, InvoiceTemplate } from "features/new/types";
import { SaveIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const saveTemplateSchema = z.object({
  name: z
    .string()
    .min(1, "Template name is required")
    .max(100, "Template name must be less than 100 characters"),
  description: z.string().optional()
});

type SaveTemplateFormData = z.infer<typeof saveTemplateSchema>;

/**
 * SaveTemplateModal allows users to create a new invoice template or overwrite
 * an existing one with the current invoice data. It provides a form for naming
 * and describing the template, with an option to select an existing template
 * to overwrite.
 */
export function SaveTemplateModal({
  open,
  templates,
  onOpenChange
  // currentInvoiceData
}: {
  open: boolean;
  templates: InvoiceTemplate[];
  onOpenChange: (open: boolean) => void;
  currentInvoiceData: Invoice;
}) {
  const [pending] = useTransition();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const selectedTemplate = templates.find(
    template => template.id === selectedTemplateId
  );

  const form = useForm<SaveTemplateFormData>({
    resolver: zodResolver(saveTemplateSchema),
    defaultValues: {
      name: selectedTemplate?.name || "",
      description: selectedTemplate?.description || ""
    },
    values: {
      name: selectedTemplate?.name || "",
      description: selectedTemplate?.description || ""
    }
  });

  function handleTemplateSelect(templateId: string) {
    setSelectedTemplateId(templateId);
  }

  // async function generateScreenshot(templateId: string) {
  //   return;
  //   try {
  //     // Generate PDF using ReactPDF
  //     const pdfBlob = await ReactPDF.pdf(
  //       <InvoicePDF invoice={currentInvoiceData} />
  //     ).toBlob();

  //     // Send PDF to server function for Puppeteer screenshot
  //     const formData = new FormData();
  //     formData.append("pdf", pdfBlob, "invoice.pdf");

  //     const response = await fetch("/api/pdf-to-png", {
  //       method: "POST",
  //       body: formData
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to generate screenshot");
  //     }

  //     const imageBlob = await response.blob();
  //     const file = new File([imageBlob], `INVOICE_TEMPLATE-${templateId}.png`, {
  //       type: "image/png"
  //     });

  //     // Upload to UploadThing
  //     const uploadResult = await uploadFiles("templateScreenshot", {
  //       files: [file]
  //     });

  //     return uploadResult?.[0]?.ufsUrl || null;
  //   } catch (error) {
  //     console.error("Screenshot generation failed:", error);
  //     return null;
  //   }
  // }

  function handleSubmit(_data: SaveTemplateFormData) {
    return;
    // startTransition(async () => {
    //   try {
    //     if (selectedTemplateId && selectedTemplateId !== "new") {
    //       // Update existing template
    //       const screenshotUrl = await generateScreenshot(selectedTemplateId);

    //       if (!screenshotUrl) {
    //         toast.error("Failed to generate screenshot");
    //         return;
    //       }

    //       const updateData: UpdateTemplateData = {
    //         id: selectedTemplateId,
    //         name: data.name.trim(),
    //         description: data.description?.trim() || undefined,
    //         templateData: currentInvoiceData,
    //         isDefault: false,
    //         screenshotUrl
    //       };

    //       const { error } = await updateInvoiceTemplate(updateData);

    //       if (error) throw new Error(error);

    //       toast.success("Template updated successfully!");
    //     } else {
    //       const templateData: CreateTemplateData = {
    //         name: data.name.trim(),
    //         description: data.description?.trim() || undefined,
    //         templateData: currentInvoiceData,
    //         isDefault: false
    //       };

    //       const { template, error: createError } =
    //         await createInvoiceTemplate(templateData);

    //       if (createError || !template) {
    //         throw new Error(createError || "Failed to create template");
    //       }

    //       const screenshotUrl = await generateScreenshot(template.id);

    //       if (screenshotUrl) {
    //         const updateData: UpdateTemplateData = {
    //           id: template.id,
    //           name: template.name,
    //           description: template.description || undefined,
    //           templateData: template.templateData,
    //           isDefault: template.isDefault,
    //           screenshotUrl
    //         };

    //         await updateInvoiceTemplate(updateData);
    //       }
    //     }

    //     router.refresh();
    //     onOpenChange(false);
    //     toast.success(
    //       selectedTemplateId && selectedTemplateId !== "new"
    //         ? "Template updated successfully!"
    //         : "Template created successfully!"
    //     );

    //     setTimeout(() => {
    //       setSelectedTemplateId("");
    //       form.reset();
    //     }, 500);
    //   } catch (error) {
    //     toast.error(
    //       error instanceof Error ? error.message : "Failed to save template"
    //     );
    //   }
    // });
  }

  function handleCancel() {
    onOpenChange(false);
    setTimeout(() => {
      setSelectedTemplateId("");
      form.reset();
    }, 500);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SaveIcon className="h-5 w-5" />
            Save as Template
          </DialogTitle>
          <DialogDescription>
            Create a new template or overwrite an existing one with the current
            invoice data.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="flex flex-col gap-4 p-4">
            <div className="flex flex-col gap-2">
              <FormLabel htmlFor="template-select">Template</FormLabel>
              <NativeSelect
                id="template-select"
                value={selectedTemplateId}
                onChange={({ target: { value } }) =>
                  handleTemplateSelect(value)
                }
              >
                <option value="new">Create New Template</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
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
            onClick={handleCancel}
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
            <SaveIcon className="h-4 w-4" />
            {selectedTemplateId && selectedTemplateId !== "new"
              ? "Update Template"
              : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
