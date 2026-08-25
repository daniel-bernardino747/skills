# preview/ — em teste com outras pessoas

Uma pasta por skill: `preview/<nome>/SKILL.md`. Mesmo formato de [`skills/`](../skills/) e
[`lab/`](../lab/).

O que entra aqui: skill que **eu** já uso e quero que **outros** experimentem, antes de
chamar de estável. É um terceiro status, ortogonal à confiança que eu deposito nela — não
é "quase pronta", é "pronta o bastante para eu pedir opinião".

Tudo em `preview/` é instalado por padrão junto com `skills/`. Pedir para alguém testar uma
skill que eu mesmo não rodo é a melhor forma de receber um relato inútil.

## O que eu entrego para a pessoa

```bash
node scripts/install.mjs --share
```

Ele imprime os comandos já prontos, apontando para a **subpasta** `preview/` no GitHub:

```bash
npx skills add https://github.com/daniel-bernardino747/skills/tree/main/preview -s '*' -g -y
```

O recorte por subpasta é o ponto. Com ele, o `-l` de quem recebeu o link mostra só o que
está em teste — `lab/` não aparece. Sem ele, o CLI varre a árvore inteira e todo experimento
meio-pronto vira instalável pelo nome. O porquê está no
[ADR-0005](../docs/adr/0005-preview-por-subpasta-nao-por-branch.md).

Isso é um caminho feliz, não uma tranca: o repositório é público, e quem apontar de
propósito para a raiz continua enxergando tudo. Trancar exigiria repositório privado, que é
o oposto de compartilhar.

## Os dois movimentos

```bash
git mv lab/minha-skill preview/minha-skill      # abrir para teste
git mv preview/minha-skill skills/minha-skill   # promover, depois do retorno
node scripts/install.mjs --mine
```

Voltar para `lab/` também é um `git mv`, e é o movimento honesto quando o retorno foi ruim.

## Depois de editar

A instalação **copia** os arquivos — o agente não vê a edição até você reinstalar
(ver [ADR-0002](../docs/adr/0002-instalacao-por-recopia-explicita.md)):

```bash
node scripts/install.mjs --mine
```

E quem está testando precisa rodar `npx skills update <nome>` para receber a correção.
