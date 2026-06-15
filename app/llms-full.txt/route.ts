import { cyberacademySource, ciberseguridadEmpresarialSource, getLLMText } from '@/lib/source';

export const revalidate = false;

export async function GET() {
  const pages = [
    ...cyberacademySource.getPages(),
    ...ciberseguridadEmpresarialSource.getPages(),
  ];
  const scanned = await Promise.all(pages.map(getLLMText));

  return new Response(scanned.join('\n\n'));
}
