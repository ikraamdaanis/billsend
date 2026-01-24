import { Button } from "components/ui/button";
import { currencySymbols, formatCurrency } from "consts/currencies";
import { InvoiceInput } from "features/new/components/invoice-input";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import type { LineItemTab } from "features/new/consts/events";
import {
  LINE_ITEM_TABS,
  LINE_ITEM_TAB_SECTIONS,
  TAB_SELECT_EVENTS
} from "features/new/consts/events";
import {
  currencyAtom,
  invoiceAtom,
  lineItemsAtom,
  tableSettingsAtom,
  updateInvoiceValueAtom
} from "features/new/state";
import type {
  Invoice,
  TableColumnSettings,
  TextSettings
} from "features/new/types";
import { calculateInvoiceTotals } from "features/new/utils/calculate-invoice-totals";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { setActiveTab } from "features/new/utils/set-active-tab";
import type { Atom } from "jotai";
import { useAtomValue, useSetAtom } from "jotai";
import { selectAtom } from "jotai/utils";
import { cn } from "lib/utils";
import { PlusIcon, TrashIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { memo } from "react";
import type { DeepKeyOf } from "types";

// Selector atoms for header settings
const descriptionHeaderSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionHeaderSettings
);

const quantityHeaderSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityHeaderSettings
);

const unitPriceHeaderSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceHeaderSettings
);

const amountHeaderSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountHeaderSettings
);

// Selector atoms for row settings
const descriptionRowSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.descriptionRowSettings
);

const quantityRowSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.quantityRowSettings
);

const unitPriceRowSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.unitPriceRowSettings
);

const amountRowSettingsAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.amountRowSettings
);

// Selector atom for background color
const backgroundColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.backgroundColor
);

const lineItemsLengthAtom = selectAtom(lineItemsAtom, items => items.length);

const borderColorAtom = selectAtom(
  tableSettingsAtom,
  settings => settings.borderColor
);

type LineItemFieldKey = "description" | "quantity" | "unitPrice";

type LineItemColumnKind = "text" | "integer" | "currency" | "amount";

interface LineItemColumnConfig {
  id: "description" | "quantity" | "unitPrice" | "amount";
  headerSettingsAtom: Atom<TableColumnSettings>;
  rowSettingsAtom: Atom<TextSettings>;
  headerLabelField: DeepKeyOf<Invoice>;
  headerPlaceholder: string;
  headerInputClassName: string;
  tab: LineItemTab;
  cell: {
    kind: LineItemColumnKind;
    itemField?: LineItemFieldKey;
    placeholder?: string;
    wrapperClassName: string;
    inputClassName?: string;
    displayClassName?: string;
  };
}

const LINE_ITEM_COLUMNS: LineItemColumnConfig[] = [
  {
    id: "description",
    headerSettingsAtom: descriptionHeaderSettingsAtom,
    rowSettingsAtom: descriptionRowSettingsAtom,
    headerLabelField: "tableSettings.descriptionHeaderSettings.label",
    headerPlaceholder: "Description",
    headerInputClassName:
      "relative h-full w-full rounded-none rounded-tl-sm border-none bg-transparent py-2 pl-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:px-2",
    tab: LINE_ITEM_TABS.description,
    cell: {
      kind: "text",
      itemField: "description",
      placeholder: "Enter a description",
      wrapperClassName: "col-span-1 flex h-full items-center",
      inputClassName:
        "w-full rounded-none border-none py-2 pl-2 ring-0 outline-none focus-visible:py-2"
    }
  },
  {
    id: "quantity",
    headerSettingsAtom: quantityHeaderSettingsAtom,
    rowSettingsAtom: quantityRowSettingsAtom,
    headerLabelField: "tableSettings.quantityHeaderSettings.label",
    headerPlaceholder: "Quantity",
    headerInputClassName:
      "relative h-full w-full rounded-none border-none bg-transparent py-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:px-2",
    tab: LINE_ITEM_TABS.quantity,
    cell: {
      kind: "integer",
      itemField: "quantity",
      wrapperClassName: "col-span-1 flex h-full items-center",
      inputClassName:
        "w-full rounded-none border-none py-2 ring-0 outline-none focus-visible:py-2"
    }
  },
  {
    id: "unitPrice",
    headerSettingsAtom: unitPriceHeaderSettingsAtom,
    rowSettingsAtom: unitPriceRowSettingsAtom,
    headerLabelField: "tableSettings.unitPriceHeaderSettings.label",
    headerPlaceholder: "Unit Price",
    headerInputClassName:
      "relative h-full w-full rounded-none border-none bg-transparent py-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:px-2",
    tab: LINE_ITEM_TABS.unitPrice,
    cell: {
      kind: "currency",
      itemField: "unitPrice",
      wrapperClassName: "col-span-1 flex h-full items-center",
      inputClassName:
        "w-full rounded-none border-none py-2 ring-0 outline-none focus-visible:py-2"
    }
  },
  {
    id: "amount",
    headerSettingsAtom: amountHeaderSettingsAtom,
    rowSettingsAtom: amountRowSettingsAtom,
    headerLabelField: "tableSettings.amountHeaderSettings.label",
    headerPlaceholder: "Amount",
    headerInputClassName:
      "relative h-auto w-full rounded-none rounded-tr-sm border-none bg-transparent py-2 pr-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:p-2",
    tab: LINE_ITEM_TABS.amount,
    cell: {
      kind: "amount",
      wrapperClassName: "col-span-1 cursor-pointer pr-2",
      displayClassName: "inline-block h-full w-full font-medium"
    }
  }
];

