import { defineI18n } from 'fumadocs-core/i18n';
import { uiTranslations } from 'fumadocs-ui/i18n';

/**
 * Idiomas del sitio. El español va sin prefijo (`/kudo`) y el inglés con `/en` (`/en/kudo`);
 * `proxy.ts` detecta el idioma del navegador y recuerda la elección en una cookie.
 * El contenido MDX en inglés va en `<archivo>.en.mdx`; si no existe se muestra el español.
 * see https://fumadocs.dev/docs/ui/translations
 */
export const i18n = defineI18n({
  languages: ['es', 'en'],
  defaultLanguage: 'es',
  hideLocale: 'default-locale',
  fallbackLanguage: 'es',
});

export type Locale = (typeof i18n.languages)[number];

export const defaultLocale = i18n.defaultLanguage as Locale;

export const localeCookie = 'FD_LOCALE';

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (i18n.languages as readonly string[]).includes(value);
}

/** Prefija una ruta interna con el idioma (`/kudo` → `/en/kudo`); el español no lleva prefijo. */
export function localizeUrl(url: string, lang: string): string {
  if (lang === defaultLocale || !isLocale(lang) || !url.startsWith('/') || url.startsWith('//')) return url;
  return url === '/' ? `/${lang}` : `/${lang}${url}`;
}

/** Quita el prefijo de idioma de una ruta (`/en/kudo` → `/kudo`). */
export function stripLocale(pathname: string): string {
  const [, first, ...rest] = pathname.split('/');
  if (!isLocale(first)) return pathname;
  return `/${rest.join('/')}`;
}

/** Idioma preferido según la cabecera `Accept-Language` (respeta los pesos `q`). */
export function negotiateLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale;
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { lang: tag.toLowerCase().split('-')[0], q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter((item) => item.q > 0)
    .sort((a, b) => b.q - a.q);
  return ranked.find((item) => isLocale(item.lang))?.lang as Locale | undefined ?? defaultLocale;
}

// Textos de la interfaz de Fumadocs (buscador, tabla de contenidos, paginación...).
// Fumadocs viene en inglés por defecto, así que `en` solo necesita su nombre visible.
export const translations = i18n
  .translations()
  .extend(uiTranslations())
  .add({
    es: {
      displayName: 'Español',
      'Ask AI(AI chat button)': 'Preguntar a la IA',
      'Back to Home(404 page)': 'Volver al inicio',
      'Choose a language(language switcher)': 'Elige un idioma',
      'Choose a language(language switcher)(aria-label)': 'Elige un idioma',
      'Close Banner(banner)(aria-label)': 'Cerrar banner',
      'Close Search(search dialog)(aria-label)': 'Cerrar búsqueda',
      'Close Sidebar(aria-label)': 'Cerrar barra lateral',
      'Close Sidebar(sidebar)(aria-label)': 'Cerrar barra lateral',
      'Close(image zoom)(aria-label)': 'Cerrar',
      'Collapse Sidebar(sidebar)(aria-label)': 'Contraer barra lateral',
      'Copied Anchor Link(heading anchor)(aria-label)': 'Enlace copiado',
      'Copied Link(accordion)(aria-label)': 'Enlace copiado',
      'Copied Markdown(page actions)': 'Markdown copiado',
      'Copied Text(code block)(aria-label)': 'Texto copiado',
      'Copy Anchor Link(heading anchor)(aria-label)': 'Copiar enlace',
      'Copy Link(accordion)(aria-label)': 'Copiar enlace',
      'Copy Markdown(page actions)': 'Copiar Markdown',
      'Copy Text(code block)(aria-label)': 'Copiar texto',
      'Dark(theme switcher)(aria-label)': 'Oscuro',
      'Default(type table)': 'Por defecto',
      'Edit on GitHub(edit page)': 'Editar en GitHub',
      'Hide Sidebar(sidebar)': 'Ocultar barra lateral',
      'Image Viewer(image zoom)(aria-label)': 'Visor de imágenes',
      'Last updated on(page footer)': 'Última actualización el',
      'Layout Tab(layout tab trigger)': 'Sección',
      'Light(theme switcher)(aria-label)': 'Claro',
      'Next Image(image zoom)(aria-label)': 'Imagen siguiente',
      'Next Page(pagination)': 'Siguiente',
      'No Headings(table of contents)': 'Sin encabezados',
      'No results found(search dialog)': 'No se encontraron resultados',
      'On this page(table of contents)': 'En esta página',
      'Open Search(search trigger)(aria-label)': 'Abrir búsqueda',
      'Open Sidebar(sidebar)(aria-label)': 'Abrir barra lateral',
      'Open in ChatGPT(page actions)': 'Abrir en ChatGPT',
      'Open in Claude(page actions)': 'Abrir en Claude',
      'Open in Cursor(page actions)': 'Abrir en Cursor',
      'Open in GitHub(page actions)': 'Abrir en GitHub',
      'Open in Scira AI(page actions)': 'Abrir en Scira AI',
      'Open(page actions)': 'Abrir',
      'Page Not Found(404 page)': 'Página no encontrada',
      'Parameters(type table)': 'Parámetros',
      'Previous Image(image zoom)(aria-label)': 'Imagen anterior',
      'Previous Page(pagination)': 'Anterior',
      'Prop(type table)': 'Propiedad',
      'Read {url}, I want to ask questions about it.(page actions)': 'Lee {url}, quiero hacer preguntas sobre su contenido.',
      'Returns(type table)': 'Retorna',
      'Search failed(search dialog)': 'La búsqueda falló',
      'Search failed, showing results for {query}(search dialog)': 'La búsqueda falló, mostrando resultados para {query}',
      'Search(search dialog)': 'Buscar',
      'Search(search trigger)': 'Buscar',
      'Show Sidebar(sidebar)': 'Mostrar barra lateral',
      'System(theme switcher)(aria-label)': 'Sistema',
      'Table of Contents(inline table of contents)': 'Tabla de contenidos',
      'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.(404 page)':
        'Es posible que la página que buscas se haya eliminado, haya cambiado de nombre o no esté disponible temporalmente.',
      'Toggle Menu(mobile menu)(aria-label)': 'Abrir menú',
      'Toggle Theme(theme switcher)(aria-label)': 'Cambiar tema',
      'Type(type table)': 'Tipo',
      'View as Markdown(page actions)': 'Ver como Markdown',
    },
    en: {
      displayName: 'English',
    },
  });

/**
 * ¿La página tiene versión propia en este idioma? Las páginas en `/en` sin `<archivo>.en.mdx`
 * muestran el contenido en español como respaldo.
 */
export function isTranslatedPage(page: { url: string; absolutePath?: string }): boolean {
  if (stripLocale(page.url) === page.url) return true;
  return page.absolutePath?.includes('.en.') ?? false;
}

/** URL canónica: la propia si está traducida; si no, la versión en español (evita contenido duplicado). */
export function canonicalUrl(page: { url: string; absolutePath?: string }): string {
  return isTranslatedPage(page) ? page.url : stripLocale(page.url);
}
