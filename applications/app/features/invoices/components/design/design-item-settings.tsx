import { InputUpdater } from "app/routes/dashboard/(editor)/templates.create";
import type { TemplatePaths } from "features/invoices/state";

export function DesignItemSettings({ path }: { path: TemplatePaths }) {
  return (
    <div>
      <InputUpdater variableName={path} label="Primary Colour" type="color" />
    </div>
  );
}
