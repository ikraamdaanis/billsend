import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { currencySymbols } from "consts/currencies";
import { InvoiceClientSettings } from "features/new/components/invoice-client-details";
import { InvoiceDetailsSettings } from "features/new/components/invoice-details-settings";
import { InvoicePricingSettings } from "features/new/components/invoice-pricing-settings";
import { InvoiceSellerSettings } from "features/new/components/invoice-seller-details";
import { InvoiceTermsSettings } from "features/new/components/invoice-terms-settings";
import { InvoiceTitleSettings } from "features/new/components/invoice-title";
import { LineItemsSettings } from "features/new/components/line-items-settings";
import { MainSettings } from "features/new/components/main-settings";
import { SaveTemplateModal } from "features/new/components/save-template-modal";
import { TemplateSelectionModal } from "features/new/components/template-selection-modal";
import {
  currencyAtom,
  invoiceAtom,
  invoiceTemplatesAtom,
  updateCurrencyAtom
} from "features/new/state";
import type { SettingsType } from "features/new/types";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { BookmarkIcon, SaveIcon } from "lucide-react";
import type { ReactNode } from "react";
import { memo, useState } from "react";
import type { Currency } from "types";

export const activeSettingsAtom = atom<SettingsType>("main");

export function SettingsPanel() {
  const activeSettings = useAtomValue(activeSettingsAtom);

  return (
    <div className="bg-background h-fit min-h-64 p-4">
      {activeSettings !== "main" ? (
        <SettingsContent settingsType={activeSettings} />
      ) : (
        <MainSettingsContent />
      )}
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

function MainSettingsContent() {
  const currency = useAtomValue(currencyAtom);
  const updateCurrency = useSetAtom(updateCurrencyAtom);
  const currentInvoice = useAtomValue(invoiceAtom);

  // Get templates data from the jotai atom
  const templates = useAtomValue(invoiceTemplatesAtom);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  return (
    <div className="mb-4 flex h-full flex-col gap-4">
      <Label className="text-lg font-medium">Main Settings</Label>
      <div className="flex flex-col gap-2">
        <Label className="font-medium">Templates</Label>
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowTemplateModal(true)}
          >
            <BookmarkIcon className="h-4 w-4" />
            Choose Template
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSaveModal(true)}
          >
            <SaveIcon className="h-4 w-4" />
            Save as Template
          </Button>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
          <Label htmlFor="currency-select" className="font-medium">
            Currency
          </Label>
          <select
            id="currency-select"
            value={currency}
            onChange={e => updateCurrency(e.target.value as Currency)}
            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-offset-0 focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
          >
            {currencySymbols.map(({ code, symbol, currency: currencyName }) => (
              <option key={code} value={code}>
                {symbol} - {currencyName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <TemplateSelectionModal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
        templates={templates}
      />
      <SaveTemplateModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        currentInvoiceData={currentInvoice}
        templates={templates}
      />
    </div>
  );
}
