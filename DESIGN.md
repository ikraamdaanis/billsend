---
version: alpha
name: billsend
description: >-
  Design system for billsend, a free, local-first invoice generator that runs
  entirely in the browser. The editor is a compact, document-grade tool:
  neutral grayscale chrome, a single blue-violet brand accent, white paper on a
  grey desk, and tight geometry that reads like a precise instrument. The
  marketing homepage speaks the same accent in an editorial serif voice.
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
  ring: oklch(0.603 0.218 257.42)
  paper: oklch(1 0 0)
  paperForeground: oklch(0.21 0.006 285.885)
  paperMuted: oklch(0.967 0.001 286.375)
  paperMutedForeground: oklch(0.5 0.016 286)
  paperBorder: oklch(0.871 0.006 286.286)
  desk: oklch(0.92 0.004 286.32)
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
  homepageCanvas: oklch(0.985 0 0)
  homepageWash: oklch(0.97 0 0)
  homepageInk: oklch(0.205 0 0)
  homepageStrong: oklch(0.371 0 0)
  homepageBody: oklch(0.439 0 0)
  homepageMuted: oklch(0.556 0 0)
  homepageHairline: oklch(0.922 0 0)
  pdfMuted: "#6b7280"
  pdfMutedZinc: "#71717a"
  themeColor: "#005fca"
typography:
  display:
    fontFamily: '"Instrument Serif", serif'
    fontSize: 6rem
    fontWeight: 400
    lineHeight: 0.95
    letterSpacing: -0.01em
  headline:
    fontFamily: '"Instrument Serif", serif'
    fontSize: 3.75rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: -0.01em
  wordmark:
    fontFamily: '"Bricolage Grotesque Variable", sans-serif'
    fontSize: 20px
    fontWeight: 600
    letterSpacing: -0.025em
  body:
    fontFamily: '"Geist Variable", sans-serif'
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
  lead:
    fontFamily: '"Geist Variable", sans-serif'
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
  title:
    fontFamily: '"Geist Variable", sans-serif'
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: '"Geist Variable", sans-serif'
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: '"Geist Variable", sans-serif'
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: 0px
  surface: 3px
  control: 4px
  sm: 4px
  md: 6px
  lg: 0.5rem
  xl: 12px
  full: 9999px
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
  8: 32px
  coarseTarget: 44px
components:
  button:
    backgroundColor: "{colors.brand600}"
    textColor: "{colors.primaryForeground}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    height: 32px
    padding: 0 10px
  buttonHover:
    backgroundColor: "{colors.brand700}"
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
    backgroundColor: transparent
    textColor: "{colors.foreground}"
    rounded: "{rounded.surface}"
    height: 32px
  invoiceField:
    backgroundColor: transparent
    textColor: "{colors.paperForeground}"
    rounded: "{rounded.surface}"
  invoiceFieldFocus:
    backgroundColor: "{colors.brand50}"
    textColor: "{colors.paperForeground}"
    padding: 4px 8px
  invoicePage:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paperForeground}"
    padding: 40pt
    width: 210mm
    height: 297mm
  zoomControl:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: 2px
  tableRowSelected:
    backgroundColor: "{colors.brand600}"
    textColor: "{colors.primaryForeground}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.cardForeground}"
    rounded: "{rounded.surface}"
  dialog:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popoverForeground}"
    rounded: "{rounded.sm}"
  badge:
    backgroundColor: "{colors.brand50}"
    textColor: "{colors.brand700}"
    rounded: "{rounded.surface}"
  homepageCtaSm:
    backgroundColor: "{colors.brand600}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.full}"
    height: 36px
    padding: 0 6px 0 16px
  homepageCta:
    backgroundColor: "{colors.brand600}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.full}"
    height: 48px
    padding: 0 6px 0 24px
  homepageCtaLg:
    backgroundColor: "{colors.brand600}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.full}"
    height: 56px
    padding: 0 8px 0 32px
  homepageCtaHover:
    backgroundColor: "{colors.brand700}"
  homepageSheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.homepageInk}"
    rounded: "{rounded.surface}"
    padding: 32px
  tourMarker:
    backgroundColor: "{colors.brand600}"
    textColor: "{colors.primaryForeground}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    size: 20px
  requestTally:
    backgroundColor: "{colors.homepageWash}"
    textColor: "{colors.homepageInk}"
    height: 144px
    padding: 20px 32px
  tourCallout:
    backgroundColor: "{colors.brand50}"
    textColor: "{colors.brand950}"
    typography: "{typography.body}"
    rounded: "{rounded.surface}"
    padding: 10px 12px
  logoMark:
    backgroundColor: "{colors.homepageInk}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.surface}"
    size: 48px
  fontSegmentActive:
    backgroundColor: "{colors.homepageInk}"
    textColor: "{colors.primaryForeground}"
    rounded: "{rounded.full}"
    height: 32px
  skipLink:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.homepageInk}"
    rounded: "{rounded.full}"
    padding: 8px 16px
