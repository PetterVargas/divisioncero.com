import { cyberacademySource, ciberseguridadEmpresarialSource, selfHostingSource, getLLMText } from '@/lib/source';
import { defaultLocale } from '@/lib/i18n';

export const revalidate = false;

export async function GET() {
  const pages = [
    ...cyberacademySource.getPages(defaultLocale),
    ...ciberseguridadEmpresarialSource.getPages(defaultLocale),
    ...selfHostingSource.getPages(defaultLocale),
  ];
  const scanned = await Promise.all(pages.map(getLLMText));

  return new Response(scanned.join('\n\n'));
}
