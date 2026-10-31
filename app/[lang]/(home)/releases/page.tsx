import Link from 'next/link';
import { releases } from '@/lib/source';
import { Rocket } from 'lucide-react';
import { pageMetadata } from '@/lib/shared';
import { getT, type Dictionary } from '@/lib/site-translations';

const en: Dictionary = {
  'Lanzamientos': 'Releases',
  'Lanzamientos y actualizaciones sobre la plataforma': 'Releases and platform updates',
  'Lanzamientos y actualizaciones sobre la plataforma DivisionCero.': 'Releases and updates on the DivisionCero platform.',
};


export default async function ReleaseIndexPage(props: PageProps<'/[lang]/releases'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);
  const posts = releases.getPages(lang);

  const sortedPosts = [...posts].sort((a, b) =>
    new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <div className="flex flex-col items-center justify-center mb-4">
          <div className="w-14 h-14 bg-fd-primary/10 rounded-lg flex items-center justify-center">
            <Rocket className="h-7 w-7 text-fd-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('Lanzamientos')}</h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto">
          {t('Lanzamientos y actualizaciones sobre la plataforma')}
        </p>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {sortedPosts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            title={post.data.title}
            className="block bg-fd-card rounded-lg shadow-sm border border-border hover:border-fd-foreground/20 hover:bg-muted/50 overflow-hidden transition-all duration-200"
          >
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="inline-flex items-center justify-center shrink-0 text-xs font-mono font-semibold px-2 py-1 rounded-md bg-fd-primary/10 text-fd-primary w-fit">
                {post.data.version}
              </span>
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-1">{post.data.title}</h2>
                <p className="text-xs line-clamp-2 text-fd-muted-foreground">{post.data.description}</p>
              </div>
              <p className="text-xs text-fd-muted-foreground shrink-0">
                {new Date(post.data.date).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export async function generateMetadata(props: PageProps<'/[lang]/releases'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);
  return pageMetadata({
    lang,
    path: '/releases',
    title: t('Releases'),
    description: t('Lanzamientos y actualizaciones sobre la plataforma DivisionCero.'),
  });
}
