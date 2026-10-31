import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Presentation } from 'lucide-react';
import { presentacionesRoute } from '@/lib/cyberacademy/shared';
import { buildPageMetadata } from '@/lib/cyberacademy/metadata';
import { domainVisuals, cyberusuarioVisual, type DomainVisual } from '@/lib/cyberacademy/domain-visuals';
import { getDeckGroups, type Deck } from '@/lib/cyberacademy/presentaciones';
import { localizeUrl } from '@/lib/i18n';
import { getT, type Dictionary, type TFunction } from '@/lib/site-translations';

const en: Dictionary = {
  'Presentaciones gratuitas de Ciberseguridad de CyberAcademy por DivisionCero: CyberUsuario y los 8 dominios de CyberGuardián, listas para compartir con tu equipo.':
    'Free CyberAcademy cybersecurity presentations by DivisionCero: CyberUsuario and the 8 CyberGuardián domains, ready to share with your team.',
  '1 presentación': '1 presentation',
  '{count} presentaciones': '{count} presentations',
  'Ver presentación': 'View presentation',
  'Ir a presentaciones de {name}': 'Go to {name} presentations',
  '{count} de los cursos de': '{count} from the courses of',
  y: 'and',
  '. Explóralas y compártelas con tu organización.': '. Explore them and share them with your organization.',
};

export async function generateMetadata(props: PageProps<'/[lang]/cyberacademy/presentaciones'>): Promise<Metadata> {
  const { lang } = await props.params;
  const t = getT(lang, en);
  return buildPageMetadata({
    title: t('Presentaciones'),
    description: t(
      'Presentaciones gratuitas de Ciberseguridad de CyberAcademy por DivisionCero: CyberUsuario y los 8 dominios de CyberGuardián, listas para compartir con tu equipo.',
    ),
    path: localizeUrl(presentacionesRoute, lang),
  });
}

const otherVisual: DomainVisual = {
  icon: Presentation,
  color: 'from-fd-primary/10 to-fd-primary/5 border-fd-primary/20 hover:border-fd-primary/50',
  iconColor: 'text-fd-primary',
  badge: 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary',
};

function deckCountLabel(count: number, t: TFunction) {
  return count === 1 ? t('1 presentación') : t('{count} presentaciones', { count });
}

function visualFor(slug: string): DomainVisual {
  if (slug === 'cyberusuario') return cyberusuarioVisual;
  return domainVisuals[slug] ?? otherVisual;
}

function DeckCard({ deck, visual, t }: { deck: Deck; visual: DomainVisual; t: TFunction }) {
  return (
    <a
      href={deck.url}
      title={deck.title}
      className={`group flex flex-col gap-3 p-5 rounded-xl border bg-gradient-to-br ${visual.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="font-semibold text-fd-foreground leading-snug">{deck.title}</div>
      <p className="text-sm text-fd-muted-foreground line-clamp-3 flex-1">{deck.description}</p>
      <div className={`flex items-center gap-1 text-xs font-medium ${visual.iconColor} group-hover:gap-2 transition-all mt-auto`}>
        {t('Ver presentación')} <ArrowRight className="h-3 w-3" />
      </div>
    </a>
  );
}

export default async function PresentacionesPage(props: PageProps<'/[lang]/cyberacademy/presentaciones'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);
  const groups = getDeckGroups();
  const total = groups.reduce((acc, group) => acc + group.decks.length, 0);

  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-fd-primary/30 bg-fd-primary/10 text-fd-primary text-sm font-medium mb-6">
          <Presentation className="h-3.5 w-3.5" />
          CyberAcademy · DivisionCero
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
          {t('Presentaciones')}
        </h1>
        <p className="text-lg text-fd-muted-foreground leading-relaxed">
          {t('{count} de los cursos de', { count: deckCountLabel(total, t) })} <b>CyberUsuario</b> {t('y')}{' '}
          <b>CyberGuardián</b>{t('. Explóralas y compártelas con tu organización.')}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-14">
        {groups.map((group) => {
          const visual = visualFor(group.slug);
          const Icon = group.slug === 'cyberusuario' ? BookOpen : visual.icon;
          return (
            <a
              key={group.slug}
              href={`#${group.slug}`}
              title={t('Ir a presentaciones de {name}', { name: group.name })}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${visual.badge}`}
            >
              <Icon className="h-3 w-3" /> {group.name}
            </a>
          );
        })}
      </div>

      {groups.map((group) => {
        const visual = visualFor(group.slug);
        const Icon = group.slug === 'cyberusuario' ? BookOpen : visual.icon;
        return (
          <section key={group.slug} id={group.slug} className="scroll-mt-24 mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-semibold ${visual.badge}`}>
                <Icon className="h-3.5 w-3.5" /> {group.name === group.title ? group.name : `${group.name} — ${t(group.title)}`}
              </div>
              <span className="text-sm text-fd-muted-foreground">
                {deckCountLabel(group.decks.length, t)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.decks.map((deck) => (
                <DeckCard key={deck.slug} deck={deck} visual={visual} t={t} />
              ))}
            </div>
          </section>
        );
      })}

    </main>
  );
}
