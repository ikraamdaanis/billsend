import {
  IconCurrencyDollar,
  IconDeviceFloppy,
  IconDownload,
  IconEye,
  IconFile,
  IconFilePlus,
  IconFolderOpen,
  IconLayoutSidebar,
  IconLayoutSidebarRight,
  IconMoon,
  IconSun,
  IconTypography,
  IconUpload,
  IconZoomScan
} from "@tabler/icons-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut
} from "~/components/ui/command";
import {
  currencyOptions,
  getCurrencyCodeForSymbol,
  getCurrencyMarker,
  normalizeCurrency
} from "~/consts/currencies";
import { INVOICE_FONTS } from "~/consts/invoice-fonts";
import { useCanvasView } from "~/context/canvas-view-context";
import { useEditorUi } from "~/context/editor-ui-context";
import { useFileActions } from "~/context/file-actions-context";
import { useInvoiceDocument } from "~/context/invoice-document-context";
import { watchInvoices } from "~/db";
import { useEditorTheme } from "~/hooks/use-editor-theme";
import { useInvoicePdf } from "~/hooks/use-invoice-pdf";
import {
  useCurrencySlice,
  useSectionsSlice,
  useThemeSlice
} from "~/stores/invoice-selectors";
import type { InvoiceDocument, InvoiceSectionKey, InvoiceSize } from "~/types";
import { shortcutLabel } from "~/utils/shortcut-label";

const SECTION_LABELS: Record<InvoiceSectionKey, string> = {
  logo: "logo",
  poNumber: "PO number",
  servicePeriod: "service period",
  shipping: "shipping address",
  discounts: "discounts",
  tax: "tax",
  fees: "fees",
  amountPaid: "amount paid",
  paymentDetails: "payment details",
  notes: "notes",
  terms: "terms",
  latePayment: "late payment fee"
};

const SIZE_LABELS: Record<InvoiceSize, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large"
};

// ⌘K: every editor action, searchable, as in Framer and Linear. Running one
// closes the palette first, so a dialog it opens takes focus cleanly.
export function CommandPalette() {
  const { paletteOpen, setPaletteOpen } = useEditorUi();

  return (
    <CommandDialog
      open={paletteOpen}
      onOpenChange={setPaletteOpen}
      title="Quick actions"
      description="Search for an action to run"
      className="max-w-[min(36rem,calc(100vw-2rem))] sm:max-w-xl"
    >
      <Command loop className="rounded-xl! p-0">
        <CommandInput placeholder="Type a command or search" />
        {paletteOpen && <PaletteCommands />}
      </Command>
    </CommandDialog>
  );
}

