import {
  IconAlertTriangle,
  IconEye,
  IconInfoCircle,
  IconRefresh,
  IconTrash,
  IconX
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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

  const backupButton = (
    <Button
      variant="outline"
      size="sm"
      disabled={busy}
      onClick={() => void act(downloadBackup)}
    >
      Download backup
    </Button>
  );

  if (status === "reloadRequired") {
    return (
      <Banner
        tone="warning"
        icon={<IconRefresh />}
        actions={
          <Button size="sm" onClick={() => window.location.reload()}>
            Reload
          </Button>
        }
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
        icon={<IconAlertTriangle />}
        actions={backupButton}
      >
        This browser isn’t letting billsend store anything, so this invoice
        can’t be saved. Download a backup to keep it.
      </Banner>
    );
  }

  if (status === "readOnly") {
    return (
      <Banner
        tone="info"
        icon={<IconEye />}
        actions={
          <Button size="sm" disabled={busy} onClick={() => void act(takeOver)}>
            Edit here
          </Button>
        }
      >
        This invoice is open in another tab. Changes made there show here.
      </Banner>
    );
  }

  if (status === "deleted") {
    return (
      <Banner
        tone="warning"
        icon={<IconTrash />}
        actions={
          <>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => void act(keepDeletedCopy)}
            >
              Keep a copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={newInvoice}
            >
              New invoice
            </Button>
          </>
        }
      >
        This invoice was deleted in another tab, so changes here aren’t saved.
      </Banner>
    );
  }

  if (saveFailure) {
    return (
      <Banner
        key={saveFailure.episode}
        tone="error"
        icon={<IconAlertTriangle />}
        alert
        actions={
          <>
            <Button
              size="sm"
              disabled={busy}
              onClick={() => void act(retrySave)}
            >
              Retry
            </Button>
            {backupButton}
          </>
        }
      >
        {saveFailure.message}
      </Banner>
    );
  }

  if (backupReminder) {
    return (
      <Banner
        tone="info"
        icon={<IconInfoCircle />}
        onDismiss={dismissBackupReminder}
        actions={
          <Button
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() =>
              void act(async () => {
                await downloadBackup();
                dismissBackupReminder();
              })
            }
          >
            Download backup
          </Button>
        }
      >
        Safari clears sites left unopened for a week. Keep a backup of your
        invoices.
      </Banner>
    );
  }

  return null;
}

// A card floating over the canvas on the canvas pill's surface, so it says its
// piece without pushing the page down or tinting the chrome; the icon carries
// the tone. Wide screens show it at the top, on one line where the words fit.
// Phones show it above the tab bar, where the page is emptiest and the
// actions are in reach of a thumb, with the actions under the words.
function Banner({
  tone,
  icon,
  alert = false,
  actions,
  onDismiss,
  children
}: {
  tone: "info" | "warning" | "error";
  icon: ReactNode;
  alert?: boolean;
  actions: ReactNode;
  onDismiss?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 z-20 flex justify-center px-3 max-md:top-auto max-md:bottom-3">
      <div
        role={alert ? "alert" : "status"}
        className="bg-popover text-popover-foreground ring-foreground/10 shadow-menu animate-in fade-in-0 slide-in-from-top-1 max-md:slide-in-from-bottom-1 pointer-events-auto flex w-full max-w-3xl items-start gap-2.5 rounded-xl py-2 pr-2 pl-3 ring-1 duration-200 motion-reduce:animate-none sm:w-auto"
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex h-5 shrink-0 items-center sm:h-7 [&_svg]:size-4",
            tone === "error" && "text-destructive",
            tone === "warning" && "text-warning",
            tone === "info" && "text-muted-foreground"
          )}
        >
          {icon}
        </span>
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-3 gap-y-2">
          <p className="min-w-0 flex-1 basis-56 text-sm/5 text-pretty sm:basis-auto sm:text-[13px]/5">
            {children}
          </p>
          <div className="flex shrink-0 items-center gap-1.5 pointer-coarse:*:h-9">
            {actions}
          </div>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon-xs"
            aria-label="Dismiss"
            onClick={onDismiss}
            className="text-muted-foreground relative -mt-0.5 shrink-0 sm:mt-0.5 pointer-coarse:size-9"
          >
            <IconX aria-hidden="true" />
          </Button>
        )}
      </div>
    </div>
  );
}
