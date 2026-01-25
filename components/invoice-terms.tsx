import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import { activeSettingsAtom } from "components/settings-panel";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";
import { termsAtom, termsSettingsAtom } from "state";
import { getTextStyles } from "utils/get-text-styles";

export const InvoiceTerms = memo(function InvoiceTerms() {
  return (
    <>
      <TermsLabel />
      <TermsContent />
    </>
  );
});

const termsLabelAtom = selectAtom(termsAtom, terms => terms.label);
const termsLabelSettingsAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.label
);

const TermsLabel = memo(function TermsLabel() {
  const termsLabel = useAtomValue(termsLabelAtom);
  const termsLabelSettings = useAtomValue(termsLabelSettingsAtom);
  const [terms, setTerms] = useAtom(termsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceInput
      value={termsLabel}
      className="mb-2 font-medium md:text-base"
      onChange={value => setTerms({ ...terms, label: value })}
      placeholder="Terms and conditions"
      onFocus={() => setActiveSettings("terms")}
      style={getTextStyles({ settings: termsLabelSettings })}
    />
  );
});

const termsContentAtom = selectAtom(termsAtom, terms => terms.content);
const termsContentSettingsAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.content
);

const TermsContent = memo(function TermsContent() {
  const termsContent = useAtomValue(termsContentAtom);
  const termsContentSettings = useAtomValue(termsContentSettingsAtom);
  const [terms, setTerms] = useAtom(termsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceTextArea
      value={termsContent}
      onChange={value => setTerms({ ...terms, content: value })}
      onFocus={() => setActiveSettings("terms")}
      className="field-sizing-content min-h-[4lh] w-full"
      style={getTextStyles({ settings: termsContentSettings })}
      placeholder="Add terms and conditions "
    />
  );
});
