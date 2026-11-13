# Aparência — `UI-`

Princípios do Cânone. Formato em [FORMAT.md](../FORMAT.md). Escrito por
`/dont-mess-up-ui-capture`; edição à mão é permitida, desde que respeite o formato.

## Princípios

### UI-001 — Elemento com texto não deforma
- **Regra:** nenhum elemento que renderiza texto, diretamente ou em descendentes, recebe escala não-uniforme (`scaleX ≠ scaleY`). Escala uniforme continua permitida — press de botão com texto é `scale(0.97)`, não squash.
- **Por quê:** escala não-uniforme distorce as letras, e texto deformado lê como bug de renderização, não como movimento.
- **Sinais no código:** `scaleX ≠ scaleY` em keyframes, variants ou transições de um elemento cujo JSX/HTML contém texto (label, children string, `{t(...)}`, `<span>`, `<p>`).
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** —
- **Fonte:** assunto: squash and stretch — inferência minha a partir de "objetos rígidos não deformam", em https://frameanim.org.in/tutorials/squash-and-stretch

## Aposentados

_Nenhum._
