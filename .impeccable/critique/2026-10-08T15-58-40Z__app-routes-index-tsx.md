---
target: the home page
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:0156d49878a5dfc9afeaa7fc62bc9fe12cfb34b565f7cc14c0c39c43bbbbd5f7"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-08T15-58-40Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Nothing says what "Create invoice" does (opens instantly, no sign-up) |
| 2 | Match System / Real World | 3 | "Network tab" proof is jargon for most freelancers |
| 3 | User Control and Freedom | 3 | Font picked in the preview is lost on the way to /create |
| 4 | Consistency and Standards | 3 | Closing section 24px wider than the rest |
| 5 | Error Prevention | 3 | Storage caveat present; private windows not mentioned |
| 6 | Recognition Rather Than Recall | 3 | "Export Data from the File menu" refers to unseen UI |
| 7 | Flexibility and Efficiency | 2 | No path for returning users |
| 8 | Aesthetic and Minimalist Design | 3 | Calm; Features is a flat text valley |
| 9 | Error Recovery | 2 | No-JS gap under the preview; blocked storage unaddressed |
| 10 | Help and Documentation | 2 | No FAQ (VAT, phone, saved invoices) |
| **Total** | | **27/40** | **Acceptable/Good boundary (68%)** |

## Design Specificity Verdict
Top half authored (headline, real-font preview, bank-details chip, Check it yourself sheet); bottom half generic (text-only features grid, stock pill CTA, glass header, icon-tile proof rows, condensed Instrument Serif as category reflex). Absent: eyebrows, numbers, gradient text, italic display, scroll reveals, mono costume.
Detector: CLI 0. Overlay 3: nested-cards on preview table (intentional), nested-cards on notes band (false positive), layout-transition from Sonner CSS (false positive). Contrast 0 failures; closest "Try a font" 4.54.

## Priority Issues
1. [P1] Features generic and silent on tax/VAT, fees, discounts (supported by product); preview has no subtotal/tax. Show product evidence instead of a text grid. bolder, clarify.
2. [P1] Mobile first screen: duplicate CTAs, preview below fold, crowded header. Hide header CTA until hero CTA scrolls away; pull a cropped preview up. adapt.
3. [P2] "Try a font" is a dead end: choice not carried to /create. Carry via search param or reframe as a preview. onboard.
4. [P2] Closing misaligned (padding outside max-w wrapper) and no reassurance by the CTA. polish.
5. [P3] No returning-user path, no FAQ. clarify.

## Persona Red Flags
Jordan: preview looks editable but isn't; devtools proof; Export Data reference to unseen UI.
Riley: font lost on navigation; "no account so nowhere else to store" is a non-sequitur; only USD shown; private windows unmentioned.
Casey: duplicate CTAs, preview below fold, 28px footer/GitHub links, bank line wraps, ~3950px page.
Freelancer: bank chip excellent; one layout, placeholder "MO" block, no sample PDF; no tax/VAT line.

## Minor
Dead lower-left quadrant in Privacy on desktop; transition-colors delays focus outline colour; mobile secondary link indent; tight tracking at 96px; Geist sheet title vs serif headings; "Your client is waiting" leans on urgency.
