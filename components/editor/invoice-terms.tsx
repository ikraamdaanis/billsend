import { InvoiceInput } from "~/components/editor/invoice-input";
import {
  OptionalSection,
  RemoveSectionButton
} from "~/components/editor/invoice-optional-section";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { useTermsSlice, useTheme } from "~/stores/invoice-selectors";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

export function InvoiceTerms({
  autoFocus,
  onRemove
}: {
  autoFocus: boolean;
  onRemove: () => void;
}) {
  return (
    <OptionalSection>
      <div className="mb-2 flex items-center gap-1">
        <TermsLabel />
        <RemoveSectionButton
          label="Remove terms and conditions"
          onClick={onRemove}
        />
      </div>
      <TermsContent autoFocus={autoFocus} />
    </OptionalSection>
  );
}

function TermsLabel() {
  const { terms, setTerms } = useTermsSlice();
  const theme = useTheme();

  return (
    <InvoiceInput
      aria-label="Terms section label"
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

function TermsContent({ autoFocus }: { autoFocus: boolean }) {
  const { terms, setTerms } = useTermsSlice();
  const theme = useTheme();

  return (
    <InvoiceTextArea
      id="invoice-field-terms"
      aria-label={`${terms.label || "Terms and conditions"} content`}
      autoFocus={autoFocus}
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
