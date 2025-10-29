import { createFileRoute, redirect } from "@tanstack/react-router";
import { SidebarTrigger } from "components/ui/sidebar";
import { fetchAuth } from "features/auth/fetch-auth";
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

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
  beforeLoad: async () => {
    const { userId } = await fetchAuth();

    if (!userId) throw redirect({ to: "/signup" });
  },
  loader: async () => {
    const { userId, user } = await fetchAuth();
    return { userId, user };
  }
});

function Dashboard() {
  const { user } = Route.useLoaderData();

  return (
    <div className="flex flex-1 flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Welcome back, {user?.name || user?.email || "User"}!
              </h2>
              <p className="text-sm text-gray-500">
                Monday, 03-01-2024 | Sunny day in London
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
                <span className="text-sm font-medium text-gray-600">I</span>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 space-y-6 p-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Invoices
                </p>
                <p className="text-2xl font-bold text-gray-900">325</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span className="text-sm font-medium">↑ 3.5%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Last month</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">£25,789</p>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="text-sm font-medium">0.0</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Last month</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">£70,564</p>
              </div>
              <div className="flex items-center text-red-600">
                <TrendingDown className="mr-1 h-4 w-4" />
                <span className="text-sm font-medium">↓ 7.5%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Last month</p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <div className="flex items-center text-green-600">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span className="text-sm font-medium">↑ 3.5%</span>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">Last month</p>
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
              <select className="rounded-md border border-gray-300 px-3 py-1 text-sm">
                <option>Yearly</option>
                <option>Monthly</option>
                <option>Weekly</option>
              </select>
            </div>

            {/* Simple Bar Chart */}
            <div className="space-y-3">
              {[
                { month: "January", paid: 89456, outstanding: 45000 },
                { month: "February", paid: 75000, outstanding: 35000 },
                { month: "March", paid: 95000, outstanding: 25000 },
                { month: "April", paid: 82000, outstanding: 40000 },
                { month: "May", paid: 88000, outstanding: 30000 },
                { month: "June", paid: 92000, outstanding: 20000 }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-16 text-xs text-gray-600">{item.month}</div>
                  <div className="flex flex-1 items-center space-x-2">
                    <div className="flex h-6 flex-1 items-center justify-end rounded bg-blue-600 pr-2">
                      <span className="text-xs font-medium text-white">
                        {item.paid.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex h-6 flex-1 items-center justify-end rounded bg-blue-200 pr-2">
                      <span className="text-xs font-medium text-blue-800">
                        {item.outstanding.toLocaleString()}
                      </span>
                    </div>
                  </div>
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
          </div>

          {/* Recent Invoices */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Invoices
              </h3>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                View All →
              </a>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "INV-001",
                  client: "Acme Corp",
                  amount: "£2,500",
                  status: "Paid",
                  color: "green"
                },
                {
                  id: "INV-002",
                  client: "Tech Solutions",
                  amount: "£1,800",
                  status: "Paid",
                  color: "green"
                },
                {
                  id: "INV-003",
                  client: "Design Studio",
                  amount: "£3,200",
                  status: "Pending",
                  color: "yellow"
                },
                {
                  id: "INV-004",
                  client: "Marketing Co",
                  amount: "£1,500",
                  status: "Paid",
                  color: "green"
                },
                {
                  id: "INV-005",
                  client: "Consulting Ltd",
                  amount: "£4,000",
                  status: "Paid",
                  color: "green"
                }
              ].map((invoice, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.id}
                      </p>
                      <p className="text-xs text-gray-500">{invoice.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {invoice.amount}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        invoice.color === "green"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {invoice.status === "Paid" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
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
                <span className="text-sm text-gray-500">16 Clients</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Export</span>
                </button>
                <button className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                  <span className="text-sm">Add Client</span>
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Client Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Company
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
                {[
                  {
                    name: "John Smith",
                    company: "Acme Corp",
                    invoices: 12,
                    amount: "£25,400",
                    lastInvoice: "01/01/2024",
                    status: "Active",
                    statusColor: "green"
                  },
                  {
                    name: "Sarah Johnson",
                    company: "Tech Solutions",
                    invoices: 8,
                    amount: "£18,200",
                    lastInvoice: "28/12/2023",
                    status: "Active",
                    statusColor: "green"
                  },
                  {
                    name: "Mike Wilson",
                    company: "Design Studio",
                    invoices: 15,
                    amount: "£32,100",
                    lastInvoice: "15/12/2023",
                    status: "Pending",
                    statusColor: "yellow"
                  },
                  {
                    name: "Emma Davis",
                    company: "Marketing Co",
                    invoices: 6,
                    amount: "£12,800",
                    lastInvoice: "10/12/2023",
                    status: "Active",
                    statusColor: "green"
                  }
                ].map((client, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                          <span className="text-sm font-medium text-gray-600">
                            {client.name
                              .split(" ")
                              .map(n => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {client.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {client.company}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {client.invoices}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {client.amount}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {client.lastInvoice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          client.statusColor === "green"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {client.statusColor === "green" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <Clock className="mr-1 h-3 w-3" />
                        )}
                        {client.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
