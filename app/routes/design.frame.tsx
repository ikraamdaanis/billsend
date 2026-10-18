import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { DESIGN_BLOCKS } from "~/components/design/design-blocks";
import { DesignFrame } from "~/components/design/design-frame";
import { designSandboxScript } from "~/lib/design-sandbox";
import { EDITOR_THEME_SCRIPT } from "~/utils/editor-theme";

const FRAME_SETUPS = Object.fromEntries(
  DESIGN_BLOCKS.map(block => [
    block.id,
    { storage: block.storage, emptyLibrary: block.emptyLibrary }
  ])
);

// One block of the design catalogue, framed by /design. The sandbox script
// runs before anything else on the page, then the editor theme script reads
// the theme it put in the frame's in-memory storage.
export const Route = createFileRoute("/design/frame")({
  component: DesignFramePage,
  head: () => ({
    meta: [
      { title: "billsend design catalogue frame" },
      { name: "robots", content: "noindex, nofollow" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, interactive-widget=resizes-content"
      }
    ],
    scripts: [
      { children: designSandboxScript(FRAME_SETUPS) },
      { children: EDITOR_THEME_SCRIPT }
    ]
  }),
  validateSearch: (
    search: Record<string, unknown>
  ): { block: string; theme: "light" | "dark" } => ({
    block: typeof search.block === "string" ? search.block : "",
    theme: search.theme === "dark" ? "dark" : "light"
  })
});

function DesignFramePage() {
  const { block: blockId } = Route.useSearch();
  const block = DESIGN_BLOCKS.find(entry => entry.id === blockId);

  return (
    <section className="mx-auto flex w-full flex-col overflow-hidden">
      <ClientOnly fallback={null}>
        {block ? (
          <DesignFrame block={block} />
        ) : (
          <p className="text-muted-foreground p-6 text-sm">No such block.</p>
        )}
      </ClientOnly>
    </section>
  );
}
