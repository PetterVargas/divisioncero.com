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
import { usePathname } from 'next/navigation';

function initOrama() {
  return create({
    schema: { _: 'string' },
    // https://docs.orama.com/docs/orama-js/supported-languages
    language: 'english',
  });
}

// Índices estáticos (los genera `scripts/search-generate.ts`): Kudo y CyberAcademy
// tienen el suyo; el resto del sitio usa el de divisioncero.com.
function searchIndexFor(pathname: string) {
  const section = ['kudo', 'cyberacademy'].find((name) => pathname === `/${name}` || pathname.startsWith(`/${name}/`));
  return `/search/${section ?? 'site'}.json`;
}

export default function DefaultSearchDialog(props: SharedProps) {
  const pathname = usePathname();
  const { search, setSearch, query } = useDocsSearch({
    type: 'static',
    from: searchIndexFor(pathname),
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
