import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { client } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";

export const fetchClients = createServerFn({ method: "GET" }).handler(
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

    const clients = await db
      .select()
      .from(client)
      .where(eq(client.organizationId, organizationId));

    return clients;
  }
);
