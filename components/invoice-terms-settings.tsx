import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useAtom, useAtomValue } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";
import { termsSettingsAtom } from "state";

export const InvoiceTermsSettings = memo(function InvoiceTermsSettings() {
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
});

// Terms Label Settings
const termsLabelAlignAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.label.align
);
const termsLabelSizeAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.label.size
);
const termsLabelWeightAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.label.weight
);
const termsLabelColorAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.label.color
);

const TermsLabelAlign = memo(function TermsLabelAlign() {
  const align = useAtomValue(termsLabelAlignAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, align: value }
        })
      }
    />
  );
});

const TermsLabelSize = memo(function TermsLabelSize() {
  const size = useAtomValue(termsLabelSizeAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, size: value }
        })
      }
    />
  );
});

const TermsLabelWeight = memo(function TermsLabelWeight() {
  const weight = useAtomValue(termsLabelWeightAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, weight: value }
        })
      }
    />
  );
});

const TermsLabelColor = memo(function TermsLabelColor() {
  const color = useAtomValue(termsLabelColorAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          label: { ...termsSettings.label, color: value }
        })
      }
    />
  );
});

// Terms Content Settings
const termsContentAlignAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.content.align
);
const termsContentSizeAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.content.size
);
const termsContentWeightAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.content.weight
);
const termsContentColorAtom = selectAtom(
  termsSettingsAtom,
  settings => settings.content.color
);

const TermsContentAlign = memo(function TermsContentAlign() {
  const align = useAtomValue(termsContentAlignAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, align: value }
        })
      }
    />
  );
});

const TermsContentSize = memo(function TermsContentSize() {
  const size = useAtomValue(termsContentSizeAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, size: value }
        })
      }
    />
  );
});

const TermsContentWeight = memo(function TermsContentWeight() {
  const weight = useAtomValue(termsContentWeightAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, weight: value }
        })
      }
    />
  );
});

const TermsContentColor = memo(function TermsContentColor() {
  const color = useAtomValue(termsContentColorAtom);
  const [termsSettings, setTermsSettings] = useAtom(termsSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTermsSettings({
          ...termsSettings,
          content: { ...termsSettings.content, color: value }
        })
      }
    />
  );
});
