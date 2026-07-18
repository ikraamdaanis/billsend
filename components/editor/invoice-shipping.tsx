import { InvoiceInput } from "~/components/editor/invoice-input";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useShippingSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceShipping() {
  return (
    <section className="flex flex-col gap-1">
      <ShippingLabel />
      <ShippingContent />
    </section>
  );
}

function ShippingLabel() {
  const { shipping, setShipping } = useShippingSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Shipping section label"
      value={shipping.label}
      className="font-medium md:text-base"
      onChange={value => setShipping(prev => ({ ...prev, label: value }))}
      placeholder="Ship to"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function ShippingContent() {
  const { shipping, setShipping } = useShippingSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-shipping"
      aria-label={`${shipping.label || "Shipping"} address`}
      value={shipping.content}
      onChange={value => setShipping(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[4lh] w-full sm:max-w-[500px]"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionContent")
      })}
      placeholder={shipping.placeholder}
    />
  );
}
