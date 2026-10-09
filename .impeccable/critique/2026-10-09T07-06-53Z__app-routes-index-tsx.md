---
target: the home page
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:5119b35eb758bd672424c735cea04e65af65a0fa1e3e42079371a3ac18d4a273"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-09T07-06-53Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay). Run after a fix pass on the 27/40 critique.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | "Requests to billsend" is a large number with no baseline; font pick only stated in a 12px hint |
| 2 | Match System / Real World | 3 | US hero sample has account + SWIFT, no routing number; samples lacked issue dates |
| 3 | User Control and Freedom | 3 | No traps; font pick resets on reload |
| 4 | Consistency and Standards | 2 | Tour note implied separate "reverse charge or exempt" modes; "no server" vs SSR Worker; phone header drops Features |
| 5 | Error Prevention | 3 | Backup caveat, private-window FAQ and storage note are good; caveat skimmable |
| 6 | Recognition Rather Than Recall | 3 | Phone annotations excellent; desktop note 4 far from its marker |
| 7 | Flexibility and Efficiency | 3 | Saved-invoices link and header CTA; returning users still get the full page |
| 8 | Aesthetic and Minimalist Design | 3 | No-sign-up message repeated four times; 96px dead gap in phone hero |
| 9 | Error Recovery | 3 | Storage note gives a remedy, not browser-specific steps |
| 10 | Help and Documentation | 2 | Only help channel needs a GitHub account; FAQ silent on languages/scripts |
| **Total** | | **28/40** | **Good** |

## Design Specificity Verdict

Content is product-specific (live tally, bank-details chip, faithful samples, font hand-off, reverse-charge EU sample); the visual frame (serif headline on off-white, pill CTA with arrow chip, FAQ accordion, closing band) is category-generic.

Deterministic scan: CLI clean. Overlay: 4 findings at desktop and mobile; 3 nested-cards are FPs (invoice tables and the tally band, per DESIGN.md), the Sonner height transition is FP, the pulsing dot is an intended TP. Mobile callout nested-cards and the max-width layout transition from the previous run are gone.

## Priority Issues

- [P1] Privacy proof guards the wrong boundary: tally splits by origin only; no CSP; "no server" wording vs SSR. Fix: ship a CSP (connect-src 'self'; form-action 'none') and show it as a check; count data-carrying requests (fetch/xhr/beacon) separately. (/impeccable harden)
- [P1] Editor computes tax before the discount (utils/calculate-invoice-totals.ts), so "does the sums" is wrong when both are used. Fix: tax on (subtotal - discount). (/impeccable harden)
- [P2] Tour sheet overflowed at 320px (px-9 plus fixed table columns). (/impeccable adapt)
- [P2] Phone hero had a 96px dead gap from the reserved saved-invoices slot. (/impeccable layout)
- [P3] Closing repeated the no-sign-up message and broke as "sign up / for." (/impeccable clarify)

## Persona Red Flags

Jordan: jargon ("requests", "Network tab"); a large grey own-origin count beside 0 reads as "what is it sending?". Riley: no CSP, SSR vs "no server", VAT plus discount maths, 320px overflow. Casey: dead gap, payoff below the fold, header drops Features, 40px nav links. Wary freelancer: chip taken on trust, no routing number for US, help needs GitHub.

## Questions to Consider

- If the threat is billsend itself, why does the best proof only count third parties?
- Would typing your own name into the preview prove "stays put" better than picking a font?
- Should the page end on the backup ritual rather than another "no sign-up"?

## Fixed after this run (same session)

"No server" reworded; tour note 3 matches the single Exempt toggle and drops "does the sums"; issue dates on both samples; tour sheet fits 320px; phone hero slot reserved only from lg; 44px coarse header links; own-origin tally count stepped down to 24px; closing rewritten ("Send the invoice. Keep everything else.") with the picked font named under the CTA. Open: CSP, editor tax order, a non-GitHub help channel.