---

# Design System: billsend

## Overview

**Creative North Star: "The Precise Paper Desk"**

billsend is a local-first invoice generator: no accounts, no servers, no
tracking, all data in the browser's IndexedDB. The interface should feel like a
precise, trustworthy document tool, closer to a spreadsheet or a design canvas
than to a consumer landing page. The invoice being edited is the loudest thing
on screen: a sheet of white A4 paper lying on a grey desk, surrounded by quiet
chrome.

The visual language is deliberately quiet around that sheet. Chrome is
achromatic, the brand accent is a single blue-violet ramp, radii are small, and
controls are compact. The paper itself never changes with the app theme,
because it is a preview of the PDF that gets downloaded.

The marketing homepage is the one place the system raises its voice. It keeps
the same brand ramp and the same paper metaphor but speaks in an editorial
register: large upright Instrument Serif headings, one pill-shaped primary
action, and white sheets of paper (a faithful miniature invoice, a privacy
checklist, and an annotated tour invoice) lying on a light neutral canvas. Its
motion is a single authored moment on load, not scroll choreography.

**Key Characteristics:**

- Neutral chrome; colour is reserved for the brand accent and for status.
- One accent: the blue-violet `brand` ramp carries every emphasis.
- White paper on a grey desk: the invoice page previews the PDF exactly.
- Tight geometry: 3px surfaces, 4px controls, 32px default control height.
- Editorial homepage: upright serif display, one pill CTA, paper sheets, one motion moment.
- Light only in practice: `.dark` tokens exist but nothing enables them yet.

## Colors

Colours are defined in OKLCH and split into a semantic layer (roles), a paper
layer (the invoice sheet), and a brand ramp (raw scale). App chrome references
roles; the invoice page references paper tokens; emphasis references the ramp.

### Primary

- **Signal Blue** (`brand-600`): the solid accent. Primary buttons, selected
  table rows, the homepage Create invoice pill, the wordmark, the coloured
  second line of the hero headline ("Your data stays put."), the hero chip's
  lock icon, the numbered tour markers, and the homepage focus outline. White text on it passes WCAG AA; this is why solid fills sit on
  600, not 500. Hover deepens to `brand-700`.
- **Focus Blue** (`brand-500`): the app focus ring (`--ring`), the invoice
  field focus border, and table focus outlines. Never used as a solid fill under
  white text (3.85:1 fails AA).
- **Link Blue** (`brand-700`): inline text links on the homepage, underlined in
  `brand-200` that deepens to `brand-700` on hover. Also badge text.
- **Brand Wash** (`brand-50`): the hover and focus fill for editable invoice
  fields, badge fills, and the tour's phone callouts. Pairs with `brand-200`
  borders and `brand-700` text (or `brand-950` text in the tour callouts).
  `brand-100` is the homepage text selection colour, with `brand-950` selected
  text.
- The full ramp runs `brand-50` through `brand-950`; `brand-400` is the dark
  mode ring.

`--brand-top`, `--brand-bottom`, their `-hover` variants, and `--brand-gradient`
are still declared in `globals.css`, but nothing in the app references them.
They are not part of the working palette; do not treat the gradient as a
signature.

### Neutral

App chrome (semantic roles, from `:root`):

| Role | Value | Use |
| --- | --- | --- |
| `background` / `foreground` | white / near-black | Chrome surfaces and default text |
| `card` / `popover` | white | Raised surfaces, menus, dialogs |
| `primary` | near-black | Neutral solid emphasis (non-brand), link text |
| `secondary` / `muted` / `accent` | `oklch(0.97 0 0)` | Subtle fills, hover states, dialog footers |
| `muted-foreground` | `oklch(0.556 0 0)` | Secondary and caption text in chrome |
| `border` / `input` | `oklch(0.922 0 0)` | Hairlines and field outlines |

