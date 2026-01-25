import { createFileRoute } from "@tanstack/react-router";
import { InvoiceEditor } from "components/invoice-editor";

export const Route = createFileRoute("/create")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <section className="mx-auto flex w-full flex-col overflow-hidden">
      <InvoiceEditor />
      {/* <InvoiceGenerator /> */}
    </section>
  );
}
