export const TAB_SELECT_EVENTS = {
  details: "select-details-tab",
  lineItems: "select-line-items-tab",
  totals: "select-totals-tab"
} as const;

export type TabSelectEventType =
  (typeof TAB_SELECT_EVENTS)[keyof typeof TAB_SELECT_EVENTS];

export const LINE_ITEM_TABS = {
  description: "description",
  quantity: "quantity",
  unitPrice: "unitPrice",
  amount: "amount"
} as const;

export type LineItemTab = (typeof LINE_ITEM_TABS)[keyof typeof LINE_ITEM_TABS];

export const LINE_ITEM_TAB_SECTIONS = {
  header: "header",
  row: "row"
} as const;

export type LineItemTabSection =
  (typeof LINE_ITEM_TAB_SECTIONS)[keyof typeof LINE_ITEM_TAB_SECTIONS];
