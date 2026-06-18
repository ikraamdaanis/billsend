import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { useSellerSlice } from "stores/invoice-selectors";
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
  const { seller, sellerSettings, setSeller } = useSellerSlice();

  return (
    <InvoiceInput
      value={seller.label}
      className="font-medium md:text-base"
      onChange={value => setSeller(prev => ({ ...prev, label: value }))}
      placeholder="From"
      style={getTextStyles({ settings: sellerSettings.label })}
    />
  );
}

function SellerContent() {
  const { seller, sellerSettings, setSeller } = useSellerSlice();

  return (
    <InvoiceTextArea
      id="invoice-field-seller"
      value={seller.content}
      onChange={value => setSeller(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: sellerSettings.content })}
      placeholder={seller.placeholder}
    />
  );
}
