import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import { cn } from "lib/utils";

export function TemplatePicker({
  selectedTemplateId,
  onSelect
}: {
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}) {
  const templates = Object.values(INVOICE_TEMPLATES);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-900">
        Choose Template
      </label>
      <div className="grid grid-cols-1 gap-3">
        {templates.map(template => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template.id)}
            className={cn(
              "flex flex-col gap-2 rounded-lg border-2 p-4 text-left transition-colors",
              "hover:border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none",
              selectedTemplateId === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 bg-white"
            )}
            aria-pressed={selectedTemplateId === template.id}
            aria-label={`Select ${template.name} template`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">
                {template.name}
              </span>
              {selectedTemplateId === template.id && (
                <span className="text-xs font-medium text-blue-600">
                  Selected
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
