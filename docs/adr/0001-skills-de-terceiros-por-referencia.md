# Skills de terceiros entram por referência, não por cópia

Skills de outras pessoas não são versionadas aqui. Elas são declaradas em
`skills.manifest.json` como `owner/repo` + a lista de skills, e o instalador as busca no
upstream na hora de instalar.

Isto diverge do `code-square-br/skills`, que decidiu o contrário (ADR-0002 de lá, "vendor
upstream skills by copy"). A diferença é a visibilidade: aquele repositório é privado, e
copiar skill alheia para dentro dele é uso interno. Este é público, e a mesma cópia vira
redistribuição — passa a exigir checagem de licença de cada fonte, atribuição mantida à mão
e um processo de sync para as cópias não congelarem em versões velhas.

## Consequências

- A instalação depende de rede e de os repositórios de origem continuarem existindo. Um
  upstream apagado quebra aquela entrada do manifesto, e não há cópia local de reserva.
- Não há como fixar uma versão específica de uma skill de terceiro além do que o CLI
  `skills` oferece.
- Uma skill de terceiro que eu queira modificar não pode ser editada no lugar: ela vira uma
  Skill Derivada em `lab/`, com a linha de origem exigida pela licença.
- `analysis/` segue a mesma regra: guarda notas minhas, nunca o `SKILL.md` original.
