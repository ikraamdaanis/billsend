import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { db } from "db";
import { invoiceTemplate } from "db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "lib/auth";
import { z } from "zod";

export const listTemplates = createServerFn({ method: "GET" }).handler(
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

    const templates = await db
      .select()
      .from(invoiceTemplate)
      .where(eq(invoiceTemplate.organizationId, organizationId));

    return templates;
  }
);

export const getTemplateById = createServerFn({
  method: "POST"
})
  .inputValidator(
    z.object({
      templateId: z.string().min(1, "Template ID is required")
    })
  )
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

    const [template] = await db
      .select()
      .from(invoiceTemplate)
      .where(
        and(
          eq(invoiceTemplate.id, data.templateId),
          eq(invoiceTemplate.organizationId, organizationId)
        )
      )
      .limit(1);

    if (!template) throw new Error("Template not found");

    return template;
  });

const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  baseTemplateId: z.string().optional(),
  tokens: z.object({
    fontFamily: z.enum(["system", "geist", "inter"]),
    baseTextSize: z.enum(["sm", "md", "lg"]),
    accentColorHex: z.string().min(1),
    spacingScale: z.enum(["compact", "comfortable"]),
    borderStyle: z.enum(["none", "subtle", "strong"]),
    logoPosition: z.enum(["left", "right", "top"]),
    pageSize: z.enum(["A4", "Letter"])
  }),
  visibility: z.object({
    companyDetails: z.boolean(),
    clientDetails: z.boolean(),
    notes: z.boolean(),
    terms: z.boolean(),
    paymentDetails: z.boolean(),
    taxRow: z.boolean(),
    discountRow: z.boolean(),
    footer: z.boolean()
  }),
  logoPosition: z.enum(["top", "left", "right"]).optional()
});

export const createTemplate = createServerFn({
  method: "POST"
})
  .inputValidator(createTemplateSchema)
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

    const userId = session.user?.id;

    const [newTemplate] = await db
      .insert(invoiceTemplate)
      .values({
        id: crypto.randomUUID(),
        organizationId,
        name: data.name,
        description: data.description || null,
        baseTemplateId: data.baseTemplateId || null,
        tokens: data.tokens,
        visibility: data.visibility,
        logoPosition: data.logoPosition || null,
        createdByUserId: userId || null
      })
      .returning();

    return newTemplate;
  });

const updateTemplateSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  tokens: z.object({
    fontFamily: z.enum(["system", "geist", "inter"]),
    baseTextSize: z.enum(["sm", "md", "lg"]),
    accentColorHex: z.string().min(1),
    spacingScale: z.enum(["compact", "comfortable"]),
    borderStyle: z.enum(["none", "subtle", "strong"]),
    logoPosition: z.enum(["left", "right", "top"]),
    pageSize: z.enum(["A4", "Letter"])
  }),
  visibility: z.object({
    companyDetails: z.boolean(),
    clientDetails: z.boolean(),
    notes: z.boolean(),
    terms: z.boolean(),
    paymentDetails: z.boolean(),
    taxRow: z.boolean(),
    discountRow: z.boolean(),
    footer: z.boolean()
  }),
  logoPosition: z.enum(["top", "left", "right"]).optional()
});

export const updateTemplate = createServerFn({
  method: "POST"
})
  .inputValidator(updateTemplateSchema)
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

    const [updatedTemplate] = await db
      .update(invoiceTemplate)
      .set({
        name: data.name,
        description: data.description || null,
        tokens: data.tokens,
        visibility: data.visibility,
        logoPosition: data.logoPosition || null,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(invoiceTemplate.id, data.templateId),
          eq(invoiceTemplate.organizationId, organizationId)
        )
      )
      .returning();

    if (!updatedTemplate) throw new Error("Template not found");

    return updatedTemplate;
  });

