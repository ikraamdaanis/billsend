import type { TextSettings } from "types";
import type { FontWeight } from "utils/get-font-weight";
import { getFontWeight } from "utils/get-font-weight";
import { scaleFontSize } from "utils/scale-font-size";

/**
 * Convert TextSettings to a PDF-compatible style object.
 * Handles font size scaling and weight mapping internally.
 */
export function pdfStyle(
  settings: Partial<TextSettings>,
  overrides?: Record<string, string | number>
) {
  const fontSize = scaleFontSize(settings.size ?? 0);
  const base = {
    textAlign: settings.align,
    fontSize,
    fontWeight: getFontWeight((settings.weight ?? "Normal") as FontWeight),
    color: settings.color,
    fontFamily: settings.pdfFontFamily ?? settings.fontFamily,
    letterSpacing: settings.letterSpacing?.endsWith("em")
      ? parseFloat(settings.letterSpacing) * fontSize
      : settings.letterSpacing
  };

  return overrides ? { ...base, ...overrides } : base;
}
