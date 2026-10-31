import fs from 'node:fs';
import path from 'node:path';
import { domains, presentacionesRoute } from '@/lib/cyberacademy/shared';

export type Deck = {
  slug: string;
  title: string;
  description: string;
  url: string;
  // Decks de referencia (p. ej. la demo de Slidev): se publican pero no se indexan.
  noindex: boolean;
};

export type DeckGroup = {
  slug: string;
  name: string;
  title: string;
  decks: Deck[];
};

// Mismo registro que usa el build de Slidev (cyberacademy/presentaciones/decks.json).
const decksPath = path.join(process.cwd(), 'cyberacademy', 'presentaciones', 'decks.json');

function readDecks(): Deck[] {
  const raw = JSON.parse(fs.readFileSync(decksPath, 'utf-8')) as {
    slug: string;
    title: string;
    description?: string;
    noindex?: boolean;
  }[];
  return raw.map((deck) => ({
    slug: deck.slug,
    title: deck.title,
    description: deck.description ?? '',
    url: `${presentacionesRoute}/${deck.slug}/`,
    noindex: deck.noindex ?? false,
  }));
}

/**
 * Agrupa las presentaciones como los cursos: los slugs `curso-*` son de
 * CyberUsuario y los que empiezan por un dominio (`cor-`, `adr-`...) son de
 * CyberGuardián. Lo que no encaja queda en "Otras".
 */
export function getDeckGroups(): DeckGroup[] {
  const decks = readDecks();
  const used = new Set<string>();
  const take = (match: (slug: string) => boolean) =>
    decks.filter((deck) => !used.has(deck.slug) && match(deck.slug)).map((deck) => (used.add(deck.slug), deck));

  const groups: DeckGroup[] = [
    { slug: 'cyberusuario', name: 'CyberUsuario', title: 'CyberUsuario', decks: take((s) => s.startsWith('curso-')) },
    ...domains.map((d) => ({
      slug: d.slug,
      name: d.name,
      title: d.title,
      decks: take((s) => s.startsWith(`${d.slug}-`)),
    })),
  ];
  groups.push({ slug: 'otras', name: 'Otras', title: 'Otras presentaciones', decks: take(() => true) });

  return groups.filter((group) => group.decks.length > 0);
}
