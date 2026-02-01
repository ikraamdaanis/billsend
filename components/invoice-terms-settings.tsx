import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useTermsSettingsSlice } from "stores/invoice-selectors";

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
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <AlignSettings
      value={termsSettings.label.align}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, align: value }
        })
      }
    />
  );
}

function TermsLabelSize() {
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <SizeSettings
      value={termsSettings.label.size}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, size: value }
        })
      }
    />
  );
}

function TermsLabelWeight() {
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <FontWeightSettings
      value={termsSettings.label.weight}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, weight: value }
        })
      }
    />
  );
}

function TermsLabelColor() {
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <ColorSettings
      value={termsSettings.label.color}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, color: value }
        })
      }
    />
  );
}

// Terms Content Settings
function TermsContentAlign() {
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <AlignSettings
      value={termsSettings.content.align}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, align: value }
        })
      }
    />
  );
}

function TermsContentSize() {
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <SizeSettings
      value={termsSettings.content.size}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, size: value }
        })
      }
    />
  );
}

function TermsContentWeight() {
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <FontWeightSettings
      value={termsSettings.content.weight}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, weight: value }
        })
      }
    />
  );
}

function TermsContentColor() {
  const { termsSettings, setTermsSettings } = useTermsSettingsSlice();

  return (
    <ColorSettings
      value={termsSettings.content.color}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, color: value }
        })
      }
    />
  );
}
