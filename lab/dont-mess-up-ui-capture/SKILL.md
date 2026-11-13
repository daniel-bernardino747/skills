---
name: dont-mess-up-ui-capture
description: Turn sites, topics or installed skills into confirmed Princípios of my UI/UX/motion Cânone, one at a time, written into the dont-mess-up-ui source. User-invoked only.
disable-model-invocation: true
---

# dont-mess-up-ui-capture

You are running a **sieve**. Material goes in (a site, a topic, a skill), and only what the
user confirms comes out as a Princípio of the Cânone that `dont-mess-up-ui` reviews against.
Most candidates should fall through. A Cânone of twelve Princípios the user stands behind
beats sixty they skimmed.

Talk to the user in **pt-BR**. Write Princípios in **pt-BR**.

## 0. Find the source

The installed copy is a snapshot (ADR-0002), so writing there would be lost on the next
install. Write to the repository:

```bash
REPO=${SKILLS_REPO:-~/Code/skills}
ls -d "$REPO"/{skills,preview,lab}/dont-mess-up-ui 2>/dev/null | head -1
```

That folder is `$SRC`. Read `$SRC/FORMAT.md` (the format, single source of truth) and all
three `$SRC/principles/*.md` (the current Cânone). If `$SRC` is not found, ask the user where
the repository is and stop until they answer.

## 1. Intake

The user gives one or more **Fontes** and, optionally, a **foco** ("easing de modais"):

| Fonte | how to read it |
|---|---|
| URL of a text page (article, guideline, docs) | fetch it as text |
| URL whose point is visual (motion demos, interaction galleries, a product site) | open it in the built-in browser, look, interact with the demos; text alone misses the point |
| a topic, no URL | your own knowledge; the Fonte becomes `assunto: <tema>` |
| an installed skill (`review-animations`, `apple-design`, …) | read its files under `~/.agents/skills/<nome>/` |

If the user gave no foco and the material is broad, ask for one before reading.

## 2. Candidates — the cut

From the material, list candidate Princípios as a numbered list: **title + one line each**,
grouped by domain (UI / UX / MOT). Mark any that duplicate or contradict an existing
Princípio with its ID.

Stop. The user cuts the list ("fica 2, 5, 7"). Proceed only with what survives. This step is
mandatory: detailing before cutting turns one site into forty questions.

## 3. One at a time

For each survivor, in order, draft the full Princípio in the FORMAT.md shape, with the next
free ID of its domain, and put it to the user. The user answers one of:

- **aprova** → keep as drafted;
- **edita** → apply their change, show again;
- **manual** → set `Verificação: manual`, `Sinais no código: —`;
- **descarta** → drop it.

Hold the **Regra** to the bar: someone reading only a diff can say "viola" or "não viola".
When the concept is a feeling ("animações devem ser elegantes"), press for the observable
behind it — a value, a property, a pattern. If none exists, offer exactly two exits:
`manual`, or descarta.

Paraphrase every Fonte in your own words. Quote nothing beyond a short term of art.

**Done when** every survivor is approved, set to manual, or discarded — and the user has
seen the final text of each one kept.

## 4. Conflict

Before writing a kept Princípio, compare it with every existing Princípio of its domain. When
an existing one says otherwise or covers the same ground, stop and ask:

1. **substitui** — the old one moves to `## Aposentados`, `substituído por <novo ID> em <data>`;
2. **convivem** — narrow one of them through its `Exceções` so they no longer overlap; show
   both texts;
3. **descarta o novo**.

The existing Cânone changes only through this question.

## 5. Write

Append kept Princípios under `## Princípios` of their domain file in `$SRC/principles/`,
replacing `_Nenhum ainda._` if present. Apply any retirement from step 4. Then:

```bash
git -C "$REPO" diff -- "$SRC/principles"
```

Show the diff.

## 6. Close

Propose, and run each only on the user's yes:

1. **Commit** — `dont-mess-up-ui: <n> princípios de <fonte curta>`.
2. **Tag** — the next `canon-vN` (`git -C "$REPO" tag -l 'canon-v*'`, highest N + 1; `canon-v1`
   if none). Repos in `gate` mode pin this tag; without a new tag they keep the old ruler.
   Pushing the tag is a separate yes.
3. **Reinstall** — `node "$REPO/scripts/install.mjs" -s dont-mess-up-ui`, so the local review
   uses the new Cânone.

End with one line: how many Princípios entered, by domain, and how many fell through the sieve.
