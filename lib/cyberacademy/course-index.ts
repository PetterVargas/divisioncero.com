import fs from 'node:fs';
import path from 'node:path';
import { domains, academyRoute, cyberusuarioRoute } from '@/lib/cyberacademy/shared';
import { localizeUrl } from '@/lib/i18n';
import { getT } from '@/lib/site-translations';

export type TemaNode = {
  title: string;
  description: string;
  url: string;
};

export type ModuloNode = {
  title: string;
  description: string;
  url: string;
  temas: TemaNode[];
};

export type CursoNode = {
  title: string;
  description: string;
  url: string;
  modulos: ModuloNode[];
};

export type SectionNode = {
  slug: string;
  name: string;
  title: string;
  description: string;
  cursos: CursoNode[];
};

// Ruta literal (no `contentDir`): así el trazado de archivos del build solo incluye este directorio.
const contentRoot = path.join(process.cwd(), 'content', 'cyberacademy');

function readJson(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function readOrderedSlugs(metaPath: string): string[] {
  const meta = readJson(metaPath) as { pages?: string[] };
  return (meta.pages ?? []).filter((p) => !p.startsWith('---') && p !== 'index');
}

function parseModuleMdx(mdxPath: string, modSlug: string, baseUrl: string, courseSlug: string) {
  const raw = fs.readFileSync(mdxPath, 'utf-8');

  const descMatch = raw.match(/## Descripción\n\n([\s\S]*?)\n\n## Temas/);
  const description = descMatch ? descMatch[1].trim() : '';

  const temas: TemaNode[] = [];
  const cardRegex = /<Card icon=\{<\w+\s*\/>\} title="([^"]+)" href="([^"]+)">\n\s*([\s\S]*?)\n\s*<\/Card>/g;
  let m: RegExpExecArray | null = cardRegex.exec(raw);
  while (m !== null) {
    const [, title, href, teaser] = m;
    temas.push({
      title,
      description: teaser.trim(),
      // Los href de las Cards son absolutos (/cyberacademy/...); los relativos se resuelven contra el curso.
      url: href.startsWith('/') ? href : `${baseUrl}/${courseSlug}/${href}`,
    });
    m = cardRegex.exec(raw);
  }

  return { description, temas };
}

function buildCourse(sectionDir: string, courseSlug: string, baseUrl: string): CursoNode {
  const courseDir = path.join(sectionDir, courseSlug);
  const courseMeta = readJson(path.join(courseDir, 'meta.json'));
  const modSlugs = readOrderedSlugs(path.join(courseDir, 'meta.json')).filter((slug) =>
    fs.existsSync(path.join(courseDir, slug, 'meta.json')),
  );

  const modulos: ModuloNode[] = modSlugs.map((modSlug) => {
    const modDir = path.join(courseDir, modSlug);
    const modMeta = readJson(path.join(modDir, 'meta.json'));
    const { description, temas } = parseModuleMdx(path.join(modDir, 'index.mdx'), modSlug, baseUrl, courseSlug);
    return {
      title: modMeta.title as string,
      description,
      url: `${baseUrl}/${courseSlug}/${modSlug}`,
      temas,
    };
  });

  return {
    title: courseMeta.title as string,
    description: courseMeta.description as string,
    url: `${baseUrl}/${courseSlug}`,
    modulos,
  };
}

export function buildCourseIndex(): SectionNode[] {
  const sections: SectionNode[] = [];

  const cyberusuarioDir = path.join(contentRoot, 'cyberusuario');
  const cyberusuarioCourseSlugs = readOrderedSlugs(path.join(cyberusuarioDir, 'meta.json'));
  sections.push({
    slug: 'cyberusuario',
    name: 'CyberUsuario',
    title: 'CyberUsuario',
    description: 'Rutas de aprendizaje para colaboradores y usuarios finales.',
    cursos: cyberusuarioCourseSlugs.map((slug) => buildCourse(cyberusuarioDir, slug, cyberusuarioRoute)),
  });

  for (const d of domains) {
    const domainDir = path.join(contentRoot, d.slug);
    const courseSlugs = readOrderedSlugs(path.join(domainDir, 'meta.json'));
    sections.push({
      slug: d.slug,
      name: d.name,
      title: d.title,
      description: d.description,
      cursos: courseSlugs.map((slug) => buildCourse(domainDir, slug, `${academyRoute}/${d.slug}`)),
    });
  }

  return sections;
}

/** Índice con las URLs del idioma de la página y los nombres de sección traducidos (el contenido sigue en español). */
export function localizeCourseIndex(sections: SectionNode[], lang: string): SectionNode[] {
  const t = getT(lang);
  const url = (href: string) => localizeUrl(href, lang);
  return sections.map((section) => ({
    ...section,
    title: t(section.title),
    description: t(section.description),
    cursos: section.cursos.map((curso) => ({
      ...curso,
      url: url(curso.url),
      modulos: curso.modulos.map((modulo) => ({
        ...modulo,
        url: url(modulo.url),
        temas: modulo.temas.map((tema) => ({ ...tema, url: url(tema.url) })),
      })),
    })),
  }));
}
