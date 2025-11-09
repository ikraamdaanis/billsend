import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { client } from "db/schema";
import { auth } from "lib/auth";
import { z } from "zod";

const createClientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z
    .object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      postalCode: z.string().optional()
    })
    .optional()
});

export const createClient = createServerFn({
  method: "POST"
})
  .inputValidator(createClientSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) throw new Error("Unauthorized");

    const validatedData = createClientSchema.parse(data);

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) throw new Error("No organization found");

    const organizationId = organizations[0]?.id;

    if (!organizationId) throw new Error("No organization found");

    const [newClient] = await db
      .insert(client)
      .values({
        id: crypto.randomUUID(),
        name: validatedData.name,
        email: validatedData.email || null,
        phone: validatedData.phone || null,
        address: validatedData.address || null,
        organizationId
      })
      .returning();

    return newClient;
  });
