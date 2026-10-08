---
target: the home page
total_score: 28
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
target_identity: "file:/Users/ikraam/development/billsend/app/routes/index.tsx"
target_fingerprint: "sha256:a562302ccbfb54a8bfab776458fdf4750a5ee39571386694b6973960ff58a1d7"
target_path: /Users/ikraam/development/billsend/app/routes/index.tsx
timestamp: 2026-10-08T16-23-27Z
slug: app-routes-index-tsx
---
Method: dual-agent (A: design review · B: detector + browser overlay)

## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3 | Returning-user link swaps after load (flash of "How it stays private") |
| 2 | Match System / Real World | 3 | "Bank details stay on this device" / "Keep it to yourself" contradict sending the PDF |
| 3 | User Control and Freedom | 3 | No traps; font choice reversible; native disclosure |
| 4 | Consistency and Standards | 3 | Two filled pills at the closing section; square "MO" vs round "Mo" marks |
| 5 | Error Prevention | 3 | Honest storage and private-window warnings |
| 6 | Recognition Rather Than Recall | 3 | Mobile tour markers ~1.5 screens from their notes |
| 7 | Flexibility and Efficiency | 3 | Saved-invoices shortcut, font hand-off |
| 8 | Aesthetic and Minimalist Design | 3 | Four similar white sheets with the same shadow flatten sections |
| 9 | Error Recovery | 2 | Blocked storage silently reads as 0 |
| 10 | Help and Documentation | 2 | FAQ misses "does billsend send it?", "why free?", "who makes it?" |
| **Total** | | **28/40** | **Good (70%)** |

## Design Specificity Verdict
~Two-thirds authored: hero preview with real sums + working font hand-off, tour invoice with correct VAT/discount maths, mixed date formats, Check it yourself idea. Generic frame: condensed serif headline with coloured second line, stock mid-blue, pill-with-arrow, glass header, FAQ plus-to-x, tagline+button closing, and the privacy sheet's three identical icon/title/text rows. Unused italic Instrument Serif import.
Detector: CLI 0. Overlay 3: nested-cards x2 on the invoice mocks (intentional), Sonner height transition (false positive). Contrast 0 failures. Skip link loses padding on focus (focus:not-sr-only resets padding).

## Priority Issues
1. [P1] Bank-details/sending story contradicts itself; nothing says billsend doesn't email the client. Reword chip/notes, add "Does billsend send it?" FAQ, reconsider "Keep it to yourself". clarify.
2. [P2] Privacy proof tells instead of shows (stock icon rows). Show a live local "0 requests" proof or step sequence. bolder.
3. [P2] Mobile tour markers detached from notes. Interleave notes under regions below lg. adapt.
4. [P2] No answer to "what's the catch?" FAQ "Why is it free?" + maker line. clarify.
5. [P3] Two pills at closing; mobile caveat before proof; hidden header pill reserves space; returning link flash. polish/harden.

## Persona Red Flags
Jordan: unclear whether billsend sends anything; nothing after download explained; editor opens in £ with Acme placeholders.
Riley: storage blocked reads as 0; link swap after load; two CTAs at closing; "Add dummy" button visible in the editor's Open dialog.
Casey: privacy is two screens with warning first; tour numbers need scroll-back; floating Privacy link beside appearing pill.
Freelancer: chip contradicts sending bank details; JetBrains Mono an odd pick for an illustrator; no FAQ on required invoice fields.

## Minor
"side hustles" as people; "genuinely" filler; unused italic import; reduced motion keeps stagger delays; "Billed to" vs editor "To"; empty FAQ left column; lists with list-style none may not announce in Safari; skip-link padding.
