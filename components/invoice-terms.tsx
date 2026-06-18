import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { useTermsSlice } from "stores/invoice-selectors";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceTerms() {
  return (
    <>
      <TermsLabel />
      <TermsContent />
    </>
  );
}

function TermsLabel() {
  const { terms, termsSettings, setTerms } = useTermsSlice();

  return (
    <InvoiceInput
      value={terms.label}
      className="mb-2 font-medium md:text-base"
      onChange={value => setTerms(prev => ({ ...prev, label: value }))}
      placeholder="Terms and conditions"
      style={getTextStyles({ settings: termsSettings.label })}
    />
  );
}

function TermsContent() {
  const { terms, termsSettings, setTerms } = useTermsSlice();

  return (
    <InvoiceTextArea
      id="invoice-field-terms"
      value={terms.content}
      onChange={value => setTerms(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[4lh] w-full"
      style={getTextStyles({ settings: termsSettings.content })}
      placeholder="Add terms and conditions "
    />
  );
}
