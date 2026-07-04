import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CustomCurrencyDialog } from "~/components/dialogs/custom-currency-dialog";
import { RenameInvoiceDialog } from "~/components/dialogs/rename-invoice-dialog";
import { InvoiceCanvas } from "~/components/editor/invoice-canvas";
import { InvoiceClientDetails } from "~/components/editor/invoice-client-details";
import { InvoiceDetails } from "~/components/editor/invoice-details";
import { InvoiceFileMenu } from "~/components/editor/invoice-file-menu";
import {
  InvoiceFontFamilyMenu,
  InvoiceFontWeightMenu
} from "~/components/editor/invoice-font-picker";
import { InvoiceImage } from "~/components/editor/invoice-image";
import { InvoiceLineItems } from "~/components/editor/invoice-line-items";
import { InvoicePaymentDetails } from "~/components/editor/invoice-payment-details";
import { InvoicePricing } from "~/components/editor/invoice-pricing";
import { InvoiceSellerDetails } from "~/components/editor/invoice-seller-details";
import { InvoiceTerms } from "~/components/editor/invoice-terms";
import { InvoiceTitle } from "~/components/editor/invoice-title";
import { DownloadInvoice } from "~/components/pdf/download-invoice";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "~/components/ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger
} from "~/components/ui/menubar";
import { currencyOptions, normalizeCurrency } from "~/consts/currencies";
import {
  CanvasViewProvider,
  useCanvasView
} from "~/context/canvas-view-context";
import { useInvoiceDocument } from "~/context/invoice-document-context";
import { getInvoice, saveInvoice } from "~/db";
import { useCurrencySlice, useThemeSlice } from "~/stores/invoice-selectors";
import type { InvoiceSize } from "~/types";

const TOOLBAR_HEIGHT = 64;

const SIZES: { value: InvoiceSize; name: string; className: string }[] = [
  { value: "small", name: "Small", className: "text-xs" },
  { value: "medium", name: "Medium", className: "text-sm" },
  { value: "large", name: "Large", className: "text-base" }
];

const ZOOM_LEVELS: { value: string; name: string }[] = [
  { value: "0.5", name: "50%" },
  { value: "0.75", name: "75%" },
  { value: "0.9", name: "90%" },
  { value: "1", name: "100%" },
  { value: "1.2", name: "120%" },
  { value: "1.5", name: "150%" },
  { value: "1.75", name: "175%" },
  { value: "2", name: "200%" }
];

export function InvoiceEditor() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <CanvasViewProvider>
      <div className="h-dvh w-full">
        <Toolbar setIsModalOpen={setIsModalOpen} />
        <div
          className="relative flex w-full flex-col bg-zinc-200"
          style={{
            height: `calc(100dvh - ${TOOLBAR_HEIGHT}px)`
          }}
        >
          <CanvasArea />
        </div>
      </div>
      <LeavePageDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </CanvasViewProvider>
  );
}

function useToolbarController() {
  const { currentDocumentId, currentDocumentName, setCurrentDocumentName } =
    useInvoiceDocument();
  const displayName = currentDocumentName || "Untitled invoice";
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

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

  function handleTitleClick() {
    if (currentDocumentId) {
      setRenameDialogOpen(true);
    } else {
      setSaveDialogOpen(true);
    }
  }

  return {
    displayName,
    renameDialogOpen,
    setRenameDialogOpen,
    saveDialogOpen,
    setSaveDialogOpen,
    handleRename,
    handleTitleClick
  };
}

