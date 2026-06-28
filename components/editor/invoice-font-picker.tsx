import {
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger
} from "~/components/ui/menubar";
import type { InvoiceFontDefinition } from "~/consts/invoice-fonts";
import {
  FONT_WEIGHT_OPTIONS,
  getAvailableFontWeights,
  getInvoiceFontDefinition,
  INVOICE_FONTS
} from "~/consts/invoice-fonts";
import { cn } from "~/lib/utils";
import { useThemeSlice } from "~/stores/invoice-selectors";
import type { InvoiceFont } from "~/types";
import type { FontWeight } from "~/utils/get-font-weight";

export function InvoiceFontFamilyMenu() {
  const { theme, setTheme } = useThemeSlice();

  return (
    <MenubarSub>
      <MenubarSubTrigger>Font</MenubarSubTrigger>
      <MenubarSubContent className="w-52 p-1">
        <MenubarRadioGroup
          value={theme.font}
          onValueChange={value => {
            const font = value as InvoiceFont;
            const available = getAvailableFontWeights(font);

            setTheme(prev => ({
              ...prev,
              font,
              fontWeight: available.includes(prev.fontWeight)
                ? prev.fontWeight
                : "Normal"
            }));
          }}
        >
          {INVOICE_FONTS.map(font => (
            <FontFamilyMenuItem key={font.id} font={font} />
          ))}
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  );
}

export function InvoiceFontWeightMenu() {
  const { theme, setTheme } = useThemeSlice();
  const font = getInvoiceFontDefinition(theme.font);
  const weights = FONT_WEIGHT_OPTIONS.filter(option =>
    getAvailableFontWeights(theme.font).includes(option.value)
  );

  return (
    <MenubarSub>
      <MenubarSubTrigger>Weight</MenubarSubTrigger>
      <MenubarSubContent className="w-52 p-1">
        <MenubarRadioGroup
          value={theme.fontWeight}
          onValueChange={value =>
            setTheme(prev => ({
              ...prev,
              fontWeight: value as FontWeight
            }))
          }
        >
          {weights.map(weight => (
            <MenubarRadioItem
              key={weight.value}
              value={weight.value}
              closeOnClick={false}
              className={cn(font.previewClassName, weight.className)}
            >
              {weight.label}
            </MenubarRadioItem>
          ))}
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  );
}

function FontFamilyMenuItem({ font }: { font: InvoiceFontDefinition }) {
  return (
    <MenubarRadioItem
      value={font.id}
      closeOnClick={false}
      className={cn(
        font.previewClassName,
        font.category === "monospace" ? "tabular-nums" : undefined
      )}
    >
      {font.name}
    </MenubarRadioItem>
  );
}
