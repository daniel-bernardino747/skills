# Formato do Cânone

Fonte única do formato. `dont-mess-up-ui` lê, `dont-mess-up-ui-capture` escreve.

## Arquivos

Um arquivo por domínio, em `principles/`:

| arquivo | prefixo | cobre |
|---|---|---|
| `ui.md` | `UI-` | aparência: tipografia, cor, espaço, hierarquia, estados visuais |
| `ux.md` | `UX-` | comportamento: fluxo, feedback, foco, teclado, erros, alvos de toque |
| `motion.md` | `MOT-` | movimento: duração, easing, origem, interrupção, reduced-motion |

Cada arquivo tem duas seções de nível 2, nesta ordem: `## Princípios` e `## Aposentados`.

## Um Princípio

```md
### MOT-004 — Saídas mais rápidas que entradas
- **Regra:** a duração de saída é ≤ 75% da de entrada.
- **Por quê:** o usuário já decidiu sair; esperar é atrito.
- **Sinais no código:** `exit`/`leave`/`AnimatePresence` com duração ≥ a da entrada correspondente.
- **Severidade:** bloqueia
- **Verificação:** código
- **Exceções:** transições de página com shared element.
- **Fonte:** https://exemplo.com/artigo — paráfrase
```

| campo | regra |
|---|---|
| ID | `<PREFIXO>-<NNN>`, três dígitos. O próximo é o maior do arquivo (Aposentados incluídos) + 1. Um ID nunca é reaproveitado. |
| Título | Uma frase que já é a regra resumida. |
| Regra | Verificável. Alguém lendo só o diff consegue dizer "viola" ou "não viola". |
| Por quê | Uma frase. É o que vai no relatório quando o Princípio dispara. |
| Sinais no código | Padrões concretos (propriedades, APIs, valores) que tornam a violação visível. Obrigatório quando `Verificação: código`; `—` quando `manual`. |
| Severidade | `bloqueia` · `avisa` · `sugere`. Só `bloqueia` falha o CI em modo `gate`. |
| Verificação | `código` — a revisora avalia. `manual` — vira item do checklist quando o diff toca o assunto. |
| Exceções | Quando a Regra não se aplica. `—` se nenhuma. |
| Fonte | URL, assunto ou skill de origem. Sempre paráfrase própria, nunca texto copiado. |

## Demo

Todo Princípio que dá para ver, seja aparência ou movimento, tem uma demo em
`demos/<ID>.html`. O site público
([ADR-0008](../../docs/adr/0008-canone-publico-com-uma-demo-por-principio.md)) mostra a demo
logo abaixo do texto.

- É uma página independente que carrega `_kit.css` e, por último, `_kit.js`. Palcos
  compartilhados ficam em `_squash.css` e `_anticipation.css`.
- Os casos ficam lado a lado em `.grid > .cell`. Cada célula tem um `h3`, uma `.tag` (`ok` para
  "segue", `bad` para "viola", `neutral` para referência) e uma `.cap` com os valores.
- Pelo menos um caso segue e pelo menos um viola. Valores iguais aos da Regra.
- As animações rodam só sob `body.run`, com duração `calc(<ms> * var(--slow))`. A barra
  (Repetir, Loop, Câmera lenta, Congelar) vem de `window.DEMO`, documentado no topo de
  `_kit.js`. Uma demo só de interação usa `controls: []` e um `hint`.
- As cores vêm dos tokens do kit, e o texto sobre `--accent` usa `--on-accent`.

Para ver o site localmente: `node scripts/build-canon-site.mjs --serve`.

## Aposentar

Um Princípio substituído ou abandonado sai de `## Princípios` e vira uma linha em
`## Aposentados`:

```md
- MOT-002 — Toda animação de UI < 300ms · substituído por MOT-009 em 2026-11-13
```

A linha mantém o ID ocupado. O texto completo continua no histórico do git. A demo do
Princípio aposentado é apagada.
