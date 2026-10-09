import archivoFont from "@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2?url";
import "@fontsource-variable/archivo/wdth.css";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconArrowUpRight,
  IconMenu2,
  IconPlus
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import type { ReactNode } from "react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  CornerRosette,
  GuillocheBand,
  Microprint,
  Rosette,
  underprintBackground
} from "~/components/home/guilloche";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import { cn } from "~/lib/utils";
import type { InvoiceFont } from "~/types";

export const Route = createFileRoute("/")({
  component: HomePage,
  // Archivo only sets the homepage's engraved lettering, so it preloads here
  // rather than in the root head; other routes would download a font they
  // never render.
  head: () => ({
    links: [
      {
        rel: "preload",
        href: archivoFont,
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

// Engraved lettering: Archivo at its widest, like the denomination on a note.
const ENGRAVED = "font-engraved [font-stretch:125%]";

// Numbering-machine figures: Archivo at its narrowest, tabular.
const NUMBERING = "font-engraved [font-stretch:62%] tabular-nums";

// Printed form labels: small, wide, tracked capitals.
const FORM_LABEL = cn(
  ENGRAVED,
  "text-[0.6875rem] leading-none font-semibold tracking-[0.14em] uppercase"
);

const HEADLINE = cn(
  ENGRAVED,
  "font-semibold tracking-[-0.025em] text-balance text-ink"
);

// Colour-only transitions. Tailwind's `transition-colors` also animates
// `outline-color`, which leaves the focus ring pale for a beat after Tab.
const COLOR_TRANSITION =
  "transition-[color,background-color,text-decoration-color]";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

const TINT_UNDERPRINT = underprintBackground("oklch(0.85 0.035 190 / 0.55)");

const BAND_UNDERPRINT = underprintBackground("oklch(0.42 0.152 257.57 / 0.5)");

const SLIP_UNDERPRINT = underprintBackground("oklch(0.85 0.035 190 / 0.35)");

const MICROPRINT_TEXT =
  "billsend keeps your invoices in this browser on this device";

// Every fact on the document's foot line is checkable on this page.
const DOCUMENT_FACTS = [
  "0 accounts",
  "0 analytics scripts",
  "0 requests to other websites",
  "Free"
];

// The four checks, in the order a visitor can make them, each led by the plain
// verb a banknote leaflet would use.
const CHECKS: {
  title: string;
  description: string;
  detail?: { summary: string; text: string };
  link?: { href: string; label: string };
}[] = [
  {
    title: "Look at the red counter",
    description:
      "The counter marked “Requests to other websites” on the sample invoice reads your browser’s own record of every request this page makes elsewhere. Type on the invoice all you like: it stays at 000."
  },
  {
    title: "Search for a sign-up",
    description:
      "There’s no sign-up form, password or email field anywhere in billsend, so there’s no account for your invoices to sit in."
  },
  {
    title: "Ask your browser",
    description:
      "Every billsend page, the editor included, tells your browser to block it from loading anything from, or sending data to, any other website. Your browser enforces that rule, not billsend.",
    detail: {
      summary: "See the rule on a computer",
      text: "Open your browser’s developer tools, choose the Network tab and reload the page. Select the first request in the list and look for content-security-policy under Response Headers."
    }
  },
  {
    title: "Read the code",
    description:
      "billsend’s code is public on GitHub, so anyone can check exactly what it does with your data.",
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
    title: "Any currency",
    description:
      "Choose the currency for each invoice, with custom symbols when you need them."
  },
  {
    marker: 3,
    title: "Tax, fees and discounts",
    description:
      "Add VAT or sales tax as a rate, or mark the invoice tax-exempt with a note such as “Reverse charge”. Add fees and a fixed or percentage discount, and billsend does the sums, taxing the amount after any discount."
  },
  {
    marker: 4,
    title: "Payment details clients can use",
    description:
      "Bank name, account number, IBAN, BIC / SWIFT and sort code. They leave this browser only in files you save: the PDF you send, or your own backup."
  }
];

// Grouped so no list asks the reader to weigh more than four questions.
const QUESTION_GROUPS: {
  title: string;
  questions: { question: string; answer: string }[];
}[] = [
  {
    title: "Making invoices",
    questions: [
      {
        question: "Does billsend send the invoice to my client?",
        answer:
          "No. billsend makes the PDF and you send it however you like, usually as an email attachment. It never contacts your client, and there’s nothing on our side that could."
      },
      {
        question: "Can I add VAT or sales tax?",
        answer:
          "Yes. Enter a tax rate and billsend charges it on the amount after any discount, then adds it to the total. For reverse charge or zero-rated work, mark the invoice tax-exempt and add a note such as “Reverse charge”."
      },
      {
        question: "Can I reuse an invoice for the same client?",
        answer:
          "Yes. Save any invoice as a template, and the next invoice for that client starts from it instead of a blank page."
      },
      {
        question: "Can I use it on my phone?",
        answer:
          "Yes. The editor opens fitted to your screen. Zoom in to edit a section, then download the PDF from the top bar."
      }
    ]
  },
  {
    title: "Your data",
    questions: [
      {
        question: "Where are my invoices saved?",
        answer:
          "In this browser, on this device. They only leave it in files you save: the PDFs you download and any backup you export from the editor’s File menu."
      },
      {
        question: "Can I use a private window?",
        answer:
          "Yes, but private windows usually throw their storage away when you close them. Download your PDF, or export your data from the File menu, before you close the window."
      },
      {
        question: "Why is it free, and what’s the catch?",
        answer:
          "There’s very little to pay for. billsend keeps no accounts and stores nothing about you on a server; once a page has loaded, your browser does all the work. There’s no paid plan, no ads and no data collected to sell, and the code is public on GitHub, so you can check."
      }
    ]
  }
];

// Real faces from the editor's invoice font library, one per category.
const PREVIEW_FONTS: { id: InvoiceFont; label: string }[] = [
  { id: "geist", label: "Geist" },
  { id: "lora", label: "Lora" },
  { id: "jetbrains-mono", label: "JetBrains Mono" }
];

// A UK freelancer billing a German business: VAT is reverse charged, so the
// tax row carries the editor's exempt note and the total is the subtotal less
// the 10% discount (2,750.00 - 275.00 = 2,475.00).
const TOUR_LINES: { description: string; quantity: string; amount: string }[] =
  [
    {
      description: "Editorial illustrations",
      quantity: "3",
      amount: "€1,800.00"
    },
    { description: "Cover artwork", quantity: "1", amount: "€950.00" }
  ];

// Only fetch, XHR and beacon requests let a script send data; everything else
// a page loads is a file it downloads.
const DATA_INITIATORS = new Set(["fetch", "xmlhttprequest", "beacon"]);

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

// The header and the phone's bottom bar offer Create invoice only while
// neither the hero's nor the closing section's button is on screen, so one
// primary action shows at once.
function useShouldShowStickyCta() {
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

// Counts every network request this page has made from the browser's own
// performance timeline, three ways: requests to any other website, background
// requests (fetch, XHR or beacon, the kinds scripts use to send data) to
// anyone, and billsend's own files. It can't flatter itself: a third-party or
// data request would show up here too. The count streams from an observer
// (seeded with the buffered entries) rather than reading the timeline buffer,
// which stops recording at 250 entries.
function useRequestTally() {
  const [tally, setTally] = useState<
    | { status: "counting"; elsewhere: number; data: number; files: number }
    | { status: "pending" | "unsupported" }
  >({ status: "pending" });

  useEffect(() => {
    if (typeof PerformanceObserver === "undefined") {
      setTally({ status: "unsupported" });

      return;
    }

    // The page document itself is the first of billsend's own files.
    const counts = { elsewhere: 0, data: 0, files: 1 };
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!(entry instanceof PerformanceResourceTiming)) continue;

        const url = new URL(entry.name, window.location.href);

        if (url.protocol !== "http:" && url.protocol !== "https:") continue;

        if (url.origin !== window.location.origin) counts.elsewhere += 1;

        if (DATA_INITIATORS.has(entry.initiatorType)) counts.data += 1;
        else if (url.origin === window.location.origin) counts.files += 1;
      }

      setTally({ status: "counting", ...counts });
    });

    setTally({ status: "counting", ...counts });
    observer.observe({ type: "resource", buffered: true });

    return () => observer.disconnect();
  }, []);

  return tally;
}

// Numbering machines print a fixed number of wheels.
function formatSerial(value: number) {
  return String(value).padStart(3, "0");
}

function HomePage() {
  const [font, setFont] = useState<InvoiceFont>(DEFAULT_FONT);
  const tally = useRequestTally();
  const shouldShowStickyCta = useShouldShowStickyCta();

  return (
    <div
      className="selection:bg-brand-100 selection:text-brand-950 bg-tint text-ink min-h-svh antialiased"
      style={{ backgroundImage: TINT_UNDERPRINT }}
    >
      <a
        href="#main"
        className={cn(
          "shadow-menu rounded-control fixed top-3 left-3 z-[60] -translate-y-16 bg-white px-4 py-2 text-sm font-medium transition-transform focus:translate-y-0",
          FOCUS_RING
        )}
      >
        Skip to content
      </a>
      <SiteHeader font={font} shouldShowCta={shouldShowStickyCta} />
      <main id="main" className="overflow-x-clip">
        <Hero font={font} onFontChange={setFont} tally={tally} />
        <Privacy />
        <Tour />
        <Questions />
        <Closing font={font} />
      </main>
      <SiteFooter />
      <PhoneCtaBar font={font} isVisible={shouldShowStickyCta} />
    </div>
  );
}

function SiteHeader({
  font,
  shouldShowCta
}: {
  font: InvoiceFont;
  shouldShowCta: boolean;
}) {
  return (
    <header
      className="bg-tint/90 sticky top-0 z-50 backdrop-blur-md"
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="mx-auto grid h-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link
          to="/"
          className={cn(
            "font-bricolage-grotesque rounded-surface text-brand-600 justify-self-start py-2 text-xl font-semibold tracking-tight",
            FOCUS_RING
          )}
        >
          billsend
        </Link>
        <nav
          aria-label="Sections"
          className="hidden items-center gap-1 justify-self-center md:flex"
        >
          <NavLink href="#privacy">Privacy</NavLink>
          <NavLink href="#features">Features</NavLink>
          <NavLink href="#questions">Questions</NavLink>
        </nav>
        <div className="flex items-center justify-self-end">
          <div
            aria-hidden={!shouldShowCta}
            inert={!shouldShowCta}
            className={cn(
              "hidden transition-[opacity,visibility,translate] ease-out md:block",
              shouldShowCta
                ? "visible translate-y-0 opacity-100 duration-200"
                : "invisible translate-y-1 opacity-0 duration-100"
            )}
          >
            <CreateInvoiceLink size="sm" font={font} />
          </div>
          <PhoneMenu />
        </div>
      </div>
      <Microprint
        text={MICROPRINT_TEXT}
        className="text-ink/35 border-ink/10 border-b pb-px"
      />
    </header>
  );
}

function NavLink({
  href,
  onNavigate,
  children
}: {
  href: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-control text-ink-muted hover:text-ink block px-3 py-2.5 text-sm font-medium pointer-coarse:py-3",
        COLOR_TRANSITION,
        FOCUS_RING
      )}
    >
      {children}
    </a>
  );
}

// Below `md` the section links fold into a native disclosure, so they work
// before hydration and never crowd the wordmark on a 320px screen. Once
// hydrated it also closes on Escape or a tap outside, like any menu.
function PhoneMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setIsOpen(false);
      menuRef.current?.querySelector("summary")?.focus();
    }

    function handlePointerDown(event: PointerEvent) {
      if (!(event.target instanceof Node)) return;
      if (menuRef.current?.contains(event.target)) return;

      setIsOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <details
      ref={menuRef}
      open={isOpen}
      onToggle={event => setIsOpen(event.currentTarget.open)}
      className="relative md:hidden"
    >
      <summary
        className={cn(
          "rounded-control text-ink flex size-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden",
          FOCUS_RING
        )}
      >
        <IconMenu2 className="size-5" aria-hidden="true" />
        <span className="sr-only">Sections</span>
      </summary>
      <nav
        aria-label="Sections"
        className="rounded-surface shadow-menu border-ink/15 absolute top-full right-0 mt-2 flex w-48 flex-col border bg-white p-1"
      >
        {[
          { href: "#privacy", label: "Privacy" },
          { href: "#features", label: "Features" },
          { href: "#questions", label: "Questions" }
        ].map(section => (
          <NavLink
            key={section.href}
            href={section.href}
            onNavigate={() => setIsOpen(false)}
          >
            {section.label}
          </NavLink>
        ))}
      </nav>
    </details>
  );
}

