import { IconLoader2 } from "@tabler/icons-react";
import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { InvoiceEditor } from "~/components/editor/invoice-editor";
import { InvoiceDocumentProvider } from "~/context/invoice-document-context";

export const Route = createFileRoute("/create")({
  component: RouteComponent
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
          <InvoiceEditor />
        </InvoiceDocumentProvider>
      </ClientOnly>
    </section>
  );
}

function EditorLoading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-zinc-200">
      <IconLoader2
        className="text-muted-foreground size-6 animate-spin"
        aria-label="Loading editor"
      />
    </div>
  );
}
