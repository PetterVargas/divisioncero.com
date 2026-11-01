// Genera las imágenes Open Graph (1200×630) como PNG en `public/`, con las mismas URLs que
// antes servían las rutas `og/*` de la app. Así `next/og` (satori + resvg.wasm, ~0,8 MiB
// comprimidos) no entra en el Worker de Cloudflare, que tiene un límite de 10 MiB.
// Se ejecuta antes de `next build` (ver `build:next` en package.json).
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import type { ReactElement } from 'react';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import * as site from '@/lib/shared';
import * as kudo from '@/lib/kudo/shared';
import * as academy from '@/lib/cyberacademy/shared';
import {
  blog, releases, cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource,
  getBlogPageImage, getReleasePageImage, getCyberacademyPageImage,
  getCiberseguridadEmpresarialPageImage, getSelfHostingPageImage,
} from '@/lib/source';
import { frameworkSource, sgxSource, getFrameworkPageImage, getSgxPageImage } from '@/lib/kudo/source';
import {
  cyberusuarioSource, cyberguardianSource, corSource, cipSource, cifSource, capSource, ccnSource, thpSource, diaSource, adrSource,
  getCyberusuarioPageImage, getCyberguardianPageImage, getCorPageImage, getCipPageImage, getCifPageImage,
  getCapPageImage, getCcnPageImage, getThpPageImage, getDiaPageImage, getAdrPageImage,
} from '@/lib/cyberacademy/source';

const PUBLIC_DIR = 'public';
const size = { width: 1200, height: 630 };

type Page = { data: { title?: string; description?: string } };
type Section = {
  site: string;
  pages: Page[];
  image: (page: never) => { url: string };
};

// Cada sección: sus páginas (en español, como hasta ahora) y la URL de su imagen.
const sections: Section[] = [
  { site: site.appName, pages: blog.getPages(), image: getBlogPageImage },
  { site: site.appName, pages: releases.getPages(), image: getReleasePageImage },
  { site: site.appName, pages: cyberacademySource.getPages(), image: getCyberacademyPageImage },
  { site: site.appName, pages: ciberseguridadEmpresarialSource.getPages(), image: getCiberseguridadEmpresarialPageImage },
  { site: site.appName, pages: selfHostingSource.getPages(), image: getSelfHostingPageImage },
  { site: kudo.appName, pages: frameworkSource.getPages(), image: getFrameworkPageImage },
  { site: kudo.appName, pages: sgxSource.getPages(), image: getSgxPageImage },
  ...[
    [cyberusuarioSource, getCyberusuarioPageImage],
    [cyberguardianSource, getCyberguardianPageImage],
    [corSource, getCorPageImage],
    [cipSource, getCipPageImage],
    [cifSource, getCifPageImage],
    [capSource, getCapPageImage],
    [ccnSource, getCcnPageImage],
    [thpSource, getThpPageImage],
    [diaSource, getDiaPageImage],
    [adrSource, getAdrPageImage],
  ].map(([source, image]) => ({
    site: academy.appName,
    pages: (source as { getPages: () => Page[] }).getPages(),
    image: image as Section['image'],
  })),
];

// Imágenes de portada de cada proyecto.
const homes: { url: string; element: ReactElement }[] = [
  {
    url: site.homeImageRoute,
    element: DefaultImage({ title: site.appName, description: site.appDescription, site: site.appName }),
  },
  {
    url: kudo.homeImageRoute,
    element: DefaultImage({ title: 'Kudo - Framework de Ciberseguridad por y para LatAm', description: kudo.appDescription, site: kudo.appName }),
  },
  {
    url: academy.homeImageRoute,
    element: DefaultImage({
      title: 'Prepárate para proteger el mundo',
      description: 'Aprende Ciberseguridad con el Kudo Framework de DivisionCero. Elige tu camino y empieza hoy.',
      site: academy.appName,
    }),
  },
  { url: '/herramientas/og/image.png', element: <HerramientasImage /> },
];

function HerramientasImage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0a0a0a',
        backgroundImage:
          'radial-gradient(circle at 22% 24%, rgba(77,174,132,0.35), transparent 42%), radial-gradient(circle at 82% 78%, rgba(77,174,132,0.22), transparent 45%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 24px',
          borderRadius: 999,
          border: '1px solid rgba(77,174,132,0.5)',
          color: '#4dae84',
          fontSize: 28,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        DivisionCero
      </div>
      <div style={{ display: 'flex', marginTop: 40, fontSize: 96, fontWeight: 700, color: '#fafafa', letterSpacing: -2 }}>
        Herramientas
      </div>
      <div style={{ display: 'flex', marginTop: 16, fontSize: 34, color: '#a3a3a3' }}>Ciberseguridad para el día a día</div>
      <div style={{ display: 'flex', gap: 16, marginTop: 56 }}>
        {['Contraseñas', 'Hash', 'QR', 'SPF', 'Base64', 'UUID'].map((label) => (
          <div
            key={label}
            style={{
              display: 'flex',
              padding: '10px 22px',
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.06)',
              color: '#e5e5e5',
              fontSize: 24,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

async function render(url: string, element: ReactElement) {
  const png = Buffer.from(await new ImageResponse(element, size).arrayBuffer());
  const file = join(PUBLIC_DIR, url);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, png);
}

async function main() {
  const jobs = [
    ...homes,
    ...sections.flatMap(({ site: siteName, pages, image }) =>
      pages.map((page) => ({
        url: image(page as never).url,
        element: DefaultImage({ title: page.data.title, description: page.data.description, site: siteName }),
      })),
    ),
  ];

  // Unas cuantas a la vez: resvg es síncrono, pero satori carga fuentes de forma asíncrona.
  const queue = [...jobs];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      for (let job = queue.shift(); job; job = queue.shift()) await render(job.url, job.element);
    }),
  );
  console.log(`[og] ${jobs.length} imágenes generadas en ${PUBLIC_DIR}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
