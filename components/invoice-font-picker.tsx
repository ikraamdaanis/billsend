import {
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger
} from "components/ui/menubar";
import {
  getInvoiceFontDefinition,
  INVOICE_FONTS,
  type InvoiceFontDefinition
} from "consts/invoice-fonts";
import { cn } from "lib/utils";
import { useThemeSlice } from "stores/invoice-selectors";
import type { InvoiceFont } from "types";

const FONT_OVERRIDE_DEFAULT = "__default__";

export function InvoiceFontPickerMenu() {
  const { theme, setTheme } = useThemeSlice();

  return (
    <MenubarSub>
      <MenubarSubTrigger>Typography</MenubarSubTrigger>
      <MenubarSubContent className="w-52 p-1">
        <MenubarRadioGroup
          value={theme.font}
          onValueChange={value =>
            setTheme(prev => ({ ...prev, font: value as InvoiceFont }))
          }
        >
          {INVOICE_FONTS.map(font => (
            <FontMenuItem key={font.id} font={font} />
          ))}
        </MenubarRadioGroup>
        <MenubarSeparator className="my-1" />
        <FontOverrideSub
          label="Text"
          value={theme.textFontOverride}
          onChange={value =>
            setTheme(prev => ({ ...prev, textFontOverride: value }))
          }
        />
        <FontOverrideSub
          label="Numbers"
          value={theme.numberFontOverride}
          onChange={value =>
            setTheme(prev => ({ ...prev, numberFontOverride: value }))
          }
        />
      </MenubarSubContent>
    </MenubarSub>
  );
}

function FontOverrideSub({
  label,
  value,
  onChange
}: {
  label: string;
  value: InvoiceFont | null;
  onChange: (value: InvoiceFont | null) => void;
}) {
  const activeLabel = value
    ? getInvoiceFontDefinition(value).name
    : "Same as default";

  return (
    <MenubarSub>
      <MenubarSubTrigger className="w-full items-center justify-between">
        <span>{label}</span>
        <span className="text-muted-foreground truncate">{activeLabel}</span>
      </MenubarSubTrigger>
      <MenubarSubContent className="w-52 p-1">
        <MenubarRadioGroup
          value={value ?? FONT_OVERRIDE_DEFAULT}
          onValueChange={next =>
            onChange(
              next === FONT_OVERRIDE_DEFAULT ? null : (next as InvoiceFont)
            )
          }
        >
          <MenubarRadioItem value={FONT_OVERRIDE_DEFAULT} closeOnClick={false}>
            Same as default
          </MenubarRadioItem>
          <MenubarSeparator className="my-1" />
          {INVOICE_FONTS.map(font => (
            <FontMenuItem key={font.id} font={font} />
          ))}
        </MenubarRadioGroup>
      </MenubarSubContent>
    </MenubarSub>
  );
}

function FontMenuItem({ font }: { font: InvoiceFontDefinition }) {
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
