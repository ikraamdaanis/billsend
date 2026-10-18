import { useEffect } from "react";
import { DesignControls } from "~/components/design/design-controls";
import { DESIGN_FRAME_SETUPS } from "~/components/design/design-frame-setups";
import { createDesignSampleInvoice } from "~/components/design/design-sample-invoice";
import { InvoiceEditor } from "~/components/editor/invoice-editor";
import { InvoiceDocumentProvider } from "~/context/invoice-document-context";
import { countInvoices } from "~/db";
import { useApplyEditorTheme } from "~/hooks/use-editor-theme";
import { getDesignSandbox } from "~/lib/design-sandbox";
import { runWithOrigin } from "~/stores/change-origin";
import { useDocumentStore } from "~/stores/document-store";
import { useInvoiceStore } from "~/stores/invoice-store";
import type { DesignBlock } from "~/types";
import { seedDummyInvoice } from "~/utils/seed-dummy-invoice";

const LIBRARY_SIZE = 8;

// Strict Mode runs effects twice in development; a block's setup opens menus
// and dialogs, so it must only run once per frame.
let setupStarted = false;

// One block of the design catalogue, inside its sandboxed frame. Without the
// sandbox (someone opening /design/frame outside the catalogue's head
// script) it shows nothing, since the editor would edit the real library.
export function DesignFrame({ block }: { block: DesignBlock }) {
  useApplyEditorTheme();

  if (!getDesignSandbox()) {
    return (
      <p className="text-muted-foreground p-6 text-sm">
        This page only works inside the design catalogue.
      </p>
    );
  }

  if (block.kind === "controls") {
    return (
      <>
        <DesignControls />
        <MarkReady />
      </>
    );
  }

  return (
    <InvoiceDocumentProvider>
      <InvoiceEditor />
      <BlockSetup block={block} />
    </InvoiceDocumentProvider>
  );
}

// Tells the catalogue's tests the frame shows its state.
function markReady() {
  document.documentElement.dataset.designReady = "";
}

function MarkReady() {
  useEffect(markReady, []);

  return null;
}

function BlockSetup({ block }: { block: DesignBlock }) {
  useEffect(() => {
    if (setupStarted) return;

    setupStarted = true;
    void runBlockSetup(block);
  }, [block]);

  return null;
}

async function runBlockSetup(block: DesignBlock) {
  if (!block.emptyLibrary) await seedLibrary();
  await waitForOpenInvoice();
  runWithOrigin("load", () =>
    useInvoiceStore.getState().setInvoice(createDesignSampleInvoice())
  );
  // Let the editor render the sample before the setup reaches into it. Not
  // a frame callback: those pause while the frame is offscreen.
  await new Promise(resolve => setTimeout(resolve, 100));
  await DESIGN_FRAME_SETUPS[block.id]?.();
  markReady();
}

// Every frame shares the catalogue's library, so the first one fills it and
// the rest find it full.
async function seedLibrary() {
  await navigator.locks.request("billsend-design-seed", async () => {
    const count = await countInvoices();

    for (let index = count; index < LIBRARY_SIZE; index++) {
      await seedDummyInvoice();
    }
  });
}

async function waitForOpenInvoice() {
  if (useDocumentStore.getState().documentId) return;

  await new Promise<void>(resolve => {
    const unsubscribe = useDocumentStore.subscribe(state => {
      if (!state.documentId) return;

      unsubscribe();
      resolve();
    });
  });
}
