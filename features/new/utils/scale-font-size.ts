// Scale factor to adjust PDF text sizes to match the editor view
// PDF text appears larger than web text at the same pixel size
const SCALE_FACTOR = 0.75;

// Helper function to scale font sizes for PDF
export function scaleFontSize(size: string | number) {
  return Math.round(Number(size) * SCALE_FACTOR);
}
