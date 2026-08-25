# O conjunto compartilhado é uma subpasta, não um branch

Skills que eu quero que outras pessoas testem ficam em `preview/`, e o comando que eu
entrego aponta para a subpasta no GitHub:

```bash
npx skills add https://github.com/daniel-bernardino747/skills/tree/main/preview -s '*' -g -y
```

O CLI `skills` aceita três eixos de recorte — subpasta (`/tree/<ref>/<caminho>`), ref
(`owner/repo#<branch>`) e nome (`-s`). O recorte importa porque o CLI **varre todo `SKILL.md`
da árvore, em qualquer profundidade**: sem ele, quem rodar `npx skills add
daniel-bernardino747/skills -l` vê o meu `lab/` inteiro e instala qualquer experimento
meio-pronto pelo nome.

O branch foi rejeitado pelo mesmo motivo do [ADR-0001](./0001-skills-de-terceiros-por-referencia.md):
**um branch é uma cópia, e cópia deriva.** Eu consertaria um bug na `main` e quem está
testando não receberia nada até eu lembrar de sincronizar — e o modo de falha é silencioso,
porque o testador não tem como saber que existe uma correção que não chegou nele. Uma
subpasta é uma árvore só, sempre atual, e promover ou despromover continua sendo um `git mv`.

`preview/` é um terceiro status, ortogonal a `skills/` e `lab/`, e ele precisa existir
separado justamente porque eu quero retorno sobre coisas que ainda não são estáveis.
Reaproveitar `skills/` para isso quebraria a definição daquela pasta — *"skill que eu uso e
na qual confio"* — e faria a minha instalação padrão carregar o que eu ainda não confio.

## Consequências

- `preview/` é instalado por padrão junto com `skills/`. Pedir teste de uma skill que eu não
  rodo produz relato inútil.
- `node scripts/install.mjs --share` gera os comandos a partir do conteúdo real de
  `preview/`, para eu não manter a lista à mão no README.
- **Isto é caminho feliz, não tranca.** O repositório é público; quem apontar de propósito
  para a raiz continua enxergando `lab/`. Trancar exigiria repositório privado, que é o
  oposto de compartilhar.
- Quem testa recebe correção com `npx skills update <nome>`, não automaticamente — a mesma
  recópia explícita do [ADR-0002](./0002-instalacao-por-recopia-explicita.md), agora na
  máquina dos outros.
