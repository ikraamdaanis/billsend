import type { CSSProperties, ReactNode } from "react";

const CANVAS_STATIC_STYLES: CSSProperties = {
  WebkitFontSmoothing: "antialiased",
  MozOsxFontSmoothing: "grayscale"
};

export function InvoiceCanvas({ children }: { children: ReactNode }) {
  return (
    <section className="relative h-full overflow-auto py-4">
      <div
        className="mx-auto h-fit min-h-[297mm] w-[210mm] border border-zinc-300 bg-white p-4 text-zinc-900 shadow-md sm:p-8 lg:p-16 xl:p-20"
        onClick={event => event.stopPropagation()}
        style={CANVAS_STATIC_STYLES}
      >
        {children}
      </div>
    </section>
  );
}
