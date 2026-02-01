import {
  AlignSettings,
  ColorSettings,
  FontWeightSettings,
  SizeSettings
} from "components/settings-fields";
import { Label } from "components/ui/label";
import { Separator } from "components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import type { LineItemTab } from "consts/events";
import { LINE_ITEM_TABS, TAB_SELECT_EVENTS } from "consts/events";
import { useInvoiceStore } from "stores/invoice-store";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useCallback, useEffect, useRef, useState } from "react";
import { handleActiveTab } from "utils/handle-active-tab";

export function LineItemsSettings() {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<LineItemTab>(
    LINE_ITEM_TABS.description
  );

  function isLineItemTab(value: string): value is LineItemTab {
    return (Object.values(LINE_ITEM_TABS) as LineItemTab[]).includes(
      value as LineItemTab
    );
  }

  const scrollToSelectedTab = useCallback((value: LineItemTab) => {
    if (!tabsRef.current) return;

    setActiveTab(value);
    handleActiveTab({ tabsRef, value });
  }, []);

  // Handle initial scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToSelectedTab(activeTab);
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab, scrollToSelectedTab]);

  // Listen for custom events to select tabs from outside this component
  useTabSelectEvent(TAB_SELECT_EVENTS.lineItems, tab => {
    if (isLineItemTab(tab)) {
      scrollToSelectedTab(tab);
    }
  });

  function handleValueChange(value: string) {
    if (isLineItemTab(value)) {
      scrollToSelectedTab(value);
    }
  }

  return (
    <Tabs
      defaultValue={LINE_ITEM_TABS.description}
      className="w-full"
      onValueChange={handleValueChange}
      value={activeTab}
    >
      <div ref={tabsRef} className="scrollbar-thin overflow-x-auto pb-1">
        <TabsList className="inline-flex w-auto min-w-full">
          <TabsTrigger
            value={LINE_ITEM_TABS.description}
            className="min-w-[100px] flex-1"
            data-value={LINE_ITEM_TABS.description}
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            value={LINE_ITEM_TABS.quantity}
            className="min-w-[80px] flex-1"
            data-value={LINE_ITEM_TABS.quantity}
          >
            Quantity
          </TabsTrigger>
          <TabsTrigger
            value={LINE_ITEM_TABS.unitPrice}
            className="min-w-[90px] flex-1"
            data-value={LINE_ITEM_TABS.unitPrice}
          >
            Unit Price
          </TabsTrigger>
          <TabsTrigger
            value={LINE_ITEM_TABS.amount}
            className="min-w-[80px] flex-1"
            data-value={LINE_ITEM_TABS.amount}
          >
            Amount
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent
        value={LINE_ITEM_TABS.description}
        className="mt-4 flex flex-col gap-4"
      >
        <DescriptionSettings />
      </TabsContent>
      <TabsContent
        value={LINE_ITEM_TABS.quantity}
        className="mt-4 flex flex-col gap-4"
      >
        <QuantitySettings />
      </TabsContent>
      <TabsContent
        value={LINE_ITEM_TABS.unitPrice}
        className="mt-4 flex flex-col gap-4"
      >
        <UnitPriceSettings />
      </TabsContent>
      <TabsContent
        value={LINE_ITEM_TABS.amount}
        className="mt-4 flex flex-col gap-4"
      >
        <AmountSettings />
      </TabsContent>
    </Tabs>
  );
}

// Description Settings
function DescriptionSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <DescriptionHeaderAlign />
        <DescriptionHeaderSize />
        <DescriptionHeaderWeight />
        <DescriptionHeaderColor />
        <DescriptionHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <DescriptionRowAlign />
        <DescriptionRowSize />
        <DescriptionRowWeight />
        <DescriptionRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
      <TableDesignSettings />
    </div>
  );
}

// Quantity Settings
function QuantitySettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <QuantityHeaderAlign />
        <QuantityHeaderSize />
        <QuantityHeaderWeight />
        <QuantityHeaderColor />
        <QuantityHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <QuantityRowAlign />
        <QuantityRowSize />
        <QuantityRowWeight />
        <QuantityRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
      <TableDesignSettings />
    </div>
  );
}

// Unit Price Settings
function UnitPriceSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <UnitPriceHeaderAlign />
        <UnitPriceHeaderSize />
        <UnitPriceHeaderWeight />
        <UnitPriceHeaderColor />
        <UnitPriceHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <UnitPriceRowAlign />
        <UnitPriceRowSize />
        <UnitPriceRowWeight />
        <UnitPriceRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
      <TableDesignSettings />
    </div>
  );
}

