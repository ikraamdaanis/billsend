import { Link } from "@tanstack/react-router";
import { DownloadInvoice } from "components/download-invoice";
import { InvoiceCanvas } from "components/invoice-canvas";
import { InvoiceClientDetails } from "components/invoice-client-details";
import { InvoiceDetails } from "components/invoice-details";
import { InvoiceFileMenu } from "components/invoice-file-menu";
import { RenameInvoiceDialog } from "components/rename-invoice-dialog";
import { InvoiceImage } from "components/invoice-image";
import { InvoiceLineItems } from "components/invoice-line-items";
import { InvoicePricing } from "components/invoice-pricing";
import { InvoiceSellerDetails } from "components/invoice-seller-details";
import { InvoiceTerms } from "components/invoice-terms";
import { InvoiceTitle } from "components/invoice-title";
import { SettingsPanel } from "components/settings-panel";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger
} from "components/ui/drawer";
import { useInvoiceDocument } from "context/invoice-document-context";
import { useUI } from "context/ui-context";
import { getInvoice, saveInvoice } from "db";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TOOLBAR_HEIGHT = 50;

export function InvoiceEditor() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="h-dvh w-full">
        <Toolbar setIsModalOpen={setIsModalOpen} />
        <div
          className="relative flex w-full grid-cols-[1fr_260px] flex-col bg-zinc-200 lg:grid"
          style={{
            height: `calc(100dvh - ${TOOLBAR_HEIGHT}px)`
          }}
        >
          <CanvasArea />
          <SettingsArea />
        </div>
      </div>
      <MobileSettingsDrawer />
      <LeavePageDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}

function Toolbar({
  setIsModalOpen
}: {
  setIsModalOpen: (open: boolean) => void;
}) {
  const { currentDocumentId, currentDocumentName, setCurrentDocumentName } =
    useInvoiceDocument();
  const displayName = currentDocumentName || "Untitled invoice";
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);

  async function handleRename(newName: string) {
    const trimmedName = newName.trim();

    if (currentDocumentId) {
      const existingDoc = await getInvoice(currentDocumentId);
      if (!existingDoc) {
        throw new Error("Invoice document not found");
      }
      await saveInvoice({
        ...existingDoc,
        name: trimmedName,
        updatedAt: new Date()
      });
    }

    setCurrentDocumentName(trimmedName);
    toast.success("Invoice renamed successfully");
  }

  return (
    <nav
      className="bg-background border-border sticky top-0 z-50 flex w-full items-center justify-between border-b px-4"
      style={{ height: `${TOOLBAR_HEIGHT}px` }}
    >
      <div className="flex items-center gap-4">
        <Button
          variant="unstyled"
          size="unstyled"
          onClick={() => setIsModalOpen(true)}
        >
          <h1 className="font-bricolage-grotesque text-brand-500 text-lg font-bold">
            billsend
          </h1>
        </Button>
        <InvoiceFileMenu />
      </div>
      <div className="absolute left-1/2 -translate-x-1/2">
        <button
          type="button"
          onClick={() => setRenameDialogOpen(true)}
          className="hover:bg-accent cursor-pointer rounded-md px-2 py-1 transition-colors"
        >
          <h2 className="text-foreground text-sm font-medium">
            {displayName}
          </h2>
        </button>
      </div>
      <div className="ml-auto">
        <DownloadInvoice />
      </div>
      <RenameInvoiceDialog
        open={renameDialogOpen}
        onOpenChange={setRenameDialogOpen}
        currentName={displayName}
        onRename={handleRename}
      />
    </nav>
  );
}

function CanvasArea() {
  const { setActiveSettings } = useUI();

  function handleSectionClick() {
    setActiveSettings("main");
  }

  return (
    <InvoiceCanvas onSectionClick={handleSectionClick}>
      <Top />
      <Mid />
      <Bottom />
    </InvoiceCanvas>
  );
}

function SettingsArea() {
  return (
    <>
      <SettingsToggleButton />
      <section className="bg-background border-border relative z-20 hidden h-full overflow-y-auto border-l pb-4 lg:block">
        <SettingsPanel />
      </section>
    </>
  );
}

function SettingsToggleButton() {
  const { activeSettings, setActiveSettings } = useUI();

  if (activeSettings === "main") {
    return null;
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="fixed top-18 right-[264px] z-30 hidden size-8 w-fit min-w-8 lg:flex"
      onClick={() => setActiveSettings("main")}
    >
      <ArrowLeftIcon className="size-4" />
    </Button>
  );
}

function MobileSettingsDrawer() {
  return (
    <div className="bg-background border-border fixed bottom-0 flex h-10 w-full items-center justify-center border-t lg:hidden">
      <Drawer>
        <DrawerTrigger className="h-full w-full cursor-pointer">
          Open Settings
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle className="sr-only">Settings</DrawerTitle>
          <SettingsPanel />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function LeavePageDialog({
  isModalOpen,
  setIsModalOpen
}: {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="w-md">
        <DialogTitle>Leave this page?</DialogTitle>
        <DialogDescription>
          Are you sure you want to leave this page and go back to the home page?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Link to="/">
            <Button>Leave</Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Top() {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
      <div className="flex w-full flex-col gap-4">
        <InvoiceTitle />
        <InvoiceSellerDetails />
      </div>
      <InvoiceImage />
    </div>
  );
}

function Mid() {
  return (
    <>
      <div className="mt-2 grid gap-8 sm:grid-cols-2">
        <InvoiceClientDetails />
        <InvoiceDetails />
      </div>
    </>
  );
}

function Bottom() {
  return (
    <>
      <div className="mt-6 max-w-full">
        <InvoiceLineItems />
        <InvoicePricing />
      </div>
      <div className="mt-6">
        <InvoiceTerms />
      </div>
    </>
  );
}
