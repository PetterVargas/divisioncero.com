# Skills de Kudo

Skills de ciberseguridad en formato [Agent Skills](https://agentskills.io) para usar Kudo con cualquier asistente de IA compatible (Claude Code, Cursor, Codex, OpenCode y otros).

```bash
npx skills add PetterVargas/divisioncero.com                         # elegir skills y asistentes
npx skills add PetterVargas/divisioncero.com --skill kudo-oscal      # una sola skill
```

El archivo [`skills.sh.json`](../../skills.sh.json) de la raíz del repositorio indica al instalador que las skills están en esta carpeta.

Los agentes que las usan están en [`kudo/agents`](../agents) y el servidor MCP en [`kudo/kudo-mcp`](../kudo-mcp). Documentación: https://divisioncero.com/kudo/framework/overview/mcp-agentes-y-skills

## Convenciones

- Una carpeta por skill con su `SKILL.md`; el `name` del frontmatter es igual al nombre de la carpeta.
- La `description` dice qué hace la skill y **cuándo usarla** (es lo que el asistente lee para decidir si cargarla).
- Las skills citan controles (`cip-2`) y documentos del SGX (`POL-CIP-01`) reales y usan las herramientas del MCP `kudo` cuando están disponibles.
- Al modificar una skill o un agente, el CLI `create-kudo-app` y el MCP los empaquetan en su siguiente compilación.
