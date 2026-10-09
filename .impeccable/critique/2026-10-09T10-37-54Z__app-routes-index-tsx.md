---
target: the home page
total_score: 30
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 3
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:81e5975beab0e32ab2d1bc0aa745373f81e8d5c237213ccbc9479ebe9fec8ba7"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-09T10-37-54Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay). First run on the security-print redesign (seed 7922b6de), after its finish review.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Live counter, saved-invoice count, blocked-storage note, pre-hydration stand-ins; counter covers the homepage only |
| 2 | Match System / Real World | 3 | "Background requests: 000" and three-digit serials read as jargon |
| 3 | User Control and Freedom | 3 | Typed client name dropped on Create invoice; phone menu ignored Escape |
| 4 | Consistency and Standards | 3 | Slip job text vs tour line; "on this device" vs "in this browser" |
| 5 | Error Prevention | 3 | Clearing site data loses invoices, never stated |
| 6 | Recognition Rather Than Recall | 3 | On phones the counter sat below the fold, the instruction to look at it far below |
| 7 | Flexibility and Efficiency | 3 | Saved-invoices shortcut and typeface hand-off; name not carried |
| 8 | Aesthetic and Minimalist Design | 3 | Specific and strong, but ornament-heavy; narrow column at 320 |
| 9 | Error Recovery | 3 | Storage note gives a fix; no restore-from-export guidance |
| 10 | Help and Documentation | 2 | CSP steps missed "reload"; help needs a GitHub account |
| **Total** | | **30/40** | **Good** |

## Design Specificity Verdict

Specific, not interchangeable: the security-print world (guilloche, numbering-machine counter, counterfoils, code line) carries the product's real argument, privacy proved the way a banknote proves it is genuine. Detector: CLI two advisory font-size FPs (documented exceptions); overlay TP line length on the "Keep a copy" paragraph (~98ch), structural nested table frame; the rest FP (microprint, typeface frame, tour strips, closed menu, Sonner).

## Priority Issues

- [P1] Slip asks for a name then drops it. (/impeccable onboard) Placeholder now reads "Try it:"; carrying the name needs an editor change.
- [P1] CSP copy overstated and steps lacked reload. (/impeccable clarify) Fixed after this run.
- [P1] On phones the counter is below the fold. (/impeccable adapt) Phone readout added under the CTA after this run.
- [P2] Tour Qty column misaligned. (/impeccable polish) Fixed with shared fixed tracks.
- [P2] Data-loss risk never stated. (/impeccable harden) Added to "Keep a copy".

## Persona Red Flags

Jordan: name lost on Create; PDF not named in hero (fixed); jargon. Riley: Qty misalignment (fixed), slip vs tour mismatch (fixed), CSP wording (fixed), counter drawn by audited code, unsafe-inline, meta description overclaim (fixed). Casey: counter below fold (fixed), five-line headline at 375, narrow 320 column, menu ignored Escape (fixed). Wary freelancer: no time cue, no editor glimpse.

## Questions to Consider

- Should the editor carry its own counterfoil, where bank details are actually typed?
- Would a "blocked attempts" reading beat a permanent 000?
- Why not render the real PDF output in the tour instead of an HTML drawing of it?
