import { InvoiceInput } from "~/components/editor/invoice-input";
import {
  AddSectionButton,
  OptionalSection,
  RemoveSectionButton
} from "~/components/editor/invoice-optional-section";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useOptionalSection } from "~/hooks/use-optional-section";
import { useShippingSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceShipping() {
  const { shipping, setShipping } = useShippingSlice();
  const section = useOptionalSection({
    content: shipping.content,
    clear: () => setShipping(prev => ({ ...prev, content: "" }))
  });

  if (!section.isOpen) {
    return (
      <AddSectionButton onClick={section.open} autoFocus={section.autoFocusAdd}>
        Add shipping address
      </AddSectionButton>
    );
  }

  return (
    <OptionalSection className="gap-1">
      <div className="flex items-center gap-1">
        <ShippingLabel />
        <RemoveSectionButton
          label="Remove shipping address"
          onClick={section.remove}
        />
      </div>
      <ShippingContent autoFocus={section.autoFocusContent} />
    </OptionalSection>
  );
}

function ShippingLabel() {
  const { shipping, setShipping } = useShippingSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Shipping section label"
      value={shipping.label}
      className="font-medium"
      onChange={value => setShipping(prev => ({ ...prev, label: value }))}
      placeholder="Ship to"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function ShippingContent({ autoFocus }: { autoFocus: boolean }) {
  const { shipping, setShipping } = useShippingSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-shipping"
      aria-label={`${shipping.label || "Shipping"} address`}
      autoFocus={autoFocus}
      value={shipping.content}
      onChange={value => setShipping(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[4lh] w-full max-w-[500px]"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionContent")
      })}
      placeholder={shipping.placeholder}
    />
  );
}
