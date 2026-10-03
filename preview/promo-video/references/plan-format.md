# PLAN.md

The planning mode writes this file and the `--exec` mode reads it. It sits at `promo/<slug>/PLAN.md`. The video project is created later, next to it, at `promo/<slug>/video/`.

The frontmatter mirrors HyperFrames' `BRIEF.md` on purpose (`/hyperframes` → `references/brief-format.md`). The build copies those keys straight into the brief, so the HyperFrames workflow finds every answer already confirmed and asks nothing again.

## Frontmatter

```yaml
---
status: confirmed            # draft while planning; only `confirmed` can be executed; `built` after render
product: Acme Board
slug: acme-board
source:                      # what the plan was grounded in
  repo: .
  url: https://acme.app
  capture: promo/acme-board/capture
# --- BRIEF.md keys (canonical values) ---
workflow: product-launch-video
flow: automation
storyboard: yes              # always yes unless the user explicitly chose one-shot
message: "Seu time enxerga o projeto inteiro numa tela"
destination: x-feed          # x-feed | linkedin-feed | instagram-feed | reels | tiktok | shorts | youtube | landing
aspect: 1080x1080            # derived from destination
language: pt-BR
audience: "tech leads de times de 5-20 pessoas"
length: 30s
angle: problem-solution      # the chosen concept's shape
narration: no                # no | minimal | yes
---
```

## Body

Write every section that has content. Keep the user's own words where they matter.

```markdown
## Intent

<The chosen concept in a paragraph: what the video is, for whom, why now, the tone in the user's own words. Name the concept and the motion signature.>

## Produto

<What step 1 read: one line per fact, with where it came from (README, /pricing, capture/home.png). This is what keeps the build from inventing.>

## Assets

- promo/acme-board/capture/screens/board.png - board view; the hero of beats 2-3
- public/logo.svg - logo; the closing lockup
- <path> - <what it is> - <which beat uses it>

## Beats

| # | tempo | na tela (asset real) | texto na tela (exato) | motion | transição | som |
|---|---|---|---|---|---|---|
| 1 | 0.0-3.0 | board.png, só o card "Atrasado" | "Cadê esse projeto?" | card treme e fica vermelho | zoom-out pra board inteira | whoosh |
| ... |

## Look & Motion

- palette: #0F172A bg, #6366F1 accent, #F8FAFC text (from tailwind.config.ts)
- type: Inter 700 headlines, Inter 500 UI (from app/layout.tsx)
- easings: expo.out to enter, power2.inOut to move; durations: enter 0.5s, hold >= 1.2s per 4 words, exit 0.3s
- transitions: one family only - <e.g. zoom-through into the next UI element>
- UI treatment: recreated in HTML and animated element by element (not a flat screenshot) on beats <n>

## Som

- music: <mood>, <BPM range>, cuts on the beat
- sfx: <yes/no, where>
- narration: <no | minimal: the lines | yes: script>

## Customizations

- <bespoke asks the build must honor, e.g. "count-up no 3x da beat 4", "logo letra por letra no fim">

## Notes

- <constraints, references, things to avoid>

## Log

- 2026-10-01 plan confirmed
```

## Rules

- `status: confirmed` only after the user's explicit yes on the full summary.
- On-screen texts in `## Beats` are the final copy. The build renders them as written.
- Every asset path exists on disk when the plan is confirmed.
- A later change of mind (in chat or during the build) is written back here, and to `video/BRIEF.md` once it exists. A decision that lives only in chat is lost on resume.