Paper (the invoice sheet; see the Paper Rule):

- **Paper** (`paper`, white): the A4 page surface.
- **Ink** (`paper-foreground`, a cool near-black): all invoice text.
- **Paper Wash** (`paper-muted`): empty logo slot and quiet fills on the page.
- **Pencil** (`paper-muted-foreground`, about 6:1 on paper): placeholders,
  field labels, and inactive toggles on the page.
- **Paper Edge** (`paper-border`): the hairline around the sheet.
- **Desk** (`desk`): the cool grey backdrop the sheet lies on in the editor.

Homepage neutrals are raw Tailwind `neutral-*` greys, not role tokens, because
the homepage is light-only and has no dark sections: `neutral-50` canvas,
white sheets, `neutral-900` ink, the active font segment, the shared logo
mark, and the third-party request count, `neutral-700` chip text and the tally
caption, `neutral-600` body copy, labels, hints, nav, and footer text,
`neutral-500` invoice field labels, the question icons, and the billsend
request count, `neutral-300` the secondary link's hairline, `neutral-200`
hairlines, `neutral-100` table header rows, the request tally band, and segment
hover.

PDF palette: react-pdf cannot read CSS variables, so the renderer uses literal
hex. `#6b7280` (`pdfMuted`) is the muted label grey in the details, terms, and
text sections; `#71717a` (`pdfMutedZinc`) is the label grey in payment details.
These are intentional PDF palette entries, not drift.

Browser chrome: the `theme-color` meta is `#005fca`, the hex of `brand-600`.

### Status

- **Destructive** (`oklch(0.577 0.245 27.325)`): delete and danger, always as a
  tint (10 to 20% fill with destructive text), never a loud solid.
- **Success** (`oklch(0.627 0.155 149.21)`): positive status; on the homepage,
  the live dot beside the request tally.
- **Warning** (`oklch(0.745 0.153 74.2)`): cautionary status; on the homepage,
  the alert icon on the blocked-storage note (the text itself stays
  `neutral-600`).

### Named Rules

**The One Voice Rule.** The blue-violet `brand` ramp is the only accent. Never
introduce a second hue for emphasis; status colours are for status only.

**The 600 Fill Rule.** Solid brand fills under white text are `brand-600` or
darker. `brand-500` is for rings and borders.

**The Paper Rule.** The invoice page is white paper with dark ink in every app
theme, because it previews the printed PDF. Anything drawn on the page uses
`paper-*` tokens (or the brand wash for edit affordances), never chrome roles
or raw Tailwind greys or blues.

**The Dark Mode Honesty Rule.** `.dark` values exist for every chrome role, but
no route sets the `dark` class today. Use role tokens so dark mode stays
possible; do not claim or test light/dark parity until something enables it.

## Typography

**Display Font:** Instrument Serif (with serif), homepage only, upright
**Body Font:** Geist Variable (with the system UI stack)
**Wordmark Font:** Bricolage Grotesque Variable

**Character:** the editor speaks in one even, neutral sans so the invoice's own
font can lead; the homepage pairs a high-contrast editorial serif for headings
with the same plain sans for everything else.

Geist is set on `<body>` and is what every piece of app chrome renders in.
Inter Variable is wired as `--font-sans` / `--font-heading` on `<html>`, but
no element opts into it, so it does not render in the UI; it remains available
in the invoice font library. Homepage chrome that sits inside a styled example
sheet (tour markers, the shared logo mark, the tour callouts) sets
`font-geist` explicitly to escape the sheet's invoice font.

### Hierarchy

- **Display** (Instrument Serif 400, 48px, 72px from `sm`, 96px from `xl`;
  0.95 line height, -0.01em tracking): the homepage hero headline only, set as
  two masked lines.
- **Headline** (Instrument Serif 400, -0.01em tracking, balanced wrap):
  homepage section and closing headings (36px to 60px) and tour note titles
  (30px, tight leading).
- **Lead** (Geist 400, 18px, capped at 42ch to 56ch, `neutral-600`): the
  paragraph under a homepage headline.
- **Title** (Geist 500, 16px): the document name in the editor toolbar, check
  titles, and question summaries on the homepage; Geist 600 at 20px heads the
  privacy sheet; Geist 500 at 14px heads the privacy caveat.
