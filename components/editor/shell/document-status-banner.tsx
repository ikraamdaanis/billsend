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
      size="xs"
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
          <Button size="xs" onClick={() => window.location.reload()}>
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
          <Button size="xs" disabled={busy} onClick={() => void act(takeOver)}>
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
              size="xs"
              disabled={busy}
              onClick={() => void act(keepDeletedCopy)}
            >
              Keep a copy
            </Button>
            <Button
              variant="outline"
              size="xs"
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
              size="xs"
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
            size="xs"
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

// A strip under the top bar. On a phone the words take the full width and
// the actions sit below them; from `sm` they share one row. The icon lines up
// with the first line of text.
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
    <div
      role={alert ? "alert" : "status"}
      className={cn(
        "border-border flex shrink-0 items-start gap-3 border-b py-2.5 pr-[max(0.75rem,env(safe-area-inset-right))] pl-[max(0.75rem,env(safe-area-inset-left))] sm:py-2",
        tone === "error" && "bg-destructive/8",
        tone === "warning" && "bg-warning/12",
        tone === "info" && "bg-muted"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex h-6 shrink-0 items-center sm:h-5 [&_svg]:size-4",
          tone === "error" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {icon}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-2">
        <p className="text-foreground min-w-0 flex-1 basis-64 text-base/6 text-pretty sm:text-[0.8125rem]/5">
          {children}
        </p>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="text-muted-foreground relative -mr-1 shrink-0"
        >
          <IconX aria-hidden="true" />
          <span
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
          />
        </Button>
      )}
    </div>
  );
}
