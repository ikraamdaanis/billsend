import {
  IconAlertTriangle,
  IconEye,
  IconRefresh,
  IconTrash
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
// per run of failures rather than on every retry.
export function DocumentStatusBanner() {
  const {
    status,
    saveFailure,
    retrySave,
    downloadBackup,
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
      <Banner tone="warning" icon={<IconRefresh />}>
        <BannerText>
          billsend was updated in another tab. Reload to keep editing; your
          latest changes come back with you.
        </BannerText>
        <Button size="xs" onClick={() => window.location.reload()}>
          Reload
        </Button>
      </Banner>
    );
  }

  if (status === "unavailable") {
    return (
      <Banner tone="warning" icon={<IconAlertTriangle />}>
        <BannerText>
          This browser isn’t letting billsend store anything, so this invoice
          can’t be saved. Download a backup to keep it.
        </BannerText>
        {backupButton}
      </Banner>
    );
  }

  if (status === "readOnly") {
    return (
      <Banner tone="info" icon={<IconEye />}>
        <BannerText>
          This invoice is open in another tab. Changes made there show here.
        </BannerText>
        <Button size="xs" disabled={busy} onClick={() => void act(takeOver)}>
          Edit here
        </Button>
      </Banner>
    );
  }

  if (status === "deleted") {
    return (
      <Banner tone="warning" icon={<IconTrash />}>
        <BannerText>
          This invoice was deleted in another tab, so changes here aren’t saved.
        </BannerText>
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
      >
        <BannerText>{saveFailure.message}</BannerText>
        <Button size="xs" disabled={busy} onClick={() => void act(retrySave)}>
          Retry
        </Button>
        {backupButton}
      </Banner>
    );
  }

  return null;
}

function Banner({
  tone,
  icon,
  alert = false,
  children
}: {
  tone: "info" | "warning" | "error";
  icon: ReactNode;
  alert?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      role={alert ? "alert" : "status"}
      className={cn(
        "border-border flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b px-[max(0.75rem,env(safe-area-inset-left))] py-2 text-[13px]",
        tone === "error" && "bg-destructive/8",
        tone === "warning" && "bg-warning/12",
        tone === "info" && "bg-muted"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex shrink-0 [&_svg]:size-4",
          tone === "error" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {icon}
      </span>
      {children}
    </div>
  );
}

function BannerText({ children }: { children: ReactNode }) {
  return (
    <p className="text-foreground min-w-0 flex-1 basis-60 text-pretty">
      {children}
    </p>
  );
}
