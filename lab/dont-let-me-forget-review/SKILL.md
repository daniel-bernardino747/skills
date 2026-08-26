---
name: dont-let-me-forget-review
description: Run a review session over the due Notes in the dont-let-me-forget Acervo — one at a time, wall items first, each landing on keep / act / archive.
disable-model-invocation: true
---

# Review

The user's ritual. One Note at a time, they say when to stop.

`DLMF=~/.agents/skills/dont-let-me-forget/scripts/dlmf.mjs`

## 0. Two checks

```bash
node "$DLMF" hook-check
node "$DLMF" due --json
```

If `hook-check` says `AUSENTE`, say so in one line before anything else — the reminder is the only thing that makes this ritual happen, and other tools write to that same settings file. Offer to reinstall. Don't let it pass silently.

If `config` would say `NAO_CONFIGURADO`, there is no Acervo: point at `/dont-let-me-forget` and stop.

## 1. Scoreboard

Open with the real numbers, never a trimmed version:

> **5 vencidas, 1 na Parede.** Vamos uma de cada vez — para quando quiser.

Showing the true count while letting them stop after two is the point. Fatigue is theirs to manage; ignorance isn't.

## 2. One Note at a time

Take them in the order `due` returned. **That order is not yours to change** — Parede items come first and are never skipped.

For each, show:

- the **título** and the **corpo** (`node "$DLMF" show <arquivo>`)
- **`Por que guardei`**, always — it's what reconstructs their past interest
- the **history**, when there is one: *"quarta vez que você adia isso, e nas quatro você disse que ia ver depois."* Say it plainly. That sentence is the pressure that makes a decision happen.
- whether it's **na Parede**

Then close with the three landings, in one line, always — even for someone who has done this fifty times:

> **ainda quero** (volta mais tarde) · **agora** (vou fazer — e digo o quê) · **chega** (morreu)

Na Parede são duas, e diga por quê:

> **agora** (vou fazer — e digo o quê) · **chega** (morreu) — daqui não se adia.

One line, always the same words, right after the Note. It is not a menu that explains itself; it is the vocabulary of the ritual, and a Note that ends without it leaves the user guessing what kind of answer is being asked for. Any of the three accepts instruction attached to it — *"ainda quero, mas troca X"* — and the user learns that by using it, not by being told each time.

Then wait.

## 3. The three landings, and the rider

Every landing accepts free-form instruction attached to it. **Execute the rider first**, then record the landing.

| the user says | you run |
|---|---|
| *ainda quero* | `advance <arquivo> --nota "<o que eles disseram>"` |
| *agora* | `act <arquivo> --artefato "<what now exists>"` |
| *chega* | `archive <arquivo> --motivo "<why it's dead>"` |

Riders are the normal case, not the exception:

- *"ainda quero, mas troca X"* → edit the Note's prose, then `advance`.
- *"agora, cria o repo"* → create the repo, **then** `act --artefato "repo dont-let-me-forget criado"`.
- *"chega, mas extrai o tópico 5 numa nota nova"* → capture the new Note first (`add`), then `archive` the original with a motivo that points at what survived.

Two rules the script enforces, and you should not argue with:

- **`act` needs a nameable artifact.** What exists now that didn't before — repo created, issue opened, reading done, Note derived. If the user can't name one, it wasn't acting, it was deferring: run `advance` instead and say so.
- **From the Parede there is no `advance`.** The script refuses. Don't look for a way around it — that wall is why the system works.

After each Note: *"próxima?"* Stop the moment they want to stop.

## 4. Close

When they stop, or the queue empties:

```bash
node "$DLMF" commit --m "<one line about the session>"
```

**Ask first.** They may have edited Notes by hand in an editor during the week and want to see the diff before it goes in:

> Commitar tudo, ou deixar na worktree?

If they leave it, say plainly that there is no remote copy until they do.

## Anti-patterns

- Dumping all due Notes at once. That's the wall of text they scroll past and answer on autopilot — worse than not reviewing, because it fills the Acervo with decisions they never made.
- Advancing a Note without recording what they said. The `adiamentos` list is what makes the *next* review honest.
- Showing a Note without the line of landings. The user is left composing an answer in whatever words come to mind, and the ritual has no vocabulary — the whole point of three fixed words is that they're the same every week.
- Deleting anything. This system never deletes. Archiving is the terminal state; removal is manual and theirs alone.
