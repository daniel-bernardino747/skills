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

### MOT-008 — Antecipação vai no sentido contrário ao movimento
- **Regra:** quando uma animação tem uma fase de preparação antes do movimento principal, essa fase desloca, escala ou gira o elemento no sentido oposto ao do movimento principal: desce antes de subir (`y` > 0 antes de `y` < 0), encolhe antes de crescer (`scale` < 1 antes de > 1), recua antes de avançar. Uma preparação no mesmo sentido do movimento principal viola.
- **Por quê:** o recuo é o que faz o movimento parecer ter impulso próprio; uma preparação no mesmo sentido lê como engasgo ou atraso.
- **Sinais no código:** keyframes ou sequências (`@keyframes`, arrays de `animate`, timelines GSAP) em que o primeiro passo intermediário altera `translate`/`x`/`y`, `scale` ou `rotate` antes do valor principal; compare o sinal da variação do primeiro passo com o sinal da variação até o pico.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** —
- **Fonte:** https://www.animatorisland.com/10-second-tip-always-anticipate/ e https://www.artemisiacollege.com/feeds/blog/anticipation-animation — paráfrase

### MOT-009 — Antecipação é curta
- **Regra:** a fase de preparação (do início até o extremo contrário da antecipação) dura no máximo 100ms e no máximo 25% da duração total da animação.
- **Por quê:** antecipação é para ser sentida, não vista. Quando fica longa, o usuário espera o elemento "pegar impulso" e lê aquilo como lentidão.
- **Sinais no código:** em keyframes com antecipação (ver MOT-008), o percentual do keyframe de extremo contrário (ex.: `20%`, `offset: 0.2`, `times: [0, 0.2, …]`) multiplicado pela duração; preparação feita como passo separado de timeline/sequência com duração própria > 100ms.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** —
- **Fonte:** https://www.animatorisland.com/10-second-tip-always-anticipate/ — paráfrase; os limites de 100ms e 25% são inferência minha a partir de "um ou dois frames já se sentem"

### MOT-010 — Antecipação é pequena
- **Regra:** a amplitude da preparação é no máximo 20% da amplitude do movimento principal, medidas a partir do valor inicial. Em escala, a preparação também não passa de 5% do valor inicial (entre 0,95 e 1,05).
- **Por quê:** antecipação grande vira um segundo movimento: o elemento parece ir e voltar em vez de pegar impulso.
- **Sinais no código:** em keyframes com antecipação (ver MOT-008), compare o deslocamento até o extremo contrário com o deslocamento até o pico: `translateY(10px)` → `translateY(-130px)` = 8%. Em escala, um extremo contrário fora de 0,95–1,05.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** —
- **Fonte:** https://www.animatorisland.com/10-second-tip-always-anticipate/ e https://www.artemisiacollege.com/feeds/blog/anticipation-animation — paráfrase; os limites de 20% e 5% são inferência minha

### MOT-011 — Animação disparada por input começa sem delay
- **Regra:** uma animação disparada por um gesto do usuário (clique, press, tecla, soltar um drag) começa no mesmo frame do evento, com `delay` 0. A antecipação faz parte da duração da animação, não é uma espera antes dela.
- **Por quê:** um atraso entre o gesto e a primeira mudança visível lê como interface travada, e a antecipação vira desculpa para essa espera.
- **Sinais no código:** `animation-delay`, `transition-delay`, `delay:` (Framer Motion, GSAP, WAAPI) > 0 em animações ligadas a `onClick`/`onPointerDown`/`:active`/`whileTap`/handlers de teclado; `setTimeout` antes de disparar a animação dentro do handler.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** escalonamento (stagger) de itens de uma lista, desde que o primeiro item comece sem delay; tooltip ou preview em hover com atraso intencional para não abrir por acidente.
- **Fonte:** https://www.artemisiacollege.com/feeds/blog/anticipation-animation — paráfrase (telegraph longo demais deixa a interação lenta); a forma "delay 0 no input" é inferência minha

