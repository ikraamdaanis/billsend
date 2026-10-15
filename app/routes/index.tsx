import interFont from "@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2?url";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconCloudOff,
  IconCode,
  IconEyeOff,
  IconMenu2,
  IconPlus,
  IconUserOff,
  IconX
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ComponentType, CSSProperties, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import {
  EditorWindow,
  getTitleStyle,
  InvoicePage,
  PAGE_HEIGHT,
  PAGE_WIDTH,
  ScaledFrame,
  TRY_IT_SAMPLE
} from "~/components/home/editor-preview";
import {
  DEMO_FONTS,
  getClosingRender,
  HERO_INVOICE_NUMBER,
  PDF_RENDER_SCALE,
  PDF_RENDERS
} from "~/components/home/pdf-renders";
import { formatCurrencyWithCode } from "~/consts/currencies";
import { getInvoiceFontDefinition } from "~/consts/invoice-fonts";
import { typeClass } from "~/lib/type-scale";
import { cn } from "~/lib/utils";
import type { InvoiceFont } from "~/types";

export const Route = createFileRoute("/")({
  component: HomePage,
  // The homepage is set in Inter, so its latin subset preloads here rather
  // than in the root head, where every route would download it.
  head: () => ({
    links: [
      {
        rel: "preload",
        href: interFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous"
      }
    ]
  })
});

const SOURCE_URL = "https://github.com/ikraamdaanis/billsend";

const DEFAULT_FONT: InvoiceFont = "geist";

const CONTAINER = "mx-auto max-w-6xl px-6 lg:px-8";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

const TEXT_LINK = cn(
  "inline-flex items-center gap-1 rounded-sm font-medium text-zinc-950 hover:text-brand-600",
  typeClass("body"),
  FOCUS_RING
);

// Headlines use Inter's Display optical size, which the browser picks up from
// the opsz axis at large sizes. Sizes come from the type roles, which the
// homepage sets at marketing values through `.home-type`.
const HEADING = "font-semibold tracking-tight text-balance";

// Single-line controls: buttons, labels, nav links.
const CONTROL_TEXT = typeClass("body", "compact");

// Balanced so short copy never ends on a stub of a line; past six lines
// browsers fall back to normal wrapping.
const BODY_TEXT = cn("text-balance text-zinc-600", typeClass("body"));

const SECTIONS = [
  { href: "#try-it", label: "Try it" },
  { href: "#privacy", label: "Privacy" },
  { href: "#features", label: "Features" },
  { href: "#questions", label: "Questions" }
];

const CURRENCIES = ["USD", "EUR", "GBP", "CHF"] as const;

type Currency = (typeof CURRENCIES)[number];

// The privacy promise in four words, checked further down the page. Features
// get their own section, so they stay out of this strip.
const FACTS: { label: string; icon: ComponentType<{ className?: string }> }[] =
  [
    { label: "No account", icon: IconUserOff },
    { label: "No uploads", icon: IconCloudOff },
    { label: "No analytics", icon: IconEyeOff },
    { label: "Open source", icon: IconCode }
  ];

// Each feature shows a fragment of a real invoice rather than an icon.
// A specimen that is a crop of a PDF page sits on the editor's desk, so the
// paper's edge reads, and runs off the card where it was cut.
const FEATURES: {
  title: string;
  description: string;
  specimen: ReactNode;
  isPageCrop?: boolean;
}[] = [
  {
    title: "Your logo, your type",
    description:
      "Upload your logo and set the whole invoice in any of ten fonts, at three sizes.",
    specimen: <TypeSpecimen />
  },
  {
    title: "Any currency",
    description:
      "Choose the currency for each invoice, with custom symbols when you need them.",
    specimen: <CurrencySpecimen />
  },
  {
    title: "Tax, fees and discounts",
    description:
      "Add VAT or sales tax, fees, and a fixed or percentage discount. billsend does the sums, taxing the amount after any discount.",
    specimen: <TotalsSpecimen />,
    isPageCrop: true
  },
  {
    title: "Payment details clients can use",
    description:
      "Bank name, account and routing numbers, IBAN, BIC / SWIFT and sort code, laid out so your client can pay without asking.",
    specimen: <PaymentSpecimen />,
    isPageCrop: true
  }
];

// The rest of what the editor does, too small for a card each.
const MORE_FEATURES = [
  "Templates for repeat clients",
  "Import and export backups",
  "Shipping address",
  "PO number and service period",
  "Notes and terms",
  "Late payment terms",
  "Tax-exempt invoices",
  "Amount paid and balance due"
];

// The checks, in the order a visitor can make them.
const CHECKS: {
  title: string;
  description: string;
  detail?: { summary: string; text: string };
  link?: { href: string; label: string };
}[] = [
  {
    title: "Search for a sign-up",
    description:
      "There’s no sign-up form, password or email field anywhere in billsend, so there’s no account for your invoices to sit in."
  },
  {
    title: "Ask your browser",
    description:
      "Every billsend page tells your browser to block it from loading anything from, or sending data to, any other website. Your browser enforces that rule, not billsend.",
    detail: {
      summary: "See the rule on a computer",
      text: "Open your browser’s developer tools, choose the Network tab and reload the page. Select the first request and look for content-security-policy under Response Headers."
    }
  },
  {
    title: "Read the code",
    description:
      "billsend’s code is public on GitHub, so anyone can check exactly what it does with your data.",
    link: { href: SOURCE_URL, label: "View the code" }
  }
];

