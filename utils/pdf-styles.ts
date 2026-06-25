import type { Style } from "@react-pdf/types";
import type { InvoiceTheme, TextRole, TextSettings } from "~/types";
import { getFontWeight } from "~/utils/get-font-weight";
import { getRoleSettings } from "~/utils/get-role-settings";
import { scaleFontSize } from "~/utils/scale-font-size";

/**
 * Convert TextSettings to a PDF-compatible style object.
 * Handles font size scaling and weight mapping internally.
 */
export function pdfStyle(
  settings: Partial<TextSettings>,
  overrides?: Style
): Style {
  const fontSize = scaleFontSize(settings.size ?? 0);
  const base: Style = {
    textAlign: settings.align,
    fontSize,
    fontWeight: getFontWeight(settings.weight ?? "Normal"),
    color: settings.color,
    fontFamily: settings.pdfFontFamily ?? settings.fontFamily,
    letterSpacing: settings.letterSpacing?.endsWith("em")
      ? parseFloat(settings.letterSpacing) * fontSize
      : settings.letterSpacing
  };

  return overrides ? { ...base, ...overrides } : base;
}

/**
 * Resolve a text role to a PDF style, applying the theme-derived settings.
 * Mirrors getRoleSettings + getTextStyles on the canvas side.
 */
export function pdfRoleStyle(
  theme: InvoiceTheme,
  role: TextRole,
  overrides?: Style
): Style {
  return pdfStyle(getRoleSettings(theme, role), overrides);
}
