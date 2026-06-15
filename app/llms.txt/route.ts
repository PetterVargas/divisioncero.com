import { cyberacademySource, ciberseguridadEmpresarialSource } from '@/lib/source';
import { llms } from 'fumadocs-core/source';

export const revalidate = false;

export function GET() {
  const content = [
    llms(cyberacademySource).index(),
    llms(ciberseguridadEmpresarialSource).index(),
  ].join('\n\n');

  return new Response(content);
}
