import type { Icon } from "@tabler/icons-react";
import {
  IconArrowRight,
  IconCoins,
  IconDatabase,
  IconFileDownload,
  IconPalette,
  IconShieldCheck,
  IconTemplate,
  IconWifiOff
} from "@tabler/icons-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { addDays, format } from "date-fns";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  motion,
  MotionConfig,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity
} from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/")({ component: HomePage });

const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

const FEATURES: { icon: Icon; title: string; description: string }[] = [
  {
    icon: IconDatabase,
    title: "Stays on your device",
    description:
      "Everything saves straight to your browser. Nothing is ever uploaded."
  },
  {
    icon: IconFileDownload,
    title: "One-click PDF",
    description:
      "Export a clean, print-ready PDF in a single click, then email or print it yourself."
  },
  {
    icon: IconTemplate,
    title: "Reusable templates",
    description:
      "Save an invoice as a template and reuse it next time instead of starting over."
  },
  {
    icon: IconPalette,
    title: "Logo & accent colour",
    description:
      "Upload your logo, pick an accent colour, and set the text size."
  },
  {
    icon: IconCoins,
    title: "Any currency",
    description:
      "Pick a currency per invoice, with custom symbols when you need them."
  },
  {
    icon: IconWifiOff,
    title: "Works offline",
    description:
      "No network needed. It all runs on your machine, even with the wifi off."
  }
];

const STEPS: { number: string; title: string; description: string }[] = [
  {
    number: "01",
    title: "Create",
    description: "Open the editor and fill in your details. No sign-up needed."
  },
  {
    number: "02",
    title: "Customise",
    description:
      "Add line items, set tax and currency, then add your logo and an accent colour."
  },
  {
    number: "03",
    title: "Export",
    description:
      "Download a clean PDF, ready to email or print whenever you like."
  }
];

const STATS: { value: string; label: string }[] = [
  { value: "0", label: "Servers" },
  { value: "0", label: "Trackers" },
  { value: "100%", label: "On-device" },
  { value: "Free", label: "Forever" }
];

const MARQUEE_PHRASES = [
  "No accounts",
  "No servers",
  "No tracking",
  "Free forever"
];

const CARD_TONES = {
  light: "border-neutral-200 bg-white text-neutral-900",
  dark: "border-neutral-900 bg-neutral-900 text-neutral-50",
  brand: "border-brand-600 bg-brand-600 text-white",
  tint: "border-brand-200 bg-brand-50 text-brand-700"
};

const BAND_ROW_ONE: { label: string; tone: keyof typeof CARD_TONES }[] = [
  { label: "INV-0042 · $2,450.00", tone: "dark" },
  { label: "€ EUR", tone: "light" },
  { label: "PDF ↓", tone: "brand" },
  { label: "Due net 30", tone: "light" },
  { label: "£ GBP", tone: "tint" },
  { label: "logo.png ✓", tone: "light" }
];

const BAND_ROW_TWO: { label: string; tone: keyof typeof CARD_TONES }[] = [
  { label: "Template · Retainer", tone: "light" },
  { label: "¥ JPY", tone: "tint" },
  { label: "Tax 20%", tone: "dark" },
  { label: "INV-0043 · $980.00", tone: "light" },
  { label: "Saved locally", tone: "brand" },
  { label: "$ USD", tone: "light" }
];

function useSmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({ autoRaf: true, anchors: true });

    return () => lenis.destroy();
  }, [prefersReducedMotion]);
}

