# Só skills; o formato de plugin do Claude Code fica para depois

O repositório distribui apenas `SKILL.md`, através do CLI `skills`, para todos os
agentes-alvo. Não há `.claude-plugin/marketplace.json`.

O Claude Code é o meu agente principal e tem um mecanismo próprio — marketplace de plugins —
que distribui também subagentes, slash commands e hooks, coisas que o CLI `skills` não
conhece. Ainda assim ele foi deixado de fora, por dois motivos. Primeiro, eu uso Cursor,
Gemini CLI, Antigravity e OpenCode de verdade, e o plugin não serve nenhum deles. Segundo,
os dois mecanismos ativos ao mesmo tempo instalam a mesma skill duas vezes: uma solta e uma
como `plugin:skill`.

Quando eu de fato escrever um subagente ou hook que valha versionar, aí `.claude-plugin/`
entra — e a disciplina de dividir (skills pelo CLI, agentes e hooks pelo plugin) passa a ser
necessária.

## Consequências

- Subagentes, slash commands e hooks não são versionados aqui por ora.
- `/plugin marketplace add daniel-bernardino747/skills` não funciona; a instalação é sempre
  pelo script.
