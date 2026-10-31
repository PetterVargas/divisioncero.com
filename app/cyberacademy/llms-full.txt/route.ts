import { cyberusuarioSource, cyberguardianSource, allDomainSources, getLLMText } from '@/lib/cyberacademy/source';
import { defaultLocale } from '@/lib/i18n';

export const revalidate = false;

export async function GET() {
  const pages = [
    ...cyberusuarioSource.getPages(defaultLocale),
    ...cyberguardianSource.getPages(defaultLocale),
    ...allDomainSources.flatMap((s) => s.getPages(defaultLocale)),
  ];
  const scanned = await Promise.all(pages.map(getLLMText));
  return new Response(scanned.join('\n\n'));
}
