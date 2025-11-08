import { useForm } from "@tanstack/react-form";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import type {
  InvoiceDesignOverrides,
  InvoiceSectionVisibility,
  InvoiceTemplateId,
  InvoiceTemplateTokens
} from "features/invoices/templates/types";
import { useEffect } from "react";

export function DesignControls({
  defaultTokens,
  defaultVisibility,
  templateId,
  overrides,
  onChange
}: {
  defaultTokens: InvoiceTemplateTokens;
  defaultVisibility: InvoiceSectionVisibility;
  templateId: string;
  overrides?: InvoiceDesignOverrides;
  onChange: (overrides: InvoiceDesignOverrides) => void;
}) {
  const form = useForm({
    defaultValues: {
      tokens: {
        ...defaultTokens,
        ...overrides?.tokens
      },
      visibility: {
        ...defaultVisibility,
        ...overrides?.visibility
      }
    },
    onSubmit: ({ value }) => {
      onChange({
        templateId: templateId as InvoiceTemplateId,
        tokens: value.tokens,
        visibility: value.visibility
      });
    }
  });

  useEffect(() => {
    const newTokens = {
      ...defaultTokens,
      ...overrides?.tokens
    };
    const newVisibility = {
      ...defaultVisibility,
      ...overrides?.visibility
    };

    form.setFieldValue("tokens", newTokens);
    form.setFieldValue("visibility", newVisibility);
  }, [
    templateId,
    defaultTokens,
    defaultVisibility,
    overrides?.tokens,
    overrides?.visibility,
    form
  ]);

  const handleChange = () => {
    form.handleSubmit();
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-900">Style Settings</h3>
        <div className="flex flex-col gap-3">
          <form.Field name="tokens.fontFamily">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="fontFamily">Font Family</Label>
                <select
                  id="fontFamily"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    field.handleChange(
                      e.target.value as "system" | "geist" | "inter"
                    );
                    handleChange();
                  }}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="system">System</option>
                  <option value="geist">Geist</option>
                  <option value="inter">Inter</option>
                </select>
              </div>
            )}
          </form.Field>
          <form.Field name="tokens.baseTextSize">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="baseTextSize">Text Size</Label>
                <select
                  id="baseTextSize"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    field.handleChange(e.target.value as "sm" | "md" | "lg");
                    handleChange();
                  }}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>
            )}
          </form.Field>
          <form.Field name="tokens.accentColorHex">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="accentColorHex">Accent Colour</Label>
                <div className="flex gap-2">
                  <Input
                    id="accentColorHex"
                    type="color"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => {
                      field.handleChange(e.target.value);
                      handleChange();
                    }}
                    className="h-9 w-20 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => {
                      field.handleChange(e.target.value);
                      handleChange();
                    }}
                    placeholder="#0ea5e9"
                    className="flex-1"
                  />
                </div>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-red-600">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="tokens.spacingScale">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="spacingScale">Spacing</Label>
                <select
                  id="spacingScale"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    field.handleChange(
                      e.target.value as "compact" | "comfortable"
                    );
                    handleChange();
                  }}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                </select>
              </div>
            )}
          </form.Field>
          <form.Field name="tokens.borderStyle">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="borderStyle">Border Style</Label>
                <select
                  id="borderStyle"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    field.handleChange(
                      e.target.value as "none" | "subtle" | "strong"
                    );
                    handleChange();
                  }}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="none">None</option>
                  <option value="subtle">Subtle</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
            )}
          </form.Field>
          <form.Field name="tokens.logoPosition">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="logoPosition">Logo Position</Label>
                <select
                  id="logoPosition"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    field.handleChange(
                      e.target.value as "left" | "right" | "top"
                    );
                    handleChange();
                  }}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="top">Top</option>
                </select>
              </div>
            )}
          </form.Field>
          <form.Field name="tokens.pageSize">
            {field => (
              <div className="flex flex-col gap-2">
                <Label htmlFor="pageSize">Page Size</Label>
                <select
                  id="pageSize"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={e => {
                    field.handleChange(e.target.value as "A4" | "Letter");
                    handleChange();
                  }}
                  className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
            )}
          </form.Field>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-900">
          Section Visibility
        </h3>
        <div className="flex flex-col gap-3">
          {Object.entries({
            companyDetails: "Company Details",
            clientDetails: "Client Details",
            notes: "Notes",
            terms: "Terms & Conditions",
            paymentDetails: "Payment Details",
            taxRow: "Tax Row",
            discountRow: "Discount Row",
            footer: "Footer"
          }).map(([key, label]) => {
            const fieldName = `visibility.${key}` as
              | "visibility.companyDetails"
              | "visibility.clientDetails"
              | "visibility.notes"
              | "visibility.terms"
              | "visibility.paymentDetails"
              | "visibility.taxRow"
              | "visibility.discountRow"
              | "visibility.footer";
            return (
              <form.Field key={key} name={fieldName}>
                {field => (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => {
                        field.handleChange(e.target.checked);
                        handleChange();
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    />
                    <Label
                      htmlFor={key}
                      className="cursor-pointer text-sm font-normal"
                    >
                      {label}
                    </Label>
                  </div>
                )}
              </form.Field>
            );
          })}
        </div>
      </div>
    </form>
  );
}
