import { Label } from "components/ui/label";
import { currencySymbols } from "consts/currencies";
import { currencyAtom } from "features/new/state";
import { useAtom } from "jotai";
import type { Currency } from "types";

export function MainSettings() {
  const [currency, setCurrency] = useAtom(currencyAtom);

  return (
    <div className="mb-4 flex h-full flex-col gap-4">
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
    </div>
  );
}
