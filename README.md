# billsend

A free, local-first invoice generator that runs entirely in your browser. Create professional invoices with fully customisable templates—no account needed, no servers, no tracking. Your data never leaves your device.

## Features

- 📝 Create invoices with line items, pricing, and terms
- 🎨 Fully customisable templates (colours, fonts, spacing, layouts)
- 💾 Save and load invoice templates
- 📄 Export to PDF
- 🔒 100% local storage using IndexedDB (Dexie)
- ⚡ Lightning fast—everything runs in your browser
- 🎯 No sign-up required, no accounts, no tracking

## Tech Stack

- **React** - UI framework
- **TanStack Start** - Full-stack React framework
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Data fetching and caching
- **Jotai** - State management
- **Dexie** - IndexedDB wrapper for local storage
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **@react-pdf/renderer** - PDF generation
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Vite** - Build tooling
- **Turbo** - Monorepo tooling

## Getting Started

```bash
# Install dependencies
bun install

# Start development server
bun dev
```

The app will be available at `http://localhost:3000`.

## Development

```bash
# Run development server
bun dev

# Build for production
bun build

# Type check
bun ts-lint
```
