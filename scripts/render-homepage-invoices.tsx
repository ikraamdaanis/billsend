import { Document, Font, Page, renderToFile, Text } from "@react-pdf/renderer";
import { spawn } from "bun";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  DEMO_FONTS,
  getClosingRender,
  PDF_RENDER_SCALE,
  PDF_RENDERS
} from "~/components/home/pdf-renders";
import { InvoicePDF } from "~/components/pdf/invoice-generator";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import { invoiceDefault } from "~/stores/invoice-store";
import type { Invoice, InvoiceFont, InvoiceItem } from "~/types";
import { PDF_FONT_FAMILIES } from "~/utils/register-invoice-pdf-fonts";

// Renders the homepage's invoice pictures with the app's own PDF component, so
// every one is a real billsend PDF rather than a drawing of one. Each picture
// shows a different invoice. Run `bun run render:home` after changing the PDF
// layout or the samples; it needs poppler (pdftoppm) and cwebp on the PATH.

const OUTPUT_DIR = join(import.meta.dir, "..", "public");

// The page in CSS pixels; pdftoppm renders 72pt to 96px at 96 DPI.
const RENDER_DPI = 96 * PDF_RENDER_SCALE;

for (const font of PDF_FONT_FAMILIES) {
  Font.register({ family: font.family, fonts: font.fonts });
}

function items(rows: [string, number, string, number][]): InvoiceItem[] {
  return rows.map(([description, quantity, unit, unitPrice], index) => ({
    id: String(index),
    description,
    quantity,
    unit,
    unitPrice
  }));
}

function sampleInvoice(
  overrides: Partial<Invoice> & Pick<Invoice, "seller" | "client" | "items">
): Invoice {
  return {
    ...structuredClone(invoiceDefault),
    ...overrides,
    seller: { ...invoiceDefault.seller, ...overrides.seller },
    client: { ...invoiceDefault.client, ...overrides.client },
    labels: { ...invoiceDefault.labels, ...overrides.labels },
    paymentDetails: {
      ...invoiceDefault.paymentDetails,
      ...overrides.paymentDetails
    }
  };
}

// A print studio's menu job for a Manhattan restaurant: a percentage discount,
// New York City's 8.875% sales tax on the printed goods, and a delivery fee.
const TOTALS_INVOICE = sampleInvoice({
  number: "FF-2214",
  invoiceDate: "2026-09-18",
  dueDate: "2026-10-18",
  seller: {
    label: "From",
    content:
      "Ferro & Finch Studio\n55 Washington Street, Suite 712\nBrooklyn, NY 11201\n(347) 555-0119",
    placeholder: ""
  },
  client: {
    label: "Bill to",
    content: "Lucia’s Trattoria\n241 Mulberry Street\nNew York, NY 10012",
    placeholder: ""
  },
  items: items([
    ["Menu design and layout", 1, "ea", 1200],
    ["Printed menus, 11 × 17", 150, "pcs", 6.5],
    ["Window decals", 4, "pcs", 85]
  ]),
  discounts: 10,
  discountType: "percentage",
  tax: { percentage: 8.875, exempt: false, note: "" },
  fees: 45,
  labels: { ...invoiceDefault.labels, fees: "Delivery" }
});

// A San Diego bookkeeper's monthly retainer, paid by ACH or wire.
const PAYMENT_INVOICE = sampleInvoice({
  number: "CB-0387",
  invoiceDate: "2026-10-01",
  dueDate: "2026-10-31",
  servicePeriod: "Sep 1–30, 2026",
  seller: {
    label: "From",
    content:
      "Coastline Bookkeeping LLC\n3990 Old Town Avenue, Suite B-204\nSan Diego, CA 92110\n(619) 555-0148",
    placeholder: ""
  },
  client: {
    label: "Bill to",
    content:
      "Pacific Swell Surf Supply\n4836 Newport Avenue\nSan Diego, CA 92107",
    placeholder: ""
  },
  items: items([
    ["Monthly bookkeeping retainer", 1, "mo", 850],
    ["Payroll processing, 9 employees", 2, "runs", 95],
    ["Quarterly sales tax filing", 1, "ea", 175]
  ]),
  paymentDetails: {
    label: "Payment details",
    bankName: "Bank of America, N.A.",
    accountNumber: "3250 8874 1196",
    iban: "",
    bic: "BOFAUS3N",
    sortCode: "",
    terms: "ACH routing number 121000358. Due within 30 days."
  }
});

// A Vermont woodworker's fit-out for a café, sent as a Lora PDF with a logo.
const SEND_INVOICE = sampleInvoice({
  number: "HRW-2031",
  poNumber: "MMC-0412",
  invoiceDate: "2026-09-26",
  dueDate: "2026-10-26",
  seller: {
    label: "From",
    content:
      "Hollis Ridge Woodworks\n418 Pine Street\nBurlington, VT 05401\n(802) 555-0173",
    placeholder: ""
  },
  client: {
    label: "Bill to",
    content: "Maple & Main Café\n92 Church Street\nBurlington, VT 05401",
    placeholder: ""
  },
  items: items([
    ["Walnut bar top, 14 ft", 1, "ea", 6800],
    ["White oak bench seating", 3, "ea", 1450],
    ["Delivery and installation", 1, "ea", 600]
  ]),
  tax: { percentage: 6, exempt: false, note: "" },
  theme: { ...invoiceDefault.theme, font: "lora" }
});

