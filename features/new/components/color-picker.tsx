import { Input } from "components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import type { KeyboardEvent } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";

/**
 * Color picker component to change the color of an invoice text field.
 */
function ColorPickerComponent({
  color,
  onChange
}: {
  color: string;
  onChange: (color: string) => void;
}) {
  const [inputValue, setInputValue] = useState(color);

  const handleInputChange = useCallback(
    (value: string) => {
      setInputValue(value);
      onChange(value);
    },
    [onChange]
  );

  const handlePickerChange = useCallback(
    (value: string) => {
      setInputValue(value);
      onChange(value);
    },
    [onChange]
  );

  const handleInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onChange(inputValue);
      }
    },
    [inputValue, onChange]
  );

  const handleInputBlur = useCallback(() => {
    onChange(inputValue);
  }, [inputValue, onChange]);

  const colorPreviewStyle = useMemo(
    () => ({
      backgroundColor: color
    }),
    [color]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="h-8 w-8 rounded-md border border-zinc-200"
          style={colorPreviewStyle}
        />
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col gap-2 p-3">
        <HexColorPicker
          color={color}
          onChange={handlePickerChange}
          className="w-full"
          style={{ width: "100%" }}
        />
        <Input
          type="text"
          value={inputValue}
          onChange={({ target: { value } }) => handleInputChange(value)}
          onKeyDown={handleInputKeyDown}
          onBlur={handleInputBlur}
          placeholder="#000000"
        />
      </PopoverContent>
    </Popover>
  );
}

export const ColorPicker = memo(ColorPickerComponent);
