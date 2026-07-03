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
        "relative w-full cursor-text resize-none overflow-hidden rounded-surface border border-transparent bg-transparent text-zinc-900 transition-[background-color,border-color,padding] outline-none hover:bg-blue-100 focus:z-20 focus:border-blue-500 focus:bg-blue-100 focus:p-2 focus:outline-none",
        className
      )}
      rows={1}
    />
  );
}