// What a visitor would otherwise reach for. The other columns describe the
// typical tool of each kind, not any one product, and a cell that varies says
// so rather than claim a tick or a cross.
// Short labels fit the narrow value columns on phones.
const COMPARISON_COLUMNS = [
  { label: "billsend", shortLabel: "billsend" },
  { label: "Online invoice generators", shortLabel: "Generators" },
  { label: "Accounting software", shortLabel: "Accounting" }
];

// One row per feature at every width: the label, then one value column per
// entry in the columns list (`--comparison-columns`, set on the table). The
// columns share the width in proportion, label first: 1.3 under 400px so the
// short headers fit, 1.5 on larger phones, 2 from `md`. Proportions rather
// than fixed widths keep the label readable when the text size goes up.
const COMPARISON_GRID =
  "grid grid-cols-[minmax(0,1.3fr)_repeat(var(--comparison-columns),minmax(0,1fr))] min-[400px]:grid-cols-[minmax(0,1.5fr)_repeat(var(--comparison-columns),minmax(0,1fr))] md:grid-cols-[minmax(0,2fr)_repeat(var(--comparison-columns),minmax(0,1fr))]";

// A cell is a tick, a cross, or one short word where tools vary; longer
// phrases wrap into tall rows in the narrow phone columns.
type ComparisonValue = boolean | "Some" | "Paid" | "Varies";

