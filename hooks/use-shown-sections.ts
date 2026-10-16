import { useShallow } from "zustand/react/shallow";
import { useEditorUi } from "~/context/editor-ui-context";
import { useInvoiceStore } from "~/stores/invoice-store";
import type { InvoiceSectionKey } from "~/types";
import { getPrintedSections } from "~/utils/section-visibility";

// Which optional parts the page shows right now. While editing that's every
// switched-on section (empty ones too, so there's somewhere to type); in
// Preview it's only what the PDF prints, read from the same rules the PDF uses.
export function useShownSections(): Record<InvoiceSectionKey, boolean> {
  const { mode } = useEditorUi();
  const sections = useInvoiceStore(state => state.sections);
  const printed = useInvoiceStore(useShallow(getPrintedSections));

  return mode === "preview" ? printed : sections;
}

export function useIsPreview() {
  return useEditorUi().mode === "preview";
}
