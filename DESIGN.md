---
name: Cânone de UI
description: Site público do Cânone de UI; uma ficha de régua por princípio, com a demo como bancada.
colors:
  ink-floor: "#09090b"
  chalk: "#fafafa"
  muted-zinc: "#a1a1aa"
  faint-zinc: "#8b8b94"
  hairline: "#ffffff1a"
  hairline-strong: "#ffffff2e"
  surface-veil: "#ffffff08"
  surface-veil-2: "#ffffff0f"
  card-veil: "#ffffff06"
  specimen-object: "#e4e4e7"
  signal-green: "#00bb7f"
  verdict-red: "#ff6568"
  caution-amber: "#f5b041"
  dot-grid: "#ffffff26"
  paper-floor-light: "#f8f8fc"
  ink-light: "#09090b"
  muted-light: "#52525b"
  faint-light: "#63636b"
  hairline-light: "#09090b1a"
  hairline-strong-light: "#09090b2e"
  specimen-object-light: "#27272a"
  signal-green-text-light: "#006c49"
  verdict-red-light: "#c8001a"
  caution-amber-light: "#8a5a00"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(32px, 4.2vw, 48px)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 700
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    letterSpacing: "-0.02em"
  rule:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(19px, 1.7vw, 22px)"
    fontWeight: 450
    lineHeight: 1.5
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "\"ss01\""
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: "24px"
  mono-id:
    fontFamily: "Geist Mono, ui-monospace, Consolas, monospace"
    fontSize: "12px"
    fontWeight: 500
  mono-verdict:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: "20px"
    letterSpacing: "0.06em"
rounded:
  inline: "6px"
  nav: "8px"
  container: "10px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "14px"
  lg: "18px"
  xl: "40px"
  section: "56px"
  gutter: "56px"
  gutter-mobile: "16px"
  sidebar: "288px"
  reading: "64ch"
  content-max: "860px"
components:
  pill:
    textColor: "{colors.muted-zinc}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
    height: "24px"
  pill-id:
    textColor: "{colors.chalk}"
    typography: "{typography.mono-id}"
    rounded: "{rounded.pill}"
    padding: "0 10px"
  pill-bloqueia:
    textColor: "{colors.verdict-red}"
    rounded: "{rounded.pill}"
  pill-avisa:
    textColor: "{colors.caution-amber}"
    rounded: "{rounded.pill}"
  verdict-tag-segue:
    textColor: "{colors.signal-green}"
    typography: "{typography.mono-verdict}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  verdict-tag-viola:
    textColor: "{colors.verdict-red}"
    typography: "{typography.mono-verdict}"
    rounded: "{rounded.pill}"
    padding: "0 8px"
  demo-control:
    textColor: "{colors.chalk}"
    rounded: "{rounded.pill}"
    padding: "5px 13px"
  demo-control-pressed:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink-floor}"
    rounded: "{rounded.pill}"
  theme-toggle:
    textColor: "{colors.muted-zinc}"
    rounded: "{rounded.pill}"
    size: "34px"
  nav-link:
    textColor: "{colors.muted-zinc}"
    rounded: "{rounded.nav}"
    padding: "6px 8px"
  nav-link-current:
    backgroundColor: "{colors.surface-veil-2}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.nav}"
  demo-cell:
    backgroundColor: "{colors.card-veil}"
    rounded: "{rounded.container}"
    padding: "14px"
  pager-card:
    textColor: "{colors.chalk}"
    rounded: "{rounded.container}"
    padding: "14px 16px"
  code-block:
    backgroundColor: "{colors.surface-veil}"
    rounded: "{rounded.container}"
    padding: "16px 18px"
---

# Design System: Cânone de UI

## Overview

**Creative North Star: "A Ficha de Régua"**

Cada página de princípio é uma ficha de régua: a Regra é a manchete, a demo é a bancada onde ela se prova, e os fatos (sinais no código, exceções, fonte) vêm depois, como notas de rodapé de um laudo. O sistema é uma extensão da marca pessoal já estabelecida (teamdbsolutions.com e Elo): chão quase preto, texto quase branco, Geist e Geist Mono, pílulas, e uma grade de pontos discreta que só aparece no topo de cada página.

A densidade é de documento técnico calmo. A cor é quase toda neutra; o pouco de cor que existe carrega veredito, nunca decoração. Verde significa "segue", vermelho significa "viola" ou "bloqueia", âmbar significa "avisa". Os links, o foco e a seleção usam a própria cor do texto, para que o verde nunca seja confundido com "clicável". A profundidade vem de véus translúcidos sobre o chão e de filetes de 1px, não de sombras.

