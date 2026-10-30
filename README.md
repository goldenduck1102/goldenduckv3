# ATOTC V3 — SignalFest UI

GitHub: https://github.com/goldenduck1102/goldenduckv3

Rebuilt section order, composition, layered imagery and scroll behavior from https://signalfest.framer.website/, using Content V1 and OrcheStars assets.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3033/. V1/Working stay independent.

```sh
pnpm check
pnpm build
pnpm preview
```

Build: `dist/`. Build preview: http://localhost:3034/.

Editable source: `index.html`, `styles.css`, `app.js`. Section mapping: `docs/DESIGN.md`. QA: `docs/LOCAL-QA.md`. Asset provenance: `docs/ASSETS.json`.

Booking opens the official event page. Seat map is static. Archival photos are Christmas 2025. Countdown uses Vietnam time. No local checkout, signup submission or deployment.
