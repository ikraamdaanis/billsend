import { InvoiceInput } from "~/components/editor/invoice-input";
import {
  OptionalSection,
  RemoveSectionButton
} from "~/components/editor/invoice-optional-section";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useLatePaymentSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceLatePayment({
  autoFocus,
  onRemove
}: {
  autoFocus: boolean;
  onRemove: () => void;
}) {
  return (
    <OptionalSection>
      <div className="mb-2 flex items-center gap-1">
        <LatePaymentLabel />
        <RemoveSectionButton label="Remove late payment" onClick={onRemove} />
      </div>
      <LatePaymentContent autoFocus={autoFocus} />
    </OptionalSection>
  );
}

function LatePaymentLabel() {
  const { latePayment, setLatePayment } = useLatePaymentSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Late payment section label"
      value={latePayment.label}
      className="font-medium"
      onChange={value => setLatePayment(prev => ({ ...prev, label: value }))}
      placeholder="Late payment"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function LatePaymentContent({ autoFocus }: { autoFocus: boolean }) {
  const { latePayment, setLatePayment } = useLatePaymentSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-late-payment"
      aria-label={`${latePayment.label || "Late payment"} content`}
      autoFocus={autoFocus}
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