function HomePage() {
  useSmoothScroll();

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-neutral-50 text-neutral-900 antialiased">
        <SiteHeader />
        <main className="overflow-x-clip">
          <Hero />
          <MarqueeBand />
          <Manifesto />
          <Features />
          <Steps />
          <SlidingBand />
          <PrivacyFinale />
        </main>
      </div>
    </MotionConfig>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[1fr_1fr] items-center px-6 md:grid-cols-[1fr_auto_1fr]">
        <Link to="/" className="flex items-center gap-2 justify-self-start">
          <span className="font-bricolage-grotesque text-brand-600 text-xl font-semibold tracking-tight">
            billsend
          </span>
        </Link>
        <nav className="hidden items-center gap-8 justify-self-center font-mono text-xs tracking-widest text-neutral-500 uppercase md:flex">
          <a href="#features" className="transition hover:text-neutral-900">
            Features
          </a>
          <a href="#how" className="transition hover:text-neutral-900">
            How it works
          </a>
          <a href="#privacy" className="transition hover:text-neutral-900">
            Privacy
          </a>
        </nav>
        <Link
          to="/create"
          preload="viewport"
          className={cn(
            buttonVariants({ variant: "default" }),
            "h-9 justify-self-end px-4 text-sm"
          )}
        >
          Create invoice
          <IconArrowRight className="size-4" />
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const cardRotate = useTransform(scrollYProgress, [0, 1], [-1.5, -6]);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden border-b border-neutral-200"
    >
      <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-6 pt-20 pb-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pt-28 lg:pb-32">
        <div className="flex flex-col items-start">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-brand-600 font-mono text-xs tracking-widest uppercase"
          >
            ✳ A free invoice maker that lives in your browser
          </motion.p>
          <h1 className="font-instrument-serif mt-8 text-7xl leading-[0.95] font-normal tracking-tight text-neutral-900 sm:text-8xl lg:text-9xl">
            <HeadlineLine delay={0.1}>Make it.</HeadlineLine>
            <HeadlineLine delay={0.18}>
              <span className="text-transparent [-webkit-text-stroke:1.5px_var(--color-neutral-900)]">
                Bill it.
              </span>
            </HeadlineLine>
            <HeadlineLine delay={0.26}>
              <span className="text-brand-600 italic">Get paid.</span>
            </HeadlineLine>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.5 }}
            className="mt-8 max-w-[46ch] text-lg text-pretty text-neutral-600"
          >
            No accounts, no servers, no fuss. Open it, type in what you did and
            what it costs, then download the PDF. Everything stays on your
            device.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO, delay: 0.6 }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <Link
                to="/create"
                preload="viewport"
                className="group bg-brand-600 relative inline-flex items-center gap-4 overflow-hidden rounded-full py-2.5 pr-2.5 pl-7 text-base font-medium text-white"
              >
                <span
                  aria-hidden
                  className="bg-brand-800 absolute top-1/2 left-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100"
                />
                <span className="relative z-10">Create your first invoice</span>
                <span className="text-brand-600 relative z-10 flex size-10 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-out group-hover:scale-110">
                  <IconArrowRight className="size-5 -rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0" />
                </span>
              </Link>
            </Magnetic>
            <a
              href="#how"
              className="group inline-flex items-center gap-2 px-2 py-3 text-base font-medium text-neutral-600 transition hover:text-neutral-900"
            >
              See how it works
              <span className="block h-px w-8 bg-neutral-300 transition-all duration-300 group-hover:w-12 group-hover:bg-neutral-900" />
            </a>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="mt-8 font-mono text-sm text-neutral-500 tabular-nums"
          >
            Free · No sign-up · Works offline
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_OUT_EXPO, delay: 0.35 }}
          className="relative lg:pl-4"
        >
          <motion.div style={{ y: cardY, rotate: cardRotate }}>
            <InvoicePreview />
          </motion.div>
        </motion.div>
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
      <motion.span
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO, delay }}
        className="block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

