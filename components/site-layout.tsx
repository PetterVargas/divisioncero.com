import type { ReactNode } from 'react';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { SiteBanner } from '@/components/site-banner';
import { subscribeBannerId } from '@/lib/banner';
import { getBaseOptions } from '@/app/layout.config';
import { Footer } from '@/components/site-footer';
import { FooterReveal } from '@/components/footer-reveal';
import { SubscribeDialog } from '@/components/subscribe-dialog';

/**
 * Shell público de divisioncero.com: banner, navbar y footer. Lo comparten las
 * páginas de inicio de DivisionCero, Kudo (/kudo) y CyberAcademy (/cyberacademy).
 */
export function SiteLayout({ children, askAIPrompt }: { children: ReactNode; askAIPrompt?: string }) {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteBanner
        id={subscribeBannerId}
        rainbowColors={[
          '#39b298',
          '#39b298',
          'transparent',
          '#39b298',
          'transparent',
          '#39b298',
          'transparent',
        ]}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2">
          <SubscribeDialog>🚀 Newsletter de DivisionCero 👀</SubscribeDialog>
        </div>
      </SiteBanner>
      <HomeLayout
        {...getBaseOptions()}
        className="flex-grow"
      >
        {children}
      </HomeLayout>
      <Footer askAIPrompt={askAIPrompt} />
      <FooterReveal />
    </div>
  );
}
