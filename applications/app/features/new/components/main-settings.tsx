import { Label } from "components/ui/label";
import { ColorPicker } from "features/new/components/color-picker";
import { pdfSettingsAtom, updateInvoiceValueAtom } from "features/new/state";
import { useAtomValue, useSetAtom } from "jotai";
import { memo } from "react";

function MainSettingsComponent() {
  const pdfSettings = useAtomValue(pdfSettingsAtom);
  const updateInvoiceValue = useSetAtom(updateInvoiceValueAtom);

  return (
    <div className="flex flex-col gap-4">
      <Label className="text-lg font-medium">Main Settings</Label>
      <div className="grid grid-cols-[minmax(100px,1fr)_1fr] items-center gap-2">
        <Label htmlFor="background-color" className="font-medium">
          Background
        </Label>
        <div className="flex items-center justify-end gap-2">
          <ColorPicker
            color={pdfSettings.backgroundColor}
            onChange={value =>
              updateInvoiceValue({
                field: "pdfSettings.backgroundColor",
                value
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export const MainSettings = memo(MainSettingsComponent);
