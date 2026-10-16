import type { ComponentProps } from "react";
import { useIsPreview } from "~/hooks/use-shown-sections";
import { cn } from "~/lib/utils";

export function InvoiceTextArea({
  className,
  onChange,
  ...props
}: Omit<ComponentProps<"textarea">, "onChange" | "ref"> & {
  onChange?: (value: string) => void;
}) {
  // Preview reads like the PDF: no placeholders, no editing highlight.
  const isPreview = useIsPreview();

  return (
    <textarea
      {...props}
      readOnly={isPreview || props.readOnly}
      placeholder={isPreview ? undefined : props.placeholder}
      value={props.value}
      onChange={({ target: { value } }) => {
        onChange?.(value);
      }}
      className={cn(
        "rounded-surface text-paper-foreground placeholder:text-paper-muted-foreground hover:bg-brand-50 focus:border-brand-500 focus:bg-brand-50 relative w-full cursor-text resize-none overflow-hidden border border-transparent bg-transparent transition-[background-color,border-color,padding] outline-none focus:z-20 focus:p-2 focus:outline-none",
        className,
        isPreview &&
          "pointer-events-none min-h-0 hover:bg-transparent focus:border-transparent focus:bg-transparent focus:p-0"
      )}
      rows={1}
    />
  );
}
