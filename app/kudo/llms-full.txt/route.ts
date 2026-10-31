import { frameworkSource, sgxSource, getLLMText } from '@/lib/kudo/source';
import { defaultLocale } from '@/lib/i18n';

export const revalidate = false;

export async function GET() {
  const pages = [...frameworkSource.getPages(defaultLocale), ...sgxSource.getPages(defaultLocale)];
  const scanned = await Promise.all(pages.map(getLLMText));

  return new Response(scanned.join('\n\n'));
}
