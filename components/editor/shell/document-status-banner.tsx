import {
  IconAlertTriangleFilled,
  IconCircleXFilled,
  IconInfoCircleFilled,
  IconX
} from "@tabler/icons-react";
import type { CSSProperties, ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { useCanvasView } from "~/context/canvas-view-context";
import { useFileActions } from "~/context/file-actions-context";
import { useInvoiceDocument } from "~/context/invoice-document-context";
import { cn } from "~/lib/utils";

// Says where the open invoice stands, but only when something needs saying.
// While saves work nothing shows at all (no "Saving…" flicker), as in Google
// Docs and Figma. A failed save stays here until it's resolved, announced once
// per run of failures rather than on every retry. In Safari, which clears a
// site's storage after a week unused, it also suggests a backup, once.
export function DocumentStatusBanner() {
  const {
    status,
    saveFailure,
    backupReminder,
    retrySave,
    downloadBackup,
    dismissBackupReminder,
    takeOver,
    keepDeletedCopy
  } = useInvoiceDocument();
  const { newInvoice } = useFileActions();
  const [busy, setBusy] = useState(false);

  async function act(action: () => Promise<unknown>) {
    setBusy(true);

    try {
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something failed");
    } finally {
      setBusy(false);
    }
  }

  if (status === "reloadRequired") {
    return (
      <Banner
        tone="warning"
        actions={[{ label: "Reload", onClick: () => window.location.reload() }]}
      >
        billsend was updated in another tab. Reload to keep editing; your latest
        changes come back with you.
      </Banner>
    );
  }

  if (status === "unavailable") {
    return (
      <Banner
        tone="warning"
        busy={busy}
        actions={[
          { label: "Download backup", onClick: () => void act(downloadBackup) }
        ]}
      >
        This browser isn’t letting billsend store anything, so this invoice
        can’t be saved here.
      </Banner>
    );
  }

  if (status === "readOnly") {
    return (
      <Banner
        tone="info"
        busy={busy}
        actions={[{ label: "Edit here", onClick: () => void act(takeOver) }]}
      >
        This invoice is open in another tab. Changes made there show here.
      </Banner>
    );
  }

  if (status === "deleted") {
    return (
      <Banner
        tone="error"
        title="Deleted in another tab"
        busy={busy}
        actions={[
          { label: "Keep a copy", onClick: () => void act(keepDeletedCopy) },
          { label: "New invoice", onClick: newInvoice }
        ]}
      >
        Changes made here aren’t saved. Keep a copy to carry on with it.
      </Banner>
    );
  }

  if (saveFailure) {
    return (
      <Banner
        key={saveFailure.episode}
        tone="error"
        title={saveFailure.storageFull ? "Storage full" : "Couldn’t save"}
        alert
        busy={busy}
        actions={[
          { label: "Retry", onClick: () => void act(retrySave) },
          { label: "Download backup", onClick: () => void act(downloadBackup) }
        ]}
      >
        {saveFailure.message}
      </Banner>
    );
  }

  if (backupReminder) {
    return (
      <Banner
        tone="info"
        busy={busy}
        onDismiss={dismissBackupReminder}
        actions={[
          {
            label: "Download backup",
            onClick: () =>
              void act(async () => {
                await downloadBackup();
                dismissBackupReminder();
              })
          }
        ]}
      >
        Safari clears sites left unopened for a week. Back up your invoices to
        keep them.
      </Banner>
    );
  }

  return null;
}

// Each tone's tint, icon and text: soft on the light editor, and on the dark
// one the tone mixed into the popover colour, so the alert stays opaque over
// the white page.
const TONES = {
  info: {
    icon: IconInfoCircleFilled,
    surface:
      "bg-blue-50 ring-blue-600/10 dark:bg-[color-mix(in_oklab,var(--color-blue-500)_14%,var(--popover))] dark:ring-blue-400/20",
    iconColour: "text-blue-500 dark:text-blue-400",
    title: "text-blue-900 dark:text-blue-100",
    text: "text-blue-800 dark:text-blue-200/80",
    action:
      "text-blue-900 hover:bg-blue-100 focus-visible:outline-blue-600 dark:text-blue-100 dark:hover:bg-blue-500/15 dark:focus-visible:outline-blue-400"
  },
  warning: {
    icon: IconAlertTriangleFilled,
    surface:
      "bg-amber-50 ring-amber-600/15 dark:bg-[color-mix(in_oklab,var(--color-amber-500)_14%,var(--popover))] dark:ring-amber-400/20",
    iconColour: "text-amber-500 dark:text-amber-400",
    title: "text-amber-900 dark:text-amber-100",
    text: "text-amber-800 dark:text-amber-200/80",
    action:
      "text-amber-900 hover:bg-amber-100 focus-visible:outline-amber-600 dark:text-amber-100 dark:hover:bg-amber-500/15 dark:focus-visible:outline-amber-400"
  },
  error: {
    icon: IconCircleXFilled,
    surface:
      "bg-red-50 ring-red-600/10 dark:bg-[color-mix(in_oklab,var(--color-red-500)_14%,var(--popover))] dark:ring-red-400/20",
    iconColour: "text-red-500 dark:text-red-400",
    title: "text-red-900 dark:text-red-100",
    text: "text-red-800 dark:text-red-200/80",
    action:
      "text-red-900 hover:bg-red-100 focus-visible:outline-red-600 dark:text-red-100 dark:hover:bg-red-500/15 dark:focus-visible:outline-red-400"
  }
} as const;

// A tinted alert beside the canvas, never over it, so it can't cover a field,
// and as wide as the page on wide screens. With a title (a problem with more
// than one way out) the sentence and the actions sit under it, the main
// action first. Without one it's a single line: the sentence, then the
// action on the right (under it on a phone), and a dismiss button if it can
// be put away.
function Banner({
  tone,
  title,
  alert = false,
  busy = false,
  actions,
  onDismiss,
  children
}: {
  tone: keyof typeof TONES;
  title?: string;
  alert?: boolean;
  busy?: boolean;
  actions: { label: string; onClick: () => void }[];
  onDismiss?: () => void;
  children: ReactNode;
}) {
  const { zoom } = useCanvasView();
  const colours = TONES[tone];
  const Icon = colours.icon;
  const buttons = actions.map(action => (
    <button
      key={action.label}
      type="button"
      disabled={busy}
      onClick={action.onClick}
      className={cn(
        "rounded-md px-2 py-1.5 text-sm/5 font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 pointer-coarse:py-2.5",
        colours.action
      )}
    >
      {action.label}
    </button>
  ));

  return (
    <div
      style={{ "--page-zoom": zoom } as CSSProperties}
      className="flex shrink-0 justify-center px-3 pb-3 md:order-first md:px-8 md:pt-3 md:pb-0"
    >
      <div
        role={alert ? "alert" : "status"}
        className={cn(
          "animate-in fade-in-0 flex w-full gap-3 rounded-lg p-4 ring-1 duration-200 ease-(--ease-out-strong) ring-inset md:w-[calc(210mm*var(--page-zoom))] md:max-w-full",
          colours.surface
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn("size-5 shrink-0", colours.iconColour)}
        />
        {title ? (
          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className={cn("text-sm/5 font-medium", colours.title)}>
                {title}
              </p>
              <p className={cn("text-sm/5 text-pretty", colours.text)}>
                {children}
              </p>
            </div>
            <div className="-my-1.5 -ml-2 flex flex-wrap gap-x-3 gap-y-1">
              {buttons}
            </div>
          </div>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col items-start gap-2 md:flex-row md:justify-between md:gap-6">
            <p className={cn("text-sm/5 text-pretty", colours.text)}>
              {children}
            </p>
            <div className="-my-1.5 -ml-2 flex shrink-0 gap-x-3 md:-mr-2 md:ml-0">
              {buttons}
            </div>
          </div>
        )}
        {onDismiss && (
          <button
            type="button"
            aria-label="Dismiss"
            onClick={onDismiss}
            className={cn(
              "relative -m-1.5 flex size-8 shrink-0 items-center justify-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2",
              colours.action
            )}
          >
            <IconX aria-hidden="true" className="size-5" />
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
            />
          </button>
        )}
      </div>
    </div>
  );
}
