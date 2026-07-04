import { useShallow } from "zustand/react/shallow";
import { normalizeCurrency } from "~/consts/currencies";
import type { InvoiceStore } from "~/stores/invoice-store";
import { useInvoiceStore } from "~/stores/invoice-store";
import type { Invoice } from "~/types";
import { calculateInvoiceTotals } from "~/utils/calculate-invoice-totals";

// The persisted invoice fields, in one place. `satisfies` rejects typos and
// keys that aren't on Invoice; the MissingKey assertion below rejects forgetting
// a key, so adding a field to Invoice forces adding it here (or the build fails).
const INVOICE_DATA_KEYS = [
  "id",
  "title",
  "image",
  "number",
  "invoiceDate",
  "dueDate",
  "seller",
  "client",
  "items",
  "tableSettings",
  "labels",
  "tax",
  "fees",
  "discounts",
  "terms",
  "paymentDetails",
  "pdfSettings",
  "currency",
  "theme"
] as const satisfies ReadonlyArray<keyof Invoice>;

type MissingInvoiceKey = Exclude<
  keyof Invoice,
  (typeof INVOICE_DATA_KEYS)[number]
>;
// Runtime no-op whose only job is the compile-time constraint: a non-never type
// argument (an Invoice key missing from the list above) fails to type-check.
function assertAllInvoiceKeysListed<TMissing extends never>(): TMissing[] {
  return [];
}
assertAllInvoiceKeysListed<MissingInvoiceKey>();

// Picks the persisted invoice fields out of the store state, dropping the
// action methods. Shared by the useInvoiceData hook and imperative reads
// (e.g. provider document actions) so the shape stays in one place.
export function selectInvoiceData(state: InvoiceStore): Invoice {
  return Object.fromEntries(
    INVOICE_DATA_KEYS.map(key => [key, state[key]])
  ) as Invoice;
}

// Theme slice - global font / size / accent for the whole invoice
export function useThemeSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      theme: state.theme,
      setTheme: state.setTheme
    }))
  );
}

// Theme value only - for components that render styled text but don't edit it
export function useTheme() {
  return useInvoiceStore(state => state.theme);
}

// Title slice
export function useTitleSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      title: state.title,
      setTitle: state.setTitle
    }))
  );
}

// Seller slice
export function useSellerSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      seller: state.seller,
      setSeller: state.setSeller
    }))
  );
}

// Client slice
export function useClientSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      client: state.client,
      setClient: state.setClient
    }))
  );
}

// Details slice
export function useDetailsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      number: state.number,
      invoiceDate: state.invoiceDate,
      dueDate: state.dueDate,
      labels: state.labels,
      setNumber: state.setNumber,
      setInvoiceDate: state.setInvoiceDate,
      setDueDate: state.setDueDate,
      setLabels: state.setLabels
    }))
  );
}

// Line items slice
export function useLineItemsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      items: state.items,
      tableSettings: state.tableSettings,
      currency: state.currency,
      addItem: state.addItem,
      removeItem: state.removeItem,
      updateItem: state.updateItem,
      setTableSettings: state.setTableSettings
    }))
  );
}

// Pricing slice (inputs only; the derived totals come from useInvoiceTotals)
export function usePricingSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      tax: state.tax,
      fees: state.fees,
      discounts: state.discounts,
      currency: state.currency,
      labels: state.labels,
      setTax: state.setTax,
      setFees: state.setFees,
      setDiscounts: state.setDiscounts,
      setLabels: state.setLabels
    }))
  );
}

// Derived money totals (subtotal, tax amount, grand total), recomputed from the
// pricing inputs. Returns plain numbers so shallow equality only fires a
// re-render when a total actually changes, not on every unrelated edit.
export function useInvoiceTotals(): {
  subtotal: number;
  taxAmount: number;
  total: number;
} {
  return useInvoiceStore(
    useShallow(state => {
      const totals = calculateInvoiceTotals({
        items: state.items,
        tax: state.tax,
        fees: state.fees,
        discounts: state.discounts
      });

      return {
        subtotal: totals.subtotal,
        taxAmount: totals.taxAmount,
        total: totals.total
      };
    })
  );
}

// Terms slice
export function useTermsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      terms: state.terms,
      setTerms: state.setTerms
    }))
  );
}

// Payment details slice
export function usePaymentDetailsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      paymentDetails: state.paymentDetails,
      setPaymentDetails: state.setPaymentDetails
    }))
  );
}

// Image slice
export function useImageSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      image: state.image,
      setImage: state.setImage
    }))
  );
}

// Currency slice (for main settings)
export function useCurrencySlice() {
  return useInvoiceStore(
    useShallow(state => ({
      currency: state.currency,
      setCurrency: state.setCurrency
    }))
  );
}

// Currency symbol - derived value, only re-renders when currency changes
export function useCurrencySymbol() {
  return useInvoiceStore(state => normalizeCurrency(state.currency));
}

// Full invoice data for serialization (save/load)
// This extracts only the Invoice data, not actions
export function useInvoiceData(): Invoice {
  return useInvoiceStore(useShallow(selectInvoiceData));
}

// Actions only (stable references, won't cause re-renders on data changes)
export function useInvoiceActions() {
  return useInvoiceStore(
    useShallow(state => ({
      setInvoice: state.setInvoice,
      resetInvoice: state.resetInvoice
    }))
  );
}

// For components that need both data and actions (like file menu)
export function useInvoiceDataAndActions() {
  const invoice = useInvoiceData();
  const actions = useInvoiceActions();
  return { invoice, ...actions };
}
