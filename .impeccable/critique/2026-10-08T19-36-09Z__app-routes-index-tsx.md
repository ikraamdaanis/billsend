---
target: the home page
total_score: 27
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:c49568d12a5fd48c2c6849d284f39c4b0380728409b61dfc816951ce5fc05587"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-08T19-36-09Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | The live tally is excellent, but "Files from billsend itself" shows an unexplained, climbing number (route preloads add to it) |
| 2 | Match System / Real World | 2 | Tour invoice charges 19% VAT on the pre-discount subtotal, and a London seller charging German VAT to a Berlin GmbH is the textbook reverse-charge case |
| 3 | User Control and Freedom | 3 | Returning users lose "How it stays private" from the hero when the crossfade swaps it for the resume link |
| 4 | Consistency and Standards | 3 | "Features" nav lands on a heading that never says features; tally rows mix units |
| 5 | Error Prevention | 3 | The data-loss caveat (clearing browsing data deletes everything) is the smallest text on the page |
| 6 | Recognition Rather Than Recall | 3 | Desktop tour markers 2 and 3 sit on adjacent totals rows, so the note mapping is ambiguous |
| 7 | Flexibility and Efficiency | 3 | Resume link and font carry-over are real accelerators; mobile header has no route to Features or Questions |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained, but the storage caveat is said twice and the visual voice is template-generic |
| 9 | Error Recovery | 2 | Blocked-storage note says what is wrong, not how to fix it |
| 10 | Help and Documentation | 2 | Only help channel is "Ask on GitHub", which needs an account, on a page selling "no account" |
| **Total** | | **27/40** | **Acceptable** |

## Design Specificity Verdict

**LLM assessment:** the content and interactions are authored for this product; the visual voice is borrowed. The hero sheet is real editor output in real library fonts, the font pick carries into `/create?font=`, the lock chip sits on the bank-details line, and the privacy section proves itself with a live PerformanceObserver tally. A hosted competitor could not ship this page truthfully. Against that, Instrument Serif on a neutral-50 canvas plus a pill CTA with a circular arrow chip is the stock indie-SaaS launch look, and `rounded-full` everywhere a hand lands contradicts DESIGN.md's own "precise paper instrument, 3px corners" north star.

**Deterministic scan:** `impeccable detect` on `app/routes/index.tsx` is clean (exit 0, no findings). The browser overlay found 5 anti-patterns at desktop and 9 at mobile:
- nested-cards x3 (hero line-item table, privacy request tally, tour line-item table inside shadowed sheets): false positives. These are invoice tables and a tally band drawn on paper, which is the documented Homepage Sheet Rule.
- nested-cards x4, mobile only (the brand-50 tour callouts inside the tour sheet): true positive in effect. It corroborates the review's finding that on phones the tour invoice gets interleaved with four callouts and stops reading as an invoice.
- layout-transition on `max-width` (header CTA pill reveal, index.tsx ~324): true positive, minor. It animates layout on every reveal; an opacity/transform or grid-template reveal avoids it.
- layout-transition on `height`: false positive, Sonner toast CSS, not homepage markup.
- pulsing-dot (privacy tally live dot): judgement call. It means "counting live" and is reduced-motion gated; acceptable, but a static dot loses nothing.

The detector missed everything in the priority list below; none of it is pattern-detectable.

**Visual overlays:** injection succeeded. Overlays are visible in the **[Human]** tab in the browser pane at desktop width (4 flagged elements plus the page banner).

## Overall Impression

The best version of this page so far on substance: it proves rather than claims, and the hero is the product. Its weakest spot is now accuracy, not design. The tour invoice is meant to show that "billsend does the sums", and its sums would be wrong on a real VAT invoice. The biggest design opportunity is giving the page a voice that matches the editor's precision instead of the category's default costume.

## What's Working

1. **Proof over promise.** The live request tally (index.tsx ~239-270, ~773-815) has a no-JS stand-in, is honestly scoped to "since this page opened", and is the most product-specific idea on the page.
2. **The hero is the product.** Real fonts, sums that add up, the font choice carried into the editor, and reassurance placed exactly on the bank-details line where the worry arises.
3. **State craft.** Hydration-safe stand-ins, a crossfade instead of a reflow for the returning-user link, a blocked-storage note, reduced-motion fades, one primary CTA at a time, tour notes moved inline on phones, clean tab order with a skip link.

## Priority Issues

**[P1] The tour invoice shows VAT computed the wrong way, in the section about doing the sums for you**
- **Why it matters:** €2,750 + 19% VAT on the undiscounted subtotal (€522.50) − 10% = €2,997.50 (index.tsx:149-151, ~951-963). VAT is normally charged on the discounted amount: €2,475 + €470.25 = €2,945.25. The homepage is faithful to the editor (`utils/calculate-invoice-totals.ts:40-62` takes tax on the raw subtotal), so this is a product bug on display to exactly the audience who knows VAT. The UK-seller-to-German-GmbH scenario with German VAT is also the classic reverse-charge case.
- **Fix:** fix the order in the editor (discount, then tax) as its own change; until then, change the sample so it is correct either way (drop the discount, or make it a domestic Berlin-to-Berlin invoice).
- **Suggested command:** /impeccable clarify (sample copy); the calculation fix is engineering work.

