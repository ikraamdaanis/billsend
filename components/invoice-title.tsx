import { InvoiceInput } from "components/invoice-input";
import { useTitleSlice } from "stores/invoice-selectors";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceTitle() {
  const { title, titleSettings, setTitle } = useTitleSlice();

  return (
    <InvoiceInput
      id="invoice-field-title"
      value={title}
      onChange={setTitle}
      className="w-full text-5xl font-semibold"
      style={{ ...getTextStyles({ settings: titleSettings }) }}
      placeholder="Invoice"
    />
  );
}
