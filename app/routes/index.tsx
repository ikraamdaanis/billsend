import instrumentSerifFont from "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconArrowUpRight,
  IconLock,
  IconPlus
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import type { ReactNode } from "react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import { cn } from "~/lib/utils";
import type { InvoiceFont } from "~/types";

export const Route = createFileRoute("/")({
  component: HomePage,
  // Instrument Serif only styles the homepage hero and marketing sections, so
  // it preloads here rather than in the root head; other routes would download
  // a font they never render (Chrome flags that as an unused preload).
  head: () => ({
    links: [
      {
        rel: "preload",
        href: instrumentSerifFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous"
      }
    ]
  })
});

const HEADER_HEIGHT = 64;

const SOURCE_URL = "https://github.com/ikraamdaanis/billsend";

const HERO_CTA_ID = "hero-create-invoice";

const CLOSING_CTA_ID = "closing-create-invoice";

const DEFAULT_FONT: InvoiceFont = "geist";

const DISPLAY_HEADING =
  "font-instrument-serif font-normal tracking-[-0.01em] text-balance text-neutral-900";

// Colour-only transitions. Tailwind's `transition-colors` also animates
// `outline-color`, which leaves the focus ring pale for a beat after Tab.
const COLOR_TRANSITION =
  "transition-[color,background-color,text-decoration-color]";

const CHECKS: {
  title: string;
  description: string;
  link?: { href: string; label: string };
}[] = [
  {
    title: "Watch the network yourself",
    description:
      "On a computer, open your browser’s developer tools, choose the Network tab and make an invoice. Nothing you type is sent anywhere."
  },
  {
    title: "Look for a sign-up",
    description:
      "There’s no sign-up form, password or email field anywhere in billsend, so there’s no account for your invoices to belong to."
  },
  {
    title: "Read the source",
    description:
      "billsend’s code is public on GitHub, so you can see exactly what it does with your data.",
    link: { href: SOURCE_URL, label: "View the code on GitHub" }
  }
];

// Each entry is keyed by the marker number drawn on the tour invoice.
const TOUR_NOTES: { marker: number; title: string; description: string }[] = [
  {
    marker: 1,
    title: "Your logo, your type",
    description:
      "Upload your logo and set the whole invoice in any of ten fonts, at three sizes. This one is in Lora."
  },
  {
    marker: 2,
    title: "Tax, fees and discounts",
    description:
      "Add VAT or sales tax as a percentage, plus fees and a fixed or percentage discount. billsend does the sums."
  },
  {
    marker: 3,
    title: "Any currency",
    description:
      "Choose the currency for each invoice, with custom symbols when you need them."
  },
  {
    marker: 4,
    title: "Payment details clients can use",
    description:
      "Bank name, account number, IBAN, BIC / SWIFT and sort code. They leave this browser only on the PDF you send."
  }
];

const QUESTIONS: { question: string; answer: string }[] = [
  {
    question: "Does billsend send the invoice to my client?",
    answer:
      "No. billsend makes the PDF and you send it however you like, usually as an email attachment. It never contacts your client, and there’s nothing on our side that could."
  },
  {
    question: "Can I add VAT or sales tax?",
    answer:
      "Yes. Enter a tax rate and billsend adds it to the total. You can also mark an invoice as tax-exempt, for reverse charge for example, and add fees and discounts."
  },
  {
    question: "Can I use it on my phone?",
    answer:
      "Yes. The editor opens fitted to your screen. Zoom in to edit a section, then download the PDF from the top bar."
  },
  {
    question: "Where do my invoices go, and what about private windows?",
    answer:
      "Nowhere but this browser. billsend saves them in your browser’s storage on this device; to move them, export your data from the editor’s File menu and import it on the other device. Private windows usually throw their storage away when you close them, so download your PDF or export your data first."
  },
  {
    question: "Why is it free?",
    answer:
      "billsend has no accounts, no database and no servers that store anything. Once the page has loaded, your browser does all the work, and the code is public on GitHub, so you can see there’s nothing else going on."
  }
];

