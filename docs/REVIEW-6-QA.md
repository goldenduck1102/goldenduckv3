# Browser review 6 — 2026-10-30

- Carousel autoplay now uses 4000 ms; starts a fresh cycle when entering the viewport and after manual input. Removed hover/focus pauses that made it appear stuck when scrolling under the cursor. Drag, hidden tab and reduced-motion states remain respected.
- Browser polling at 150 ms observed cards 5 -> 0 -> 1, intervals 4001 and 3900 ms (sampling tolerance). Offscreen copy normalization still preserves right-to-left travel.
- Removed original gallery items 6, 9, 10, 12, 13 and 17 (assets 03, 06, 07, 09, 10, 15); 11 remain. Asset files retained.
- All four badges retain tier, seating type, price, barcode and booking link. Removed lists, repeated date, nominal-price label, booking disclaimer and footer instructions.
- First Class: burgundy with gold text; Premium: gold with dark text. Matching cords/clips and outline. No invented ticket benefits.
- At 1009×842, badge heights ~350–356px and no horizontal overflow. At 390×844, document width390 and all prices fit.
- pnpm check and pnpm build passed. Local only.
