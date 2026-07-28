# lab/ — experimentos

Tentativas, provas de conceito, skills meio-prontas. Mesmo formato de `skills/`:
`lab/<nome>/SKILL.md`.

**Nada aqui é instalado por padrão.** Para testar uma:

```bash
node scripts/install.mjs -s minha-skill
```

Quando ela ganhar confiança, promove:

```bash
git mv lab/minha-skill skills/minha-skill
node scripts/install.mjs --mine
```

E para remover depois de um teste que não vingou:

```bash
npx skills remove minha-skill -a claude-code -a cursor -a gemini-cli -a antigravity -a opencode -g -y
rm -rf ~/.agents/skills/minha-skill   # o remove não limpa o diretório canônico
```

Dois detalhes verificados na prática, porque a documentação do CLI não avisa:
`skills remove` **não** aceita `-a '*'` (só `add` aceita), e ele deixa a cópia canônica em
`~/.agents/skills/` para trás — sem o `rm`, a skill continua aparecendo.

## Por que a separação existe

No Claude Code é o `description` do frontmatter que faz a skill ser auto-invocada. Skill
experimental instalada junto com as boas é chamada na hora errada e estraga a confiança nas
outras. `lab/` mantém o repositório utilizável como campo de testes sem contaminar o uso
diário.
