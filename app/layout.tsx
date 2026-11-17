import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Provider } from '@/components/provider';
import { WhatsAppButton } from '@/components/whatsapp-button';
import { CookieConsent } from '@/components/cookie-consent';
import { appName, appDescription, baseUrl, cookieConsentKey, googleTagId, homeImageRoute } from '@/lib/shared';
import { bannerHideScript, subscribeBannerId } from '@/lib/banner';
import Script from 'next/script';
import './global.css';
import 'katex/dist/katex.css';

const siteDescription =
  'DivisionCero, comunidad y plataforma de Ciberseguridad para LatAm: Kudo Framework open-source, CyberAcademy, herramientas gratis y servicios para empresas.';

// Datos de la organización y del sitio para Google (nombre del sitio, logo,
// panel de conocimiento) y para los LLM. `alternateName` cubre las búsquedas
// "division cero" / "división cero".
const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: appName,
  alternateName: ['Division Cero', 'División Cero', 'divisioncero.com'],
  url: baseUrl,
  description: siteDescription,
  slogan: appDescription,
  logo: {
    '@type': 'ImageObject',
    url: `${baseUrl}/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  image: `${baseUrl}${homeImageRoute}`,
  founder: { '@type': 'Person', name: 'Peter Vargas', url: 'https://petervargas.com' },
  areaServed: 'Latinoamérica',
  knowsAbout: ['Ciberseguridad', 'Seguridad de la información', 'Gestión de riesgos', 'Cumplimiento normativo', 'Concientización en ciberseguridad'],
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
  '@id': `${baseUrl}/#website`,
  name: appName,
  alternateName: ['Division Cero', 'División Cero'],
  url: `${baseUrl}/`,
  description: siteDescription,
  inLanguage: 'es',
  publisher: { '@id': `${baseUrl}/#organization` },
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${appName} - ${appDescription}`,
    template: `%s | ${appName}`,
  },
  description: siteDescription,
  applicationName: appName,
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
  // Google muestra el favicon recortado en círculo sobre fondo claro u oscuro:
  // los íconos llevan fondo blanco y margen, en múltiplos de 48 px.
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
  manifest: '/site.webmanifest',
};

const inter = Inter({
  subsets: ['latin'],
});

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es" suppressHydrationWarning>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <Script id="banner-hide" strategy="beforeInteractive">
          {bannerHideScript(subscribeBannerId)}
        </Script>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
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
            gtag('config', '${googleTagId}');
          `}
        </Script>
        <Provider>
          {children}
          <WhatsAppButton />
          <CookieConsent />
        </Provider>
      </body>
    </html>
  );
}

