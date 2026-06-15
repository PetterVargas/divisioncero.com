import { type FileObject, printErrors, scanURLs, validateFiles } from 'next-validate-link';
import { cyberacademySource, ciberseguridadEmpresarialSource } from '@/lib/source';

async function checkLinks() {
  const allCyberacademyPages = cyberacademySource.getPages();
  const allCiberseguridadPages = ciberseguridadEmpresarialSource.getPages();

  const scanned = await scanURLs({
    preset: 'next',
    populate: {
      'cyberacademy/[[...slug]]': allCyberacademyPages.map((page) => ({
        value: { slug: page.slugs },
        hashes: getHeadings(page),
      })),
      'ciberseguridad-empresarial/[[...slug]]': allCiberseguridadPages.map((page) => ({
        value: { slug: page.slugs },
        hashes: getHeadings(page),
      })),
    },
  });

  const files = await Promise.all([
    ...allCyberacademyPages.map((page) => toFileObject(page)),
    ...allCiberseguridadPages.map((page) => toFileObject(page)),
  ]);

  printErrors(
    await validateFiles(files, {
      scanned,
      markdown: {
        components: {
          Card: { attributes: ['href'] },
        },
      },
      checkRelativePaths: 'as-url',
    }),
    true,
  );
}

type AnyPage =
  | (typeof cyberacademySource)['$inferPage']
  | (typeof ciberseguridadEmpresarialSource)['$inferPage'];

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
