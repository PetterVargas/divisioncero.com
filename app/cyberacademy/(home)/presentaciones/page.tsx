import type { Metadata } from 'next';
import { ArrowRight, BookOpen, Presentation } from 'lucide-react';
import { presentacionesRoute } from '@/lib/cyberacademy/shared';
import { buildPageMetadata } from '@/lib/cyberacademy/metadata';
import { domainVisuals, cyberusuarioVisual, type DomainVisual } from '@/lib/cyberacademy/domain-visuals';
import { getDeckGroups, type Deck } from '@/lib/cyberacademy/presentaciones';

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: 'Presentaciones',
    description: 'Presentaciones gratuitas de Ciberseguridad de CyberAcademy por DivisionCero: CyberUsuario y los 8 dominios de CyberGuardián, listas para compartir con tu equipo.',
    path: presentacionesRoute,
  });
}

const otherVisual: DomainVisual = {
  icon: Presentation,
  color: 'from-fd-primary/10 to-fd-primary/5 border-fd-primary/20 hover:border-fd-primary/50',
  iconColor: 'text-fd-primary',
  badge: 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary',
};

function deckCountLabel(count: number) {
  return count === 1 ? '1 presentación' : `${count} presentaciones`;
}

function visualFor(slug: string): DomainVisual {
  if (slug === 'cyberusuario') return cyberusuarioVisual;
  return domainVisuals[slug] ?? otherVisual;
}

function DeckCard({ deck, visual }: { deck: Deck; visual: DomainVisual; }) {
  return (
    <a
      href={deck.url}
      title={deck.title}
      className={`group flex flex-col gap-3 p-5 rounded-xl border bg-gradient-to-br ${visual.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}
    >
      <div className="font-semibold text-fd-foreground leading-snug">{deck.title}</div>
      <p className="text-sm text-fd-muted-foreground line-clamp-3 flex-1">{deck.description}</p>
      <div className={`flex items-center gap-1 text-xs font-medium ${visual.iconColor} group-hover:gap-2 transition-all mt-auto`}>
        Ver presentación <ArrowRight className="h-3 w-3" />
      </div>
    </a>
  );
}

export default function PresentacionesPage() {
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
          Presentaciones
        </h1>
        <p className="text-lg text-fd-muted-foreground leading-relaxed">
          {`${deckCountLabel(total)} de los cursos de`} <b>CyberUsuario</b> y{' '}
          <b>CyberGuardián</b>. Explóralas y compártelas con tu organización.
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
              title={`Ir a presentaciones de ${group.name}`}
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
                <Icon className="h-3.5 w-3.5" /> {group.name === group.title ? group.name : `${group.name} — ${group.title}`}
              </div>
              <span className="text-sm text-fd-muted-foreground">
                {deckCountLabel(group.decks.length)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.decks.map((deck) => (
                <DeckCard key={deck.slug} deck={deck} visual={visual} />
              ))}
            </div>
          </section>
        );
      })}

    </main>
  );
}
