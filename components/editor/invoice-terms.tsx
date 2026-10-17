import { InvoiceInput } from "~/components/editor/invoice-input";
import {
  OptionalSection,
  RemoveSectionButton
} from "~/components/editor/invoice-optional-section";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useTermsSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceTerms({ onRemove }: { onRemove: () => void }) {
  return (
    <OptionalSection data-field-area="terms">
      <div className="mb-2 flex items-center gap-1">
        <TermsLabel />
        <RemoveSectionButton label="Hide terms" onClick={onRemove} />
      </div>
      <TermsContent />
    </OptionalSection>
  );
}

function TermsLabel() {
  const { terms, setTerms } = useTermsSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Terms section label"
      data-field="terms.label"
      value={terms.label}
      className="font-medium"
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
      aria-label={`${terms.label || "Terms and conditions"} content`}
      data-field="terms.content"
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
