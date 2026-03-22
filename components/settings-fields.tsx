import { ColorPicker } from "components/color-picker";
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
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon } from "lucide-react";
import { memo } from "react";
import type { TextSettings } from "types";

const fontSizes = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60, 72,
  96
];

const weights = ["Normal", "Medium", "Semibold", "Bold"];

/**
 * Compact text style controls — align + color on row 1, size + weight on row 2.
 */
export const TextStyleControls = memo(function TextStyleControls({
  align,
  size,
  weight,
  color,
  onAlignChange,
  onSizeChange,
  onWeightChange,
  onColorChange
}: {
  align: string;
  size: string;
  weight: string;
  color: string;
  onAlignChange: (value: TextSettings["align"]) => void;
  onSizeChange: (value: TextSettings["size"]) => void;
  onWeightChange: (value: TextSettings["weight"]) => void;
  onColorChange: (value: TextSettings["color"]) => void;
}) {
  return (
    <div className="grid grid-cols-[42px_1fr] items-center gap-x-2 gap-y-1.5">
      <Label className="text-muted-foreground text-[11px]">Align</Label>
      <ToggleGroup
        type="single"
        value={align}
        onValueChange={val =>
          onAlignChange(val as TextSettings["align"])
        }
        className="gap-0 rounded-md bg-zinc-100 dark:bg-zinc-900"
      >
        <ToggleGroupItem
          value="left"
          size="sm"
          className="group h-7 w-7 px-0 hover:bg-zinc-200/80 dark:hover:bg-zinc-700"
        >
          <AlignLeftIcon className="size-3.5" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="center"
          size="sm"
          className="group h-7 w-7 px-0 hover:bg-zinc-200/80 dark:hover:bg-zinc-700"
        >
          <AlignCenterIcon className="size-3.5" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="right"
          size="sm"
          className="group h-7 w-7 px-0 hover:bg-zinc-200/80 dark:hover:bg-zinc-700"
        >
          <AlignRightIcon className="size-3.5" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Label className="text-muted-foreground text-[11px]">Size</Label>
      <Select value={size} onValueChange={onSizeChange}>
        <SelectTrigger size="sm" className="h-7 w-full text-xs">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map(s => (
            <SelectItem key={s} value={s.toString()}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label className="text-muted-foreground text-[11px]">Weight</Label>
      <Select
        value={weight}
        onValueChange={val =>
          onWeightChange(val as TextSettings["weight"])
        }
      >
        <SelectTrigger
          size="sm"
          className="h-7 w-full text-left text-xs"
          style={{
            fontWeight: weightMap[weight as keyof typeof weightMap]
          }}
        >
          <SelectValue placeholder="Weight" />
        </SelectTrigger>
        <SelectContent>
          {weights.map(w => (
            <SelectItem
              key={w}
              value={w}
              style={{
                fontWeight: weightMap[w as keyof typeof weightMap]
              }}
            >
              {w}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label className="text-muted-foreground text-[11px]">Color</Label>
      <div>
        <ColorPicker color={color} onChange={onColorChange} />
      </div>
    </div>
  );
});

/**
 * Compact color setting — inline label + swatch on one row.
 */
export const CompactColorSetting = memo(function CompactColorSetting({
  value,
  handleInput,
  label = "Color"
}: {
  value: string;
  handleInput: (value: string) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      <ColorPicker color={value} onChange={handleInput} />
    </div>
  );
});

// Legacy individual exports — kept for backward compatibility
export const AlignSettings = memo(function AlignSettings({
  value,
  handleInput
}: {
  value: string;
  handleInput: (value: TextSettings["align"]) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="text-align" className="text-xs font-medium">
        Align
      </Label>
      <div className="flex items-center justify-end gap-2">
        <ToggleGroup
          type="single"
          value={value}
          onValueChange={val => handleInput(val as TextSettings["align"])}
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
  );
});

export const SizeSettings = memo(function SizeSettings({
  value,
  handleInput
}: {
  value: string;
  handleInput: (value: TextSettings["size"]) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="text-size" className="text-xs font-medium">
        Size
      </Label>
      <div className="flex items-center justify-end gap-2">
        <Select value={value} onValueChange={val => handleInput(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            {fontSizes.map(s => (
              <SelectItem key={s} value={s.toString()}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

export const FontWeightSettings = memo(function FontWeightSettings({
  value,
  handleInput
}: {
  value: string;
  handleInput: (value: TextSettings["weight"]) => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="text-weight" className="text-xs font-medium">
        Weight
      </Label>
      <div className="flex items-center justify-end gap-2">
        <Select
          value={value}
          onValueChange={val => handleInput(val as TextSettings["weight"])}
        >
          <SelectTrigger
            className="text-left"
            style={{
              fontWeight: weightMap[value as keyof typeof weightMap]
            }}
          >
            <SelectValue placeholder="Select weight" />
          </SelectTrigger>
          <SelectContent>
            {weights.map(w => (
              <SelectItem
                key={w}
                value={w}
                style={{
                  fontWeight: weightMap[w as keyof typeof weightMap]
                }}
              >
                {w}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

export const ColorSettings = memo(function ColorSettings({
  value,
  handleInput,
  label = "Color"
}: {
  value: string;
  handleInput: (value: TextSettings["color"]) => void;
  label?: string;
}) {
  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="text-color" className="text-xs font-medium">
        {label}
      </Label>
      <div className="flex items-center justify-end gap-2">
        <ColorPicker color={value} onChange={val => handleInput(val)} />
      </div>
    </div>
  );
});
