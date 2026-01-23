import { Button } from "components/ui/button";
import { currencySymbols, formatCurrency } from "consts/currencies";
import { InvoiceInput } from "features/new/components/invoice-input";
import { activeSettingsAtom } from "features/new/components/settings-panel";
import {
  currencyAtom,
  invoiceAtom,
  lineItemsAtom,
  tableSettingsAtom,
  updateInvoiceValueAtom
} from "features/new/state";
import type { Invoice } from "features/new/types";
import { calculateInvoiceTotals } from "features/new/utils/calculate-invoice-totals";
import { getTextStyles } from "features/new/utils/get-text-styles";
import { setActiveTab } from "features/new/utils/set-active-tab";
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
      <DescriptionHeader />
      <QuantityHeader />
      <UnitPriceHeader />
      <AmountHeader />
    </div>
  );
});

const DescriptionHeader = memo(function DescriptionHeader() {
  const descriptionHeaderSettings = useAtomValue(descriptionHeaderSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleChange(value: string) {
    updateInvoiceValue({
      field: "tableSettings.descriptionHeaderSettings.label",
      value
    });
  }

  function handleClick() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "description",
      option: "header"
    });
  }

  return (
    <div
      className="col-span-1 cursor-pointer text-sm font-medium"
      onClick={handleClick}
      style={getTextStyles({
        settings: descriptionHeaderSettings
      })}
    >
      <InvoiceInput
        value={descriptionHeaderSettings.label || ""}
        onChange={handleChange}
        className="relative h-full w-full rounded-none rounded-tl-sm border-none bg-transparent py-2 pl-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:px-2"
        placeholder="Description"
        style={getTextStyles({
          settings: descriptionHeaderSettings
        })}
      />
    </div>
  );
});

const QuantityHeader = memo(function QuantityHeader() {
  const quantityHeaderSettings = useAtomValue(quantityHeaderSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleChange(value: string) {
    updateInvoiceValue({
      field: "tableSettings.quantityHeaderSettings.label",
      value
    });
  }

  function handleClick() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "quantity",
      option: "header"
    });
  }

  return (
    <div
      className="col-span-1 cursor-pointer text-sm font-medium"
      onClick={handleClick}
      style={getTextStyles({
        settings: quantityHeaderSettings
      })}
    >
      <InvoiceInput
        value={quantityHeaderSettings.label || ""}
        onChange={handleChange}
        className="relative h-full w-full rounded-none border-none bg-transparent py-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:px-2"
        placeholder="Quantity"
        style={getTextStyles({
          settings: quantityHeaderSettings
        })}
      />
    </div>
  );
});

const UnitPriceHeader = memo(function UnitPriceHeader() {
  const unitPriceHeaderSettings = useAtomValue(unitPriceHeaderSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleChange(value: string) {
    updateInvoiceValue({
      field: "tableSettings.unitPriceHeaderSettings.label",
      value
    });
  }

  function handleClick() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "unitPrice",
      option: "header"
    });
  }

  return (
    <div
      className="col-span-1 cursor-pointer text-sm font-medium"
      onClick={handleClick}
      style={getTextStyles({
        settings: unitPriceHeaderSettings
      })}
    >
      <InvoiceInput
        value={unitPriceHeaderSettings.label || ""}
        onChange={handleChange}
        className="relative h-full w-full rounded-none border-none bg-transparent py-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:px-2"
        placeholder="Unit Price"
        style={getTextStyles({
          settings: unitPriceHeaderSettings
        })}
      />
    </div>
  );
});

const AmountHeader = memo(function AmountHeader() {
  const amountHeaderSettings = useAtomValue(amountHeaderSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleChange(value: string) {
    updateInvoiceValue({
      field: "tableSettings.amountHeaderSettings.label",
      value
    });
  }

  function handleClick() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "amount",
      option: "header"
    });
  }

  return (
    <div
      className="col-span-1 cursor-pointer text-sm font-medium"
      onClick={handleClick}
      style={getTextStyles({
        settings: amountHeaderSettings
      })}
    >
      <InvoiceInput
        value={amountHeaderSettings.label || ""}
        onChange={handleChange}
        className="relative h-auto w-full rounded-none rounded-tr-sm border-none bg-transparent py-2 pr-2 hover:bg-blue-100 focus-visible:z-10 focus-visible:p-2"
        placeholder="Amount"
        style={getTextStyles({
          settings: amountHeaderSettings
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
      <DescriptionCell index={index} description={item.description} />
      <QuantityCell index={index} quantity={item.quantity} />
      <UnitPriceCell index={index} unitPrice={item.unitPrice} />
      <AmountCell amount={amount} />
      {lineItems.length > 1 && <RemoveItemButton itemId={item.id} />}
    </div>
  );
});

const DescriptionCell = memo(function DescriptionCell({
  index,
  description
}: {
  index: number;
  description: string;
}) {
  const descriptionRowSettings = useAtomValue(descriptionRowSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleChange(value: string) {
    updateInvoiceValue({
      field: `items[${index}].description` as DeepKeyOf<Invoice>,
      value
    });
  }

  function handleFocus() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "description",
      option: "row"
    });
  }

  return (
    <div className="col-span-1 flex h-full items-center">
      <InvoiceInput
        value={description}
        placeholder="Enter a description"
        onChange={handleChange}
        className="w-full rounded-none border-none py-2 pl-2 ring-0 outline-none focus-visible:py-2"
        onFocus={handleFocus}
        style={getTextStyles({
          settings: descriptionRowSettings
        })}
      />
    </div>
  );
});