// Amount Settings
function AmountSettings() {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium">Header settings</h3>
      <div className="flex flex-col gap-2">
        <AmountHeaderAlign />
        <AmountHeaderSize />
        <AmountHeaderWeight />
        <AmountHeaderColor />
        <AmountHeaderLabel />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Row settings</h3>
      <div className="flex flex-col gap-2">
        <AmountRowAlign />
        <AmountRowSize />
        <AmountRowWeight />
        <AmountRowColor />
      </div>
      <Separator />
      <h3 className="text-sm font-medium">Table design</h3>
      <TableDesignSettings />
    </div>
  );
}

function TableDesignSettings() {
  return (
    <div className="flex flex-col gap-2">
      <TableBackgroundColor />
      <TableBorderColor />
    </div>
  );
}

function TableBackgroundColor() {
  const backgroundColor = useInvoiceStore(state => state.tableSettings.backgroundColor);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={backgroundColor}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          backgroundColor: value
        }))
      }
      label="Background"
    />
  );
}

function TableBorderColor() {
  const borderColor = useInvoiceStore(state => state.tableSettings.borderColor);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={borderColor}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          borderColor: value
        }))
      }
      label="Border Color"
    />
  );
}

// Description Header Settings
function DescriptionHeaderAlign() {
  const align = useInvoiceStore(state => state.tableSettings.descriptionHeaderSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionHeaderSettings: {
            ...prev.descriptionHeaderSettings,
            align: value
          }
        }))
      }
    />
  );
}

function DescriptionHeaderSize() {
  const size = useInvoiceStore(state => state.tableSettings.descriptionHeaderSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionHeaderSettings: {
            ...prev.descriptionHeaderSettings,
            size: value
          }
        }))
      }
    />
  );
}

function DescriptionHeaderWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.descriptionHeaderSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionHeaderSettings: {
            ...prev.descriptionHeaderSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function DescriptionHeaderColor() {
  const color = useInvoiceStore(state => state.tableSettings.descriptionHeaderSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionHeaderSettings: {
            ...prev.descriptionHeaderSettings,
            color: value
          }
        }))
      }
    />
  );
}

function DescriptionHeaderLabel() {
  const label = useInvoiceStore(state => state.tableSettings.descriptionHeaderSettings.label);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="description-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="description-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          setTableSettings(prev => ({
            ...prev,
            descriptionHeaderSettings: {
              ...prev.descriptionHeaderSettings,
              label: value
            }
          }))
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Description Row Settings
function DescriptionRowAlign() {
  const align = useInvoiceStore(state => state.tableSettings.descriptionRowSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionRowSettings: {
            ...prev.descriptionRowSettings,
            align: value
          }
        }))
      }
    />
  );
}

function DescriptionRowSize() {
  const size = useInvoiceStore(state => state.tableSettings.descriptionRowSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionRowSettings: {
            ...prev.descriptionRowSettings,
            size: value
          }
        }))
      }
    />
  );
}

function DescriptionRowWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.descriptionRowSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionRowSettings: {
            ...prev.descriptionRowSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function DescriptionRowColor() {
  const color = useInvoiceStore(state => state.tableSettings.descriptionRowSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          descriptionRowSettings: {
            ...prev.descriptionRowSettings,
            color: value
          }
        }))
      }
    />
  );
}

// Quantity Header Settings
function QuantityHeaderAlign() {
  const align = useInvoiceStore(state => state.tableSettings.quantityHeaderSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityHeaderSettings: {
            ...prev.quantityHeaderSettings,
            align: value
          }
        }))
      }
    />
  );
}

function QuantityHeaderSize() {
  const size = useInvoiceStore(state => state.tableSettings.quantityHeaderSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityHeaderSettings: {
            ...prev.quantityHeaderSettings,
            size: value
          }
        }))
      }
    />
  );
}

function QuantityHeaderWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.quantityHeaderSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityHeaderSettings: {
            ...prev.quantityHeaderSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function QuantityHeaderColor() {
  const color = useInvoiceStore(state => state.tableSettings.quantityHeaderSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityHeaderSettings: {
            ...prev.quantityHeaderSettings,
            color: value
          }
        }))
      }
    />
  );
}

function QuantityHeaderLabel() {
  const label = useInvoiceStore(state => state.tableSettings.quantityHeaderSettings.label);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="quantity-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="quantity-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          setTableSettings(prev => ({
            ...prev,
            quantityHeaderSettings: {
              ...prev.quantityHeaderSettings,
              label: value
            }
          }))
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Quantity Row Settings
function QuantityRowAlign() {
  const align = useInvoiceStore(state => state.tableSettings.quantityRowSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityRowSettings: {
            ...prev.quantityRowSettings,
            align: value
          }
        }))
      }
    />
  );
}

function QuantityRowSize() {
  const size = useInvoiceStore(state => state.tableSettings.quantityRowSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityRowSettings: {
            ...prev.quantityRowSettings,
            size: value
          }
        }))
      }
    />
  );
}

function QuantityRowWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.quantityRowSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityRowSettings: {
            ...prev.quantityRowSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function QuantityRowColor() {
  const color = useInvoiceStore(state => state.tableSettings.quantityRowSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          quantityRowSettings: {
            ...prev.quantityRowSettings,
            color: value
          }
        }))
      }
    />
  );
}

