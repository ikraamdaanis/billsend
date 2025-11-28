import { createFileRoute } from "@tanstack/react-router";
import { InvoiceEditor } from "features/new/components/invoice-editor";
import { InvoiceGenerator } from "features/new/components/invoice-generator";

export const Route = createFileRoute("/new")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <section className="mx-auto flex w-full flex-col overflow-hidden">
      <InvoiceEditor />
      <InvoiceGenerator />
    </section>
  );
}
