import { InvoiceInput } from "components/invoice-input";
import { InvoiceTextArea } from "components/invoice-textarea";
import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { useUI } from "context/ui-context";
import { useSellerSlice } from "stores/invoice-selectors";
import { useInvoiceStore } from "stores/invoice-store";
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
  const align = useInvoiceStore(state => state.sellerSettings.label.align);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <AlignSettings
      value={align}
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
  const size = useInvoiceStore(state => state.sellerSettings.label.size);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <SizeSettings
      value={size}
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
  const weight = useInvoiceStore(state => state.sellerSettings.label.weight);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <FontWeightSettings
      value={weight}
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
  const color = useInvoiceStore(state => state.sellerSettings.label.color);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <ColorSettings
      value={color}
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
  const align = useInvoiceStore(state => state.sellerSettings.content.align);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <AlignSettings
      value={align}
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
  const size = useInvoiceStore(state => state.sellerSettings.content.size);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <SizeSettings
      value={size}
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
  const weight = useInvoiceStore(state => state.sellerSettings.content.weight);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <FontWeightSettings
      value={weight}
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
  const color = useInvoiceStore(state => state.sellerSettings.content.color);
  const setSellerSettings = useInvoiceStore(state => state.setSellerSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setSellerSettings(prev => ({
          ...prev,
          content: { ...prev.content, color: value }
        }))
      }
    />
  );
}
