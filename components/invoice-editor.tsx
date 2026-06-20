import { Link } from "@tanstack/react-router";
import { CustomCurrencyDialog } from "components/custom-currency-dialog";
import { DownloadInvoice } from "components/download-invoice";
import { InvoiceCanvas } from "components/invoice-canvas";
import { InvoiceClientDetails } from "components/invoice-client-details";
import { InvoiceDetails } from "components/invoice-details";
import { InvoiceFileMenu } from "components/invoice-file-menu";
import { InvoiceImage } from "components/invoice-image";
import { InvoiceLineItems } from "components/invoice-line-items";
import { InvoicePricing } from "components/invoice-pricing";
import { InvoiceSellerDetails } from "components/invoice-seller-details";
import { InvoiceTerms } from "components/invoice-terms";
import { InvoiceTitle } from "components/invoice-title";
import { RenameInvoiceDialog } from "components/rename-invoice-dialog";
import { Button } from "components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "components/ui/dialog";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger
} from "components/ui/menubar";
import { currencyOptions, normalizeCurrency } from "consts/currencies";
import { useInvoiceDocument } from "context/invoice-document-context";
import { getInvoice, saveInvoice } from "db";
import { useState } from "react";
import { toast } from "sonner";
import { useCurrencySlice, useThemeSlice } from "stores/invoice-selectors";
import type { InvoiceSize } from "types";

const TOOLBAR_HEIGHT = 64;

const SIZES: { value: InvoiceSize; name: string; className: string }[] = [
  { value: "small", name: "Small", className: "text-xs" },
  { value: "medium", name: "Medium", className: "text-sm" },
  { value: "large", name: "Large", className: "text-base" }
];

export function InvoiceEditor() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
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
    </>
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
          className="size-9 rounded-[3px]"
        />
      </button>
      <div className="flex min-w-0 flex-col justify-center">
        <button
          type="button"
          onClick={toolbar.handleTitleClick}
          className="hover:bg-accent flex h-6 items-center self-start rounded-[3px] px-2 py-0 transition-colors"
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
          <CurrencyMenu />
          <SizeMenu />
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

function CurrencyMenu() {
  const { currency, setCurrency } = useCurrencySlice();
  const [customOpen, setCustomOpen] = useState(false);
  const selected = normalizeCurrency(currency);
  const isCustom = !currencyOptions.some(option => option.symbol === selected);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>Currency</MenubarTrigger>
        <MenubarContent className="w-auto">
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

function SizeMenu() {
  const { theme, setTheme } = useThemeSlice();

  return (
    <MenubarMenu>
      <MenubarTrigger>Size</MenubarTrigger>
      <MenubarContent className="w-auto">
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
        <DialogTitle>Leave this page?</DialogTitle>
        <DialogDescription>
          Are you sure you want to leave this page and go back to the home page?
        </DialogDescription>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>
          <Link to="/">
            <Button variant="destructive">Leave</Button>
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
