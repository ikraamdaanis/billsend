import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { client, invoice } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";

export const fetchDashboardStats = createServerFn({
  method: "GET"
}).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequest().headers
  });

  if (!session) throw new Error("Unauthorized");

  const organizations = await auth.api.listOrganizations({
    headers: getRequest().headers
  });

  if (organizations.length === 0) {
    return {
      totalInvoices: 0,
      totalRevenue: "0",
      outstanding: "0",
      pending: 0,
      recentInvoices: [],
      recentClients: [],
      monthlyRevenue: []
    };
  }

  const organizationId = organizations[0]?.id;

  if (!organizationId) {
    return {
      totalInvoices: 0,
      totalRevenue: "0",
      outstanding: "0",
      pending: 0,
      recentInvoices: [],
      recentClients: [],
      monthlyRevenue: []
    };
  }

  // Get all invoices for calculations
  const allInvoices = await db
    .select()
    .from(invoice)
    .where(eq(invoice.organizationId, organizationId));

  // Calculate statistics
  const totalInvoices = allInvoices.length;

  // Total revenue (sum of all paid invoices)
  const paidInvoices = allInvoices.filter(inv => inv.status === "paid");
  const totalRevenue = paidInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.total || "0"),
    0
  );

  // Outstanding (sum of sent/overdue invoices)
  const outstandingInvoices = allInvoices.filter(
    inv => inv.status === "sent" || inv.status === "overdue"
  );
  const outstanding = outstandingInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.total || "0"),
    0
  );

  // Pending count (sent + overdue)
  const pending = outstandingInvoices.length;

  // Get recent invoices (last 5, with client info)
  const recentInvoicesData = allInvoices
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const recentInvoices = await Promise.all(
    recentInvoicesData.map(async inv => {
      const clientData = await db
        .select()
        .from(client)
        .where(eq(client.id, inv.clientId))
        .limit(1);

      return {
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        clientName: clientData[0]?.name || "Unknown Client",
        total: inv.total,
        currency: inv.currency,
        status: inv.status,
        createdAt: inv.createdAt
      };
    })
  );

  // Get recent clients (last 4)
  const allClients = await db
    .select()
    .from(client)
    .where(eq(client.organizationId, organizationId));

  const recentClients = allClients
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 4)
    .map(cl => ({
      id: cl.id,
      name: cl.name,
      email: cl.email || null,
      invoices: allInvoices.filter(inv => inv.clientId === cl.id).length,
      totalAmount: allInvoices
        .filter(inv => inv.clientId === cl.id)
        .reduce((sum, inv) => sum + parseFloat(inv.total || "0"), 0),
      lastInvoice: (() => {
        const clientInvoices = allInvoices.filter(
          inv => inv.clientId === cl.id
        );

        if (clientInvoices.length === 0) return null;

        return clientInvoices.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0].createdAt;
      })(),
      status: allInvoices.some(
        inv =>
          inv.clientId === cl.id &&
          (inv.status === "sent" || inv.status === "overdue")
      )
        ? "Pending"
        : "Active"
    }));

  // Calculate monthly revenue (last 6 months)
  const now = new Date();
  const monthlyRevenue = Array.from({ length: 6 })
    .map((_, i) => {
      const monthDate = new Date(now);

      monthDate.setMonth(monthDate.getMonth() - i);

      const monthStart = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        1
      );
      const monthEnd = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth() + 1,
        0
      );

      const monthInvoices = allInvoices.filter(inv => {
        const invDate = new Date(inv.createdAt);
        return invDate >= monthStart && invDate <= monthEnd;
      });

      const paid = monthInvoices
        .filter(inv => inv.status === "paid")
        .reduce((sum, inv) => sum + parseFloat(inv.total || "0"), 0);

      const outstandingAmount = monthInvoices
        .filter(inv => inv.status === "sent" || inv.status === "overdue")
        .reduce((sum, inv) => sum + parseFloat(inv.total || "0"), 0);

      return {
        month: monthDate.toLocaleDateString("en-GB", {
          month: "long",
          year: "numeric"
        }),
        shortMonth: monthDate.toLocaleDateString("en-GB", {
          month: "short"
        }),
        paid,
        outstanding: outstandingAmount
      };
    })
    .reverse();

  return {
    totalInvoices,
    totalRevenue: totalRevenue.toString(),
    outstanding: outstanding.toString(),
    pending,
    recentInvoices,
    recentClients,
    monthlyRevenue
  };
});