function Toolbar({
  setIsModalOpen
}: {
  setIsModalOpen: (open: boolean) => void;
}) {
  const toolbar = useToolbarController();

  return (
    <nav
      className="bg-background border-border sticky top-0 z-50 flex w-full items-center gap-1 border-b px-3"
      style={{ height: `${TOOLBAR_HEIGHT}px` }}
    >
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Homepage"
        className="shrink-0"
      >
        <img
          src="/favicon.svg"
          alt="billsend"
          className="rounded-surface size-9"
        />
      </button>
      <div className="flex min-w-0 flex-col justify-center">
        <button
          type="button"
          onClick={toolbar.handleTitleClick}
          className="hover:bg-accent rounded-surface flex h-6 items-center self-start px-2 py-0 transition-colors"
        >
          <h2 className="text-foreground truncate text-base font-medium">
            {toolbar.displayName}
          </h2>
        </button>
        <Menubar className="h-6">
          <InvoiceFileMenu
            saveDialogOpen={toolbar.saveDialogOpen}
            onSaveDialogOpenChange={toolbar.setSaveDialogOpen}
          />
          <EditMenu />
          <ViewMenu />
        </Menubar>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DownloadInvoice />
      </div>
      <RenameInvoiceDialog
        open={toolbar.renameDialogOpen}
        onOpenChange={toolbar.setRenameDialogOpen}
        currentName={toolbar.displayName}
        onRename={toolbar.handleRename}
      />
    </nav>
  );
}

function EditMenu() {
  const { currency, setCurrency } = useCurrencySlice();
  const { theme, setTheme } = useThemeSlice();
  const [customOpen, setCustomOpen] = useState(false);
  const selected = normalizeCurrency(currency);
  const isCustom = !currencyOptions.some(option => option.symbol === selected);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Currency</MenubarSubTrigger>
            <MenubarSubContent className="w-auto">
              <MenubarRadioGroup value={selected} onValueChange={setCurrency}>
                {currencyOptions.map(({ symbol, label }) => (
                  <MenubarRadioItem key={symbol} value={symbol}>
                    <span className="w-8 shrink-0">{symbol}</span>
                    <span className="text-muted-foreground">{label}</span>
                  </MenubarRadioItem>
                ))}
              </MenubarRadioGroup>
              <MenubarSeparator />
              <MenubarItem inset onClick={() => setCustomOpen(true)}>
                {isCustom ? `Custom (${selected})` : "Custom…"}
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <InvoiceFontFamilyMenu />
          <InvoiceFontWeightMenu />
          <MenubarSub>
            <MenubarSubTrigger>Size</MenubarSubTrigger>
            <MenubarSubContent className="w-auto">
              <MenubarRadioGroup
                value={theme.size}
                onValueChange={value =>
                  setTheme(prev => ({ ...prev, size: value as InvoiceSize }))
                }
              >
                {SIZES.map(size => (
                  <MenubarRadioItem key={size.value} value={size.value}>
                    <span className={size.className}>{size.name}</span>
                  </MenubarRadioItem>
                ))}
              </MenubarRadioGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>
      <CustomCurrencyDialog
        open={customOpen}
        onOpenChange={setCustomOpen}
        currentSymbol={selected}
        onSubmit={setCurrency}
      />
    </>
  );
}

function ViewMenu() {
  const { view, setView } = useCanvasView();
  const value = view === "fit" ? "fit" : String(view);

  return (
    <MenubarMenu>
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent className="w-auto">
        <MenubarRadioGroup
          value={value}
          onValueChange={next => setView(next === "fit" ? "fit" : Number(next))}
        >
          {ZOOM_LEVELS.map(option => (
            <MenubarRadioItem key={option.value} value={option.value}>
              {option.name}
            </MenubarRadioItem>
          ))}
          <MenubarSeparator />
          <MenubarRadioItem value="fit">Fit</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
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
          <Button variant="destructive" render={<Link to="/" />}>
            Leave
          </Button>
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
    <>
      <div className="mt-2 grid grid-cols-2 grid-rows-[auto_auto] gap-x-8 gap-y-1">
        <InvoiceClientDetails />
        <div className="col-start-2 row-start-2">
          <InvoiceDetails />
        </div>
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
        <InvoicePaymentDetails />
      </div>
      <div className="mt-6">
        <InvoiceTerms />
      </div>
    </>
  );
}
