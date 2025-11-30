import type { InvoiceTemplate } from "features/new/types";
import { atom } from "jotai";

export const invoiceTemplatesAtom = atom<InvoiceTemplate[]>([]);
