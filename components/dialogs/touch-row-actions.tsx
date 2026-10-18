import type { ComponentType } from "react";
import { Button } from "~/components/ui/button";

// On touch, where list rows have no ⋯ menu, the selected row's actions sit in
// the dialog's footer beside Open, under the thumb. A mouse keeps the row's ⋯
// and right-click menus instead, so these stay hidden for it.
export function TouchRowActions({
  actions
}: {
  actions: {
    label: string;
    icon: ComponentType<{ "aria-hidden"?: boolean }>;
    onSelect: () => void;
    destructive?: boolean;
  }[];
}) {
  return (
    <div className="hidden items-center gap-2 pointer-coarse:flex">
      {actions.map(({ label, icon: Icon, onSelect, destructive }) => (
        <Button
          key={label}
          variant={destructive ? "destructive" : "secondary"}
          size="icon"
          aria-label={label}
          title={label}
          onClick={onSelect}
          className="size-10"
        >
          <Icon aria-hidden />
        </Button>
      ))}
    </div>
  );
}
