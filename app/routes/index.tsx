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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav
        className={`fixed z-50 mx-auto w-full transition-all duration-300 ${isScrolled ? "top-4" : "top-4 sm:top-16"}`}
      >
        <div className="mx-auto max-w-[calc(1280px+4rem)] px-4 sm:px-8">
          <div className="mx-auto max-w-[calc(1280px+4rem)] rounded-2xl border border-gray-100 bg-white/90 px-4 backdrop-blur-sm">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <h1 className="text-brand-500 font-bricolage-grotesque text-xl font-bold">
                  billsend
                </h1>
              </div>
              <Link to="/create" preload="viewport">
                <Button className="cursor-pointer">Create Invoice</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <div className="mx-auto max-w-[calc(1280px+4rem)] bg-linear-to-b from-blue-50 to-red-50 sm:mt-8 sm:rounded-4xl sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pt-40 pb-16 sm:px-6 sm:pt-28 lg:px-8">
          <div className="mb-16 text-center">
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <Lock className="h-3.5 w-3.5" />
              100% local &amp; private
            </div>
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-7xl">
              Create beautiful invoices
              <span className="block text-[#FA695C]">in your browser</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              A free, local-first invoice editor. Your data never leaves your
              browser. No account needed, no servers, no tracking. Just create,
              customise, and download.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/create" preload="viewport">
                <Button className="bg-brand-400 hover:bg-brand-500 flex h-[unset] items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold text-white transition-colors">
                  Start creating
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          {/* Feature Cards */}
          <div className="relative mb-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <HardDrive className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Local-First Storage
                </h3>
                <p className="text-sm text-gray-600">
                  All your invoices and templates are stored securely in your
                  browser&apos;s IndexedDB. Your data stays on your device.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Palette className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Fully Customisable
                </h3>
                <p className="text-sm text-gray-600">
                  Adjust colours, fonts, spacing, and layouts. Save your designs
                  as templates for future invoices.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <Download className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Instant PDF Export
                </h3>
                <p className="text-sm text-gray-600">
                  Generate professional PDF invoices in one click. Ready to send
                  to your clients immediately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Everything you need, nothing you don&apos;t
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-balance text-gray-600">
              Simple, powerful features designed for freelancers and small
              businesses.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-[#FA695C] to-orange-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                No loading screens, no waiting. Everything runs instantly in
                your browser with zero latency.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-emerald-500 to-teal-600">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Complete Privacy
              </h3>
              <p className="text-gray-600">
                No accounts, no servers, no tracking. Your financial data stays
                exactly where it should—with you.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-blue-500 to-purple-600">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Save Templates
              </h3>
              <p className="text-gray-600">
                Create once, reuse forever. Save your custom designs as
                templates for consistent branding.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="mx-auto mb-8 max-w-[calc(1280px+4rem)] bg-linear-to-b from-red-50 to-blue-50 py-20 sm:rounded-4xl">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-semibold">
            Ready to create your first invoice?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-balance text-gray-600">
            No sign-up required. Start designing your invoice right now, it only
            takes a minute.
          </p>
          <Link to="/create" preload="viewport">
            <Button className="bg-brand-400 hover:bg-brand-500 h-[unset] rounded-lg px-8 py-4 text-lg font-semibold text-white transition-colors">
              Create your invoice
            </Button>
          </Link>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <h3 className="text-brand-500 font-bricolage-grotesque text-xl font-bold">
                billsend
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              © {dayjs().format("YYYY")} billsend.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