// Unit Price Header Settings
function UnitPriceHeaderAlign() {
  const align = useInvoiceStore(state => state.tableSettings.unitPriceHeaderSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceHeaderSettings: {
            ...prev.unitPriceHeaderSettings,
            align: value
          }
        }))
      }
    />
  );
}

function UnitPriceHeaderSize() {
  const size = useInvoiceStore(state => state.tableSettings.unitPriceHeaderSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceHeaderSettings: {
            ...prev.unitPriceHeaderSettings,
            size: value
          }
        }))
      }
    />
  );
}

function UnitPriceHeaderWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.unitPriceHeaderSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceHeaderSettings: {
            ...prev.unitPriceHeaderSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function UnitPriceHeaderColor() {
  const color = useInvoiceStore(state => state.tableSettings.unitPriceHeaderSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceHeaderSettings: {
            ...prev.unitPriceHeaderSettings,
            color: value
          }
        }))
      }
    />
  );
}

function UnitPriceHeaderLabel() {
  const label = useInvoiceStore(state => state.tableSettings.unitPriceHeaderSettings.label);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="unit-price-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="unit-price-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          setTableSettings(prev => ({
            ...prev,
            unitPriceHeaderSettings: {
              ...prev.unitPriceHeaderSettings,
              label: value
            }
          }))
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Unit Price Row Settings
function UnitPriceRowAlign() {
  const align = useInvoiceStore(state => state.tableSettings.unitPriceRowSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceRowSettings: {
            ...prev.unitPriceRowSettings,
            align: value
          }
        }))
      }
    />
  );
}

function UnitPriceRowSize() {
  const size = useInvoiceStore(state => state.tableSettings.unitPriceRowSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceRowSettings: {
            ...prev.unitPriceRowSettings,
            size: value
          }
        }))
      }
    />
  );
}

function UnitPriceRowWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.unitPriceRowSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceRowSettings: {
            ...prev.unitPriceRowSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function UnitPriceRowColor() {
  const color = useInvoiceStore(state => state.tableSettings.unitPriceRowSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          unitPriceRowSettings: {
            ...prev.unitPriceRowSettings,
            color: value
          }
        }))
      }
    />
  );
}

// Amount Header Settings
function AmountHeaderAlign() {
  const align = useInvoiceStore(state => state.tableSettings.amountHeaderSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountHeaderSettings: {
            ...prev.amountHeaderSettings,
            align: value
          }
        }))
      }
    />
  );
}

function AmountHeaderSize() {
  const size = useInvoiceStore(state => state.tableSettings.amountHeaderSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountHeaderSettings: {
            ...prev.amountHeaderSettings,
            size: value
          }
        }))
      }
    />
  );
}

function AmountHeaderWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.amountHeaderSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountHeaderSettings: {
            ...prev.amountHeaderSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function AmountHeaderColor() {
  const color = useInvoiceStore(state => state.tableSettings.amountHeaderSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountHeaderSettings: {
            ...prev.amountHeaderSettings,
            color: value
          }
        }))
      }
    />
  );
}

function AmountHeaderLabel() {
  const label = useInvoiceStore(state => state.tableSettings.amountHeaderSettings.label);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="amount-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="amount-header-label"
        value={label}
        onChange={({ target: { value } }) =>
          setTableSettings(prev => ({
            ...prev,
            amountHeaderSettings: {
              ...prev.amountHeaderSettings,
              label: value
            }
          }))
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Amount Row Settings
function AmountRowAlign() {
  const align = useInvoiceStore(state => state.tableSettings.amountRowSettings.align);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <AlignSettings
      value={align}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountRowSettings: {
            ...prev.amountRowSettings,
            align: value
          }
        }))
      }
    />
  );
}

function AmountRowSize() {
  const size = useInvoiceStore(state => state.tableSettings.amountRowSettings.size);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <SizeSettings
      value={size}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountRowSettings: {
            ...prev.amountRowSettings,
            size: value
          }
        }))
      }
    />
  );
}

function AmountRowWeight() {
  const weight = useInvoiceStore(state => state.tableSettings.amountRowSettings.weight);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <FontWeightSettings
      value={weight}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountRowSettings: {
            ...prev.amountRowSettings,
            weight: value
          }
        }))
      }
    />
  );
}

function AmountRowColor() {
  const color = useInvoiceStore(state => state.tableSettings.amountRowSettings.color);
  const setTableSettings = useInvoiceStore(state => state.setTableSettings);

  return (
    <ColorSettings
      value={color}
      handleInput={value =>
        setTableSettings(prev => ({
          ...prev,
          amountRowSettings: {
            ...prev.amountRowSettings,
            color: value
          }
        }))
      }
    />
  );
}
