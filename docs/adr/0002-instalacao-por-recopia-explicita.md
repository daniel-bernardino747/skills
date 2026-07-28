# Instalação por recópia explícita, sem link vivo para o repositório

O CLI `skills` copia cada skill para `~/.agents/skills/<nome>` e symlinka os diretórios dos
agentes para essa cópia (`copyDirectory(skill.path, canonicalDir)` em `src/installer.ts`).
Consequência: editar `skills/foo/SKILL.md` aqui **não** muda o que o agente executa até eu
rodar `node scripts/install.mjs --mine` de novo.

O óbvio seria apontar o caminho canônico direto para este repositório com uma junction, e
ter edição ao vivo. Foi rejeitado: o CLI faz `cleanAndCreateDirectory` no caminho canônico
durante `add`, `update` e `remove`, e apontá-lo para o meu diretório de trabalho coloca o
repositório na mira de uma operação destrutiva. Além disso a junction fica invisível para o
lock, então `skills list` e `skills update` passam a mentir.

Perder trabalho é pior que um passo manual de dois segundos.

## Consequências

- Depois de editar qualquer skill própria, `node scripts/install.mjs --mine` é obrigatório.
  O modo de falha é silencioso: sem reinstalar, eu testo a versão antiga achando que testei
  a nova.
- Se isso virar problema recorrente, a mitigação é um hook de `post-commit`, não uma
  junction.
