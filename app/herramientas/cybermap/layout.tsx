import { ToolJsonLd } from '@/components/herramientas/tool-json-ld';
import { toolMetadata } from '@/lib/herramientas/seo';

const title = 'CyberMap';
const description = 'CyberMap: mapa mundial interactivo de ciberseguridad para visualizar el panorama de amenazas, ciberataques y el perfil de ciberseguridad de cada país.';
const path = '/cybermap';

export const generateMetadata = toolMetadata({ title, description, path });

export default function CyberMapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd title={title} description={description} path={path} />
      {children}
    </>
  );
}