- **Figure** (Geist 600, 36px, tight tracking, tabular): the live request
  counts on the privacy sheet.
- **Body** (Geist 400, 14px in chrome; 16px for homepage notes and answers):
  chrome text and homepage copy.
- **Label** (Geist 500, 14px; 12px in `xs` controls): buttons, menu triggers,
  table headers; homepage nav and footer links at 400.

Weights map to a fixed scale: Regular 400, Medium 500, Semibold 600, Bold 700.
UI labels and buttons are Medium. Text sizes come from the Tailwind scale; avoid
arbitrary `text-[Nrem]` values in feature code. Numbers use tabular figures.
Homepage copy uses typographic (curly) apostrophes.

Separately, billsend ships an invoice font library (`consts/invoice-fonts.ts`)
that is a user-facing product feature, not app chrome. Users pick from ten
sans-serif, serif, and monospace faces at three sizes for the rendered invoice;
the canvas applies the chosen family and tracking to the paper. The homepage
preview borrows three of these faces through `getInvoiceFontDefinition`, so it
shows real output, and the tour sheet is set in Lora. Keep this library
independent from the app's own type tokens.

### Named Rules

**The Upright Display Rule.** Homepage display type is upright Instrument
Serif. Emphasis is by colour only (`brand-600`, as on "Your data stays put."),
never italic and never outlined or stroked.

**The One Heading Recipe Rule.** Every Instrument Serif heading on the homepage
(the h1, each h2, each tour note h3) uses the shared `DISPLAY_HEADING` class
string (serif, 400, -0.01em tracking, balanced wrap, `neutral-900`) and adds
only size and leading.

**The Serif Stays Home Rule.** Instrument Serif is preloaded only by the
homepage route and appears only there. The editor and dialogs never use it.

## Layout

- **Spacing** follows the Tailwind 4px scale (`1` = 4px). Dense chrome favours
  `1` to `3` (4 to 12px); section rhythm uses `4` to `8` (16 to 32px).
- **Dividers use gaps, never borders-between.** Hairline separations are built
  with `gap-px` on a `bg-border` parent, with each child carrying its own
  background, or with a `border-t` owned by each item. This is a hard project
  rule: no `space-y-*`, `space-x-*`, `divide-x`, or `divide-y`. Stack with
  `flex flex-col gap-N`, rows with `flex items-center gap-N`, matrices with
  `grid gap-N`.
- **Controls are compact.** Default control height is 32px (`h-8`); a size ramp
  runs `xs` (24px), `sm` (28px), `default` (32px), `lg` (36px), plus square icon
  variants at matching sizes.
- **Touch gets 44px.** Coarse pointers enlarge the targets that matter through
  `pointer-coarse:` variants: toolbar logo, download button, zoom buttons, the
  homepage header CTA, and homepage footer and check links (40px at rest) reach
  44px; menubar triggers and font segments grow to 32 to 40px. Fine pointers
  keep the compact sizes.
- **Editor frame.** A 64px toolbar sits above a full-height desk. The desk
  centres the page with 12px padding on phones and 32px from `md` up, plus
  80px bottom padding so the zoom control never covers the page foot.
- **The page is viewport-independent.** The A4 sheet is fixed at 210mm by at
  least 297mm with 40pt padding, and nothing inside it uses responsive
  breakpoints, so what you see on screen matches the PDF. Small screens scale
  the whole sheet with zoom; they never reflow it.
- **Zoom.** Presets run 50% to 175%, plus Fit. Below 768px the editor opens at
  Fit so the whole invoice is visible; wider screens open at 100%.
- **Homepage.** Content sits in a `max-w-6xl` (72rem) column with 24px side
  padding. Order: header, hero, privacy, tour (`#features`), questions,
  closing, footer. Sections breathe at 80px vertical padding (96px from `sm`)
  and are separated by `neutral-200` hairlines; the closing hairline sits
  inside the content column, aligned with every other section. From `lg` the
  hero splits 1.2fr / 0.8fr (copy, then the preview sheet); privacy and
  questions split 0.9fr / 1.1fr (heading column, then sheet or accordion); the
  tour sets its sheet beside its notes. Privacy uses two rows: intro top left,
  caveat bottom left, the sheet spanning both on the right; source order is
  intro, sheet, caveat, so on phones the proof comes before the warning.
  Everything stacks to one column below `lg`.
