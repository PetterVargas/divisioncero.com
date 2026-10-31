import { type FileObject, printErrors, scanURLs, validateFiles } from 'next-validate-link';
import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import remarkMath from 'remark-math';
import { cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource } from '@/lib/source';
import { frameworkSource, sgxSource } from '@/lib/kudo/source';
import { cyberusuarioSource, cyberguardianSource, allDomainSources } from '@/lib/cyberacademy/source';
import { domains } from '@/lib/cyberacademy/shared';
import { defaultLocale } from '@/lib/i18n';

type AnyPage = {
  slugs: string[];
  url: string;
  absolutePath?: string;
  data: {
    toc: { url: string }[];
    getText: (type: 'raw' | 'processed') => Promise<string>;
  };
};

type AnySource = { getPages: (lang?: string) => AnyPage[] };

// Ruta dinámica de la app → source que la genera.
const sections: { route: string; source: AnySource }[] = [
  { route: 'docs/cyberacademy/[[...slug]]', source: cyberacademySource },
  { route: 'docs/ciberseguridad-empresarial/[[...slug]]', source: ciberseguridadEmpresarialSource },
  { route: 'docs/self-hosting/[[...slug]]', source: selfHostingSource },
  { route: 'kudo/framework/[[...slug]]', source: frameworkSource },
  { route: 'kudo/sgx/[[...slug]]', source: sgxSource },
  { route: 'cyberacademy/cyberusuario/[[...slug]]', source: cyberusuarioSource },
  { route: 'cyberacademy/cyberguardian/[[...slug]]', source: cyberguardianSource },
  ...allDomainSources.map((source, i) => ({ route: `cyberacademy/${domains[i].slug}/[[...slug]]`, source })),
];

async function checkLinks() {
  const pagesBySection = sections.map(({ route, source }) => ({ route, pages: source.getPages(defaultLocale) }));

  const scanned = await scanURLs({
    preset: 'next',
    // Las rutas viven en app/[lang]; el contenido enlaza a la versión en español, sin prefijo.
    populate: {
      '[lang]': [{ value: { lang: defaultLocale } }],
      ...Object.fromEntries(
        pagesBySection.map(({ route, pages }) => [
          `[lang]/${route}`,
          pages.map((page) => ({
            value: { lang: defaultLocale, slug: page.slugs },
            hashes: getHeadings(page),
          })),
        ]),
      ),
    },
  });

  const localePrefix = `/${defaultLocale}`;
  for (const [url, meta] of [...scanned.urls]) {
    if (url === localePrefix) scanned.urls.set('/', meta);
    else if (url.startsWith(`${localePrefix}/`)) scanned.urls.set(url.slice(localePrefix.length), meta);
  }

  // Los archivos de public/ (descargas, imágenes) también son URLs válidas.
  for (const url of listPublicUrls('public')) scanned.urls.set(url, {});

  const files = await Promise.all(pagesBySection.flatMap(({ pages }) => pages.map((page) => toFileObject(page))));

  printErrors(
    await validateFiles(files, {
      scanned,
      markdown: {
        remarkPlugins: [remarkMath],
        components: {
          Card: { attributes: ['href'] },
        },
      },
      checkRelativePaths: 'as-url',
    }),
    true,
  );
}

function listPublicUrls(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => `/${relative(dir, join(entry.parentPath, entry.name)).split(sep).join('/')}`);
}

function getHeadings(page: AnyPage): string[] {
  return page.data.toc.map((item) => item.url.slice(1));
}

async function toFileObject(page: AnyPage): Promise<FileObject> {
  return {
    path: page.absolutePath ?? '',
    content: await page.data.getText('raw'),
    url: page.url,
    data: page.data,
  };
}

void checkLinks();
