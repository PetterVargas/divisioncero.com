import { ciberseguridadEmpresarialSource, getCiberseguridadEmpresarialPageImage } from '@/lib/source';
import { notFound } from 'next/navigation';
import { ImageResponse } from 'next/og';
import { generate as DefaultImage } from 'fumadocs-ui/og';
import { appName } from '@/lib/shared';

export const revalidate = false;

export async function GET(_req: Request, { params }: RouteContext<'/og/ciberseguridad-empresarial/[...slug]'>) {
  const { slug } = await params;
  const page = ciberseguridadEmpresarialSource.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site={appName} />,
    {
      width: 1200,
      height: 630,
    },
  );
}

export function generateStaticParams() {
  return ciberseguridadEmpresarialSource.getPages().map((page) => ({
    slug: getCiberseguridadEmpresarialPageImage(page).segments,
  }));
}
