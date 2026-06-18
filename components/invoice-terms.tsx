import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { useTermsSlice, useTheme } from "stores/invoice-selectors";
import { getRoleSettings } from "utils/get-role-settings";
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
  const { terms, setTerms } = useTermsSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      value={terms.label}
      className="mb-2 font-medium md:text-base"
      onChange={value => setTerms(prev => ({ ...prev, label: value }))}
      placeholder="Terms and conditions"
      style={getTextStyles({
        settings: getRoleSettings(theme, "sectionLabel")
      })}
    />
  );
}

function TermsContent() {
  const { terms, setTerms } = useTermsSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-terms"
      value={terms.content}
      onChange={value => setTerms(prev => ({ ...prev, content: value }))}
      className="field-sizing-content min-h-[4lh] w-full"
      style={getTextStyles({
        settings: getRoleSettings(theme, "termsContent")
      })}
      placeholder="Add terms and conditions "
    />
  );
}
