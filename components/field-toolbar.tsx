import { TextStyleControls } from "components/settings-fields";
import { Popover, PopoverContent } from "components/ui/popover";
import { useUI } from "context/ui-context";
import { useEffect, useRef, useState } from "react";
import { useInvoiceStore } from "stores/invoice-store";
import type { TextSettings } from "types";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");

    function update() {
      setIsDesktop(query.matches);
    }

    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function ActiveFieldControls({
  selector,
  update
}: {
  selector: (
    state: ReturnType<typeof useInvoiceStore.getState>
  ) => TextSettings;
  update: (key: keyof TextSettings, value: string) => void;
}) {
  const settings = useInvoiceStore(selector);

  return (
    <TextStyleControls
      align={settings.align}
      size={settings.size}
      weight={settings.weight}
      color={settings.color}
      onAlignChange={value => update("align", value)}
      onSizeChange={value => update("size", value)}
      onWeightChange={value => update("weight", value)}
      onColorChange={value => update("color", value)}
    />
  );
}

/**
 * Floating style toolbar on the Base UI popover. It anchors to the focused
 * field's real element (so it re-measures when the field grows on focus) and
 * remounts per field so it opens fresh. Desktop only; mobile keeps the drawer.
 */
export function FieldToolbar() {
  const { activeField, setActiveField, setActiveSettings } = useUI();
  const isDesktop = useIsDesktop();
  const keyRef = useRef(0);
  const prevAnchorEl = useRef<HTMLElement | null>(null);
  const lastField = useRef(activeField);

  if (activeField) {
    lastField.current = activeField;
  }

  if (activeField && activeField.anchorEl !== prevAnchorEl.current) {
    prevAnchorEl.current = activeField.anchorEl;
    keyRef.current += 1;
  }

  const field = activeField ?? lastField.current;
  const open = isDesktop && activeField !== null;

  if (!isDesktop || !field) return null;

  return (
    <Popover
      open={open}
      onOpenChange={(nextOpen, details) => {
        if (nextOpen) return;

        if (details.reason === "escape-key") {
          setActiveField(null);
          setActiveSettings("main");

          return;
        }

        details.cancel();
      }}
    >
      <PopoverContent
        key={keyRef.current}
        anchor={field.anchorEl}
        side="top"
        align="start"
        sideOffset={10}
        collisionPadding={12}
        initialFocus={false}
        finalFocus={false}
        className="w-auto p-2"
      >
        <ActiveFieldControls selector={field.selector} update={field.update} />
      </PopoverContent>
    </Popover>
  );
}
