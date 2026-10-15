// The homepage's pictures of finished invoices: real billsend PDFs, rendered
// by scripts/render-homepage-invoices.tsx at PDF_RENDER_SCALE times the page's
// CSS pixel size. Crops are in the page's CSS pixels (793.7 x 1122.5).

export const PDF_RENDER_SCALE = 3;

// The hero's invoice, named in the editor toolbar around its render.
export const HERO_INVOICE_NUMBER = "INV-0043";

export const PDF_RENDERS = {
  // The whole page: the desktop hero shows its top, the phone crop runs further
  // down on narrow screens. It displays no wider than the page's CSS width, so
  // it ships at about twice that rather than the full render scale.
  hero: {
    src: "/home/invoice-hero.webp",
    crop: { x: 0, y: 0, width: 793.7, height: 1122.5 },
    width: 1600
  },
  // The totals, up to the page's right edge, and the payment details with
  // their label, from the page's left edge. Each crop centres its block's ink
  // (totals 592 to 711, payment 673 to 801), so the two cards frame alike.
  totals: {
    src: "/home/invoice-totals.webp",
    crop: { x: 374, y: 546.7, width: 419.7, height: 209.85 }
  },
  payment: {
    src: "/home/invoice-payment.webp",
    crop: { x: 0, y: 631.9, width: 419.7, height: 209.85 }
  }
};

// The closing invoice: a whole page, shown no wider than 42rem, so it ships at
// about twice that.
export const CLOSING_RENDER = {
  src: "/home/invoice-closing.webp",
  width: 1400
};
