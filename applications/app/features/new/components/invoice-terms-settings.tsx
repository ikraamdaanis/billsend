import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import { termsSettingsAtom, updateTermsSettingsAtom } from "features/new/state";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";

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
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        updateTermsSettings({
          label: { align: value }
        })
      }
    />
  );
});

const TermsLabelSize = memo(function TermsLabelSize() {
  const size = useAtomValue(termsLabelSizeAtom);
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        updateTermsSettings({
          label: { size: value }
        })
      }
    />
  );
});

const TermsLabelWeight = memo(function TermsLabelWeight() {
  const weight = useAtomValue(termsLabelWeightAtom);
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        updateTermsSettings({
          label: { weight: value }
        })
      }
    />
  );
});

const TermsLabelColor = memo(function TermsLabelColor() {
  const color = useAtomValue(termsLabelColorAtom);
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        updateTermsSettings({
          label: { color: value }
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
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        updateTermsSettings({
          content: { align: value }
        })
      }
    />
  );
});

const TermsContentSize = memo(function TermsContentSize() {
  const size = useAtomValue(termsContentSizeAtom);
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        updateTermsSettings({
          content: { size: value }
        })
      }
    />
  );
});

const TermsContentWeight = memo(function TermsContentWeight() {
  const weight = useAtomValue(termsContentWeightAtom);
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        updateTermsSettings({
          content: { weight: value }
        })
      }
    />
  );
});

const TermsContentColor = memo(function TermsContentColor() {
  const color = useAtomValue(termsContentColorAtom);
  const updateTermsSettings = useSetAtom(updateTermsSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        updateTermsSettings({
          content: { color: value }
        })
      }
    />
  );
});
