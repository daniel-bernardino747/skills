---
name: dont-let-me-forget-browse
description: Walk the dont-let-me-forget Acervo — list the live queue, or draw one Note at random from everything ever saved, archive included, ignoring the schedule.
disable-model-invocation: true
---

# Browse

The low-stakes half of the system. The review has deadlines and a wall; this doesn't.

`DLMF=~/.agents/skills/dont-let-me-forget/scripts/dlmf.mjs`

## Listing

```bash
node "$DLMF" list          # fila viva, agrupada em vencidos / hoje / próximos
node "$DLMF" list --all    # inclui o archive
```

Default shows only the **live queue**, with the archive count on the last line. Show everything only when asked — the live queue is small on purpose, and burying it under two hundred closed Notes defeats that.

## The draw

```bash
node "$DLMF" random
```

Draws one Note from the **entire Acervo** — live queue and `archive/` together, acted-on and abandoned alike. It **ignores the schedule entirely**. That's deliberate: this is the channel that serves the reading you just want to bump into again, without a second scheduling machine.

Show the Note whole. Say where it came from — live queue, or archive with its closing line. If it's archived, the closing line is often the interesting part: *"criei o repo e nunca abri"* read six times is a diagnosis about the user, not about the Note.

Then let it be. No decision is owed here.

## Resurrecting

If a drawn Note lights the user back up:

```bash
node "$DLMF" revive <arquivo>
```

It returns to the live queue at stage `1d`, as if captured today, and the resurrection is recorded in its `adiamentos`.

**This is the only transition browse performs.** It's a deliberate leak in the funnel, and it's fine precisely because it's hard to trigger: chance has to surface that exact Note out of hundreds, *and* the user has to want it again months later with nothing pulling them toward it. That's earned recurrence, not granted.

Everything else — advancing, acting, archiving — belongs to `dont-let-me-forget-review`. Don't offer those here. The review has authority because it has a deadline; making every landing available at all hours dissolves it, and browse is supposed to be light.

## Searching

There is no `search` subcommand. The Acervo is plain Markdown in one directory — use `grep` on it:

```bash
grep -ril "<termo>" "$(node "$DLMF" config --json | node -pe "JSON.parse(require('fs').readFileSync(0,'utf8')).acervo")"
```

Then `node "$DLMF" show <arquivo>`.
