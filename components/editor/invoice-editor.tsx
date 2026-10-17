import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
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
import { CommandPalette } from "~/components/editor/shell/command-palette";
import { EditorShortcuts } from "~/components/editor/shell/editor-shortcuts";
import { EditorTopBar } from "~/components/editor/shell/editor-top-bar";
import { InspectorPanel } from "~/components/editor/shell/inspector/inspector-panel";
import { InvoicesPanel } from "~/components/editor/shell/invoices-panel";
import { PhoneTabBar } from "~/components/editor/shell/phone-tab-bar";
import {
  PanelBackdrop,
  PanelToggle,
  SidePanel
} from "~/components/editor/shell/side-panel";
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
import { EditorUiProvider, useEditorUi } from "~/context/editor-ui-context";
import { FileActionsProvider } from "~/context/file-actions-context";
import { useDocumentStore } from "~/stores/document-store";
import { selectInvoiceData } from "~/stores/invoice-selectors";
import { useInvoiceStore } from "~/stores/invoice-store";
import { deriveHasUnsavedChanges } from "~/utils/derive-has-unsaved-changes";

export function InvoiceEditor() {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const navigate = useNavigate();

  // Leaving only asks when there is something unsaved; read at click time so
  // the whole editor doesn't re-render on every keystroke to know.
  function handleLeave() {
    const { documentId, lastSavedInvoice } = useDocumentStore.getState();
    const invoice = selectInvoiceData(useInvoiceStore.getState());

    if (deriveHasUnsavedChanges(invoice, documentId, lastSavedInvoice)) {
      setIsLeaveDialogOpen(true);
    } else {
      void navigate({ to: "/" });
    }
  }

  return (
    <CanvasViewProvider>
      <EditorUiProvider>
        <FileActionsProvider>
          <EditorShortcuts />
          <CommandPalette />
          <div className="flex h-dvh w-full flex-col">
            <EditorTopBar
              onLeave={handleLeave}
              start={<PanelToggle side="left" />}
              end={<PanelToggle side="right" />}
            />
            <div className="relative flex min-h-0 flex-1">
              <SidePanel side="left" label="Invoices">
                <InvoicesPanel />
              </SidePanel>
              <Desk>
                <CanvasArea />
                <CanvasPill />
              </Desk>
              <PanelBackdrop />
              <SidePanel side="right" label="Inspector">
                <InspectorPanel />
              </SidePanel>
            </div>
            <PhoneTabBar />
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

// The canvas between the panels. Behind a phone's panel sheet it is out of
// reach, so focus and screen readers stay in the sheet.
function Desk({ children }: { children: ReactNode }) {
  const { isNarrow, leftPanelOpen, rightPanelOpen } = useEditorUi();

  return (
    <main
      inert={isNarrow && (leftPanelOpen || rightPanelOpen)}
      className="bg-desk relative flex min-w-0 flex-1 flex-col"
    >
      {children}
    </main>
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
            This invoice has unsaved changes. They stay in this browser as a
            draft, so the editor picks up where you left off.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Link to="/" className={buttonVariants()}>
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
