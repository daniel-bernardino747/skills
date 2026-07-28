# skills/ — minhas skills estáveis

Uma pasta por skill: `skills/<nome>/SKILL.md`. Sem categorias — o nome já diz o domínio.
Se um dia passar de ~20, categorizar é um `git mv` e uma linha em `scripts/install.mjs`.

O que entra aqui: skill que eu uso e na qual confio. Tudo em `skills/` é instalado por
padrão quando eu rodo `node scripts/install.mjs`, e passa a competir pela atenção do
agente através do campo `description`. Skill meio-pronta aqui é ruído — o lugar dela é
[`lab/`](../lab/).

## Convenções

- `SKILL.md` é escrito **em inglês**. É o modelo que lê, e o `description` casa melhor em
  inglês com o resto do ecossistema instalado ao lado. Docs para humanos ficam em português.
- Skill que nasceu de outra leva uma linha de origem no fim do arquivo:
  `Derivado de owner/repo@nome (MIT)`. Inspiração é livre; texto derivado carrega atribuição.

## Promover um experimento

```bash
git mv lab/minha-skill skills/minha-skill
node scripts/install.mjs --mine
```

## Depois de editar

A instalação **copia** os arquivos — o agente não vê a edição até você reinstalar:

```bash
node scripts/install.mjs --mine
```
