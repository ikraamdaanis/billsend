import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import dayjs from "dayjs";
import {
  ArrowRight,
  Check,
  Download,
  FileText,
  HardDrive,
  Lock,
  Palette,
  Sparkles,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      const threshold = 32;
      setIsScrolled(scrollPosition > threshold);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-stone-50">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(250,105,92,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_50%,rgba(250,105,92,0.08),transparent_40%)]" />
        <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-[radial-gradient(ellipse_100%_100%_at_0%_100%,rgba(251,191,36,0.08),transparent_50%)]" />
      </div>
      {/* Refined grid pattern */}
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(120,113,108,0.06) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(120,113,108,0.06) 1px, transparent 1px)`,
          backgroundSize: "64px 64px"
        }}
      />
      {/* Navigation */}
      <nav
        className={`fixed z-50 w-full transition-all duration-500 ${isScrolled ? "top-3" : "top-5 sm:top-6"}`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div
            className={`flex h-14 items-center justify-between rounded-2xl border px-5 backdrop-blur-xl transition-all duration-500 ${
              isScrolled
                ? "border-stone-200/80 bg-white/80 shadow-lg shadow-stone-900/5"
                : "border-stone-200/50 bg-white/60"
            }`}
          >
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-400">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="font-bricolage-grotesque text-lg font-bold text-stone-900">
                billsend
              </span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-stone-500 sm:block">
                100% free & private
              </span>
              <Link to="/create" preload="viewport">
                <Button className="h-8 rounded-sm bg-stone-900 px-4 text-sm font-medium text-white hover:bg-stone-800">
                  Create Invoice
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero section */}
      <section className="relative px-4 pt-32 pb-16 sm:px-6 sm:pt-40 lg:pt-48">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Hero content */}
            <div className="relative z-10">
              <div className="animate-fade-in-up mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-1.5 text-sm font-medium text-emerald-700 backdrop-blur-sm">
                <Lock className="h-3.5 w-3.5" />
                Your data never leaves your browser
              </div>
              <h1 className="animate-fade-in-up animation-delay-100 font-bricolage-grotesque text-[2.75rem] leading-[1.1] font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
                Invoice creation,{" "}
                <span className="relative">
                  <span className="relative z-10 text-brand-500">simplified</span>
                  <svg
                    className="absolute -bottom-2 left-0 h-3 w-full"
                    viewBox="0 0 200 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8.5C50 2 150 2 198 8.5"
                      stroke="#fa695c"
                      strokeWidth="3"
                      strokeLinecap="round"
                      className="animate-draw"
                    />
                  </svg>
                </span>
              </h1>
              <p className="animate-fade-in-up animation-delay-200 mt-6 max-w-lg text-lg leading-relaxed text-stone-600">
                A free, local-first invoice editor that respects your privacy. No
                accounts, no servers, no tracking. Just beautiful invoices in
                seconds.
              </p>
              <div className="animate-fade-in-up animation-delay-300 mt-8 flex flex-wrap items-center gap-4">
                <Link to="/create" preload="viewport">
                  <Button className="group h-10 gap-2 rounded-sm bg-brand-500 px-5 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all duration-300 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30">
                    Start creating
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-stone-500">
                  <Check className="h-4 w-4 text-emerald-500" />
                  No sign-up required
                </div>
              </div>
              {/* Trust indicators */}
              <div className="animate-fade-in-up animation-delay-400 mt-12 flex flex-wrap gap-6 border-t border-stone-200 pt-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                    <Lock className="h-5 w-5 text-stone-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      100% private
                    </div>
                    <div className="text-xs text-stone-500">Data stays local</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100">
                    <Download className="h-5 w-5 text-stone-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      PDF export
                    </div>
                    <div className="text-xs text-stone-500">
                      Professional quality
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Hero visual - Invoice preview mockup */}
            <div className="animate-fade-in-up animation-delay-300 relative hidden lg:block">
              <div className="absolute -inset-4 rounded-3xl bg-linear-to-br from-brand-200/40 via-brand-100/30 to-amber-100/40 blur-2xl" />
              <div className="relative">
                {/* Main invoice card */}
                <div className="relative rounded-2xl border border-stone-200/80 bg-white p-6 shadow-2xl shadow-stone-900/10">
                  {/* Invoice header mockup */}
                  <div className="mb-6 flex items-start justify-between">
                    <div>
                      <div className="h-8 w-24 rounded bg-brand-400" />
                      <div className="mt-3 h-3 w-32 rounded bg-stone-200" />
                    </div>
                    <div className="text-right">
                      <div className="font-bricolage-grotesque text-2xl font-bold text-stone-900">
                        INVOICE
                      </div>
                      <div className="mt-1 text-sm text-stone-500">#INV-0042</div>
                    </div>
                  </div>
                  {/* Line items mockup */}
                  <div className="mb-6 space-y-2 rounded-lg border border-stone-100 bg-stone-50/50 p-4">
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
                  <div className="flex items-center justify-between rounded-lg bg-stone-900 px-4 py-3">
                    <span className="text-sm font-medium text-stone-400">
                      Total Due
                    </span>
                    <span className="font-bricolage-grotesque text-xl font-bold text-white">
                      £2,450.00
                    </span>
                  </div>
                </div>
                {/* Floating elements */}
                <div className="absolute -bottom-4 -left-4 rounded-xl border border-stone-200 bg-white px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                      <Check className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-sm font-medium text-stone-700">
                      PDF ready
                    </div>
                  </div>
                </div>
                <div className="absolute -right-3 -top-3 rounded-xl border border-stone-200 bg-white px-4 py-2 shadow-lg">
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
        </div>
      </section>
      {/* Features bento grid */}
      <section className="relative px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 max-w-2xl">
            <h2 className="font-bricolage-grotesque text-3xl font-bold text-stone-900 sm:text-4xl">
              Everything you need,
              <br />
              <span className="text-stone-400">nothing you don&apos;t</span>
            </h2>
            <p className="mt-4 text-lg text-stone-600">
              Designed for freelancers and small businesses who want to create
              professional invoices without the complexity.
            </p>
          </div>
          {/* Bento grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Large feature card */}
            <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-8 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5 sm:col-span-2 lg:col-span-2 lg:row-span-2">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-linear-to-br from-brand-100 to-brand-50 opacity-50 transition-transform duration-700 group-hover:scale-125" />
              <div className="relative flex h-full flex-col">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-400 to-brand-500 shadow-lg shadow-brand-400/25">
                  <HardDrive className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-bricolage-grotesque text-2xl font-bold text-stone-900">
                  Local-first by design
                </h3>
                <p className="mb-8 max-w-md text-stone-600">
                  Your invoices, templates, and client data are stored securely in
                  your browser&apos;s IndexedDB. No cloud sync, no data mining, no
                  privacy concerns.
                </p>
                <div className="mt-auto grid grid-cols-3 gap-4">
                  <div className="rounded-xl bg-stone-50 p-4 text-center">
                    <div className="font-bricolage-grotesque text-2xl font-bold text-brand-500">
                      0
                    </div>
                    <div className="text-xs text-stone-500">Servers</div>
                  </div>
                  <div className="rounded-xl bg-stone-50 p-4 text-center">
                    <div className="font-bricolage-grotesque text-2xl font-bold text-brand-500">
                      0
                    </div>
                    <div className="text-xs text-stone-500">Trackers</div>
                  </div>
                  <div className="rounded-xl bg-stone-50 p-4 text-center">
                    <div className="font-bricolage-grotesque text-2xl font-bold text-brand-500">
                      100%
                    </div>
                    <div className="text-xs text-stone-500">Private</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Speed card */}
            <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-amber-100/80 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100">
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
            <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-100/80 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">
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
            <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/80 transition-transform duration-500 group-hover:scale-150" />
              <div className="relative">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
                  <Sparkles className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                  Save templates
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  Create once, reuse forever. Maintain consistent branding across
                  all your invoices.
                </p>
              </div>
            </div>
            {/* PDF export card */}
            <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white p-6 transition-all duration-500 hover:shadow-xl hover:shadow-stone-900/5 sm:col-span-2 lg:col-span-2">
              <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-100/60 transition-transform duration-500 group-hover:scale-125" />
              <div className="relative flex items-center gap-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-sky-100">
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
      {/* CTA section */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-4xl bg-stone-900 p-10 sm:p-16">
            {/* Background effects */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-1/4 top-0 h-full w-1/2 bg-linear-to-r from-brand-500/20 to-transparent" />
              <div className="absolute -right-1/4 bottom-0 h-full w-1/2 bg-linear-to-l from-amber-500/10 to-transparent" />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
                  backgroundSize: "32px 32px"
                }}
              />
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70">
                <Zap className="h-3.5 w-3.5" />
                Takes less than a minute
              </div>
              <h2 className="font-bricolage-grotesque text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Ready to create your
                <br />
                <span className="text-brand-400">first invoice?</span>
              </h2>
              <p className="mt-5 max-w-md text-lg text-stone-400">
                No sign-up, no credit card, no strings attached. Just start
                creating beautiful invoices right now.
              </p>
              <Link to="/create" preload="viewport" className="mt-8">
                <Button className="group h-10 gap-2 rounded-sm bg-white px-6 text-sm font-semibold text-stone-900 shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-stone-50">
                  Create your invoice
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-500">
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  Free forever
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
                  No account needed
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-emerald-400" />
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
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-400">
                <FileText className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bricolage-grotesque text-base font-bold text-stone-900">
                billsend
              </span>
            </div>
            <p className="text-sm text-stone-500">
              © {dayjs().format("YYYY")} billsend.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