function PaletteCommands() {
  const { setPaletteOpen, mode, toggleMode, leftPanelOpen, rightPanelOpen } =
    useEditorUi();
  const { togglePanel, toggleAllPanels } = useEditorUi();
  const actions = useFileActions();
  const { openPdf } = useInvoicePdf();
  const { setView } = useCanvasView();
  const { theme: editorTheme, toggleTheme } = useEditorTheme();
  const { theme, setTheme } = useThemeSlice();
  const { currency, setCurrency, setCurrencyCode } = useCurrencySlice();
  const { sections, setSection } = useSectionsSlice();
  const { currentDocumentId } = useInvoiceDocument();
  const [invoices, setInvoices] = useState<InvoiceDocument[]>([]);
  const selectedCurrency = normalizeCurrency(currency);

  useEffect(() => watchInvoices(setInvoices, () => setInvoices([])), []);

  function run(action: () => void) {
    return () => {
      setPaletteOpen(false);
      action();
    };
  }

  return (
    <CommandList className="max-h-[min(24rem,60vh)] p-1.5">
      <CommandEmpty>No actions match.</CommandEmpty>
      <CommandGroup heading="Invoice">
        <PaletteItem
          icon={<IconDownload />}
          onSelect={run(openPdf)}
          keywords={["pdf", "export", "print"]}
        >
          Download PDF
        </PaletteItem>
        <PaletteItem icon={<IconFilePlus />} onSelect={run(actions.newInvoice)}>
          New invoice
        </PaletteItem>
        <PaletteItem
          icon={<IconFolderOpen />}
          onSelect={run(actions.showOpenInvoice)}
          shortcut="⌘O"
        >
          Open invoice…
        </PaletteItem>
        <PaletteItem
          icon={<IconDeviceFloppy />}
          onSelect={run(actions.save)}
          shortcut="⌘S"
        >
          Save
        </PaletteItem>
        <PaletteItem
          icon={<IconFile />}
          onSelect={run(actions.saveAs)}
          shortcut="⇧⌘S"
        >
          Save as…
        </PaletteItem>
        <PaletteItem
          icon={<IconFile />}
          onSelect={run(actions.showOpenTemplate)}
        >
          Open template…
        </PaletteItem>
        <PaletteItem
          icon={<IconDeviceFloppy />}
          onSelect={run(actions.saveAsTemplate)}
        >
          Save as template…
        </PaletteItem>
        <PaletteItem
          icon={<IconDownload />}
          onSelect={run(actions.exportData)}
          keywords={["backup", "json"]}
        >
          Export data
        </PaletteItem>
        <PaletteItem
          icon={<IconUpload />}
          onSelect={run(actions.importData)}
          keywords={["restore", "json"]}
        >
          Import data…
        </PaletteItem>
      </CommandGroup>
      <CommandGroup heading="View">
        <PaletteItem icon={<IconEye />} onSelect={run(toggleMode)} shortcut="P">
          {mode === "preview" ? "Back to editing" : "Preview the PDF"}
        </PaletteItem>
        <PaletteItem
          icon={<IconZoomScan />}
          onSelect={run(() => setView("fit"))}
          shortcut="⇧1"
        >
          Zoom to fit
        </PaletteItem>
        <PaletteItem
          icon={<IconZoomScan />}
          onSelect={run(() => setView(1))}
          shortcut="⇧0"
        >
          Zoom to 100%
        </PaletteItem>
        <PaletteItem
          icon={<IconLayoutSidebar />}
          onSelect={run(() => togglePanel("left"))}
        >
          {leftPanelOpen ? "Hide invoices panel" : "Show invoices panel"}
        </PaletteItem>
        <PaletteItem
          icon={<IconLayoutSidebarRight />}
          onSelect={run(() => togglePanel("right"))}
        >
          {rightPanelOpen ? "Hide inspector" : "Show inspector"}
        </PaletteItem>
        <PaletteItem
          icon={<IconLayoutSidebar />}
          onSelect={run(toggleAllPanels)}
          shortcut="⌘\"
        >
          {leftPanelOpen || rightPanelOpen ? "Hide panels" : "Show panels"}
        </PaletteItem>
        <PaletteItem
          icon={editorTheme === "dark" ? <IconSun /> : <IconMoon />}
          onSelect={run(toggleTheme)}
          keywords={["theme", "appearance"]}
        >
          {editorTheme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"}
        </PaletteItem>
      </CommandGroup>
      <CommandGroup heading="Sections">
        {(Object.keys(SECTION_LABELS) as InvoiceSectionKey[]).map(section => (
          <PaletteItem
            key={section}
            onSelect={run(() => setSection(section, !sections[section]))}
          >
            {`${sections[section] ? "Hide" : "Show"} ${SECTION_LABELS[section]}`}
          </PaletteItem>
        ))}
      </CommandGroup>
      <CommandGroup heading="Font">
        {INVOICE_FONTS.map(font => (
          <PaletteItem
            key={font.id}
            icon={<IconTypography />}
            checked={theme.font === font.id}
            onSelect={run(() =>
              setTheme(previous => ({
                ...previous,
                font: font.id,
                fontWeight: font.weights.includes(previous.fontWeight)
                  ? previous.fontWeight
                  : "Normal"
              }))
            )}
          >
            {`Font: ${font.name}`}
          </PaletteItem>
        ))}
        {(Object.keys(SIZE_LABELS) as InvoiceSize[]).map(size => (
          <PaletteItem
            key={size}
            icon={<IconTypography />}
            checked={theme.size === size}
            onSelect={run(() => setTheme(previous => ({ ...previous, size })))}
          >
            {`Text size: ${SIZE_LABELS[size]}`}
          </PaletteItem>
        ))}
      </CommandGroup>
      <CommandGroup heading="Currency">
        {currencyOptions.map(option => (
          <PaletteItem
            key={option.symbol}
            icon={<IconCurrencyDollar />}
            checked={selectedCurrency === option.symbol}
            onSelect={run(() => {
              setCurrency(option.symbol);
              setCurrencyCode(getCurrencyCodeForSymbol(option.symbol));
            })}
          >
            {`Currency: ${getCurrencyMarker(option.symbol)} ${option.label} (${option.code})`}
          </PaletteItem>
        ))}
      </CommandGroup>
      {invoices.length > 0 && (
        <CommandGroup heading="Saved invoices">
          {invoices
            .filter(document => document.id !== currentDocumentId)
            .map(document => (
              <PaletteItem
                key={document.id}
                icon={<IconFolderOpen />}
                onSelect={run(() => actions.openInvoice(document.id))}
              >
                {`Open ${document.name}`}
              </PaletteItem>
            ))}
        </CommandGroup>
      )}
    </CommandList>
  );
}

function PaletteItem({
  icon,
  shortcut,
  checked = false,
  keywords,
  onSelect,
  children
}: {
  icon?: ReactNode;
  shortcut?: string;
  checked?: boolean;
  keywords?: string[];
  onSelect: () => void;
  children: string;
}) {
  return (
    <CommandItem
      value={children}
      keywords={keywords}
      onSelect={onSelect}
      data-checked={checked}
      className="h-9 gap-2.5 px-2.5 text-[13px]"
    >
      {icon && (
        <span aria-hidden="true" className="flex opacity-70">
          {icon}
        </span>
      )}
      <span className="truncate">{children}</span>
      {shortcut && <CommandShortcut>{shortcutLabel(shortcut)}</CommandShortcut>}
    </CommandItem>
  );
}