function getItemFieldPath(
  index: number,
  field: LineItemFieldKey
): DeepKeyOf<Invoice> {
  return `items[${index}].${field}` as DeepKeyOf<Invoice>;
}

/**
 * Displays the line items for the invoice.
 */
function InvoiceLineItemsComponent() {
  const lineItemsLength = useAtomValue(lineItemsLengthAtom);
  const borderColor = useAtomValue(borderColorAtom);

  return (
    <div
      className={cn("w-[calc(100%-2rem)] lg:w-full", {
        "w-full": lineItemsLength === 1
      })}
    >
      <div
        className="line-items-container flex flex-col divide-y rounded-sm border"
        style={{ borderColor }}
      >
        <TableHeader />
        <LineItems />
      </div>
      <AddItemButton />
    </div>
  );
}

const TableHeader = memo(function TableHeader() {
  const backgroundColor = useAtomValue(backgroundColorAtom);
  const borderColor = useAtomValue(borderColorAtom);

  return (
    <div
      className="grid grid-cols-[repeat(4,1fr)] gap-2 rounded-t-sm font-medium lg:grid-cols-[1fr_80px_120px_150px]"
      style={{ backgroundColor, borderColor }}
    >
      {LINE_ITEM_COLUMNS.map(column => (
        <TableHeaderCell key={column.id} column={column} />
      ))}
    </div>
  );
});