function InvoicePreview() {
  const dueDate = format(addDays(new Date(), 30), "d MMM yyyy");

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="rounded-surface border border-neutral-200 bg-white shadow-2xl shadow-neutral-900/10">
        <div className="flex items-start justify-between border-b border-neutral-200 p-6">
          <div className="flex flex-col gap-2">
            <div className="bg-brand-600 rounded-surface flex size-9 items-center justify-center">
              <span className="font-instrument-serif text-base font-normal text-white">
                b
              </span>
            </div>
            <div className="text-sm font-medium text-neutral-900">
              Acme Studio
            </div>
          </div>
          <div className="text-right">
            <div className="font-instrument-serif text-2xl font-normal tracking-tight text-neutral-900">
              Invoice
            </div>
            <div className="mt-1 font-mono text-xs text-neutral-500 tabular-nums">
              #INV-0042
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-b border-neutral-200 p-6 text-sm">
          <div className="flex flex-col gap-1">
            <div className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              Billed to
            </div>
            <div className="text-neutral-700">Northwind Co.</div>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <div className="text-xs font-medium tracking-wide text-neutral-400 uppercase">
              Due
            </div>
            <div className="font-mono text-neutral-700 tabular-nums">
              {dueDate}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-b border-neutral-200 p-6 text-sm">
          <LineItem label="Brand identity design" amount="1,400.00" />
          <LineItem label="Landing page build" amount="850.00" />
          <LineItem label="Monthly retainer" amount="200.00" />
        </div>
        <div className="bg-brand-50 flex items-center justify-between p-6">
          <span className="text-brand-700 text-sm font-medium">Total due</span>
          <span className="font-instrument-serif text-brand-700 text-xl font-normal tabular-nums">
            $2,450.00
          </span>
        </div>
      </div>
      <div className="rounded-surface absolute -bottom-4 -left-4 hidden items-center gap-2 border border-neutral-200 bg-white px-3 py-2 shadow-lg sm:flex">
        <IconDatabase className="text-brand-600 size-4" />
        <span className="text-sm font-medium text-neutral-700">
          Saved locally
        </span>
      </div>
    </div>
  );
}

function LineItem({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-neutral-600">{label}</span>
      <span className="font-mono text-neutral-900 tabular-nums">${amount}</span>
    </div>
  );
}

function wrapPercent(min: number, max: number, value: number) {
  const range = max - min;

  return ((((value - min) % range) + range) % range) + min;
}

function MarqueeBand() {
  const prefersReducedMotion = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false
  });
  const directionRef = useRef(-1);
  const x = useTransform(baseX, value => `${wrapPercent(-25, 0, value)}%`);

  useAnimationFrame((_time, delta) => {
    if (prefersReducedMotion) return;

    const factor = velocityFactor.get();
    if (factor > 0) directionRef.current = -1;
    if (factor < 0) directionRef.current = 1;

    const moveBy =
      directionRef.current * 2.2 * (delta / 1000) * (1 + Math.abs(factor));
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <section
      aria-hidden
      className="overflow-hidden border-b border-neutral-200 py-8 sm:py-10"
    >
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap">
        <MarqueeStrip />
        <MarqueeStrip />
        <MarqueeStrip />
        <MarqueeStrip />
      </motion.div>
    </section>
  );
}

function MarqueeStrip() {
  return (
    <div className="font-instrument-serif flex items-center text-6xl font-normal tracking-tight text-neutral-900 uppercase sm:text-7xl">
      {MARQUEE_PHRASES.map((phrase, phraseIndex) => (
        <span key={phrase} className="flex items-center">
          <span
            className={
              phraseIndex % 2 === 1
                ? "px-6 text-transparent [-webkit-text-stroke:1.5px_var(--color-neutral-900)]"
                : "px-6"
            }
          >
            {phrase}
          </span>
          <span className="text-brand-600 text-4xl sm:text-5xl">✳</span>
        </span>
      ))}
    </div>
  );
}

