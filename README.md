# billsend

A free, local-first invoice generator that runs entirely in your browser. Create professional invoices with fully customisable templates. No account needed, no servers, no tracking. Your data never leaves your device.

**Live app:** [billsend.io](https://billsend.io)

## Features

- Create invoices with line items, tax, fees, discounts, and terms
- Customise templates — colours, fonts, spacing, and layout
- Save and load invoice documents locally in IndexedDB
- Reusable templates for repeat work
- Upload a logo and set an accent colour
- Any currency, with custom symbols when you need them
- Export to PDF in one click
- Import and export all data (invoices, templates, images) as a backup
- Works offline — no network required after the first load
- No sign-up, no accounts, no tracking

## Tech Stack

- **React 19** with the React Compiler
- **TanStack Start** and **TanStack Router** — app framework and routing
- **Vite 8** — build tooling
- **TypeScript** — strict mode
- **Zustand** + **Immer** — invoice state
- **Dexie** — IndexedDB persistence
- **React Hook Form** + **Zod** — forms and validation
- **@react-pdf/renderer** — PDF export
- **Tailwind CSS 4** + **shadcn/ui** + **Base UI** — styling and components
- **Tabler Icons** — icon set
- **Sonner** — toast notifications

## Getting Started

Requires [Bun](https://bun.sh).

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
bun run test         # Run tests (Vitest)
bun run lint         # ESLint
bun run format       # Prettier
bun run check        # Format + lint fix
bun run check-types  # TypeScript (no emit)
bun run ts-lint      # Type check (watch)
```

## Project Structure

```
app/routes/          # TanStack file-based routes
components/          # React components
components/ui/       # shadcn/ui primitives
stores/              # Zustand store and selectors
context/             # React Context providers
db/                  # Dexie IndexedDB setup and CRUD
hooks/               # Custom React hooks
utils/               # Utility functions
consts/              # Constants (currencies, fonts, events)
types/               # TypeScript type definitions
styles/              # Global CSS (Tailwind theme, fonts)
lib/                 # Helper utilities (cn() classname merger)
```

## Deployment

Deployed to Cloudflare Workers. Run `bun run deploy` to build and deploy via Wrangler. Configure targets in `wrangler.jsonc`.
