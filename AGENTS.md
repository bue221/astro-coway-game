# Agent instructions

Conway’s Game of Life on Astro, React, and Tailwind 3. Visual language is OFF+BRAND (light, editorial, parchment).

## Quick path

1. Read [docs/design.md](./docs/design.md) before changing UI, layout, or CSS.
2. Reuse tokens in `src/styles/globals.css` and `tailwind.config.mjs` — do not invent colors or fonts.
3. Keep the iridescent sphere as a single hero object. Game cells stay ink/paper/ash.

## Design source of truth

| Doc | Role |
|-----|------|
| [docs/design.md](./docs/design.md) | Colors, type, spacing, components, do/don’t |

If a UI choice is not in that file, prefer restraint: parchment canvas, ink type, paper surfaces, ash hairlines, 10px radius on controls, 0px on cards, no shadows.

## Stack

- Astro 7 pages and layout; React for the simulator (`GameContainer`)
- Tailwind 3 via PostCSS (`postcss.config.mjs`) + shadcn/Radix primitives mapped onto OFF+BRAND tokens
- Inter as substitute for Ataero Retina OB until the licensed font is added

## Commands

```bash
npm install
npm run dev
npm run build
```

## Out of scope unless asked

Dark mode, extra typefaces, colored CTAs, box-shadows, and reusing the hero gradient on controls or cells.
