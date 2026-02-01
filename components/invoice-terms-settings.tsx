import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useInvoiceStore } from "stores/invoice-store";

export function InvoiceTermsSettings() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-sm font-medium">Label Settings</h3>
        <div className="flex flex-col gap-2">
          <TermsLabelAlign />
          <TermsLabelSize />
          <TermsLabelWeight />
          <TermsLabelColor />
        </div>
        <h3 className="text-sm font-medium">Content Settings</h3>
        <div className="flex flex-col gap-2">
          <TermsContentAlign />
          <TermsContentSize />
          <TermsContentWeight />
          <TermsContentColor />
        </div>
      </div>
    </div>
  );
}

// Terms Label Settings
function TermsLabelAlign() {
  const align = useInvoiceStore(state => state.termsSettings.label.align);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function TermsLabelSize() {
  const size = useInvoiceStore(state => state.termsSettings.label.size);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function TermsLabelWeight() {
  const weight = useInvoiceStore(state => state.termsSettings.label.weight);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function TermsLabelColor() {
  const color = useInvoiceStore(state => state.termsSettings.label.color);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

// Terms Content Settings
function TermsContentAlign() {
  const align = useInvoiceStore(state => state.termsSettings.content.align);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          content: { ...prev.content, align: value }
        }))
      }
    />
  );
}

function TermsContentSize() {
  const size = useInvoiceStore(state => state.termsSettings.content.size);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          content: { ...prev.content, size: value }
        }))
      }
    />
  );
}

function TermsContentWeight() {
  const weight = useInvoiceStore(state => state.termsSettings.content.weight);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          content: { ...prev.content, weight: value }
        }))
      }
    />
  );
}

function TermsContentColor() {
  const color = useInvoiceStore(state => state.termsSettings.content.color);
  const setTermsSettings = useInvoiceStore(state => state.setTermsSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTermsSettings(prev => ({
          ...prev,
          content: { ...prev.content, color: value }
        }))
      }
    />
  );
}
