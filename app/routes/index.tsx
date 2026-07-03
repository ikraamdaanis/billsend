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
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/")({ component: HomePage });

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

function HomePage() {
  return (
    <div className="min-h-svh bg-neutral-50 text-neutral-900 antialiased">
      <SiteHeader />
      <main>
        <Hero />
        <StatBand />
        <Features />
        <Steps />
        <PrivacyPanel />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
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
        <nav className="hidden items-center gap-8 justify-self-center text-sm text-neutral-600 md:flex">
          <a href="#features" className="hover:text-neutral-900">
            Features
          </a>
          <a href="#how" className="hover:text-neutral-900">
            How it works
          </a>
          <a href="#privacy" className="hover:text-neutral-900">
            Privacy
          </a>
        </nav>
        <Link to="/create" preload="viewport" className="justify-self-end">
          <Button className="h-9 px-4 text-sm">
            Create invoice
            <IconArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-200">
      <div
        className="pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_90%_70%_at_50%_0%,black,transparent)] opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.92 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.92 0 0) 1px, transparent 1px)",
          backgroundSize: "44px 44px"
        }}
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:gap-12 lg:py-28">
        <div className="animate-fade-in-up flex flex-col items-start">
          <span className="border-brand-200 bg-brand-50 text-brand-700 rounded-surface inline-flex items-center gap-2 border px-3 py-1 text-sm font-medium">
            <IconShieldCheck className="size-3.5" />
            Runs entirely in your browser
          </span>
          <h1 className="font-display mt-6 text-5xl font-semibold tracking-tight text-balance text-neutral-900 sm:text-6xl lg:text-7xl">
            Make invoices fast,{" "}
            <span className="text-brand-600">keep them private</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-pretty text-neutral-600">
            A free little invoice maker that runs entirely in your browser. No
            accounts, no servers, and nothing ever leaves your device.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/create" preload="viewport">
              <Button className="h-11 w-full px-6 text-sm sm:w-auto">
                Create your first invoice
                <IconArrowRight className="size-4" />
              </Button>
            </Link>
            <a href="#how" className="sm:ml-2">
              <Button
                variant="outline"
                className="h-11 w-full px-6 text-sm sm:w-auto"
              >
                See how it works
              </Button>
            </a>
          </div>
          <p className="mt-6 font-mono text-sm text-neutral-500 tabular-nums">
            Free · No sign-up · Works offline
          </p>
        </div>
        <div className="animate-fade-in-up animation-delay-200 relative lg:pl-6">
          <InvoicePreview />
        </div>
      </div>
    </section>
  );
}

