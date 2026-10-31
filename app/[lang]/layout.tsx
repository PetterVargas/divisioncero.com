import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { CookieConsent } from '@/components/cookie-consent';
import { appName, appDescription, baseUrl, cookieConsentKey, homeImageRoute } from '@/lib/shared';
import { bannerHideScript, subscribeBannerId } from '@/lib/banner';
import { i18n, translations } from '@/lib/i18n';
import { i18nProvider } from 'fumadocs-ui/i18n';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import '../global.css';
import 'katex/dist/katex.css';

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: appName,
  url: baseUrl,
  logo: `${baseUrl}/android-chrome-512x512.png`,
  sameAs: [
    'https://x.com/divisioncero',
    'https://github.com/PetterVargas',
    'https://linkedin.com/company/divisioncero',
    'https://facebook.com/divisioncerocom',
    'https://instagram.com/divisioncero',
    'https://youtube.com/@divisioncero',
    'https://tiktok.com/@divisioncero',
    'https://discord.com/invite/RPxQTPBfvG',
  ],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: appName,
  url: baseUrl,
};

const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${appName} - ${appDescription}`,
    template: `%s | ${appName}`,
  },
  description: 'DivisionCero es una comunidad y plataforma de Ciberseguridad para LatAm: Kudo Framework open-source, CyberAcademy, herramientas gratuitas y servicios para empresas.',
  keywords: [
    'ciberseguridad',
    'ciberseguridad LatAm',
    'ciberseguridad empresarial',
    'CyberAcademy',
    'Kudo Framework',
    'framework de ciberseguridad open-source',
    'herramientas de ciberseguridad',
    'capacitación en ciberseguridad',
    'consultoría de ciberseguridad',
    'seguridad de la información',
    'phishing',
    'OWASP',
    'CISO',
    'SOC',
    'DevSecOps',
    'protección de datos',
    'cumplimiento normativo',
  ],
  authors: [{ name: 'Peter Vargas', url: 'https://petervargas.com' }],
  creator: 'Peter Vargas',
  publisher: 'divisioncero.com',
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        {
          title: appName,
          url: `${baseUrl}/rss.xml`,
        },
      ],
    },
  },
  openGraph: {
    url: baseUrl,
    siteName: appName,
    locale: 'es_419',
    type: 'website',
    images: homeImageRoute,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@divisioncero',
    images: homeImageRoute,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      type: 'image/png',
    },
    other: [
      {
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        url: '/mstile-150x150.png',
        sizes: '150x150',
        type: 'image/png',
      },
    ],
  },
};

const enDescription =
  'DivisionCero is a cybersecurity community and platform for LatAm: the open-source Kudo Framework, CyberAcademy, free tools and services for companies.';

export async function generateMetadata(props: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await props.params;
  if (lang !== 'en') return metadata;
  return {
    ...metadata,
    title: {
      default: `${appName} - Cybersecurity by and for LatAm`,
      template: `%s | ${appName}`,
    },
    description: enDescription,
    alternates: { ...metadata.alternates, canonical: '/en' },
    openGraph: { ...metadata.openGraph, url: `${baseUrl}/en`, locale: 'en_US' },
  };
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export const dynamicParams = false;

const inter = Inter({
  subsets: ['latin'],
});

export default async function RootLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!(i18n.languages as string[]).includes(lang)) notFound();

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{ __html:
          `.fd-feedback-container ::highlight(fd-feedback-text){background-color:var(--color-fd-primary);color:var(--color-fd-primary-foreground);}`
        }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ ...websiteJsonLd, inLanguage: lang }) }}
        />
      </head>
      <body className={inter.className}>
        <Script id="banner-hide" strategy="beforeInteractive">
          {bannerHideScript(subscribeBannerId)}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5KWQPXJPX4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            var consent = null;
            try { consent = localStorage.getItem('${cookieConsentKey}'); } catch (e) {}
            gtag('consent', 'default', {
              analytics_storage: consent === 'accepted' ? 'granted' : 'denied',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
            gtag('js', new Date());
            gtag('config', 'G-5KWQPXJPX4');
          `}
        </Script>
        <Provider i18n={i18nProvider(translations, lang)}>
          {children}
          <WhatsAppButton />
          <CookieConsent />
        </Provider>
      </body>
    </html>
  );
}

