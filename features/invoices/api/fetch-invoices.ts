import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { client, invoice } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";

export const fetchInvoices = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) throw new Error("Unauthorized");

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) return [];

    const organizationId = organizations[0]?.id;

    if (!organizationId) return [];

    const invoices = await db
      .select({
        invoice: invoice,
        client: client
      })
      .from(invoice)
      .innerJoin(client, eq(invoice.clientId, client.id))
      .where(eq(invoice.organizationId, organizationId));

    return invoices.map(({ invoice: inv, client: cl }) => ({
      ...inv,
      clientName: cl.name
    }));
  }
);
