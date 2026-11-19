# @divisioncero/kudo-mcp

Servidor [MCP](https://modelcontextprotocol.io) de **Kudo**, el framework de ciberseguridad por y para LatAm de [DivisionCero](https://divisioncero.com/kudo). Le da a tu asistente de IA (Claude Code, Cursor, VS Code, Codex, etc.) acceso a:

- Los **36 controles** y 503 requisitos de Kudo.
- Las **políticas y procedimientos del SGX** de tu proyecto (o los de referencia de Kudo).
- Los **8 modelos OSCAL** de Kudo (catalog, profile, component-definition, SSP, AP, AR, POA&M y mapping).
- **8 agentes de ciberseguridad** con sus **16 skills**.

## Uso

En la carpeta de tu proyecto Kudo (creado con `pnpm create @divisioncero/kudo-app`):

```bash
# Claude Code
claude mcp add kudo -- npx -y @divisioncero/kudo-mcp@latest

# Servidor HTTP local (para clientes que prefieren HTTP)
npx -y @divisioncero/kudo-mcp@latest --http --port 3333
claude mcp add --transport http kudo http://localhost:3333/mcp
```

Configuración genérica (`.mcp.json`, Cursor, VS Code):

```json
{
  "mcpServers": {
    "kudo": { "command": "npx", "args": ["-y", "@divisioncero/kudo-mcp@latest"] }
  }
}
```

Opciones: `--dir <proyecto>` (por defecto, el directorio actual), `--http`, `--port` (3333) y `--host` (127.0.0.1).

El servidor busca los documentos en `content/sgx/politicas-y-procedimientos`, `content/kudo/sgx/politicas-y-procedimientos` o `content/sgsi/politicas`. Si no encuentra ninguno, usa los documentos de referencia de Kudo incluidos en el paquete.

## Herramientas

| Herramienta | Descripción |
| ----------- | ----------- |
| `kudo_listar_dominios` | Los 8 dominios con sus controles |
| `kudo_obtener_control` | Enunciado, requisitos y documentos SGX de un control (`cip-2`) |
| `kudo_buscar` | Búsqueda en controles, requisitos y documentos |
| `kudo_listar_documentos` | Documentos del SGX con filtros por dominio, tipo o control |
| `kudo_obtener_documento` | Contenido en Markdown de un documento |
| `kudo_cobertura` | Controles cubiertos por documentos y brechas |
| `kudo_obtener_modelo_oscal` | Modelos OSCAL de Kudo en JSON |
| `kudo_crear_item_poam` | Ítem de POA&M OSCAL 1.2.3 a partir de un hallazgo |
| `kudo_listar_agentes` / `kudo_obtener_agente` | Agentes de ciberseguridad y sus instrucciones |
| `kudo_obtener_skill` | Contenido de una skill |

Todas son de solo lectura: el servidor no modifica archivos.

## Agentes (prompts MCP)

| Prompt | Agente | Skills |
| ------ | ------ | ------ |
| `agente-ciso` | Gobierno, riesgos y cumplimiento (COR) | gestión de riesgos, mapeo de cumplimiento |
| `agente-auditor` | Auditoría interna y OSCAL | auditoría interna, OSCAL |
| `agente-redactor-sgx` | Políticas y procedimientos | redacción de políticas |
| `agente-respuesta-incidentes` | Incidentes y vulnerabilidades (ADR) | respuesta a incidentes, gestión de vulnerabilidades |
| `agente-appsec` | Aplicaciones y cambios (CAP, CCN) | desarrollo seguro, gestión de cambios |
| `agente-arquitecto-nube` | Infraestructura e identidades (CIF, CIP) | seguridad en la nube, identidad y accesos |
| `agente-privacidad-ia` | Datos e IA (DIA) | protección de datos, gobierno de IA |
| `agente-personas-y-proveedores` | Personas y proveedores (THP) | concienciación, riesgo de proveedores |

Todos incluyen la skill base `kudo-framework`.

## Recursos

`kudo://oscal/{modelo}`, `kudo://documentos/{slug}` y `kudo://skills/{nombre}`.

## Skills sin MCP

Las skills también se instalan directamente en tu asistente:

```bash
npx skills add PetterVargas/divisioncero.com
```

## Desarrollo

```bash
pnpm install
pnpm build   # copia el catálogo, OSCAL, SGX, agentes y skills del repositorio a data/ y compila
pnpm test
```

Documentación: https://divisioncero.com/kudo/framework/overview/mcp-agentes-y-skills

Licencia MIT © DivisionCero
