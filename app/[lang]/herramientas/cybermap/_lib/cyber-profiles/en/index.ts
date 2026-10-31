import type { Dictionary } from '@/lib/site-translations';

import { africaEn } from './africa';
import { americasEn } from './americas';
import { asiaEn } from './asia';
import { europeEn } from './europe';
import { oceaniaEn } from './oceania';

/**
 * Descripciones de los perfiles de ciberseguridad en inglés, indexadas por el texto en español.
 * Se carga solo en /en (import dinámico desde el diálogo del país).
 */
export const descriptionsEn: Dictionary = {
  ...africaEn,
  ...americasEn,
  ...asiaEn,
  ...europeEn,
  ...oceaniaEn,
};
