import {
  IconBookmark,
  IconDeviceFloppy,
  IconDownload,
  IconFile,
  IconFilePlus,
  IconFolderOpen,
  IconMinus,
  IconPlus,
  IconUpload
} from "@tabler/icons-react";
import { addDays, endOfMonth, format, subMonths } from "date-fns";
import type {
  ComponentProps,
  ComponentType,
  CSSProperties,
  ReactNode
} from "react";
import { InvoiceInput } from "~/components/editor/invoice-input";
import { InvoiceTextArea } from "~/components/editor/invoice-textarea";
import { Button } from "~/components/ui/button";
import {
  formatCurrency,
  formatCurrencyWithCode,
  normalizeCurrency
} from "~/consts/currencies";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import { cn } from "~/lib/utils";
import type { InvoiceFont, InvoiceTheme, TextRole } from "~/types";
import { getRoleSettings } from "~/utils/get-role-settings";
import { getTextStyles } from "~/utils/get-text-styles";

// Static replicas of the editor for the homepage. They are built from the
// editor's own field components and role styles, rendered read-only, at the
// editor's native pixel size, then scaled down as a whole, so every preview is
// the real layout at a smaller scale rather than a drawing of it. Class names
// mirror components/editor/*; keep them in step when the editor changes.

// The A4 page in CSS pixels (210mm x 297mm), and the editor's toolbar height.
export const PAGE_WIDTH = 793.7;

export const PAGE_HEIGHT = 1122.5;

const TOOLBAR_HEIGHT = 64;

type SampleInvoice = {
  number: string;
  seller: string;
  logo: { monogram: string; color: string };
  clientName: string;
  clientAddress: string;
  items: {
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
  }[];
  discountPercentage: number;
  taxPercentage: number;
  payment: { bankName: string; accountNumber: string; bic: string };
  paymentInstructions: string;
  font: InvoiceFont;
  currencyCode: string;
};

// Each preview shows a different invoice, as a freelancer would fill it in.
// The PDF pictures elsewhere on the homepage use their own samples too.
export const HERO_SAMPLE: SampleInvoice = {
  number: "INV-0043",
  seller:
    "Maya Okafor Illustration\n214 Bergen Street\nBrooklyn, NY 11217\n(718) 555-0142",
  logo: { monogram: "MO", color: "#18181b" },
  clientName: "Harbor & Pine Co.",
  clientAddress: "1120 NW Couch Street, Suite 400\nPortland, OR 97209",
  items: [
    {
      description: "Editorial illustrations",
      quantity: 3,
      unit: "pcs",
      unitPrice: 600
    },
    { description: "Cover artwork", quantity: 1, unit: "pcs", unitPrice: 950 }
  ],
  discountPercentage: 10,
  taxPercentage: 0,
  payment: {
    bankName: "JPMorgan Chase Bank, N.A.",
    accountNumber: "483920175",
    bic: "CHASUS33"
  },
  paymentInstructions:
    "ACH routing number 021000021. Payment due within 30 days.",
  font: "geist",
  currencyCode: "USD"
};

export const TRY_IT_SAMPLE: SampleInvoice = {
  number: "RWS-0219",
  seller:
    "Reyes Web Studio\n1907 E 7th Street\nAustin, TX 78702\n(512) 555-0186",
  logo: { monogram: "RW", color: "#0f766e" },
  clientName: "Barton Creek Veterinary",
  clientAddress: "3801 S Lamar Boulevard, Suite 200\nAustin, TX 78704",
  items: [
    {
      description: "Website redesign",
      quantity: 1,
      unit: "ea",
      unitPrice: 4200
    },
    {
      description: "Online booking setup",
      quantity: 1,
      unit: "ea",
      unitPrice: 650
    },
    {
      description: "Hosting and maintenance",
      quantity: 3,
      unit: "mo",
      unitPrice: 85
    }
  ],
  discountPercentage: 0,
  taxPercentage: 0,
  payment: {
    bankName: "Wells Fargo Bank, N.A.",
    accountNumber: "7429183056",
    bic: "WFBIUS6S"
  },
  paymentInstructions: "ACH routing number 111900659. Net 15.",
  font: "geist",
  currencyCode: "USD"
};