### MOT-012 — O press é a antecipação
- **Regra:** quando um elemento tem estado de press (`:active`, `whileTap`, escala < 1 no `pointerdown`) e se move ao ser solto ou clicado, o movimento parte da pose de press direto para o movimento principal. Não há uma segunda preparação no sentido contrário depois do clique.
- **Por quê:** o afundar do press já carregou o impulso; uma nova preparação depois de soltar faz o elemento hesitar duas vezes antes de responder.
- **Sinais no código:** elemento com `:active`/`whileTap`/`pointerdown` que reduz escala e, no mesmo elemento, uma animação disparada por `onClick`/`pointerup` cujo primeiro passo intermediário é uma antecipação (ver MOT-008).
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** quando quem se move não é o elemento pressionado (ex.: clicar o botão faz outro ícone saltar), a antecipação no outro elemento segue MOT-008 normalmente.
- **Fonte:** assunto: anticipation — inferência minha a partir de https://www.animatorisland.com/10-second-tip-always-anticipate/ e https://www.artemisiacollege.com/feeds/blog/anticipation-animation

### MOT-013 — Um chamariz animado por vez
- **Regra:** numa vista, no máximo um elemento tem animação de chamar atenção ativa ao mesmo tempo. Isso vale para animação contínua ou repetida que não comunica progresso: pulse, bounce, ping, glow, wiggle, badge pulsante. Quando um segundo chamariz precisa aparecer, o primeiro para.
- **Por quê:** o movimento puxa o olho involuntariamente. Com dois ou mais loops na tela, nenhum deles indica para onde olhar, e a vista fica agitada.
- **Sinais no código:** dois ou mais elementos da mesma vista com `animation: … infinite`, `animation-iteration-count` > 1, `repeat: Infinity` (Framer Motion), `repeat: -1` (GSAP), ou com as classes `animate-pulse` / `animate-bounce` / `animate-ping` (Tailwind).
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** indicadores de carregamento e progresso (spinner, shimmer de skeleton, barra indeterminada) não contam, porque sinalizam atividade e não pedem ação.
- **Fonte:** https://uxmag.com/articles/why-skilled-ux-designers-are-like-magicians — paráfrase (atenção tem um único foco, e o movimento é a ferramenta mais forte para puxá-lo)

### MOT-014 — Movimento vindo da borda só para o que é crítico
- **Regra:** toast, banner ou snackbar que entra com deslocamento (slide a partir da borda, `translate`/`x`/`y` ≠ 0 no estado inicial) fica reservado a eventos que exigem atenção imediata: perda de conexão, falha ao salvar, sessão expirando, erro que bloqueia o fluxo. Esses usam o token de perigo ou de alerta. Confirmações e mensagens informativas ("Salvo", "Copiado", "Enviado") entram sem deslocamento, só com fade de no máximo 150ms.
- **Por quê:** movimento na periferia é o sinal mais forte para tirar o olho do que a pessoa está fazendo. Gasto em "Salvo!", ele ensina a ignorar a borda, e o aviso de conexão caída passa despercebido.
- **Sinais no código:** `initial={{ x/y: … }}`, `translateX/Y` ou keyframes `slide-in` na entrada de um toast ou banner de variante `success` / `info` / `default`; toaster global (sonner, react-hot-toast, notistack) com animação de slide aplicada a todas as variantes; variante `error` / `destructive` com a mesma cor neutra das demais.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** toast com ação limitada no tempo ("Desfazer" depois de excluir) pode deslizar, porque a pessoa precisa notá-lo antes que a ação expire.
- **Fonte:** https://uxmag.com/articles/why-skilled-ux-designers-are-like-magicians — paráfrase (deslocar a atenção num evento crítico com cor saturada e movimento periférico; o exemplo do toast vermelho de conexão); o limite de 150ms e a divisão crítico × informativo são inferência minha

## Aposentados

_Nenhum._