function InvoicePreview() {
  const dueDate = format(addDays(new Date(), 30), "d MMM yyyy");

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="animate-float rounded-surface border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5">
        <div className="flex items-start justify-between border-b border-neutral-200 p-6">
          <div className="flex flex-col gap-2">
            <div className="bg-brand-600 rounded-surface flex size-9 items-center justify-center">
              <span className="font-display text-base font-semibold text-white">
                b
              </span>
            </div>
            <div className="text-sm font-medium text-neutral-900">
              Acme Studio
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl font-semibold tracking-tight text-neutral-900">
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
          <span className="font-display text-brand-700 text-xl font-semibold tabular-nums">
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

function StatBand() {
  return (
    <section className="border-b border-neutral-200">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 bg-neutral-200 sm:grid-cols-4">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex flex-col gap-1 bg-neutral-50 px-6 py-8 ${
                index % 2 === 0 ? "border-r border-neutral-200" : ""
              } ${index < 2 ? "border-b border-neutral-200 sm:border-b-0" : ""} sm:border-r sm:last:border-r-0`}
            >
              <span className="font-display text-brand-600 text-3xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </span>
              <span className="text-sm text-neutral-500">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      id="features"
      className="border-b border-neutral-200 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-brand-600 font-mono text-sm font-medium">
            Features
          </span>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-balance text-neutral-900 sm:text-5xl">
            Everything you need, nothing you don&apos;t
          </h2>
          <p className="max-w-[60ch] text-lg text-pretty text-neutral-600">
            A small, fast tool for making invoices, nothing more. No
            spreadsheets, no subscriptions, and no data leaving your computer.
          </p>
        </div>
        <div className="rounded-surface mt-14 overflow-hidden border border-neutral-200 bg-neutral-200">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(feature => (
              <FeatureCell key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCell({
  feature
}: {
  feature: { icon: Icon; title: string; description: string };
}) {
  const Icon = feature.icon;

  return (
    <div className="group flex flex-col gap-4 bg-neutral-50 p-8 transition-colors hover:bg-white">
      <div className="border-brand-200 bg-brand-50 text-brand-600 rounded-surface flex size-10 items-center justify-center border">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-neutral-900">
          {feature.title}
        </h3>
        <p className="text-sm text-pretty text-neutral-600">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

function Steps() {
  return (
    <section id="how" className="border-b border-neutral-200 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex max-w-2xl flex-col gap-4">
          <span className="text-brand-600 font-mono text-sm font-medium">
            How it works
          </span>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-balance text-neutral-900 sm:text-5xl">
            From blank page to PDF
          </h2>
        </div>
        <div className="rounded-surface mt-14 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 md:grid-cols-3">
          {STEPS.map(step => (
            <div
              key={step.number}
              className="flex flex-col gap-4 bg-neutral-50 p-8"
            >
              <span className="font-display text-brand-600 text-4xl font-semibold tracking-tight tabular-nums">
                {step.number}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {step.title}
                </h3>
                <p className="text-sm text-pretty text-neutral-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PrivacyPanel() {
  return (
    <section
      id="privacy"
      className="border-b border-neutral-200 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="bg-brand-50/40 rounded-surface relative overflow-hidden border border-neutral-200 px-8 py-16 sm:px-16">
          <div
            className="pointer-events-none absolute inset-0 mask-[radial-gradient(ellipse_80%_80%_at_50%_0%,black,transparent)] opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(0.92 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.92 0 0) 1px, transparent 1px)",
              backgroundSize: "44px 44px"
            }}
          />
          <div className="relative flex max-w-2xl flex-col gap-5">
            <span className="text-brand-600 font-mono text-sm font-medium">
              Private by default
            </span>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-balance text-neutral-900 sm:text-5xl">
              Your data never touches a server
            </h2>
            <p className="max-w-[58ch] text-lg text-pretty text-neutral-600">
              There is no backend. Your invoices, templates, and logos live in
              your browser and stay on your device. Export them whenever you
              like, clear them whenever you want. We genuinely cannot see them.
            </p>
          </div>
          <div className="rounded-surface relative mt-12 grid gap-px overflow-hidden border border-neutral-200 bg-neutral-200 sm:grid-cols-3">
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
    <div className="flex flex-col gap-2 bg-white p-6">
      <div className="text-brand-600 flex items-center gap-2 text-sm font-medium">
        <IconShieldCheck className="size-4" />
        {title}
      </div>
      <p className="text-sm text-pretty text-neutral-600">{description}</p>
    </div>
  );
}

function FinalCta() {
  return (
    <section className="border-b border-neutral-200 py-24 sm:py-32">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <h2 className="font-display text-4xl font-semibold tracking-tight text-balance text-neutral-900 sm:text-5xl lg:text-6xl">
          Ready to make an invoice?
        </h2>
        <p className="mt-5 max-w-[48ch] text-lg text-pretty text-neutral-600">
          No sign-up, no catch. Make one in the next minute, for free.
        </p>
        <Link to="/create" preload="viewport" className="mt-8">
          <Button className="h-11 px-6 text-sm">
            Create your invoice
            <IconArrowRight className="size-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <span className="font-bricolage-grotesque text-brand-600 text-lg font-semibold tracking-tight">
          billsend
        </span>
        <p className="font-mono text-sm text-neutral-500 tabular-nums">
          © {new Date().getFullYear()} billsend.io · A local-first invoice tool
        </p>
      </div>
    </footer>
  );
}