O sistema recusa o template genérico de documentação (prosa cinza com um callout colorido). A Regra é corpo grande na largura de leitura, não um bloco destacado.

**Key Characteristics:**
- Tema escuro por padrão; tema claro só por escolha do leitor, salva no navegador (`canon-theme`).
- Cor como veredito: verde, vermelho e âmbar só aparecem com significado de "segue", "viola/bloqueia" e "avisa".
- Geist para texto e títulos, Geist Mono para IDs, valores e rótulos curtos.
- Duas formas: contêiner com raio de 10px e pílula de 999px.
- Plano: véus translúcidos e filetes de 1px no lugar de sombras.
- As demos são parte do mesmo sistema e seguem o tema do site via `postMessage`.

## Colors

Uma paleta de zinco quase monocromática, em que as únicas cores saturadas são vereditos.

### Primary
- **Verde Sinal** (signal-green): a única cor de destaque da marca. No site, aparece apenas no ponto do wordmark "Cânone ●" e no favicon. Nas demos, é o veredito "segue" (`--ok`) e pode preencher o espécime sob teste (o botão ou ícone que a demo examina, com texto escuro `--on-accent` sobre ele). No tema claro, o texto verde passa a Verde Sinal Profundo (signal-green-text-light) para manter contraste AA; o preenchimento continua no verde da marca.

### Secondary
- **Vermelho Veredito** (verdict-red; claro: verdict-red-light): "viola" nas demos e a severidade "bloqueia" nas pílulas.
- **Âmbar Cautela** (caution-amber; claro: caution-amber-light): somente a severidade "avisa".

### Neutral
- **Chão de Tinta** (ink-floor): fundo do tema escuro, da barra lateral e do cabeçalho fixo dela.
- **Papel Frio** (paper-floor-light): fundo do tema claro.
- **Giz** (chalk; claro: ink-light): texto principal, links, anel de foco, seleção (a 22% via `color-mix`) e o preenchimento do botão de demo pressionado.
- **Zinco Abafado** (muted-zinc; claro: muted-light): o porquê, parágrafos de apoio, itens de navegação em repouso, severidade "sugere".
- **Zinco Tênue** (faint-zinc; claro: faint-light): IDs no menu e na lista, prefixos de domínio, `dt` dos fatos, rodapé, trilha.
- **Filete** (hairline) e **Filete Forte** (hairline-strong): bordas de 1px; o forte em pílulas, botões e no hover.
- **Véus** (surface-veil, surface-veil-2, card-veil): camadas translúcidas para blocos de código, item de menu ativo/hover e células de demo. No claro, a célula de demo é branca opaca.
- **Objeto de Espécime** (specimen-object; claro: specimen-object-light): a bola, o chip e os objetos neutros que se movem nas demos.
- **Pontos da Grade** (dot-grid): os pontos de 1px da grade do topo.

### Named Rules
**The Verde é Veredito Rule.** O verde só diz "segue" (ou é o ponto da marca). Nunca é cor de link, foco, seleção, botão de navegação ou ornamento. Se um elemento verde não significa "segue" e não é o ponto da marca nem um espécime de demo, ele está errado.

**The Foco é Texto Rule.** Links, anel de foco (2px sólido, afastado 2px) e seleção usam a cor do texto. A interação é sinalizada por sublinhado e contraste, não por matiz.

**The Dois Temas, Um Mapa Rule.** Todo token existe nos dois temas com o mesmo nome; o tema troca valores, não papéis. As demos repetem o mesmo mapa em `_kit.css`.

## Typography

**Display Font:** Geist (com ui-sans-serif, system-ui)
**Body Font:** Geist (com ui-sans-serif, system-ui), `font-feature-settings: "ss01"`
**Label/Mono Font:** Geist Mono (com ui-monospace, Consolas)

**Character:** uma família só, de tom técnico e seco, onde a hierarquia vem de peso e tracking negativo. A mono entra como marcador de dado: tudo o que é ID, valor ou código.

