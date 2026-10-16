import { IconLock, IconPlus, IconSearch } from "@tabler/icons-react";
import { format, isValid, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import { SegmentedControl } from "~/components/editor/shell/inspector/inspector-controls";
import { Button } from "~/components/ui/button";
import { formatCurrency } from "~/consts/currencies";
import { useFileActions } from "~/context/file-actions-context";
import { useInvoiceDocument } from "~/context/invoice-document-context";
import { watchInvoices, watchTemplates } from "~/db";
import type { InvoiceDocument, InvoiceTemplate } from "~/types";
import { calculateInvoiceTotals } from "~/utils/calculate-invoice-totals";

type LibraryTab = "invoices" | "templates";

// The client an invoice is grouped under: the first line of its "To" block.
function clientName(document: InvoiceDocument) {
  const firstLine = document.invoiceData.client.content
    .split("\n")
    .map(line => line.trim())
    .find(Boolean);

  return firstLine ?? "No client yet";
}

function invoiceDateLabel(document: InvoiceDocument) {
  const date = parseISO(document.invoiceData.invoiceDate);
  const fallback = new Date(document.updatedAt);

  if (isValid(date)) return format(date, "d MMM yyyy");

  return isValid(fallback) ? format(fallback, "d MMM yyyy") : "";
}

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.trim().toLowerCase());
}

// The saved invoices and templates in this browser, one click away, like the
// pages list in Framer. Opening one goes through the same unsaved-changes
// check as the project menu.
export function InvoicesPanel() {
  const [tab, setTab] = useState<LibraryTab>("invoices");
  const [query, setQuery] = useState("");
  const { newInvoice } = useFileActions();

  return (
    <>
      <div className="flex shrink-0 flex-col gap-2 px-3 pt-2.5 pb-2">
        <SegmentedControl
          label="Library"
          value={tab}
          options={[
            { value: "invoices", label: "Invoices" },
            { value: "templates", label: "Templates" }
          ]}
          onChange={setTab}
        />
        <label className="bg-muted text-muted-foreground focus-within:border-ring flex h-8 items-center gap-1.5 rounded-md border border-transparent px-2">
          <IconSearch aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="sr-only">
            {tab === "invoices" ? "Search invoices" : "Search templates"}
          </span>
          <input
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            placeholder={
              tab === "invoices" ? "Search invoices" : "Search templates"
            }
            className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-[13px] outline-none"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 pb-2">
        {tab === "invoices" ? (
          <InvoiceList query={query} />
        ) : (
          <TemplateList query={query} />
        )}
      </div>
      <div className="border-border flex shrink-0 flex-col gap-2 border-t p-3">
        <Button variant="secondary" onClick={newInvoice} className="w-full">
          <IconPlus aria-hidden="true" />
          New invoice
        </Button>
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <IconLock aria-hidden="true" className="size-3.5 shrink-0" />
          Stored only in this browser
        </p>
      </div>
    </>
  );
}