// A Seattle app studio's monthly invoice, filled out top to bottom.
const CLOSING_INVOICE = sampleInvoice({
  number: "NL-1042",
  poNumber: "PO-55120",
  invoiceDate: "2026-10-02",
  dueDate: "2026-11-01",
  servicePeriod: "Sep 1–30, 2026",
  seller: {
    label: "From",
    content:
      "Northline Software LLC\n2200 Western Avenue, Suite 300\nSeattle, WA 98121\n(206) 555-0163\nbilling@northline.dev",
    placeholder: ""
  },
  client: {
    label: "Bill to",
    content:
      "Cascade Outfitters Inc.\nAttn: Accounts Payable\n1400 Fourth Avenue, Floor 9\nSeattle, WA 98101",
    placeholder: ""
  },
  items: items([
    ["iOS app development", 64, "hrs", 145],
    ["Android app development", 48, "hrs", 145],
    ["QA and release support", 12, "hrs", 120],
    ["Push notification service, Sep", 1, "mo", 89]
  ]),
  paymentDetails: {
    label: "Payment details",
    bankName: "U.S. Bank",
    accountNumber: "1534 9082 7316",
    iban: "",
    bic: "USBKUS44IMT",
    sortCode: "",
    terms: "ACH routing number 125000105. Net 30."
  },
  notes: {
    label: "Notes",
    content: "Thanks for another great sprint. Release 4.2 shipped on Sep 29."
  },
  latePayment: {
    label: "Late payment",
    content: "Balances more than 30 days past due accrue 1.5% interest a month."
  }
});

// A square logo in the invoice's face, rendered to PNG through react-pdf so the
// script needs nothing beyond the PDF tools it already uses.
async function renderLogo({
  directory,
  name,
  monogram,
  color,
  font
}: {
  directory: string;
  name: string;
  monogram: string;
  color: string;
  font: InvoiceFont;
}) {
  const pdfPath = join(directory, `${name}.pdf`);
  const pngPath = join(directory, name);

  await renderToFile(
    <Document>
      <Page
        size={[96, 96]}
        style={{
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            fontFamily: getInvoiceFontDefinition(font).pdfFamily,
            fontWeight: 600,
            fontSize: 34,
            color: "#ffffff"
          }}
        >
          {monogram}
        </Text>
      </Page>
    </Document>,
    pdfPath
  );
  await run(["pdftoppm", "-r", "432", "-png", "-singlefile", pdfPath, pngPath]);

  return `${pngPath}.png`;
}

async function run(command: string[]) {
  const child = spawn(command, { stderr: "pipe" });
  const exitCode = await child.exited;

  if (exitCode !== 0) {
    const stderr = await new Response(child.stderr).text();

    throw new Error(`${command[0]} failed: ${stderr}`);
  }
}

// Renders the invoice's first page to a PNG at the homepage's render scale.
async function renderPage(directory: string, name: string, invoice: Invoice) {
  const pdfPath = join(directory, `${name}.pdf`);
  const pngPath = join(directory, name);

  await renderToFile(<InvoicePDF invoice={invoice} />, pdfPath);
  await run([
    "pdftoppm",
    "-r",
    String(RENDER_DPI),
    "-png",
    "-singlefile",
    "-f",
    "1",
    "-l",
    "1",
    pdfPath,
    pngPath
  ]);

  return `${pngPath}.png`;
}

async function writeWebp({
  pngPath,
  src,
  crop,
  width
}: {
  pngPath: string;
  src: string;
  crop?: { x: number; y: number; width: number; height: number };
  width?: number;
}) {
  const cropArgs = crop
    ? [crop.x, crop.y, crop.width, crop.height].map(value =>
        String(Math.round(value * PDF_RENDER_SCALE))
      )
    : [];

  await run([
    "cwebp",
    "-quiet",
    "-q",
    "88",
    "-m",
    "6",
    ...(crop ? ["-crop", ...cropArgs] : []),
    ...(width ? ["-resize", String(width), "0"] : []),
    pngPath,
    "-o",
    join(OUTPUT_DIR, src)
  ]);
}

const directory = await mkdtemp(join(tmpdir(), "billsend-renders-"));

try {
  await mkdir(join(OUTPUT_DIR, "home"), { recursive: true });

  const sendLogo = await renderLogo({
    directory,
    name: "logo-hollis",
    monogram: "HR",
    color: "#2f4a3a",
    font: "lora"
  });

  await writeWebp({
    pngPath: await renderPage(directory, "totals", TOTALS_INVOICE),
    ...PDF_RENDERS.totals
  });
  await writeWebp({
    pngPath: await renderPage(directory, "payment", PAYMENT_INVOICE),
    ...PDF_RENDERS.payment
  });
  await writeWebp({
    pngPath: await renderPage(directory, "send", {
      ...SEND_INVOICE,
      image: sendLogo
    }),
    ...PDF_RENDERS.send
  });

  for (const font of DEMO_FONTS) {
    const closingLogo = await renderLogo({
      directory,
      name: `logo-northline-${font}`,
      monogram: "NL",
      color: "#1e3a5f",
      font
    });

    await writeWebp({
      pngPath: await renderPage(directory, `closing-${font}`, {
        ...CLOSING_INVOICE,
        image: closingLogo,
        theme: { ...CLOSING_INVOICE.theme, font }
      }),
      ...getClosingRender(font)
    });
  }

  process.stdout.write(
    `Wrote the invoice renders to ${join(OUTPUT_DIR, "home")}\n`
  );
} finally {
  if (process.argv.includes("--keep")) {
    process.stdout.write(`Kept the page renders in ${directory}\n`);
  } else {
    await rm(directory, { recursive: true, force: true });
  }
}
