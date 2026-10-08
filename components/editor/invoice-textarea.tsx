import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function InvoiceTextArea({
  className,
  onChange,
  ...props
}: Omit<ComponentProps<"textarea">, "onChange" | "ref"> & {
  onChange?: (value: string) => void;
}) {
  return (
    <textarea
      {...props}
      value={props.value}
      onChange={({ target: { value } }) => {
        onChange?.(value);
      }}
      className={cn(
        "rounded-surface text-paper-foreground placeholder:text-paper-muted-foreground hover:bg-brand-50 focus:border-brand-500 focus:bg-brand-50 relative w-full cursor-text resize-none overflow-hidden border border-transparent bg-transparent transition-[background-color,border-color,padding] outline-none focus:z-20 focus:p-2 focus:outline-none",
        className
      )}
      rows={1}
    />
  );
}
