import { InvoiceInput } from "~/components/invoice-input";
import { useTheme, useTitleSlice } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceTitle() {
  const { title, setTitle } = useTitleSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      id="invoice-field-title"
      value={title}
      onChange={setTitle}
      className="w-full text-5xl font-semibold"
      style={getTextStyles({ settings: getRoleSettings(theme, "title") })}
      placeholder="Invoice"
    />
  );
}
