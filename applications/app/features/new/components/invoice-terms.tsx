import { InvoiceInput } from "features/new/components/invoice-input";
import { InvoiceTextArea } from "features/new/components/invoice-textarea";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import {
  termsAtom,
  termsSettingsAtom,
  updateTermsAtom
} from "features/new/state";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";

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
  const updateTerms = useSetAtom(updateTermsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceInput
      value={termsLabel}
      className="mb-2 font-medium md:text-base"
      onChange={value => updateTerms({ label: value })}
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
  const updateTerms = useSetAtom(updateTermsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceTextArea
      value={termsContent}
      onChange={value => updateTerms({ content: value })}
      onFocus={() => setActiveSettings("terms")}
      className="field-sizing-content min-h-[4lh] w-full"
      style={getTextStyles({ settings: termsContentSettings })}
      placeholder="Add terms and conditions "
    />
  );
});
