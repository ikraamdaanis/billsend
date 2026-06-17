import { Label } from "components/ui/label";
import { currencySymbols } from "consts/currencies";
import { useUI } from "context/ui-context";
import type { LucideIcon } from "lucide-react";
import {
  Building2Icon,
  CalculatorIcon,
  ChevronRightIcon,
  FileTextIcon,
  InfoIcon,
  TableIcon,
  TypeIcon,
  UserIcon
} from "lucide-react";
import { useCurrencySlice } from "stores/invoice-selectors";
import type { Currency, SettingsType } from "types";

const SECTIONS: { type: SettingsType; label: string; Icon: LucideIcon }[] = [
  { type: "title", label: "Title", Icon: TypeIcon },
  { type: "seller", label: "From", Icon: Building2Icon },
  { type: "client", label: "To", Icon: UserIcon },
  { type: "details", label: "Details", Icon: InfoIcon },
  { type: "table", label: "Line items", Icon: TableIcon },
  { type: "totals", label: "Totals", Icon: CalculatorIcon },
  { type: "terms", label: "Terms", Icon: FileTextIcon }
];

const SECTION_HEADER =
  "text-muted-foreground text-[10px] font-medium uppercase tracking-wider";

export function MainSettings() {
  const { currency, setCurrency } = useCurrencySlice();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <span className={SECTION_HEADER}>Document</span>
        <Label
          htmlFor="currency-select"
          className="text-muted-foreground text-[11px]"
        >
          Currency
        </Label>
        <select
          id="currency-select"
          value={currency}
          onChange={event => setCurrency(event.target.value as Currency)}
          className="border-input bg-background ring-offset-background focus:ring-ring flex h-9 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-1 focus:ring-offset-0 focus:outline-hidden"
        >
          {currencySymbols.map(({ code, symbol, currency: currencyName }) => (
            <option key={code} value={code}>
              {symbol} - {currencyName}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className={SECTION_HEADER}>Sections</span>
        <SectionNav />
      </div>
    </div>
  );
}

function SectionNav() {
  const { setActiveSettings } = useUI();

  function handleSelect(type: SettingsType) {
    setActiveSettings(type);

    const field = document.getElementById(`invoice-field-${type}`);
    if (field) {
      field.focus();
    }
  }

  return (
    <div className="flex flex-col gap-0.5">
      {SECTIONS.map(({ type, label, Icon }) => (
        <button
          key={type}
          type="button"
          onClick={() => handleSelect(type)}
          className="group hover:bg-accent flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors"
        >
          <span className="flex items-center gap-2">
            <Icon className="text-muted-foreground size-3.5" />
            <span className="text-sm">{label}</span>
          </span>
          <ChevronRightIcon className="text-muted-foreground/50 size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      ))}
    </div>
  );
}
