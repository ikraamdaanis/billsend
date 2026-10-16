import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CustomCurrencyDialog } from "~/components/dialogs/custom-currency-dialog";
import { RenameInvoiceDialog } from "~/components/dialogs/rename-invoice-dialog";
import { EditorThemeToggle } from "~/components/editor/editor-theme-toggle";
import { InvoiceCanvas } from "~/components/editor/invoice-canvas";
import { InvoiceClientDetails } from "~/components/editor/invoice-client-details";
import { InvoiceDetails } from "~/components/editor/invoice-details";
import { InvoiceFileMenu } from "~/components/editor/invoice-file-menu";
import {
  InvoiceFontFamilyMenu,
  InvoiceFontWeightMenu
} from "~/components/editor/invoice-font-picker";
import { InvoiceFooterSections } from "~/components/editor/invoice-footer-sections";
import { InvoiceImage } from "~/components/editor/invoice-image";
import { InvoiceLineItems } from "~/components/editor/invoice-line-items";
import { InvoicePaymentDetails } from "~/components/editor/invoice-payment-details";
import { InvoicePricing } from "~/components/editor/invoice-pricing";
import { InvoiceSellerDetails } from "~/components/editor/invoice-seller-details";
import { InvoiceShipping } from "~/components/editor/invoice-shipping";
import { InvoiceTitle } from "~/components/editor/invoice-title";
import { DownloadInvoice } from "~/components/pdf/download-invoice";
import { Button, buttonVariants } from "~/components/ui/button";
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
import {
  currencyOptions,
  getCurrencyCodeForSymbol,
  getCurrencyMarker,
  normalizeCurrency
} from "~/consts/currencies";
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
        <main
          className="bg-desk relative flex w-full flex-col"
          style={{
            height: `calc(100dvh - ${TOOLBAR_HEIGHT}px)`
          }}
        >
          <CanvasArea />
          <ZoomControl />
        </main>
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
    <header
      className="bg-background border-border sticky top-0 z-50 flex w-full items-center gap-1 border-b px-3"
      style={{ height: `${TOOLBAR_HEIGHT}px` }}
    >
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        aria-label="Back to homepage"
        className="rounded-surface focus-visible:ring-ring shrink-0 outline-none focus-visible:ring-2"
      >
        <img
          src="/favicon.svg"
          alt=""
          className="rounded-surface size-9 pointer-coarse:size-11"
        />
      </button>
      <div className="flex min-w-0 flex-col justify-center">
        <h1 className="flex min-w-0 self-start">
          <button
            type="button"
            onClick={toolbar.handleTitleClick}
            className="hover:bg-accent rounded-surface focus-visible:ring-ring flex h-6 min-w-0 items-center px-2 py-0 outline-none focus-visible:ring-1 pointer-coarse:h-8"
          >
            <span className="text-foreground truncate text-base font-medium">
              {toolbar.displayName}
            </span>
          </button>
        </h1>
        <Menubar className="h-6 pointer-coarse:h-8">
          <InvoiceFileMenu
            saveDialogOpen={toolbar.saveDialogOpen}
            onSaveDialogOpenChange={toolbar.setSaveDialogOpen}
          />
          <EditMenu />
          <ViewMenu />
        </Menubar>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <DownloadInvoice
          variant="primary"
          className="pointer-coarse:h-11 pointer-coarse:px-4"
        />
      </div>
      <RenameInvoiceDialog
        open={toolbar.renameDialogOpen}
        onOpenChange={toolbar.setRenameDialogOpen}
        currentName={toolbar.displayName}
        onRename={toolbar.handleRename}
      />
    </header>
  );
}

function EditMenu() {
  const { currency, currencyCode, setCurrency, setCurrencyCode } =
    useCurrencySlice();
  const { theme, setTheme } = useThemeSlice();
  const [customOpen, setCustomOpen] = useState(false);
  const selected = normalizeCurrency(currency);
  const isCustom = !currencyOptions.some(option => option.symbol === selected);

  // Selecting a preset stores its symbol and its default ISO code together, so a
  // bare "$" still carries an explicit code the user can override.
  function handlePresetSelect(symbol: string) {
    setCurrency(symbol);
    setCurrencyCode(getCurrencyCodeForSymbol(symbol));
  }

  function handleCustomSubmit(symbol: string, code: string) {
    setCurrency(symbol);
    setCurrencyCode(code);
  }

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>Currency</MenubarSubTrigger>
            <MenubarSubContent className="w-auto">
              <MenubarRadioGroup
                value={selected}
                onValueChange={handlePresetSelect}
              >
                {currencyOptions.map(({ symbol, code, label }) => (
                  <MenubarRadioItem key={symbol} value={symbol}>
                    <span className="w-8 shrink-0">
                      {getCurrencyMarker(symbol)}
                    </span>
                    <span className="text-muted-foreground">{label}</span>
                    <span className="text-muted-foreground ml-auto pl-3 text-xs">
                      {code}
                    </span>
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
        currentCode={isCustom ? currencyCode : ""}
        onSubmit={handleCustomSubmit}
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

function ZoomControl() {
  const { view, setView, zoom } = useCanvasView();
  const zoomSteps = ZOOM_LEVELS.map(level => Number(level.value));
  // Step from the applied zoom, so leaving Fit lands on the nearest preset.
  const zoomOutStep = zoomSteps.filter(step => step < zoom - 0.001).at(-1);
  const zoomInStep = zoomSteps.find(step => step > zoom + 0.001);
  const zoomPercent = `${Math.round(zoom * 100)}%`;
  const isFit = view === "fit";

  return (
    <div
      role="group"
      aria-label="Zoom"
      className="bg-background border-border rounded-control shadow-menu absolute right-3 bottom-3 z-10 flex items-center border p-0.5"
    >
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom out"
        disabled={zoomOutStep === undefined}
        onClick={() => {
          if (zoomOutStep !== undefined) setView(zoomOutStep);
        }}
        className="pointer-coarse:size-11"
      >
        <IconMinus aria-hidden="true" />
      </Button>
      <Button
        variant="ghost"
        aria-label={
          isFit
            ? `${zoomPercent}, fitted to screen`
            : `${zoomPercent}, fit to screen`
        }
        aria-pressed={isFit}
        onClick={() => setView(isFit ? 1 : "fit")}
        className="min-w-14 px-1.5 tabular-nums pointer-coarse:h-11"
      >
        {zoomPercent}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Zoom in"
        disabled={zoomInStep === undefined}
        onClick={() => {
          if (zoomInStep !== undefined) setView(zoomInStep);
        }}
        className="pointer-coarse:size-11"
      >
        <IconPlus aria-hidden="true" />
      </Button>
      <span aria-hidden="true" className="bg-border mx-0.5 h-5 w-px" />
      <EditorThemeToggle className="pointer-coarse:size-11" />
    </div>
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
      <div className="mt-6">
        <InvoicePaymentDetails />
      </div>
      <InvoiceFooterSections />
    </>
  );
}
