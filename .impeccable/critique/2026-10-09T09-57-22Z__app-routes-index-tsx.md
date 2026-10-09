---
target: the home page
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:50909708e76f48e26162a13381b3658dee2e73af2401fb8e75d9725a354d2ddc"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-09T09-57-22Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay, detector injected inline because of the page's CSP)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Tally is live and honest, but any future same-origin fetch would show an unexplained non-zero "proof" number |
| 2 | Match System / Real World | 2 | The differentiator is explained in developer language: "Background requests", "Network tab", "Response Headers" |
| 3 | User Control and Freedom | 3 | Font pick silently retargets every CTA, including the header one, with no cue there |
| 4 | Consistency and Standards | 3 | Tour marker 3 floats mid-paper (max-w-64 wrapper); mobile nav drops Features |
| 5 | Error Prevention | 3 | Backup warning lives on the homepage, weeks before the moment it matters |
| 6 | Recognition Rather Than Recall | 3 | "Export Data from the File menu" points at unseen UI, three times |
| 7 | Flexibility and Efficiency | 3 | Returning-user link is adequate but small |
| 8 | Aesthetic and Minimalist Design | 3 | Privacy promise stated about ten times |
| 9 | Error Recovery | 3 | Blocked-storage note gives a remedy; few other error paths |
| 10 | Help and Documentation | 3 | Good grouped FAQ; GitHub-only support; on mobile the GitHub link precedes the FAQ |
| **Total** | | **29/40** | **Good** |

## Design Specificity Verdict

Content is grounded in the product (live 0/0 tally, bank-details pill on the bank lines, reverse-charge sample, sign-up check, font hand-off confirmed). Chrome is category-generic (Instrument Serif over grotesque, blue pill CTA with arrow chip, hero/privacy/features/FAQ/closing order; "Make an invoice." is commodity copy). Detector: CLI clean; overlay 4 findings at both widths, all FPs against DESIGN.md (3 nested-cards on invoice tables and the tally band, Sonner height transition, the documented motion-safe live dot). Claims verified true: sample sums, ten fonts, three sizes, exempt note, Export Data, backup includes bank details, CSP on /, /create and 404.

## Priority Issues

- [P1] Privacy proof is developer-speak and two checks need a computer. Fix: outcome-first checks, devtools steps behind a disclosure, plain tally labels, a phone-doable check. (/impeccable clarify)
- [P2] Absolute copy a sceptic can catch: "never leave this browser" vs files you save; "no database" vs IndexedDB; "a set of files" vs Worker SSR. (/impeccable clarify)
- [P2] Privacy section 1,799px on mobile, promise repeated ~10 times, backup warning interrupts the peak. (/impeccable distill)
- [P2] Tour markers: marker 3 inside the paper on desktop; mobile notes read as invoice content. (/impeccable layout)
- [P3] Bank-details pill lands last (~2.3s); ~2px hydration nudge from the font-row fallback. (/impeccable animate)

## Persona Red Flags

Jordan: never sees the editor; jargon; IBAN/reverse charge foreign to US users. Riley: "no database", "never leave"; tally ticks on any same-origin fetch; CSP allows unsafe-inline and doesn't govern navigation; previews omit the currency code and use "Discount (10%)" unlike the PDF. Casey: no Features link; two desktop-only checks; 6,000px page; GitHub link before the FAQ. Wary freelancer: pill arrives last; font picker invites dawdling; "no billsend branding on your PDF" is true and unused.

## Questions to Consider

- If the counter is the peak, why isn't it in the hero beside the pill?
- Would one real editor screenshot with a measured time-to-PDF beat the second sample invoice?
- Is "no watermark, no billsend logo on your PDF" a bigger promise than the font picker?
