---
version: alpha
name: billsend
description: >-
  Design system for billsend, a free, local-first invoice generator that runs
  entirely in the browser. The UI is a compact, document-grade editor: neutral
  grayscale surfaces, a single blue-violet brand accent, and tight geometry that
  reads like a precise tool rather than a marketing site.
colors:
  background: oklch(1 0 0)
  foreground: oklch(0.145 0 0)
  card: oklch(1 0 0)
  cardForeground: oklch(0.145 0 0)
  popover: oklch(1 0 0)
  popoverForeground: oklch(0.145 0 0)
  primary: oklch(0.205 0 0)
  primaryForeground: oklch(0.985 0 0)
  secondary: oklch(0.97 0 0)
  secondaryForeground: oklch(0.205 0 0)
  muted: oklch(0.97 0 0)
  mutedForeground: oklch(0.556 0 0)
  accent: oklch(0.97 0 0)
  accentForeground: oklch(0.205 0 0)
  destructive: oklch(0.577 0.245 27.325)
  success: oklch(0.627 0.155 149.21)
  successForeground: oklch(0.985 0 0)
  warning: oklch(0.745 0.153 74.2)
  warningForeground: oklch(0.205 0 0)
  border: oklch(0.922 0 0)
  input: oklch(0.922 0 0)
  ring: "{colors.brand500}"
  brand50: oklch(0.957 0.02 277)
  brand100: oklch(0.925 0.036 273.72)
  brand200: oklch(0.839 0.079 271.26)
  brand300: oklch(0.762 0.121 268.88)
  brand400: oklch(0.677 0.17 263.89)
  brand500: oklch(0.603 0.218 257.42)
  brand600: oklch(0.505 0.183 257.47)
  brand700: oklch(0.419 0.152 257.57)
  brand800: oklch(0.322 0.117 257.5)
  brand900: oklch(0.235 0.085 257.39)
  brand950: oklch(0.18 0.064 257.25)
  brandGradientTop: oklch(0.677 0.17 263.89)
  brandGradientBottom: oklch(0.419 0.152 257.57)
typography:
  heading:
    fontFamily: '"Inter Variable", sans-serif'
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em
  body:
    fontFamily: '"Geist Variable", sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: '"Inter Variable", sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: '"Geist Mono Variable", monospace'
    fontSize: 13px
    letterSpacing: -0.04em
rounded:
  none: 0px
  surface: 3px
  control: 4px
  sm: 0.3rem
  md: 0.4rem
  lg: 0.5rem
  xl: 0.7rem
spacing:
  px: 1px
  0.5: 2px
  1: 4px
  1.5: 6px
  2: 8px
  2.5: 10px
  3: 12px
  4: 16px
  6: 24px
components:
  button:
    backgroundColor: "{colors.brand500}"
    textColor: "{colors.primaryForeground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: 32px
    padding: 0 10px
  buttonOutline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    height: 32px
  buttonGhost:
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
  buttonDestructive:
    backgroundColor: oklch(0.577 0.245 27.325 / 0.1)
    textColor: "{colors.destructive}"
    rounded: "{rounded.control}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    height: 32px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.cardForeground}"
    rounded: "{rounded.surface}"
  dialog:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popoverForeground}"
    rounded: "{rounded.surface}"
  badge:
    backgroundColor: "{colors.brand50}"
    textColor: "{colors.brand700}"
    rounded: "{rounded.surface}"
---

## Overview

billsend is a local-first invoice generator: no accounts, no servers, no
tracking, all data in the browser's IndexedDB. The interface should feel like a
precise, trustworthy document tool, closer to a spreadsheet or a design canvas
than to a consumer landing page.

The visual language is deliberately quiet so the invoice being edited is the
loudest thing on screen:

- **Neutral first.** Surfaces are achromatic (pure OKLCH grays). Colour is
  reserved for the brand accent and for status (destructive, success, warning).
- **One accent.** A single blue-violet brand ramp (`brand-50` through
  `brand-950`) carries all emphasis: primary buttons, focus rings, selection
  states, and marketing highlights. Never introduce a second hue as an accent.
- **Tight geometry.** Radii are small (3px surfaces, 4px controls) and controls
  are compact (32px default height). This reads as exacting and utilitarian,
  matching the document-editing job.
