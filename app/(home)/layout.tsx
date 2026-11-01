import type { ReactNode } from 'react';
import { SiteLayout } from '@/components/site-layout';

export default async function Layout({ children }: { children: ReactNode }) {
  return <SiteLayout>{children}</SiteLayout>;
}
