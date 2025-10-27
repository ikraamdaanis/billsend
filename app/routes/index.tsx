import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  MessageSquare,
  Plus,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-16 z-50 mx-auto w-full">
        <div className="mx-auto max-w-7xl rounded-2xl border border-gray-100 bg-white/90 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#FA695C] to-purple-600">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">billsend.io</h1>
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
              <button className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
                Sign in
              </button>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Floating Cards */}
      <div className="mx-auto mt-8 max-w-[calc(1280px+4rem)] rounded-4xl bg-linear-to-b from-blue-50 to-red-50 pt-16">
        <div className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-7xl">
              AI-powered invoicing
              <span className="block text-[#FA695C]">with human precision</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-gray-600">
              Empower your business with intelligent invoicing that creates,
              sends, and tracks payments with unmatched efficiency and
              reliability.
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

              {/* Center Column - Chat Interface */}
              <div className="rounded-2xl border border-gray-200 bg-white/90 p-8 shadow-sm backdrop-blur-sm">
                <div className="mb-6 flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#FA695C] to-purple-600">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">
                    New chat
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    Generate a professional invoice for my latest project
                    including all line items and payment terms.
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    What are the key performance trends for my invoicing this
                    quarter?
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    Create a payment reminder template for overdue invoices.
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
            <button className="flex items-center justify-center rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700">
              Try for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <button className="rounded-lg border border-gray-300 px-8 py-4 text-lg font-semibold text-gray-700 transition-colors hover:border-gray-400">
              Request a Demo
            </button>
          </div>
        </div>
      </div>
      {/* Trusted Partners */}
      <div className="bg-white/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h3 className="text-lg font-medium text-gray-600">
              Our trusted partners
            </h3>
          </div>
          <div className="flex items-center justify-center space-x-12 opacity-60">
            <div className="text-2xl font-bold text-gray-400">Stripe</div>
            <div className="text-2xl font-bold text-gray-400">PayPal</div>
            <div className="text-2xl font-bold text-gray-400">Xero</div>
            <div className="text-2xl font-bold text-gray-400">QuickBooks</div>
            <div className="text-2xl font-bold text-gray-400">HubSpot</div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why businesses love our AI-powered invoicing
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Intelligent features that transform how you manage invoices and
              payments.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-[#FA695C] to-orange-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                AI-Powered Generation
              </h3>
              <p className="text-gray-600">
                Automatically generate professional invoices with smart
                suggestions and error detection.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
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
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Smart Automation
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
      <div className="bg-gradient-to-r from-[#FA695C] to-purple-600 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-4xl font-bold text-white">
            Supercharge your invoicing with AI today!
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#FA695C] to-purple-600">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">billsend.io</h3>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 billsend.io. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
