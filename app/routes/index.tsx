import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "components/ui/button";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Plus,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY;
      const threshold = 32; // 1rem = 16px
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
                <div className="flex items-center space-x-2">
                  <h1 className="text-brand-500 text-xl font-bold">billsend</h1>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <a
                    href="#features"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Product
                  </a>
                  <a
                    href="#pricing"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Pricing
                  </a>
                  <a
                    href="#resources"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Resources
                  </a>
                  <a
                    href="#blog"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
                  >
                    Blog
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/dashboard">
                  <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                    Sign in
                  </button>
                </Link>
                <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section with Floating Cards */}
      <div className="mx-auto max-w-[calc(1280px+4rem)] bg-linear-to-b from-blue-50 to-red-50 sm:mt-8 sm:rounded-4xl sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 pt-40 pb-16 sm:px-6 sm:pt-28 lg:px-8">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-7xl">
              Professional invoicing
              <span className="block text-[#FA695C]">made simple</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              Create, send, and track invoices with ease. Streamline your
              billing process and get paid faster with our intuitive platform.
            </p>
          </div>
          {/* Floating Data Cards */}
          <div className="relative mb-16">
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
              {/* Left Column - Small Stats */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div className="mb-2 text-3xl font-bold text-[#FA695C]">
                    68%
                  </div>
                  <div className="text-sm text-gray-600">
                    Payment success rate this year
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div className="mb-2 text-3xl font-bold text-green-600">
                    48%
                  </div>
                  <div className="text-sm text-gray-600">
                    Faster payment processing
                  </div>
                </div>
              </div>
              {/* Center Column - Quick Actions */}
              <div className="rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
                <div className="mb-6 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-[#FA695C] to-purple-600">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    Quick Actions
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    Create a new invoice in minutes with our simple form
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    Track payment status and send automated reminders
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    Export invoices to PDF with your custom branding
                  </div>
                </div>
              </div>
              {/* Right Column - Revenue Stats */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    £468,682
                  </div>
                  <div className="text-xs text-green-600">
                    +12.5% from last month
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">Outstanding</span>
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    £127,450
                  </div>
                  <div className="text-xs text-orange-600">
                    23 invoices pending
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Target Progress
                    </span>
                    <Target className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">88%</div>
                  <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-[#FA695C]"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button className="bg-brand-400 hover:bg-brand-500 flex h-[unset] items-center justify-center rounded-lg px-8 py-4 text-lg font-semibold text-white transition-colors">
              Try for free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why businesses love our invoicing platform
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-balance text-gray-600">
              Powerful features that transform how you manage invoices and
              payments.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-[#FA695C] to-orange-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Easy Invoice Creation
              </h3>
              <p className="text-gray-600">
                Create professional invoices quickly with our intuitive form and
                customizable templates.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-blue-500 to-purple-600">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Real-Time Analytics
              </h3>
              <p className="text-gray-600">
                Track payment trends, revenue insights, and client behaviour
                with detailed dashboards.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-green-500 to-emerald-600">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Payment Automation
              </h3>
              <p className="text-gray-600">
                Automated payment reminders, follow-ups, and invoice scheduling
                to get paid faster.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* CTA Section */}
      <div className="mx-auto mb-8 max-w-[calc(1280px+4rem)] bg-linear-to-b from-red-50 to-blue-50 py-20 sm:rounded-4xl">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-semibold">
            Streamline your invoicing today!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-balance text-gray-600">
            Join thousands of businesses already using billsend.io to streamline
            their invoicing process.
          </p>
          <button className="rounded-lg bg-white px-8 py-4 text-lg font-semibold text-[#FA695C] transition-colors hover:bg-gray-50">
            Contact us
          </button>
        </div>
      </div>
      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center space-x-2">
              <h3 className="text-brand-500 text-xl font-bold">billsend</h3>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} billsend.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