- **Full light/dark parity.** Every token has a `.dark` counterpart; nothing is
  hard-coded to a single scheme.

The one place the system loosens up is the marketing homepage, which layers soft
animated gradient "blobs", float/drift motion, and larger display type over the
same token base to feel welcoming before dropping the user into the tool.

## Colors

Colours are defined in OKLCH and split into a semantic layer (roles) and a brand
ramp (raw scale). Components reference roles, not raw grays.

Semantic roles (both light and dark values are defined for every role):

| Role | Light | Use |
| --- | --- | --- |
| `background` / `foreground` | white / near-black | Page canvas and default text |
| `card` / `popover` | white | Raised surfaces, menus, dialogs |
| `primary` | near-black | Neutral solid emphasis (non-brand) |
| `secondary` / `muted` / `accent` | `oklch(0.97 0 0)` | Subtle fills, hover states, disabled |
| `muted-foreground` | `oklch(0.556 0 0)` | Secondary and caption text |
| `border` / `input` | `oklch(0.922 0 0)` | Hairlines and field outlines |
| `destructive` | `oklch(0.577 0.245 27.325)` | Delete and danger, tinted (10 to 20% fill), never a loud solid |
| `success` | `oklch(0.627 0.155 149.21)` | Positive status (paid, confirmed) |
| `warning` | `oklch(0.745 0.153 74.2)` | Cautionary status (overdue, draft) |
| `ring` | `brand-500` (light), `brand-400` (dark) | Focus outline |

Brand ramp: a blue-violet family (`brand-50` through `brand-950`) with a
signature vertical gradient (`brand-top` to `brand-bottom`, i.e. `brand-400` to
`brand-700`) used on hero elements and the logo mark. Common pairings:

- Primary button: `brand-500` background, `primary-foreground` text, hover
  `brand-500/90`.
- Badge / callout chip: `brand-50` background, `brand-200` border, `brand-700`
  text.
- Icon tile: `brand-600` solid, white glyph.

## Typography

Two families do the work, chosen from a larger font library:

- **Inter Variable** (`--font-sans`, also `--font-heading`): the UI face for
  headings, labels, buttons, and dense chrome. Slightly tightened tracking on
  headings (`-0.01em`).
- **Geist Variable** (`--font-geist`): the `body` default set on `<body>`, with a
  system-font fallback stack.

Weights map to a fixed scale: Regular 400, Medium 500, Semibold 600, Bold 700.
UI labels and buttons are Medium; headings are Semibold. Text sizes come from the
Tailwind scale (`text-xs` through `text-2xl`); avoid arbitrary `text-[Nrem]`
values in feature code.

Separately, billsend ships an invoice font library (`consts/invoice-fonts.ts`)
that is a user-facing product feature, not app chrome. Users pick from sans-serif
(Geist, Inter, DM Sans, IBM Plex Sans, Bricolage Grotesque), serif (Lora, Libre
Baskerville, Playfair Display), and monospace (Geist Mono, JetBrains Mono, IBM
Plex Mono) faces for the rendered invoice. Monospace faces get tighter tracking
(`-0.04em`). Keep this library independent from the app's own type tokens.

## Layout

- **Spacing** follows the Tailwind 4px scale (`1` = 4px). Dense chrome favours
  `1` to `3` (4 to 12px); section rhythm uses `4` and `6` (16 and 24px).
- **Dividers use gaps, never borders-between.** Hairline separations are built
  with `gap-px` on a `bg-border` parent, with each child carrying its own
  background. This is a hard project rule: no `space-y-*`, `space-x-*`,
  `divide-x`, or `divide-y`. Stack with `flex flex-col gap-N`, rows with
  `flex items-center gap-N`, matrices with `grid gap-N`.
- **Controls are compact.** Default control height is 32px (`h-8`); a size ramp
  runs `xs` (24px), `sm` (28px), `default` (32px), `lg` (36px), plus square icon
  variants at matching sizes.
- **Print is a first-class target.** `@page` is A4 with 16mm margins;
  `.invoice-page` forces page breaks, `.avoid-break` prevents mid-block splits,
  `.no-print` hides chrome, and print colour-adjust is forced `exact`.

## Elevation & Depth

Depth is minimal and cool-neutral, never heavy. Elevation is tokenised so
layers stay consistent:

