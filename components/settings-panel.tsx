import { InvoiceClientSettings } from "components/invoice-client-details";
import { InvoiceDetailsSettings } from "components/invoice-details-settings";
import { InvoicePricingSettings } from "components/invoice-pricing-settings";
import { InvoiceSellerSettings } from "components/invoice-seller-details";
import { InvoiceTermsSettings } from "components/invoice-terms-settings";
import { InvoiceTitleSettings } from "components/invoice-title";
import { LineItemsSettings } from "components/line-items-settings";
import { MainSettings } from "components/main-settings";
import { useUI } from "context/ui-context";
import type { ReactNode } from "react";
import type { SettingsType } from "types";

export function SettingsPanel() {
  const { activeSettings } = useUI();

  return (
    <div className="bg-background h-fit min-h-64 p-4">
      <SettingsContent settingsType={activeSettings} />
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
    <div className="flex h-full flex-col gap-4">{settings[settingsType]}</div>
  );
}
