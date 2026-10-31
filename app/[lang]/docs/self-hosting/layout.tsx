import { selfHostingSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions, getSectionTabs } from '@/lib/layout.shared';

export default async function Layout({ children, params }: LayoutProps<'/[lang]/docs/self-hosting'>) {
  const { lang } = await params;
  return (
    <DocsLayout
      tree={selfHostingSource.getPageTree(lang)}
      tabs={getSectionTabs(lang)}
      {...baseOptions(lang)}
    >
      {children}
    </DocsLayout>
  );
}
