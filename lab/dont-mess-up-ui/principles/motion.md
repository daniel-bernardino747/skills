# Movimento — `MOT-`

Princípios do Cânone. Formato em [FORMAT.md](../FORMAT.md). Escrito por
`/dont-mess-up-ui-capture`; edição à mão é permitida, desde que respeite o formato.

## Princípios

### MOT-001 — Squash e stretch preservam volume
- **Regra:** em escala não-uniforme usada como squash/stretch, todo keyframe tem `scaleX × scaleY` entre 0,9 e 1,1. Um eixo nunca muda sozinho.
- **Por quê:** quando a área muda, o elemento parece inflar ou murchar em vez de deformar.
- **Sinais no código:** `scale(x, y)`, `scaleX(`/`scaleY(` ou props `scaleX`/`scaleY` (Framer Motion, GSAP) com eixos diferentes; keyframes em que só um eixo sai de 1.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** revelar ou colapsar conteúdo com `scaleY`/`scaleX` (accordion, barra de progresso) não é squash e fica fora.
- **Fonte:** https://frameanim.org.in/tutorials/squash-and-stretch — paráfrase

### MOT-002 — No impacto, achata no eixo da força
- **Regra:** no keyframe de contato, o eixo do movimento que acabou de parar tem escala < 1 e o eixo perpendicular tem escala > 1. Cai no chão (Y) → `scaleY < 1`; bate na lateral (X) → `scaleX < 1`.
- **Por quê:** achatar no eixo errado faz o elemento parecer quicar de lado ou atravessar a superfície.
- **Sinais no código:** keyframes/variants que combinam `translateX`/`translateY` (ou `x`/`y`) com escala não-uniforme, onde o eixo que estava se movendo cresce no keyframe de parada.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** —
- **Fonte:** https://frameanim.org.in/tutorials/squash-and-stretch — paráfrase

### MOT-003 — Squash é acento, não estado
- **Regra:** escala não-uniforme só acontece em resposta a um evento discreto de impacto (clique/press, soltar, aterrissar, drop), roda uma vez e termina. Nunca em loop, nunca em hover, nunca como pose de repouso.
- **Por quê:** deformação constante perde o peso do impacto e vira enfeite barato e cansativo.
- **Sinais no código:** keyframes com `scaleX ≠ scaleY` e `infinite` / `repeat: Infinity`; escala não-uniforme em `:hover` / `whileHover` / `onMouseEnter`; estilo de repouso com `scale(x, y)` desigual.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** indicadores de carregamento cuja função é sinalizar atividade contínua (ex.: pontinhos quicando).
- **Fonte:** https://frameanim.org.in/tutorials/squash-and-stretch — paráfrase

### MOT-004 — Squash termina na forma neutra
- **Regra:** toda animação com escala não-uniforme termina com o elemento em `scale(1, 1)` (ou na sua escala de repouso). Nenhum `fill-mode` deixa deformação residual.
- **Por quê:** deformação que sobra depois do impacto lê como defeito, não como movimento, e distorce o que estiver dentro.
- **Sinais no código:** keyframe `100%`/`to` com `scaleX ≠ scaleY`; `animation-fill-mode: forwards | both` em keyframes que não fecham em escala neutra; `animate`/target final de Framer Motion/GSAP com eixos diferentes.
- **Severidade:** bloqueia
- **Verificação:** código
- **Exceções:** pose sustentada enquanto o usuário mantém um press (ex.: thumb de switch alongado durante o toque), desde que volte ao neutro ao soltar.
- **Fonte:** https://frameanim.org.in/tutorials/squash-and-stretch — paráfrase

### MOT-005 — Elementos grandes não deformam
- **Regra:** containers grandes (modal, dialog, sheet/drawer, card de conteúdo, seção de página) nunca recebem escala não-uniforme. Squash fica restrito a elementos pequenos e pontuais: ícone, badge, avatar, botão só de ícone, toggle, item arrastável.
- **Por quê:** quanto maior a peça, mais pesada ela deve parecer; um modal que achata parece de borracha e perde solidez.
- **Sinais no código:** `scaleX ≠ scaleY` em keyframes, variants ou transições aplicados a componentes/seletores de modal, dialog, sheet, drawer, card ou section.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** —
- **Fonte:** https://frameanim.org.in/tutorials/squash-and-stretch — paráfrase

### MOT-006 — Intensidade de squash vem de token, constante por componente
- **Regra:** valores de squash/stretch vêm de tokens ou constantes nomeadas compartilhadas (ex.: `--squash-light`, `--squash-medium`; o mais leve deforma mais). Um componente usa sempre o mesmo token em todos os seus estados e ocorrências. Literais numéricos de escala não-uniforme direto no componente violam.
- **Por quê:** se o mesmo objeto é borracha num estado e rígido em outro, parece que o material dele mudou.
- **Sinais no código:** `scale(1.1, 0.9)`, `scaleX: 1.12` e afins como literal num componente; dois valores de squash diferentes no mesmo componente.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** componentes com variantes de tamanho declaradas (`sm`/`lg`) podem ter um token por variante.
- **Fonte:** https://frameanim.org.in/tutorials/squash-and-stretch — paráfrase

### MOT-007 — Squash ancorado no ponto de contato
- **Regra:** squash de impacto contra uma superfície tem `transform-origin` no lado dessa superfície (`bottom` ao aterrissar, o lado da parede ao bater). Squash sem superfície, como um press no lugar, usa `center`.
- **Por quê:** com origem no centro, o elemento descola da superfície exatamente no instante em que deveria estar mais colado nela.
- **Sinais no código:** keyframes ou variants que combinam deslocamento (`translateY`/`y` até a parada) com escala não-uniforme, sem `transform-origin` (padrão `center`) ou com `transform-origin: center`.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** —
- **Fonte:** assunto: squash and stretch — inferência minha a partir de https://frameanim.org.in/tutorials/squash-and-stretch

## Aposentados

_Nenhum._
