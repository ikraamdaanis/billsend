import { Button } from "components/ui/button";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { currencySymbols } from "consts/currencies";
import { SaveTemplateModal } from "features/new/components/save-template-modal";
import { TemplateSelectionModal } from "features/new/components/template-selection-modal";
import { getAllTemplates } from "features/new/db";
import {
  currencyAtom,
  invoiceAtom,
  invoiceTemplatesAtom
} from "features/new/state";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { BookmarkIcon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Currency } from "types";

export function MainSettings() {
  const [currency, setCurrency] = useAtom(currencyAtom);
  const currentInvoice = useAtomValue(invoiceAtom);

  // Get templates data from the jotai atom
  const templates = useAtomValue(invoiceTemplatesAtom);
  const setTemplates = useSetAtom(invoiceTemplatesAtom);

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Load templates from IndexedDB on mount
  useEffect(() => {
    async function loadTemplates() {
      try {
        const loadedTemplates = await getAllTemplates();
        setTemplates(loadedTemplates);
      } catch {
        // Failed to load templates
      }
    }
    loadTemplates();
  }, [setTemplates]);

  return (
    <div className="mb-4 flex h-full flex-col gap-4">
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
            onChange={e => setCurrency(e.target.value as Currency)}
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