// One value per column, in column order. Keep labels to about 35 characters so
// a phone shows them in two or three lines.
const COMPARISON_ROWS: {
  label: string;
  cells: [ComparisonValue, ComparisonValue, ComparisonValue];
}[] = [
  { label: "Free, with no paid plan", cells: [true, "Some", false] },
  { label: "No account needed", cells: [true, "Some", false] },
  { label: "Invoice data stays on your device", cells: [true, false, false] },
  { label: "No watermark on the PDF", cells: [true, "Some", true] },
  { label: "Open source", cells: [true, false, false] },
  { label: "Sends invoices and tracks payment", cells: [false, "Some", true] }
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
          "In this browser, on this device. Clearing this browser’s site data deletes them, and other browsers can’t see them. To back them up or move them, choose Export Data from the editor’s File menu; the file includes your bank details, so keep it somewhere safe."
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

function HomePage() {
  const [font, setFont] = useState<InvoiceFont>(DEFAULT_FONT);

  return (
    <div className="home-type selection:bg-brand-100 isolate min-h-svh bg-white font-sans font-features-['cv02','cv03','cv04','cv11'] text-zinc-950 antialiased">
      <a
        href="#main"
        className={cn(
          "fixed top-3 left-3 z-60 -translate-y-16 rounded-full bg-white px-4 py-2 font-medium shadow-lg ring-1 ring-zinc-950/10 focus:translate-y-0",
          CONTROL_TEXT,
          FOCUS_RING
        )}
      >
        Skip to content
      </a>
      <SiteHeader font={font} />
      <main id="main" className="overflow-x-clip">
        <Hero font={font} />
        <TryIt font={font} onFontChange={setFont} />
        <div className="border-y border-zinc-950/5 bg-zinc-50">
          <Privacy />
          <Comparison />
        </div>
        <Features />
        <Questions />
        <Closing font={font} />
      </main>
      <SiteFooter />
    </div>
  );
}

// The wordmark: the name in Geist, filled top to bottom with the app icon's
// gradient (#1a78e0 to brand-600, #005fca). leading-none fits the fill to the
// letters rather than the taller line box.
function Wordmark() {
  return (
    <Link
      to="/"
      aria-label="Homepage"
      className={cn(
        "font-geist flex items-center rounded-md text-lg font-semibold tracking-tight",
        FOCUS_RING
      )}
    >
      <span className="to-brand-600 dark:from-brand-200 dark:to-brand-400 bg-linear-to-b from-[#1a78e0] bg-clip-text leading-none text-transparent">
        billsend
      </span>
    </Link>
  );
}

function SiteHeader({ font }: { font: InvoiceFont }) {
  return (
    <header>
      <div className={cn(CONTAINER, "flex h-16 items-center gap-4")}>
        <div className="flex flex-1 items-center">
          <Wordmark />
        </div>
        <nav
          aria-label="Sections"
          className="flex items-center gap-1 max-md:hidden"
        >
          {SECTIONS.map(section => (
            <a
              key={section.href}
              href={section.href}
              className={cn(
                "rounded-full px-3 py-2 text-zinc-600 hover:text-zinc-950",
                CONTROL_TEXT,
                FOCUS_RING
              )}
            >
              {section.label}
            </a>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-1">
          <HeaderAction font={font} />
          <PhoneMenu />
        </div>
      </div>
    </header>
  );
}

// Below `md` the section links fold into a native disclosure, so they work
// before hydration. Once hydrated it also closes on Escape or a tap outside,
// like any menu.
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
          "flex size-11 cursor-pointer list-none items-center justify-center rounded-full [&::-webkit-details-marker]:hidden",
          FOCUS_RING
        )}
      >
        <IconMenu2 className="size-6 shrink-0" aria-hidden="true" />
        <span className="sr-only">Sections</span>
      </summary>
      <nav
        aria-label="Sections"
        className="absolute top-full right-0 z-10 mt-2 flex w-56 flex-col rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-zinc-950/10"
      >
        {SECTIONS.map(section => (
          <a
            key={section.href}
            href={section.href}
            onClick={() => setIsOpen(false)}
            className={cn(
              "rounded-lg px-3 py-3 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950",
              CONTROL_TEXT,
              FOCUS_RING
            )}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </details>
  );
}

// The page's one primary action, shaped the same everywhere it appears: a slim
// deep-navy button (the brand's darkest blue), its label in Geist. It carries the
// typeface picked in the sample invoice into the editor.
function CreateInvoiceLink({ font }: { font: InvoiceFont }) {
  return (
    <Link
      to="/create"
      search={{ font: font === DEFAULT_FONT ? undefined : font }}
      preload="viewport"
      className={cn(
        "bg-brand-900 hover:bg-brand-800 font-geist relative inline-flex shrink-0 items-center rounded-md px-3.5 py-2 font-medium whitespace-nowrap text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.16)] transition-colors",
        typeClass("caption"),
        FOCUS_RING
      )}
    >
      Create invoice
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
      />
    </Link>
  );
}

// The header's way into the editor: a quiet text link, so it never repeats
// the hero's button right below it. Phones skip it: the hero's button is the
// first thing under the header, and the link would crowd the menu button.
function HeaderAction({ font }: { font: InvoiceFont }) {
  return (
    <Link
      to="/create"
      search={{ font: font === DEFAULT_FONT ? undefined : font }}
      className={cn(
        "hover:text-brand-600 relative inline-flex items-center gap-1 rounded-sm px-1 py-2 font-medium whitespace-nowrap text-zinc-950 max-sm:hidden",
        CONTROL_TEXT,
        FOCUS_RING
      )}
    >
      Open the editor
      <IconArrowRight className="size-4 shrink-0" aria-hidden="true" />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 size-[max(100%,3rem)] -translate-1/2 pointer-fine:hidden"
      />
    </Link>
  );
}

function SectionHeading({
  title,
  description,
  isCentered = false
}: {
  title: ReactNode;
  description: ReactNode;
  isCentered?: boolean;
}) {
  if (isCentered) {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <h2 className={cn(HEADING, typeClass("title"), "max-w-[35ch]")}>
          {title}
        </h2>
        <p className={cn(BODY_TEXT, "max-w-[48ch]")}>{description}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
      <h2 className={cn(HEADING, typeClass("title"), "max-w-[35ch]")}>
        {title}
      </h2>
      <p className={cn(BODY_TEXT, "max-w-[48ch] lg:max-w-[40ch]")}>
        {description}
      </p>
    </div>
  );
}

function Hero({ font }: { font: InvoiceFont }) {
  return (
    <section className="pt-12 sm:pt-20">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 xl:flex-row xl:justify-between xl:gap-16">
          <h1
            className={cn(
              HEADING,
              typeClass("display"),
              "hero-fade-up max-w-[20ch]"
            )}
          >
            <span className="block">Send the invoice.</span>
            <span className="text-brand-600 block">Keep everything else.</span>
          </h1>
          <div className="hero-fade-up flex flex-col items-start gap-6 [animation-delay:100ms] xl:justify-between">
            <p className={cn(BODY_TEXT, "max-w-[48ch] text-balance")}>
              A free invoice maker that runs in your browser. No account, no
              upload, and your clients and bank details stay on your device.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <CreateInvoiceLink font={font} />
              <a href="#try-it" className={cn(TEXT_LINK, "max-md:hidden")}>
                Try the sample invoice
              </a>
            </div>
          </div>
        </div>
        <HeroVisual />
        <SavedInvoicesNote />
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-zinc-950/10 py-8 lg:grid-cols-4">
          {FACTS.map(fact => (
            <li
              key={fact.label}
              className={cn(
                "flex items-center gap-2 font-medium text-zinc-700",
                CONTROL_TEXT
              )}
            >
              <fact.icon
                className="size-5 shrink-0 text-zinc-400 sm:size-4"
                aria-hidden="true"
              />
              {fact.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * The editor, shown rather than described: the real editor layout on a soft
 * blue backdrop, with a real billsend PDF of the invoice on its desk. From
 * `lg` the whole window sits centred in the 17:10 card. Below it the window
 * is drawn at a fixed zoom, the same distance (--pad) from the card's top and
 * left edges, and runs off its right and bottom ones, so phones and tablets
 * see a readable crop of its top-left corner; phones get a taller card.
 */
function HeroVisual() {
  return (
    <div className="hero-fade-up bg-brand-100 relative mt-12 aspect-4/5 overflow-hidden rounded-xl ring-1 ring-zinc-950/10 [animation-delay:200ms] sm:mt-16 sm:aspect-17/10">
      <img
        src="/home/hero-sky.webp"
        alt=""
        width={1792}
        height={1008}
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      <figure
        aria-label="The billsend editor with a sample invoice"
        className="relative pt-(--pad) pl-(--pad) [--pad:--spacing(5)] sm:[--pad:--spacing(10)] lg:px-(--pad) lg:[--pad:--spacing(16)]"
      >
        <div className="w-[calc(1024px*var(--zoom))] [--zoom:0.6] sm:[--zoom:0.7] md:[--zoom:0.92] lg:hidden">
          <ScaledFrame
            {...HERO_WINDOW}
            fill
            className="rounded-tl-xl shadow-2xl"
          >
            <EditorWindow documentName={HERO_INVOICE_NUMBER} {...HERO_WINDOW}>
              <PdfPaper render={PDF_RENDERS.hero} />
            </EditorWindow>
          </ScaledFrame>
        </div>
        <ScaledFrame
          {...HERO_WINDOW}
          className="rounded-t-xl shadow-2xl max-lg:hidden"
        >
          <EditorWindow documentName={HERO_INVOICE_NUMBER} {...HERO_WINDOW}>
            <PdfPaper render={PDF_RENDERS.hero} />
          </EditorWindow>
        </ScaledFrame>
      </figure>
    </div>
  );
}

// The hero's editor window, drawn taller than any card shows so the card's
// foot always cuts it: the tallest need is a 639px phone, whose 4:5 card shows
// 1198px of window at 0.6. Each crop zoom is the smallest that still reaches
// the card's right edge at the top of its range (571px of window at 639px,
// 679px at 767px, 935px at 1023px).
const HERO_WINDOW = { width: 1024, height: 1240 };

/**
 * A real billsend PDF in the editor canvas's place: a screenshot of the top of
 * the page on the same paper, shown first thing, so it loads straight away.
 */
function PdfPaper({ render }: { render: typeof PDF_RENDERS.hero }) {
  return (
    <div
      className="border-paper-border bg-paper overflow-hidden border shadow-md"
      style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
    >
      <img
        src={render.src}
        alt=""
        width={render.width}
        height={Math.round(
          (render.width * render.crop.height) / render.crop.width
        )}
        fetchPriority="high"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}

// The page's figures: invoice details, line amounts and totals, up to the
// page's right edge.
const TRY_IT_PHONE_CROP = { x: 358, y: 296, width: 435.7, height: 511 };

const EDITOR_FONTS: InvoiceFont[] = ["geist", "lora", "jetbrains-mono"];

// Returning visitors get a way back to their work, and a browser that refuses
// storage gets told what that means and how to fix it.
function SavedInvoicesNote() {
  const count = useSavedInvoiceCount();

  if (count === "blocked") {
    return (
      <p className={cn(BODY_TEXT, "mt-6 flex items-start gap-2")}>
        <IconAlertTriangle
          className="size-5 h-lh shrink-0 text-amber-600 sm:size-4"
          aria-hidden="true"
        />
        This browser is blocking storage, so invoices can’t be saved here. You
        can still make one and download the PDF. To save them, leave private
        browsing or allow this site to store data, then reload.
      </p>
    );
  }

  if (typeof count !== "number" || count === 0) return null;

  return (
    <p className={cn(BODY_TEXT, "mt-6")}>
      {count === 1
        ? "You have 1 invoice saved in this browser."
        : `You have ${count} invoices saved in this browser.`}{" "}
      <Link
        to="/create"
        search={{ open: "invoices" }}
        className={cn(
          "text-brand-600 hover:text-brand-700 rounded-sm font-medium",
          FOCUS_RING
        )}
      >
        Open your invoices
      </Link>
    </p>
  );
}

// What happens after the sample, in the order a visitor does it.
const STEPS: { title: string; description: string }[] = [
  {
    title: "Add the details",
    description:
      "Your details, your client and the line items. billsend does the sums as you type."
  },
  {
    title: "Send the PDF",
    description:
      "Download an A4 PDF or print it, then send it to your client however you like."
  },
  {
    title: "Keep a copy",
    description:
      "Invoices and templates save in this browser, so a repeat client’s next invoice starts from the last one. Export a backup from the File menu whenever you want one elsewhere."
  }
];

/**
 * The sample invoice, made editable: what the visitor types and picks stays on
 * this page. The typeface carries into the editor through every Create invoice
 * link.
 */
function TryIt({
  font,
  onFontChange
}: {
  font: InvoiceFont;
  onFontChange: (font: InvoiceFont) => void;
}) {
  const [clientName, setClientName] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const formRef = useRef<HTMLFormElement>(null);

  // The form is server-rendered, so a visitor can type or pick before React
  // attaches. Hydration leaves those native edits on screen without firing
  // onChange, so adopt them once on mount rather than show one thing and use
  // another.
  useEffect(() => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const typedName = formData.get("client");
    const pickedFont = DEMO_FONTS.find(
      demoFont => demoFont === formData.get("typeface")
    );
    const pickedCurrency = CURRENCIES.find(
      option => option === formData.get("currency")
    );

    if (typeof typedName === "string") setClientName(typedName);
    if (pickedFont) onFontChange(pickedFont);
    if (pickedCurrency) setCurrency(pickedCurrency);
  }, []);

  return (
    <section id="try-it" className="py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title={
            <>
              <span className="max-md:hidden">Try it on this page.</span>
              <span className="md:hidden">Nothing leaves this page.</span>
            </>
          }
          description={
            <>
              <span className="max-md:hidden">
                Type a client’s name and change the typeface or currency. It all
                happens in your browser, and nothing you type is sent anywhere.
              </span>
              <span className="md:hidden">
                Everything you make in billsend stays in your browser. On a
                computer, you can edit this sample invoice right here.
              </span>
            </>
          }
        />
        <div className="mt-12 overflow-hidden rounded-xl bg-white ring-1 ring-zinc-950/10 sm:mt-16">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-zinc-950/10 px-6 py-5">
            <div className="flex flex-col">
              <p className={cn(typeClass("body"), "font-medium")}>
                Sample invoice
              </p>
              <p
                className={cn(typeClass("body"), "text-zinc-500 max-md:hidden")}
              >
                The typeface you pick opens with you in the editor.
              </p>
              <p className={cn(typeClass("body"), "text-zinc-500 md:hidden")}>
                As it looks in the editor.
              </p>
            </div>
            <Link
              to="/create"
              search={{ font: font === DEFAULT_FONT ? undefined : font }}
              className={TEXT_LINK}
            >
              Continue in the editor
            </Link>
          </div>
          <div className="grid lg:grid-cols-[20rem_minmax(0,1fr)]">
            <form
              ref={formRef}
              onSubmit={event => event.preventDefault()}
              className="flex flex-col gap-8 border-zinc-950/10 bg-zinc-50 p-6 max-lg:border-b max-md:hidden lg:border-r"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="demo-client"
                  className={cn(CONTROL_TEXT, "font-medium")}
                >
                  Bill to
                </label>
                <input
                  id="demo-client"
                  name="client"
                  type="text"
                  value={clientName}
                  onChange={event => setClientName(event.target.value)}
                  placeholder="Type a client’s name"
                  autoComplete="off"
                  spellCheck={false}
                  className={cn(
                    "focus-visible:outline-brand-600 rounded-lg bg-white px-3 py-2.5 ring-1 ring-zinc-950/10 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:-outline-offset-1 sm:py-2",
                    CONTROL_TEXT
                  )}
                />
              </div>
              <fieldset className="flex flex-col gap-2">
                <legend className={cn(CONTROL_TEXT, "font-medium")}>
                  Typeface
                </legend>
                <div className="mt-2 flex flex-col gap-2">
                  {DEMO_FONTS.map(demoFont => {
                    const definition = getInvoiceFontDefinition(demoFont);

                    return (
                      <label
                        key={demoFont}
                        className="has-checked:ring-brand-600 has-focus-visible:outline-brand-600 flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-white px-3 py-2.5 ring-1 ring-zinc-950/10 has-checked:ring-2 has-focus-visible:outline-2 has-focus-visible:outline-offset-2"
                      >
                        <span className="flex flex-col">
                          <span
                            className={cn(
                              typeClass("subtitle", "compact"),
                              "font-medium"
                            )}
                            style={{ fontFamily: definition.cssFamily }}
                          >
                            {definition.name}
                          </span>
                          <span
                            className={cn(
                              typeClass("caption"),
                              "text-zinc-500 capitalize"
                            )}
                          >
                            {definition.category.replace("-", " ")}
                          </span>
                        </span>
                        <input
                          type="radio"
                          name="typeface"
                          value={demoFont}
                          checked={font === demoFont}
                          onChange={() => onFontChange(demoFont)}
                          className="peer sr-only"
                        />
                        <IconCheck
                          className="text-brand-600 size-5 shrink-0 peer-not-checked:invisible sm:size-4"
                          aria-hidden="true"
                        />
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <fieldset className="flex flex-col gap-2">
                <legend className={cn(CONTROL_TEXT, "font-medium")}>
                  Currency
                </legend>
                <div className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-zinc-200/60 p-1">
                  {CURRENCIES.map(option => (
                    <label
                      key={option}
                      className={cn(
                        "has-focus-visible:outline-brand-600 flex cursor-pointer justify-center rounded-md py-2 font-medium text-zinc-600 has-checked:bg-white has-checked:text-zinc-950 has-checked:shadow-sm has-checked:ring-1 has-checked:ring-black/5 has-focus-visible:outline-2 sm:py-1.5",
                        CONTROL_TEXT
                      )}
                    >
                      <input
                        type="radio"
                        name="currency"
                        value={option}
                        checked={currency === option}
                        onChange={() => setCurrency(option)}
                        className="sr-only"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </fieldset>
            </form>
            <div className="flex min-w-0 items-start justify-center bg-zinc-100 p-(--pad) [--pad:--spacing(4)] sm:[--pad:--spacing(10)]">
              <ScaledFrame
                width={PAGE_WIDTH}
                height={PAGE_HEIGHT}
                className="shadow-md max-md:hidden"
              >
                <InvoicePage
                  invoice={{
                    ...TRY_IT_SAMPLE,
                    font,
                    currencyCode: currency,
                    clientName
                  }}
                />
              </ScaledFrame>
              <ScaledFrame
                {...TRY_IT_PHONE_CROP}
                fill
                className="-my-(--pad) -ml-(--pad) grow md:hidden"
              >
                <InvoicePage invoice={TRY_IT_SAMPLE} />
              </ScaledFrame>
            </div>
          </div>
        </div>
        <ol className="mt-10 grid gap-x-6 gap-y-8 sm:mt-12 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex flex-col gap-2">
              <h3
                className={cn(
                  typeClass("subtitle"),
                  "flex items-center gap-3 font-medium"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    typeClass("caption"),
                    "bg-brand-50 text-brand-600 flex size-7 shrink-0 items-center justify-center rounded-full font-semibold tabular-nums"
                  )}
                >
                  {index + 1}
                </span>
                {step.title}
              </h3>
              <p className={cn(BODY_TEXT, "max-w-[44ch]")}>
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title="What goes on the invoice."
          description="For freelancers and anyone with a side project who needs to bill a client, not set up accounting software."
        />
        <dl className="mt-12 grid gap-x-6 gap-y-12 sm:mt-16 md:grid-cols-2">
          {FEATURES.map(feature => (
            <div
              key={feature.title}
              className="row-span-2 grid grid-rows-subgrid gap-6"
            >
              <div
                aria-hidden="true"
                className={cn(
                  "flex items-center overflow-hidden rounded-xl p-(--pad) ring-1 ring-zinc-950/10 [--pad:--spacing(6)] sm:[--pad:--spacing(8)]",
                  feature.isPageCrop ? "bg-desk" : "min-h-48 bg-zinc-50"
                )}
              >
                {feature.specimen}
              </div>
              <div className="flex flex-col gap-2">
                <dt className={cn(typeClass("subtitle"), "font-medium")}>
                  {feature.title}
                </dt>
                <dd className={cn(BODY_TEXT, "max-w-[52ch]")}>
                  {feature.description}
                </dd>
              </div>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex flex-col gap-6 border-t border-zinc-950/10 pt-8 sm:mt-16">
          <h3 className={cn(typeClass("subtitle"), "font-medium")}>
            Also in the editor
          </h3>
          <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-4">
            {MORE_FEATURES.map(feature => (
              <li
                key={feature}
                className={cn(
                  "flex items-center gap-2 text-zinc-700",
                  CONTROL_TEXT
                )}
              >
                <IconCheck
                  className="text-brand-600 size-5 shrink-0 sm:size-4"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

// The invoice title in three of the editor's faces, set as the editor sets it.
function TypeSpecimen() {
  return (
    <div className="grid w-full grid-cols-3 gap-4">
      {EDITOR_FONTS.map(specimenFont => (
        <div key={specimenFont} className="flex flex-col gap-2">
          <p
            className="text-2xl sm:text-3xl"
            style={{ ...getTitleStyle(specimenFont), fontSize: undefined }}
          >
            Invoice
          </p>
          <p className={cn(typeClass("caption"), "text-zinc-500")}>
            {getInvoiceFontDefinition(specimenFont).name}
          </p>
        </div>
      ))}
    </div>
  );
}

// One total in four currencies, formatted by the editor's own formatter.
function CurrencySpecimen() {
  return (
    <ul className="font-geist flex w-full flex-col gap-2 text-lg font-semibold text-zinc-950 tabular-nums sm:text-xl">
      {[
        { symbol: "$", code: "USD" },
        { symbol: "€", code: "EUR" },
        { symbol: "£", code: "GBP" },
        { symbol: "¥", code: "JPY" }
      ].map(currency => (
        <li key={currency.code} className="whitespace-nowrap">
          {formatCurrencyWithCode(2475, currency.symbol, currency.code)}
        </li>
      ))}
    </ul>
  );
}

/**
 * A crop of a real billsend PDF, filling its container's width. The two
 * feature crops share an aspect ratio so their cards match.
 */
function PdfCrop({
  render,
  className
}: {
  render: (typeof PDF_RENDERS)[keyof typeof PDF_RENDERS];
  className?: string;
}) {
  return (
    <img
      src={render.src}
      alt=""
      width={Math.round(render.crop.width * PDF_RENDER_SCALE)}
      height={Math.round(render.crop.height * PDF_RENDER_SCALE)}
      loading="lazy"
      decoding="async"
      className={cn("block h-auto w-full max-w-none min-w-0 grow", className)}
    />
  );
}

// A print studio's totals with a 10% discount, New York City's 8.875% sales
// tax and a delivery fee. Cut from the middle of the page, it runs off the card
// on every side but the page's right edge.
function TotalsSpecimen() {
  return (
    <PdfCrop render={PDF_RENDERS.totals} className="-my-(--pad) -ml-(--pad)" />
  );
}

function PaymentSpecimen() {
  return (
    <PdfCrop render={PDF_RENDERS.payment} className="-my-(--pad) -mr-(--pad)" />
  );
}

function Privacy() {
  return (
    <section id="privacy" className="py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title="Check the privacy yourself."
          description="Don’t take our word for it. Each takes under a minute, and two of the three work on a phone."
        />
        <ol className="mt-12 grid gap-x-6 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {CHECKS.map(check => (
            <li
              key={check.title}
              className="flex flex-col gap-2 border-t border-zinc-950/10 pt-6"
            >
              <h3 className={cn(typeClass("subtitle"), "font-medium")}>
                {check.title}
              </h3>
              <p className={BODY_TEXT}>{check.description}</p>
              {check.detail && (
                <details className="group">
                  <summary
                    className={cn(
                      "hover:text-brand-600 inline-flex cursor-pointer list-none items-center gap-1 rounded-sm font-medium text-zinc-950 [&::-webkit-details-marker]:hidden",
                      typeClass("body"),
                      FOCUS_RING
                    )}
                  >
                    {check.detail.summary}
                    <IconPlus
                      className="size-4 shrink-0 transition-transform group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className={cn(BODY_TEXT, "pt-2")}>{check.detail.text}</p>
                </details>
              )}
              {check.link && (
                <a
                  href={check.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(TEXT_LINK, "self-start")}
                >
                  {check.link.label}
                  <IconArrowUpRight
                    className="size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Comparison() {
  const [ownColumn, ...otherColumns] = COMPARISON_COLUMNS;
  const tableLabel = `${ownColumn.label} compared with ${new Intl.ListFormat(
    "en",
    { type: "conjunction" }
  ).format(otherColumns.map(column => column.label.toLowerCase()))}`;

  return (
    <section id="compare" className="py-16 sm:py-20">
      <div className={CONTAINER}>
        <SectionHeading
          title="How billsend compares."
          description="billsend makes the invoice and stops there. To email invoices and track payments, you want accounting software."
          isCentered
        />
        <div
          role="table"
          aria-label={tableLabel}
          className="mx-auto mt-12 max-w-4xl sm:mt-16"
          style={
            {
              "--comparison-columns": COMPARISON_COLUMNS.length
            } as CSSProperties
          }
        >
          <div role="rowgroup">
            <div role="row" className={COMPARISON_GRID}>
              <span role="columnheader">
                <span className="sr-only">Feature</span>
              </span>
              {COMPARISON_COLUMNS.map((column, index) => (
                <span
                  key={column.label}
                  role="columnheader"
                  className={cn(
                    // Phones set the short headers small (11px under 400px,
                    // then 12px) so they fit the narrowest columns.
                    "flex items-end justify-center px-0.5 pt-4 pb-3 text-center text-[11px]/4 font-medium text-balance min-[400px]:px-1 min-[400px]:text-xs/4 sm:text-sm/5 md:px-4",
                    index === 0
                      ? "text-brand-700 rounded-t-xl bg-blue-50 font-semibold"
                      : "text-zinc-500"
                  )}
                >
                  <span className="md:hidden">{column.shortLabel}</span>
                  <span className="max-md:hidden">{column.label}</span>
                </span>
              ))}
            </div>
          </div>
          <div role="rowgroup">
            {COMPARISON_ROWS.map((row, rowIndex) => {
              const isLastRow = rowIndex === COMPARISON_ROWS.length - 1;

              return (
                <div
                  key={row.label}
                  role="row"
                  className={cn(COMPARISON_GRID, "border-t border-zinc-950/10")}
                >
                  <span
                    role="rowheader"
                    className={cn(
                      typeClass("caption"),
                      "self-center py-4 pr-2 text-balance wrap-break-word text-zinc-950 min-[400px]:pr-3 md:pr-6"
                    )}
                  >
                    {row.label}
                  </span>
                  {COMPARISON_COLUMNS.map((column, cellIndex) => (
                    <span
                      key={column.label}
                      role="cell"
                      className={cn(
                        "flex items-center justify-center px-1 py-4 md:px-4",
                        cellIndex === 0 && "bg-blue-50",
                        cellIndex === 0 && isLastRow && "rounded-b-xl"
                      )}
                    >
                      <ComparisonCell value={row.cells[cellIndex]} />
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ComparisonCell({ value }: { value: ComparisonValue }) {
  if (typeof value === "string") {
    return (
      <span className={cn(typeClass("caption"), "text-zinc-500")}>{value}</span>
    );
  }

  if (value) {
    return (
      <>
        <IconCheck
          className="text-brand-600 mx-auto size-5 shrink-0"
          aria-hidden="true"
        />
        <span className="sr-only">Yes</span>
      </>
    );
  }

  return (
    <>
      <IconX
        className="mx-auto size-5 shrink-0 text-zinc-300"
        aria-hidden="true"
      />
      <span className="sr-only">No</span>
    </>
  );
}

function Questions() {
  return (
    <section id="questions" className="py-16 sm:py-20">
      <div className={cn(CONTAINER, "grid gap-x-6 gap-y-12 lg:grid-cols-3")}>
        <div className="flex flex-col items-start gap-6">
          <h2 className={cn(HEADING, typeClass("title"), "max-w-[35ch]")}>
            Questions before you start.
          </h2>
          <p className={cn(BODY_TEXT, "max-w-[40ch]")}>
            Something else, or found a bug? Open an issue on GitHub; you’ll need
            a free GitHub account to post.
          </p>
          <a
            href={`${SOURCE_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className={TEXT_LINK}
          >
            Ask on GitHub
            <IconArrowUpRight className="size-4 shrink-0" aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="flex flex-col gap-12 lg:col-span-2">
          {QUESTION_GROUPS.map(group => (
            <div key={group.title} className="flex flex-col gap-4">
              <h3
                className={cn(typeClass("body"), "font-medium text-zinc-500")}
              >
                {group.title}
              </h3>
              <div className="flex flex-col border-b border-zinc-950/10">
                {group.questions.map(item => (
                  <details
                    key={item.question}
                    className="group border-t border-zinc-950/10"
                  >
                    <summary
                      className={cn(
                        "flex cursor-pointer list-none items-center justify-between gap-6 rounded-sm py-5 font-medium [&::-webkit-details-marker]:hidden",
                        typeClass("subtitle", "compact"),
                        FOCUS_RING
                      )}
                    >
                      {item.question}
                      <IconPlus
                        className="size-5 shrink-0 text-zinc-500 transition-transform group-open:rotate-45"
                        aria-hidden="true"
                      />
                    </summary>
                    <p
                      className={cn(BODY_TEXT, "max-w-[64ch] pb-6 text-pretty")}
                    >
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// The closing band mirrors the hero: dark headline, brand-blue second line.
// The page rising from the panel's foot is a real billsend PDF set in the
// typeface picked in Try it. Its box is sized from the page's own width, so it
// always shows the same top share of the page, and the page runs past the box
// to be cut by the panel's foot: 4:3 shows about half on phones, 16:9 about
// 40% from `sm`. Like the hero, the copy sits on the page above the panel.
function Closing({ font }: { font: InvoiceFont }) {
  const fontName = getInvoiceFontDefinition(font).name;
  const closingRender = getClosingRender(font);
  const caption =
    font === DEFAULT_FONT
      ? "Free, with no account. Opens straight into the editor."
      : `Free, with no account. Opens straight into the editor, set in ${fontName}.`;

  return (
    <section className="bg-blue-50/50 pt-16 sm:pt-20">
      <div className={CONTAINER}>
        <div className="flex flex-col gap-8 xl:flex-row xl:justify-between xl:gap-16">
          <h2 className={cn(HEADING, typeClass("display"), "max-w-[20ch]")}>
            <span className="block">Your next invoice</span>
            <span className="text-brand-600 block">starts here.</span>
          </h2>
          <div className="flex flex-col items-start gap-6 xl:justify-end">
            <p className={cn(BODY_TEXT, "max-w-[48ch]")}>{caption}</p>
            <CreateInvoiceLink font={font} />
          </div>
        </div>
        <div className="relative isolate mt-12 flex justify-center overflow-hidden rounded-t-xl border border-zinc-950/10 bg-blue-100 px-6 pt-12 pb-16 sm:mt-16 sm:pt-16 sm:pb-20">
          <img
            src="/home/closing-skyline.webp"
            alt=""
            width={1792}
            height={1008}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 -z-10 size-full object-cover"
          />
          <div
            aria-hidden="true"
            className="relative aspect-4/3 w-full max-w-md sm:aspect-video sm:max-w-xl lg:max-w-2xl"
          >
            <img
              src={closingRender.src}
              alt=""
              width={closingRender.width}
              height={Math.round(
                (closingRender.width * PAGE_HEIGHT) / PAGE_WIDTH
              )}
              loading="lazy"
              decoding="async"
              className="absolute inset-x-0 top-0 h-auto w-full shadow-[0_24px_64px_-12px_rgb(0_0_0/0.5)] outline-1 -outline-offset-1 outline-zinc-950/5"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer>
      <div
        className={cn(
          CONTAINER,
          "flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between"
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Wordmark />
          <p className={cn(typeClass("body"), "text-zinc-500")}>
            Invoices that stay on your device.
          </p>
        </div>
        <ul
          className={cn(
            typeClass("body"),
            "flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-600"
          )}
        >
          <li>
            <FooterLink href={`${SOURCE_URL}/issues`}>
              Report an issue
            </FooterLink>
          </li>
          <li>
            <FooterLink href={SOURCE_URL}>Source on GitHub</FooterLink>
          </li>
          <li suppressHydrationWarning>
            © {new Date().getFullYear()} billsend.io
          </li>
        </ul>
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
        "inline-flex min-h-11 items-center rounded-sm hover:text-zinc-950 sm:min-h-10",
        FOCUS_RING
      )}
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
