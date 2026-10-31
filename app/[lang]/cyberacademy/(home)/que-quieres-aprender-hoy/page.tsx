import type { Metadata } from 'next';
import { Sparkles } from 'lucide-react';
import { buildCourseIndex, localizeCourseIndex } from '@/lib/cyberacademy/course-index';
import { localizeUrl } from '@/lib/i18n';
import { getT, type Dictionary } from '@/lib/site-translations';
import { buildPageMetadata } from '@/lib/cyberacademy/metadata';
import { AprendeHoyExplorer } from '@/components/cyberacademy/aprende-hoy-explorer';

// Lee el contenido del disco: solo se renderiza en el build (en Cloudflare no hay filesystem).
export const dynamic = 'force-static';

const en: Dictionary = {
  'Busca entre todos los cursos, módulos y temas de CyberAcademy — CyberUsuario y CyberGuardián — y llega directo al contenido que necesitas.':
    'Search all CyberAcademy courses, modules and topics — CyberUsuario and CyberGuardián — and go straight to the content you need.',
  'Explora todo el catálogo de CyberAcademy o escribe un tema y te llevamos directo al curso, módulo o tema específico que buscas.':
    "Explore the full CyberAcademy catalog or type a topic and we'll take you straight to the course, module or topic you're looking for.",
};

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/que-quieres-aprender-hoy'>): Promise<Metadata> {
  const { lang } = await props.params;
  const t = getT(lang, en);
  return buildPageMetadata({
    title: t('¿Qué quieres aprender hoy?'),
    description: t(
      'Busca entre todos los cursos, módulos y temas de CyberAcademy — CyberUsuario y CyberGuardián — y llega directo al contenido que necesitas.',
    ),
    path: localizeUrl('/cyberacademy/que-quieres-aprender-hoy', lang),
  });
}

export default async function QueQuieresAprenderHoyPage(props: PageProps<'/[lang]/cyberacademy/que-quieres-aprender-hoy'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);
  const sections = localizeCourseIndex(buildCourseIndex(), lang);

  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 text-fd-primary text-sm font-medium mb-6">
          <Sparkles className="h-3.5 w-3.5" />
          CyberAcademy · DivisionCero
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          {t('¿Qué quieres aprender hoy?')}
        </h1>
        <p className="text-lg text-fd-muted-foreground leading-relaxed">
          {t('Explora todo el catálogo de CyberAcademy o escribe un tema y te llevamos directo al curso, módulo o tema específico que buscas.')}
        </p>
      </div>

      <AprendeHoyExplorer sections={sections} />
    </main>
  );
}
