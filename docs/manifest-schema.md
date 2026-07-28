# Formato do `skills.manifest.json`

O manifesto é a única lista de skills de terceiros deste repositório. Nenhum código alheio é
versionado aqui — ver [ADR-0001](./adr/0001-skills-de-terceiros-por-referencia.md).

```json
{
  "scope": "global",
  "agents": ["claude-code", "cursor", "gemini-cli", "antigravity", "opencode"],
  "sources": [
    { "source": "mattpocock/skills", "skills": ["grilling", "tdd", "code-review"] },
    { "source": "getsentry/skills", "skills": "*" }
  ]
}
```

## Campos

| campo | valores | significado |
|---|---|---|
| `scope` | `"global"` \| `"project"` | `global` instala em `~/` (o padrão: skills do dia a dia, em qualquer projeto). `project` instala em `./` do diretório atual. |
| `agents` | lista de identificadores | Quais agentes recebem as skills. A lista de identificadores aceitos está no [README do CLI `skills`](https://github.com/vercel-labs/skills#supported-agents). |
| `sources` | lista de objetos | As fontes de terceiros. Vazia é válido. |

## Uma fonte

| campo | valores | significado |
|---|---|---|
| `source` | `owner/repo`, URL de git, ou caminho local | De onde vêm as skills. |
| `skills` | lista de nomes, ou `"*"` | Quais skills daquela fonte instalar. `"*"` instala todas. |

Prefira listar os nomes a usar `"*"`: com nomes explícitos, `node scripts/install.mjs -s <nome>`
consegue resolver uma skill sem baixar a fonte inteira, e você não é surpreendido por uma
skill nova que o upstream adicionou.

## Como uma fonte entra aqui

Uma nota em [`analysis/`](../analysis/) com `status: adotar`. O manifesto é a saída daquela
decisão, não o lugar onde ela é tomada.
