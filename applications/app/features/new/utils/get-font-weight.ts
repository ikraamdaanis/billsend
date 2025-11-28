export type FontWeight = "Normal" | "Medium" | "Semibold" | "Bold";

const fontWeights: Record<string, number> = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700
};

/**
 * Helper function to convert weight string to PDF weight.
 */
export function getFontWeight(weight: FontWeight) {
  return fontWeights[weight.toLowerCase()];
}
