# BillSend

A free, local-first invoice generator that runs entirely in your browser. Create professional invoices with fully customisable templates. No account needed, no servers, no tracking. Your data never leaves your device.

## Features

- Create invoices with line items, pricing, and terms
- Fully customisable templates (colours, fonts, spacing, layouts)
- Save and load invoice documents locally
- Export to PDF
- 100% local storage using IndexedDB (Dexie)
- Fast, offline-capable; everything runs in your browser
- No sign-up required, no accounts, no tracking

## Tech Stack

- **React 19**: UI
- **TanStack Start**: app framework (with TanStack Router)
- **Vite 8**: build (React Compiler enabled)
- **TypeScript**: strict mode
- **Zustand**: invoice state (Immer)
- **Dexie**: IndexedDB persistence
- **React Hook Form** + **Zod**: forms and validation
- **@react-pdf/renderer**: PDF export
- **Tailwind CSS 4** + **shadcn/ui**: styling and components

## Getting Started

```bash
bun install
bun run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Development

```bash
bun run dev          # Dev server (port 3000)
bun run build        # Production build
bun run serve        # Preview production build
bun run lint         # ESLint
bun run format       # Prettier
bun run check        # Format + lint fix
bun run check-types  # TypeScript (no emit)
bun run ts-lint      # Type check (watch)
```

## Deployment

Use `bun run deploy` (build + `wrangler deploy`). Configure targets in `wrangler.jsonc`.
