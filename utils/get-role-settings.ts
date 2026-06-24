import { resolveInvoiceFont } from "consts/invoice-fonts";
import type { InvoiceTheme, TextRole, TextSettings } from "types";

const DEFAULT_FONT_COLOUR = "#1a1a1a";

// Proportional type scale. Medium reproduces the original per-field sizes;
// small and large scale every role together so the hierarchy stays intact.
const SIZE_FACTOR: Record<InvoiceTheme["size"], number> = {
  small: 0.875,
  medium: 1,
  large: 1.15
};

// Every text-role's baseline, mirroring the styling that used to live in
// per-field TextSettings. `accent: true` roles pick up the theme accent colour
// (title, table header, grand total); everything else uses the body colour.
type RoleBase = {
  align: TextSettings["align"];
  size: number;
  weight: TextSettings["weight"];
  accent?: boolean;
};

const ROLE_BASE: Record<TextRole, RoleBase> = {
  title: { align: "left", size: 36, weight: "Semibold", accent: true },
  sectionLabel: { align: "left", size: 14, weight: "Medium" },
  sectionContent: { align: "left", size: 14, weight: "Normal" },
  termsContent: { align: "left", size: 13, weight: "Normal" },
  detailLabel: { align: "left", size: 14, weight: "Medium" },
  detailValue: { align: "left", size: 14, weight: "Normal" },
  tableHeaderLeft: { align: "left", size: 13, weight: "Medium", accent: true },
  tableHeaderCenter: {
    align: "center",
    size: 13,
    weight: "Medium",
    accent: true
  },
  tableHeaderRight: {
    align: "right",
    size: 13,
    weight: "Medium",
    accent: true
  },
  tableRowLeft: { align: "left", size: 14, weight: "Normal" },
  tableRowCenter: { align: "center", size: 14, weight: "Normal" },
  tableRowRight: { align: "right", size: 14, weight: "Normal" },
  totalsLabel: { align: "right", size: 14, weight: "Medium" },
  totalsValue: { align: "right", size: 14, weight: "Normal" },
  grandTotalLabel: {
    align: "right",
    size: 16,
    weight: "Semibold",
    accent: true
  },
  grandTotalValue: {
    align: "right",
    size: 16,
    weight: "Semibold",
    accent: true
  }
};

/**
 * Derive the concrete text styling for a role from the global invoice theme.
 * Returns a TextSettings so it drops straight into getTextStyles / pdfStyle.
 */
export function getRoleSettings(
  theme: InvoiceTheme,
  role: TextRole,
  options?: { useNumberFont?: boolean }
): TextSettings {
  const base = ROLE_BASE[role];
  const font = resolveInvoiceFont(theme, role, options);

  return {
    align: base.align,
    size: String(Math.round(base.size * SIZE_FACTOR[theme.size])),
    weight: base.weight,
    color: base.accent ? theme.accent : DEFAULT_FONT_COLOUR,
    fontFamily: font.cssFamily,
    pdfFontFamily: font.pdfFamily
  };
}
