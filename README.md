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
pnpm build         # Build para Cloudflare Workers (presentaciones + museo + OpenNext)
pnpm build:next    # Solo el build de Next.js (webpack: genera un Worker más pequeño que Turbopack)
pnpm preview       # Build + Worker local con wrangler (runtime de Cloudflare)
pnpm deploy        # Build + despliegue a Cloudflare Workers
pnpm start         # Sirve un `pnpm build:next` con Node
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

## Idiomas

El sitio está en español (sin prefijo, `/kudo`) e inglés (`/en/kudo`). `proxy.ts` detecta el idioma del navegador en la primera visita y recuerda la elección del selector del footer en la cookie `FD_LOCALE`.

- Textos de la interfaz: `lib/i18n.ts` (Fumadocs) y `lib/site-translations.ts` (sitio); cada página puede declarar su propio diccionario `en`.
- Contenido MDX en inglés: crea `<archivo>.en.mdx` junto al original (ver `content/legal`). Mientras no exista, `/en/...` muestra el español y su URL canónica apunta a la versión en español.

## Herramientas

Las herramientas (antes `herramientas.divisioncero.com`) viven en `/herramientas`: páginas en `app/[lang]/herramientas`, APIs en `app/herramientas/api`, componentes en `components/herramientas` y lógica en `lib/herramientas`. Variables necesarias: `NEXT_PUBLIC_CAPTCHA_SITE_KEY`, `NEXT_PUBLIC_CAPTCHA_WIDGET_SIZE` y `CAPTCHA_SECRET_TOKEN` (Turnstile); `UNSPLASH_ACCESS_KEY` y `UNSPLASH_COLLECTION_ID` para el Museo del Cibercrimen.

## Agregar contenido

El contenido se escribe en MDX dentro de `content/`. Cada sección tiene su propio `meta.json` para configurar la navegación lateral. Fumadocs genera automáticamente la navegación y los índices de búsqueda a partir de los archivos.

## Links

- Sitio principal: [divisioncero.com](https://divisioncero.com)
- Repositorio: [github.com/PetterVargas/divisioncero.com](https://github.com/PetterVargas/divisioncero.com)
- Plataforma Kudo: [divisioncero.com/kudo](https://divisioncero.com/kudo)
