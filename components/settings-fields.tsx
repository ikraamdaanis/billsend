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

const fontSizes = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 24, 28, 32, 36, 40, 48, 60, 72, 96
];

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
            {fontSizes.map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});

const weights = ["Normal", "Medium", "Semibold", "Bold"];

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