### Hierarchy
- **Display** (700, clamp(32px, 4.2vw, 48px), 1.08, -0.035em, `text-wrap: balance`): o h1 de cada página, título do princípio ou "Cânone de UI".
- **Headline** (700, 24px, -0.02em): nome do domínio na visão geral, com o prefixo em mono ao lado.
- **Title** (700, 22px, -0.02em): seções internas ("Na prática", "No CI").
- **Rule** (450, clamp(19px, 1.7vw, 22px), 1.5, -0.01em, máx. 64ch, `text-wrap: pretty`): a Regra do princípio, logo abaixo das pílulas. É a manchete de verdade da página.
- **Body** (400, 16px, 1.65): prosa. O porquê usa 16.5px em Zinco Abafado; parágrafos da hero, 17px em até 62ch.
- **Label** (500, 12.5px, linha 24px): texto das pílulas.
- **Mono ID** (500, 12–13px): IDs no menu e na lista, prefixos de domínio, versão no rodapé do menu. Código inline a 0.84em com peso 500.
- **Mono Verdict** (600, 11px, 0.06em, CAIXA ALTA): somente as etiquetas de veredito das demos (SEGUE, VIOLA, REFERÊNCIA), no estilo de rótulo da marca Elo.

### Named Rules
**The Nada Acima do Título Rule.** Nenhum rótulo, sobretítulo ou etiqueta fica acima do h1. A trilha "Domínio / ID" é navegação, não rótulo; ID, severidade e verificação vão em pílulas abaixo do título.

**The Mono é Dado Rule.** Geist Mono só para IDs, valores, código e etiquetas de veredito. Prosa e títulos nunca em mono.

## Layout

Grade de duas colunas no desktop: menu lateral fixo de 288px (sticky, rolagem própria, filete à direita) e coluna de conteúdo de até 860px com calha de 56px. A prosa principal (Regra, porquê) se limita a 64ch. Cada página abre com 56px de respiro e a grade de pontos (16px de passo, pontos de 1px) nos primeiros 180px do corpo, sumindo por máscara em gradiente.

Ritmo vertical: 56px entre domínios e antes do paginador, 40px entre demo e fatos, 32px antes da Regra, 72px antes do rodapé. Os fatos são uma lista de definição em grade (9.5rem + 1fr) com filetes entre as linhas; a lista de princípios é uma grade de 76px (ID) + título + pílula.

Até 960px o menu vira gaveta: barra superior fixa de 56px com fundo translúcido (92% e blur de 10px), botão pílula "Menu"/"Fechar", gaveta de até 320px que entra com `transform` em 240ms `cubic-bezier(.16, 1, .3, 1)` e escurece o resto da tela. A calha cai para 16px. Até 560px, fatos, lista e paginador colapsam para uma coluna.

As demos se ajustam sozinhas: a altura do iframe vem de `canon-demo-height`, e as células formam uma grade `auto-fit` de no mínimo 190px.

## Elevation & Depth

Sistema plano. A profundidade vem de véus translúcidos do texto sobre o chão (3% a 6% no escuro) e de filetes de 1px; o hover só troca o filete pelo forte ou acende o véu. Não há sombra de elevação em superfícies do site.

### Shadow Vocabulary
- **Scrim da gaveta** (`box-shadow: 0 0 0 100vmax rgb(0 0 0 / .45)`): apenas quando a gaveta do menu está aberta no mobile, para escurecer o conteúdo atrás.

### Named Rules
**The Filete, Não Sombra Rule.** Separação é filete de 1px (`hairline`); ênfase é o filete forte. Sombras são exclusivas do scrim da gaveta e dos espécimes de demo que imitam um produto (um modal, por exemplo).

## Shapes

Duas formas carregam a casa. Contêineres (blocos de código, células de demo, cartões do paginador, estado vazio) têm raio de 10px. Tudo que é controle ou etiqueta (pílulas, botões de demo, botão de tema, botão do menu, link de pular) é pílula de 999px. Raios menores aparecem só em funções internas: 8px nos itens do menu e 6px no código inline e no contorno do foco. Pontos circulares marcam severidade (6px, na cor da pílula) e a marca (8px, verde). O estado vazio usa filete tracejado; a pílula "depois da canon-vN" também.

## Components

### Buttons
Discretos e redondos; nunca preenchidos com cor de marca no chrome do site.
- **Shape:** pílula (999px).
- **Controle de demo** (Repetir, Loop, Câmera lenta 4×, Congelar no impacto): transparente, filete forte, texto Giz, 13px peso 500, 5px 13px. Hover acende o véu e a borda vai a Zinco Abafado. Ligado (`aria-pressed="true"`): invertido, fundo Giz e texto Chão.
- **Botão de tema:** círculo de 34px, filete, ícone SVG de traço 1.8 (sol no claro, lua no escuro) em Zinco Abafado; hover vai a Giz com filete forte.
- **Botão Menu (mobile):** pílula 6px 14px, 14px peso 500, filete forte; o rótulo troca entre "Menu" e "Fechar".

