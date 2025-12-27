import { InvoiceInput } from "features/new/components/invoice-input";
import { InvoiceTextArea } from "features/new/components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "features/new/components/settings-fields";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import { sellerAtom, sellerSettingsAtom } from "features/new/state";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { memo } from "react";

export const InvoiceSellerDetails = memo(function InvoiceSellerDetails() {
  return (
    <section className="flex flex-col gap-1">
      <SellerLabel />
      <SellerContent />
    </section>
  );
});

const sellerLabelAtom = selectAtom(sellerAtom, seller => seller.label);
const sellerLabelSettingsAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.label
);

const SellerLabel = memo(function SellerLabel() {
  const sellerLabel = useAtomValue(sellerLabelAtom);
  const sellerLabelSettings = useAtomValue(sellerLabelSettingsAtom);
  const [seller, setSeller] = useAtom(sellerAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceInput
      value={sellerLabel}
      className="font-medium md:text-base"
      onChange={value => setSeller({ ...seller, label: value })}
      placeholder="From"
      onFocus={() => setActiveSettings("seller")}
      style={getTextStyles({ settings: sellerLabelSettings })}
    />
  );
});

const sellerContentAtom = selectAtom(sellerAtom, seller => seller.content);
const sellerContentSettingsAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.content
);

const SellerContent = memo(function SellerContent() {
  const sellerContent = useAtomValue(sellerContentAtom);
  const sellerContentSettings = useAtomValue(sellerContentSettingsAtom);
  const [seller, setSeller] = useAtom(sellerAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceTextArea
      value={sellerContent}
      onChange={value => setSeller({ ...seller, content: value })}
      onFocus={() => setActiveSettings("seller")}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: sellerContentSettings })}
      placeholder={seller.placeholder}
    />
  );
});

export const InvoiceSellerSettings = memo(function InvoiceSellerSettings() {
  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 flex flex-col gap-4">
        <h3 className="text-sm font-medium">Label Settings</h3>
        <div className="flex flex-col gap-2">
          <SellerLabelAlign />
          <SellerLabelSize />
          <SellerLabelWeight />
          <SellerLabelColor />
        </div>
        <h3 className="text-sm font-medium">Content Settings</h3>
        <div className="flex flex-col gap-2">
          <SellerContentAlign />
          <SellerContentSize />
          <SellerContentWeight />
          <SellerContentColor />
        </div>
      </div>
    </div>
  );
});

// Seller Label Settings
const sellerLabelAlignAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.label.align
);
const sellerLabelSizeAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.label.size
);
const sellerLabelWeightAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.label.weight
);
const sellerLabelColorAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.label.color
);

const SellerLabelAlign = memo(function SellerLabelAlign() {
  const align = useAtomValue(sellerLabelAlignAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          label: { ...sellerSettings.label, align: value }
        })
      }
    />
  );
});

const SellerLabelSize = memo(function SellerLabelSize() {
  const size = useAtomValue(sellerLabelSizeAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          label: { ...sellerSettings.label, size: value }
        })
      }
    />
  );
});

const SellerLabelWeight = memo(function SellerLabelWeight() {
  const weight = useAtomValue(sellerLabelWeightAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          label: { ...sellerSettings.label, weight: value }
        })
      }
    />
  );
});

const SellerLabelColor = memo(function SellerLabelColor() {
  const color = useAtomValue(sellerLabelColorAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          label: { ...sellerSettings.label, color: value }
        })
      }
    />
  );
});

// Seller Content Settings
const sellerContentAlignAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.content.align
);
const sellerContentSizeAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.content.size
);
const sellerContentWeightAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.content.weight
);
const sellerContentColorAtom = selectAtom(
  sellerSettingsAtom,
  settings => settings.content.color
);

const SellerContentAlign = memo(function SellerContentAlign() {
  const align = useAtomValue(sellerContentAlignAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          content: { ...sellerSettings.content, align: value }
        })
      }
    />
  );
});

const SellerContentSize = memo(function SellerContentSize() {
  const size = useAtomValue(sellerContentSizeAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          content: { ...sellerSettings.content, size: value }
        })
      }
    />
  );
});

const SellerContentWeight = memo(function SellerContentWeight() {
  const weight = useAtomValue(sellerContentWeightAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          content: { ...sellerSettings.content, weight: value }
        })
      }
    />
  );
});

const SellerContentColor = memo(function SellerContentColor() {
  const color = useAtomValue(sellerContentColorAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setSellerSettings({
          ...sellerSettings,
          content: { ...sellerSettings.content, color: value }
        })
      }
    />
  );
});
