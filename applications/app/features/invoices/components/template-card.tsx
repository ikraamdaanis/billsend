import { Link } from "@tanstack/react-router";
import { Card } from "components/ui/card";
import type { InvoiceTemplate } from "features/invoices/templates/types";

export function TemplateCard({
  template,
  href,
  isDefault = false
}: {
  template: InvoiceTemplate;
  href: string;
  isDefault?: boolean;
}) {
  return (
    <Link to={href}>
      <Card className="group flex h-full flex-col gap-3 p-6 transition hover:border-gray-300 hover:bg-zinc-50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{template.name}</h3>
              {isDefault && (
                <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600">{template.description}</p>
          </div>
          <div
            className="h-12 w-12 shrink-0 rounded border-2"
            style={{ backgroundColor: template.defaultTokens.accentColorHex }}
          />
        </div>
        <div className="mt-auto flex items-center gap-2 text-sm text-gray-500">
          <span className="capitalize">
            {template.defaultTokens.fontFamily}
          </span>
          <span>•</span>
          <span className="capitalize">
            {template.defaultTokens.baseTextSize}
          </span>
          <span>•</span>
          <span className="capitalize">
            {template.defaultTokens.borderStyle}
          </span>
        </div>
      </Card>
    </Link>
  );
}
