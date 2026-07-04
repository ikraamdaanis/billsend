import { InvoiceInput } from "~/components/editor/invoice-input";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { usePaymentDetailsSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

const PAYMENT_FIELDS = [
  { key: "bankName", label: "Bank name", placeholder: "Acme Bank" },
  { key: "accountNumber", label: "Account number", placeholder: "12345678" },
  {
    key: "iban",
    label: "IBAN",
    placeholder: "GB29 NWBK 6016 1331 9268 19"
  },
  { key: "sortCode", label: "Sort code", placeholder: "12-34-56" }
] as const;

export function InvoicePaymentDetails() {
  return (
    <>
      <PaymentDetailsLabel />
      <div className="mt-2 flex flex-col gap-1">
        {PAYMENT_FIELDS.map(field => (
          <PaymentDetailsField
            key={field.key}
            fieldKey={field.key}
            label={field.label}
            placeholder={field.placeholder}
          />
        ))}
      </div>
      <PaymentDetailsTerms />
    </>
  );
}

function PaymentDetailsLabel() {
  const { paymentDetails, setPaymentDetails } = usePaymentDetailsSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      value={paymentDetails.label}
      className="font-medium md:text-base"
      onChange={value => setPaymentDetails(prev => ({ ...prev, label: value }))}
      placeholder="Payment details"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function PaymentDetailsField({
  fieldKey,
  label,
  placeholder
}: {
  fieldKey: "bankName" | "accountNumber" | "iban" | "sortCode";
  label: string;
  placeholder: string;
}) {
  const { paymentDetails, setPaymentDetails } = usePaymentDetailsSlice();
  const theme = useTheme();

  return (
    <div className="flex items-center gap-2">
      <span className="w-32 shrink-0 text-sm text-zinc-500">{label}</span>
      <InvoiceInput
        value={paymentDetails[fieldKey]}
        onChange={value =>
          setPaymentDetails(prev => ({ ...prev, [fieldKey]: value }))
        }
        placeholder={placeholder}
        style={getTextStyles({
          settings: getRoleSettings(theme, "termsContent")
        })}
      />
    </div>
  );
}

function PaymentDetailsTerms() {
  const { paymentDetails, setPaymentDetails } = usePaymentDetailsSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-payment-terms"
      value={paymentDetails.terms}
      onChange={value => setPaymentDetails(prev => ({ ...prev, terms: value }))}
      className="mt-2 field-sizing-content min-h-[2lh] w-full"
      style={getTextStyles({
        settings: getRoleSettings(theme, "termsContent")
      })}
      placeholder="Add payment instructions (e.g. Net 30)"
    />
  );
}
