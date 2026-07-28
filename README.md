# skills

Minhas agent skills — as que eu uso todo dia, as que estou tentando escrever, e as anotações
sobre as dos outros. O repositório também é o instalador do meu ambiente: um comando põe
tudo no lugar, em todos os agentes que eu uso.

```bash
git clone https://github.com/daniel-bernardino747/skills.git
cd skills && npm install
node scripts/install.mjs
```

Em máquina nova, sem clonar:

```bash
npx github:daniel-bernardino747/skills
```

## Estrutura

| pasta | o que é | instalado? |
|---|---|---|
| [`skills/`](./skills/) | minhas skills estáveis | sim, por padrão |
| [`lab/`](./lab/) | experimentos e tentativas | não, só com `-s <nome>` |
| [`analysis/`](./analysis/) | notas sobre skills de terceiros | não, não são skills |
| [`docs/adr/`](./docs/adr/) | as decisões e o porquê | — |

Skills de terceiros **não** vivem aqui: elas são declaradas em
[`skills.manifest.json`](./skills.manifest.json) e buscadas no upstream na hora de instalar.
O motivo está no [ADR-0001](./docs/adr/0001-skills-de-terceiros-por-referencia.md).

## Comandos

```bash
node scripts/install.mjs               # minhas skills estáveis + tudo do manifesto
node scripts/install.mjs --mine        # só as minhas (loop de desenvolvimento)
node scripts/install.mjs -s <nome>     # uma específica, inclusive de lab/
node scripts/install.mjs -a claude-code   # sobrescreve os agentes-alvo
node scripts/install.mjs --list        # o que existe, sem instalar
node scripts/install.mjs --dry-run     # os comandos que seriam rodados
```

Por baixo é o [CLI `skills`](https://github.com/vercel-labs/skills), que copia cada skill
para `~/.agents/skills/<nome>` e symlinka os diretórios de cada agente para lá.

> **Atenção ao `-a` com um agente só.** Quando há um único diretório-alvo, o CLI troca
> silenciosamente para modo cópia (`add.ts:786`) e a skill vai direto para
> `~/.claude/skills/<nome>`, sem passar pelo canônico. Funciona, mas quebra a fonte única de
> verdade. Com os 5 agentes do manifesto o caminho é symlink.

> **Depois de editar uma skill, reinstale.** A instalação copia os arquivos — sem
> `node scripts/install.mjs --mine`, o agente continua rodando a versão antiga e o teste
> mente para você. Ver [ADR-0002](./docs/adr/0002-instalacao-por-recopia-explicita.md).

## Adicionar uma skill de terceiro

Uma entrada em `skills.manifest.json`:

```json
{ "source": "mattpocock/skills", "skills": ["grilling", "tdd"] }
```

O formato completo está em [`docs/manifest-schema.md`](./docs/manifest-schema.md).

## Escrever uma skill minha

```bash
mkdir -p lab/minha-skill && npx skills init lab/minha-skill
node scripts/install.mjs -s minha-skill    # instala só ela, para testar
git mv lab/minha-skill skills/minha-skill  # quando ganhar confiança
```

`SKILL.md` é escrito **em inglês** — é o modelo que lê, e o `description` casa melhor com o
resto do ecossistema instalado ao lado. README, ADRs e notas de análise ficam em português,
porque o leitor sou eu.

## Convenções

- **Atribuição.** Inspiração é livre; texto derivado carrega origem. Skill que nasceu de
  outra leva uma linha no fim do `SKILL.md`: `Derivado de owner/repo@nome (MIT)`.
- **Vocabulário.** Os termos deste repositório estão em [`CONTEXT.md`](./CONTEXT.md).

## Licença

[MIT](./LICENSE).