function Manifesto() {
  return (
    <section className="border-b border-neutral-200 py-24 sm:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6">
        <WordReveal
          phrase="Made for freelancers, side hustles, and anyone who just needs to bill someone without signing up for yet another platform."
          className="font-instrument-serif max-w-4xl text-3xl leading-tight font-normal tracking-tight text-neutral-900 sm:text-5xl"
        />
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-4">
          {STATS.map((stat, statIndex) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.6,
                ease: EASE_OUT_EXPO,
                delay: statIndex * 0.08
              }}
              className="flex flex-col gap-1 bg-neutral-50 px-6 py-8"
            >
              <span className="font-instrument-serif text-brand-600 text-4xl font-normal tracking-tight tabular-nums">
                {stat.value}
              </span>
              <span className="font-mono text-xs tracking-widest text-neutral-500 uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WordReveal({
  phrase,
  className
}: {
  phrase: string;
  className?: string;
}) {
  const phraseRef = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(phraseRef, { once: true, margin: "-15% 0px" });

  return (
    <p ref={phraseRef} className={className}>
      {phrase.split(" ").map((word, wordIndex) => (
        <span
          key={`${word}-${wordIndex}`}
          className="-mb-[0.1em] inline-flex overflow-hidden pb-[0.1em]"
        >
          <motion.span
            initial={{ y: "110%" }}
            animate={isInView ? { y: "0%" } : { y: "110%" }}
            transition={{
              duration: 0.6,
              ease: EASE_OUT_EXPO,
              delay: 0.02 * wordIndex
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </p>
  );
}

function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-16 border-b border-neutral-200 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionIntro
          label="Features · 01 to 06"
          title="Everything you need, nothing you don't"
        />
        <ul className="mt-16">
          {FEATURES.map((feature, featureIndex) => (
            <FeatureRow
              key={feature.title}
              feature={feature}
              featureIndex={featureIndex}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeatureRow({
  feature,
  featureIndex
}: {
  feature: { icon: Icon; title: string; description: string };
  featureIndex: number;
}) {
  const FeatureIcon = feature.icon;

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{
        duration: 0.6,
        ease: EASE_OUT_EXPO,
        delay: featureIndex * 0.04
      }}
      className="group border-t border-neutral-200 last:border-b"
    >
      <div className="grid items-center gap-x-10 gap-y-3 py-8 transition-colors duration-300 sm:grid-cols-[3.5rem_1.2fr_1fr_auto] sm:py-10">
        <span className="font-mono text-sm text-neutral-400 tabular-nums transition-colors duration-300 group-hover:text-neutral-900">
          {`0${featureIndex + 1}`}
        </span>
        <h3 className="font-instrument-serif text-3xl font-normal tracking-tight text-neutral-900 transition-transform duration-300 ease-out sm:text-4xl sm:group-hover:translate-x-3">
          {feature.title}
        </h3>
        <p className="max-w-[38ch] text-sm text-pretty text-neutral-500 transition-colors duration-300 group-hover:text-neutral-700">
          {feature.description}
        </p>
        <span className="border-brand-200 bg-brand-50 text-brand-600 rounded-surface hidden size-11 items-center justify-center border transition-transform duration-300 ease-out group-hover:-rotate-6 sm:flex">
          <FeatureIcon className="size-5" />
        </span>
      </div>
    </motion.li>
  );
}

function Steps() {
  return (
    <section
      id="how"
      className="scroll-mt-16 border-b border-neutral-200 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionIntro label="How it works" title="From blank page to PDF" />
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, stepIndex) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.7,
                ease: EASE_OUT_EXPO,
                delay: stepIndex * 0.12
              }}
              className="flex flex-col gap-5 border-t border-neutral-200 pt-6"
            >
              <span className="font-instrument-serif text-7xl font-normal tracking-tight text-transparent tabular-nums [-webkit-text-stroke:1.5px_var(--color-brand-400)] sm:text-8xl">
                {step.number}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-instrument-serif text-2xl font-normal text-neutral-900">
                  {step.title}
                </h3>
                <p className="max-w-[36ch] text-sm text-pretty text-neutral-600">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionIntro({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6 }}
        className="text-brand-600 font-mono text-xs tracking-widest uppercase"
      >
        {label}
      </motion.span>
      <WordReveal
        phrase={title}
        className="font-instrument-serif text-4xl font-normal tracking-tight text-balance text-neutral-900 sm:text-5xl"
      />
    </div>
  );
}

function SlidingBand() {
  const bandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: bandRef,
    offset: ["start end", "end start"]
  });
  const xLeft = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const xRight = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div
      ref={bandRef}
      aria-hidden
      className="flex flex-col gap-5 overflow-hidden py-20 sm:py-24"
    >
      <motion.div style={{ x: xLeft }} className="-ml-40 flex w-max gap-5">
        {[...BAND_ROW_ONE, ...BAND_ROW_ONE].map((card, cardIndex) => (
          <MiniCard key={`${card.label}-${cardIndex}`} card={card} />
        ))}
      </motion.div>
      <motion.div
        style={{ x: xRight }}
        className="-mr-40 flex w-max gap-5 self-end"
      >
        {[...BAND_ROW_TWO, ...BAND_ROW_TWO].map((card, cardIndex) => (
          <MiniCard key={`${card.label}-${cardIndex}`} card={card} />
        ))}
      </motion.div>
    </div>
  );
}

