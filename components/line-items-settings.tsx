import {
  CompactColorSetting,
  TextStyleControls
} from "components/settings-fields";
import { SettingsSectionPicker } from "components/settings-section-picker";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { SettingsSection } from "components/ui/settings-section";
import type { LineItemTab } from "consts/events";
import { LINE_ITEM_TABS, TAB_SELECT_EVENTS } from "consts/events";
import { useTabSelectEvent } from "hooks/use-tab-select-event";
import { useState } from "react";
import { useInvoiceStore } from "stores/invoice-store";
import type { TextSettings } from "types";

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

const COLUMN_CONFIG: Record<
  LineItemTab,
  {
    label: string;
    headerKey: HeaderSettingsKey;
    rowKey: RowSettingsKey;
    labelId: string;
  }
> = {
  [LINE_ITEM_TABS.description]: {
    label: "Description",
    headerKey: "descriptionHeaderSettings",
    rowKey: "descriptionRowSettings",
    labelId: "description-header-label"
  },
  [LINE_ITEM_TABS.quantity]: {
    label: "Quantity",
    headerKey: "quantityHeaderSettings",
    rowKey: "quantityRowSettings",
    labelId: "quantity-header-label"
  },
  [LINE_ITEM_TABS.unitPrice]: {
    label: "Unit Price",
    headerKey: "unitPriceHeaderSettings",
    rowKey: "unitPriceRowSettings",
    labelId: "unit-price-header-label"
  },
  [LINE_ITEM_TABS.amount]: {
    label: "Amount",
    headerKey: "amountHeaderSettings",
    rowKey: "amountRowSettings",
    labelId: "amount-header-label"
  }
};

function isLineItemTab(value: string): value is LineItemTab {
  return (Object.values(LINE_ITEM_TABS) as LineItemTab[]).includes(
    value as LineItemTab
  );
}

export function LineItemsSettings() {
  const [activeColumn, setActiveColumn] = useState<LineItemTab>(
    LINE_ITEM_TABS.description
  );

  useTabSelectEvent(TAB_SELECT_EVENTS.lineItems, tab => {
    if (isLineItemTab(tab)) {
      setActiveColumn(tab);
    }
  });

  const column = COLUMN_CONFIG[activeColumn];

  return (
    <div className="flex flex-col gap-3">
      <SettingsSectionPicker
        id="line-item-column"
        label="Column"
        value={activeColumn}
        options={Object.entries(COLUMN_CONFIG).map(([value, config]) => ({
          value,
          label: config.label
        }))}
        onValueChange={value => {
          if (isLineItemTab(value)) {
            setActiveColumn(value);
          }
        }}
      />
      <ColumnSettings
        headerKey={column.headerKey}
        rowKey={column.rowKey}
        labelId={column.labelId}
      />
    </div>
  );
}

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
