# Hook instalado pelo setup: a exceção ao "só skills"

O `dont-let-me-forget` instala um hook `SessionStart` no `~/.claude/settings.json` da minha
máquina, através do setup da própria skill. O repositório continua distribuindo apenas
`SKILL.md` pelo CLI `skills`, e continua sem `.claude-plugin/marketplace.json`.

Isto parece contradizer o [ADR-0003](./0003-so-skills-plugin-do-claude-code-adiado.md), e a
distinção precisa ficar escrita: **o ADR-0003 é sobre o que o repositório distribui, não
sobre o que uma skill faz na máquina em que roda.** O hook não é versionado, não vem no
`git clone`, não é instalado pelo `scripts/install.mjs` e não existe em máquina nenhuma até
eu responder "sim" a uma pergunta do setup. A fronteira é essa, e ela é o motivo de a
exceção não abrir precedente para um marketplace.

A exceção existe porque este sistema tem um único ponto de falha, e não é técnico. O
`dont-let-me-forget` é uma máquina cujo produto é me lembrar de coisas; se a entrada dela
for eu lembrar de usá-la, o desenho é circular e morre em três semanas. Sem gatilho, ninguém
digita `/dont-let-me-forget-review` numa terça-feira ocupada. O hook é o que encontra a
revisão **no lugar onde ela é possível** — o terminal, com o agente já aberto —, em vez de
uma notificação que chega quando não dá para agir. Nenhum mecanismo portável entre os cinco
agentes-alvo faz isso.

O preço é assimetria assumida: **este sistema é Claude-Code-first.** No Cursor, Gemini CLI,
Antigravity e OpenCode eu capturo Notas normalmente, mas não sou lembrado de revisar. Isso é
aceitável porque a captura é o verbo que acontece em qualquer lugar e a revisão é um ritual
que acontece em um lugar só.

## Consequências

- O setup escreve num arquivo que tem outro dono. O Orca já registra hooks em todos os
  eventos do meu `settings.json`, inclusive `SessionStart`. A instalação **apenda** ao array
  existente, faz backup antes e imprime o que acrescentou — nunca sobrescreve.
- O modo de falha é silencioso: se o Orca reescrever o arquivo e derrubar minha entrada, o
  lembrete simplesmente para e eu só noto semanas depois. Por isso `dont-let-me-forget-review`
  roda `hook-check` toda vez e avisa se a entrada sumiu.
- Se um dia eu precisar de um segundo hook versionado, aí sim `.claude-plugin/` entra e este
  ADR é revisto junto com o 0003.
