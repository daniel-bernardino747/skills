---
name: promo-video
description: Plan a motion-design promo video for a webapp or website by talking it through with the product in hand, ending in a confirmed PLAN.md. With --exec, build that plan as a HyperFrames video.
disable-model-invocation: true
---

# Promo video

Two modes, one artifact between them.

- `/promo-video` (or `/promo-video <url | path>`) is the **planning conversation**. It ends in a confirmed `promo/<slug>/PLAN.md` and stops there.
- `/promo-video --exec [path/to/PLAN.md]` is the **build**. Read [references/exec.md](references/exec.md) and follow it. Do not run the planning conversation in this mode. If there is no confirmed plan, say so and offer to plan first.

The split exists because this session's research showed the same thing every time: the videos that look like motion design come from a plan the model executes, not from a vague prompt. Planning is cheap and conversational. Building is expensive and should run without being asked questions.

The craft rules that both modes obey live in [references/craft.md](references/craft.md). Read it before step 3.

## Planning

Talk to the user in Portuguese. **One question per message**, recommended answer first, with the reason. Never send a list of questions.

### 1. Get the product in hand, before any question

Work out what the product is from what is already there. Ask only when nothing is.

- **Repo in cwd:** read the README, the routes/pages, the landing copy, pricing, and the brand: CSS variables, Tailwind theme, fonts, logo files (`public/`, `assets/`, `*.svg`).
- **URL** (given, or found in the README/package.json `homepage`): capture it with real screenshots and tokens.
  ```bash
  npx hyperframes capture <URL> -o promo/<slug>/capture
  ```
  If capture fails, use the browser tools to take screenshots of the main screens. Never describe a screen you haven't seen.
- **Screenshots or docs the user pointed at:** read them.

Pick `<slug>` from the product name. Everything this skill writes lives under `promo/<slug>/` in the product's repo, or in cwd when there is no repo.

### 2. Read the product back

Open with what you understood, in five short lines, so the user corrects you before you build on it:

> **O que eu entendi:** <o que faz, em uma frase> · **pra quem:** <público> · **os 3 momentos mais fortes na tela:** <tela/feature concreta>, <...>, <...> · **visual:** <cores, fonte, tom> · **o que falta:** <ex.: não achei o logo em SVG>

The "3 strongest moments" are real screens or interactions you saw. They become the video's material. The user's correction here is worth more than any later question.

### 3. Where it plays and what it is for

One question each, skipping any the user already answered:

1. **Onde vai passar?** This sets the aspect ratio: X/LinkedIn feed → 1080x1080 · Reels/TikTok/Shorts → 1080x1920 · landing page/YouTube → 1920x1080.
2. **Qual o trabalho do vídeo?** Lançamento, hero da landing, anúncio pago, changelog de uma feature, or a site tour ("mostrar como é" instead of "vender").

Then derive the **message** (the one sentence the video must leave behind) and echo it back for a yes. Don't go on until it's clear.

### 4. Pitch three concepts

Three concepts that are actually different, each built from this product's real material. For each one:

- **nome** and a one-line pitch
- **gancho dos 3 primeiros segundos:** exactly what is on screen and what moves
- **forma:** problem → solution, a feature tour, one feature in depth, before/after, a number that grows, ...
- **telas usadas:** which of the real screens
- **assinatura de motion:** the one move people will remember, e.g. the UI rebuilding itself piece by piece, a camera diving into a card, letters of the logo falling into place
- **duração:** inside 15–60s, with the reason

Recommend one, with the reason. Mixing ("o gancho do 2 com o fim do 1") is a valid answer.

### 5. Beat sheet

Turn the chosen concept into timestamped beats and show them as a table:

| # | tempo | na tela (asset real) | texto na tela (exato) | motion | transição | som |

- Every on-screen text is the **final copy**, in the video's language. Nothing like "[headline here]".
- Every visual points to a real asset path or a captured screen. If a beat needs something that doesn't exist (a number, a testimonial, a logo), ask for it or cut the beat. **Never invent product data.**
- The beats must add up to the duration.

Change only the beats the user names, and show the table again each time.

### 6. Look, motion, sound

One short block, recommended from what you read in step 1, for the user to adjust:

- **visual:** brand palette and fonts (the hex values and family names you found), plus the background treatment
- **vocabulário de motion:** 2 easings, the default durations (enter, hold, exit) and one transition family. Use the same vocabulary across the whole video.
- **som:** music mood and BPM range, SFX on the transitions (yes/no), narration (none/minimal/full; default none for under 30s)

### 7. Check and hand off

Before the summary, do one **integration check**: look for a consequence that the answers create only together, and propose a fix. Examples: 9:16 with a dense dashboard screen means zooming into one card per beat. A 15s video with 6 beats means each beat lasts 2.5s and the text has to fit in 4 words.

Then present the full plan with two separate groups: **o que você decidiu** and **o que eu inferi** (with the reason for each). Corrections mean showing it again. Only an explicit yes confirms.

On the yes, write `promo/<slug>/PLAN.md` in the format of [references/plan-format.md](references/plan-format.md), with `status: confirmed`, and close with:

> Plano salvo em `promo/<slug>/PLAN.md`. Para construir: `/promo-video --exec` (de preferência numa sessão nova, com esforço alto).

Then stop. The plan is the deliverable of this mode.

## Anti-patterns

- Asking before reading. The product is in hand, so the first message is the read-back, not "me conta sobre o produto".
- Generic concepts. "Um vídeo dinâmico mostrando as features" fits any product, so it fails. Each concept has to name screens from this product.
- Placeholder copy, or numbers you don't have. The build will render exactly what the plan says.
- Starting to build in planning mode. Even if the user is excited, finish the plan, save it, and point at `--exec`.
