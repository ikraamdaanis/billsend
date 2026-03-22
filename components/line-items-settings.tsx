import {
  CompactColorSetting,
  TextStyleControls
} from "components/settings-fields";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { SettingsSection } from "components/ui/settings-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "components/ui/tabs";
import type { LineItemTab } from "consts/events";
import { LINE_ITEM_TABS, TAB_SELECT_EVENTS } from "consts/events";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInvoiceStore } from "stores/invoice-store";
import type { TextSettings } from "types";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToSelectedTab(activeTab);
    }, 100);

    return () => clearTimeout(timer);
  }, [activeTab, scrollToSelectedTab]);

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
        className="flex flex-col gap-2"
      >
        <ColumnSettings
          headerKey="descriptionHeaderSettings"
          rowKey="descriptionRowSettings"
          labelId="description-header-label"
        />
      </TabsContent>
      <TabsContent
        value={LINE_ITEM_TABS.quantity}
        className="flex flex-col gap-2"
      >
        <ColumnSettings
          headerKey="quantityHeaderSettings"
          rowKey="quantityRowSettings"
          labelId="quantity-header-label"
        />
      </TabsContent>
      <TabsContent
        value={LINE_ITEM_TABS.unitPrice}
        className="flex flex-col gap-2"
      >
        <ColumnSettings
          headerKey="unitPriceHeaderSettings"
          rowKey="unitPriceRowSettings"
          labelId="unit-price-header-label"
        />
      </TabsContent>
      <TabsContent
        value={LINE_ITEM_TABS.amount}
        className="flex flex-col gap-2"
      >
        <ColumnSettings
          headerKey="amountHeaderSettings"
          rowKey="amountRowSettings"
          labelId="amount-header-label"
        />
      </TabsContent>
    </Tabs>
  );
}

type HeaderSettingsKey =
  | "descriptionHeaderSettings"
  | "quantityHeaderSettings"
  | "unitPriceHeaderSettings"
  | "amountHeaderSettings";

type RowSettingsKey =
  | "descriptionRowSettings"
  | "quantityRowSettings"
  | "unitPriceRowSettings"
  | "amountRowSettings";

function ColumnSettings({
  headerKey,
  rowKey,
  labelId
}: {
  headerKey: HeaderSettingsKey;
  rowKey: RowSettingsKey;
  labelId: string;
}) {
  return (
    <>
      <SettingsSection title="Header">
        <HeaderStyles headerKey={headerKey} />
        <HeaderLabelInput headerKey={headerKey} labelId={labelId} />
      </SettingsSection>
      <SettingsSection title="Row">
        <RowStyles rowKey={rowKey} />
      </SettingsSection>
      <SettingsSection title="Table Design">
        <TableDesignSettings />
      </SettingsSection>
    </>
  );
}

function HeaderStyles({ headerKey }: { headerKey: HeaderSettingsKey }) {
  const settings = useInvoiceStore(
    s => s.tableSettings[headerKey] as TextSettings
  );
  const set = useInvoiceStore(s => s.setTableSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({
          ...prev,
          [headerKey]: { ...prev[headerKey], align: v }
        }))
      }
      onSizeChange={v =>
        set(prev => ({
          ...prev,
          [headerKey]: { ...prev[headerKey], size: v }
        }))
      }
      onWeightChange={v =>
        set(prev => ({
          ...prev,
          [headerKey]: { ...prev[headerKey], weight: v }
        }))
      }
      onColorChange={v =>
        set(prev => ({
          ...prev,
          [headerKey]: { ...prev[headerKey], color: v }
        }))
      }
    />
  );
}

function HeaderLabelInput({
  headerKey,
  labelId
}: {
  headerKey: HeaderSettingsKey;
  labelId: string;
}) {
  const label = useInvoiceStore(
    s => (s.tableSettings[headerKey] as TextSettings & { label: string }).label
  );
  const set = useInvoiceStore(s => s.setTableSettings);

  return (
    <div className="grid grid-cols-[42px_1fr] items-center gap-x-2">
      <Label htmlFor={labelId} className="text-muted-foreground text-[11px]">
        Label
      </Label>
      <Input
        type="text"
        id={labelId}
        value={label}
        onChange={({ target: { value } }) =>
          set(prev => ({
            ...prev,
            [headerKey]: { ...prev[headerKey], label: value }
          }))
        }
        className="h-7 text-xs"
      />
    </div>
  );
}

function RowStyles({ rowKey }: { rowKey: RowSettingsKey }) {
  const settings = useInvoiceStore(s => s.tableSettings[rowKey]);
  const set = useInvoiceStore(s => s.setTableSettings);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={v =>
        set(prev => ({
          ...prev,
          [rowKey]: { ...prev[rowKey], align: v }
        }))
      }
      onSizeChange={v =>
        set(prev => ({
          ...prev,
          [rowKey]: { ...prev[rowKey], size: v }
        }))
      }
      onWeightChange={v =>
        set(prev => ({
          ...prev,
          [rowKey]: { ...prev[rowKey], weight: v }
        }))
      }
      onColorChange={v =>
        set(prev => ({
          ...prev,
          [rowKey]: { ...prev[rowKey], color: v }
        }))
      }
    />
  );
}

function TableDesignSettings() {
  return (
    <div className="flex flex-col gap-1.5">
      <TableBackgroundColor />
      <TableBorderColor />
    </div>
  );
}

function TableBackgroundColor() {
  const backgroundColor = useInvoiceStore(s => s.tableSettings.backgroundColor);
  const set = useInvoiceStore(s => s.setTableSettings);

  return (
    <CompactColorSetting
      value={backgroundColor}
      handleInput={v => set(prev => ({ ...prev, backgroundColor: v }))}
      label="Background"
    />
  );
}

function TableBorderColor() {
  const borderColor = useInvoiceStore(s => s.tableSettings.borderColor);
  const set = useInvoiceStore(s => s.setTableSettings);

  return (
    <CompactColorSetting
      value={borderColor}
      handleInput={v => set(prev => ({ ...prev, borderColor: v }))}
      label="Border"
    />
  );
}
