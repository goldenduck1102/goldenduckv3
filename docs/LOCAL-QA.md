# Rebuilt V3 — local QA, 30/10/2026

- `pnpm check` and `pnpm build` pass.
- Reviewed at 1280×720, 390×844, 320×740 and 768×1024. Document width equals viewport width at each size.
- Desktop hero photograph aligns to the reference within one CSS pixel.
- Carousel button, pointer drag and ArrowRight change the centre card. Drag verified Broadway → Thanh âm; keyboard verified Giáng Sinh → Bên nhau. Curved clipping, perspective and automatic rotation observed.
- Sticky experience stack and visit transitions observed. Check-in button changes to panel 2.
- Mobile menu opens; navigation closes it.
- FAQ expansion, 17-photo gallery expansion, next image, Escape and seat-map dialog verified. Body scrolling restored after dialog close.
- Reduced-motion emulation verified: experience becomes static, visit panels return to normal flow, all panel content remains accessible. Emulation reset afterward.
- Final browser error log filter returned no error entries.
- All local assets, anchors, unique IDs and 17 gallery items verified from source.

Screenshots: desktop.jpg, mobile.jpg, carousel.jpg, tickets.jpg, faq.jpg.

This verifies the local interface/build. Event facts and policies are carried from V1, without a new live availability claim. No payment, subscription submission or deployment performed.
