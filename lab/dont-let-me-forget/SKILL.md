---
name: dont-let-me-forget
description: Save something into a resurfacing queue that brings it back on a 1d/3d/1w/2w/4w ladder until it is acted on or archived. Use when the user says they don't want to forget something, wants to keep an idea, a reading, a project they might do, or a rabbit hole they have no time for right now.
---

# Capture

You are writing one Note into the user's Acervo and then **getting out of the way**.

`DLMF=~/.agents/skills/dont-let-me-forget/scripts/dlmf.mjs`

## This is a parenthesis

The user hit pause in the middle of something else. Honor that literally:

- Do **not** re-plan, summarize the session, or "while we're here" anything.
- Do **not** read files you weren't already reading to enrich the Note.
- End by restating in **one line** what the user was doing, and resume it.

Budget: a draft, one approval, one command. Nothing else.

## 1. Is there an Acervo yet?

```bash
node "$DLMF" config
```

If it prints `NAO_CONFIGURADO`, run the setup below **before** capturing. Otherwise skip to step 2.

<details>
<summary>Setup (first use only)</summary>

Ask three things, in one message, with the defaults stated:

1. **Where does the Acervo live?** — default `~/Code/dont-let-me-forget`
2. **Version it with git?** — default **yes**
3. **Install the session-start reminder?** — default **yes**. Explain in one line what it does: prints how many Notes are due when a Claude Code session starts, silent when none are. It appends to `~/.claude/settings.json` and backs the file up first.

Then:

```bash
node "$DLMF" setup --path "<path>" [--no-git] [--no-hook]
```

If git is on and there is no remote, offer to create the private repo — and **ask before running it**, it publishes to GitHub:

```bash
cd "<acervo>" && gh repo create --private --source . --remote origin
```

</details>

## 2. Draft the Note, show it, wait

You were there when the insight happened. Spend that context — the user should not have to explain what they just saw.

- **Título** — a specific claim or intent, not a topic. *"O CLI apaga o diretório canônico em todo add"*, not *"sobre o instalador"*.
- **Corpo** — a short paragraph of prose, in **Portuguese**. What it is. Enough that it stands alone in four weeks.
- **Por que guardei** — mandatory, and the most important line in the file. Why *this user, today* cared. The script refuses the Note without it.
- **Origem** — where it came from: `repo @ branch — caminho/arquivo`, a URL, or omit it if it came from nowhere.

Show the draft compactly and wait for one beat. The user says `ok`, or corrects one thing. **Do not save before they answer.**

If they invoked with an argument (*"guarda a ideia do X"*), that argument steers the Título — still draft the rest. If the thing isn't in the session at all (*"lembrei que quero estudar Rust"*), there's nothing to mine: write what they said, ask for the *why* if it isn't obvious, don't invent context.

## 3. Save

```bash
node "$DLMF" add \
  --titulo "<título>" \
  --porque "<por que guardei>" \
  --origem "<origem>" <<'NOTA'
<corpo em prosa>
NOTA
```

Confirm in **two lines at most** — the filename and when it comes back — then return to what the user was doing.

## What this skill does not do

It does not commit (the review does that), does not review, does not list, and does not delete. The Note enters at stage `1d` and comes back tomorrow. Everything after that belongs to `dont-let-me-forget-review`.