- `shadow-menu` (`--shadow-menu`): menus, popovers, dropdowns, selects, context
  menus, and dialogs. The standard "floating chrome" shadow.
- `shadow-floating` (`--shadow-floating`): larger lifted surfaces such as the
  marketing hero cards.
- Inset treatments (`shadow-[inset_...]`) mark pressed and selected wells.
- Prefer a `border` hairline over a shadow to separate flat, in-flow surfaces;
  reserve shadows for genuinely floating layers.
- Pressed feedback on buttons is a 1px downward nudge (`active:translate-y-px`),
  not a shadow change.

## Shapes

Geometry is intentionally tight, which is what gives the tool its exacting feel.
The two everyday radii are named tokens, not arbitrary values:

- `rounded-surface` (`--radius-surface`, 3px): the dominant radius for cards,
  panels, chips, icon tiles, dialogs, menus, and previews.
- `rounded-control` (`--radius-control`, 4px): buttons and inputs.
- A derived scale (`rounded-sm` through `rounded-4xl`, based on
  `--radius: 0.5rem`) is available for larger surfaces that need softer corners.
- Focus is a 1px ring in the brand hue (`ring-ring`), not a glow.

Keep new components on the `surface` / `control` tokens unless there is a reason
to reach for the softer derived scale.

## Components

Primitives are shadcn/ui (new-york) over Radix / Base UI, themed with CVA. Import
directly from `components/ui/*` (no barrel exports).

**Button** (`components/ui/button.tsx`): `rounded-control`, `font-medium`,
`transition-all`, 1px active nudge, `focus-visible:ring-1 ring-ring`. Variants:

- `default`: `bg-brand-500` and `primary-foreground`, hover `/90`. The primary CTA.
- `outline`: `border-border`, `bg-background`, hover `bg-muted`.
- `secondary`: `bg-secondary`, hover mixes 5% foreground.
- `ghost`: transparent, hover `bg-muted`.
- `destructive`: tinted `destructive/10` fill and `destructive` text (never a
  loud solid red), hover `/20`.
- `link`: text and underline on hover.

**Input / Textarea**: 32px height, `rounded-control`, `border-input`,
`bg-background`, brand focus ring, `aria-invalid` swaps border to destructive.

**Dialog / Drawer / Popover / Dropdown / Context menu / Menubar / Select**:
`popover` or `card` surface, `shadow-menu`, `rounded-surface`. Dialogs use a
standardised footer button row. On mobile, drawers replace dialogs.

**Table** (`components/tables/*`): dense rows; selected rows tint `bg-brand-500`
and `primary-foreground`. Row groups separated by `gap-px`, not `divide-y`.

**Badge / callout chip**: `brand-50` fill, `brand-200` border, `brand-700` text,
`rounded-surface`; the standard "highlight" pill.

Build variants with CVA and `cn()` from `~/lib/utils`; destructure props with
type annotations at the signature.

## Do's and Don'ts

**Do**

- Reference semantic roles (`bg-background`, `text-muted-foreground`,
  `border-border`) so light/dark and future retheming just work.
- Keep the single blue-violet brand accent; use the ramp for every emphasis, and
  the `success` / `warning` roles for status.
- Separate stacked and adjacent surfaces with `flex` or `grid` plus `gap-*` (use
  `gap-px` on a coloured parent for hairlines).
- Stay on the `rounded-surface` / `rounded-control` tokens and 32px control
  height for chrome.
- Reach for `shadow-menu` and `shadow-floating` rather than picking raw shadow
  utilities per component.
- Tint destructive actions; reserve solid saturated fills for the brand CTA.
- Keep the invoice font library separate from app-chrome typography.

**Don't**

- Don't use `space-y-*`, `space-x-*`, `divide-x`, or `divide-y` (breaks with
  conditional and fragment children; owner-controlled `gap` is the rule).
- Don't hard-code hex or raw `neutral-*` grays in app chrome; use the OKLCH role
  tokens so dark mode works.
- Don't introduce a second accent hue.
- Don't reach for heavy or black shadows; prefer a hairline border, and keep any
  shadow soft and neutral.
- Don't use the non-null assertion (`!`) or single-letter callback params in the
  code that ships these components (project TypeScript rules).
