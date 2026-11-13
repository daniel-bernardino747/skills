# O Cânone é público, com uma demo por princípio

O Cânone de UI ([ADR-0007](./0007-canone-de-ui-mora-na-skill-e-e-fixado-por-tag.md)) vira um
site público no GitHub Pages. Cada princípio aparece com a sua regra, as fontes e uma
**demo**: uma página pequena que mostra lado a lado o caso que segue e o caso que viola.

Quase todo princípio de aparência e de movimento foi decidido olhando, e não lendo. As
demos que surgiam durante a captura iam para o scratchpad e se perdiam. Agora ficam no
repositório, ao lado do texto.

## Como

- As demos ficam em `dont-mess-up-ui/demos/<ID>.html`, uma por princípio. Cada uma é uma
  página independente que usa a base comum `_kit.css`/`_kit.js`. O formato está em
  `FORMAT.md`, na seção Demo.
- O site é gerado por `scripts/build-canon-site.mjs` a partir dos `.md` do Cânone. Ninguém o
  edita à mão, e ele não fica versionado (`_site/` está no `.gitignore`).
- Cada princípio tem uma página própria (`<ID>.html`), com anterior e próximo. Um menu
  lateral dá acesso a todas as páginas: visão geral, "Usar num projeto" e todos os princípios
  agrupados por domínio. No celular, o menu vira uma gaveta.
- `.github/workflows/canon-site.yml` publica o site a cada push na `main` que toca o Cânone
  e a cada tag `canon-v*`. O site sempre é gerado da `main` e marca os princípios que ainda
  não entraram em nenhuma tag.
- A captura passa a criar a demo de todo princípio visual antes de pedir a aprovação. Um
  princípio `manual`, ou que não tem nada para ver, fica só com o texto.

## Consequências

- O site mostra apenas o Cânone vigente. Os candidatos que caíram na peneira não são
  registrados. Os aposentados aparecem com uma linha cada.
- As demos são instaladas junto com a skill. São poucos KB, e separar exigiria uma exceção no
  instalador.
- As demos violam o Cânone de propósito. Elas não são código de produto e não passam pela
  revisão.
