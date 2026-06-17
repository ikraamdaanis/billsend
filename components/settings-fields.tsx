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
  8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60, 72, 96
];

const weights = ["Normal", "Medium", "Semibold", "Bold"];

/**
 * Horizontal text style toolbar — align, size, weight, and color in one row.
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
    <div className="flex items-center gap-1">
      <ToggleGroup
        type="single"
        value={align}
        onValueChange={val => onAlignChange(val as TextSettings["align"])}
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
      <span className="bg-border mx-0.5 h-5 w-px" aria-hidden="true" />
      <Select value={size} onValueChange={onSizeChange}>
        <SelectTrigger size="sm" className="h-7 w-[60px] px-2 text-xs">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          {fontSizes.map(fontSize => (
            <SelectItem key={fontSize} value={fontSize.toString()}>
              {fontSize}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={weight}
        onValueChange={val => onWeightChange(val as TextSettings["weight"])}
      >
        <SelectTrigger
          size="sm"
          className="h-7 w-[96px] px-2 text-left text-xs"
          style={{
            fontWeight: weightMap[weight as keyof typeof weightMap]
          }}
        >
          <SelectValue placeholder="Weight" />
        </SelectTrigger>
        <SelectContent>
          {weights.map(weightName => (
            <SelectItem
              key={weightName}
              value={weightName}
              style={{
                fontWeight: weightMap[weightName as keyof typeof weightMap]
              }}
            >
              {weightName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="bg-border mx-0.5 h-5 w-px" aria-hidden="true" />
      <ColorPicker color={color} onChange={onColorChange} />
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
