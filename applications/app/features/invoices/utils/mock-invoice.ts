import type { InvoiceQueryResult } from "features/invoices/queries/invoice-query";

export function createMockInvoice(): InvoiceQueryResult {
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 30);

  return {
    id: "mock-invoice-id",
    organizationId: "mock-org-id",
    clientId: "mock-client-id",
    invoiceNumber: "INV-2024-001",
    invoiceDate: now,
    dueDate: dueDate,
    status: "draft",
    lineItems: [
      {
        description: "Web Development Services",
        quantity: 40,
        unitPrice: 75.0,
        total: 3000.0
      },
      {
        description: "UI/UX Design",
        quantity: 20,
        unitPrice: 100.0,
        total: 2000.0
      },
      {
        description: "Consultation Hours",
        quantity: 10,
        unitPrice: 150.0,
        total: 1500.0
      }
    ],
    subtotal: "6500.00",
    tax: "1300.00",
    total: "7800.00",
    currency: "GBP",
    notes: "Thank you for your business. Payment is due within 30 days.",
    designSnapshotTemplateId: null,
    designSnapshotTokens: null,
    designSnapshotVisibility: null,
    designSnapshotLogoPosition: null,
    designSnapshotTakenAt: null,
    createdAt: now,
    updatedAt: now,
    client: {
      id: "mock-client-id",
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+44 20 1234 5678",
      address: {
        line1: "123 Business Street",
        line2: "Suite 100",
        city: "London",
        country: "United Kingdom",
        postalCode: "SW1A 1AA"
      },
      organizationId: "mock-org-id",
      defaultTemplateId: null,
      createdAt: now,
      updatedAt: now
    }
  };
}