export const FILL_SAMPLE: SampleInvoice = {
  number: "PR-1006",
  seller:
    "Priya Raman UX\n1550 N Damen Avenue, Unit 3\nChicago, IL 60622\n(312) 555-0131",
  logo: { monogram: "PR", color: "#7c2d12" },
  clientName: "Lakeview Dental Group",
  clientAddress: "2954 N Broadway\nChicago, IL 60657",
  items: [
    {
      description: "Patient portal UX audit",
      quantity: 1,
      unit: "ea",
      unitPrice: 3800
    },
    {
      description: "Usability test sessions",
      quantity: 8,
      unit: "ea",
      unitPrice: 225
    }
  ],
  discountPercentage: 0,
  taxPercentage: 0,
  payment: {
    bankName: "Citibank, N.A.",
    accountNumber: "40871236",
    bic: "CITIUS33"
  },
  paymentInstructions: "ACH routing number 271070801. Net 30.",
  font: "geist",
  currencyCode: "USD"
};

export const KEEP_SAMPLE: SampleInvoice = {
  number: "OMP-0118",
  seller:
    "Owen Marsh Photography\n3120 SE Division Street\nPortland, OR 97202\n(503) 555-0127",
  logo: { monogram: "OM", color: "#1e3a8a" },
  clientName: "Willamette Valley Vineyards Tours",
  clientAddress: "8800 SW Oleson Road\nPortland, OR 97223",
  items: [
    {
      description: "Harvest season photo shoot",
      quantity: 2,
      unit: "days",
      unitPrice: 1400
    },
    {
      description: "Edited images, web and print",
      quantity: 60,
      unit: "pcs",
      unitPrice: 15
    }
  ],
  discountPercentage: 0,
  taxPercentage: 0,
  payment: {
    bankName: "U.S. Bank",
    accountNumber: "153710294488",
    bic: "USBKUS44IMT"
  },
  paymentInstructions: "ACH routing number 123000220. Net 30.",
  font: "geist",
  currencyCode: "USD"
};

const LINE_ITEM_GRID = "grid grid-cols-[1fr_80px_80px_120px_150px]";

const FILE_MENU: (
  | { label: string; icon: ComponentType<{ className?: string }> }
  | "separator"
)[] = [
  { label: "New Invoice", icon: IconFilePlus },
  { label: "Open Invoice", icon: IconFolderOpen },
  "separator",
  { label: "Save", icon: IconDeviceFloppy },
  { label: "Save As...", icon: IconFile },
  "separator",
  { label: "Open Template", icon: IconBookmark },
  { label: "Save As Template", icon: IconDeviceFloppy },
  "separator",
  { label: "Export Data", icon: IconDownload },
  { label: "Import Data", icon: IconUpload }
];

// The editor's fields take a taller line height below `md`, and its controls
// grow on touch screens. The previews always show the desktop editor, so a
// crop lands on the same rows on every device: fields keep the `md` line
// height and controls their pointer sizes.
function Field({
  className,
  ...props
}: Omit<ComponentProps<typeof InvoiceInput>, "readOnly">) {
  return (
    <InvoiceInput
      {...props}
      readOnly
      className={cn(className, "leading-[calc(1.25/0.875)]")}
    />
  );
}

// The editor's AddSectionButton, at its pointer size.
function AddSectionLink({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="text-paper-muted-foreground rounded-control -mx-1 flex w-fit items-center gap-1.5 px-1 py-0.5 text-sm outline-none"
    >
      <IconPlus className="size-3.5" aria-hidden="true" />
      {children}
    </button>
  );
}

function getSampleTheme(font: InvoiceFont): InvoiceTheme {
  return { font, fontWeight: "Normal", size: "medium", accent: "#1a1a1a" };
}