function MiniCard({
  card
}: {
  card: { label: string; tone: keyof typeof CARD_TONES };
}) {
  return (
    <div
      className={`rounded-surface flex h-24 items-center border px-10 font-mono text-lg whitespace-nowrap tabular-nums ${CARD_TONES[card.tone]}`}
    >
      {card.label}
    </div>
  );
}

function PrivacyFinale() {
  return (
    <section id="privacy" className="scroll-mt-16">
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
        className="fill-brand-950 block h-16 w-full sm:h-20"
      >
        <path d="M0 80 L0 64 C360 4 1080 4 1440 64 L1440 80 Z" />
      </svg>
      <div className="bg-brand-950 text-neutral-50">
        <div className="mx-auto flex max-w-6xl flex-col px-6 pt-20 pb-12 sm:pt-28">
          <span className="text-brand-300 font-mono text-xs tracking-widest uppercase">
            Private by default
          </span>
          <WordReveal
            phrase="Your invoices never leave this tab."
            className="font-instrument-serif mt-6 max-w-3xl text-5xl font-normal tracking-tight text-balance sm:text-7xl"
          />
          <p className="mt-8 max-w-[56ch] text-lg text-pretty text-neutral-300">
            There is no backend. Invoices, templates, and logos live in your
            browser and stay on your device. Export them whenever you like,
            clear them whenever you want. We genuinely cannot see them.
          </p>
          <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
            <Assurance
              title="No accounts"
              description="Open the app and start. There is nothing to sign up for."
            />
            <Assurance
              title="No cloud sync"
              description="Files are written to your machine, not someone else's."
            />
            <Assurance
              title="No tracking"
              description="Zero analytics scripts, zero third-party requests."
            />
          </div>
          <div className="mt-24 flex flex-col items-start gap-10 border-t border-white/15 pt-12 sm:mt-32 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-instrument-serif text-4xl font-normal tracking-tight sm:text-6xl">
              Ready when <span className="text-brand-300 italic">you</span> are.
            </h2>
            <Magnetic>
              <Link
                to="/create"
                preload="viewport"
                className="group bg-brand-500 relative inline-flex items-center gap-4 overflow-hidden rounded-full py-3 pr-3 pl-9 text-lg font-medium text-white"
              >
                <span
                  aria-hidden
                  className="bg-brand-800 absolute top-1/2 left-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full transition-transform duration-500 ease-out group-hover:scale-100"
                />
                <span className="relative z-10">Create your invoice</span>
                <span className="text-brand-600 relative z-10 flex size-12 items-center justify-center rounded-full bg-white transition-transform duration-300 ease-out group-hover:scale-110">
                  <IconArrowRight className="size-6 -rotate-45 transition-transform duration-300 ease-out group-hover:rotate-0" />
                </span>
              </Link>
            </Magnetic>
          </div>
          <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center">
            <span className="font-bricolage-grotesque text-lg font-semibold tracking-tight text-white">
              billsend
            </span>
            <div className="flex items-center gap-6 font-mono text-xs text-neutral-400 tabular-nums">
              <span className="flex items-center gap-2">
                <IconShieldCheck className="text-brand-300 size-3.5" />
                100% local
              </span>
              <span>
                © {new Date().getFullYear()} billsend.io · A local-first invoice
                tool
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Assurance({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-white/15 pt-5">
      <div className="text-brand-300 flex items-center gap-2 text-sm font-medium">
        <IconShieldCheck className="size-4" />
        {title}
      </div>
      <p className="text-sm text-pretty text-neutral-400">{description}</p>
    </div>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const springX = useSpring(offsetX, {
    stiffness: 180,
    damping: 14,
    mass: 0.4
  });
  const springY = useSpring(offsetY, {
    stiffness: 180,
    damping: 14,
    mass: 0.4
  });

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !wrapperRef.current) return;

    const bounds = wrapperRef.current.getBoundingClientRect();
    offsetX.set((event.clientX - (bounds.left + bounds.width / 2)) * 0.3);
    offsetY.set((event.clientY - (bounds.top + bounds.height / 2)) * 0.3);
  };

  const handleMouseLeave = () => {
    offsetX.set(0);
    offsetY.set(0);
  };

  return (
    <motion.div
      ref={wrapperRef}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
