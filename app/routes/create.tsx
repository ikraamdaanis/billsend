import { createFileRoute } from "@tanstack/react-router";
import { InvoiceEditor } from "components/invoice-editor";
import { InvoiceDocumentProvider } from "context/invoice-document-context";
import { UIProvider } from "context/ui-context";

export const Route = createFileRoute("/create")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <section className="mx-auto flex w-full flex-col overflow-hidden">
      <InvoiceDocumentProvider>
        <UIProvider>
          <InvoiceEditor />
        </UIProvider>
      </InvoiceDocumentProvider>
    </section>
  );
}