// Real faces from the editor's invoice font library, one per category.
const PREVIEW_FONTS: { id: InvoiceFont; label: string }[] = [
  { id: "geist", label: "Geist" },
  { id: "lora", label: "Lora" },
  { id: "jetbrains-mono", label: "JetBrains Mono" }
];

const PREVIEW_LINES: {
  description: string;
  quantity: string;
  amount: string;
}[] = [
  { description: "Brand illustrations", quantity: "1", amount: "$1,800.00" },
  { description: "Packaging artwork", quantity: "2", amount: "$1,100.00" },
  { description: "Revisions (hours)", quantity: "4", amount: "$300.00" }
];

// Matches the editor's sums: tax and a percentage discount are both taken on
// the subtotal (2,750.00 + 19% VAT 522.50 - 10% discount 275.00 = 2,997.50).
const TOUR_LINES: { description: string; quantity: string; amount: string }[] =
  [
    {
      description: "Editorial illustrations",
      quantity: "3",
      amount: "€1,800.00"
    },
    { description: "Cover artwork", quantity: "1", amount: "€950.00" }
  ];

function subscribeToNothing() {
  return () => {};
}

// False during server render and hydration, true once React owns the page, so
// controls that need JavaScript never appear clickable before they work.
function useIsHydrated() {
  return useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  );
}

// How many invoices this browser has saved: null until known, "blocked" when
// the browser refuses storage. The database module loads on demand so
// first-time visitors never download it.
function useSavedInvoiceCount() {
  const [count, setCount] = useState<number | "blocked" | null>(null);

  useEffect(() => {
    let cancelled = false;

    import("~/db")
      .then(database => database.countInvoices())
      .then(total => {
        if (!cancelled) setCount(total);
      })
      .catch(() => {
        if (!cancelled) setCount("blocked");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return count;
}

// The header offers Create invoice only while neither the hero's nor the
// closing section's button is on screen, so one primary action shows at once.
function useShouldShowHeaderCta() {
  const [visibleCtaIds, setVisibleCtaIds] = useState<string[]>([HERO_CTA_ID]);

  useEffect(() => {
    const targets = [HERO_CTA_ID, CLOSING_CTA_ID]
      .map(id => document.getElementById(id))
      .filter(target => target !== null);
    const observer = new IntersectionObserver(
      entries => {
        setVisibleCtaIds(previous => {
          const next = new Set(previous);

          for (const entry of entries) {
            if (entry.isIntersecting) next.add(entry.target.id);
            else next.delete(entry.target.id);
          }

          return [...next];
        });
      },
      { rootMargin: `-${HEADER_HEIGHT}px 0px 0px 0px` }
    );

    for (const target of targets) observer.observe(target);

    return () => observer.disconnect();
  }, []);

  return visibleCtaIds.length === 0;
}

// Counts every network request this page has made, split by whether it went
// to billsend's own origin, from the browser's own performance timeline. It
// can't flatter itself: any third-party request would show up here too. The
// count streams from an observer (seeded with the buffered entries) rather
// than reading the timeline buffer, which stops recording at 250 entries.
function useRequestTally() {
  const [tally, setTally] = useState<{
    own: number;
    elsewhere: number;
  } | null>(null);

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") return;

    // The page document itself is the first request to billsend.
    const counts = { own: 1, elsewhere: 0 };
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const url = new URL(entry.name, window.location.href);

        if (url.protocol !== "http:" && url.protocol !== "https:") continue;

        if (url.origin === window.location.origin) counts.own += 1;
        else counts.elsewhere += 1;
      }

      setTally({ ...counts });
    });

    setTally({ ...counts });
    observer.observe({ type: "resource", buffered: true });

    return () => observer.disconnect();
  }, []);

  return tally;
}

