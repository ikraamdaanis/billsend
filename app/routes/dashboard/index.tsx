import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { StatusBadge } from "components/status-badge";
import { SidebarTrigger } from "components/ui/sidebar";
import { Skeleton } from "components/ui/skeleton";
import { dashboardStatsQuery } from "features/dashboard/queries/dashboard-stats-query";
import { authClient } from "lib/auth-client";
import {
  Bell,
  CheckCircle,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Info,
  Plus,
  Search,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
  loader: ({ context }) => {
    return context.queryClient.prefetchQuery(dashboardStatsQuery());
  }
});

function Dashboard() {
  const { user } = Route.useRouteContext();
  const { data: activeOrganization } = authClient.useActiveOrganization();

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
    : (user.email && user.email[0].toUpperCase()) || "U";

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back, {user.name || user.email || "User"}!
              </h2>
              <p className="text-sm text-gray-500">
                {activeOrganization?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Info className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                <span className="text-sm font-medium text-gray-600">
                  {userInitials.slice(0, 2)}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>
      {/* Dashboard Content */}
      <main className="flex-1 space-y-6 p-6">
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <>
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6"
          >
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="mb-4 h-8 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
      {/* Charts and Tables Row Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
      {/* Client Table Skeleton */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function DashboardContent() {
  const { data: stats } = useSuspenseQuery(dashboardStatsQuery());

  // Calculate month-over-month changes
  const previousMonthRevenue =
    stats.monthlyRevenue.length > 1
      ? stats.monthlyRevenue[stats.monthlyRevenue.length - 2]?.paid || 0
      : 0;
  const currentMonthRevenue =
    stats.monthlyRevenue.length > 0
      ? stats.monthlyRevenue[stats.monthlyRevenue.length - 1]?.paid || 0
      : 0;
  const revenueChange =
    previousMonthRevenue > 0
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
        100
      : 0;

  const previousMonthOutstanding =
    stats.monthlyRevenue.length > 1
      ? stats.monthlyRevenue[stats.monthlyRevenue.length - 2]?.outstanding || 0
      : 0;
  const currentMonthOutstanding =
    stats.monthlyRevenue.length > 0
      ? stats.monthlyRevenue[stats.monthlyRevenue.length - 1]?.outstanding || 0
      : 0;
  const outstandingChange =
    previousMonthOutstanding > 0
      ? ((currentMonthOutstanding - previousMonthOutstanding) /
          previousMonthOutstanding) *
        100
      : 0;

  const formatCurrency = (amount: string | number, currency = "GBP") => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency
    }).format(num);
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  return (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Invoices
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalInvoices}
              </p>
            </div>
            {revenueChange !== 0 && (
              <div
                className={`flex items-center ${
                  revenueChange > 0 ? "text-green-600" : "text-gray-500"
                }`}
              >
                {revenueChange > 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {revenueChange > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(revenueChange).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">All time</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            {revenueChange !== 0 && (
              <div
                className={`flex items-center ${
                  revenueChange > 0 ? "text-green-600" : "text-gray-500"
                }`}
              >
                {revenueChange > 0 ? (
                  <TrendingUp className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {revenueChange > 0 ? "↑" : "↓"}{" "}
                  {Math.abs(revenueChange).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">From paid invoices</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.outstanding)}
              </p>
            </div>
            {outstandingChange !== 0 && (
              <div
                className={`flex items-center ${
                  outstandingChange < 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {outstandingChange < 0 ? (
                  <TrendingDown className="mr-1 h-4 w-4" />
                ) : (
                  <TrendingUp className="mr-1 h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  {outstandingChange < 0 ? "↓" : "↑"}{" "}
                  {Math.abs(outstandingChange).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {stats.pending} invoices pending
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Invoices awaiting payment
          </p>
        </div>
      </div>
      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Revenue History
              </h3>
              <p className="text-sm text-gray-500">
                Check out the total revenue and outstanding amount
              </p>
            </div>
          </div>
          {/* Simple Bar Chart */}
          {stats.monthlyRevenue.length > 0 ? (
            <>
              <div className="space-y-3">
                {stats.monthlyRevenue.map((item, index) => {
                  const maxValue = Math.max(
                    ...stats.monthlyRevenue.map(m => m.paid + m.outstanding)
                  );
                  const paidWidth =
                    maxValue > 0 ? (item.paid / maxValue) * 100 : 0;
                  const outstandingWidth =
                    maxValue > 0 ? (item.outstanding / maxValue) * 100 : 0;

                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-20 text-xs text-gray-600">
                        {item.shortMonth}
                      </div>
                      <div className="flex flex-1 items-center space-x-2">
                        {item.paid > 0 && (
                          <div
                            className="flex h-6 items-center justify-end rounded bg-blue-600 pr-2"
                            style={{ width: `${paidWidth}%` }}
                          >
                            {paidWidth > 15 && (
                              <span className="text-xs font-medium text-white">
                                {formatCurrency(item.paid).replace("GBP", "")}
                              </span>
                            )}
                          </div>
                        )}
                        {item.outstanding > 0 && (
                          <div
                            className="flex h-6 items-center justify-end rounded bg-blue-200 pr-2"
                            style={{ width: `${outstandingWidth}%` }}
                          >
                            {outstandingWidth > 15 && (
                              <span className="text-xs font-medium text-blue-800">
                                {formatCurrency(item.outstanding).replace(
                                  "GBP",
                                  ""
                                )}
                              </span>
                            )}
                          </div>
                        )}
                        {item.paid === 0 && item.outstanding === 0 && (
                          <div className="flex h-6 flex-1 items-center justify-center text-xs text-gray-400">
                            No data
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded bg-blue-600"></div>
                  <span className="text-sm text-gray-600">Paid</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded bg-blue-200"></div>
                  <span className="text-sm text-gray-600">Outstanding</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-48 items-center justify-center text-sm text-gray-500">
              No revenue data available
            </div>
          )}
        </div>
        {/* Recent Invoices */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Invoices
            </h3>
            <Link
              to="/dashboard/invoices"
              className="text-sm text-blue-600 hover:text-blue-800"
              preload="intent"
            >
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {stats.recentInvoices.length > 0 ? (
              stats.recentInvoices.map(invoice => (
                <Link
                  key={invoice.id}
                  to="/dashboard/invoices/$invoiceId"
                  params={{ invoiceId: invoice.id }}
                  preload="intent"
                  className="flex items-center justify-between rounded-lg py-2 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </p>
                      <p className="text-xs text-gray-500">
                        {invoice.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.total, invoice.currency)}
                    </p>
                    <StatusBadge
                      status={
                        invoice.status as
                          | "draft"
                          | "sent"
                          | "paid"
                          | "overdue"
                          | "cancelled"
                      }
                    />
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-8 text-center text-sm text-gray-500">
                No invoices yet
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Client Details Table */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Client Details
              </h3>
              <span className="text-sm text-gray-500">
                {stats.recentClients.length} Clients
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to="/dashboard/clients"
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100"
                preload="intent"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm">Export</span>
              </Link>
              <Link
                to="/dashboard/clients/create"
                className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                preload="intent"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Client</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {stats.recentClients.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Total Invoices
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Total Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Last Invoice
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats.recentClients.map(client => {
                  const initials = client.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                  return (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to="/dashboard/clients/$clientId"
                          params={{ clientId: client.id }}
                          preload="intent"
                          className="flex items-center hover:text-blue-600"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                            <span className="text-sm font-medium text-gray-600">
                              {initials}
                            </span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {client.name}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {client.invoices}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {formatCurrency(client.totalAmount)}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                        {client.lastInvoice
                          ? formatDate(client.lastInvoice)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            client.status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {client.status === "Active" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : (
                            <Clock className="mr-1 h-3 w-3" />
                          )}
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-500">No clients yet</p>
              <Link
                to="/dashboard/clients/create"
                className="mt-4 inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                preload="intent"
              >
                <Plus className="h-4 w-4" />
                <span>Create your first client</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
