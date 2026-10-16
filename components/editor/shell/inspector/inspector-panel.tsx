import type { ReactNode } from "react";
import { DetailsSection } from "~/components/editor/shell/inspector/details-section";
import { StyleSection } from "~/components/editor/shell/inspector/style-section";

// Settings that apply to the whole invoice, moved off the old Edit menu and
// out of the page so the page only holds the invoice itself.
export function InspectorPanel({ children }: { children?: ReactNode }) {
  return (
    <>
      <div className="border-border flex h-11 shrink-0 items-center justify-between gap-2 border-b px-4">
        <h2 className="text-foreground text-[13px] font-semibold">Invoice</h2>
        <span className="text-muted-foreground text-xs">Whole page</span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <StyleSection />
        <DetailsSection />
        {children}
      </div>
    </>
  );
}
