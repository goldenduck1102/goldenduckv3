# Browser review 3 — 2026-10-30

- Restored scroll-driven image expansion from the group thumbnail into the hall photograph. Images crossfade during travel; the destination takes over without a second visible copy. Reverse scroll supported.
- Poster uses sticky positioning within the introduction on desktop. At viewport 1009×842, measured media top −22px while poster remained at 108px.
- Removed the remaining ticker, pricing/map headings, map statistics and note.
- Moved the single seating map and its legend above ticket badges; verified lightbox opens and closes. Anchor #so-do retained.
- Removed the selected full-screen venue/check-in block. Navigation now points to FAQ; attendance policies remain in FAQ.
- Countdown has pure black background, no banner. Removed decorative footer lettering.
- Browser 1009×842: scroll expansion observed at y713 with width578px; destination visible and traveler hidden after arrival; no horizontal overflow.
- Browser 390×844: document width390, no horizontal overflow. Photo remains static and visible, poster stacks normally; reduced-motion also keeps static images.
- pnpm check and pnpm build passed. Local only; no publication.

Evidence: review-3-scroll.jpg, review-3-poster.jpg, review-3-countdown.jpg.
Source checkpoint before edits: review-3-before/.
