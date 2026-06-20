import { ColorPicker } from "components/color-picker";
import { ToggleGroup, ToggleGroupItem } from "components/ui/toggle-group";
import { useThemeSlice } from "stores/invoice-selectors";
import type { InvoiceSize } from "types";

const SIZES: { value: InvoiceSize; label: string; title: string }[] = [
  { value: "small", label: "S", title: "Small text" },
  { value: "medium", label: "M", title: "Medium text" },
  { value: "large", label: "L", title: "Large text" }
];

/**
 * Global appearance controls for the invoice: text size scale and accent
 * colour. Both write to the single invoice theme.
 */
export function InvoiceThemeControls() {
  const { theme, setTheme } = useThemeSlice();

  return (
    <div className="flex items-center gap-1.5">
      <ToggleGroup
        type="single"
        value={theme.size}
        onValueChange={value => {
          if (!value) return;

          setTheme(prev => ({ ...prev, size: value as InvoiceSize }));
        }}
        className="gap-0 rounded-[3px] bg-zinc-100 dark:bg-zinc-900"
      >
        {SIZES.map(size => (
          <ToggleGroupItem
            key={size.value}
            value={size.value}
            size="sm"
            aria-label={size.title}
            title={size.title}
            className="data-[state=on]:text-foreground h-7 w-7 px-0 text-xs hover:bg-zinc-200/80 data-[state=on]:bg-white data-[state=on]:shadow-sm dark:hover:bg-zinc-700 dark:data-[state=on]:bg-zinc-700"
          >
            {size.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <ColorPicker
        color={theme.accent}
        onChange={value => setTheme(prev => ({ ...prev, accent: value }))}
      />
    </div>
  );
}
