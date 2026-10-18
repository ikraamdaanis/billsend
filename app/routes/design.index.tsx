import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { DesignCatalogue } from "~/components/design/design-catalogue";

// A working page for judging the editor's chrome; unlinked and kept out of
// search. See components/design/design-catalogue.tsx.
export const Route = createFileRoute("/design/")({
  component: DesignCataloguePage,
  head: () => ({
    meta: [
      { title: "billsend design catalogue" },
      { name: "robots", content: "noindex, nofollow" }
    ]
  })
});

function DesignCataloguePage() {
  return (
    <ClientOnly fallback={null}>
      <DesignCatalogue />
    </ClientOnly>
  );
}
