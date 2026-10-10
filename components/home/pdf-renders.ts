import type { InvoiceFont } from "~/types";

// The homepage's pictures of finished invoices: real billsend PDFs, rendered
// by scripts/render-homepage-invoices.tsx at PDF_RENDER_SCALE times the page's
// CSS pixel size. Crops are in the page's CSS pixels (793.7 x 1122.5), so they
// line up with the editor previews' crops.

export const PDF_RENDER_SCALE = 3;

export const PDF_RENDERS = {
  // The totals, up to the page's right edge.
  totals: {
    src: "/home/invoice-totals.webp",
    crop: { x: 374, y: 592, width: 419.7, height: 209.85 }
  },
  // The payment details, from the page's left edge.
  payment: {
    src: "/home/invoice-payment.webp",
    crop: { x: 0, y: 690, width: 419.7, height: 209.85 }
  },
  // The page's top-left corner: the title, the sender and the client.
  send: {
    src: "/home/invoice-send.webp",
    crop: { x: 0, y: 0, width: 410, height: 560 }
  }
};

// Real faces from the editor's invoice font library, across its categories:
// the ones a visitor can pick on the homepage. The closing invoice is rendered
// in each.
export const DEMO_FONTS: InvoiceFont[] = [
  "geist",
  "lora",
  "libre-baskerville",
  "jetbrains-mono"
];

// A whole page, shown no wider than 28rem, so it ships at a smaller size.
export function getClosingRender(font: InvoiceFont) {
  return { src: `/home/invoice-closing-${font}.webp`, width: 1200 };
}
