import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { organization } from "db/schema";
import { eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { z } from "zod";

const updateOrganizationSchema = z.object({
  name: z.string().min(1, "Organization name is required")
});

export const updateOrganization = createServerFn({
  method: "POST"
})
  .inputValidator(updateOrganizationSchema)
  .handler(async ({ data }) => {
    const session = await auth.api.getSession({
      headers: getRequest().headers
    });

    if (!session) throw new Error("Unauthorized");

    const organizations = await auth.api.listOrganizations({
      headers: getRequest().headers
    });

    if (organizations.length === 0) {
      throw new Error("No organization found");
    }

    const organizationId = organizations[0]?.id;

    if (!organizationId) {
      throw new Error("No organization found");
    }

    // Generate slug from name
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug is already taken by another org
    const existingOrg = await db
      .select()
      .from(organization)
      .where(eq(organization.slug, slug))
      .limit(1);

    if (existingOrg.length > 0 && existingOrg[0].id !== organizationId) {
      throw new Error("An organization with this name already exists");
    }

    const [updatedOrg] = await db
      .update(organization)
      .set({
        name: data.name,
        slug,
        updatedAt: new Date()
      })
      .where(eq(organization.id, organizationId))
      .returning();

    return updatedOrg;
  });
