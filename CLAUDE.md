# CLAUDE.md

## Project Overview

Billsend is a free, local-first invoice generator that runs entirely in the browser. No accounts, no servers, no tracking — all data stays on the user's device in IndexedDB.

## Tech Stack

- **Framework:** TanStack Start (React 19 + TanStack Router)
- **Language:** TypeScript (strict mode)
- **Build:** Vite 7 with React Compiler (Babel plugin)
- **Styling:** Tailwind CSS 4 + shadcn/ui (new-york style) + Radix UI primitives
- **State:** Zustand (with Immer + subscribeWithSelector middleware) for invoice data; React Context for UI state
- **Storage:** Dexie (IndexedDB wrapper) — no backend, no HTTP requests
- **PDF:** @react-pdf/renderer
- **Forms:** React Hook Form + Zod validation
- **Icons:** lucide-react
- **Package Manager:** Bun
- **Deployment:** Cloudflare Workers (`wrangler deploy`)

## Commands

```bash
bun run dev          # Start dev server (port 3000)
bun run build        # Production build
bun run serve        # Preview production build
bun run lint         # ESLint
bun run format       # Prettier
bun run check        # Format + lint fix
bun run check-types  # TypeScript type check (no emit)
bun run ts-lint      # Type check with watch mode
```

## Project Structure

```
app/routes/          # TanStack file-based routes (__root.tsx, index.tsx, create.tsx)
components/          # React components
components/ui/       # shadcn/ui primitives (Button, Dialog, Drawer, etc.)
stores/              # Zustand store + selectors
context/             # React Context providers (UI state, document state)
db/                  # Dexie IndexedDB setup and CRUD operations
hooks/               # Custom React hooks
utils/               # Utility functions
consts/              # Constants (currencies, events)
types/               # TypeScript type definitions
styles/              # Global CSS (Tailwind theme, fonts)
lib/                 # Helper utilities (cn() classname merger)
```

## Code Conventions

### Imports

- **Absolute imports only** — no relative imports (enforced by ESLint). Uses tsconfig `baseUrl: "."`.
- Use `import type { X }` for type-only imports (enforced).

### Naming

- Components: `PascalCase` (e.g., `InvoiceEditor`)
- Hooks: `use*` prefix (e.g., `useInvoiceStore`)
- Utilities: `camelCase` (e.g., `calculateInvoiceTotals`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_FONT_COLOUR`)
- Types: `PascalCase` (e.g., `InvoiceTemplate`, `TextSettings`)
- Zustand selectors: `use*Slice` / `use*Settings` (e.g., `useTitleSlice`, `useTableSettingsSlice`)
- Unused variables: prefix with `_`

### Formatting (Prettier)

- 2-space indentation, 80-char print width
- Double quotes, semicolons, no trailing commas
- Tailwind class sorting via prettier-plugin-tailwindcss

### Components

- Functional components with hooks only
- Props destructured at definition with type annotations
- Use `cn()` from `lib/utils` to merge Tailwind classes
- Use CVA (class-variance-authority) for component variants

## State Management Patterns

### Zustand Store (invoice data)

- Single store in `stores/invoice-store.ts` with Immer + subscribeWithSelector
- Write mutable-looking code inside `set()` — Immer handles immutability
- Use `applyUpdater<T>()` helper for value-or-function updaters
- Auto-recalculate totals via `recalculate()` when items/tax/fees/discounts change

### Selectors (performance)

- Define sliced selectors in `stores/invoice-selectors.ts`
- Always use `useShallow()` for shallow equality to prevent unnecessary re-renders
- Subscribe only to the state slice a component needs

### Context (UI state)

- `UIProvider` — active settings tab, canvas lock
- `InvoiceDocumentProvider` — current document ID/name, save/load operations

## Key Architecture Decisions

- **No backend** — all persistence is IndexedDB via Dexie
- **React Compiler enabled** — automatic memoization; avoid manual useMemo/useCallback unless necessary
- **Dynamic imports** for heavy components (e.g., PDFViewer) to reduce initial bundle
- **No barrel exports** — import directly from the source file
- **date-fns** for dates (not dayjs or moment)
- **lodash-es** for utilities (tree-shakeable ES module version)
