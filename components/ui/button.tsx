import { Button as BaseButton } from "@base-ui/react/button";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import { cn } from "lib/utils";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: "bg-brand-500 text-primary-foreground hover:bg-brand-500/90",
        destructive:
          "bg-[#F0F0F0] text-destructive-foreground  focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-[#F0F0F0] text-secondary-foreground",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        "table-header":
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 text-left",
        link: "text-primary underline-offset-4 hover:underline",
        unstyled: ""
      },
      size: {
        default: "h-7 px-4 py-2",
        sm: "h-6 gap-1.5 px-2 text-xs",
        lg: "h-10 px-6",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
        "table-header":
          "h-full text-left -mx-2 px-2 rounded-none w-full flex items-center justify-start gap-2",
        unstyled: ""
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading,
  children,
  onClick,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? true : false;
  const hasLoadingFeature = isLoading !== undefined;

  return (
    <BaseButton
      data-slot="button"
      aria-disabled={isLoading || props["aria-disabled"]}
      className={cn(
        buttonVariants({ variant, size, className }),
        hasLoadingFeature && "relative overflow-hidden",
        isLoading && "cursor-not-allowed"
      )}
      onClick={event => {
        if (isLoading) return event.preventDefault();

        onClick?.(event);
      }}
      {...(Comp ? { render: <div />, nativeButton: false } : {})}
      {...props}
    >
      {hasLoadingFeature ? (
        <>
          <Loader2
            className={cn(
              "absolute size-4 transition-all duration-200 ease-out",
              isLoading
                ? "blur-0 animate-spin opacity-100"
                : "scale-75 opacity-0 blur-sm"
            )}
          />
          <span
            className={cn(
              "inline-flex items-center gap-2 transition-all duration-200 ease-out",
              isLoading ? "opacity-0 blur-sm" : "blur-0 opacity-100"
            )}
          >
            {children}
          </span>
        </>
      ) : (
        children
      )}
    </BaseButton>
  );
}

export { Button, buttonVariants };
