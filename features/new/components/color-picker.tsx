import { Input } from "components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

/**
 * Color picker component to change the color of an invoice text field.
 */
export function ColorPicker({
  color,
  onChange
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  const [inputValue, setInputValue] = useState(color);

  return (
    <Popover>
      <PopoverTrigger
        className="size-8 min-w-8 rounded-md border border-zinc-200"
        style={{ backgroundColor: color }}
      />
      <PopoverContent className="flex w-auto flex-col gap-2 p-3">
        <HexColorPicker
          color={color}
          onChange={value => {
            setInputValue(value);
            onChange(value);
          }}
          className="w-full"
        />
        <Input
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => {
            setInputValue(value);
            onChange(value);
          }}
          onKeyDown={event => {
            if (event.key !== "Enter") return;

            event.preventDefault();
            onChange(inputValue);
          }}
          onBlur={() => onChange(inputValue)}
          placeholder="#000000"
        />
      </PopoverContent>
    </Popover>
  );
}
