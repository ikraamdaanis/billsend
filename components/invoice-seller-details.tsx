import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useUI } from "context/ui-context";
import { useSellerSlice, useSellerSettingsSlice } from "stores/invoice-selectors";
import { getTextStyles } from "utils/get-text-styles";

export function InvoiceSellerDetails() {
  return (
    <section className="flex flex-col gap-1">
      <SellerLabel />
      <SellerContent />
    </section>
  );
}

function SellerLabel() {
  const { seller, sellerSettings, setSeller } = useSellerSlice();
  const { setActiveSettings } = useUI();

  return (
    <InvoiceInput
      value={seller.label}
      className="font-medium md:text-base"
      onChange={value => setSeller(prev => ({ ...prev, label: value }))}
      placeholder="From"
      onFocus={() => setActiveSettings("seller")}
      style={getTextStyles({ settings: sellerSettings.label })}
    />
  );
}

function SellerContent() {
  const { seller, sellerSettings, setSeller } = useSellerSlice();
  const { setActiveSettings } = useUI();

  return (
    <InvoiceTextArea
      value={seller.content}
      onChange={value => setSeller(prev => ({ ...prev, content: value }))}
      onFocus={() => setActiveSettings("seller")}
      className="field-sizing-content min-h-[5lh] w-full sm:max-w-[500px]"
      style={getTextStyles({ settings: sellerSettings.content })}
      placeholder={seller.placeholder}
    />
  );
}

export function InvoiceSellerSettings() {
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
}

// Seller Label Settings
function SellerLabelAlign() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <AlignSettings
      value={sellerSettings.label.align}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          label: { ...prev.label, align: value }
        }))
      }
    />
  );
}

function SellerLabelSize() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <SizeSettings
      value={sellerSettings.label.size}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          label: { ...prev.label, size: value }
        }))
      }
    />
  );
}

function SellerLabelWeight() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <FontWeightSettings
      value={sellerSettings.label.weight}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          label: { ...prev.label, weight: value }
        }))
      }
    />
  );
}

function SellerLabelColor() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <ColorSettings
      value={sellerSettings.label.color}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          label: { ...prev.label, color: value }
        }))
      }
    />
  );
}

// Seller Content Settings
function SellerContentAlign() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <AlignSettings
      value={sellerSettings.content.align}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          content: { ...prev.content, align: value }
        }))
      }
    />
  );
}

function SellerContentSize() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <SizeSettings
      value={sellerSettings.content.size}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          content: { ...prev.content, size: value }
        }))
      }
    />
  );
}

function SellerContentWeight() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <FontWeightSettings
      value={sellerSettings.content.weight}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          content: { ...prev.content, weight: value }
        }))
      }
    />
  );
}

function SellerContentColor() {
  const { sellerSettings, setSellerSettings } = useSellerSettingsSlice();

  return (
    <ColorSettings
      value={sellerSettings.content.color}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          content: { ...prev.content, color: value }
        }))
      }
    />
  );
}
