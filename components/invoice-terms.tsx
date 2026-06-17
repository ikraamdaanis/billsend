import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { useUI } from "context/ui-context";
import { useTermsSlice } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
import { applyTextSetting } from "utils/apply-text-setting";
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
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <InvoiceInput
      value={terms.label}
      className="mb-2 font-medium md:text-base"
      onChange={value => setTerms(prev => ({ ...prev, label: value }))}
      placeholder="Terms and conditions"
      onFocus={event => {
        setActiveSettings("terms");
        setActiveField({
          anchorEl: event.currentTarget,
          selector: state => state.termsSettings.label,
          update: (key, value) =>
            setTermsSettings(prev => ({
              ...prev,
              label: applyTextSetting(prev.label, key, value)
            }))
        });
      }}
      style={getTextStyles({ settings: termsSettings.label })}
    />
  );
}

function TermsContent() {
  const { terms, termsSettings, setTerms } = useTermsSlice();
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);
  const { setActiveSettings, setActiveField } = useUI();

  return (
    <InvoiceTextArea
      id="invoice-field-terms"
      value={terms.content}
      onChange={value => setTerms(prev => ({ ...prev, content: value }))}
      onFocus={event => {
        setActiveSettings("terms");
        setActiveField({
          anchorEl: event.currentTarget,
          selector: state => state.termsSettings.content,
          update: (key, value) =>
            setTermsSettings(prev => ({
              ...prev,
              content: applyTextSetting(prev.content, key, value)
            }))
        });
      }}
      className="field-sizing-content min-h-[4lh] w-full"
      style={getTextStyles({ settings: termsSettings.content })}
      placeholder="Add terms and conditions "
    />
  );
}
