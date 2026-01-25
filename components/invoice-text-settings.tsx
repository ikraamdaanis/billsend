import { ColorPicker } from "components/color-picker";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "components/ui/toggle-group";
import { weightMap } from "consts";
import { useAtomValue } from "jotai";
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";
import { invoiceAtom } from "state";
import type {
  DeepKeyOf,
  Invoice,
  TableColumnSettings,
  TextSettings
} from "types";

/**
 * Invoice text settings component to change the text settings of an invoice
 * text field. With the ability to change the size, weight and color.
 */
export function InvoiceTextSettings({
  handleInput,
  settingsPath,
  title
}: {
  handleInput: (path: DeepKeyOf<Invoice>, value: string) => void;
  settingsPath: DeepKeyOf<Invoice>;
  title?: string;
}) {
  const invoice = useAtomValue(invoiceAtom);
  const fontSizes = [
    8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60, 72, 96
  ];

  const weights = ["Normal", "Medium", "Semibold", "Bold"];

  // Get the settings object from the path
  const pathParts = settingsPath.split(".");
  let currentObj: Record<string, unknown> = invoice as Record<string, unknown>;
  let settings: TextSettings | null = null;

  try {
    for (const part of pathParts) {
      if (typeof currentObj === "object") {
        currentObj = currentObj[part] as Record<string, unknown>;
      } else {
        throw new Error(`Invalid path part: ${part}`);
      }
    }

    if (
      typeof currentObj === "object" &&
      "align" in currentObj &&
      "size" in currentObj &&
      "weight" in currentObj &&
      "color" in currentObj
    ) {
      settings = currentObj as unknown as TextSettings;
    } else {
      throw new Error("Retrieved object is not a valid TextSettings object");
    }
  } catch {
    return null;
  }

  // Check if this is a table header setting (which has a label property)
  const isTableHeader = settingsPath.includes("HeaderSettings");
  const tableSettings = isTableHeader
    ? (currentObj as TableColumnSettings)
    : null;

  return (
    <div className="flex flex-col gap-2">
      {title && <Label className="text-lg font-medium">{title}</Label>}
      <div className="flex flex-col gap-2">
        {isTableHeader && (
          <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
            <Label htmlFor="header-label" className="font-medium">
              Label
            </Label>
            <div className="flex items-center justify-end gap-2">
              <Input
                id="header-label"
                value={tableSettings?.label || ""}
                onChange={({ target: { value } }) =>
                  handleInput(
                    `${settingsPath}.label` as DeepKeyOf<Invoice>,
                    value
                  )
                }
                className="w-full"
                placeholder={
                  tableSettings && settingsPath.includes("descriptionHeader")
                    ? "Description"
                    : tableSettings && settingsPath.includes("quantityHeader")
                      ? "Quantity"
                      : tableSettings &&
                          settingsPath.includes("unitPriceHeader")
                        ? "Unit Price"
                        : tableSettings && settingsPath.includes("amountHeader")
                          ? "Amount"
                          : ""
                }
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
          <Label htmlFor="text-align font-medium">Align</Label>
          <div className="flex items-center justify-end gap-2">
            <ToggleGroup
              type="single"
              value={settings.align}
              onValueChange={value =>
                handleInput(
                  `${settingsPath}.align` as DeepKeyOf<Invoice>,
                  value
                )
              }
              className="gap-0 rounded-lg bg-zinc-200 dark:bg-zinc-900"
            >
              <ToggleGroupItem
                value="left"
                size="sm"
                className="group hover:bg-zinc-100/80 dark:hover:bg-zinc-700"
              >
                <AlignLeftIcon className="transition group-hover:text-zinc-500 dark:group-hover:text-zinc-100" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="center"
                size="sm"
                className="group hover:bg-zinc-100/80 dark:hover:bg-zinc-700"
              >
                <AlignCenterIcon className="transition group-hover:text-zinc-500 dark:group-hover:text-zinc-100" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="right"
                size="sm"
                className="group hover:bg-zinc-100/80 dark:hover:bg-zinc-700"
              >
                <AlignRightIcon className="transition group-hover:text-zinc-500 dark:group-hover:text-zinc-100" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
          <Label htmlFor="text-size" className="font-medium">
            Size
          </Label>
          <div className="flex items-center justify-end gap-2">
            <Select
              value={settings.size}
              onValueChange={value =>
                handleInput(`${settingsPath}.size` as DeepKeyOf<Invoice>, value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {fontSizes.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
          <Label htmlFor="text-weight" className="font-medium">
            Weight
          </Label>
          <div className="flex items-center justify-end gap-2">
            <Select
              value={settings.weight}
              onValueChange={value =>
                handleInput(
                  `${settingsPath}.weight` as DeepKeyOf<Invoice>,
                  value
                )
              }
            >
              <SelectTrigger
                className="text-left"
                style={{
                  fontWeight: weightMap[settings.weight]
                }}
              >
                <SelectValue placeholder="Select weight" />
              </SelectTrigger>
              <SelectContent>
                {weights.map(weight => (
                  <SelectItem
                    key={weight}
                    value={weight}
                    style={{
                      fontWeight: weightMap[weight as keyof typeof weightMap]
                    }}
                  >
                    {weight}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
          <Label htmlFor="text-color" className="font-medium">
            Color
          </Label>
          <div className="flex items-center justify-end gap-2">
            <ColorPicker
              color={settings.color}
              onChange={value =>
                handleInput(
                  `${settingsPath}.color` as DeepKeyOf<Invoice>,
                  value
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
