import { normalizeCurrency } from "consts/currencies";
import { useShallow } from "zustand/react/shallow";
import { useInvoiceStore } from "stores/invoice-store";
import type { Invoice } from "types";

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
      setNumber: state.setNumber,
      setInvoiceDate: state.setInvoiceDate,
      setDueDate: state.setDueDate
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

// Pricing slice
export function usePricingSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      subtotal: state.subtotal,
      tax: state.tax,
      fees: state.fees,
      discounts: state.discounts,
      total: state.total,
      currency: state.currency,
      setTax: state.setTax,
      setFees: state.setFees,
      setDiscounts: state.setDiscounts
    }))
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
  return useInvoiceStore(
    useShallow(state => ({
      id: state.id,
      title: state.title,
      image: state.image,
      number: state.number,
      invoiceDate: state.invoiceDate,
      dueDate: state.dueDate,
      seller: state.seller,
      client: state.client,
      items: state.items,
      tableSettings: state.tableSettings,
      subtotal: state.subtotal,
      tax: state.tax,
      fees: state.fees,
      discounts: state.discounts,
      total: state.total,
      terms: state.terms,
      pdfSettings: state.pdfSettings,
      currency: state.currency,
      theme: state.theme
    }))
  );
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