function roleStyle(
  theme: InvoiceTheme,
  role: TextRole,
  remove: "align"[] = []
): CSSProperties {
  return getTextStyles({ settings: getRoleSettings(theme, role), remove });
}

// The sums the editor's store would make for the sample: tax is charged on the
// amount after the discount.
function getSampleTotals({
  items,
  discountPercentage,
  taxPercentage
}: SampleInvoice) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const discountAmount = (subtotal * discountPercentage) / 100;
  const taxAmount = ((subtotal - discountAmount) * taxPercentage) / 100;

  return {
    subtotal,
    discountAmount,
    taxAmount,
    total: subtotal - discountAmount + taxAmount
  };
}

/**
 * Shows a `width` x `height` window onto native-size content, scaled to the
 * width of its container (never above 1:1 unless `fill` is set), with `x` and
 * `y` picking the region. The scale is pure CSS, so it is right on the first
 * paint: tan(atan2(a, b)) turns the ratio of two lengths into a number.
 */
export function ScaledFrame({
  width,
  height,
  x = 0,
  y = 0,
  fill = false,
  className,
  children
}: {
  width: number;
  height: number;
  x?: number;
  y?: number;
  fill?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      inert
      className={cn("@container relative w-full overflow-hidden", className)}
      style={{
        maxWidth: fill ? undefined : width,
        aspectRatio: `${width} / ${height}`
      }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width,
          height,
          scale: `tan(atan2(100cqw, ${width}px))`
        }}
      >
        <div className="absolute" style={{ left: -x, top: -y }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * The editor on a desktop window: the toolbar, the desk and the invoice page
 * at 100%, with the canvas scrolled down by `canvasScroll` pixels.
 */
export function EditorWindow({
  invoice,
  width,
  height,
  canvasScroll = 0,
  focusedField,
  openMenu
}: {
  invoice: SampleInvoice;
  width: number;
  height: number;
  canvasScroll?: number;
  focusedField?: "client";
  openMenu?: "file";
}) {
  return (
    <div
      className="bg-background text-foreground font-geist relative [font-feature-settings:normal] antialiased"
      style={{ width, height }}
    >
      <EditorToolbar documentName={invoice.number} openMenu={openMenu} />
      <div
        className="bg-desk relative flex w-full flex-col"
        style={{ height: height - TOOLBAR_HEIGHT }}
      >
        <div className="relative flex h-full flex-col items-center-safe justify-center-safe overflow-hidden p-8 pb-20">
          <div
            className="shrink-0"
            style={{
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT,
              marginTop: -canvasScroll
            }}
          >
            <InvoicePage invoice={invoice} focusedField={focusedField} />
          </div>
        </div>
        <ZoomControl />
      </div>
      {openMenu === "file" && <FileMenu />}
    </div>
  );
}

function EditorToolbar({
  documentName,
  openMenu
}: {
  documentName: string;
  openMenu?: "file";
}) {
  return (
    <div
      className="bg-background border-border flex w-full items-center gap-1 border-b px-3"
      style={{ height: TOOLBAR_HEIGHT }}
    >
      <img
        src="/favicon.svg"
        alt=""
        className="rounded-surface size-9 shrink-0"
      />
      <div className="flex min-w-0 flex-col justify-center">
        <div className="flex min-w-0 self-start">
          <span className="rounded-surface flex h-6 min-w-0 items-center px-2 py-0">
            <span className="text-foreground truncate text-base font-medium">
              {documentName}
            </span>
          </span>
        </div>
        <div className="rounded-surface flex h-6 items-center gap-0.5 px-[3px]">
          {["File", "Edit", "View"].map(menu => (
            <span
              key={menu}
              className={cn(
                "rounded-surface flex items-center px-1.5 py-[2px] text-sm font-medium select-none",
                openMenu === "file" && menu === "File" && "bg-muted"
              )}
            >
              {menu}
            </span>
          ))}
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Button>Download</Button>
      </div>
    </div>
  );
}

function FileMenu() {
  return (
    <div
      className="bg-background text-foreground rounded-surface absolute z-50 flex flex-col p-1 shadow-md ring-1 ring-black/10"
      style={{ top: TOOLBAR_HEIGHT, left: 51 }}
    >
      {FILE_MENU.map((entry, index) =>
        entry === "separator" ? (
          <div key={index} className="bg-border -mx-1 my-1 h-px" />
        ) : (
          <div
            key={entry.label}
            className="rounded-surface flex items-center gap-1.5 px-1.5 py-1 text-sm"
          >
            <entry.icon className="mr-2 h-4 w-4 shrink-0" />
            {entry.label}
          </div>
        )
      )}
    </div>
  );
}

function ZoomControl() {
  return (
    <div className="bg-background border-border rounded-control shadow-menu absolute right-3 bottom-3 z-10 flex items-center border p-0.5">
      <Button variant="ghost" size="icon">
        <IconMinus aria-hidden="true" />
      </Button>
      <Button variant="ghost" className="min-w-14 px-1.5 tabular-nums">
        100%
      </Button>
      <Button variant="ghost" size="icon">
        <IconPlus aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * The invoice page on its own, as the editor's canvas renders it.
 */
export function InvoicePage({
  invoice,
  focusedField
}: {
  invoice: SampleInvoice;
  focusedField?: "client";
}) {
  const theme = getSampleTheme(invoice.font);
  const fontDefinition = getInvoiceFontDefinition(invoice.font);
  const currency = normalizeCurrency(invoice.currencyCode);
  const today = new Date();

  return (
    <div
      className="border-paper-border bg-paper text-paper-foreground min-h-[297mm] w-[210mm] border p-[40pt] shadow-md"
      style={{
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        fontFamily: fontDefinition.cssFamily,
        letterSpacing: fontDefinition.letterSpacing
      }}
    >
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="flex w-full flex-col gap-4">
          <Field
            value="Invoice"
            className="w-full text-5xl font-semibold"
            style={roleStyle(theme, "title")}
          />
          <section className="flex flex-col gap-1">
            <Field
              value="From"
              className="font-medium"
              style={roleStyle(theme, "sectionLabel")}
            />
            <InvoiceTextArea
              readOnly
              value={invoice.seller}
              className="field-sizing-content min-h-[5lh] w-full max-w-[500px]"
              style={roleStyle(theme, "sectionContent")}
            />
          </section>
        </div>
        <div className="group relative shrink-0">
          <div className="rounded-surface bg-paper-muted flex aspect-square h-32 min-w-32 items-center justify-center overflow-hidden">
            <div
              className="rounded-surface font-geist flex h-32 w-32 items-center justify-center text-4xl font-semibold tracking-normal text-white"
              style={{ backgroundColor: invoice.logo.color }}
            >
              {invoice.logo.monogram}
            </div>
          </div>
          <Button
            variant="outline"
            size="xs"
            className="text-destructive shadow-menu absolute right-1.5 bottom-1.5 opacity-0"
          >
            Remove
          </Button>
        </div>
      </div>
      <div className="mt-2 flex justify-between gap-8">
        <div className="flex flex-1 flex-col gap-4">
          <ClientDetails
            theme={theme}
            clientName={invoice.clientName}
            clientAddress={invoice.clientAddress}
            isFocused={focusedField === "client"}
          />
          <AddSectionLink>Add shipping address</AddSectionLink>
        </div>
        <div className="flex flex-1 flex-col items-start justify-end">
          <div className="flex flex-col">
            <DetailRow
              theme={theme}
              label="Invoice No."
              value={invoice.number}
            />
            <DetailRow
              theme={theme}
              label="PO number"
              placeholder="Add a PO / reference"
            />
            <DetailRow
              theme={theme}
              label="Date"
              value={format(today, "yyyy-MM-dd")}
            />
            <DetailRow
              theme={theme}
              label="Due date"
              value={format(addDays(today, 30), "yyyy-MM-dd")}
            />
            <DetailRow
              theme={theme}
              label="Service period"
              placeholder={`e.g. 1–${format(endOfMonth(subMonths(today, 1)), "d MMM yyyy")}`}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 max-w-full">
        <LineItems theme={theme} currency={currency} items={invoice.items} />
        <Pricing theme={theme} currency={currency} invoice={invoice} />
      </div>
      <div className="mt-6">
        <PaymentDetails theme={theme} invoice={invoice} />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1">
        {["Notes", "Terms and conditions", "Late payment"].map(label => (
          <AddSectionLink key={label}>{label}</AddSectionLink>
        ))}
      </div>
    </div>
  );
}

// An empty client name shows the editor's own muted placeholder colour on the
// first line, so the try-it panel reads as a field waiting for input.
function ClientDetails({
  theme,
  clientName,
  clientAddress,
  isFocused
}: {
  theme: InvoiceTheme;
  clientName: string;
  clientAddress: string;
  isFocused: boolean;
}) {
  const contentStyle = roleStyle(theme, "sectionContent");

  return (
    <section className="flex flex-col gap-1">
      <Field
        value="To"
        className="font-medium"
        style={roleStyle(theme, "sectionLabel")}
      />
      <div
        className={cn(
          "rounded-surface relative min-h-[5lh] w-full max-w-[500px] border border-transparent whitespace-pre-wrap",
          isFocused && "border-brand-500 bg-brand-50 z-20 p-2"
        )}
        style={contentStyle}
      >
        <span className={cn(!clientName && "text-paper-muted-foreground")}>
          {clientName || "Your client"}
        </span>
        {isFocused && (
          <span className="bg-paper-foreground ml-px inline-block h-[1.1em] w-px translate-y-[0.15em]" />
        )}
        {`\n${clientAddress}`}
      </div>
    </section>
  );
}

function DetailRow({
  theme,
  label,
  value = "",
  placeholder
}: {
  theme: InvoiceTheme;
  label: string;
  value?: string;
  placeholder?: string;
}) {
  const labelStyle = roleStyle(theme, "detailLabel");

  return (
    <div className="flex items-center">
      <div className="flex min-w-32 items-center" style={labelStyle}>
        <Field
          value={label}
          className="field-sizing-content h-[unset]! w-auto min-w-fit py-0"
          style={labelStyle}
        />
      </div>
      <Field
        value={value}
        placeholder={placeholder}
        suppressHydrationWarning
        className="h-[unset]! w-full py-0"
        style={roleStyle(theme, "detailValue")}
      />
    </div>
  );
}

function LineItems({
  theme,
  currency,
  items
}: {
  theme: InvoiceTheme;
  currency: string;
  items: SampleInvoice["items"];
}) {
  const borderColor = "#e5e7eb";
  const headers: { label: string; role: TextRole; className: string }[] = [
    {
      label: "Item",
      role: "tableHeaderLeft",
      className:
        "relative h-full w-full rounded-none rounded-tl-sm border-none bg-transparent py-2 pl-2"
    },
    {
      label: "Quantity",
      role: "tableHeaderCenter",
      className:
        "relative h-full w-full rounded-none border-none bg-transparent py-2"
    },
    {
      label: "Unit",
      role: "tableHeaderCenter",
      className:
        "relative h-full w-full rounded-none border-none bg-transparent py-2"
    },
    {
      label: "Unit Price",
      role: "tableHeaderCenter",
      className:
        "relative h-full w-full rounded-none border-none bg-transparent py-2"
    },
    {
      label: "Amount",
      role: "tableHeaderRight",
      className:
        "relative h-auto w-full rounded-none rounded-tr-sm border-none bg-transparent py-2 pr-2"
    }
  ];
  const cellClassName =
    "w-full rounded-none border-none py-2 ring-0 outline-none";

  return (
    <div className="w-full">
      <div
        className="rounded-surface flex flex-col border"
        style={{ borderColor }}
      >
        <div
          className={cn(LINE_ITEM_GRID, "gap-2 rounded-t-sm font-medium")}
          style={{ backgroundColor: "#f9fafb", borderColor }}
        >
          {headers.map(header => (
            <div
              key={header.label}
              className="col-span-1 text-sm font-medium"
              style={roleStyle(theme, header.role)}
            >
              <Field
                value={header.label}
                className={header.className}
                style={roleStyle(theme, header.role)}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col">
          {items.map(item => (
            <div
              key={item.description}
              className={cn(
                LINE_ITEM_GRID,
                "relative items-center gap-2 border-t"
              )}
              style={{ borderColor }}
            >
              <div className="col-span-1 flex h-full items-center">
                <Field
                  value={item.description}
                  className={cn(cellClassName, "pl-2")}
                  style={roleStyle(theme, "tableRowLeft")}
                />
              </div>
              <div className="col-span-1 flex h-full items-center">
                <Field
                  value={String(item.quantity)}
                  className={cellClassName}
                  style={roleStyle(theme, "tableRowCenter")}
                />
              </div>
              <div className="col-span-1 flex h-full items-center">
                <Field
                  value={item.unit}
                  className={cn(cellClassName, "text-center")}
                  style={roleStyle(theme, "tableRowCenter")}
                />
              </div>
              <div className="col-span-1 flex h-full items-center">
                <Field
                  value={formatCurrency(item.unitPrice, currency)}
                  className={cellClassName}
                  style={roleStyle(theme, "tableRowCenter")}
                />
              </div>
              <div className="col-span-1 pr-2">
                <span
                  className="inline-block h-full w-full font-medium"
                  style={roleStyle(theme, "tableRowRight")}
                >
                  {formatCurrency(item.quantity * item.unitPrice, currency)}
                </span>
              </div>
              <div className="absolute -right-10">
                <Button size="icon" variant="ghost">
                  <IconMinus
                    className="text-destructive size-4"
                    aria-hidden="true"
                  />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button size="sm" className="my-4 w-fit">
        <IconPlus aria-hidden="true" />
        Add item
      </Button>
    </div>
  );
}

function PricingRowToggle({
  active,
  children
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={cn(
        "shrink-0 rounded px-1.5 py-0.5 text-xs",
        active ? "text-brand-700" : "text-paper-muted-foreground"
      )}
    >
      {children}
    </button>
  );
}

// A sample without a discount shows the editor's default: a fixed discount
// of zero.
function Pricing({
  theme,
  currency,
  invoice
}: {
  theme: InvoiceTheme;
  currency: string;
  invoice: SampleInvoice;
}) {
  const totals = getSampleTotals(invoice);
  const hasDiscount = invoice.discountPercentage > 0;
  const rowClassName =
    "ml-auto flex w-1/3 items-center justify-end gap-1 text-sm";
  const labelStyle = roleStyle(theme, "totalsLabel");
  const inlineLabelStyle = roleStyle(theme, "totalsLabel", ["align"]);
  const valueStyle = roleStyle(theme, "totalsValue");

  return (
    <div className="flex flex-col gap-1 text-right">
      <div className={rowClassName}>
        <Field
          value="Subtotal"
          className="w-full min-w-fit"
          style={labelStyle}
        />
        <span
          className="text-paper-foreground inline-block min-w-40 text-right"
          style={valueStyle}
        >
          {formatCurrency(totals.subtotal, currency)}
        </span>
      </div>
      <div className={rowClassName}>
        <PricingRowToggle active={hasDiscount}>
          {hasDiscount ? "%" : currency}
        </PricingRowToggle>
        <div className="flex w-full items-center justify-end">
          <Field
            value="Discounts"
            className="field-sizing-content w-auto min-w-fit pr-0.5"
            style={inlineLabelStyle}
          />
          {hasDiscount && (
            <span className="flex items-center">
              <Field
                value={String(invoice.discountPercentage)}
                className="w-10 p-0 text-right"
                style={inlineLabelStyle}
              />
              <span style={labelStyle}>%</span>
            </span>
          )}
        </div>
        {hasDiscount ? (
          <span className="ml-auto min-w-40 items-center" style={valueStyle}>
            {`-${formatCurrency(totals.discountAmount, currency)}`}
          </span>
        ) : (
          <span className="ml-auto flex min-w-40 items-center justify-end">
            <Field
              value={`${currency}0`}
              className="w-20 text-right"
              style={valueStyle}
            />
          </span>
        )}
      </div>
      <div className={rowClassName}>
        <PricingRowToggle active={false}>%</PricingRowToggle>
        <div className="flex w-full items-center justify-end">
          <Field
            value="Tax"
            className="field-sizing-content w-auto min-w-fit pr-0.5"
            style={inlineLabelStyle}
          />
          <span className="flex items-center">
            <Field
              value={String(invoice.taxPercentage)}
              className="w-10 p-0 text-right"
              style={inlineLabelStyle}
            />
            <span style={labelStyle}>%</span>
          </span>
        </div>
        <span className="ml-auto min-w-40 items-center" style={valueStyle}>
          {formatCurrency(totals.taxAmount, currency)}
        </span>
      </div>
      <div className={rowClassName}>
        <Field value="Fees" className="w-full min-w-fit" style={labelStyle} />
        <span className="ml-auto flex min-w-40 items-center justify-end">
          <Field
            value={`${currency}0`}
            className="w-20 text-right"
            style={valueStyle}
          />
        </span>
      </div>
      <div className={rowClassName}>
        <Field
          value="Total"
          className="w-full min-w-fit"
          style={roleStyle(theme, "grandTotalLabel")}
        />
        <span
          className="inline-block min-w-40 text-right font-bold"
          style={roleStyle(theme, "grandTotalValue")}
        >
          {formatCurrencyWithCode(totals.total, currency, invoice.currencyCode)}
        </span>
      </div>
      <div className={rowClassName}>
        <Field
          value="Amount paid"
          className="w-full min-w-fit"
          style={labelStyle}
        />
        <span className="ml-auto flex min-w-40 items-center justify-end">
          <Field
            value={`${currency}0`}
            className="w-24 text-right"
            style={valueStyle}
          />
        </span>
      </div>
    </div>
  );
}

// IBAN and sort code are left empty, as a US freelancer would leave them, so
// they show the editor's placeholders.
function PaymentDetails({
  theme,
  invoice
}: {
  theme: InvoiceTheme;
  invoice: SampleInvoice;
}) {
  const contentStyle = roleStyle(theme, "termsContent");
  const fields = [
    { label: "Bank name", value: invoice.payment.bankName, placeholder: "" },
    {
      label: "Account number",
      value: invoice.payment.accountNumber,
      placeholder: ""
    },
    { label: "IBAN", value: "", placeholder: "GB29 NWBK 6016 1331 9268 19" },
    { label: "BIC / SWIFT", value: invoice.payment.bic, placeholder: "" },
    { label: "Sort code", value: "", placeholder: "12-34-56" }
  ];

  return (
    <>
      <Field
        value="Payment details"
        className="font-medium"
        style={roleStyle(theme, "sectionLabel")}
      />
      <div className="mt-2 flex flex-col gap-1">
        {fields.map(field => (
          <div key={field.label} className="flex items-center gap-2">
            <span className="text-paper-muted-foreground w-32 shrink-0 text-sm">
              {field.label}
            </span>
            <Field
              value={field.value}
              placeholder={field.placeholder}
              style={contentStyle}
            />
          </div>
        ))}
      </div>
      <InvoiceTextArea
        readOnly
        value={invoice.paymentInstructions}
        className="mt-2 field-sizing-content w-full"
        style={contentStyle}
      />
    </>
  );
}

/**
 * The invoice title as the editor sets it, in the given face.
 */
export function getTitleStyle(font: InvoiceFont): CSSProperties {
  return roleStyle(getSampleTheme(font), "title");
}