- **No layout shift on hydration.** JavaScript-only content renders a
  same-height plain-text stand-in before hydration (the font row reserves
  72px, the request tally 144px), and late-resolving alternatives share one
  grid cell and crossfade (the hero's secondary links), so nothing moves when
  they arrive.
- **Print is a first-class target.** `@page` is A4 with 16mm margins;
  `.invoice-page` forces page breaks, `.avoid-break` prevents mid-block splits,
  `.no-print` hides chrome, and print colour-adjust is forced `exact`.

## Elevation & Depth

Depth is minimal and cool-neutral, never heavy. Flat in-flow surfaces separate
with a hairline border; shadows are reserved for things that genuinely float.

### Shadow Vocabulary

- **Menu** (`--shadow-menu`: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px
  rgb(0 0 0 / 0.1)`): menus, popovers, dropdowns, selects, context menus, the
  logo popover, the floating zoom control, the homepage hero chip, and the
  homepage skip link. The standard floating chrome shadow.
- **Floating** (`--shadow-floating`: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px
  10px -6px rgb(0 0 0 / 0.1)`): the three homepage sheets (hero preview,
  privacy checklist, tour invoice). None is tilted.
- **Paper lift** (Tailwind `shadow-md`): the A4 sheet resting on the desk.
  Removed in print.
- **Dialog ring**: dialogs float on a 1px `foreground/10` ring over a 50% black
  scrim rather than a drop shadow.
- Pressed feedback on buttons is a 1px downward nudge (`active:translate-y-px`),
  not a shadow change.

### Named Rules

**The Float-Only Shadow Rule.** A shadow means "this is above the page". In-flow
cards, rows, and panels get a hairline, not a shadow.

**The Homepage Sheet Rule.** On the homepage, lifted surfaces are sheets of
paper: white, `neutral-200` hairline, `rounded-surface`, `shadow-floating`,
upright. Everything else (tour notes, questions, the privacy caveat) sits flat
under a top hairline.

## Shapes

Geometry is intentionally tight, which is what gives the tool its exacting feel.
The two everyday radii are named tokens, not arbitrary values:

- **Surface** (`rounded-surface`, 3px): the dominant radius for cards, panels,
  inputs, invoice fields, chips, icon tiles, menus, menu items, previews, the
  homepage sheets, the shared logo mark, and the tour callouts.
- **Control** (`rounded-control`, 4px): buttons, the zoom control, and the
  focus area of homepage text links.
- **Dialog** (`rounded-sm`, 4px).
- **Pill / circle** (`rounded-full`): homepage only, for the Create invoice
  CTA, its circular arrow chip, the "Try a font" segmented control and its
  segments, the skip link, and the numbered tour markers.
- The derived scale (`rounded-md` and up, from `--radius: 0.5rem`) exists for
  larger surfaces that need softer corners but is rarely needed.

Keep new components on the `surface` / `control` tokens unless there is a reason
to reach for the softer derived scale.

## Components

Primitives are shadcn/ui (new-york) over Base UI, themed with CVA. Import
directly from `components/ui/*` (no barrel exports). Icons are Tabler
(`@tabler/icons-react`), 16px by default inside buttons. Lists keep native
`<ul>` / `<ol>` semantics without an explicit `role="list"` (project lint
rule); note that Safari VoiceOver may not announce `list-style: none` lists as
lists.

### Buttons

- **Shape:** gently squared (`rounded-control`, 4px), Medium 14px label,
  `transition-all`, 1px active nudge.
- **Primary (`default`):** `brand-600` fill, `primary-foreground` text, hover
  `brand-700`. The primary CTA in the app.
- **Hover / Focus:** `focus-visible:ring-1 ring-ring` (brand-500); disabled is
  50% opacity.
- **Outline:** `border` hairline on `background`, hover `muted`.
- **Secondary:** `secondary` fill, hover mixes 5% foreground.
- **Ghost:** transparent, hover `muted`. Used in the zoom control and toolbars.
- **Destructive:** tinted `destructive/10` fill with `destructive` text (never a
  loud solid red), hover `/20`.
- **Link:** `primary` text, underline on hover.

### Inputs / Fields

- **Style:** 32px height, `rounded-surface`, `border-input` hairline,
  transparent fill, `muted-foreground` placeholder.
- **Focus:** border shifts to `ring` (brand-500).
- **Error / Disabled:** `aria-invalid` swaps the border to destructive; disabled
  dims to 50%.

### Invoice Fields (signature)

Text and textarea fields drawn on the paper. At rest they are invisible: no
border, no fill, `paper-foreground` ink, `paper-muted-foreground` placeholders.
Hover lays a `brand-50` wash; focus keeps the wash, adds a `brand-500` border,
and opens 4px by 8px of padding so the edit affordance reads as a highlighted
patch of paper. No raw Tailwind blue.

### Invoice Page and Desk (signature)

The A4 sheet (`paper`, `paper-border` hairline, `shadow-md`, 40pt padding) is
centred on the `desk` backdrop and scaled as a whole by the zoom level. It takes
the user's chosen invoice font and tracking.

### Zoom Control (signature)

A floating group pinned 12px from the bottom-right of the desk: `background`
surface, `border` hairline, `rounded-control`, `shadow-menu`, 2px inner padding.
Ghost icon buttons for minus and plus, and a ghost percentage button between
them (tabular figures, min 56px wide) that toggles between Fit and 100% and
reports `aria-pressed` when fitted. All three grow to 44px on coarse pointers.

### Navigation

- **Editor toolbar:** 64px, `background` with a bottom `border` hairline. Logo
  tile (36px, 44px on touch) on the left, document title over a compact
  menubar, download button on the right. Menubar triggers are Medium 14px,
  `rounded-surface`, hover and open state `muted`.
- **Homepage skip link:** the first focusable element, "Skip to content", a
  white pill with `shadow-menu` fixed 12px from the top-left, held 64px above
  the viewport and slid into place on focus (transform transition), so it
  keeps its padding. Targets `<main id="main">`.
- **Homepage header:** sticky, 64px, `neutral-50` at 85% with backdrop blur and
  a `neutral-200` bottom hairline. A `brand-600` Bricolage wordmark on the
  left; centred 14px sans links (Privacy, Features, Questions) in
  `neutral-600`, hover `neutral-900`, with 12px by 10px hit areas, from `md`.
  On phones a single Privacy link sits on the right instead. The small Create
  invoice pill sits on the right too, but only while neither the hero pill nor
  the closing pill is on screen; otherwise it collapses to zero width,
  invisible, reserving no space (max-width and opacity animate over 200ms), so
  only one primary button is ever on screen.
- **Homepage footer:** a `<footer>` landmark outside `<main>` on the canvas,
  with a `neutral-200` top hairline: the `brand-600` wordmark, then "Report an
  issue", "Source on GitHub", and the copyright in 14px `neutral-600`. Links are
  at least 40px tall (44px on coarse pointers), open in a new tab, and say so
  with an sr-only "(opens in a new tab)".
- **Homepage focus:** links, pills, segments, and accordion summaries draw a
  2px `brand-600` outline offset 2px (4px on the pills and wordmark), not the
  app's 1px ring. Homepage colour transitions name only `color`,
  `background-color`, and `text-decoration-color`, never `transition-colors`,
  so the focus outline never fades in.
- **Editor entry points:** `/create` accepts two optional search params.
  `font` (any invoice font id) styles a fresh, untouched blank invoice and is
  then cleared; `open=invoices` opens the Open Invoice dialog through the
  unsaved-changes guard.

### Menus, Popovers, Dialogs

Menus, popovers, dropdowns, selects, and context menus: `popover` surface,
`rounded-surface`, 1px `foreground/10` ring, `shadow-menu`, items
`rounded-surface` with `accent` focus fill. Dialogs: `popover` surface,
`rounded-sm`, `foreground/10` ring over a black/50 scrim, max width 384px from
`sm`, and a footer row on `muted/50` with a top hairline, buttons right-aligned.

### Tables

`components/tables/*`: dense rows; selected rows fill `brand-600` with
`primary-foreground` text; keyboard focus draws a 2px inset `brand-500`
outline. Row groups separate with `gap-px`, not `divide-y`.

### Badges / Callouts

`brand-50` fill, `brand-200` border, `brand-700` text, `rounded-surface`; the
standard highlight chip in the app.

### Create Invoice Pill (signature)

The homepage's one primary action, a single component, always labelled "Create
invoice". A `brand-600` pill (`rounded-full`), white Medium label, and a white
circular chip on the right holding a `brand-600` arrow. Hover deepens the fill
to `brand-700` and nudges the chip 2px right (300ms ease-out). Three sizes:
`sm` (36px, 44px on coarse pointers; header), `md` (48px; hero), `lg` (56px;
closing, with a 14px `neutral-600` line beneath it). The hero and closing
instances carry ids the header watches. Focus is a 2px
`brand-600` outline offset 4px. Every instance carries the font picked in the
hero preview to the editor as `?font=<id>` (omitted for the default, Geist).
It is the only filled CTA, and only one is visible at a time. The hero's
secondary link is plain text with a `neutral-300` hairline that lengthens and
darkens on hover. "How it stays private" (to the privacy section) and "Open
your saved invoices" (to `/create?open=invoices`) share one grid cell and
crossfade (opacity and visibility, 200ms) once the saved-invoice count
resolves; the hidden one is `aria-hidden` and out of the tab order. If the
browser blocks storage, a 14px `neutral-600` note with a `warning` alert icon
appears under the row.

### Invoice Preview (signature)

The hero's right side: a `figure` that mirrors real editor output rather than
an illustration, set as a homepage sheet. It carries the Invoice title, number
and due date, From and To (the editor's own labels), a line-item table with a
`neutral-100` header row, bank details limited to fields the editor actually
has, and the total due, in US dollars with tabular figures. Its logo is the
shared logo mark: a 48px `neutral-900` `rounded-surface` tile with white "MO"
in Geist Semibold, used on both example invoices. A chip pinned over its
lower-left corner (white, hairline, `shadow-menu`, `brand-600` lock icon,
`neutral-700` Medium text) reads "Bank details only leave on your PDF". Below it, a "Try a font" pill
segmented control (`aria-pressed` buttons; active segment `neutral-900` with
white text, others `neutral-600` with `neutral-100` hover) restyles the whole
figure live in Geist, Lora, or JetBrains Mono from the invoice font library,
with a 12px `neutral-600` hint that the new invoice opens in that font. Before
hydration, or without JavaScript, the control is replaced by a plain line in
the same reserved height ("Set your invoice in any of ten fonts in the
editor."), so it never looks clickable before it works.

### Privacy Sheet (signature)

The privacy section's right side, a second homepage sheet in the hero's
idiom. A Geist Semibold 20px heading ("Check it yourself") with a
`neutral-600` subline, then the request tally, then three plain text checks.

- **Request tally:** a `neutral-100` band between hairlines, at least 144px
  tall. A small `success` dot (pulsing only under `motion-safe`) beside a 12px
  Medium `neutral-700` caption, "Counted live by your browser, since this page
  opened", then a two-column list of 36px Geist Semibold tabular figures with
  14px `neutral-600` labels beneath: "Requests to other websites" in
  `neutral-900` and "Files from billsend itself" in `neutral-500`. The counts
  stream from the browser's own performance timeline. Without JavaScript or
  the API, the band holds a sentence explaining how to check in DevTools.
- **Checks:** "Watch the network yourself", "Look for a sign-up", "Read the
  source"; rows split by `neutral-200` top hairlines, each a Medium title and
  `neutral-600` 14px text, with a `brand-700` underlined link where there is
  one. No icon tiles: the live figures are the proof, the checks are
  instructions.

The honest caveat about browser storage sits outside the sheet, in the left
column under a hairline, as a small Medium heading and `neutral-600` text.

### Tour Invoice (signature)

The features section shows the product instead of listing it. Left: a third
homepage sheet, a fuller invoice set in Lora (another client, euros, VAT and a
percentage discount whose sums match the editor's, IBAN and BIC payment
details, the shared logo mark), with extra side padding so numbered markers
can sit in the paper's left margin beside the regions they explain. Markers are
20px `brand-600` circles with white 12px Geist Semibold numerals, hidden from
assistive tech. From `lg`, an ordered list of notes sits to the right with
matching markers, each a serif title (30px) and `neutral-600` 16px text,
separated by `neutral-200` hairlines. Below `lg` that list is hidden and each
note renders directly under its marked region inside the sheet, as a callout:
`brand-50` fill, `brand-200` border, `rounded-surface`, Geist 14px
`brand-950` text with a Semibold title, so a phone never has to hold the
numbers in mind across a scroll.

### Questions Accordion

A native `<details>` list of five questions beside a serif heading, so it
works without JavaScript. Under the heading, a 16px `neutral-600` line ends in
a `brand-700` underlined "Ask on GitHub" link. Rows are separated by `neutral-200` hairlines (top on each row,
bottom on the group). Each summary is a Medium 16px question at least 56px tall
with a `neutral-500` plus icon that rotates 45 degrees (200ms) when open; the
answer is `neutral-600` 16px text capped at 60ch.

### Homepage Motion

One authored moment, on load, in plain CSS (`globals.css`, easing
`cubic-bezier(0.16, 1, 0.3, 1)`), so it plays on first paint without waiting
for JavaScript:

- the two hero headline lines rise from behind a mask (`.hero-rise`, 0.1s and
  0.2s);
- the lead and CTA row fade up (`.hero-fade-up`);
- the preview sheet rises in (`.hero-card`);
- the preview then fills itself in: line items one by one (0.15s apart), then
  the bank details and total, then the chip.

Nothing animates on scroll except the header pill's 200ms collapse and
expand. The only ambient motion is the request tally's live dot, which pulses
only under `motion-safe`. Hovers are colour and small transforms only. Under
reduced motion every travelling entrance becomes a 0.4s fade and the staggered
inline delays are overridden to zero, so the hero appears at once.

## Do's and Don'ts

### Do:

- **Do** reference semantic roles (`bg-background`, `text-muted-foreground`,
  `border-border`) in app chrome so retheming stays possible.
- **Do** use `paper-*` tokens for everything drawn on the invoice page, and
  `brand-50` plus `brand-500` for its edit affordances.
- **Do** put solid brand fills on `brand-600` (hover `brand-700`) and keep
  `brand-500` for focus rings and borders.
- **Do** keep the A4 page free of responsive breakpoints; scale it with zoom.
- **Do** give coarse pointers 44px targets with `pointer-coarse:` variants.
- **Do** separate stacked and adjacent surfaces with `flex` or `grid` plus
  `gap-*` (use `gap-px` on a coloured parent for hairlines).
- **Do** stay on `rounded-surface` / `rounded-control` and the 32px control
  height for chrome.
- **Do** reach for `shadow-menu` for floating chrome rather than picking raw
  shadow utilities per component.
- **Do** tint destructive actions; reserve solid saturated fills for the brand.
- **Do** mirror any new PDF colour as a literal hex in the renderer and record
  it in the PDF palette here.
- **Do** use the one `CreateInvoiceLink` pill for every homepage primary
  action, with the same label everywhere.
- **Do** build every homepage serif heading from `DISPLAY_HEADING` and mark
  emphasis with `brand-600` colour.
- **Do** keep homepage motion in plain CSS that plays without JavaScript and
  degrades to fades under reduced motion.
- **Do** give JavaScript-only homepage content a same-height plain stand-in
  until hydration, crossfade late-resolving alternatives in one grid cell, and
  prefer native elements (`<details>`) that need neither.
- **Do** keep one primary button on screen at a time; the header pill appears
  only while neither the hero nor the closing pill is visible.
- **Do** prove privacy claims with something the visitor can see or check
  (the live request tally, plain instructions) rather than decorative ticks.
- **Do** list homepage colour transitions by property (`color`,
  `background-color`, `text-decoration-color`) so focus outlines never fade.

### Don't:

- **Don't** use `space-y-*`, `space-x-*`, `divide-x`, or `divide-y` (breaks
  with conditional and fragment children; owner-controlled `gap` is the rule).
- **Don't** put white text on `brand-500`; it fails AA.
- **Don't** let the invoice page follow the app theme or use chrome roles,
  raw `zinc-*`/`blue-*`, or responsive classes.
- **Don't** hard-code hex or raw `neutral-*` greys in app chrome; raw neutrals
  belong to the light-only homepage, and hex belongs to the PDF renderer.
- **Don't** introduce a second accent hue.
- **Don't** set homepage display type in italic or as outlined (stroked) text.
- **Don't** use `transition-colors` on focusable homepage elements; it animates
  `outline-color`.
- **Don't** use Instrument Serif outside the homepage.
- **Don't** reach for heavy or black shadows; prefer a hairline border, and
  keep any shadow soft and neutral.
