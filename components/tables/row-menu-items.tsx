import type { ComponentType } from "react";
import { Fragment } from "react";
import {
  ContextMenuItem,
  ContextMenuSeparator
} from "~/components/ui/context-menu";
import {
  DropdownMenuItem,
  DropdownMenuSeparator
} from "~/components/ui/dropdown-menu";

// A list row's actions, written once and shown both in its right-click menu
// and in its ⋯ menu, so the two can't drift apart.
export function RowMenuItems({
  menu,
  actions
}: {
  menu: "context" | "dropdown";
  actions: {
    label: string;
    icon: ComponentType<{ "aria-hidden"?: boolean }>;
    onSelect: () => void;
    destructive?: boolean;
    // Sets the action apart from the ones above it, as for Delete.
    separated?: boolean;
  }[];
}) {
  const Item = menu === "context" ? ContextMenuItem : DropdownMenuItem;
  const Separator =
    menu === "context" ? ContextMenuSeparator : DropdownMenuSeparator;

  return actions.map(
    ({ label, icon: Icon, onSelect, destructive, separated }) => (
      <Fragment key={label}>
        {separated && <Separator />}
        <Item
          variant={destructive ? "destructive" : "default"}
          onClick={onSelect}
        >
          <Icon aria-hidden />
          {label}
        </Item>
      </Fragment>
    )
  );
}