function HomePage() {
  const [font, setFont] = useState<InvoiceFont>(DEFAULT_FONT);

  return (
    <div className="selection:bg-brand-100 selection:text-brand-950 min-h-svh bg-neutral-50 text-neutral-900 antialiased">
      <a
        href="#main"
        className="focus-visible:outline-brand-600 shadow-menu fixed top-3 left-3 z-[60] -translate-y-16 rounded-full bg-white px-4 py-2 text-sm font-medium text-neutral-900 outline-offset-2 transition-transform focus:translate-y-0 focus-visible:outline-2"
      >
        Skip to content
      </a>
      <SiteHeader font={font} />
      <main id="main" className="overflow-x-clip">
        <Hero font={font} onFontChange={setFont} />
        <Privacy />
        <Tour />
        <Questions />
        <Closing font={font} />
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteHeader({ font }: { font: InvoiceFont }) {
  const shouldShowCta = useShouldShowHeaderCta();

  return (
    <header
      className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/85 backdrop-blur-md"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="mx-auto grid h-full max-w-6xl grid-cols-[1fr_auto] items-center px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          className="font-bricolage-grotesque rounded-surface text-brand-600 focus-visible:outline-brand-600 justify-self-start py-2 text-xl font-semibold tracking-tight outline-offset-4 focus-visible:outline-2"
        >
          billsend
        </Link>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-2 justify-self-center text-sm md:flex"
        >
          <NavLink href="#privacy">Privacy</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#questions">Questions</NavLink>
        </nav>
        <div className="flex items-center justify-self-end">
          <span className="md:hidden">
            <NavLink href="#privacy">Privacy</NavLink>
          </span>
          <div
            className={cn(
              "transition-[max-width,opacity] duration-200",
              shouldShowCta
                ? "visible max-w-48 pl-1 opacity-100"
                : "invisible max-w-0 overflow-hidden opacity-0"
            )}
          >
            <CreateInvoiceLink size="sm" font={font} />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={cn(
        "rounded-control focus-visible:outline-brand-600 block px-3 py-2.5 text-sm text-neutral-600 outline-offset-2 hover:text-neutral-900 focus-visible:outline-2",
        COLOR_TRANSITION
      )}
    >
      {children}
    </a>
  );
}

// The one primary action, worded and shaped the same everywhere it appears.
// It carries the font picked in the hero preview into the editor.
function CreateInvoiceLink({
  size = "md",
  font,
  id
}: {
  size?: "sm" | "md" | "lg";
  font: InvoiceFont;
  id?: string;
}) {
  return (
    <Link
      id={id}
      to="/create"
      search={{ font: font === DEFAULT_FONT ? undefined : font }}
      preload="viewport"
      className={cn(
        "group bg-brand-600 hover:bg-brand-700 focus-visible:outline-brand-600 relative inline-flex shrink-0 items-center rounded-full font-medium whitespace-nowrap text-white outline-offset-4 focus-visible:outline-2",
        COLOR_TRANSITION,
        size === "sm" &&
          "h-9 gap-2 pr-1.5 pl-4 text-sm pointer-coarse:h-11 pointer-coarse:pl-5",
        size === "md" && "h-12 gap-3 pr-1.5 pl-6 text-base",
        size === "lg" && "h-14 gap-4 pr-2 pl-8 text-lg"
      )}
    >
      Create invoice
      <span
        aria-hidden
        className={cn(
          "text-brand-600 flex items-center justify-center rounded-full bg-white transition-transform duration-300 ease-out group-hover:translate-x-0.5",
          size === "sm" && "size-6 pointer-coarse:size-8",
          size === "md" && "size-9",
          size === "lg" && "size-10"
        )}
      >
        <IconArrowRight
          className={size === "sm" ? "size-3.5" : "size-5"}
          stroke={2}
        />
      </span>
    </Link>
  );
}

function Hero({
  font,
  onFontChange
}: {
  font: InvoiceFont;
  onFontChange: (font: InvoiceFont) => void;
}) {
  const savedInvoiceCount = useSavedInvoiceCount();
  // Both secondary links share one grid cell, so the returning-user link
  // crossfades into place instead of reflowing the row once the count loads.
  const hasSavedInvoices =
    typeof savedInvoiceCount === "number" && savedInvoiceCount > 0;
  const secondaryLinkClass = cn(
    "group rounded-control focus-visible:outline-brand-600 col-start-1 row-start-1 inline-flex items-center gap-2 py-3 text-base font-medium text-neutral-600 outline-offset-2 transition-[color,opacity,visibility] duration-200 hover:text-neutral-900 focus-visible:outline-2"
  );
  const secondaryRule = (
    <span
      aria-hidden
      className="block h-px w-8 bg-neutral-300 transition-[width,background-color] duration-300 group-hover:w-12 group-hover:bg-neutral-900"
    />
  );

  return (
    <section className="border-b border-neutral-200">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-8 pb-20 sm:gap-12 sm:pt-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10 lg:pt-24 lg:pb-24">
        <div className="flex flex-col items-start">
          <h1
            className={cn(
              DISPLAY_HEADING,
              "text-5xl leading-[0.95] sm:text-7xl xl:text-8xl"
            )}
          >
            <HeadlineLine delay={0.1}>Make an invoice.</HeadlineLine>{" "}
            <HeadlineLine delay={0.2}>
              <span className="text-brand-600">Your data stays put.</span>
            </HeadlineLine>
          </h1>
          <p
            className="hero-fade-up mt-5 max-w-[42ch] text-lg text-pretty text-neutral-600 sm:mt-7"
            style={{ animationDelay: "0.4s" }}
          >
            A free invoice maker that lives in your browser. Fill it in, pick a
            font and download the PDF. No account, and nothing leaves your
            device.
          </p>
          <div
            className="hero-fade-up mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 sm:mt-8"
            style={{ animationDelay: "0.5s" }}
          >
            <CreateInvoiceLink id={HERO_CTA_ID} font={font} />
            <div className="grid">
              <a
                href="#privacy"
                aria-hidden={hasSavedInvoices}
                tabIndex={hasSavedInvoices ? -1 : undefined}
                className={cn(
                  secondaryLinkClass,
                  hasSavedInvoices && "invisible opacity-0"
                )}
              >
                How it stays private
                {secondaryRule}
              </a>
              <Link
                to="/create"
                search={{ open: "invoices" }}
                aria-hidden={!hasSavedInvoices}
                tabIndex={hasSavedInvoices ? undefined : -1}
                className={cn(
                  secondaryLinkClass,
                  !hasSavedInvoices && "invisible opacity-0"
                )}
              >
                Open your saved invoices
                {secondaryRule}
              </Link>
            </div>
          </div>
          {savedInvoiceCount === "blocked" && (
            <p className="mt-4 flex max-w-[46ch] items-start gap-2 text-sm text-pretty text-neutral-600">
              <IconAlertTriangle
                className="text-warning mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              This browser is blocking storage, so billsend can’t save invoices
              here. You can still make one and download the PDF.
            </p>
          )}
        </div>
        <InvoicePreview font={font} onFontChange={onFontChange} />
      </div>
    </section>
  );
}

function HeadlineLine({
  delay,
  children
}: {
  delay: number;
  children: ReactNode;
}) {
  return (
    <span className="-mb-[0.06em] block overflow-hidden pb-[0.12em]">
      <span className="hero-rise block" style={{ animationDelay: `${delay}s` }}>
        {children}
      </span>
    </span>
  );
}

/**
 * A faithful miniature of what the editor produces. It fills itself in line
 * by line on load (the page's one authored motion moment), and the font
 * switcher restyles it with real faces from the invoice font library; the
 * pick carries into the editor through every Create invoice link. The note
 * pinned to the bank details answers the question a freelancer has at exactly
 * that line: where do these go?
 *
 * The due date is today plus 30 days, so the server and the browser can
 * disagree around midnight; that one node opts out of the hydration check.
 */
function InvoicePreview({
  font,
  onFontChange
}: {
  font: InvoiceFont;
  onFontChange: (font: InvoiceFont) => void;
}) {
  const isHydrated = useIsHydrated();
  const fontDefinition = getInvoiceFontDefinition(font);
  const dueDate = format(addDays(new Date(), 30), "MMM d, yyyy");

  return (
    <div
      className="hero-card mx-auto flex w-full max-w-md flex-col gap-5"
      style={{ animationDelay: "0.3s" }}
    >
      <div className="relative">
        <figure
          aria-label="Example invoice made with billsend"
          className="rounded-surface shadow-floating flex flex-col gap-6 border border-neutral-200 bg-white p-5 text-sm text-neutral-900 sm:p-8"
          style={{
            fontFamily: fontDefinition.cssFamily,
            letterSpacing: fontDefinition.letterSpacing
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <span className="text-3xl font-semibold tracking-tight">
                Invoice
              </span>
              <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-xs tabular-nums">
                <dt className="text-neutral-500">Invoice No.</dt>
                <dd>INV-0042</dd>
                <dt className="text-neutral-500">Due date</dt>
                <dd suppressHydrationWarning>{dueDate}</dd>
              </dl>
            </div>
            <LogoMark />
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="font-medium">From</span>
              <span className="text-neutral-600">
                Maya Okafor
                <br />
                Illustration & design
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium">To</span>
              <span className="text-neutral-600">
                Harbor & Pine Co.
                <br />
                Portland, OR
              </span>
            </div>
          </div>
          <div className="rounded-surface flex flex-col overflow-hidden border border-neutral-200">
            <div className="grid grid-cols-[1fr_2rem_5rem] gap-2 bg-neutral-100 px-3 py-2 text-xs font-medium">
              <span>Description</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Amount</span>
            </div>
            {PREVIEW_LINES.map((line, lineIndex) => (
              <div
                key={line.description}
                className="hero-fade-up grid grid-cols-[1fr_2rem_5rem] gap-2 border-t border-neutral-200 px-3 py-2 tabular-nums"
                style={{ animationDelay: `${0.8 + lineIndex * 0.15}s` }}
              >
                <span>{line.description}</span>
                <span className="text-center">{line.quantity}</span>
                <span className="text-right">{line.amount}</span>
              </div>
            ))}
          </div>
          <div
            className="hero-fade-up flex items-end justify-between gap-4 pb-4"
            style={{ animationDelay: "1.3s" }}
          >
            <span className="text-xs text-neutral-600">
              Acme Bank
              <br />
              Account 12345678
              <br />
              SWIFT ACMEUS33
            </span>
            <span className="flex flex-col items-end gap-0.5">
              <span className="text-xs text-neutral-600">Total due</span>
              <span className="text-xl font-semibold tabular-nums">
                $3,200.00
              </span>
            </span>
          </div>
        </figure>
        <div
          className="hero-fade-up rounded-surface shadow-menu absolute -bottom-4 left-4 flex items-center gap-2 border border-neutral-200 bg-white px-3 py-2 sm:-left-4"
          style={{ animationDelay: "1.6s" }}
        >
          <IconLock className="text-brand-600 size-4" aria-hidden="true" />
          <span className="text-sm font-medium text-neutral-700">
            Bank details only leave on your PDF
          </span>
        </div>
      </div>
      {isHydrated ? (
        <div className="flex min-h-18 flex-col gap-2 pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span id="preview-font-label" className="text-sm text-neutral-600">
              Try a font
            </span>
            <div
              role="group"
              aria-labelledby="preview-font-label"
              aria-describedby="preview-font-hint"
              className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white p-1"
            >
              {PREVIEW_FONTS.map(previewFont => {
                const isActive = previewFont.id === font;

                return (
                  <button
                    key={previewFont.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onFontChange(previewFont.id)}
                    className={cn(
                      "focus-visible:outline-brand-600 h-8 rounded-full px-3 text-sm outline-offset-2 focus-visible:outline-2 pointer-coarse:h-10",
                      COLOR_TRANSITION,
                      isActive
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                    )}
                    style={{
                      fontFamily: getInvoiceFontDefinition(previewFont.id)
                        .cssFamily
                    }}
                  >
                    {previewFont.label}
                  </button>
                );
              })}
            </div>
          </div>
          <p id="preview-font-hint" className="text-xs text-neutral-600">
            Your new invoice opens in the font you pick.
          </p>
        </div>
      ) : (
        <p className="min-h-18 pt-3 text-sm text-neutral-600">
          Set your invoice in any of ten fonts in the editor.
        </p>
      )}
    </div>
  );
}

// The sample freelancer's logo, shared by both example invoices.
function LogoMark() {
  return (
    <span
      aria-hidden
      className="rounded-surface font-geist flex size-12 shrink-0 items-center justify-center bg-neutral-900 text-sm font-semibold text-white"
    >
      MO
    </span>
  );
}

/**
 * The privacy promise, set as a sheet of paper like the invoice in the hero.
 * The sheet shows before it tells: a live count of this page's own network
 * requests, then three checks a visitor can make themselves. The honest caveat
 * about browser storage comes after the proof on every screen size.
 */
function Privacy() {
  return (
    <section
      id="privacy"
      className="scroll-mt-16 border-b border-neutral-200 py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-6xl items-start gap-x-16 gap-y-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:grid-rows-[auto_1fr]">
        <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-1">
          <h2 className={cn(DISPLAY_HEADING, "text-5xl sm:text-6xl")}>
            Your invoices never leave this browser.
          </h2>
          <p className="max-w-[46ch] text-lg text-pretty text-neutral-600">
            billsend has no server to send them to. Invoices, templates and
            logos are saved in your browser’s own storage on this device, and
            nowhere else.
          </p>
        </div>
        <div className="rounded-surface shadow-floating flex flex-col overflow-hidden border border-neutral-200 bg-white lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <div className="flex flex-col gap-1 px-6 pt-7 pb-5 sm:px-8">
            <h3 className="text-xl font-semibold tracking-tight text-neutral-900">
              Check it yourself
            </h3>
            <p className="text-sm text-neutral-600">
              Don’t take our word for it.
            </p>
          </div>
          <RequestTally />
          <ul className="flex flex-col">
            {CHECKS.map(check => (
              <li
                key={check.title}
                className="flex flex-col gap-1.5 border-t border-neutral-200 px-6 py-5 sm:px-8"
              >
                <span className="font-medium text-neutral-900">
                  {check.title}
                </span>
                <p className="text-sm text-pretty text-neutral-600">
                  {check.description}
                </p>
                {check.link && (
                  <a
                    href={check.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "text-brand-700 decoration-brand-200 hover:decoration-brand-700 rounded-control focus-visible:outline-brand-600 inline-flex min-h-10 items-center gap-1 self-start text-sm font-medium underline underline-offset-4 outline-offset-2 focus-visible:outline-2 pointer-coarse:min-h-11",
                      COLOR_TRANSITION
                    )}
                  >
                    {check.link.label}
                    <IconArrowUpRight className="size-4" aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex max-w-[46ch] flex-col gap-2 border-t border-neutral-200 pt-6 lg:col-start-1 lg:row-start-2">
          <h3 className="text-sm font-medium text-neutral-900">
            One thing to know
          </h3>
          <p className="text-sm text-pretty text-neutral-600">
            Because everything lives in this browser, clearing your browsing
            data, or closing a private window, deletes it, and it won’t follow
            you to another device. To keep a backup, choose Export Data from the
            File menu in the editor.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * A live readout from the browser's own performance timeline. Without
 * JavaScript, or in a browser without the API, it falls back to telling the
 * visitor how to look for themselves.
 */
function RequestTally() {
  const tally = useRequestTally();

  return (
    <div className="flex min-h-36 flex-col justify-center gap-4 border-t border-neutral-200 bg-neutral-100 px-6 py-5 sm:px-8">
      {tally ? (
        <>
          <span className="flex items-center gap-2 text-xs font-medium text-neutral-700">
            <span
              aria-hidden
              className="bg-success size-2 rounded-full motion-safe:animate-pulse"
            />
            Counted live by your browser, since this page opened
          </span>
          <dl className="grid grid-cols-2 gap-6">
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-neutral-600">
                Requests to other websites
              </dt>
              <dd className="text-4xl font-semibold tracking-tight text-neutral-900 tabular-nums">
                {tally.elsewhere}
              </dd>
            </div>
            <div className="flex flex-col-reverse gap-1">
              <dt className="text-sm text-neutral-600">
                Files from billsend itself
              </dt>
              <dd className="text-4xl font-semibold tracking-tight text-neutral-500 tabular-nums">
                {tally.own}
              </dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="text-sm text-pretty text-neutral-700">
          Open your browser’s developer tools and choose the Network tab: every
          file this page loads comes from billsend itself, and none goes
          anywhere else.
        </p>
      )}
    </div>
  );
}

function TourMarker({ marker }: { marker: number }) {
  return (
    <span
      aria-hidden
      className="bg-brand-600 font-geist flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white tabular-nums"
    >
      {marker}
    </span>
  );
}

// Pins a numbered marker into the paper's left margin beside the part of the
// invoice a tour note describes. Below `lg` the note itself follows that part
// directly, so a phone never has to hold the numbers in mind across a scroll.
function MarkedRegion({
  marker,
  children,
  className
}: {
  marker: number;
  children: ReactNode;
  className?: string;
}) {
  const note = TOUR_NOTES.find(tourNote => tourNote.marker === marker);

  return (
    <div className="flex flex-col gap-3">
      <div className={cn("relative", className)}>
        <span className="absolute top-0.5 -left-7 sm:-left-8">
          <TourMarker marker={marker} />
        </span>
        {children}
      </div>
      {note && (
        <div className="rounded-surface border-brand-200 bg-brand-50 font-geist flex flex-col gap-1 border px-3 py-2.5 tracking-normal lg:hidden">
          <span className="text-brand-950 text-sm font-semibold">
            {note.title}
          </span>
          <span className="text-brand-950 text-sm text-pretty">
            {note.description}
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * The product, shown rather than listed: a fuller invoice (another client,
 * another currency, tax and a discount, set in Lora) with numbered markers that
 * match the notes beside it on wide screens, or beneath each part on narrow
 * ones.
 */
function Tour() {
  const lora = getInvoiceFontDefinition("lora");
  const dueDate = format(addDays(new Date(), 14), "d MMM yyyy");

  return (
    <section
      id="features"
      className="scroll-mt-16 border-b border-neutral-200 py-20 sm:py-24"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6">
        <div className="flex max-w-3xl flex-col gap-5">
          <h2 className={cn(DISPLAY_HEADING, "text-4xl sm:text-5xl")}>
            Made for the invoice you need to send today
          </h2>
          <p className="max-w-[56ch] text-lg text-pretty text-neutral-600">
            For freelancers and anyone with a side project who needs to bill a
            client, not set up accounting software. Save any invoice as a
            template and the next one for that client starts here.
          </p>
        </div>
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <figure
            aria-label="Example invoice in euros with VAT and a discount"
            className="rounded-surface shadow-floating flex flex-col gap-6 border border-neutral-200 bg-white px-9 py-7 text-sm text-neutral-900 sm:px-11 sm:py-9"
            style={{
              fontFamily: lora.cssFamily,
              letterSpacing: lora.letterSpacing
            }}
          >
            <MarkedRegion
              marker={1}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <span className="text-3xl font-semibold">Invoice</span>
                <dl className="grid grid-cols-[auto_auto] gap-x-4 gap-y-0.5 text-xs tabular-nums">
                  <dt className="text-neutral-500">Invoice No.</dt>
                  <dd>INV-0043</dd>
                  <dt className="text-neutral-500">Due date</dt>
                  <dd suppressHydrationWarning>{dueDate}</dd>
                </dl>
              </div>
              <LogoMark />
            </MarkedRegion>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-medium">From</span>
                <span className="text-neutral-600">
                  Maya Okafor
                  <br />
                  London
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">To</span>
                <span className="text-neutral-600">
                  Kanal & Co. GmbH
                  <br />
                  Berlin
                </span>
              </div>
            </div>
            <div className="rounded-surface flex flex-col overflow-hidden border border-neutral-200">
              <div className="grid grid-cols-[1fr_2rem_5.5rem] gap-2 bg-neutral-100 px-3 py-2 text-xs font-medium">
                <span>Description</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Amount</span>
              </div>
              {TOUR_LINES.map(line => (
                <div
                  key={line.description}
                  className="grid grid-cols-[1fr_2rem_5.5rem] gap-2 border-t border-neutral-200 px-3 py-2 tabular-nums"
                >
                  <span>{line.description}</span>
                  <span className="text-center">{line.quantity}</span>
                  <span className="text-right">{line.amount}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col items-end gap-3 tabular-nums">
              <div className="w-full max-w-64">
                <MarkedRegion marker={2} className="flex flex-col gap-1.5">
                  <TourTotalRow label="Subtotal" value="€2,750.00" />
                  <TourTotalRow label="VAT (19%)" value="€522.50" />
                  <TourTotalRow label="Discount (10%)" value="−€275.00" />
                </MarkedRegion>
              </div>
              <div className="w-full max-w-64">
                <MarkedRegion
                  marker={3}
                  className="flex items-baseline justify-between border-t border-neutral-200 pt-2"
                >
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">€2,997.50</span>
                </MarkedRegion>
              </div>
            </div>
            <div className="border-t border-neutral-200 pt-4">
              <MarkedRegion marker={4} className="flex flex-col gap-1 text-xs">
                <span className="font-medium">Payment details</span>
                <span className="text-neutral-600 tabular-nums">
                  IBAN DE89 3704 0044 0532 0130 00
                  <br />
                  BIC COBADEFFXXX
                </span>
              </MarkedRegion>
            </div>
          </figure>
          <ol className="hidden flex-col lg:flex">
            {TOUR_NOTES.map(note => (
              <li
                key={note.marker}
                className="grid grid-cols-[auto_1fr] gap-4 border-t border-neutral-200 py-6 first:border-t-0 first:pt-2"
              >
                <span className="pt-1.5">
                  <TourMarker marker={note.marker} />
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className={cn(DISPLAY_HEADING, "text-3xl leading-tight")}>
                    {note.title}
                  </h3>
                  <p className="max-w-[46ch] text-base text-pretty text-neutral-600">
                    {note.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function TourTotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-neutral-600">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Questions() {
  return (
    <section id="questions" className="scroll-mt-16 py-20 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="flex flex-col gap-5">
          <h2 className={cn(DISPLAY_HEADING, "text-4xl sm:text-5xl")}>
            Before you start
          </h2>
          <p className="max-w-[40ch] text-base text-pretty text-neutral-600">
            Something else on your mind?{" "}
            <a
              href={`${SOURCE_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-brand-700 decoration-brand-200 hover:decoration-brand-700 rounded-control focus-visible:outline-brand-600 font-medium underline underline-offset-4 outline-offset-2 focus-visible:outline-2",
                COLOR_TRANSITION
              )}
            >
              Ask on GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col border-b border-neutral-200">
          {QUESTIONS.map(item => (
            <details
              key={item.question}
              className="group border-t border-neutral-200"
            >
              <summary className="rounded-control focus-visible:outline-brand-600 flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium text-neutral-900 outline-offset-2 focus-visible:outline-2 [&::-webkit-details-marker]:hidden">
                {item.question}
                <IconPlus
                  className="size-5 shrink-0 text-neutral-500 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[60ch] pb-5 text-base text-pretty text-neutral-600">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closing({ font }: { font: InvoiceFont }) {
  return (
    <section className="pb-20 sm:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start gap-8 border-t border-neutral-200 pt-12 sm:flex-row sm:items-center sm:justify-between">
          <h2 className={cn(DISPLAY_HEADING, "text-4xl sm:text-6xl")}>
            Nothing to sign up for. Just your invoice.
          </h2>
          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
            <CreateInvoiceLink size="lg" font={font} id={CLOSING_CTA_ID} />
            <p className="text-sm text-neutral-600">
              Free, and it opens straight into the editor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 text-sm text-neutral-600">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 pt-8 pb-10 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-bricolage-grotesque text-brand-600 text-lg font-semibold tracking-tight">
          billsend
        </span>
        <div className="flex flex-wrap items-center gap-x-6">
          <FooterLink href={`${SOURCE_URL}/issues`}>Report an issue</FooterLink>
          <FooterLink href={SOURCE_URL}>Source on GitHub</FooterLink>
          <span className="py-2">© {new Date().getFullYear()} billsend.io</span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "rounded-control focus-visible:outline-brand-600 inline-flex min-h-10 items-center outline-offset-2 hover:text-neutral-900 focus-visible:outline-2 pointer-coarse:min-h-11",
        COLOR_TRANSITION
      )}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