### Chips (Pílulas)
- **Style:** linha de 24px, 0 10px, filete forte, 12.5px peso 500, Zinco Abafado.
- **Variantes:** ID em Geist Mono e Giz; severidade com ponto de 6px na cor do veredito (bloqueia vermelho, avisa âmbar, sugere zinco); "depois da canon-vN" com filete tracejado.
- **Etiqueta de veredito (demos):** Mono Verdict em caixa alta, 0 8px, borda de 1px na própria cor: SEGUE verde, VIOLA vermelho, REFERÊNCIA tênue.

### Cards / Containers
- **Corner Style:** 10px.
- **Background:** véu (`card-veil`) nas células de demo, branco no claro; véu nos blocos de código; transparente no paginador.
- **Shadow Strategy:** nenhuma (ver Elevation & Depth).
- **Border:** filete de 1px; hover do paginador vai ao filete forte em 120ms ease-out.
- **Internal Padding:** 14px nas células, 14px 16px no paginador, 16px 18px nos blocos de código.

### Navigation
- **Menu lateral:** wordmark "Cânone ●" (700, 17px) e botão de tema no cabeçalho fixo; grupos com título em 13px peso 600 e prefixo do domínio em mono à direita; cada princípio é ID em mono (60px de largura) + título. Itens em Zinco Abafado; hover e página atual acendem o véu e vão a Giz. A página atual fica centralizada ao abrir. Domínio vazio mostra "Nenhum ainda" em Zinco Tênue. Rodapé do menu com GitHub e versão em mono.
- **Trilha:** 14px, Zinco Tênue, link do domínio em Zinco Abafado sem sublinhado.
- **Paginador:** dois cartões de 10px, "Anterior" e "Próximo" em 12.5px Zinco Tênue sobre o ID e título.

### Ficha de Princípio (assinatura)
Ordem fixa: trilha, h1, linha de pílulas, a Regra em corpo grande, o porquê em Zinco Abafado, "Na prática" com a demo em iframe transparente, depois os fatos em lista de definição e o paginador. A demo começa acima da dobra em 1440×900.

### Bancada de Demo (assinatura)
Barra de controles em pílula, uma linha de instrução em Zinco Abafado, subtítulos de 13.5px peso 600, e a grade de células, cada uma com título, etiqueta de veredito, palco e legenda em mono 12px. O palco usa o Objeto de Espécime sobre um chão de 2px. As durações multiplicam por `--slow` (4 na câmera lenta). A demo toca uma vez ao entrar na tela e, com `prefers-reduced-motion`, só toca quando o leitor pede. O tema chega do site por `canon-theme`; aberta sozinha, lê a escolha salva.

## Do's and Don'ts

### Do:
- **Do** reservar o verde (#00bb7f) para "segue", o ponto da marca e espécimes de demo.
- **Do** usar a cor do texto em links (sublinhado de 1px em filete forte, deslocado 3px), anel de foco (2px, afastado 2px) e seleção (22%).
- **Do** usar raio de 10px em contêineres e 999px em controles e etiquetas.
- **Do** definir todo token nos dois temas e manter o tema escuro como padrão, com a escolha do claro salva em `canon-theme` e repassada às demos por `postMessage`.
- **Do** usar Geist Mono para IDs, valores e código, e Geist para todo o resto.
- **Do** separar com filetes de 1px e véus translúcidos em vez de sombras.
- **Do** manter transições de interface curtas (120ms ease-out no hover, 240ms `cubic-bezier(.16, 1, .3, 1)` na gaveta) e desligá-las com `prefers-reduced-motion`.

### Don't:
- **Don't** usar verde em links, foco, botões de navegação ou ornamento.
- **Don't** colocar rótulo, sobretítulo ou etiqueta acima do h1.
- **Don't** transformar a Regra num callout com fundo colorido; ela é corpo grande na largura de leitura.
- **Don't** estender a grade de pontos além do topo da página.
- **Don't** pôr sombra de elevação em superfícies do site.
- **Don't** usar vermelho ou âmbar fora de veredito e severidade.
