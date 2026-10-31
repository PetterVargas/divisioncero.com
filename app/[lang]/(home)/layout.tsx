import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default async function Layout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <SiteLayout lang={lang}>{children}</SiteLayout>;
}
