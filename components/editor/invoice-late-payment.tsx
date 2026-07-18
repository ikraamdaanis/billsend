import { InvoiceInput } from "~/components/editor/invoice-input";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useLatePaymentSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceLatePayment() {
  return (
    <>
      <LatePaymentLabel />
      <LatePaymentContent />
    </>
  );
}

function LatePaymentLabel() {
  const { latePayment, setLatePayment } = useLatePaymentSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Late payment section label"
      value={latePayment.label}
      className="mb-2 font-medium md:text-base"
      onChange={value => setLatePayment(prev => ({ ...prev, label: value }))}
      placeholder="Late payment"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function LatePaymentContent() {
  const { latePayment, setLatePayment } = useLatePaymentSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-late-payment"
      aria-label={`${latePayment.label || "Late payment"} content`}
      value={latePayment.content}
      onChange={value => setLatePayment(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[2lh] w-full"
      style={getTextStyles({
        settings: getRoleSettings(theme, "termsContent")
      })}
      placeholder="e.g. A 2% monthly fee applies to overdue balances."
    />
  );
}
