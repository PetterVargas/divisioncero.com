'use client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { create } from 'zbsearch';
import { useI18n } from 'fumadocs-ui/contexts/i18n';
import { usePathname } from 'next/navigation';
import { stripLocale } from '@/lib/i18n';

function initOrama() {
  return create({
    schema: { _: 'string' },
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: 'english',
  });
}

// Índices estáticos por idioma (los genera `scripts/search-generate.ts`): Kudo y CyberAcademy
// tienen el suyo; el resto del sitio usa el de divisioncero.com.
function searchIndexFor(pathname: string, locale: string) {
  const section = ['kudo', 'cyberacademy'].find((name) => pathname === `/${name}` || pathname.startsWith(`/${name}/`));
  return `/search/${locale}/${section ?? 'site'}.json`;
}

export default function DefaultSearchDialog(props: SharedProps) {
  const { locale = 'es' } = useI18n();
  const pathname = stripLocale(usePathname());
  // Cada índice ya trae las URLs de su idioma (`/en/...` en inglés).
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    from: searchIndexFor(pathname, locale),
    initOrama,
  });
  const items = query.data !== 'empty' && query.data ? query.data : null;

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={items} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
