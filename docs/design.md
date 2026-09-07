# OFF+BRAND. — visual source of truth

Use this file for every UI, layout, and styling change. The product is Conway’s Game of Life; the visual language is an editorial spread on warm parchment: one typeface, one chromatic object, no shadows.

**Theme:** light only. Do not add a dark palette or a second font family.

**Production typeface:** Ataero Retina OB Edition (weights 400 and 700). This repo uses **Inter** with tight tracking as the licensed substitute until Ataero is available.

## Quick path

1. Paint the page with parchment (`#e5e4e0`). Lift cards and the board onto paper (`#ffffff`).
2. Set type in Inter/Ataero only. Display headlines 70–103px, line-height `0.80`, all caps. Body 15px or 18px, left-aligned.
3. Put the iridescent sphere **once**, in the hero, behind type. Never on buttons, borders, or cells.
4. Interactive hit areas: 10px radius, ghost (no fill). Cards and the grid: 0px radius, 1px ash hairlines, no shadow.

## Tokens

| Token | Value | Use |
|-------|-------|-----|
| `--color-parchment` | `#e5e4e0` | Page canvas only — never pure white at page level |
| `--color-ink` | `#1d1d1d` | Text, strokes, filled alive cells, hover fills |
| `--color-paper` | `#ffffff` | Cards, board, elevated surfaces |
| `--color-ash` | `#bfbebe` | 1px hairlines and dividers |
| `--color-stone` | `#cdcdc9` | Quiet secondary panels |
| `--gradient-iridescent-sphere` | `linear-gradient(255deg, rgb(250, 203, 14), rgb(240, 107, 168) 30%, rgb(120, 186, 230) 65%, rgb(255, 255, 255))` | Hero sphere fill only |

### Type scale

| Role | Size | Line height | Tracking | Token |
|------|------|-------------|----------|-------|
| caption / section label | 11px | 1.4 | 0.55px (~0.05em) | `--text-caption` |
| body-sm / ghost link | 15px | 1.4 | 0.15px | `--text-body-sm` |
| body | 18px | 1.4 | 0.23px | `--text-body` |
| subheading | 34px | 1 | 0.44px | `--text-subheading` |
| heading-sm | 46px | 1 | 0.6px | `--text-heading-sm` |
| heading | 70px | 0.8 | 0.91px | `--text-heading` |
| heading-lg | 76px | 0.8 | 0.99px | `--text-heading-lg` |
| display | 103px | 0.8 | 1.34px | `--text-display` |

Weight 400 for body and display. Weight 700 only for small labels and nav if needed.

### Spacing and shape

Base unit 4px. Page max-width 1400px. Section gap 76–119px. Card padding 30px. Element gap 19px.

| Token | Value |
|-------|-------|
| `--spacing-5` … `--spacing-119` | 5, 6, 8, 15, 19, 30, 32, 46, 76, 119 px |
| `--radius-cards` | 0px |
| `--radius-links` / `--radius-inputs` / `--radius-buttons` | 10px |

## Components in this app

| Piece | Rule |
|-------|------|
| Hero sphere | ~50vh circle, right-of-center, gradient at 255deg, no border, no shadow, no interaction. One per page. |
| Display headline | All caps, 70–103px, leading 0.80, ink on parchment, stacked as one block. |
| Ghost text link | 15px, no fill, 10px radius, 5px vertical padding, `→` optional, underline on hover. |
| Filter pill (primary control) | 11px all caps, tracking 0.05em, 1px ink border, 10px radius, padding 8×19px. Hover: ink fill, parchment text. Only state-change button. |
| Section label | 11px all caps, tracking 0.05em, left aligned. |
| Work / board card | Paper, 0 radius, no shadow, parchment grid overlay, 30px padding. |
| Concentric ornaments | 1px ash (or ink at 20%), unfilled, static. |
| Alive cell | Ink fill, 0 radius. Dead cell: paper + ash hairline. No pink, purple, or gradient on cells. |

## Do / don’t

**Do:** parchment canvas; monochrome UI; ash hairlines; 10px radius only on interactive elements.

**Don’t:** second typeface; drop shadows; colored button fills; gradient anywhere except the hero sphere; body smaller than 15px or larger than 18px; centered body copy; rounded cards.

## Surfaces and elevation

| Level | Surface | Purpose |
|-------|---------|---------|
| 0 | Parchment | Page |
| 1 | Paper | Board, dialogs, cards |
| 2 | Stone | Rare secondary panels |

Depth comes from surface shifts and layered ornaments. Shadows break the print metaphor.

## Implementation map

Tokens and utilities: `src/styles/globals.css`. Tailwind 3 theme: `tailwind.config.mjs`. Layout chrome: `src/layouts/Layout.astro`. Game chrome: `src/components/react/Containers/GameContainer.tsx` and `src/components/ui/*`.

shadcn semantic colors (`background`, `foreground`, `primary`, `border`) must resolve to parchment / ink / paper / ash — not zinc defaults.

## Agent prompts

- Display: 70–103px, weight 400, leading 0.80, ink on parchment, all caps.
- Ghost link: 15px, no fill, 10px radius, trailing `→`.
- Filter control: 11px caps, ink border, hover inverts to ink fill.
- Sphere: 255deg yellow → pink → blue → white, once, behind the headline.
