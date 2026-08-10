# Design

Recorded from the built pages on 11 August 2026, after the build, not before it.

## The world

**A painted steel job board from a service company's back office.** One card per job, columns for status, a name against every card.

It was chosen because this audience's real objection is not "will automation work" but "will they take my money and vanish". Every competitor answers that with a sentence claiming reliability, which is what the last agency also said. A board answers it structurally: the visitor sees that every job has an owner and a state before reading a word. The form is not a form, it is the first card going up in the Flagged column.

Direction seed `690a21b3`, candidate 5 of 7. The contract is in the built HTML as the first child of `<body>`, so it can be audited after deploy.

## Color

The mood is a working weekday, not an evening browse. Office or phone, daylight, a task interrupted. Dark ground because the board is painted steel, not because dark is the category default.

| Token | Value | Role |
|---|---|---|
| `--steel-900` | `#10161F` | page ground, deepest |
| `--steel-800` | `#1A2331` | the board face, masthead, alternating bands |
| `--steel-700` / `--steel-600` | `#222D3E` / `#2C3849` | raised panels, disabled controls |
| `--enamel` | `#E9E3D6` | job card face, primary text on steel |
| `--enamel-2` | `#D3CCBB` | a closed card, visibly older |
| `--ink` / `--ink-2` | `#16202D` / `#46536A` | text on a card |
| `--dim` / `--dim-2` | `#93A4BD` / `#6B7C96` | secondary text on steel |
| `--signal` | `#DD6428` | the only saturated colour |

**The signal rule.** Orange appears only where something can be done or where a commitment is being made: the submit button, the close CTA, the 48 hour number, a field in error, a placeholder that must be replaced. It is never decorative. If orange appears somewhere the visitor cannot act, that is a bug.

Neutrals are blue-biased toward the navy of the logo mark, not pure grey.

## Type

**Archivo, one family, two widths.** Self-hosted through `next/font`, so there is no third-party font request on a page whose speed Google scores directly.

Archivo descends from American gothic signage, which is the lettering this world is physically made of: painted column heads and stamped card labels. The variable `wdth` axis does the work that two families usually would.

| Role | Class | Setting |
|---|---|---|
| Board headline | `.display` | `wdth 78%`, 700, `-0.018em`, line-height 0.97 |
| Column heads, labels, buttons | `.stencil` | `wdth 72%`, 700, uppercase, `0.2em` |
| Card titles | `.card-title` | `wdth 88%`, 700 |
| Body | default | `wdth 100%`, 400, 17px, 1.55 |

Numerals are `tabular-nums` throughout, because the page is full of counts and durations that should line up.

## Composition

Three columns, `FLAGGED / IN HAND / FIXED`, separated by hairlines rather than boxed as cards. The board is the page structure, so nothing else on the page is allowed to be a card grid.

The blank card sits first in Flagged, top left, where reading starts, so the primary action is in the first viewport without a hero shell around it. Below 900px the columns stack and the form stays first.

Rhythm: `--gutter` `clamp(20px, 4.5vw, 64px)`, `--stack` `clamp(56px, 8vw, 104px)`. Space above a heading always exceeds space below it.

## Motion

One authored moment: `.place`, a card settling onto the board. 480ms, exponential ease-out, from an already-visible default so nothing depends on JavaScript to become readable. Fully removed under `prefers-reduced-motion`.

Nothing else animates. The board's native motion in life is a card being moved, so scattered hover effects would be a different object entirely.

## Refused, deliberately

- Card grids as page structure. The board already is the grid; a second one would compete.
- Any eyebrow or kicker above a heading.
- Gradients, glass, glow. This world is flat enamel on flat steel.
- Icon plus heading plus text triplets, which is exactly what direction D would have shipped.
- A logo cloud, review counts, or "trusted by" line. None of that exists yet and inventing it is the one thing this positioning cannot survive.

## Content rules that bind the design

- The `h1` must contain the ad group's keyword inside a real sentence. Both halves are load bearing: the keyword lifts Quality Score, the sentence keeps a stranger reading.
- Every claim traces to `brand_context/positioning.md`. Nothing on the page is a number Genovation cannot beat in practice.
- No em dash characters anywhere. Enforced by `npm run preflight`.
- A figure that does not exist yet ships as a visibly flagged placeholder, never as a plausible invention. Also enforced by preflight.
