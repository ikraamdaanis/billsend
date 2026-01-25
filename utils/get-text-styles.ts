import type { TextSettings } from "types";
import type { FontWeight } from "utils/get-font-weight";
import { getFontWeight } from "utils/get-font-weight";
import { scaleFontSize } from "utils/scale-font-size";

export function getTextStyles({
  settings,
  remove = [],
  isPdf = false
}: {
  settings: Partial<TextSettings>;
  remove?: (keyof TextSettings)[];
  isPdf?: boolean;
}) {
  const styles: Record<string, string | number | undefined> = {
    color: settings.color,
    fontSize: isPdf ? scaleFontSize(settings.size || 0) : `${settings.size}px`,
    fontWeight: getFontWeight(settings.weight as FontWeight),
    textAlign: settings.align
  };

  if (remove.includes("color")) {
    delete styles.color;
  }

  if (remove.includes("size")) {
    delete styles.size;
  }

  if (remove.includes("weight")) {
    delete styles.weight;
  }

  if (remove.includes("align")) {
    delete styles.align;
  }

  return styles;
}
