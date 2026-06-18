import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { useSellerSlice, useTheme } from "stores/invoice-selectors";
import { getRoleSettings } from "utils/get-role-settings";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceSellerDetails() {
  return (
    <section className="flex flex-col gap-1">
      <SellerLabel />
      <SellerContent />
    </section>
  );
}

function SellerLabel() {
  const { seller, setSeller } = useSellerSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      value={seller.label}
      className="font-medium md:text-base"
      onChange={value => setSeller(prev => ({ ...prev, label: value }))}
      placeholder="From"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function SellerContent() {
  const { seller, setSeller } = useSellerSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-seller"
      value={seller.content}
      onChange={value => setSeller(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionContent")
      })}
      placeholder={seller.placeholder}
    />
  );
}
