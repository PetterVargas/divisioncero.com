import fs from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import { Shield } from 'lucide-react';
import {
  cyberusuarioSource, corSource, cipSource, cifSource, capSource, ccnSource, thpSource, diaSource, adrSource,
} from '@/lib/cyberacademy/source';
import { domains } from '@/lib/cyberacademy/shared';
import { buildPageMetadata } from '@/lib/cyberacademy/metadata';
import { CursosExplorer, type Course, type DomainGroup } from '@/components/cyberacademy/cursos-explorer';
import { localizeUrl } from '@/lib/i18n';
import { getT, type Dictionary } from '@/lib/site-translations';

// Lee el contenido del disco: solo se renderiza en el build (en Cloudflare no hay filesystem).
export const dynamic = 'force-static';

const en: Dictionary = {
  'Todos los cursos': 'All courses',
  'Explora todos los cursos de CyberAcademy: las rutas de CyberUsuario y los cursos de CyberGuardián clasificados en sus 8 dominios.':
    'Explore all CyberAcademy courses: the CyberUsuario paths and the CyberGuardián courses organized into their 8 domains.',
  '{total} cursos entre las rutas de': '{total} courses across the',
  'y los': 'paths and the',
  'cursos de': 'courses of',
  ', clasificados en sus {count} dominios.': ', organized into their {count} domains.',
  'Rutas de aprendizaje para colaboradores y usuarios finales: hábitos seguros, identidad digital y protección en el día a día.':
    'Learning paths for employees and end users: safe habits, digital identity and everyday protection.',
};

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/cursos'>): Promise<Metadata> {
  const { lang } = await props.params;
  const t = getT(lang, en);
  return buildPageMetadata({
    title: t('Todos los cursos'),
    description: t(
      'Explora todos los cursos de CyberAcademy: las rutas de CyberUsuario y los cursos de CyberGuardián clasificados en sus 8 dominios.',
    ),
    path: localizeUrl('/cyberacademy/cursos', lang),
  });
}

type MinimalSource = {
  getPage: (slug?: string[], lang?: string) => { url: string; data: { title: string; description?: string } } | undefined;
};

const domainSourceMap: Record<string, MinimalSource> = {
  cor: corSource,
  cip: cipSource,
  cif: cifSource,
  cap: capSource,
  ccn: ccnSource,
  thp: thpSource,
  dia: diaSource,
  adr: adrSource,
};

function readOrderedCourseSlugs(metaPath: string): string[] {
  const raw = fs.readFileSync(metaPath, 'utf-8');
  const meta = JSON.parse(raw) as { pages?: string[] };
  return (meta.pages ?? []).filter((p) => !p.startsWith('---') && p !== 'index');
}

function buildCourses(source: MinimalSource, slugs: string[], lang: string): Course[] {
  return slugs.flatMap((slug) => {
    const page = source.getPage([slug], lang);
    if (!page) return [];
    return [{
      slug,
      title: page.data.title,
      description: page.data.description ?? '',
      url: page.url,
    }];
  });
}

export default async function CursosPage(props: PageProps<'/[lang]/cyberacademy/cursos'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);
  // Ruta literal (no `contentDir`): así el trazado de archivos del build solo incluye este directorio.
  const contentRoot = path.join(process.cwd(), 'content', 'cyberacademy');

  const cyberusuarioCourses = buildCourses(
    cyberusuarioSource,
    readOrderedCourseSlugs(path.join(contentRoot, 'cyberusuario', 'meta.json')),
    lang,
  );

  const guardianDomains: DomainGroup[] = domains.map((d) => ({
    slug: d.slug,
    name: d.name,
    title: t(d.title),
    description: t(d.description),
    courses: buildCourses(domainSourceMap[d.slug], readOrderedCourseSlugs(path.join(contentRoot, d.slug, 'meta.json')), lang),
  }));

  const totalCourses = cyberusuarioCourses.length + guardianDomains.reduce((acc, d) => acc + d.courses.length, 0);

  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-14 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 text-fd-primary text-sm font-medium mb-6">
          <Shield className="h-3.5 w-3.5" />
          CyberAcademy · DivisionCero
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          {t('Todos los cursos')}
        </h1>
        <p className="text-lg text-fd-muted-foreground leading-relaxed">
          {t('{total} cursos entre las rutas de', { total: totalCourses })} <b>CyberUsuario</b> {t('y los')}{' '}
          {guardianDomains.reduce((acc, d) => acc + d.courses.length, 0)} {t('cursos de')}{' '}
          <b>CyberGuardián</b>{t(', clasificados en sus {count} dominios.', { count: guardianDomains.length })}
        </p>
      </div>

      <CursosExplorer
        cyberusuario={{
          title: 'CyberUsuario',
          description: t('Rutas de aprendizaje para colaboradores y usuarios finales: hábitos seguros, identidad digital y protección en el día a día.'),
          courses: cyberusuarioCourses,
        }}
        domains={guardianDomains}
      />
    </main>
  );
}
