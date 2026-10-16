import type { ComponentProps } from "react";
import { Input } from "~/components/ui/input";
import { useIsPreview } from "~/hooks/use-shown-sections";
import { cn } from "~/lib/utils";

export function InvoiceInput({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "onChange"> & {
  onChange?: (value: string) => void;
}) {
  // Preview reads like the PDF: no placeholders, no editing highlight.
  const isPreview = useIsPreview();

  return (
    <Input
      {...props}
      readOnly={isPreview || props.readOnly}
      placeholder={isPreview ? undefined : props.placeholder}
      value={props.value}
      onChange={({ target: { value } }) => {
        props.onChange?.(value);
      }}
      className={cn(
        "rounded-surface text-paper-foreground placeholder:text-paper-muted-foreground hover:bg-brand-50 focus:border-brand-500 focus:bg-brand-50 relative h-[unset] w-full cursor-text resize-none overflow-visible border border-transparent bg-transparent p-0 outline-0 transition-[background-color,border-color,padding] outline-none focus:z-20 focus:px-2 focus:py-1 focus:ring-0 focus:outline-none",
        className,
        isPreview &&
          "pointer-events-none hover:bg-transparent focus:border-transparent focus:bg-transparent focus:p-0"
      )}
    />
  );
}
