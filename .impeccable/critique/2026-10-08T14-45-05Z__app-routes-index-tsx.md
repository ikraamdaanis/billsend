---
target: the home page
total_score: 21
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:aac9c1d1598ab151de9e80d80c598024c4aab86b1076350b4539c04ccd4164f1"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-08T14-45-05Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 2 | Returning visitors with saved invoices see the same page as strangers |
| 2 | Match System / Real World | 3 | "There is no backend" is jargon; "never leave this tab" reads as "closing the tab loses my work" |
| 3 | User Control and Freedom | 3 | Anchors work; Lenis makes scroll feel floaty |
| 4 | Consistency and Standards | 2 | Three CTA labels, two CTA shapes (square header button, pills elsewhere) |
| 5 | Error Prevention | 2 | No warning that clearing site data deletes invoices; "Works offline" overpromises |
| 6 | Recognition Rather Than Recall | 3 | Sticky header CTA always visible |
| 7 | Flexibility and Efficiency | n/a | Single-goal landing page |
| 8 | Aesthetic and Minimalist Design | 2 | Same claim ~8 times; marquee and sliding band add ~600px of no information |
| 9 | Error Recovery | 3 | Full render without JS; reduced motion honoured |
| 10 | Help and Documentation | 1 | Local-only raises questions (backups, other devices, clearing browser) the page never answers |
| **Total** | | **21/36** | **Acceptable (58%)** |

## Design Specificity Verdict
Partly authored, mostly interchangeable. Authored: hero invoice preview, privacy finale. Interchangeable: headline formula with stroked + italic accent words, serif slogan marquee, hero-metric stats row, outlined 01/02/03 numerals, sliding chip band, magnetic pill CTA, Lenis, Acme/Northwind placeholders, mono as costume outside data.
Detector: CLI 0 findings on index.tsx and globals.css. Browser overlay: italic-serif-display x2 (h1 "Get paid.", h2 "Ready when you are."), gray-on-color x4 on brand-950 (neutral-300/400; contrast passes, hue issue). Extra: outlined step numerals 2.85:1 (fails even large-text 3:1), not aria-hidden. No footer landmark.

## Priority Issues
1. [P1] Claim repeated instead of proven (no accounts/servers/tracking ~8x, zero evidence). Fix: say it once, replace marquee + stats with checkable proof (offline test, DevTools zero requests, source link, bank details stay local). distill, clarify.
2. [P1] Binding claims that don't hold: no service worker so "Works offline" fails on a cold offline visit; IndexedDB is per-origin not per-tab; clearing site data deletes everything, unsaid. Fix: service worker or reword; "never leave this browser"; one backup/export line. harden, clarify.
3. [P1] Nothing proves the PDF looks professional: one simplified mock, customisation only asserted. Fix: replace sliding chips with rendered invoices in several styles, or an interactive hero preview (accent/font toggle). delight, layout.
4. [P2] Motion scattered and identical: word reveals on every heading, fade-ups everywhere, marquee, band, magnetic CTA, Lenis; hover effects on non-clickable feature rows. Fix: one authored moment (hero invoice fills itself in), drop the rest. animate, quieter.
5. [P2] Finish: pill CTA focus ring invisible, nav links 16px tall, header turns muddy over navy finale, mobile footer wraps, split-word h2s read choppily, outlined numerals 2.85:1. harden, polish.

## Persona Red Flags
Jordan: "never leave this tab" fear, "no backend" jargon, no preview of what happens after click.
Riley: 200% zoom pushes CTA off first screen; page 5893px tall.
Casey: header CTA 36px top-right; no product image above fold on mobile; "Saved locally" chip hidden on phones; 7.5 screens with no mid-page CTA; band chips crop.
Sam (first-invoice freelancer): payment details never mentioned; one template shown; "Get paid." implies payment collection; no sample PDF.

## Minor Observations
Stroked "Bill it." weakens the key line; "Free forever" twice is a binding promise; sample invoice logo is a billsend-ish "b".

## Questions to Consider
Why ask for trust 8 times instead of letting visitors prove it once? Why not greet returners with "Continue INV-0042"? What would be lost if marquee, stats and band were deleted? Does "Get paid." promise something billsend doesn't do?
