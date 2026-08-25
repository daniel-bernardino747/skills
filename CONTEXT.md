# Skills

Repositório pessoal de agent skills: as que eu uso todo dia, as que estou tentando escrever,
e as anotações sobre as dos outros. Também é o instalador do meu ambiente de agentes.

## Language

### Artefatos

**Skill**:
Uma pasta contendo um `SKILL.md` com frontmatter `name` e `description`, instalável por um
agente de código.
_Avoid_: comando, prompt, plugin

**Skill Estável**:
Skill em `skills/` — pronta, confiável, instalada por padrão.
_Avoid_: skill de produção, skill publicada

**Experimento**:
Skill em `lab/` — tentativa em andamento, não instalada por padrão.
_Avoid_: rascunho, WIP, protótipo

**Skill em Teste**:
Skill em `preview/` — eu já uso, e quero que outros experimentem antes de eu chamar de
estável. Instalada por padrão, e é o único conjunto que eu compartilho.
_Avoid_: beta, release candidate, skill pública

**Nota de Análise**:
Arquivo em `analysis/` descrevendo a skill de outra pessoa: o que ela faz bem e um `status`
que diz o que fazer a respeito. Contém prosa minha, nunca o texto original.
_Avoid_: review, estudo, cópia

**Skill Derivada**:
Skill minha cujo texto nasceu do `SKILL.md` de outra pessoa. Carrega uma linha de origem no
fim do arquivo, com o repositório e a licença de origem.
_Avoid_: fork, skill inspirada

### Instalação

**Manifesto**:
`skills.manifest.json` — declara as fontes de terceiros, os agentes-alvo e o escopo. É a
única lista de skills de terceiros; nenhum código alheio é versionado aqui.
_Avoid_: lock, config, lista de dependências

**Fonte**:
Uma entrada do manifesto: um repositório de terceiros e quais skills dele instalar.
_Avoid_: upstream, remote, pacote

**Agente-Alvo**:
Um agente de código que recebe as skills instaladas (`claude-code`, `cursor`, …).
_Avoid_: cliente, editor, IDE

**Promover**:
Mover uma skill um degrau acima: `lab/` → `preview/` → `skills/`. Cada degrau é um `git mv`,
e descer também. Só o último degrau significa que eu confio nela.
_Avoid_: publicar, lançar, estabilizar

**Abrir para Teste**:
Mover um Experimento de `lab/` para `preview/` e entregar a alguém o comando gerado por
`install.mjs --share`. É a única forma de uma skill minha sair daqui.
_Avoid_: publicar, distribuir, lançar beta

**Adotar**:
Passar a usar a skill de outra pessoa como está, adicionando-a ao Manifesto. Distinto de
**Inspirar**, que produz uma Skill Derivada em `lab/`.
_Avoid_: importar, instalar

### Ressurgimento

Vocabulário do `dont-let-me-forget`. Ver
[ADR-0004](./docs/adr/0004-hook-instalado-pelo-setup-excecao-ao-so-skills.md).

**Acervo**:
O diretório único onde vivem as Notas, fora deste repositório. `notas/` é a fila viva,
`archive/` é o terminal. Um só, global — o projeto de origem é metadado da Nota, não
endereço dela.
_Avoid_: vault, base, second brain

**Nota**:
Um arquivo Markdown do Acervo: prosa em português, frontmatter operacional, e uma linha
obrigatória de `Por que guardei`. Escrita para o meu olho, não para o do agente.
_Avoid_: card, item, entrada

**Escada**:
1d → 3d → 1w → 2w → 4w. O intervalo conta do dia da revisão, nunca do vencimento.
_Avoid_: repetição espaçada, SRS, agendamento

**Parede**:
O 4w. Ali a Nota só pode ser agida ou arquivada — adiar deixa de ser uma opção, e o script
recusa. É o que impede o Acervo de virar fila de dívida.
_Avoid_: prazo, expiração, deadline

**Adiar / Agir / Arquivar**:
As três saídas de uma revisão. `Agir` exige um artefato nomeável — o que passou a existir e
não existia antes; sem isso não foi agir, foi adiar. `Arquivar` exige um motivo. Nenhuma
delas apaga: exclusão é sempre manual.
_Avoid_: concluir, fechar, deletar, snooze

**Carona**:
A instrução em linguagem natural pendurada numa das três saídas — *"chega, mas extrai o
tópico 5 numa nota nova"*. O agente executa antes de registrar a saída. É o que torna a
revisão um diálogo, e não um formulário.
_Avoid_: comando, opção, flag

**Ressuscitar**:
Trazer uma Nota do `archive/` de volta à fila, em 1d. Só o passeio faz isso, e só depois de
um sorteio — recorrência conquistada, não concedida.
_Avoid_: reabrir, desarquivar, restaurar

**Passeio**:
Listar e sortear. O sorteio corre sobre o Acervo inteiro, `archive/` incluído, e ignora a
Escada. É o canal de serendipidade; a revisão é o canal com prazo.
_Avoid_: busca, navegação, explorar
