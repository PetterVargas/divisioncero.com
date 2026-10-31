import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getAllTabs, getDomainSubTabs } from '@/lib/cyberacademy/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';
import * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';
import { getT } from '@/lib/site-translations';

interface Props {
  children: ReactNode;
  tree: PageTree.Root;
  lang: string;
}

export function DomainDocsLayout({ children, tree, lang }: Props) {
  const subTabs = getDomainSubTabs(tree);
  return (
    <DocsLayout
      tree={tree}
      tabs={getAllTabs(lang)}
      sidebar={subTabs.length > 0 ? { banner: <SubSectionPicker tabs={subTabs} placeholder={getT(lang)('Seleccionar curso')} /> } : undefined}
      {...baseOptions(lang)}
    >
      {children}
    </DocsLayout>
  );
}
