# Comportamento — `UX-`

Princípios do Cânone. Formato em [FORMAT.md](../FORMAT.md). Escrito por
`/dont-mess-up-ui-capture`; edição à mão é permitida, desde que respeite o formato.

## Princípios

### UX-001 — O aviso aparece colado no controle a que se refere
- **Regra:** uma mensagem sobre um campo ou controle específico (erro de validação, formato inválido, caps lock ligado, limite de caracteres) é renderizada junto desse controle e ligada a ele por `aria-describedby`. Toast, banner global ou resumo no topo podem existir além disso, mas nunca são o único lugar da mensagem.
- **Por quê:** quem está preenchendo olha para o campo, e uma mensagem fora desse ponto passa despercebida justamente quando a pessoa está concentrada na tarefa.
- **Sinais no código:** `toast(` / `notify(` / `setBanner(` / `alert(` disparado com mensagem de validação de campo, sem erro renderizado junto do input; input com `aria-invalid` ou estado de erro sem `aria-describedby`; erros de formulário mapeados apenas para um `ErrorSummary` ou banner no topo.
- **Severidade:** avisa
- **Verificação:** código
- **Exceções:** erros que não pertencem a um controle (rede, servidor, permissão) ficam no nível da vista.
- **Fonte:** https://uxmag.com/articles/why-skilled-ux-designers-are-like-magicians — paráfrase (o tooltip de caps lock no ponto do olhar e a atenção seletiva)

## Aposentados

_Nenhum._
