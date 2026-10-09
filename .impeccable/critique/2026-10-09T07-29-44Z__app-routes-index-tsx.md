---
target: the home page
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:50909708e76f48e26162a13381b3658dee2e73af2401fb8e75d9725a354d2ddc"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-09T07-29-44Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay, detector injected inline because the page's CSP now blocks external scripts). Run after the tax-order fix and the Content-Security-Policy.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Tally "files" count shifts as the editor preloads, unexplained |
| 2 | Match System / Real World | 2 | Developer jargon in the proof ("Requests sending data", response headers) |
| 3 | User Control and Freedom | 3 | Preview font silently becomes the editor's starting font |
| 4 | Consistency and Standards | 3 | "Questions" nav lands on "Before you start"; mobile nav drops Features |
| 5 | Error Prevention | 3 | Backup advice didn't say the export holds bank details in plain JSON |
| 6 | Recognition Rather Than Recall | 3 | "Export Data from the File menu" must be remembered until the editor |
| 7 | Flexibility and Efficiency | 3 | Saved-invoices shortcut; no template equivalent |
| 8 | Aesthetic and Minimalist Design | 3 | Privacy promise repeated; privacy section 1775px tall on phones |
| 9 | Error Recovery | 3 | Blocked-storage message excellent; only error state on the page |
| 10 | Help and Documentation | 2 | Only help channel needs a GitHub account |
| **Total** | | **28/40** | **Good** |

## Design Specificity Verdict

Content is product-specific (live tally, CSP check, faithful samples, font hand-off, reverse-charge EUR invoice); visual frame (Instrument Serif, Geist, single blue, pill CTA with arrow chip, floating sheets) is category-default. Detector: CLI clean; overlay 3 nested-cards FPs (invoice tables, tally band), Sonner height transition FP, pulsing dot intentional TP. Tour maths and tax-after-discount confirmed correct; CSP header confirmed on /, /create and 404.

## Priority Issues

- [P1] "Bank details only leave on your PDF" was untrue: Export Data writes them to plaintext JSON. (/impeccable clarify) Fixed after this run.
- [P1] Proof covers the homepage and is written for developers; two checks need a computer. Fix: lead with a phone-doable check, fold DevTools/CSP steps into details, consider the tally in the editor. (/impeccable distill)
- [P2] "Requests sending data" overclaimed (counts any fetch/XHR/beacon). Renamed "Background requests" after this run. (/impeccable clarify)
- [P2] At 320px the lock badge covered the SWIFT line. Badge now sits under the sheet below sm. (/impeccable adapt)
- [P3] Generic visual voice. (/impeccable typeset)

## Persona Red Flags

Jordan: jargon; "295 files" meaningless. Riley: CSP doesn't cover top-level navigation and allows unsafe-inline; previews differ from editor output (no subtotal in hero, currency code on totals); plaintext export. Casey: two checks need a computer; long privacy section; 40px font buttons (now 44px); nav drops Features. Wary freelancer: badge claim contradicted by export advice (fixed); no autosave reassurance at the CTA.

## Questions to Consider

- Why isn't the request counter in the editor, where the data actually is?
- Would one phone-doable test ("go offline, finish the invoice") persuade more than four DevTools checks?
- Why is the hero invoice the one thing on the page you can't type into?
