import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Companies - Only for clients (customers who receive invoices)
  companies: defineTable({
    // Organization ID from Better Auth (clients belong to organizations)
    organizationId: v.string(),
    // Company information
    name: v.string(),
    // Business details
    businessName: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
    taxId: v.optional(v.string()),
    vatNumber: v.optional(v.string()),
    // Contact information
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    address: v.optional(
      v.object({
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        county: v.optional(v.string()),
        postcode: v.optional(v.string()),
        country: v.string()
      })
    ),
    defaultCurrency: v.string(),
    defaultPaymentTerms: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_organizationId_name", ["organizationId", "name"]),

  // Invoices
  invoices: defineTable({
    // Organization ID from Better Auth (the sender company)
    organizationId: v.string(),
    // User ID from Better Auth (the invoice creator)
    userId: v.string(),
    // Client company reference
    clientCompanyId: v.id("companies"),
    invoiceNumber: v.string(),
    type: v.union(
      v.literal("invoice"),
      v.literal("quote"),
      v.literal("estimate"),
      v.literal("credit_note")
    ),
    // Status
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("viewed"),
      v.literal("paid"),
      v.literal("partial"),
      v.literal("overdue"),
      v.literal("cancelled"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    // Dates
    issueDate: v.number(),
    dueDate: v.optional(v.number()),
    sentDate: v.optional(v.number()),
    viewedDate: v.optional(v.number()),
    paidDate: v.optional(v.number()),
    // Financials
    subtotal: v.number(),
    taxAmount: v.number(),
    discountAmount: v.optional(v.number()),
    total: v.number(),
    currency: v.string(),
    // Payment information
    paymentTerms: v.optional(v.number()), // days
    paymentMethod: v.optional(v.string()),
    // Notes
    notes: v.optional(v.string()),
    terms: v.optional(v.string()),
    // Footer text
    footerText: v.optional(v.string()),
    // Reference fields
    purchaseOrder: v.optional(v.string()),
    reference: v.optional(v.string()),
    // Parent invoice for credit notes
    parentInvoiceId: v.optional(v.id("invoices")),
    // File attachments
    attachments: v.optional(
      v.array(
        v.object({
          name: v.string(),
          url: v.string(),
          size: v.number(),
          type: v.string()
        })
      )
    ),
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(), // userId
    lastModifiedBy: v.optional(v.string()) // userId
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_organizationId_status", ["organizationId", "status"])
    .index("by_userId", ["userId"])
    .index("by_userId_status", ["userId", "status"])
    .index("by_userId_type", ["userId", "type"])
    .index("by_clientCompanyId", ["clientCompanyId"])
    .index("by_invoiceNumber", ["invoiceNumber"])
    .index("by_organizationId_invoiceNumber", [
      "organizationId",
      "invoiceNumber"
    ])
    .index("by_dueDate", ["dueDate"])
    .index("by_issueDate", ["issueDate"]),

  // Invoice Line Items
  invoiceItems: defineTable({
    invoiceId: v.id("invoices"),
    // Item details
    name: v.string(),
    description: v.optional(v.string()),
    // Quantity and pricing
    quantity: v.number(),
    unitPrice: v.number(),
    // Discount
    discountType: v.optional(
      v.union(v.literal("percentage"), v.literal("fixed"))
    ),
    discountValue: v.optional(v.number()),
    // Tax
    taxRate: v.optional(v.number()), // percentage
    // Totals
    subtotal: v.number(),
    taxAmount: v.number(),
    total: v.number(),
    // Display order
    order: v.number(),
    // Metadata
    createdAt: v.number()
  })
    .index("by_invoiceId", ["invoiceId"])
    .index("by_invoiceId_order", ["invoiceId", "order"]),

  // Payments
  payments: defineTable({
    invoiceId: v.id("invoices"),
    organizationId: v.string(),
    // Payment details
    amount: v.number(),
    currency: v.string(),
    // Payment method
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("credit_card"),
      v.literal("debit_card"),
      v.literal("bank_transfer"),
      v.literal("check"),
      v.literal("paypal"),
      v.literal("stripe"),
      v.literal("other")
    ),
    // Payment provider details
    provider: v.optional(v.string()),
    transactionId: v.optional(v.string()),
    reference: v.optional(v.string()),
    // Dates
    paymentDate: v.number(),
    // Notes
    notes: v.optional(v.string()),
    // Status
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded"),
      v.literal("partially_refunded")
    ),
    // Refund information
    refundAmount: v.optional(v.number()),
    refundDate: v.optional(v.number()),
    refundReason: v.optional(v.string()),
    // Metadata
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_invoiceId", ["invoiceId"])
    .index("by_organizationId", ["organizationId"])
    .index("by_organizationId_status", ["organizationId", "status"])
    .index("by_paymentDate", ["paymentDate"])
    .index("by_transactionId", ["transactionId"]),

  // Organization Settings - Extends Better Auth organizations with invoice-specific fields
  organizationSettings: defineTable({
    // Better Auth organization ID
    organizationId: v.string(),
    // Business details
    businessName: v.optional(v.string()),
    registrationNumber: v.optional(v.string()),
    taxId: v.optional(v.string()),
    vatNumber: v.optional(v.string()),
    billingAddress: v.optional(
      v.object({
        line1: v.string(),
        line2: v.optional(v.string()),
        city: v.string(),
        county: v.optional(v.string()),
        postcode: v.optional(v.string()),
        country: v.string()
      })
    ),
    logoUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    secondaryColor: v.optional(v.string()),
    defaultCurrency: v.optional(v.string()),
    defaultPaymentTerms: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number()
  }).index("by_organizationId", ["organizationId"]),

  // Activity Log / Audit Trail
  activities: defineTable({
    // Organization ID for tenant isolation
    organizationId: v.string(),
    // User ID for audit trail (who performed the action)
    userId: v.string(),
    // Entity type and ID
    entityType: v.union(
      v.literal("invoice"),
      v.literal("payment"),
      v.literal("company")
    ),
    entityId: v.string(), // generic string to accommodate different ID types
    action: v.string(), // e.g., "created", "updated", "sent", "paid", "deleted"
    description: v.string(),
    changes: v.optional(
      v.object({
        field: v.string(),
        oldValue: v.optional(v.any()),
        newValue: v.optional(v.any())
      })
    ),
    // Metadata
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    createdAt: v.number()
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_userId", ["userId"])
    .index("by_entityType_entityId", ["entityType", "entityId"])
    .index("by_organizationId_entityType", ["organizationId", "entityType"])
    .index("by_userId_entityType", ["userId", "entityType"])
    .index("by_createdAt", ["createdAt"]),

  // Invoice Templates
  invoiceTemplates: defineTable({
    organizationId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    // Template structure
    layout: v.string(), // JSON string or template identifier
    isDefault: v.boolean(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number()
  })
    .index("by_organizationId", ["organizationId"])
    .index("by_organizationId_default", ["organizationId", "isDefault"])
    .index("by_organizationId_active", ["organizationId", "isActive"])
});
