import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { InvoiceCanvas } from "~/components/editor/invoice-canvas";
import { InvoiceClientDetails } from "~/components/editor/invoice-client-details";
import { InvoiceDetails } from "~/components/editor/invoice-details";
import { InvoiceFooterSections } from "~/components/editor/invoice-footer-sections";
import { InvoiceImage } from "~/components/editor/invoice-image";
import { InvoiceLineItems } from "~/components/editor/invoice-line-items";
import { InvoicePaymentDetails } from "~/components/editor/invoice-payment-details";
import { InvoicePricing } from "~/components/editor/invoice-pricing";
import { InvoiceSellerDetails } from "~/components/editor/invoice-seller-details";
import { InvoiceShipping } from "~/components/editor/invoice-shipping";
import { InvoiceTitle } from "~/components/editor/invoice-title";
import { CanvasPill } from "~/components/editor/shell/canvas-pill";
import { EditorShortcuts } from "~/components/editor/shell/editor-shortcuts";
import { EditorTopBar } from "~/components/editor/shell/editor-top-bar";
import { InspectorPanel } from "~/components/editor/shell/inspector/inspector-panel";
import { InvoicesPanel } from "~/components/editor/shell/invoices-panel";
import { PanelToggle, SidePanel } from "~/components/editor/shell/side-panel";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import { CanvasViewProvider } from "~/context/canvas-view-context";
import { EditorUiProvider } from "~/context/editor-ui-context";
import { FileActionsProvider } from "~/context/file-actions-context";

export function InvoiceEditor() {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);

  return (
    <CanvasViewProvider>
      <EditorUiProvider>
        <FileActionsProvider>
          <EditorShortcuts />
          <div className="flex h-dvh w-full flex-col">
            <EditorTopBar
              onLeave={() => setIsLeaveDialogOpen(true)}
              start={<PanelToggle side="left" />}
              end={<PanelToggle side="right" />}
            />
            <div className="relative flex min-h-0 flex-1">
              <SidePanel side="left" label="Invoices">
                <InvoicesPanel />
              </SidePanel>
              <main className="bg-desk relative flex min-w-0 flex-1 flex-col">
                <CanvasArea />
                <CanvasPill />
              </main>
              <SidePanel side="right" label="Inspector">
                <InspectorPanel />
              </SidePanel>
            </div>
          </div>
          <LeavePageDialog
            isModalOpen={isLeaveDialogOpen}
            setIsModalOpen={setIsLeaveDialogOpen}
          />
        </FileActionsProvider>
      </EditorUiProvider>
    </CanvasViewProvider>
  );
}

function CanvasArea() {
  return (
    <InvoiceCanvas>
      <Top />
      <Mid />
      <Bottom />
    </InvoiceCanvas>
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
        <DialogHeader>
          <DialogTitle>Leave this page?</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave this page and go back to the home
            page?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Link to="/" className={buttonVariants({ variant: "destructive" })}>
            Leave
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Top() {
  return (
    <div className="flex flex-row items-start justify-between gap-4">
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
    <div className="mt-2 flex justify-between gap-8">
      <div className="flex flex-1 flex-col gap-4">
        <InvoiceClientDetails />
        <InvoiceShipping />
      </div>
      <div className="flex flex-1 flex-col items-start">
        <InvoiceDetails />
      </div>
    </div>
  );
}

function Bottom() {
  return (
    <>
      <div className="mt-6 max-w-full">
        <InvoiceLineItems />
        <InvoicePricing />
      </div>
      <InvoicePaymentDetails />
      <InvoiceFooterSections />
    </>
  );
}
