import { Button } from "components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "components/ui/dropdown-menu";
import { format } from "date-fns";
import { cn } from "lib/utils";
import { MoreVerticalIcon, PencilIcon, TrashIcon } from "lucide-react";
import type { MouseEvent } from "react";
import type { InvoiceTemplate } from "types";

/**
 * TemplateCard displays a single invoice template with its name, description,
 * and preview. It provides options to edit or delete the template, and allows
 * users to select it for use in invoice creation. This component ensures
 * templates are displayed with feedback, supporting future invoice creation
 * workflows.
 */
export function TemplateCard({
  template,
  onSelect,
  onEdit,
  onDelete
}: {
  template: InvoiceTemplate;
  onSelect: (template: InvoiceTemplate) => void;
  onEdit: (template: InvoiceTemplate, event: MouseEvent) => void;
  onDelete: (template: InvoiceTemplate, event: MouseEvent) => void;
}) {
  return (
    <div className="group relative flex h-full flex-col rounded-lg border-2 transition-all duration-200">
      <div className="relative aspect-[1.6/1] w-full overflow-hidden rounded-t-lg bg-linear-to-br from-gray-50 to-gray-100 p-4">
        {renderTemplatePreview(template)}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div className="flex items-center justify-between gap-4">
          <h3
            className="text-foreground line-clamp-1 font-medium text-ellipsis"
            title={template.name}
          >
            {template.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 w-7 p-0"
                onClick={e => e.stopPropagation()}
              >
                <MoreVerticalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={e => onEdit(template, e)}>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={e => onDelete(template, e)}
                className="text-destructive focus:text-destructive"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {template.description && (
          <p className="text-muted-foreground line-clamp-2 h-full py-4 text-sm">
            {template.description}
          </p>
        )}
        <div className="flex items-end justify-between pt-4">
          <span
            className="text-muted-foreground text-xs"
            title={format(
              new Date(template.updatedAt),
              "h:mmaaa EEEE do MMMM, yyyy"
            )}
          >
            Updated {format(new Date(template.updatedAt), "HH:mm yyyy/MM/dd")}
          </span>
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-3"
              onClick={e => {
                e.stopPropagation();
                onSelect(template);
              }}
            >
              Use
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * InvoiceSkeleton is a placeholder component that displays a skeleton loading
 * state for an invoice template. It provides a visual representation of the
 * template's structure while data is loading. This component ensures templates
 * are displayed with feedback, supporting future invoice creation workflows.
 */
function InvoiceSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-full w-full rounded bg-white p-3 shadow-sm",
        className
      )}
    >
      {/* Top section - Title/Seller + Image */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1 space-y-1">
          <div className="h-3 w-20 rounded bg-gray-300"></div>
          <div className="h-2 w-16 rounded bg-gray-200"></div>
          <div className="h-1.5 w-14 rounded bg-gray-200"></div>
        </div>
        <div className="h-8 w-8 rounded bg-gray-200"></div>
      </div>
      {/* Mid section - Bill to + Details */}
      <div className="mb-3">
        <div className="mb-1 h-2 w-10 rounded bg-gray-200"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="h-1.5 w-12 rounded bg-gray-100"></div>
            <div className="h-1.5 w-10 rounded bg-gray-100"></div>
          </div>
          <div className="space-y-1">
            <div className="h-1.5 w-8 rounded bg-gray-100"></div>
            <div className="h-1.5 w-10 rounded bg-gray-100"></div>
          </div>
        </div>
      </div>
      {/* Bottom section - Line items + Total */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-8 rounded bg-gray-100"></div>
          <div className="h-1.5 w-6 rounded bg-gray-100"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-10 rounded bg-gray-100"></div>
          <div className="h-1.5 w-8 rounded bg-gray-100"></div>
        </div>
        <div className="mt-2 border-t pt-1">
          <div className="flex items-center justify-between">
            <div className="h-2 w-6 rounded bg-gray-200"></div>
            <div className="h-2 w-8 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * renderTemplatePreview renders the preview image for an invoice template.
 * It displays the template's screenshot if available, otherwise it shows
 * a skeleton loading state. This function ensures templates are displayed
 * withfeedback, supporting future invoice creation workflows.
 */
function renderTemplatePreview(template: InvoiceTemplate) {
  if (!template.screenshotUrl) return <InvoiceSkeleton />;

  return (
    <>
      <img
        src={template.screenshotUrl}
        alt={`${template.name} template preview`}
        className="h-full w-full rounded object-cover object-top"
        loading="lazy"
        onError={e => {
          // Fallback to mock preview if image fails to load
          const target = e.target as HTMLImageElement;

          target.style.display = "none";
          target.nextElementSibling?.classList.remove("hidden");
        }}
      />
      <InvoiceSkeleton className="hidden" />
    </>
  );
}
