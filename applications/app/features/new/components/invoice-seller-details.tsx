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
  const [seller, setSeller] = useAtom(sellerAtom);
  const sellerSettings = useAtomValue(sellerSettingsAtom);

  const setActiveSettings = useSetAtom(activeSettingsAtom);

  return (
    <InvoiceTextArea
      value={seller.content}
      onChange={value => setSeller({ ...seller, content: value })}
      onFocus={() => setActiveSettings("seller")}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: sellerSettings })}
      placeholder={seller.placeholder}
    />
  );
});

export const InvoiceSellerSettings = memo(function InvoiceSellerSettings() {
  return (
    <div className="flex flex-col gap-2">
      <Align />
      <Size />
      <Weight />
      <Color />
    </div>
  );
});

const alignAtom = selectAtom(sellerSettingsAtom, settings => settings.align);
const sizeAtom = selectAtom(sellerSettingsAtom, settings => settings.size);
const weightAtom = selectAtom(sellerSettingsAtom, settings => settings.weight);
const colorAtom = selectAtom(sellerSettingsAtom, settings => settings.color);

const Align = memo(function Align() {
  const align = useAtomValue(alignAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <AlignSettings
      value={align}
      handleInput={value => setSellerSettings({ ...sellerSettings, align: value })}
    />
  );
});

const Size = memo(function Size() {
  const size = useAtomValue(sizeAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <SizeSettings
      value={size}
      handleInput={value => setSellerSettings({ ...sellerSettings, size: value })}
    />
  );
});

const Weight = memo(function Weight() {
  const weight = useAtomValue(weightAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value => setSellerSettings({ ...sellerSettings, weight: value })}
    />
  );
});

const Color = memo(function Color() {
  const color = useAtomValue(colorAtom);
  const [sellerSettings, setSellerSettings] = useAtom(sellerSettingsAtom);

  return (
    <ColorSettings
      value={color}
      handleInput={value => setSellerSettings({ ...sellerSettings, color: value })}
    />
  );
});
