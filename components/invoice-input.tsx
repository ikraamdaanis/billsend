import type { ComponentProps } from "react";
import { memo } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

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
        "relative h-[unset] w-full cursor-text resize-none overflow-visible rounded-[3px] border border-transparent bg-transparent p-0 text-zinc-900 outline-0 transition-[background-color,border-color,padding] outline-none hover:bg-blue-100 focus:z-20 focus:border-blue-500 focus:bg-blue-100 focus:px-2 focus:py-1 focus:ring-0 focus:outline-none",
        className
      )}
    />
  );
};

export const InvoiceInput = memo(InvoiceInputComponent);
