import { PricingTiers } from '@/components/pricing-tiers';
import { pageMetadata } from '@/lib/shared';
import { getT, type Dictionary } from '@/lib/site-translations';

const en: Dictionary = {
  Precios: 'Pricing',
  'Planes de precios y opciones de pago': 'Pricing plans and payment options',
  'Planes de precios de DivisionCero: CyberAcademy (Free, Certificaciones, Medallas), CSaaS (Free, Starter, Pro) y Self-hosting.':
    'DivisionCero pricing plans: CyberAcademy (Free, Certifications, Badges), CSaaS (Free, Starter, Pro) and Self-hosting.',
};

export default async function PreciosPage(props: PageProps<'/[lang]/precios'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);

  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{t('Precios')}</h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto">
          {t('Planes de precios y opciones de pago')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <PricingTiers />
      </div>
    </main>
  );
}

export async function generateMetadata(props: PageProps<'/[lang]/precios'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);
  return pageMetadata({
    lang,
    path: '/precios',
    title: t('Precios'),
    description: t(
      'Planes de precios de DivisionCero: CyberAcademy (Free, Certificaciones, Medallas), CSaaS (Free, Starter, Pro) y Self-hosting.',
    ),
  });
}
