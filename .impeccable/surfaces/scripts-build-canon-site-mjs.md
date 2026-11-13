---
version: 1
slug: "scripts-build-canon-site-mjs"
primary_target: "scripts/build-canon-site.mjs"
related_targets: ["lab/dont-mess-up-ui/demos"]
---

# Site do Cânone de UI

Mode: Read. Gerado por `scripts/build-canon-site.mjs` em `_site/`; demos em `lab/dont-mess-up-ui/demos/`.

Leitor: devs e designers de fora, chegando pela home ou direto na página de um princípio, muitas vezes vindo de um comentário de PR. Pergunta do leitor: "qual é a regra, por que, e como vejo isso no meu código?". Estrutura fixada pelo usuário: uma página por princípio, menu lateral com toda a documentação, página "Usar num projeto".

Decisões do usuário: títulos em Geist bold (não Overpass); tema escuro por padrão com botão para o claro, escolha salva no navegador. Marca pinada em PRODUCT.md.

## Direction contract

THESIS: a página de um princípio é uma ficha de régua: a Regra é a manchete e a demo é a bancada onde ela se prova. Recusa o template de docs genérico (prosa cinza com um callout).

OWN-WORLD: chão #09090b, texto #fafafa, verde #00bb7f só para o que "segue" e para o ponto da marca; vermelho para "viola" e "bloqueia"; âmbar para "avisa". Geist para texto e títulos, Geist Mono para IDs, valores e rótulos curtos. Pílulas, raio 10px, bordas #ffffff1a, grade de pontos discreta só no topo da página. Wordmark "Cânone ●" com o ponto verde.

STORY: o leitor lê a regra em uma frase grande, vê o porquê, roda a demo e sai sabendo apontar a violação no próprio código; depois navega pelo menu para o próximo.

FIRST VIEWPORT: menu lateral fixo à esquerda (wordmark "Cânone ●", tema, Visão geral, Usar num projeto, domínios com IDs em mono). À direita: trilha "Movimento / MOT-008", título Geist bold, linha de pílulas (ID em mono, severidade, verificação), a Regra em corpo grande na largura de leitura, o porquê logo abaixo. Nenhum rótulo acima do título. Os fatos (sinais, exceções, fonte) ficam depois da demo, para a demo começar acima da dobra em 1440×900. Raio 10px em toda a casa.

FORM: extensão de um mundo de marca já estabelecido (teamdbsolutions.com e Elo); estrutura definida pelo usuário. seed: none (direção pinada pelo usuário e pela marca; concept-seed não roda em direção pinada, ver new-work §3)

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
