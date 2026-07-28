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
Mover um Experimento de `lab/` para `skills/`, tornando-o instalado por padrão.
_Avoid_: publicar, lançar, estabilizar

**Adotar**:
Passar a usar a skill de outra pessoa como está, adicionando-a ao Manifesto. Distinto de
**Inspirar**, que produz uma Skill Derivada em `lab/`.
_Avoid_: importar, instalar
