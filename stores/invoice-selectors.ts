import { useShallow } from "zustand/react/shallow";
import { useInvoiceStore, currencySymbolMap } from "stores/invoice-store";
import type { Invoice } from "types";

// Title slice - only re-renders when title or titleSettings change
export function useTitleSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      title: state.title,
      titleSettings: state.titleSettings,
      setTitle: state.setTitle,
      setTitleSettings: state.setTitleSettings
    }))
  );
}

// Seller slice
export function useSellerSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      seller: state.seller,
      sellerSettings: state.sellerSettings,
      setSeller: state.setSeller,
      setSellerSettings: state.setSellerSettings
    }))
  );
}

// Client slice
export function useClientSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      client: state.client,
      clientSettings: state.clientSettings,
      setClient: state.setClient,
      setClientSettings: state.setClientSettings
    }))
  );
}

// Details slice
export function useDetailsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      number: state.number,
      numberSettings: state.numberSettings,
      invoiceDate: state.invoiceDate,
      invoiceDateSettings: state.invoiceDateSettings,
      dueDate: state.dueDate,
      dueDateSettings: state.dueDateSettings,
      setNumber: state.setNumber,
      setNumberSettings: state.setNumberSettings,
      setInvoiceDate: state.setInvoiceDate,
      setInvoiceDateSettings: state.setInvoiceDateSettings,
      setDueDate: state.setDueDate,
      setDueDateSettings: state.setDueDateSettings
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
      subtotalSettings: state.subtotalSettings,
      tax: state.tax,
      taxSettings: state.taxSettings,
      fees: state.fees,
      feesSettings: state.feesSettings,
      discounts: state.discounts,
      discountsSettings: state.discountsSettings,
      total: state.total,
      totalSettings: state.totalSettings,
      currency: state.currency,
      setTax: state.setTax,
      setTaxSettings: state.setTaxSettings,
      setFees: state.setFees,
      setFeesSettings: state.setFeesSettings,
      setDiscounts: state.setDiscounts,
      setDiscountsSettings: state.setDiscountsSettings,
      setSubtotalSettings: state.setSubtotalSettings,
      setTotalSettings: state.setTotalSettings
    }))
  );
}

// Terms slice
export function useTermsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      terms: state.terms,
      termsSettings: state.termsSettings,
      setTerms: state.setTerms,
      setTermsSettings: state.setTermsSettings
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
  return useInvoiceStore(state => currencySymbolMap.get(state.currency) ?? "$");
}

// PDF settings slice
export function usePdfSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      pdfSettings: state.pdfSettings,
      setPdfSettings: state.setPdfSettings
    }))
  );
}

// Full invoice data for serialization (save/load)
// This extracts only the Invoice data, not actions
export function useInvoiceData(): Invoice {
  return useInvoiceStore(
    useShallow(state => ({
      id: state.id,
      title: state.title,
      titleSettings: state.titleSettings,
      image: state.image,
      number: state.number,
      numberSettings: state.numberSettings,
      invoiceDate: state.invoiceDate,
      invoiceDateSettings: state.invoiceDateSettings,
      dueDate: state.dueDate,
      dueDateSettings: state.dueDateSettings,
      seller: state.seller,
      sellerSettings: state.sellerSettings,
      client: state.client,
      clientSettings: state.clientSettings,
      items: state.items,
      tableSettings: state.tableSettings,
      subtotal: state.subtotal,
      subtotalSettings: state.subtotalSettings,
      tax: state.tax,
      taxSettings: state.taxSettings,
      fees: state.fees,
      feesSettings: state.feesSettings,
      discounts: state.discounts,
      discountsSettings: state.discountsSettings,
      total: state.total,
      totalSettings: state.totalSettings,
      terms: state.terms,
      termsSettings: state.termsSettings,
      pdfSettings: state.pdfSettings,
      currency: state.currency
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

// Individual field selectors for settings components
// These provide maximum granularity for settings panels

export function useTitleSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      titleSettings: state.titleSettings,
      setTitleSettings: state.setTitleSettings
    }))
  );
}

export function useSellerSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      sellerSettings: state.sellerSettings,
      setSellerSettings: state.setSellerSettings
    }))
  );
}

export function useClientSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      clientSettings: state.clientSettings,
      setClientSettings: state.setClientSettings
    }))
  );
}

export function useNumberSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      numberSettings: state.numberSettings,
      setNumberSettings: state.setNumberSettings
    }))
  );
}

export function useInvoiceDateSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      invoiceDateSettings: state.invoiceDateSettings,
      setInvoiceDateSettings: state.setInvoiceDateSettings
    }))
  );
}

export function useDueDateSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      dueDateSettings: state.dueDateSettings,
      setDueDateSettings: state.setDueDateSettings
    }))
  );
}

export function useTableSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      tableSettings: state.tableSettings,
      setTableSettings: state.setTableSettings
    }))
  );
}

export function useSubtotalSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      subtotalSettings: state.subtotalSettings,
      setSubtotalSettings: state.setSubtotalSettings
    }))
  );
}

export function useTaxSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      taxSettings: state.taxSettings,
      setTaxSettings: state.setTaxSettings
    }))
  );
}

export function useFeesSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      feesSettings: state.feesSettings,
      setFeesSettings: state.setFeesSettings
    }))
  );
}

export function useDiscountsSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      discountsSettings: state.discountsSettings,
      setDiscountsSettings: state.setDiscountsSettings
    }))
  );
}

export function useTotalSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      totalSettings: state.totalSettings,
      setTotalSettings: state.setTotalSettings
    }))
  );
}

export function useTermsSettingsSlice() {
  return useInvoiceStore(
    useShallow(state => ({
      termsSettings: state.termsSettings,
      setTermsSettings: state.setTermsSettings
    }))
  );
}
