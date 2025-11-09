import { TemplateCard } from "features/invoices/components/template-card";
import { INVOICE_TEMPLATES } from "features/invoices/templates/presets";
import type { InvoiceTemplate } from "features/invoices/templates/types";

export function TemplateList({
  customTemplates
}: {
  customTemplates: Array<{
    id: string;
    name: string;
    description: string | null;
    tokens: InvoiceTemplate["defaultTokens"];
    visibility: InvoiceTemplate["defaultVisibility"];
  }>;
}) {
  const defaultTemplates = Object.values(INVOICE_TEMPLATES);

  return (
    <div className="flex flex-col gap-6">
      {defaultTemplates.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Default Templates
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {defaultTemplates.map(template => (
              <TemplateCard
                key={template.id}
                template={template}
                href={`/dashboard/templates/${template.id}`}
                isDefault={false}
              />
            ))}
          </div>
        </div>
      )}
      {customTemplates.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">My Templates</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {customTemplates.map(template => {
              const templateForCard: InvoiceTemplate = {
                id: template.id,
                name: template.name,
                description: template.description || "",
                defaultTokens: template.tokens,
                defaultVisibility: template.visibility
              };
              return (
                <TemplateCard
                  key={template.id}
                  template={templateForCard}
                  href={`/dashboard/templates/${template.id}`}
                  isDefault={false}
                />
              );
            })}
          </div>
        </div>
      )}
      {defaultTemplates.length === 0 && customTemplates.length === 0 && (
        <div className="py-12 text-center text-gray-500">
          <p>No templates available.</p>
        </div>
      )}
    </div>
  );
}
