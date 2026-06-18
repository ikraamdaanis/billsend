import { Popover as BasePopover } from "@base-ui-components/react/popover";
import { cn } from "lib/utils";
import type { ComponentProps } from "react";

export function Popover(props: ComponentProps<typeof BasePopover.Root>) {
  return <BasePopover.Root data-slot="popover" {...props} />;
}

export function PopoverTrigger(
  props: ComponentProps<typeof BasePopover.Trigger>
) {
  return <BasePopover.Trigger data-slot="popover-trigger" {...props} />;
}

export function PopoverContent({
  className,
  side = "bottom",
  align = "center",
  sideOffset = 4,
  alignOffset,
  collisionPadding,
  anchor,
  ...props
}: ComponentProps<typeof BasePopover.Popup> &
  Pick<
    ComponentProps<typeof BasePopover.Positioner>,
    | "side"
    | "align"
    | "sideOffset"
    | "alignOffset"
    | "collisionPadding"
    | "anchor"
  >) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        data-slot="popover-positioner"
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        anchor={anchor}
        className="z-50"
      >
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            "bg-popover text-popover-foreground w-72 origin-(--transform-origin) rounded-sm border p-4 shadow-md outline-hidden transition-[transform,opacity] duration-150 data-ending-style:scale-100 data-ending-style:opacity-0 data-starting-style:scale-100 data-starting-style:opacity-0",
            className
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}
