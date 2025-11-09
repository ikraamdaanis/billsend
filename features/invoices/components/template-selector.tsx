import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "components/ui/select";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type { InvoiceTemplate } from "features/invoices/templates/types";

export function TemplateSelector({
  selectedTemplateId,
  customTemplates,
  onSelect
}: {
  selectedTemplateId: string;
  customTemplates: Array<{
    id: string;
    name: string;
    description?: string | null;
    tokens: InvoiceTemplate["defaultTokens"];
    visibility: InvoiceTemplate["defaultVisibility"];
  }>;
  onSelect: (templateId: string) => void;
}) {
  const defaultTemplates = Object.values(INVOICE_TEMPLATES);

  return (
    <Select value={selectedTemplateId} onValueChange={onSelect}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a template" />
      </SelectTrigger>
      <SelectContent className="w-(--radix-select-trigger-width)">
        {defaultTemplates.length > 0 && (
          <SelectGroup>
            <SelectLabel>Default Templates</SelectLabel>
            {defaultTemplates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{template.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {template.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
        {customTemplates.length > 0 && (
          <SelectGroup>
            <SelectLabel>My Templates</SelectLabel>
            {customTemplates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{template.name}</span>
                  {template.description && (
                    <span className="text-muted-foreground text-xs">
                      {template.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}
