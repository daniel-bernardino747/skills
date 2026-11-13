# O Cânone de UI mora dentro da skill revisora e é fixado por tag

`dont-mess-up-ui` revisa um diff contra os meus princípios de UI, UX e motion. Os princípios
(o **Cânone**) ficam em `dont-mess-up-ui/principles/`, dentro da própria skill, e não numa
pasta de documentação à parte nem num repositório próprio. A skill é a unidade que o
instalador copia, então o Cânone viaja com ela para cada agente e para o CI sem nenhum
mecanismo extra.

São duas skills, não uma com dois modos. Capturar é raro, interativo e só acontece na minha
máquina. Revisar é frequente e precisa rodar sem ninguém olhando. Juntar as duas faria o CI
pagar, em cada PR, os tokens de instruções de captura que ele nunca usa.
`dont-mess-up-ui-capture` escreve na fonte deste repositório, nunca na cópia instalada, que
a próxima instalação apagaria ([ADR-0002](./0002-instalacao-por-recopia-explicita.md)).

O Cânone é **pessoal e global**. A régua de cada projeto continua sendo
`establish-design-system` + `ui-review`. Uma camada de override por projeto ficou reservada,
mas não foi desenhada.

## CI

Este repositório publica um reusable workflow, `.github/workflows/dont-mess-up-ui.yml`. O
projeto o chama com `uses: …@<ref>`, e essa ref fixa **ao mesmo tempo** o workflow e o
Cânone: o workflow lê `job.workflow_sha` e faz o checkout da skill nesse mesmo commit.

O risco que isso resolve é a régua móvel. Com `@main`, uma captura numa terça mudaria na
hora a régua de todos os repos, e um PR que passava poderia começar a falhar sem ter mudado.
Por isso:

- `mode: report` é o padrão: comenta no PR e nunca falha. `@main` é aceitável aqui.
- `mode: gate` falha só com ≥1 violação `bloqueia`. Repos em `gate` fixam uma tag `canon-vN`,
  que a captura sugere criar ao fim de cada sessão.
- O workflow procura a skill em `skills/`, `preview/` e `lab/`, nessa ordem, para que
  promovê-la com `git mv` não quebre repos já fixados.

Credencial: `ANTHROPIC_API_KEY` tem prioridade, e `CLAUDE_CODE_OAUTH_TOKEN` entra quando ela
não existe. Num repo de cliente, a key é da organização do cliente, e o custo fica com quem
é dono do repo.

## Consequências

- A revisão é só de código. Princípios que não dá para verificar no código entram como
  `Verificação: manual` e viram checklist quando o diff toca o assunto. Eles nunca são
  julgados pelo modelo.
- `--full` é uma foto do projeto inteiro: sem linha de base e nunca bloqueia.
- A régua de motion de terceiros (`review-animations`, `apple-design`) entra no Cânone só pela
  captura, princípio a princípio. `review-animations` pode ser aposentada quando `motion.md`
  cobrir o que ela cobre.
- Este repositório precisa continuar público, ou cada projeto que chama o workflow precisa
  de acesso a ele.
