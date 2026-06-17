import { InvoiceInput } from "components/invoice-input";
import { Button } from "components/ui/button";
import { useUI } from "context/ui-context";
import { formatCurrency } from "consts/currencies";
import type { LineItemTab } from "consts/events";
import {
  LINE_ITEM_TABS,
  LINE_ITEM_TAB_SECTIONS,
  TAB_SELECT_EVENTS
} from "consts/events";
import { cn } from "lib/utils";
import { PlusIcon, TrashIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useLineItemsSlice, useCurrencySymbol } from "stores/invoice-selectors";
import type {
  Invoice,
  InvoiceItem,
  TableColumnSettings,
  TextSettings
} from "types";
import { getTextStyles } from "utils/get-text-styles";
import { setActiveTab } from "utils/set-active-tab";

type LineItemFieldKey = "description" | "quantity" | "unitPrice";

type LineItemColumnKind = "text" | "integer" | "currency" | "amount";

interface LineItemColumnConfig {
  id: "description" | "quantity" | "unitPrice" | "amount";
  headerSettingsKey: keyof Invoice["tableSettings"];
  rowSettingsKey: keyof Invoice["tableSettings"];
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
    headerSettingsKey: "descriptionHeaderSettings",
    rowSettingsKey: "descriptionRowSettings",
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
    headerSettingsKey: "quantityHeaderSettings",
    rowSettingsKey: "quantityRowSettings",
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
    headerSettingsKey: "unitPriceHeaderSettings",
    rowSettingsKey: "unitPriceRowSettings",
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
    headerSettingsKey: "amountHeaderSettings",
    rowSettingsKey: "amountRowSettings",
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

/**
 * Displays the line items for the invoice.
 */
export function InvoiceLineItems() {
  const { items, tableSettings } = useLineItemsSlice();

  return (
    <div
      className={cn("w-[calc(100%-2rem)] lg:w-full", {
        "w-full": items.length === 1
      })}
    >
      <div
        className="line-items-container flex flex-col divide-y rounded-sm border"
        style={{ borderColor: tableSettings.borderColor }}
      >
        <TableHeader />
        <LineItems />
      </div>
      <AddItemButton />
    </div>
  );
}

function TableHeader() {
  const { tableSettings } = useLineItemsSlice();

  return (
    <div
      className="grid grid-cols-[repeat(4,1fr)] gap-2 rounded-t-sm font-medium lg:grid-cols-[1fr_80px_120px_150px]"
      style={{
        backgroundColor: tableSettings.backgroundColor,
        borderColor: tableSettings.borderColor
      }}
    >
      {LINE_ITEM_COLUMNS.map(column => (
        <TableHeaderCell key={column.id} column={column} />
      ))}
    </div>
  );
}

function TableHeaderCell({ column }: { column: LineItemColumnConfig }) {
  const { tableSettings, setTableSettings } = useLineItemsSlice();
  const { setActiveSettings } = useUI();

  const headerSettings = tableSettings[
    column.headerSettingsKey
  ] as TableColumnSettings;

  function handleChange(value: string) {
    setTableSettings(prev => ({
      ...prev,
      [column.headerSettingsKey]: {
        ...(prev[column.headerSettingsKey] as TableColumnSettings),
        label: value
      }
    }));
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
}

function LineItems() {
  const { items } = useLineItemsSlice();

  return (
    <>
      {items.map((item, index) => (
        <LineItem key={item.id} item={item} index={index} />
      ))}
    </>
  );
}

function LineItem({ item, index }: { item: InvoiceItem; index: number }) {
  const { items, tableSettings } = useLineItemsSlice();
  const amount = Number(item.quantity) * Number(item.unitPrice);

  return (
    <div
      className="relative grid grid-cols-[repeat(4,1fr)] items-center gap-2 lg:grid-cols-[1fr_80px_120px_150px]"
      style={{ borderColor: tableSettings.borderColor }}
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
      {items.length > 1 && <RemoveItemButton itemId={item.id} />}
    </div>
  );
}

function TableCell({
  column,
  item,
  index,
  amount
}: {
  column: LineItemColumnConfig;
  item: InvoiceItem;
  index: number;
  amount: number;
}) {
  const { tableSettings, currency, updateItem } = useLineItemsSlice();
  const currencySymbol = useCurrencySymbol();
  const { setActiveSettings } = useUI();

  const rowSettings = tableSettings[column.rowSettingsKey] as TextSettings;

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
      updateItem(index, itemField, value);
      return;
    }

    if (column.cell.kind === "integer") {
      let numericValue = value.replace(/[^0-9]/g, "");
      if (numericValue.length > 1 && numericValue.startsWith("0")) {
        numericValue = numericValue.replace(/^0+/, "");
      }

      updateItem(
        index,
        itemField,
        numericValue === "" ? 0 : Number(numericValue)
      );
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

      updateItem(
        index,
        itemField,
        numericValue === "" ? 0 : Number(numericValue)
      );
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

    updateItem(index, column.cell.itemField, hasDigits ? number : 0);
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

  const focusId =
    index === 0 && column.id === "description"
      ? "invoice-field-table"
      : undefined;

  return (
    <div className={column.cell.wrapperClassName}>
      <InvoiceInput
        id={focusId}
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
}

function RemoveItemButton({ itemId }: { itemId: string }) {
  const { removeItem } = useLineItemsSlice();

  return (
    <div className="absolute -right-10">
      <Button
        size="sm"
        variant="ghost"
        className="h-8 w-8 py-2 hover:bg-zinc-100"
        onClick={() => removeItem(itemId)}
      >
        <TrashIcon className="h-4 w-4 text-red-700" />
      </Button>
    </div>
  );
}

function AddItemButton() {
  const { addItem } = useLineItemsSlice();

  function handleAddItem() {
    addItem({
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0
    });
  }

  return (
    <Button size="sm" className="my-4 w-fit" onClick={handleAddItem}>
      <PlusIcon />
      Add item
    </Button>
  );
}
