import { Link } from "@tanstack/react-router";
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
import { DownloadInvoice } from "features/new/components/download-invoice";
import { InvoiceCanvas } from "features/new/components/invoice-canvas";
import { InvoiceClientDetails } from "features/new/components/invoice-client-details";
import { InvoiceDetails } from "features/new/components/invoice-details";
import { InvoiceFileMenu } from "features/new/components/invoice-file-menu";
import { InvoiceImage } from "features/new/components/invoice-image";
import { InvoiceLineItems } from "features/new/components/invoice-line-items";
import { InvoicePricing } from "features/new/components/invoice-pricing";
import { InvoiceSellerDetails } from "features/new/components/invoice-seller-details";
import { InvoiceTerms } from "features/new/components/invoice-terms";
import { InvoiceTitle } from "features/new/components/invoice-title";
import {
  activeSettingsAtom,
  SettingsPanel
} from "features/new/components/settings-panel";
import { currentInvoiceDocumentNameAtom } from "features/new/state";
import { useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon } from "lucide-react";
import { memo, useState } from "react";

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
      <LeavePageDialog isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}

function Toolbar({
  setIsModalOpen
}: {
  setIsModalOpen: (open: boolean) => void;
}) {
  const currentDocumentName = useAtomValue(currentInvoiceDocumentNameAtom);
  const displayName = currentDocumentName || "Untitled invoice";

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
        <h2 className="text-foreground text-sm font-medium">
          {displayName}
        </h2>
      </div>
      <div className="ml-auto">
        <DownloadInvoice />
      </div>
    </nav>
  );
}

function CanvasArea() {
  const setActiveSettings = useSetAtom(activeSettingsAtom);

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
  const activeSettings = useAtomValue(activeSettingsAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

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
          Are you sure you want to leave this page and go back to the home
          page?
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

const Top = memo(function Top() {
  return (
    <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row">
      <div className="flex w-full flex-col gap-4">
        <InvoiceTitle />
        <InvoiceSellerDetails />
      </div>
      <InvoiceImage />
    </div>
  );
});

const Mid = memo(function Mid() {
  return (
    <>
      <div className="mt-2 grid gap-8 sm:grid-cols-2">
        <InvoiceClientDetails />
        <InvoiceDetails />
      </div>
    </>
  );
});

const Bottom = memo(function Bottom() {
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
});
