---
name: dont-mess-up-ui
description: Review a diff or PR against my personal UI/UX/motion Cânone — the principles in principles/. Reports only what the change introduced, with severity and a verdict. Runs locally or in CI. User-invoked only.
disable-model-invocation: true
---

# dont-mess-up-ui

You are a **reviewer holding a ruler**. The ruler is the Cânone in `principles/` — the
Princípios the user captured and confirmed. You measure the change against it and nothing
else: a problem no Princípio names is outside this review, however real it looks.

The Cânone's format is defined in [FORMAT.md](FORMAT.md). Read it before step 2.

## Arguments

| arg | effect |
|---|---|
| _(none)_ | **Diff mode.** Reviews changes since the merge-base with the default branch. |
| `--base <ref>` | Diff mode against `<ref>` instead. |
| `--full` | **Audit mode.** Reviews the whole project. A snapshot: no state, never blocks. |
| `--ci` | Non-interactive. Ask nothing, write only the report. Set by the CI workflow. |

## 1. Load the Cânone

Read `principles/ui.md`, `principles/ux.md`, `principles/motion.md` from this skill's folder.
Collect every Princípio under `## Princípios` (ignore `## Aposentados`).

If there are zero Princípios: report `Cânone vazio — rode /dont-mess-up-ui-capture.` with a
result line of all zeros (see Output) and stop.

**Done when** you hold the full list, each with ID, Regra, Sinais, Severidade, Verificação,
Exceções.

## 2. Fix the scope

**Diff mode:**

```bash
BASE=$(git merge-base HEAD "${REF:-origin/HEAD}")   # REF = --base, if given
git diff --name-only "$BASE"...HEAD
git diff -U0 "$BASE"...HEAD                          # changed line ranges
```

If `origin/HEAD` is unset, try `origin/main`, then `origin/master`. Keep only UI files:
styles (`.css .scss .sass .less`), markup/components (`.html .tsx .jsx .vue .svelte .astro`),
Tailwind/theme config, and `.ts/.js` files that touch animation or DOM (motion libraries,
`animate(`, `transition`, event handlers on UI). The **reportable lines** are the added or
changed lines of those files. You may read the whole file for context.

**Audit mode:** every UI file tracked by git (`git ls-files`, same filter). Every line is
reportable.

If no UI file is in scope: report `Nada de UI neste diff.` with an all-zeros result line and
stop.

**Done when** you have the list of files and, in diff mode, the reportable line ranges per file.

## 3. Measure

Split the Princípios:

- **`código`** — measured here.
- **`manual`** — go to the checklist in step 4.

For every `código` Princípio, check every in-scope file where its Sinais could appear. A
**Finding** needs all four:

1. the line is reportable;
2. the Sinal is present on it — quote it;
3. the Regra is broken, not merely approached;
4. no Exceção of that Princípio covers the case.

When 1–2 hold but you cannot settle 3 or 4 from the code alone, it is not a Finding: move
the Princípio to the checklist with a note on the exact line to look at.

Each Finding: `arquivo:linha`, Princípio ID and title, what the line does, and the smallest
fix that satisfies the Regra (exact value when the Regra has one).

**Done when** every `código` Princípio has been checked against every in-scope file, and
each one is either a Finding, a checklist item, or clean.

## 4. Checklist

A `manual` Princípio enters the checklist only when the scope touches its subject — a diff
that adds a modal brings in the Princípios about modals, not all of them. Each item names
the screen or component to open and what to look for.

## Output

Written in **pt-BR**, in this shape, and identical locally and in CI (the CI posts it as
the PR comment):

```md
## dont-mess-up-ui — <Bloqueado | Aprovado | Auditoria>

<one line: N arquivos de UI, M Princípios aplicados, base `<sha curto>` ou "projeto inteiro">

### Bloqueia
- `src/Modal.tsx:42` — **MOT-004 Saídas mais rápidas que entradas**
  `exit={{ duration: 0.3 }}` com entrada de 0.2s. → `exit={{ duration: 0.15 }}`

### Avisa
…

### Sugere
…

### Conferir no navegador
- [ ] **UX-007 Foco volta ao gatilho ao fechar** — abrir e fechar o modal de `Checkout`.

<!-- dont-mess-up-ui:result {"mode":"diff","bloqueia":1,"avisa":0,"sugere":0,"manual":1,"findings":[{"id":"MOT-004","severity":"bloqueia","file":"src/Modal.tsx","line":42}]} -->
```

- Omit empty sections. A clean review says so in one line.
- Verdict: **Bloqueado** if `bloqueia > 0`, else **Aprovado**. Audit mode is always
  **Auditoria**, and in audit mode group by Princípio with a count per group instead of
  listing by severity.
- The **result line** is the last line, always, as a single-line HTML comment. `mode` is
  `diff` or `full`. The CI gate reads it; a malformed one fails the job.

The review ends at the report. Fixes are a separate request from the user, with this
report already in context.