const TableHeaderCell = memo(function TableHeaderCell({
  column
}: {
  column: LineItemColumnConfig;
}) {
  const headerSettings = useAtomValue(column.headerSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleChange(value: string) {
    updateInvoiceValue({
      field: column.headerLabelField,
      value
    });
  }

  function handleClick() {
    setActiveSettings("table");
    setActiveTab({
      eventType: TAB_SELECT_EVENTS.lineItems,
      tab: column.tab,
      option: LINE_ITEM_TAB_SECTIONS.header
    });
  }

  return (
    <div
      className="col-span-1 cursor-pointer text-sm font-medium"
      onClick={handleClick}
      style={getTextStyles({
        settings: headerSettings
      })}
    >
      <InvoiceInput
        value={headerSettings.label || ""}
        onChange={handleChange}
        className={column.headerInputClassName}
        placeholder={column.headerPlaceholder}
        style={getTextStyles({
          settings: headerSettings
        })}
      />
    </div>
  );
});

const LineItems = memo(function LineItems() {
  const lineItems = useAtomValue(lineItemsAtom);

  return (
    <>
      {lineItems.map((item, index) => (
        <LineItem key={item.id} item={item} index={index} />
      ))}
    </>
  );
});

const LineItem = memo(function LineItem({
  item,
  index
}: {
  item: Invoice["items"][0];
  index: number;
}) {
  const lineItems = useAtomValue(lineItemsAtom);
  const borderColor = useAtomValue(borderColorAtom);
  const amount = Number(item.quantity) * Number(item.unitPrice);

  return (
    <div
      className="relative grid grid-cols-[repeat(4,1fr)] items-center gap-2 lg:grid-cols-[1fr_80px_120px_150px]"
      style={{ borderColor }}
    >
      {LINE_ITEM_COLUMNS.map(column => (
        <TableCell
          key={`${item.id}-${column.id}`}
          column={column}
          item={item}
          index={index}
          amount={amount}
        />
      ))}
      {lineItems.length > 1 && <RemoveItemButton itemId={item.id} />}
    </div>
  );
});

const TableCell = memo(function TableCell({
  column,
  item,
  index,
  amount
}: {
  column: LineItemColumnConfig;
  item: Invoice["items"][0];
  index: number;
  amount: number;
}) {
  const rowSettings = useAtomValue(column.rowSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);
  const currencySymbol =
    currencySymbols.find(symbol => symbol.code === currency)?.symbol || "";

  function handleFocus() {
    setActiveSettings("table");
    setActiveTab({
      eventType: TAB_SELECT_EVENTS.lineItems,
      tab: column.tab,
      option: LINE_ITEM_TAB_SECTIONS.row
    });
  }

  function handleChange(value: string) {
    const itemField = column.cell.itemField;
    if (!itemField) {
      return;
    }

    if (column.cell.kind === "text") {
      updateInvoiceValue({
        field: getItemFieldPath(index, itemField),
        value
      });
      return;
    }

    if (column.cell.kind === "integer") {
      let numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length > 1 && numericValue.startsWith("0")) {
        numericValue = numericValue.replace(/^0+/, "");
      }

      updateInvoiceValue({
        field: getItemFieldPath(index, itemField),
        value: numericValue
      });
      return;
    }

    if (column.cell.kind === "currency") {
      let numericValue = value
        .replace(currencySymbol, "")
        .replace(/[^0-9.]/g, "");
      if (
        numericValue.length > 1 &&
        numericValue.startsWith("0") &&
        !numericValue.startsWith("0.")
      ) {
        numericValue = numericValue.replace(/^0+/, "");
      }

      updateInvoiceValue({
        field: getItemFieldPath(index, itemField),
        value: numericValue
      });
    }
  }

  function handleBlur({ target }: ChangeEvent<HTMLInputElement>) {
    if (column.cell.kind !== "currency" || !column.cell.itemField) {
      return;
    }

    const hasDigits = /\d/.test(target.value);
    const number = Number(
      target.value.replace(currencySymbol, "").replace(/[^0-9.]/g, "")
    );

    updateInvoiceValue({
      field: getItemFieldPath(index, column.cell.itemField),
      value: hasDigits ? number : 0
    });
  }

  if (column.cell.kind === "amount") {
    return (
      <div className={column.cell.wrapperClassName} onClick={handleFocus}>
        <span
          className={column.cell.displayClassName}
          style={getTextStyles({
            settings: rowSettings
          })}
        >
          {formatCurrency(amount, currency)}
        </span>
      </div>
    );
  }

  let inputValue = "";
  if (column.cell.kind === "text") {
    inputValue = item.description;
  }

  if (column.cell.kind === "integer") {
    inputValue = item.quantity.toString();
  }

  if (column.cell.kind === "currency") {
    inputValue = `${currencySymbol}${item.unitPrice.toString()}`;
  }

  return (
    <div className={column.cell.wrapperClassName}>
      <InvoiceInput
        value={inputValue}
        placeholder={column.cell.placeholder}
        onChange={handleChange}
        className={column.cell.inputClassName}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={getTextStyles({
          settings: rowSettings
        })}
      />
    </div>
  );
});

const RemoveItemButton = memo(function RemoveItemButton({
  itemId
}: {
  itemId: string;
}) {
  const updateInvoice = useSetAtom(invoiceAtom);

  function removeItem() {
    updateInvoice(prevInvoice => {
      const newInvoice = {
        ...prevInvoice,
        items: prevInvoice.items.filter(item => item.id !== itemId)
      };

      return calculateInvoiceTotals(newInvoice);
    });
  }

  return (
    <div className="absolute -right-10">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 py-2 hover:bg-zinc-100"
        onClick={removeItem}
      >
        <TrashIcon className="h-4 w-4 text-red-700" />
      </Button>
    </div>
  );
});

const AddItemButton = memo(function AddItemButton() {
  const updateInvoice = useSetAtom(invoiceAtom);

  function addItem() {
    updateInvoice(prevInvoice => {
      const newInvoice = {
        ...prevInvoice,
        items: [
          ...prevInvoice.items,
          {
            id: crypto.randomUUID(),
            description: "",
            quantity: 1,
            unitPrice: 0,
            amount: 0
          }
        ]
      };

      return calculateInvoiceTotals(newInvoice);
    });
  }

  return (
    <Button size="sm" className="my-4 w-fit" onClick={addItem}>
      <PlusIcon />
      Add item
    </Button>
  );
});

export const InvoiceLineItems = memo(InvoiceLineItemsComponent);