const QuantityCell = memo(function QuantityCell({
  index,
  quantity
}: {
  index: number;
  quantity: number;
}) {
  const quantityRowSettings = useAtomValue(quantityRowSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleChange(value: string) {
    // Only allow integers and ensure it doesn't start with 0 unless it's just 0
    let numericValue = value.replace(/[^0-9]/g, "");
    // Remove leading zeros unless it's just "0"
    if (numericValue.length > 1 && numericValue.startsWith("0")) {
      numericValue = numericValue.replace(/^0+/, "");
    }

    updateInvoiceValue({
      field: `items[${index}].quantity` as DeepKeyOf<Invoice>,
      value: numericValue
    });
  }

  function handleFocus() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "quantity",
      option: "row"
    });
  }

  return (
    <div className="col-span-1 flex h-full items-center">
      <InvoiceInput
        value={quantity.toString()}
        className="w-full rounded-none border-none py-2 ring-0 outline-none focus-visible:py-2"
        onChange={handleChange}
        onFocus={handleFocus}
        style={getTextStyles({
          settings: quantityRowSettings
        })}
      />
    </div>
  );
});

const UnitPriceCell = memo(function UnitPriceCell({
  index,
  unitPrice
}: {
  index: number;
  unitPrice: number;
}) {
  const unitPriceRowSettings = useAtomValue(unitPriceRowSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  const currencySymbol =
    currencySymbols.find(symbol => symbol.code === currency)?.symbol || "";

  function handleChange(value: string) {
    // Remove currency symbol and any non-numeric characters except decimal point
    let numericValue = value
      .replace(currencySymbol, "")
      .replace(/[^0-9.]/g, "");
    // Remove leading zeros unless it's just "0" or starts with "0."
    if (
      numericValue.length > 1 &&
      numericValue.startsWith("0") &&
      !numericValue.startsWith("0.")
    ) {
      numericValue = numericValue.replace(/^0+/, "");
    }

    updateInvoiceValue({
      field: `items[${index}].unitPrice` as DeepKeyOf<Invoice>,
      value: numericValue
    });
  }

  function handleBlur({ target }: ChangeEvent<HTMLInputElement>) {
    // If numericValue has no digits, set to 0
    const hasDigits = /\d/.test(target.value);

    // get the number from the target value, remove the currency symbol and any non-numeric characters except decimal point
    const number = Number(
      target.value.replace(currencySymbol, "").replace(/[^0-9.]/g, "")
    );

    updateInvoiceValue({
      field: `items[${index}].unitPrice` as DeepKeyOf<Invoice>,
      value: hasDigits ? number : 0
    });
  }

  function handleFocus() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "unitPrice",
      option: "row"
    });
  }

  return (
    <div className="col-span-1 flex h-full items-center">
      <InvoiceInput
        value={`${currencySymbol}${unitPrice.toString()}`}
        className="w-full rounded-none border-none py-2 ring-0 outline-none focus-visible:py-2"
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        style={getTextStyles({
          settings: unitPriceRowSettings
        })}
      />
    </div>
  );
});

const AmountCell = memo(function AmountCell({ amount }: { amount: number }) {
  const amountRowSettings = useAtomValue(amountRowSettingsAtom);
  const currency = useAtomValue(currencyAtom);
  const setActiveSettings = useSetAtom(activeSettingsAtom);

  function handleClick() {
    setActiveSettings("table");
    setActiveTab({
      eventType: "select-line-items-tab",
      tab: "amount",
      option: "row"
    });
  }

  return (
    <div className="col-span-1 cursor-pointer pr-2" onClick={handleClick}>
      <span
        className="inline-block h-full w-full font-medium"
        style={getTextStyles({
          settings: amountRowSettings
        })}
      >
        {formatCurrency(amount, currency)}
      </span>
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
