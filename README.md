# divisioncero-docs

Sitio de documentación oficial de [DivisionCero](https://divisioncero.com). Incluye dos secciones principales de contenido: **CyberAcademy** y **Ciberseguridad Empresarial**, además de un blog.

## Stack

- **Framework:** Next.js 16 (export estático)
- **Documentación:** Fumadocs UI + Fumadocs MDX
- **Estilos:** Tailwind CSS v4
- **Contenido:** MDX con soporte para LaTeX (KaTeX), diagramas Mermaid, resaltado de código (Shiki) y TypeScript TwoSlash
- **Grafo de conocimiento:** react-force-graph-2d + D3 Force
- **Búsqueda:** Orama (búsqueda local)
- **Package manager:** pnpm

## Secciones de contenido

| Sección | Ruta | Descripción |
|---|---|---|
| CyberAcademy | `/cyberacademy` | Formación práctica en ciberseguridad |
| Ciberseguridad Empresarial | `/ciberseguridad-empresarial` | Metodología y servicios para empresas |
| Blog | `/blog` | Artículos y actualizaciones |

## Desarrollo local

```bash
pnpm install
pnpm dev
```

## Scripts disponibles

```bash
pnpm dev           # Servidor de desarrollo
pnpm build         # Build de producción (export estático)
pnpm start         # Sirve el export estático (carpeta out/)
pnpm types:check   # Verificación de tipos TypeScript
pnpm lint:links    # Valida enlaces internos en el contenido
pnpm export:pdf    # Exporta páginas a PDF con Puppeteer
```

## Estructura del proyecto

```
content/
  cyberacademy/          # Contenido de CyberAcademy
  ciberseguridad-empresarial/  # Contenido empresarial
  blog/                  # Posts del blog
app/                     # App Router de Next.js
components/              # Componentes React (grafo, MDX, búsqueda, etc.)
lib/                     # Utilidades compartidas y configuración de fuentes
scripts/                 # Scripts de lint y exportación PDF
source.config.ts         # Configuración de Fumadocs MDX
```

## Agregar contenido

El contenido se escribe en MDX dentro de `content/`. Cada sección tiene su propio `meta.json` para configurar la navegación lateral. Fumadocs genera automáticamente la navegación y los índices de búsqueda a partir de los archivos.

## Links

- Sitio principal: [divisioncero.com](https://divisioncero.com)
- Repositorio: [github.com/PetterVargas/divisioncero-docs](https://github.com/PetterVargas/divisioncero-docs)
- Plataforma Kudo: [kudo.divisioncero.com](https://kudo.divisioncero.com)
