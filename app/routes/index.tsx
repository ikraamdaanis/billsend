import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  ArrowRight,
  Check,
  Download,
  HardDrive,
  Lock,
  Palette,
  Sparkles,
  Zap
} from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-50">
      {/* Ambient background gradients */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.603_0.218_257.42/0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_50%,oklch(0.603_0.218_257.42/0.06),transparent_40%)]" />
        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-[radial-gradient(ellipse_100%_100%_at_0%_100%,oklch(0.419_0.152_257.57/0.06),transparent_50%)]" />
      </div>
      {/* Refined dot grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.25]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(120,113,108,0.07) 1px, transparent 0)`,
          backgroundSize: "32px 32px"
        }}
      />
      {/* Navigation — Floating glass pill */}
      <nav className="fixed top-5 z-50 w-full sm:top-6">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex h-14 items-center justify-between rounded-md border border-stone-200/60 bg-white/70 px-5 shadow-lg shadow-stone-900/5 backdrop-blur-xl">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bricolage-grotesque text-brand-500 text-lg font-bold">
                billsend
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-stone-500 sm:block">
                100% free &amp; private
              </span>
              <Link to="/create" preload="viewport">
                <Button className="h-8 rounded-md px-4 text-sm font-medium">
                  Create Invoice
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section — Centered */}
      <section className="relative px-4 pt-32 pb-16 sm:px-6 sm:pt-40 lg:pt-48">
        <div className="mx-auto max-w-6xl text-center">
          {/* Privacy badge */}
          <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-sm font-medium text-emerald-700 backdrop-blur-sm">
            <Lock className="h-3.5 w-3.5" />
            Your data never leaves your browser
          </div>
          {/* Heading */}
          <h1 className="animate-fade-in-up animation-delay-100 font-bricolage-grotesque text-[2.75rem] leading-[1.1] font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            Invoice creation,{" "}
            <span className="relative">
              <span className="text-brand-500 relative z-10">simplified</span>
              <svg
                className="text-brand-500 absolute -bottom-2 left-0 h-3 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 8.5C50 2 150 2 198 8.5"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-draw"
                />
              </svg>
            </span>
          </h1>
          {/* Subtext */}
          <p className="animate-fade-in-up animation-delay-200 mx-auto mt-6 max-w-150 text-lg leading-relaxed text-stone-600">
            A free, local-first invoice editor that respects your privacy. No
            accounts, no servers, no tracking. Just beautiful invoices in
            seconds.
          </p>
          {/* CTA */}
          <div className="animate-fade-in-up animation-delay-300 mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/create" preload="viewport">
              <Button className="group shadow-brand-500/20 hover:shadow-brand-500/25 h-10 gap-2 rounded-md px-6 text-sm shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                Start creating
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Check className="h-4 w-4 text-emerald-500" />
              No sign-up required
            </div>
          </div>
          {/* Trust indicators */}
          <div className="animate-fade-in-up animation-delay-400 mx-auto mt-12 flex max-w-sm flex-wrap justify-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-100">
                <Lock className="h-5 w-5 text-stone-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-stone-900">
                  100% private
                </div>
                <div className="text-xs text-stone-500">Data stays local</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-stone-100">
                <Download className="h-5 w-5 text-stone-600" />
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold text-stone-900">
                  PDF export
                </div>
                <div className="text-xs text-stone-500">
                  Professional quality
                </div>
              </div>
            </div>
          </div>
          {/* Invoice mockup — desktop only */}
          <div className="animate-fade-in-up animation-delay-500 relative mx-auto mt-16 hidden max-w-xl lg:block">
            {/* Ambient glow behind card */}
            <div className="from-brand-200/40 via-brand-100/30 to-brand-50/40 absolute -inset-4 rounded-md bg-linear-to-br blur-2xl" />
            <div className="animate-float relative">
              {/* Main invoice card */}
              <div className="relative rounded-md border border-stone-200/80 bg-white p-6 shadow-2xl shadow-stone-900/10">
                {/* Invoice header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <div className="bg-brand-400 h-8 w-24 rounded" />
                    <div className="mt-3 h-3 w-32 rounded bg-stone-200" />
                  </div>
                  <div className="text-right">
                    <div className="font-bricolage-grotesque text-2xl font-bold text-stone-900">
                      INVOICE
                    </div>
                    <div className="mt-1 text-sm text-stone-500">#INV-0042</div>
                  </div>
                </div>
                {/* Line items */}
                <div className="mb-6 space-y-2 rounded-md border border-stone-100 bg-stone-50/50 p-4">
                  <div className="flex justify-between">
                    <div className="h-3 w-40 rounded bg-stone-200" />
                    <div className="h-3 w-16 rounded bg-stone-200" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 w-32 rounded bg-stone-200" />
                    <div className="h-3 w-14 rounded bg-stone-200" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 w-36 rounded bg-stone-200" />
                    <div className="h-3 w-12 rounded bg-stone-200" />
                  </div>
                </div>
                {/* Total */}
                <div className="from-brand-50 to-brand-100/80 border-brand-200/60 flex items-center justify-between rounded-md border bg-linear-to-r px-4 py-3">
                  <span className="text-brand-600 text-sm font-medium">
                    Total Due
                  </span>
                  <span className="font-bricolage-grotesque text-brand-700 text-xl font-bold">
                    $2,450.00
                  </span>
                </div>
              </div>
              {/* Floating chips */}
              <div className="absolute -bottom-4 -left-4 rounded-md border border-stone-200 bg-white px-4 py-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-100">
                    <Check className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="text-sm font-medium text-stone-700">
                    PDF ready
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -right-3 rounded-md border border-stone-200 bg-white px-4 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-stone-700">
                    Customisable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Features — Bento Grid */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="font-bricolage-grotesque text-3xl font-bold text-stone-900 sm:text-4xl">
              Everything you need,
              <br />
              <span className="text-brand-500">nothing you don&apos;t</span>
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Designed for freelancers and small businesses who want to create
              professional invoices without the complexity.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Large feature card — Local-first */}
            <div className="group relative overflow-hidden rounded-md border border-stone-200/80 bg-white p-8 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5 sm:col-span-2 lg:col-span-2 lg:row-span-2">
              <div className="from-brand-100 to-brand-50 absolute -top-20 -right-20 h-64 w-64 rounded-md bg-linear-to-br opacity-50 transition-transform duration-700 group-hover:scale-125" />
              <div className="relative flex h-full flex-col">
                <div className="from-brand-400 to-brand-500 shadow-brand-400/25 mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-linear-to-br shadow-lg">
                  <HardDrive className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bricolage-grotesque mb-2 text-2xl font-bold text-stone-900">
                  Local-first by design
                </h3>
                <p className="mb-8 max-w-md text-stone-600">
                  Your invoices, templates, and client data are stored securely
                  in your browser&apos;s IndexedDB. No cloud sync, no data
                  mining, no privacy concerns.
                </p>
                <div className="mt-auto grid grid-cols-3 gap-4">
                  <div className="rounded-md bg-stone-50 p-4 text-center">
                    <div className="font-bricolage-grotesque text-brand-500 text-2xl font-bold">
                      0
                    </div>
                    <div className="text-xs text-stone-500">Servers</div>
                  </div>
                  <div className="rounded-md bg-stone-50 p-4 text-center">
                    <div className="font-bricolage-grotesque text-brand-500 text-2xl font-bold">
                      0
                    </div>
                    <div className="text-xs text-stone-500">Trackers</div>
                  </div>
                  <div className="rounded-md bg-stone-50 p-4 text-center">
                    <div className="font-bricolage-grotesque text-brand-500 text-2xl font-bold">
                      100%
                    </div>
                    <div className="text-xs text-stone-500">Private</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Speed card */}
            <div className="group relative overflow-hidden rounded-md border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-md bg-amber-100/80 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-amber-100">
                  <Zap className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                  Lightning fast
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  Everything runs instantly in your browser. No loading screens,
                  no waiting for servers.
                </p>
              </div>
            </div>
            {/* Customisation card */}
            <div className="group relative overflow-hidden rounded-md border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-md bg-violet-100/80 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-violet-100">
                  <Palette className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                  Fully customisable
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  Adjust colours, fonts, and layouts. Save your designs as
                  reusable templates.
                </p>
              </div>
            </div>
            {/* Templates card */}
            <div className="group relative overflow-hidden rounded-md border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5">
              <div className="absolute -top-8 -right-8 h-24 w-24 rounded-md bg-emerald-100/80 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-emerald-100">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                  Save templates
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  Create once, reuse forever. Maintain consistent branding
                  across all your invoices.
                </p>
              </div>
            </div>
            {/* PDF export card — wide */}
            <div className="group relative overflow-hidden rounded-md border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5 sm:col-span-1 lg:col-span-2">
              <div className="absolute -top-16 -right-16 h-48 w-48 rounded-md bg-sky-100/60 transition-transform duration-500 group-hover:scale-125" />
              <div className="relative flex flex-col gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-sky-100">
                  <Download className="h-7 w-7 text-sky-600" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-stone-900">
                    Professional PDF export
                  </h3>
                  <p className="text-sm leading-relaxed text-stone-600">
                    Generate print-ready PDF invoices with one click. Perfect
                    formatting, ready to send to your clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section — Light gradient */}
      <section className="relative px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="border-brand-200/60 from-brand-50 to-brand-50/80 relative overflow-hidden rounded-md border bg-linear-to-br via-white p-10 sm:p-16">
            {/* Ambient brand glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="bg-brand-200/30 absolute -top-24 -left-24 h-64 w-64 rounded-md blur-3xl" />
              <div className="bg-brand-100/40 absolute -right-24 -bottom-24 h-64 w-64 rounded-md blur-3xl" />
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.603 0.218 257.42 / 0.08) 1px, transparent 0)`,
                  backgroundSize: "32px 32px"
                }}
              />
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="border-brand-200 bg-brand-50/80 text-brand-600 mb-6 inline-flex items-center gap-2 rounded-md border px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5" />
                Takes less than a minute
              </div>
              <h2 className="font-bricolage-grotesque text-3xl font-bold text-stone-900 sm:text-4xl lg:text-5xl">
                Ready to create your
                <br />
                <span className="text-brand-500">first invoice?</span>
              </h2>
              <p className="mt-5 max-w-md text-lg text-stone-600">
                No sign-up, no credit card, no strings attached. Just start
                creating beautiful invoices right now.
              </p>
              <Link to="/create" preload="viewport" className="mt-8">
                <Button className="group shadow-brand-500/20 hover:shadow-brand-500/25 h-10 gap-2 rounded-md px-6 text-sm shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  Create your invoice
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  Free forever
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  No account needed
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-500" />
                  No tracking
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="relative border-t border-stone-200 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="font-bricolage-grotesque text-brand-500 text-base font-bold">
                billsend
              </span>
            </div>
            <p className="text-sm text-stone-500">
              &copy; {new Date().getFullYear()} billsend.io. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
