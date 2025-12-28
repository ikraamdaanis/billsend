import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import dayjs from "dayjs";
import {
  ArrowRight,
  Download,
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
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="animate-drift absolute -right-32 -top-32 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-brand-200/60 via-brand-300/40 to-orange-200/50 blur-3xl" />
        <div className="animate-drift-slow absolute -bottom-48 -left-48 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-amber-100/70 via-brand-100/50 to-rose-100/60 blur-3xl" />
        <div className="animate-drift-slower absolute left-1/2 top-1/3 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-brand-100/30 blur-3xl" />
      </div>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.4]"
        style={{
          backgroundImage: `radial-gradient(circle, #fa695c 0.5px, transparent 0.5px)`,
          backgroundSize: "24px 24px"
        }}
      />
      <nav
        className={`fixed z-50 mx-auto w-full transition-all duration-500 ${isScrolled ? "top-4" : "top-6 sm:top-8"}`}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div
            className={`mx-auto rounded-2xl border border-stone-200/80 bg-white/70 px-6 backdrop-blur-xl transition-all duration-500 ${isScrolled ? "shadow-xl shadow-stone-200/50" : "shadow-lg shadow-stone-200/30"}`}
          >
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="font-bricolage-grotesque text-xl font-bold text-brand-500">
                  billsend
                </h1>
              </div>
              <Link to="/create" preload="viewport">
                <Button className="cursor-pointer bg-brand-400 text-white hover:bg-brand-500">
                  Create Invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <div className="relative mx-auto max-w-5xl px-4 pt-40 pb-20 sm:px-8 sm:pt-48">
        <div className="relative text-center">
          <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
            <Lock className="h-3.5 w-3.5" />
            100% local &amp; private
          </div>
          <h1 className="animate-fade-in-up animation-delay-100 mb-8 text-5xl font-bold tracking-tight text-stone-900 sm:text-6xl lg:text-7xl">
            Create beautiful invoices
            <span className="mt-2 block text-brand-400">in your browser</span>
          </h1>
          <p className="animate-fade-in-up animation-delay-200 mx-auto mb-12 max-w-2xl text-lg text-stone-600 sm:text-xl">
            A free, local-first invoice editor. Your data never leaves your
            browser. No account needed, no servers, no tracking. Just create,
            customise, and download.
          </p>
          <div className="animate-fade-in-up animation-delay-300">
            <Link to="/create" preload="viewport">
              <Button className="group h-auto gap-3 rounded-xl bg-brand-400 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-brand-400/30 transition-all duration-300 hover:scale-105 hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/30">
                Start creating
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="animate-fade-in-up animation-delay-400 mt-24 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-100/50 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
                <HardDrive className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-stone-900">
                Local-First Storage
              </h3>
              <p className="leading-relaxed text-stone-600">
                All your invoices and templates are stored securely in your
                browser&apos;s IndexedDB. Your data stays on your device.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-100/50 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 shadow-sm">
                <Palette className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-stone-900">
                Fully Customisable
              </h3>
              <p className="leading-relaxed text-stone-600">
                Adjust colours, fonts, spacing, and layouts. Save your designs
                as templates for future invoices.
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-3xl border border-stone-200/80 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50 sm:col-span-2 lg:col-span-1">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-100/50 transition-transform duration-500 group-hover:scale-150" />
            <div className="relative">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 shadow-sm">
                <Download className="h-7 w-7 text-sky-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-stone-900">
                Instant PDF Export
              </h3>
              <p className="leading-relaxed text-stone-600">
                Generate professional PDF invoices in one click. Ready to send
                to your clients immediately.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div id="features" className="relative py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-stone-900 sm:text-4xl">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-stone-600">
              Simple, powerful features designed for freelancers and small
              businesses.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-orange-400 shadow-lg shadow-brand-300/30">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-stone-900">
                Lightning Fast
              </h3>
              <p className="leading-relaxed text-stone-600">
                No loading screens, no waiting. Everything runs instantly in
                your browser with zero latency.
              </p>
            </div>
            <div className="group rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-300/30">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-stone-900">
                Complete Privacy
              </h3>
              <p className="leading-relaxed text-stone-600">
                No accounts, no servers, no tracking. Your financial data stays
                exactly where it should—with you.
              </p>
            </div>
            <div className="group rounded-3xl border border-stone-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg shadow-violet-300/30">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-stone-900">
                Save Templates
              </h3>
              <p className="leading-relaxed text-stone-600">
                Create once, reuse forever. Save your custom designs as
                templates for consistent branding.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="relative py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-400 via-brand-500 to-orange-500 p-12 shadow-2xl shadow-brand-400/30 sm:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="relative text-center">
              <h2 className="mb-4 text-3xl font-semibold text-white sm:text-4xl">
                Ready to create your first invoice?
              </h2>
              <p className="mx-auto mb-10 max-w-xl text-lg text-white/90">
                No sign-up required. Start designing your invoice right now, it only
                takes a minute.
              </p>
              <Link to="/create" preload="viewport">
                <Button className="h-auto rounded-xl bg-white px-10 py-4 text-lg font-semibold text-brand-500 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-stone-50">
                  Create your invoice
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="relative border-t border-stone-200 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center">
              <h3 className="font-bricolage-grotesque text-xl font-bold text-brand-500">
                billsend
              </h3>
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
