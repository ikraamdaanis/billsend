import {
  boolean,
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  // $onUpdate automatically updates this timestamp whenever the row is modified
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}).enableRLS(); // Row Level Security - restricts access based on user permissions

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  // Foreign key: if user is deleted, all their sessions are automatically deleted
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id")
}).enableRLS();

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}).enableRLS();

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}).enableRLS();

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  defaultTemplateId: text("default_template_id"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}).enableRLS();

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}).enableRLS();

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}).enableRLS();

export const client = pgTable("client", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  // JSONB allows storing structured JSON data with TypeScript type safety
  // Stores address as a flexible object in the database
  address: jsonb("address").$type<{
    line1?: string;
    line2?: string;
    city?: string;
    country?: string;
    postalCode?: string;
  }>(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  // onDelete: "set null" - if template is deleted, just clear this reference (don't delete client)
  defaultTemplateId: text("default_template_id").references(
    () => invoiceTemplate.id,
    { onDelete: "set null" }
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull()
}).enableRLS();

export const invoice = pgTable(
  "invoice",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    clientId: text("client_id")
      .notNull()
      .references(() => client.id, { onDelete: "cascade" }),
    invoiceNumber: text("invoice_number").notNull(),
    invoiceDate: timestamp("invoice_date").notNull(),
    dueDate: timestamp("due_date").notNull(),
    status: text("status").default("draft").notNull(),
    // Array of line items stored as JSONB snapshot for invoice immutability
    // Each item can optionally reference a product for analytics/tracking
    lineItems: jsonb("line_items").$type<
      {
        productId?: string; // Optional reference to product table
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }[]
    >(),
    // numeric type for precise decimal calculations (important for money!)
    subtotal: numeric("subtotal").notNull(),
    tax: numeric("tax").default("0").notNull(),
    total: numeric("total").notNull(),
    currency: text("currency").default("GBP").notNull(),
    notes: text("notes"),
    // Design snapshot fields preserve the invoice appearance even if template changes later
    // This ensures invoices always look the same as when they were created
    designSnapshotTemplateId: text("design_snapshot_template_id").references(
      () => invoiceTemplate.id,
      { onDelete: "set null" }
    ),
    designSnapshotTokens: jsonb("design_snapshot_tokens").$type<{
      fontFamily: "system" | "geist" | "inter";
      baseTextSize: "sm" | "md" | "lg";
      accentColorHex: string;
      spacingScale: "compact" | "comfortable";
      borderStyle: "none" | "subtle" | "strong";
      logoPosition: "left" | "right" | "top";
      pageSize: "A4" | "Letter";
    }>(),
    designSnapshotVisibility: jsonb("design_snapshot_visibility").$type<{
      companyDetails: boolean;
      clientDetails: boolean;
      notes: boolean;
      terms: boolean;
      paymentDetails: boolean;
      taxRow: boolean;
      discountRow: boolean;
      footer: boolean;
    }>(),
    designSnapshotLogoPosition: text("design_snapshot_logo_position").$type<
      "top" | "left" | "right"
    >(),
    designSnapshotTakenAt: timestamp("design_snapshot_taken_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  // Indexes and constraints defined as an array (Drizzle 0.36+ syntax)
  table => [
    // Index speeds up queries that filter by template ID
    index("invoice_design_snapshot_template_id_idx").on(
      table.designSnapshotTemplateId
    )
  ]
).enableRLS();

// Product catalog table - reusable line items that can be added to invoices
// Users can maintain a library of common products/services they sell
export const product = pgTable(
  "product",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    // Optional: link product to specific client for client-specific pricing/products
    // If null, product is available to all clients in the organization
    clientId: text("client_id").references(() => client.id, {
      onDelete: "cascade"
    }),
    name: text("name").notNull(),
    description: text("description"),
    // Default unit price - can be overridden when adding to invoice
    unitPrice: numeric("unit_price").notNull(),
    // Optional: track if product is a service vs physical good
    type: text("type").$type<"product" | "service">().default("product"),
    // Soft delete - mark as archived instead of deleting
    isArchived: boolean("is_archived").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    // Index for fetching active products by organization
    index("product_organization_id_idx").on(table.organizationId),
    // Index for fetching products for a specific client
    index("product_client_id_idx").on(table.clientId),
    // Index for filtering archived vs active products
    index("product_is_archived_idx").on(table.isArchived)
  ]
).enableRLS();

export const invoiceTemplate = pgTable(
  "invoice_template",
  {
    id: text("id").primaryKey(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    baseTemplateId: text("base_template_id"),
    // Design tokens control the visual appearance of invoices
    tokens: jsonb("tokens")
      .$type<{
        fontFamily: "system" | "geist" | "inter";
        baseTextSize: "sm" | "md" | "lg";
        accentColorHex: string;
        spacingScale: "compact" | "comfortable";
        borderStyle: "none" | "subtle" | "strong";
        logoPosition: "left" | "right" | "top";
        pageSize: "A4" | "Letter";
      }>()
      .notNull(),
    // Visibility controls which sections appear on the invoice
    visibility: jsonb("visibility")
      .$type<{
        companyDetails: boolean;
        clientDetails: boolean;
        notes: boolean;
        terms: boolean;
        paymentDetails: boolean;
        taxRow: boolean;
        discountRow: boolean;
        footer: boolean;
      }>()
      .notNull(),
    logoPosition: text("logo_position").$type<"top" | "left" | "right">(),
    createdByUserId: text("created_by_user_id").references(() => user.id, {
      onDelete: "set null"
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull()
  },
  table => [
    // Composite unique constraint: each org can only have one template with a given name
    // Prevents duplicate template names within the same organization
    unique().on(table.organizationId, table.name),
    // Index for fast lookups when fetching all templates for an organization
    index("invoice_template_organization_id_idx").on(table.organizationId)
  ]
).enableRLS();
