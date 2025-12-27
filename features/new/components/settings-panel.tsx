import { InvoiceClientSettings } from "features/new/components/invoice-client-details";
import { InvoiceDetailsSettings } from "features/new/components/invoice-details-settings";
import { InvoicePricingSettings } from "features/new/components/invoice-pricing-settings";
import { InvoiceSellerSettings } from "features/new/components/invoice-seller-details";
import { InvoiceTermsSettings } from "features/new/components/invoice-terms-settings";
import { InvoiceTitleSettings } from "features/new/components/invoice-title";
import { LineItemsSettings } from "features/new/components/line-items-settings";
import { MainSettings } from "features/new/components/main-settings";
import type { SettingsType } from "features/new/types";
import { atom, useAtomValue } from "jotai";
import type { ReactNode } from "react";
import { memo } from "react";

export const activeSettingsAtom = atom<SettingsType>("main");

export function SettingsPanel() {
  const activeSettings = useAtomValue(activeSettingsAtom);

  return (
    <div className="bg-background h-fit min-h-64 p-4">
      <SettingsContent settingsType={activeSettings} />
    </div>
  );
}

const SettingsContent = memo(function SettingsContent({
  settingsType
}: {
  settingsType: SettingsType;
}) {
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
});
