import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "components/ui/dialog";
import { DeleteTemplateModal } from "features/new/components/delete-template-modal";
import { EditTemplateModal } from "features/new/components/edit-template-modal";
import { TemplateCard } from "features/new/components/template-card";
import { invoiceAtom } from "features/new/state";
import type { InvoiceTemplate } from "features/new/types";
import { useSetAtom } from "jotai";
import { FileTextIcon, SparklesIcon } from "lucide-react";
import type { MouseEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * TemplateSelectionModal allows users to select an invoice template from a list
 * of available templates. It provides a grid of template cards with options to
 * edit or delete each template. This modal ensures templates are selected with
 * feedback, supporting future invoice creation workflows.
 */
export function TemplateSelectionModal({
  open,
  templates,
  onOpenChange,
  onTemplateSelect
}: {
  open: boolean;
  templates: InvoiceTemplate[];
  onOpenChange: (open: boolean) => void;
  onTemplateSelect?: (template: InvoiceTemplate) => void;
}) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<InvoiceTemplate | null>(null);

  const setInvoice = useSetAtom(invoiceAtom);

  function handleTemplateSelect(template: InvoiceTemplate) {
    setInvoice(template.templateData);

    toast.success(`Applied template: ${template.name}`);

    onTemplateSelect?.(template);

    onOpenChange(false);
  }

  function handleEditTemplate(template: InvoiceTemplate, event: MouseEvent) {
    event.stopPropagation();
    setSelectedTemplate(template);
    setEditModalOpen(true);
  }

  function handleDeleteTemplate(template: InvoiceTemplate, event: MouseEvent) {
    event.stopPropagation();
    setSelectedTemplate(template);
    setDeleteModalOpen(true);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex h-[90vh] w-[1280px] flex-col">
          <DialogHeader className="border-border border-b px-6 py-4">
            <DialogTitle className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5" />
              Choose a Template
            </DialogTitle>
            <DialogDescription>
              Select a template to start creating your invoice. You can
              customize it later.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {templates.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FileTextIcon className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="text-foreground mb-2 text-lg font-medium">
                  No templates available
                </h3>
                <p className="text-muted-foreground">
                  There are no invoice templates in your organization yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {templates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={handleTemplateSelect}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                  />
                ))}
              </div>
            )}
          </div>
          <DialogFooter className="border-border border-t px-6 py-4">
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm">
                  {templates.length} template{templates.length !== 1 ? "s" : ""}{" "}
                  available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <EditTemplateModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        template={selectedTemplate}
        onComplete={() => setSelectedTemplate(null)}
      />
      <DeleteTemplateModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        template={selectedTemplate}
      />
    </>
  );
}
