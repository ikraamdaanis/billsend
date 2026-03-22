import { InvoiceClientSettings } from "components/invoice-client-details";
import { InvoiceDetailsSettings } from "components/invoice-details-settings";
import { InvoicePricingSettings } from "components/invoice-pricing-settings";
import { InvoiceSellerSettings } from "components/invoice-seller-details";
import { InvoiceTermsSettings } from "components/invoice-terms-settings";
import { InvoiceTitleSettings } from "components/invoice-title";
import { LineItemsSettings } from "components/line-items-settings";
import { MainSettings } from "components/main-settings";
import { Button } from "components/ui/button";
import { useUI } from "context/ui-context";
import { ArrowLeftIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { SettingsType } from "types";

const SETTINGS_LABELS: Record<SettingsType, string> = {
  main: "Settings",
  title: "Title",
  seller: "From",
  client: "To",
  details: "Details",
  table: "Line Items",
  totals: "Totals",
  terms: "Terms"
};

export function SettingsPanel() {
  const { activeSettings, setActiveSettings } = useUI();

  return (
    <div className="bg-background h-fit min-h-64 px-3 py-3">
      <SettingsPanelHeader
        activeSettings={activeSettings}
        onBack={() => setActiveSettings("main")}
      />
      <SettingsContent settingsType={activeSettings} />
    </div>
  );
}

function SettingsPanelHeader({
  activeSettings,
  onBack
}: {
  activeSettings: SettingsType;
  onBack: () => void;
}) {
  if (activeSettings === "main") {
    return (
      <div className="pb-2">
        <h2 className="text-sm font-semibold">
          {SETTINGS_LABELS[activeSettings]}
        </h2>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 pb-2">
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-6"
        onClick={onBack}
      >
        <ArrowLeftIcon className="size-3.5" />
      </Button>
      <h2 className="text-sm font-semibold">
        {SETTINGS_LABELS[activeSettings]}
      </h2>
    </div>
  );
}

function SettingsContent({ settingsType }: { settingsType: SettingsType }) {
  const settings: Record<SettingsType, ReactNode> = {
    title: <InvoiceTitleSettings />,
    seller: <InvoiceSellerSettings />,
    client: <InvoiceClientSettings />,
    details: <InvoiceDetailsSettings />,
    table: <LineItemsSettings />,
    totals: <InvoicePricingSettings />,
    terms: <InvoiceTermsSettings />,
    main: <MainSettings />
  };

  return (
    <div className="flex h-full flex-col gap-3">{settings[settingsType]}</div>
  );
}
