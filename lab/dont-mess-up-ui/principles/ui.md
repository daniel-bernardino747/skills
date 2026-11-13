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

### UI-002 — Uma ação primária por vista
- **Regra:** cada vista (página, dialog, sheet, drawer, formulário, card de ação) tem no máximo um botão ou link com estilo de ação primária, ou seja, preenchido com a cor de acento. As outras ações da vista usam variantes secundárias (outline, ghost, link).
- **Por quê:** duas primárias disputam o mesmo olhar. A pessoa hesita, ou escolhe a primeira que parece certa, que nem sempre é a ação principal.
- **Sinais no código:** dois ou mais `variant="primary"` / `variant="default"` (shadcn) / `color="primary"` / `.btn-primary` / botões com fundo de acento sólido no mesmo componente de vista, como no footer de um dialog com dois botões preenchidos.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** duas instâncias da mesma ação (ex.: "Criar conta" no topo e no fim de uma landing longa); abas ou passos de um wizard que nunca aparecem ao mesmo tempo contam como vistas separadas.
- **Fonte:** https://uxmag.com/articles/why-skilled-ux-designers-are-like-magicians — paráfrase (o "um FAB por tela" do Material Design, que o artigo cita como origem da ideia)

## Aposentados

_Nenhum._
