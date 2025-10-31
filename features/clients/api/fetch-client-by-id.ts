import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { client } from "db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { z } from "zod";

const fetchClientByIdSchema = z.object({
  clientId: z.string().min(1, "Client ID is required")
});

export const fetchClientById = createServerFn({
  method: "POST"
})
  .inputValidator(fetchClientByIdSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) throw new Error("Unauthorized");

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) throw new Error("No organization found");

    const organizationId = organizations[0]?.id;

    if (!organizationId) throw new Error("No organization found");

    const [clientData] = await db
      .select()
      .from(client)
      .where(
        and(
          eq(client.id, data.clientId),
          eq(client.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!clientData) throw new Error("Client not found");

    return clientData;
  });

