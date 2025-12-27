import { Input } from "components/ui/input";
import { cn } from "lib/utils";
import type { ComponentProps } from "react";
import { memo } from "react";

const InvoiceInputComponent = ({
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "onChange"> & {
  onChange?: (value: string) => void;
}) => {
  return (
    <Input
      {...props}
      value={props.value}
      onChange={({ target: { value } }) => {
        props.onChange?.(value);
      }}
      className={cn(
        "relative h-[unset] w-full cursor-text resize-none overflow-visible rounded-sm border border-transparent bg-transparent p-0 text-zinc-900 outline-0 transition-all outline-none hover:bg-blue-100 focus:outline-none focus-visible:z-20 focus-visible:border-blue-500 focus-visible:bg-blue-100 focus-visible:px-2 focus-visible:py-1 focus-visible:ring-0",
        className
      )}
    />
  );
};

export const InvoiceInput = memo(InvoiceInputComponent);
