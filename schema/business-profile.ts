import { z } from "zod";

// The singleton business profile: the user's own sender details and logo,
// recorded once and reused to pre-fill every new invoice. Like the invoice
// schema, every field is resilient (`.catch(...)`) so a partial or corrupt
// record is repaired in place rather than thrown away. There is exactly one
// profile per device, stored under a fixed id.

export const BUSINESS_PROFILE_ID = "business-profile";

// Sensible out-of-the-box numbering: the first invoice reads "INV-0001" and the
// counter climbs from there. All three fields are freely reconfigurable.
export const DEFAULT_INVOICE_NUMBERING = {
  prefix: "INV-",
  padding: 4,
  nextNumber: 1
};

export const businessProfileSchema = z.object({
  id: z.string().catch(BUSINESS_PROFILE_ID),
  businessName: z.string().catch(""),
  address: z.string().catch(""),
  email: z.string().catch(""),
  phone: z.string().catch(""),
  logoImageId: z.string().catch(""),
  paymentDetails: z
    .object({
      bankName: z.string().catch(""),
      accountNumber: z.string().catch(""),
      iban: z.string().catch(""),
      sortCode: z.string().catch(""),
      terms: z.string().catch("")
    })
    .catch({
      bankName: "",
      accountNumber: "",
      iban: "",
      sortCode: "",
      terms: ""
    }),
  // Advisory sequential numbering. `nextNumber` is the value the next new
  // invoice will carry; `prefix` and `padding` shape how it renders (e.g.
  // "INV-0042"). Per-invoice edits never write back here, so overriding a number
  // on one invoice can't corrupt the counter.
  numbering: z
    .object({
      prefix: z.string().catch(DEFAULT_INVOICE_NUMBERING.prefix),
      padding: z
        .number()
        .int()
        .min(0)
        .max(10)
        .catch(DEFAULT_INVOICE_NUMBERING.padding),
      nextNumber: z
        .number()
        .int()
        .min(1)
        .catch(DEFAULT_INVOICE_NUMBERING.nextNumber)
    })
    .catch({ ...DEFAULT_INVOICE_NUMBERING })
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;

export function createDefaultBusinessProfile(): BusinessProfile {
  return {
    id: BUSINESS_PROFILE_ID,
    businessName: "",
    address: "",
    email: "",
    phone: "",
    logoImageId: "",
    paymentDetails: {
      bankName: "",
      accountNumber: "",
      iban: "",
      sortCode: "",
      terms: ""
    },
    numbering: { ...DEFAULT_INVOICE_NUMBERING }
  };
}

// Bring a stored or imported profile to the current shape, defaulting missing
// or corrupt fields. Never throws; a non-object (or hopelessly corrupt) value
// yields an empty profile rather than dropping the record.
export function normalizeBusinessProfile(raw: unknown): BusinessProfile {
  const working = typeof raw === "object" && raw !== null ? raw : {};

  return businessProfileSchema.parse(working);
}
