"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

export function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

export function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

export function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

export function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/50 duration-200 ease-(--ease-out-strong) data-closed:duration-150",
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean;
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "bg-popover text-popover-foreground ring-foreground/10 shadow-menu data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-md text-sm ring-1 duration-200 ease-(--ease-out-strong) outline-none data-closed:duration-150 sm:max-w-sm dark:shadow-none",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                size="icon-sm"
              />
            }
          >
            <IconX />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

// Every dialog leads with its icon. On a phone, alerts and short forms centre
// their heading under it, like a phone's own alerts; from `sm` the icon sits
// at the top left with the title and description beside it, as in a desktop
// dialog. Dialogs that browse a list keep that layout everywhere.
export function DialogHeader({
  className,
  align = "center",
  icon,
  children,
  ...props
}: ComponentProps<"div"> & {
  align?: "center" | "start";
  icon?: ReactNode;
}) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex gap-4 p-4",
        align === "center"
          ? "flex-col items-center pb-2 text-center sm:flex-row sm:items-start sm:text-left"
          : "flex-row items-start",
        className
      )}
      {...props}
    >
      {icon}
      <div className="flex min-w-0 flex-1 flex-col gap-1">{children}</div>
    </div>
  );
}

// A light wash with a dark icon of the same hue: red for danger, amber for a
// warning, green for success, and a calm colour of its own for everything
// else, so each dialog is recognisable at a glance.
const DIALOG_ICON_TONES = {
  destructive: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  warning:
    "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  success:
    "bg-green-100 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
  sky: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
  teal: "bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400",
  violet:
    "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  fuchsia:
    "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400"
} as const;

// The tinted circle beside a dialog's heading (above it on a phone); a
// little smaller from `sm`.
export function DialogIcon({
  tone,
  className,
  ...props
}: ComponentProps<"div"> & { tone: keyof typeof DIALOG_ICON_TONES }) {
  return (
    <div
      aria-hidden="true"
      data-slot="dialog-icon"
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-full sm:size-10 [&_svg]:size-6 sm:[&_svg]:size-5",
        DIALOG_ICON_TONES[tone],
        className
      )}
      {...props}
    />
  );
}

// On a phone, alerts and short forms stack their actions full width, the main
// one on top (it comes last in the markup, after Cancel); from `sm` they sit
// in a row on the right, the main one last. Dialogs that browse a list keep a
// bar along the bottom with a status on the left.
export function DialogFooter({
  className,
  layout = "stack",
  showCloseButton = false,
  children,
  ...props
}: ComponentProps<"div"> & {
  layout?: "stack" | "bar";
  showCloseButton?: boolean;
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        layout === "stack"
          ? "flex flex-col-reverse gap-2 p-4 pt-2 *:h-10 *:w-full sm:flex-row sm:justify-end sm:*:h-8 sm:*:w-auto"
          : "bg-muted/50 flex flex-col-reverse gap-2 rounded-b-md border-t px-4 py-2.5 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "font-heading text-base/5 font-semibold text-balance",
        className
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-muted-foreground *:[a]:hover:text-foreground text-base/6 text-pretty sm:text-sm/5 *:[a]:underline *:[a]:underline-offset-3",
        className
      )}
      {...props}
    />
  );
}
