import { createBlankInvoice } from "~/stores/invoice-store";
import type { Invoice } from "~/types";

// The invoice every editor frame of the design catalogue opens: filled in the
// way a real one is, so the chrome is judged against a real page.
export function createDesignSampleInvoice(): Invoice {
  const blank = createBlankInvoice();

  return {
    ...blank,
    number: "1042",
    seller: {
      ...blank.seller,
      content:
        "Northwind Studio\nAvery Bennett\n88 Market Ave.\nAustin, TX 73301\navery@northwind.studio"
    },
    client: {
      ...blank.client,
      content:
        "Globex Corporation\nJordan Carter\n1600 Amphitheatre Pkwy\nMountain View, CA 94043\njordan.carter@globex.com"
    },
    items: [
      {
        id: crypto.randomUUID(),
        description: "Brand identity design",
        quantity: 1,
        unit: "",
        unitPrice: 4800
      },
      {
        id: crypto.randomUUID(),
        description: "Landing page build",
        quantity: 6,
        unit: "days",
        unitPrice: 650
      },
      {
        id: crypto.randomUUID(),
        description: "Hosting and maintenance",
        quantity: 3,
        unit: "months",
        unitPrice: 120
      }
    ],
    tax: { ...blank.tax, percentage: 8.25 },
    paymentDetails: {
      ...blank.paymentDetails,
      bankName: "First National Bank",
      accountNumber: "000123456789",
      routingNumber: "021000021",
      terms: "Net 30"
    }
  };
}
