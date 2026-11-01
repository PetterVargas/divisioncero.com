import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getAllTabs, getDomainSubTabs } from '@/lib/cyberacademy/layout.shared';
import { SubSectionPicker } from '@/components/sub-section-picker';
import * as PageTree from 'fumadocs-core/page-tree';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  tree: PageTree.Root;
}

export function DomainDocsLayout({ children, tree }: Props) {
  const subTabs = getDomainSubTabs(tree);
  return (
    <DocsLayout
      tree={tree}
      tabs={getAllTabs()}
      sidebar={subTabs.length > 0 ? { banner: <SubSectionPicker tabs={subTabs} placeholder="Seleccionar curso" /> } : undefined}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
