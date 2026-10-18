"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { IconX } from "@tabler/icons-react";
import type { ComponentProps } from "react";
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
          "bg-popover text-popover-foreground ring-foreground/10 shadow-menu data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 fixed top-1/2 left-1/2 z-50 flex w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl text-sm ring-1 duration-200 ease-(--ease-out-strong) outline-none data-closed:duration-150 sm:max-w-sm dark:shadow-none",
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

// On a phone, alerts and short forms centre their heading, like a phone's
// own alerts; from `sm` it sits at the start, as in any desktop dialog.
// Dialogs that browse a list keep it at the start everywhere, over the list.
export function DialogHeader({
  className,
  align = "center",
  ...props
}: ComponentProps<"div"> & { align?: "center" | "start" }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex flex-col gap-2",
        align === "center"
          ? "items-center p-6 pb-4 text-center sm:items-start sm:text-left"
          : "p-4",
        className
      )}
      {...props}
    />
  );
}

// The tinted circle at the top of an alert, carrying its tone; a little
// smaller from `sm`, where the alert reads like a desktop dialog.
export function DialogIcon({
  tone = "neutral",
  className,
  ...props
}: ComponentProps<"div"> & {
  tone?: "neutral" | "success" | "warning" | "destructive";
}) {
  return (
    <div
      aria-hidden="true"
      data-slot="dialog-icon"
      className={cn(
        "mb-2 flex size-12 shrink-0 items-center justify-center rounded-full sm:mb-1 sm:size-10 [&_svg]:size-6 sm:[&_svg]:size-5",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "success" && "bg-success/12 text-success",
        tone === "warning" && "bg-warning/15 text-warning",
        tone === "destructive" && "bg-destructive/10 text-destructive",
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
          ? "flex flex-col-reverse gap-2 p-6 pt-2 *:h-10 *:w-full sm:flex-row sm:justify-end sm:*:h-8 sm:*:w-auto"
          : "bg-muted/50 flex flex-col-reverse gap-2 rounded-b-xl border-t p-4 sm:flex-row sm:justify-end",
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
        "font-heading text-base font-semibold text-balance",
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
        "text-muted-foreground *:[a]:hover:text-foreground text-base/6 text-pretty sm:text-sm/6 *:[a]:underline *:[a]:underline-offset-3",
        className
      )}
      {...props}
    />
  );
}
