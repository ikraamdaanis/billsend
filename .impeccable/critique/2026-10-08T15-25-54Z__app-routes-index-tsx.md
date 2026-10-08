---
target: the home page
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:1c7970bba97fde037bd42ebb02531dfe621d1a6367b351f9c8e9ce8ec2f5e09d"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-08T15-25-54Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | "Saved in this browser" could read as "backed up" |
| 2 | Match System / Real World | 3 | "Get paid" phrasing implies payment collection; UK-only sample |
| 3 | User Control and Freedom | 3 | No traps; new-tab links announced |
| 4 | Consistency and Standards | 3 | One CTA everywhere; ticks on instructions read as "done" |
| 5 | Error Prevention | 3 | Data-loss caveat exists but only at the very bottom |
| 6 | Recognition Rather Than Recall | 3 | No section nav on mobile |
| 7 | Flexibility and Efficiency | 2 | Returning users have no "open my invoices" path |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained; "download the PDF" said ~6 times across hero/features/steps |
| 9 | Error Recovery | 3 | Backup guidance present; font buttons dead without JS |
| 10 | Help and Documentation | 2 | No FAQ: why free, VAT, languages, finding saved invoices |
| **Total** | | **28/40** | **Good (70%)** |

## Design Specificity Verdict
About half authored: hero preview (self-filling, real fonts), "Saved in this browser" chip, privacy sheet. Generic: three-beat headline, "Everything you need, nothing you don't", "Ready when you are." with italic "you", icon+title+text feature rows, 01/02/03 steps, pill-with-arrow, blurred sticky header.
Detector: CLI 0 findings. Overlay 5: italic-serif-display x2 (true), nested-cards x2 (preview table borderline/intentional; privacy notes band false positive), layout-transition banner from Sonner CSS (false positive). sr-only "(opens in a new tab)" missing a leading space on the proof link.

## Priority Issues
1. [P1] Differentiator last, generic middle first: move privacy sheet after hero, fold Steps into a line, rewrite Features around billsend-only facts. distill, layout.
2. [P1] Bank-details reassurance missing at the decision point: annotate the preview's bank line, link "nothing leaves your device" to #privacy. clarify.
3. [P2] Copy overclaims/generic: "Get paid in any currency" -> "Bill in any currency"; get "invoice" into the H1 area; rewrite generic headings. clarify.
4. [P2] Mobile thinner than desktop: no preview in first screen, no nav, network proof impossible on phone, UK-only sample. adapt.
5. [P2] Feature rows: ~300px gaps between title and text, decorative icon tiles. layout.

## Persona Red Flags
Jordan: "Get paid" implies payments; IBAN/BIC jargon; preview looks editable but isn't; dev-tools instructions intimidating.
Riley: font buttons dead without JS; due date from new Date() at render can mismatch SSR/client; -1deg tilt softens text; sticky privacy heading barely visible.
Casey: no mobile nav; no product image in first screen; network proof undoable on phone.
Freelancer: bank details shown without reassurance; no full-page sample; UK-only sample.

## Minor
Straight apostrophe in serif "don't"; ~250px dead band between sections (128+128 padding); two outline treatments compete; no skip link; no contact/about in footer; PRODUCT.md "works offline after first load" is not backed by a service worker.