**[P2] The privacy proof speaks to developers and leaves its own number unexplained**
- **Why it matters:** "open your browser's developer tools" (index.tsx:61) is useless to the phone user. "Files from billsend itself" shows a large, rising count with no gloss, which reads as alarming. The tally covers the homepage, not the editor where bank details are typed.
- **Fix:** relabel to "Requests to billsend" with one line ("the app's own code, fonts and images"), say the editor behaves the same, and echo "0 requests to other websites" beside the hero CTA where the wary decision is made.
- **Suggested command:** /impeccable clarify

**[P2] Header overflows at 320px once the CTA pill appears**
- **Why it matters:** wordmark + mobile Privacy link + coarse pill + 48px padding in a `1fr auto` grid (index.tsx:304-333) pushes the document to 455px wide with horizontal scroll (confirmed in the forced scrolled state). Fits at 375px with about 21px to spare.
- **Fix:** hide the mobile Privacy link while the pill is shown, or drop the arrow chip below ~360px, and add `min-w-0` to the wordmark cell. Replace the `max-width` transition at the same time.
- **Suggested command:** /impeccable adapt

**[P2] The trust FAQ dodges the sceptic's real question**
- **Why it matters:** "Why is it free?" (index.tsx:126-129) explains how it is cheap, not why it exists or what the catch is. The only follow-up path, "Ask on GitHub", requires an account.
- **Fix:** a plain, true motive answer written by you (not invented), and a non-GitHub contact only if one genuinely exists. Split the two-questions-in-one storage item.
- **Suggested command:** /impeccable clarify

**[P3] Borrowed visual voice, flat ending, and a mobile tour that stops being an invoice**
- **Why it matters:** Instrument Serif plus the pill/arrow-chip CTA is a recognisable template and contradicts the tight-radius identity. The closing is a heading and a pill on bare canvas, so the page's best asset (paper) is absent at the end. On a 375px phone the tour is ~1,587px tall with four callouts interleaved into the invoice (detector corroborates).
- **Fix:** test the CTA on the 4px control radius; consider a display face with document or ledger character; let the closing carry a sheet; on mobile, show the tour invoice whole and put the notes after it, keyed by marker number.
- **Suggested command:** /impeccable typeset, /impeccable bolder (closing), /impeccable adapt (mobile tour)

## Persona Red Flags

**Jordan (first-timer):** never sees the editor, so cannot tell whether it is a form or a canvas. "Browser storage" and "clearing browsing data" read as jargon and risk. "Features" lands on a heading that does not say features.

**Riley (stress tester):** 320px header overflow. Tally count inflates with preloads. Switching to JetBrains Mono grows the hero sheet 481 to 501px, and the `items-center` grid (index.tsx:422) shifts the hero copy. Blocked-storage note has no remedy. VAT sample is wrong.

**Casey (distracted mobile user):** CTA is above the fold (good). Font control is below it at y≈1066. Header offers only "Privacy", so Features and Questions need a long scroll. The tour is the longest stretch on the page.

**Freelancer billing in 10 minutes, wary of bank details:** the bank-details chip and tour note 4 land well. The "check it yourself" path assumes a laptop and DevTools. No effort cue ("defaults are ready, a couple of minutes"). "Why is it free?" leaves the catch unanswered. An EU-billing freelancer spots the VAT error and stops trusting the tool's sums.

## Minor Observations

- `styles/globals.css:11` imports Instrument Serif globally; only the preload is route-scoped. Harmless (faces load on use) but looser than the Serif Stays Home rule.
- The font pick only survives via the hero link; reaching `/create` another way drops it.
- "Ask on GitHub" inline link is 21px tall (inline exemption applies); other targets measure 40-56px.
- Desktop first viewport has 9 interactive targets and the hero decision point has 5 (CTA, privacy link, three fonts); mitigated by the font control reading as optional.
- Cognitive load: 2 checklist failures (chunking: 5 FAQ items with one doubled; minimal choices at the hero). Moderate.
- Lenis is no longer in the homepage source or DOM.

## Questions to Consider

- If "0 requests to other websites" is the most persuasive fact you own, why does it live in section two instead of beside the button?
- The page sells the PDF but never shows the editor. Is a 10-minute freelancer reassured more by output quality or by seeing how few steps it takes?
- The product is a precise paper instrument with 3px corners. What would the homepage look like if it dressed like that instead of like every other 2025 launch page?
