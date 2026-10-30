# Browser review corrections — 30/10/2026

| Comment | Implemented |
| --- | --- |
| 1 | Official landscape banner in hero, no duplicate date/caption overprint. |
| 2 | Group photograph in About and both endpoints of its desktop scroll transition. |
| 3 | Three linear copies buffer the carousel. Visible cards move left together; recentering swaps identical off-screen copies with transitions disabled. |
| 4 | Coral, gold, blue and green ticket clips with softly tinted stocks. |
| 5 | Wider price letter spacing, extra line height and padding. |
| 6 | Audience photo 03 in the third experience card. |
| 7 | Artists and children's choir photo 02 in the second experience card. |
| 8 | Second ticket ticker removed; first retained. |
| 9 | Seat map, legend and facts centred. |
| 10 | Only one visit panel is visible; text fades out before the next fades in, removing crossfade ghosting. |
| 11 | Full V1 masonry gallery: same 17 items/order, three desktop columns and two mobile columns, no collage or expand button. |
| 12 | Text bands removed. Six temporary sponsor/partner logos taken from the official homepage at the user's request. |
| 13 | Official banner as countdown background, with a 46% black overlay. |
| 14 | FAQ moved to the former contact row; no duplicate FAQ. |

Source for temporary logos: https://www.orchestars.vn/, section “Nhà Tài Trợ Và Đối Tác”. See SPONSOR-ASSETS.json. These are temporary local design assets as requested, not independently verified event sponsorship.

Verification: syntax check and production build pass. Browser reviewed at 1440×900 and 390×844; document width checked at 320, 390, 768 and 1440. Seat-map centre equals viewport centre (720px at 1440px). All 17 gallery links present and the lightbox opens. FAQ expands at its new position. Six logos loaded successfully. Visit layer check returned one visible panel. A normal carousel step moved all physical card targets left. Reduced-motion traversal verified the boundary order 3,4,5,0,1,2,3,4. Motion emulation reset after testing.
