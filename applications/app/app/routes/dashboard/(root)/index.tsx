import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardHeader } from "components/dashboard-header";
import { StatusBadge } from "components/status-badge";
import { Button } from "components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "components/ui/card";
import { Skeleton } from "components/ui/skeleton";
import dayjs from "dayjs";
import { dashboardStatsQuery } from "features/dashboard/queries/dashboard-stats-query";
import {
  CheckCircle,
  Clock,
  FileText,
  Plus,
  TrendingDown,
  TrendingUp
} from "lucide-react";
import plur from "plur";
import { Suspense } from "react";

export const Route = createFileRoute("/dashboard/(root)/")({
  component: Dashboard
});

function Dashboard() {
  const { user } = Route.useRouteContext();

  return (
    <div className="flex flex-1 flex-col bg-white">
      <DashboardHeader>
        <div>
          <h2 className="text-base font-medium text-gray-900">
            Welcome back, {user.name}
          </h2>
        </div>
      </DashboardHeader>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
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

  function formatCurrency(amount: string | number, currency = "GBP") {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency
    }).format(num);
  }

  function formatDate(date: Date | string) {
    return dayjs(date).format("YYYY-MM-DD");
  }

  return (
    <main className="lg:hs-[calc(100dvh-4rem)] flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total invoices
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
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total revenue
                </p>
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
          </CardContent>
        </Card>
        <Card>
          <CardContent>
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
              {stats.pending} {plur("invoice", stats.pending)} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pending}
                </p>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              {plur("Invoice", stats.pending)} awaiting payment
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Revenue History</CardTitle>
            <CardDescription>
              Check out the total revenue and outstanding amount
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-full flex-col">
            {stats.monthlyRevenue.length > 0 ? (
              <>
                <div className="flex flex-1 flex-col justify-between space-y-3">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-4">
            <CardTitle>Recent Invoices</CardTitle>
            <Link
              to="/dashboard/invoices"
              className="text-sm text-blue-600 hover:text-blue-800"
              preload="intent"
            >
              View All →
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {stats.recentInvoices.length > 0 ? (
                stats.recentInvoices.map(invoice => (
                  <Link
                    key={invoice.id}
                    to="/dashboard/invoices/$invoiceId"
                    params={{ invoiceId: invoice.id }}
                    preload="intent"
                    className="flex items-center justify-between rounded-lg px-2 py-2 transition-colors hover:bg-gray-50"
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
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="flex items-center justify-between border-b pb-4">
          <CardTitle>Recent clients</CardTitle>
          <Link to="/dashboard/clients/create" preload="intent">
            <Button>
              <Plus className="size-4 shrink-0" />
              Add Client
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
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
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                preload="intent"
              >
                <Plus className="size-4 shrink-0" />
                <span>Create your first client</span>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <main className="lg:hs-[calc(100dvh-4rem)] flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from([
          { title: "Total invoices", footer: "All time" },
          { title: "Total revenue", footer: "From paid invoices" },
          {
            title: "Outstanding",
            footer: (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Skeleton className="inline-block h-3 w-2 rounded-xs" />
                <span className="text-xs text-gray-500">invoices pending</span>
              </span>
            )
          },
          { title: "Pending", footer: "Invoices awaiting payment" }
        ]).map((item, i) => (
          <Card key={i}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {item.title}
                  </p>
                  <Skeleton className="mb-1 h-[30px] w-28" />
                </div>
              </div>
              <div className="mt-0.5 text-xs text-gray-500">{item.footer}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="pb-4">
            <CardTitle>Revenue History</CardTitle>
            <CardDescription>
              Check out the total revenue and outstanding amount
            </CardDescription>
          </CardHeader>
          <CardContent className="flex h-full flex-col pt-0">
            <div className="flex flex-1 flex-col justify-between space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-6 rounded-xs" />
                  <Skeleton className="h-6 flex-1 rounded-xs" />
                </div>
              ))}
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between pb-4">
            <CardTitle>Recent Invoices</CardTitle>
            <Link
              to="/dashboard/invoices"
              className="text-sm text-blue-600 hover:text-blue-800"
              preload="intent"
            >
              View All →
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-[18px]">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-2 py-2"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="overflow-hidden">
        <CardHeader className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <CardTitle>Recent clients</CardTitle>
          </div>
          <Link
            to="/dashboard/clients/create"
            className="text-sm text-blue-600 hover:text-blue-800"
            preload="intent"
          >
            <Button>
              <Plus className="size-4 shrink-0" />
              Add Client
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-28" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="px-6 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="ml-3 h-4 w-32" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-8" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </main>
  );
}