// The one primary action, worded and shaped the same everywhere it appears: an
// engraved plate with a hairline inner frame. It carries the typeface picked on
// the sample invoice into the editor.
function CreateInvoiceLink({
  size = "md",
  font,
  id,
  className
}: {
  size?: "sm" | "md" | "lg";
  font: InvoiceFont;
  id?: string;
  className?: string;
}) {
  return (
    <Link
      id={id}
      to="/create"
      search={{ font: font === DEFAULT_FONT ? undefined : font }}
      preload="viewport"
      className={cn(
        "group bg-brand-700 hover:bg-brand-800 rounded-control focus-visible:outline-brand-600 relative inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap text-white uppercase outline-offset-4 focus-visible:outline-2",
        ENGRAVED,
        COLOR_TRANSITION,
        size === "sm" &&
          "h-9 gap-2 px-4 text-xs tracking-[0.1em] pointer-coarse:h-11",
        size === "md" && "h-12 gap-3 px-6 text-sm tracking-[0.1em]",
        size === "lg" && "h-14 gap-3 px-8 text-base tracking-[0.08em]",
        className
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[3px] rounded-[2px] border border-white/30"
      />
      Create invoice
      <IconArrowRight
        className={cn(
          "transition-transform duration-300 ease-out group-hover:translate-x-0.5",
          size === "sm" ? "size-3.5" : "size-4"
        )}
        stroke={2.25}
        aria-hidden="true"
      />
    </Link>
  );
}

// On a phone the primary action rides in the thumb zone once the hero's button
// has scrolled away, and steps aside again for the closing one.
function PhoneCtaBar({
  font,
  isVisible
}: {
  font: InvoiceFont;
  isVisible: boolean;
}) {
  return (
    <div
      aria-hidden={!isVisible}
      inert={!isVisible}
      className={cn(
        "bg-tint/95 border-ink/15 fixed inset-x-0 bottom-0 z-40 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-[opacity,visibility,translate] ease-out md:hidden",
        isVisible
          ? "visible translate-y-0 opacity-100 duration-200"
          : "invisible translate-y-4 opacity-0 duration-100"
      )}
    >
      <CreateInvoiceLink font={font} className="w-full" />
    </div>
  );
}

function Hero({
  font,
  onFontChange,
  tally
}: {
  font: InvoiceFont;
  onFontChange: (font: InvoiceFont) => void;
  tally: ReturnType<typeof useRequestTally>;
}) {
  const savedInvoiceCount = useSavedInvoiceCount();

  return (
    <section className="px-4 pt-6 pb-16 sm:px-6 sm:pb-20">
      <div className="border-ink/20 relative mx-auto max-w-6xl overflow-hidden border bg-white/40">
        <GuillocheBand id="hero-band-top" className="text-guilloche" />
        <GuillocheBand
          id="hero-band-left"
          orientation="vertical"
          className="text-guilloche absolute inset-y-0 left-0 hidden sm:block"
        />
        <GuillocheBand
          id="hero-band-right"
          orientation="vertical"
          className="text-guilloche absolute inset-y-0 right-0 hidden sm:block"
        />
        <CornerRosette className="text-guilloche top-0 left-0 hidden sm:flex" />
        <CornerRosette className="text-guilloche top-0 right-0 hidden sm:flex" />
        <CornerRosette className="text-guilloche bottom-0 left-0 hidden sm:flex" />
        <CornerRosette className="text-guilloche right-0 bottom-0 hidden sm:flex" />
        <Rosette
          animate
          className="text-guilloche absolute -right-28 -bottom-28 hidden size-[34rem] lg:block"
        />
        <div className="relative flex flex-col gap-8 px-5 py-8 sm:gap-10 sm:px-10 sm:py-12 lg:gap-8 lg:py-10">
          <h1
            className={cn(
              HEADLINE,
              "text-[2.5rem] leading-[0.98] sm:text-6xl xl:text-[4.25rem]"
            )}
          >
            <HeadlineLine delay={0.1}>Send the invoice.</HeadlineLine>{" "}
            <HeadlineLine delay={0.2}>
              <span className="text-brand-600">Keep everything else.</span>
            </HeadlineLine>
          </h1>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-16">
            <div className="flex flex-col items-start">
              <p
                className="hero-fade-up text-ink-muted max-w-[44ch] text-lg text-pretty"
                style={{ animationDelay: "0.4s" }}
              >
                A free invoice maker that works entirely in your browser: fill
                it in and download the PDF. No account and no upload. Your
                invoices, clients and bank details stay in this browser and
                leave it only in files you save.
              </p>
              <div
                className="hero-fade-up mt-8 flex flex-wrap items-center gap-x-6 gap-y-2"
                style={{ animationDelay: "0.5s" }}
              >
                <CreateInvoiceLink id={HERO_CTA_ID} font={font} />
                <a
                  href="#privacy"
                  className={cn(
                    "text-brand-700 decoration-brand-300 hover:decoration-brand-700 rounded-control py-3 text-base font-medium underline underline-offset-4",
                    COLOR_TRANSITION,
                    FOCUS_RING
                  )}
                >
                  Check the privacy yourself
                </a>
              </div>
              {tally.status === "counting" && (
                <p className="text-ink-muted mt-3 flex items-baseline gap-2 text-sm lg:hidden">
                  <span
                    className={cn(
                      NUMBERING,
                      "text-numbering text-xl leading-none font-bold"
                    )}
                  >
                    {formatSerial(tally.elsewhere)}
                  </span>
                  requests to other websites so far, counted by your browser.
                </p>
              )}
              <SavedInvoicesNote count={savedInvoiceCount} />
            </div>
            <SpecimenInvoice
              font={font}
              onFontChange={onFontChange}
              tally={tally}
            />
          </div>
        </div>
        <DocumentFoot />
        <GuillocheBand id="hero-band-bottom" className="text-guilloche" />
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

// The foot of the hero document: a line of true facts set like the
// account-number line printed along the bottom of a cheque.
function DocumentFoot() {
  return (
    <div className="border-perforation relative flex flex-wrap items-center gap-x-5 gap-y-2 border-t-2 border-dashed px-5 py-3 sm:px-10">
      {DOCUMENT_FACTS.map(fact => (
        <span
          key={fact}
          className={cn(
            NUMBERING,
            "text-ink-muted flex items-center gap-2 text-sm font-semibold tracking-[0.06em] uppercase"
          )}
        >
          <TransitMark />
          {fact}
        </span>
      ))}
    </div>
  );
}

// The bracket-and-bar mark that separates fields on a cheque's code line.
function TransitMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 8 12"
      className="text-ink-muted h-3 w-2 shrink-0"
      fill="currentColor"
    >
      <rect x="0" y="0" width="2" height="12" />
      <rect x="3.5" y="0" width="1.5" height="5" />
      <rect x="3.5" y="7" width="1.5" height="5" />
      <rect x="6.5" y="3" width="1.5" height="6" />
    </svg>
  );
}

// One reserved line under the hero actions on wide screens, so nothing moves
// when the saved invoice count arrives: returning visitors get a way back to
// their work, and a browser that refuses storage gets told what that means and
// how to fix it.
function SavedInvoicesNote({ count }: { count: number | "blocked" | null }) {
  if (count === "blocked") {
    return (
      <p className="hero-fade-up text-ink-muted mt-4 flex max-w-[48ch] items-start gap-2 text-sm text-pretty">
        <IconAlertTriangle
          className="text-warning mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <span>
          This browser is blocking storage, so invoices can’t be saved here. You
          can still make one and download the PDF. To save them, leave private
          browsing or allow this site to store data, then reload.
        </span>
      </p>
    );
  }

  if (typeof count !== "number" || count === 0) {
    return <div aria-hidden className="mt-4 hidden h-10 lg:block" />;
  }

  return (
    <Link
      to="/create"
      search={{ open: "invoices" }}
      className={cn(
        "group hero-fade-up rounded-control text-ink-muted hover:text-ink mt-4 inline-flex h-10 items-center gap-1.5 text-sm",
        COLOR_TRANSITION,
        FOCUS_RING
      )}
    >
      <span>
        {count === 1
          ? "You have 1 invoice saved in this browser."
          : `You have ${count} invoices saved in this browser.`}{" "}
        <span className="text-brand-700 decoration-brand-300 group-hover:decoration-brand-700 font-medium underline underline-offset-4">
          Open your invoices
        </span>
      </span>
      <IconArrowRight className="text-brand-700 size-4" aria-hidden="true" />
    </Link>
  );
}

/**
 * The sample invoice slip: a pre-printed form, set in engraved capitals, that
 * the visitor fills in. What they type and the typeface they pick are theirs;
 * the red numbering-machine counter is the browser's own count of requests to
 * other websites, and it stays at 000 while they type. The typeface carries
 * into the editor through every Create invoice link; the typed name stays on
 * this page.
 */
function SpecimenInvoice({
  font,
  onFontChange,
  tally
}: {
  font: InvoiceFont;
  onFontChange: (font: InvoiceFont) => void;
  tally: ReturnType<typeof useRequestTally>;
}) {
  const isHydrated = useIsHydrated();
  const [clientName, setClientName] = useState("");
  const fontDefinition = getInvoiceFontDefinition(font);
  const dueDate = format(addDays(new Date(), 14), "d MMM yyyy");

  return (
    <figure
      aria-label="Example invoice made with billsend"
      className="hero-card rounded-surface shadow-floating border-ink/15 relative flex flex-col self-start border bg-white"
      style={{
        animationDelay: "0.3s",
        backgroundImage: SLIP_UNDERPRINT,
        fontFamily: fontDefinition.cssFamily,
        letterSpacing: fontDefinition.letterSpacing
      }}
    >
      <div className="flex flex-col gap-5 px-5 pt-5 pb-5 sm:px-7">
        <div className="flex items-start justify-between gap-4">
          <span className={cn(ENGRAVED, "text-ink text-lg font-bold")}>
            INVOICE
          </span>
          <span className="flex items-baseline gap-1.5">
            <span className={cn(FORM_LABEL, "text-ink-muted")}>No.</span>
            <span
              className={cn(
                NUMBERING,
                "text-numbering text-2xl leading-none font-bold"
              )}
            >
              0043
            </span>
          </span>
        </div>
        <label className="flex flex-col gap-2">
          <span className={cn(FORM_LABEL, "text-ink-muted")}>Bill to</span>
          <input
            type="text"
            value={clientName}
            onChange={event => setClientName(event.target.value)}
            placeholder="Try it: type a client’s name"
            autoComplete="off"
            spellCheck={false}
            className="border-ink/65 text-ink placeholder:text-ink-muted/80 focus:border-brand-600 focus-visible:bg-brand-50/60 h-11 w-full border-0 border-b border-dashed bg-transparent px-0 text-xl outline-none"
          />
        </label>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="flex flex-col gap-2">
            <span className={cn(FORM_LABEL, "text-ink-muted")}>For</span>
            <span className="text-ink text-base">
              Illustrations and cover artwork
            </span>
            <span
              className="text-ink-muted text-sm tabular-nums"
              suppressHydrationWarning
            >
              Due {dueDate}
            </span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={cn(FORM_LABEL, "text-ink-muted")}>Amount</span>
            <span className="border-ink/30 text-ink rounded-surface border bg-white px-3 py-1.5 text-xl font-semibold tabular-nums">
              €2,475.00
            </span>
          </div>
        </div>
        <TypefaceSwitch
          font={font}
          onFontChange={onFontChange}
          isHydrated={isHydrated}
        />
      </div>
      <RequestCounter tally={tally} />
    </figure>
  );
}

function TypefaceSwitch({
  font,
  onFontChange,
  isHydrated
}: {
  font: InvoiceFont;
  onFontChange: (font: InvoiceFont) => void;
  isHydrated: boolean;
}) {
  if (!isHydrated) {
    return (
      <p className="text-ink-muted font-geist flex min-h-11 items-center text-sm tracking-normal">
        Set your invoice in any of ten fonts in the editor.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span id="specimen-typeface" className={cn(FORM_LABEL, "text-ink-muted")}>
        Typeface
      </span>
      <div
        role="group"
        aria-labelledby="specimen-typeface"
        className="border-ink/45 rounded-control flex items-center border bg-white p-0.5"
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
                "rounded-surface h-8 px-2.5 text-sm pointer-coarse:h-11",
                COLOR_TRANSITION,
                FOCUS_RING,
                isActive
                  ? "bg-ink text-white"
                  : "text-ink-muted hover:bg-tint-deep hover:text-ink"
              )}
              style={{
                fontFamily: getInvoiceFontDefinition(previewFont.id).cssFamily
              }}
            >
              {previewFont.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// The slip's perforated counterfoil: the numbering machine's live reading of
// requests to other websites, with the rest of the browser's count in the
// caption. Until the browser has counted, it shows blank wheels rather than a
// number it hasn't measured.
function RequestCounter({
  tally
}: {
  tally: ReturnType<typeof useRequestTally>;
}) {
  return (
    <dl className="border-perforation font-geist flex flex-col gap-2 border-t-2 border-dashed px-5 py-4 tracking-normal sm:px-7">
      <div className="flex items-center justify-between gap-4">
        <dt className={cn(FORM_LABEL, "text-ink")}>
          Requests to other websites
        </dt>
        <dd
          className={cn(
            NUMBERING,
            "text-numbering shrink-0 text-5xl leading-none font-bold"
          )}
        >
          {tally.status === "counting" ? (
            formatSerial(tally.elsewhere)
          ) : (
            <span aria-label="Not counted yet" className="text-ink/25">
              –––
            </span>
          )}
        </dd>
      </div>
      <p className="text-ink-muted text-xs text-pretty">
        {tally.status === "counting"
          ? `Counted live since this page opened. Background requests: ${formatSerial(tally.data)}.`
          : tally.status === "unsupported"
            ? "Your browser can’t count them here; the checks below still work."
            : "Counted live by your browser since this page opened."}
      </p>
    </dl>
  );
}

/**
 * The privacy checks, flooded in intaglio blue: four plain verbs a visitor can
 * act on, in the order they can act on them, beside the band's medallion, then
 * the one honest note about keeping a copy.
 */
function Privacy() {
  return (
    <section
      id="privacy"
      className="bg-brand-800 relative scroll-mt-16 overflow-hidden text-white"
      style={{ backgroundImage: BAND_UNDERPRINT }}
    >
      <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <h2
            className={cn(
              ENGRAVED,
              "text-4xl leading-[1.02] font-semibold tracking-[-0.025em] text-balance sm:text-5xl"
            )}
          >
            Privacy you can check yourself.
          </h2>
          <p className="text-brand-100 max-w-[42ch] text-lg text-pretty">
            Don’t take our word for it. Most of these take under a minute, and
            three of the four work on a phone.
          </p>
          <Rosette className="text-brand-500/60 hidden size-72 self-center lg:mt-4 lg:block" />
        </div>
        <ol className="flex flex-col">
          {CHECKS.map(check => (
            <li
              key={check.title}
              className="border-brand-400/50 flex flex-col gap-2 border-t-2 border-dashed py-6 last:border-b-2"
            >
              <h3
                className={cn(
                  ENGRAVED,
                  "text-lg leading-snug font-semibold sm:text-xl"
                )}
              >
                {check.title}
              </h3>
              <p className="text-brand-100 max-w-[60ch] text-base text-pretty">
                {check.description}
              </p>
              {check.detail && (
                <details className="group">
                  <summary
                    className={cn(
                      "rounded-control decoration-brand-300 inline-flex min-h-10 cursor-pointer list-none items-center text-sm font-medium text-white underline underline-offset-4 pointer-coarse:min-h-11 [&::-webkit-details-marker]:hidden",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    )}
                  >
                    {check.detail.summary}
                  </summary>
                  <p className="text-brand-100 max-w-[60ch] pt-1 text-sm text-pretty">
                    {check.detail.text}
                  </p>
                </details>
              )}
              {check.link && (
                <a
                  href={check.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "rounded-control decoration-brand-300 inline-flex min-h-10 items-center gap-1 self-start text-sm font-medium text-white underline underline-offset-4 hover:decoration-white pointer-coarse:min-h-11",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
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
        </ol>
        <p className="text-brand-100 max-w-[68ch] text-base text-pretty lg:col-span-2">
          <span className="font-semibold text-white">Keep a copy.</span> Your
          invoices are saved in this browser, on this device: clearing this
          browser’s site data deletes them, and other browsers can’t see them.
          To back them up or move them, choose Export Data from the editor’s
          File menu. The file includes your bank details, so store it somewhere
          safe.
        </p>
      </div>
    </section>
  );
}

function TourMarker({ marker }: { marker: number }) {
  return (
    <span
      aria-hidden
      className={cn(
        NUMBERING,
        "text-numbering block w-6 shrink-0 text-center text-2xl leading-none font-bold"
      )}
    >
      {marker}
    </span>
  );
}

// Pins a numbered marker into the paper's left margin beside the part of the
// invoice a tour note describes. Below `lg` the note follows that part on a
// perforated strip torn across the sheet, set on the tinted paper outside the
// invoice, so a phone keeps the numbers beside their notes and the invoice
// text stays the invoice's.
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
    <div className="flex flex-col gap-4">
      <div className={cn("relative", className)}>
        <span className="absolute top-0 -left-8 sm:-left-10">
          <TourMarker marker={marker} />
        </span>
        {children}
      </div>
      {note && (
        <div className="bg-tint border-perforation font-geist -mr-6 -ml-11 border-y-2 border-dashed py-4 pr-6 pl-11 tracking-normal sm:-mr-10 sm:-ml-14 sm:pr-10 sm:pl-14 lg:hidden">
          <div className="flex flex-col gap-1">
            <span className="text-ink text-sm font-semibold">{note.title}</span>
            <span className="text-ink-muted text-sm text-pretty">
              {note.description}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * The product, shown rather than listed: a full invoice (another client,
 * another currency, reverse-charge VAT and a discount, set in Lora) with red
 * serial markers in its margin, and the notes on a perforated counterfoil
 * beside it on wide screens or on strips torn across it on narrow ones.
 */
function Tour() {
  const lora = getInvoiceFontDefinition("lora");
  const today = new Date();
  const issueDate = format(today, "d MMM yyyy");
  const dueDate = format(addDays(today, 14), "d MMM yyyy");

  return (
    <section id="features" className="scroll-mt-16 px-6 py-20 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="flex max-w-3xl flex-col gap-5">
          <h2 className={cn(HEADLINE, "text-4xl leading-[1.02] sm:text-5xl")}>
            Features for the invoice you send today.
          </h2>
          <p className="text-ink-muted max-w-[56ch] text-lg text-pretty">
            For freelancers and anyone with a side project who needs to bill a
            client, not set up accounting software. Save any invoice as a
            template and the next one for that client starts from it.
          </p>
        </div>
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <figure
            aria-label="Example invoice in euros with reverse-charge VAT and a discount"
            className="rounded-surface shadow-floating border-ink/15 text-ink flex flex-col gap-6 border bg-white py-7 pr-6 pl-11 text-sm sm:py-9 sm:pr-10 sm:pl-14"
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
                <dl className="grid grid-cols-[auto_auto] gap-x-3 gap-y-0.5 text-xs whitespace-nowrap tabular-nums sm:gap-x-4">
                  <dt className="text-ink-muted">Invoice No.</dt>
                  <dd>INV-0043</dd>
                  <dt className="text-ink-muted">Date</dt>
                  <dd suppressHydrationWarning>{issueDate}</dd>
                  <dt className="text-ink-muted">Due date</dt>
                  <dd suppressHydrationWarning>{dueDate}</dd>
                </dl>
              </div>
              <span
                aria-hidden
                className="rounded-surface font-geist bg-ink flex size-12 shrink-0 items-center justify-center text-sm font-semibold tracking-normal text-white"
              >
                MO
              </span>
            </MarkedRegion>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-medium">From</span>
                <span className="text-ink-muted">
                  Maya Okafor
                  <br />
                  London
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-medium">To</span>
                <span className="text-ink-muted">
                  Kanal & Co. GmbH
                  <br />
                  Berlin
                  <br />
                  VAT ID DE123456789
                </span>
              </div>
            </div>
            <MarkedRegion marker={2}>
              <div className="rounded-surface border-ink/15 flex flex-col overflow-hidden border">
                <div className="bg-tint grid grid-cols-[minmax(0,1fr)_1.75rem_5.5rem] gap-2 px-3 py-2 text-xs font-medium">
                  <span>Description</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Amount</span>
                </div>
                {TOUR_LINES.map(line => (
                  <div
                    key={line.description}
                    className="border-ink/15 grid grid-cols-[minmax(0,1fr)_1.75rem_5.5rem] gap-2 border-t px-3 py-2 tabular-nums"
                  >
                    <span>{line.description}</span>
                    <span className="text-center">{line.quantity}</span>
                    <span className="text-right">{line.amount}</span>
                  </div>
                ))}
              </div>
            </MarkedRegion>
            <MarkedRegion
              marker={3}
              className="flex flex-col items-end tabular-nums"
            >
              <div className="flex w-full max-w-64 flex-col gap-1.5">
                <TourTotalRow label="Subtotal" value="€2,750.00" />
                <TourTotalRow label="Discount (10%)" value="−€275.00" />
                <TourTotalRow label="VAT" value="Reverse charge" />
                <div className="border-ink/15 mt-1.5 flex items-baseline justify-between border-t pt-2">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-semibold">€2,475.00</span>
                </div>
              </div>
            </MarkedRegion>
            <div className="border-ink/15 border-t pt-4">
              <MarkedRegion marker={4} className="flex flex-col gap-1 text-xs">
                <span className="font-medium">Payment details</span>
                <span className="text-ink-muted tabular-nums">
                  IBAN DE89 3704 0044 0532 0130 00
                  <br />
                  BIC COBADEFFXXX
                </span>
              </MarkedRegion>
            </div>
          </figure>
          <ol className="rounded-surface border-ink/15 hidden flex-col border bg-white/60 lg:flex">
            {TOUR_NOTES.map(note => (
              <li
                key={note.marker}
                className="border-perforation grid grid-cols-[auto_minmax(0,1fr)] gap-4 border-t-2 border-dashed px-5 py-6 first:border-t-0 sm:px-7"
              >
                <TourMarker marker={note.marker} />
                <div className="flex flex-col gap-2">
                  <h3
                    className={cn(
                      HEADLINE,
                      "text-xl leading-tight sm:text-2xl"
                    )}
                  >
                    {note.title}
                  </h3>
                  <p className="text-ink-muted max-w-[52ch] text-base text-pretty">
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
      <span className="text-ink-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Questions() {
  return (
    <section id="questions" className="scroll-mt-16 pb-20 sm:pb-24">
      <Microprint text={MICROPRINT_TEXT} className="text-ink/35" />
      <div className="mx-auto grid max-w-6xl items-start gap-10 px-6 pt-20 sm:pt-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16">
        <h2
          className={cn(
            HEADLINE,
            "text-4xl leading-[1.02] sm:text-5xl lg:col-start-1 lg:row-start-1"
          )}
        >
          Questions before you start.
        </h2>
        <div className="flex flex-col gap-10 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {QUESTION_GROUPS.map(group => (
            <div key={group.title} className="flex flex-col gap-3">
              <h3 className={cn(FORM_LABEL, "text-ink-muted")}>
                {group.title}
              </h3>
              <div className="border-perforation flex flex-col border-b-2 border-dashed">
                {group.questions.map(item => (
                  <details
                    key={item.question}
                    className="group border-perforation border-t-2 border-dashed"
                  >
                    <summary
                      className={cn(
                        "rounded-control text-ink flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium [&::-webkit-details-marker]:hidden",
                        FOCUS_RING
                      )}
                    >
                      {item.question}
                      <IconPlus
                        className="text-ink size-5 shrink-0 transition-transform duration-200 group-open:rotate-45"
                        stroke={2.25}
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="text-ink-muted max-w-[60ch] pb-5 text-base text-pretty">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex max-w-[40ch] flex-col gap-2 lg:col-start-1 lg:row-start-2">
          <p className="text-ink-muted text-base text-pretty">
            Something else, or found a bug? Open an issue on GitHub; you’ll need
            a free GitHub account to post.
          </p>
          <a
            href={`${SOURCE_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-brand-700 decoration-brand-300 hover:decoration-brand-700 rounded-control inline-flex min-h-10 items-center gap-1 self-start text-base font-medium underline underline-offset-4 pointer-coarse:min-h-11",
              COLOR_TRANSITION,
              FOCUS_RING
            )}
          >
            Ask a question on GitHub
            <IconArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// The close is a cheque book's counterfoil: the stub you keep is filled in for
// the next invoice, and the action sits where the cheque would be signed.
function Closing({ font }: { font: InvoiceFont }) {
  const fontName = getInvoiceFontDefinition(font).name;

  return (
    <section className="px-4 pb-24 sm:px-6 sm:pb-28">
      <div
        className="rounded-surface shadow-floating border-ink/15 mx-auto grid max-w-6xl overflow-hidden border bg-white md:grid-cols-[14rem_minmax(0,1fr)]"
        style={{ backgroundImage: SLIP_UNDERPRINT }}
      >
        <div className="border-perforation flex flex-row flex-wrap items-baseline gap-x-8 gap-y-4 border-b-2 border-dashed px-6 py-5 md:flex-col md:gap-y-6 md:border-r-2 md:border-b-0 md:py-8">
          <span className="flex items-baseline gap-1.5">
            <span className={cn(FORM_LABEL, "text-ink-muted")}>No.</span>
            <span
              className={cn(
                NUMBERING,
                "text-numbering text-2xl leading-none font-bold"
              )}
            >
              0001
            </span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className={cn(FORM_LABEL, "text-ink-muted")}>To</span>
            <span className="text-ink text-sm">Your next client</span>
          </span>
          <span className="flex flex-col gap-1.5">
            <span className={cn(FORM_LABEL, "text-ink-muted")}>Kept by</span>
            <span className="text-ink text-sm">You, on this device</span>
          </span>
        </div>
        <div className="flex flex-col items-start gap-8 px-6 py-10 sm:px-10 md:py-14 lg:flex-row lg:items-end lg:justify-between">
          <h2 className={cn(HEADLINE, "text-4xl leading-[1.02] sm:text-5xl")}>
            Your next invoice starts here.
          </h2>
          <div className="flex w-full shrink-0 flex-col items-start gap-3 sm:w-auto lg:items-end">
            <CreateInvoiceLink
              size="lg"
              font={font}
              id={CLOSING_CTA_ID}
              className="max-sm:h-12 max-sm:w-full max-sm:px-5 max-sm:text-sm"
            />
            <p className="text-ink-muted text-sm">
              {font === DEFAULT_FONT
                ? "Free. Opens straight into the editor."
                : `Free. Opens straight into the editor, set in ${fontName}.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="text-ink-muted pb-24 text-sm md:pb-0">
      <Microprint
        text={MICROPRINT_TEXT}
        className="text-ink/35 border-ink/10 border-t pt-px"
      />
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
        "rounded-control hover:text-ink inline-flex min-h-10 items-center pointer-coarse:min-h-11",
        COLOR_TRANSITION,
        FOCUS_RING
      )}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
