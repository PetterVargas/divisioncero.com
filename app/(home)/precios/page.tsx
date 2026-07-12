import { PricingTiers } from '@/components/pricing-tiers';

export default function PreciosPage() {
  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Precios</h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto">
          Planes de precios y opciones de pago
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <PricingTiers />
      </div>
    </main>
  );
}

export function generateMetadata() {
  return {
    title: 'Precios | DivisionCero',
    description: 'Planes de precios y opciones de pago de DivisionCero: Básico, Maestro y Empresa.',
  };
}