function InvoiceList({ query }: { query: string }) {
  const [invoices, setInvoices] = useState<InvoiceDocument[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentDocumentId } = useInvoiceDocument();
  const { openInvoice, showOpenInvoice } = useFileActions();

  useEffect(
    () =>
      watchInvoices(
        next => {
          setInvoices(next);
          setError(null);
        },
        failure => setError(failure.message)
      ),
    []
  );

  if (error) return <ListMessage>{error}</ListMessage>;
  if (!invoices) return null;

  if (invoices.length === 0) {
    return (
      <ListMessage>
        No saved invoices yet. Save this one with ⌘S and it will show here.
      </ListMessage>
    );
  }

  const matches = invoices
    .filter(document =>
      matchesQuery(
        `${document.name} ${clientName(document)} ${document.invoiceData.number}`,
        query
      )
    )
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  // Clients in order of their latest invoice, each with its invoices newest
  // first (the sort above already put them in that order).
  const groups = new Map<string, InvoiceDocument[]>();

  matches.forEach(document => {
    const client = clientName(document);
    groups.set(client, [...(groups.get(client) ?? []), document]);
  });

  return (
    <div className="flex flex-col gap-2">
      {matches.length === 0 && (
        <ListMessage>No invoices match “{query.trim()}”.</ListMessage>
      )}
      {[...groups.entries()].map(([client, documents]) => (
        <section key={client} className="flex flex-col gap-px">
          <h3 className="text-muted-foreground truncate px-2 pt-1 pb-0.5 text-[11px] font-medium">
            {client}
          </h3>
          {documents.map(document => (
            <LibraryItem
              key={document.id}
              current={document.id === currentDocumentId}
              title={document.name}
              aside={formatCurrency(
                calculateInvoiceTotals(document.invoiceData).total,
                document.invoiceData.currency
              )}
              meta={[
                document.invoiceData.number &&
                  `No. ${document.invoiceData.number}`,
                invoiceDateLabel(document)
              ]
                .filter(Boolean)
                .join(" · ")}
              onSelect={() => openInvoice(document.id)}
            />
          ))}
        </section>
      ))}
      <button
        type="button"
        onClick={showOpenInvoice}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mx-2 mt-1 w-fit rounded-sm text-xs underline-offset-2 outline-none hover:underline focus-visible:ring-1"
      >
        Rename or delete invoices…
      </button>
    </div>
  );
}

function TemplateList({ query }: { query: string }) {
  const [templates, setTemplates] = useState<InvoiceTemplate[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { applyTemplate, saveAsTemplate } = useFileActions();

  useEffect(
    () =>
      watchTemplates(
        next => {
          setTemplates(next);
          setError(null);
        },
        failure => setError(failure.message)
      ),
    []
  );

  if (error) return <ListMessage>{error}</ListMessage>;
  if (!templates) return null;

  if (templates.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <ListMessage>
          No templates yet. Save this invoice as one to start the next from it.
        </ListMessage>
        <button
          type="button"
          onClick={saveAsTemplate}
          className="text-foreground hover:bg-muted focus-visible:ring-ring mx-2 w-fit rounded-md px-2 py-1 text-xs font-medium outline-none focus-visible:ring-1"
        >
          Save as template
        </button>
      </div>
    );
  }

  const matches = templates.filter(template =>
    matchesQuery(`${template.name} ${template.description ?? ""}`, query)
  );

  return (
    <div className="flex flex-col gap-px">
      <h3 className="text-muted-foreground px-2 pt-1 pb-0.5 text-[11px] font-medium">
        Start a new invoice from
      </h3>
      {matches.length === 0 && (
        <ListMessage>No templates match “{query.trim()}”.</ListMessage>
      )}
      {matches.map(template => (
        <LibraryItem
          key={template.id}
          current={false}
          title={template.name}
          meta={template.description ?? ""}
          onSelect={() => applyTemplate(template)}
        />
      ))}
    </div>
  );
}

function LibraryItem({
  current,
  title,
  aside,
  meta,
  onSelect
}: {
  current: boolean;
  title: string;
  aside?: string;
  meta: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-current={current ? "true" : undefined}
      onClick={onSelect}
      className="hover:bg-muted aria-[current=true]:bg-accent focus-visible:ring-ring grid w-full grid-cols-[minmax(0,1fr)_auto] gap-x-2 rounded-md px-2 py-1.5 text-left outline-none focus-visible:ring-1 pointer-coarse:py-2.5"
    >
      <span className="text-foreground truncate text-[13px] font-medium">
        {title || "Untitled invoice"}
      </span>
      {aside && (
        <span className="text-muted-foreground text-xs tabular-nums">
          {aside}
        </span>
      )}
      {meta && (
        <span className="text-muted-foreground col-span-2 truncate text-xs">
          {meta}
        </span>
      )}
    </button>
  );
}

function ListMessage({ children }: { children: string | string[] }) {
  return (
    <p className="text-muted-foreground px-2 py-3 text-xs text-pretty">
      {children}
    </p>
  );
}
