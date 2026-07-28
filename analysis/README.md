# analysis/ — skills de terceiros que estou estudando

Um arquivo por skill analisada: `analysis/<owner>-<skill>.md`.

**Aqui só entram notas — nunca o código alheio.** Este repositório é público; copiar o
`SKILL.md` de outra pessoa para cá, mesmo com o rótulo de "análise", é redistribuição.
Para ler o original na hora da análise, sem instalar nada:

```bash
npx skills use owner/repo@nome-da-skill
```

## Formato

```markdown
---
source: owner/repo@nome-da-skill
status: analisando
---

# nome-da-skill

## O que ela faz

## O que ela faz bem
<!-- o padrão concreto que vale roubar -->

## O que eu faria diferente

## Veredito
```

## Os quatro status, e o que cada um obriga

| status | significa | próximo passo |
|---|---|---|
| `analisando` | ainda lendo | — |
| `adotar` | quero usar como está | adicionar a fonte em `skills.manifest.json` |
| `inspirar` | quero o padrão, não a skill | criar em `lab/`, com a linha de origem no fim do `SKILL.md` |
| `descartar` | não serve | nada — a nota fica para eu não reanalisar isso em seis meses |

O status é o que impede esta pasta de virar cemitério de rascunhos: toda nota ou está em
aberto, ou já produziu uma entrada no manifesto, uma skill em `lab/`, ou uma decisão
registrada de não usar.
