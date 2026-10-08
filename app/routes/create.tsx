import { IconLoader2 } from "@tabler/icons-react";
import {
  ClientOnly,
  createFileRoute,
  useNavigate
} from "@tanstack/react-router";
import { useEffect } from "react";
import { InvoiceEditor } from "~/components/editor/invoice-editor";
import { INVOICE_FONTS } from "~/consts/invoice-fonts";
import {
  InvoiceDocumentProvider,
  useInvoiceDocument
} from "~/context/invoice-document-context";
import type { InvoiceFont } from "~/types";

// Optional hand-offs from the homepage: `font` starts a fresh invoice in the
// face picked in the preview, and `open=invoices` opens the saved-invoice list.
// Anything unrecognised is dropped rather than trusted.
export const Route = createFileRoute("/create")({
  component: RouteComponent,
  validateSearch: (
    search: Record<string, unknown>
  ): { font?: InvoiceFont; open?: "invoices" } => ({
    font: INVOICE_FONTS.find(definition => definition.id === search.font)?.id,
    open: search.open === "invoices" ? "invoices" : undefined
  })
});

// The editor is entirely client-state-driven (Zustand + IndexedDB), so it is
// rendered client-only. Server-rendering it would ship interactive inputs in the
// initial HTML that React has not attached handlers to yet; keystrokes in that
// pre-hydration window would be silently discarded when React reconciles the
// inputs back to their default values. ClientOnly renders the fallback through
// React hydration; InvoiceDocumentProvider then holds the same fallback through
// store hydration (the async draft read + blank-invoice seed), so the editor's
// inputs only mount once their bound state is settled and can't be raced.
function RouteComponent() {
  return (
    <section className="mx-auto flex w-full flex-col overflow-hidden">
      <ClientOnly fallback={<EditorLoading />}>
        <InvoiceDocumentProvider fallback={<EditorLoading />}>
          <StartingFont />
          <InvoiceEditor />
        </InvoiceDocumentProvider>
      </ClientOnly>
    </section>
  );
}

// Runs once hydration has settled (the provider only renders its children
// then), so the font lands on the blank hydration produced, not on state that
// is about to be replaced. The param is cleared afterwards so a reload or a
// later blank doesn't re-apply it.
function StartingFont() {
  const { font } = Route.useSearch();
  const navigate = useNavigate();
  const { applyStartingFont } = useInvoiceDocument();

  useEffect(() => {
    if (!font) return;

    applyStartingFont(font);
    void navigate({
      to: "/create",
      search: previous => ({ ...previous, font: undefined }),
      replace: true
    });
  }, [font, applyStartingFont, navigate]);

  return null;
}

function EditorLoading() {
  return (
    <div className="bg-desk flex h-dvh w-full items-center justify-center">
      <IconLoader2
        className="text-muted-foreground size-6 animate-spin"
        aria-label="Loading editor"
      />
    </div>
  );
}
