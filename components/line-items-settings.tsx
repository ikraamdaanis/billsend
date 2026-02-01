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
import { useTableSettingsSlice } from "stores/invoice-selectors";
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
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.backgroundColor}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          backgroundColor: value
        })
      }
      label="Background"
    />
  );
}

function TableBorderColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.borderColor}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          borderColor: value
        })
      }
      label="Border Color"
    />
  );
}

// Description Header Settings
function DescriptionHeaderAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.descriptionHeaderSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            align: value
          }
        })
      }
    />
  );
}

function DescriptionHeaderSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.descriptionHeaderSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            size: value
          }
        })
      }
    />
  );
}

function DescriptionHeaderWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.descriptionHeaderSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
}

function DescriptionHeaderColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.descriptionHeaderSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionHeaderSettings: {
            ...tableSettings.descriptionHeaderSettings,
            color: value
          }
        })
      }
    />
  );
}

function DescriptionHeaderLabel() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="description-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="description-header-label"
        value={tableSettings.descriptionHeaderSettings.label}
        onChange={({ target: { value } }) =>
          setTableSettings({
            ...tableSettings,
            descriptionHeaderSettings: {
              ...tableSettings.descriptionHeaderSettings,
              label: value
            }
          })
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Description Row Settings
function DescriptionRowAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.descriptionRowSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            align: value
          }
        })
      }
    />
  );
}

function DescriptionRowSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.descriptionRowSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            size: value
          }
        })
      }
    />
  );
}

function DescriptionRowWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.descriptionRowSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            weight: value
          }
        })
      }
    />
  );
}

function DescriptionRowColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.descriptionRowSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          descriptionRowSettings: {
            ...tableSettings.descriptionRowSettings,
            color: value
          }
        })
      }
    />
  );
}

// Quantity Header Settings
function QuantityHeaderAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.quantityHeaderSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            align: value
          }
        })
      }
    />
  );
}

function QuantityHeaderSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.quantityHeaderSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            size: value
          }
        })
      }
    />
  );
}

function QuantityHeaderWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.quantityHeaderSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
}

function QuantityHeaderColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.quantityHeaderSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityHeaderSettings: {
            ...tableSettings.quantityHeaderSettings,
            color: value
          }
        })
      }
    />
  );
}

function QuantityHeaderLabel() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="quantity-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="quantity-header-label"
        value={tableSettings.quantityHeaderSettings.label}
        onChange={({ target: { value } }) =>
          setTableSettings({
            ...tableSettings,
            quantityHeaderSettings: {
              ...tableSettings.quantityHeaderSettings,
              label: value
            }
          })
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Quantity Row Settings
function QuantityRowAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.quantityRowSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            align: value
          }
        })
      }
    />
  );
}

function QuantityRowSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.quantityRowSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            size: value
          }
        })
      }
    />
  );
}

function QuantityRowWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.quantityRowSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            weight: value
          }
        })
      }
    />
  );
}

function QuantityRowColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.quantityRowSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          quantityRowSettings: {
            ...tableSettings.quantityRowSettings,
            color: value
          }
        })
      }
    />
  );
}

// Unit Price Header Settings
function UnitPriceHeaderAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.unitPriceHeaderSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            align: value
          }
        })
      }
    />
  );
}

function UnitPriceHeaderSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.unitPriceHeaderSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            size: value
          }
        })
      }
    />
  );
}

function UnitPriceHeaderWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.unitPriceHeaderSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
}

function UnitPriceHeaderColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.unitPriceHeaderSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceHeaderSettings: {
            ...tableSettings.unitPriceHeaderSettings,
            color: value
          }
        })
      }
    />
  );
}

function UnitPriceHeaderLabel() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="unit-price-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="unit-price-header-label"
        value={tableSettings.unitPriceHeaderSettings.label}
        onChange={({ target: { value } }) =>
          setTableSettings({
            ...tableSettings,
            unitPriceHeaderSettings: {
              ...tableSettings.unitPriceHeaderSettings,
              label: value
            }
          })
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Unit Price Row Settings
function UnitPriceRowAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.unitPriceRowSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            align: value
          }
        })
      }
    />
  );
}

function UnitPriceRowSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.unitPriceRowSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            size: value
          }
        })
      }
    />
  );
}

function UnitPriceRowWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.unitPriceRowSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            weight: value
          }
        })
      }
    />
  );
}

function UnitPriceRowColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.unitPriceRowSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          unitPriceRowSettings: {
            ...tableSettings.unitPriceRowSettings,
            color: value
          }
        })
      }
    />
  );
}

// Amount Header Settings
function AmountHeaderAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.amountHeaderSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            align: value
          }
        })
      }
    />
  );
}

function AmountHeaderSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.amountHeaderSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            size: value
          }
        })
      }
    />
  );
}

function AmountHeaderWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.amountHeaderSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            weight: value
          }
        })
      }
    />
  );
}

function AmountHeaderColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.amountHeaderSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountHeaderSettings: {
            ...tableSettings.amountHeaderSettings,
            color: value
          }
        })
      }
    />
  );
}

function AmountHeaderLabel() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
      <Label htmlFor="amount-header-label" className="font-medium">
        Label
      </Label>
      <input
        type="text"
        id="amount-header-label"
        value={tableSettings.amountHeaderSettings.label}
        onChange={({ target: { value } }) =>
          setTableSettings({
            ...tableSettings,
            amountHeaderSettings: {
              ...tableSettings.amountHeaderSettings,
              label: value
            }
          })
        }
        className="w-full border p-2"
      />
    </div>
  );
}

// Amount Row Settings
function AmountRowAlign() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <AlignSettings
      value={tableSettings.amountRowSettings.align}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            align: value
          }
        })
      }
    />
  );
}

function AmountRowSize() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <SizeSettings
      value={tableSettings.amountRowSettings.size}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            size: value
          }
        })
      }
    />
  );
}

function AmountRowWeight() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <FontWeightSettings
      value={tableSettings.amountRowSettings.weight}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            weight: value
          }
        })
      }
    />
  );
}

function AmountRowColor() {
  const { tableSettings, setTableSettings } = useTableSettingsSlice();

  return (
    <ColorSettings
      value={tableSettings.amountRowSettings.color}
      handleInput={value =>
        setTableSettings({
          ...tableSettings,
          amountRowSettings: {
            ...tableSettings.amountRowSettings,
            color: value
          }
        })
      }
    />
  );
}
