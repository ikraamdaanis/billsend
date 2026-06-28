import { createFileRoute } from "@tanstack/react-router";
import { InvoiceEditor } from "~/components/editor/invoice-editor";
import { InvoiceDocumentProvider } from "~/context/invoice-document-context";

export const Route = createFileRoute("/create")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <section className="mx-auto flex w-full flex-col overflow-hidden">
      <InvoiceDocumentProvider>
        <InvoiceEditor />
      </InvoiceDocumentProvider>
    </section>
  );
}
