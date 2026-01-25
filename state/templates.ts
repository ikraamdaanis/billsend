import { atom } from "jotai";
import type { InvoiceTemplate } from "types";

export const invoiceTemplatesAtom = atom<InvoiceTemplate[]>([]);
