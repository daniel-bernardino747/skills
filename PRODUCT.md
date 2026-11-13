# Product

<!-- impeccable:product-schema 1 -->

Escopo: a única superfície web deste repositório, o site público do **Cânone de UI**.
As skills em si não têm interface.

## Platform

web

## Stack

HTML/CSS estático gerado por `scripts/build-canon-site.mjs` (Node, sem dependências) a partir de
`dont-mess-up-ui/principles/*.md` e `dont-mess-up-ui/demos/*.html`. Publicado no GitHub Pages
pelo workflow `.github/workflows/canon-site.yml`. Sem framework nem etapa de bundling.

## Users

Devs e designers de fora que encontram o site. Querem aprender um princípio de UI, UX ou
movimento com uma regra concreta e uma demonstração, ou adotar a revisão automática
`dont-mess-up-ui` nos próprios projetos. Também chega aqui quem clica num link vindo de um
comentário da revisão num pull request.

## Product Purpose

Publicar o Cânone (princípios pessoais de aparência, comportamento e movimento) de um jeito
que dê para entender e verificar. Cada princípio tem uma regra que se confere lendo só o
código, o porquê, os sinais no código, as exceções, a fonte e uma demo que mostra lado a lado
o caso que segue e o que viola. Dá certo quando o leitor sai entendendo a regra e consegue
apontar a violação no próprio código.

## Positioning

Não é um guia de estilo genérico. Cada princípio foi confirmado um a um por uma pessoa, tem
uma regra binária ("viola" ou "não viola") e é a mesma régua que uma revisão automática
aplica em PRs reais, fixada por versão (`canon-vN`).

## Operating Context

- O site cresce a cada sessão de captura (`/dont-mess-up-ui-capture`). Princípios entram,
  são aposentados e nunca têm o ID reaproveitado.
- O leitor chega pela página inicial ou direto na página de um princípio (`MOT-008.html`).
- As demos rodam em iframe e são interativas: repetir, loop, câmera lenta, congelar, clicar.

## Capabilities and Constraints

- Uma página por princípio, menu lateral com toda a documentação, página "Usar num projeto".
- O conteúdo é gerado. Nada é editado à mão em `_site/`.
- As demos violam o Cânone de propósito, para mostrar o erro.
- Idioma: pt-BR. Uma versão em inglês é desejada, mas não está decidida.
- Domínio UX ainda vazio. O site precisa ficar bem com domínios vazios.

## Brand Commitments

Marca pessoal de Daniel Bernardino, aplicada em https://www.teamdbsolutions.com/ e
https://elo.teamdbsolutions.com/:

- tema escuro como base (`#09090b`, texto `#fafafa`), com tema claro (`#f8f8fc`, texto `#09090b`);
- verde `#00bb7f` como cor de destaque (texto de destaque no claro: `#006c49`);
- Geist e Geist Mono. No Elo, Overpass em peso 900 nos títulos e Geist Mono em caixa alta
  espaçada nos rótulos;
- botões em pílula, avatar ilustrado, fundo com grade de pontos discreta (Elo).

## Evidence on Hand

- 13 princípios (UI-001, MOT-001 a MOT-012) com demos em `lab/dont-mess-up-ui/demos/`.
- Fontes externas citadas e parafraseadas em cada princípio.
- Não existem depoimentos, números de uso nem lista de projetos que usam a revisão. Não inventar.

## Product Principles

1. A regra vem antes da opinião: todo texto tem que ajudar a decidir "viola ou não viola".
2. Mostrar, não descrever: a demo é a prova, e fica perto da regra.
3. Fonte única: o site espelha os `.md` do Cânone e nunca diverge deles.
4. O site pratica o próprio Cânone: o movimento dele segue as regras que publica.

## Accessibility & Inclusion

O site abre no tema escuro e muda para o claro só quando o leitor escolhe; a escolha fica
salva no navegador. Com `prefers-reduced-motion`, as demos não tocam sozinhas. Contraste AA
no texto.
