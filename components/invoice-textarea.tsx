import { cn } from "lib/utils";
import type { ComponentProps } from "react";
import { memo } from "react";

const InvoiceTextAreaComponent = ({
  className,
  onChange,
  ...props
}: Omit<ComponentProps<"textarea">, "onChange" | "ref"> & {
  onChange?: (value: string) => void;
}) => {
  return (
    <textarea
      {...props}
      value={props.value}
      onChange={({ target: { value } }) => {
        onChange?.(value);
      }}
      className={cn(
        "relative w-full cursor-text resize-none overflow-visible rounded-sm border border-transparent bg-transparent text-zinc-900 transition-all outline-none hover:bg-blue-100 focus:outline-none focus-visible:z-20 focus-visible:border-blue-500 focus-visible:bg-blue-100 focus-visible:p-2",
        className
      )}
      rows={1}
    />
  );
};

export const InvoiceTextArea = memo(InvoiceTextAreaComponent);
