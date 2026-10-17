'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/shared';

const cyberacademyUrl = 'https://cyberacademy.divisioncero.com/';

type Billing = 'monthly' | 'annual';
type Model = 'cyberacademy' | 'csaas' | 'self-hosting';

interface Tier {
  name: string;
  monthlyPrice?: number;
  annualTotal?: number;
  /** Texto en lugar del precio, p. ej. "Gratis" o "A medida". */
  priceLabel?: string;
  badge: string;
  cta: string;
  /** Sin href, el botón abre WhatsApp para comprar el plan con la facturación elegida. */
  href?: string;
  external?: boolean;
  highlighted: boolean;
  features: string[];
}

const models: { id: Model; label: string; tiers: Tier[] }[] = [
  {
    id: 'cyberacademy',
    label: 'CyberAcademy',
    tiers: [
      {
        name: 'Free',
        priceLabel: 'Gratis',
        badge: 'Cursos gratuitos y open-source',
        cta: 'Ir a CyberAcademy',
        href: cyberacademyUrl,
        external: true,
        highlighted: false,
        features: [
          '+ de 35 cursos gratuitos de Ciberseguridad',
          'Contenido open-source',
          'Rutas de aprendizaje con casos reales',
          'Ruta de aprendizaje CyberUsuario',
          'Ruta de aprendizaje CyberGuardián',
        ],
      },
      {
        name: 'Certificaciones',
        monthlyPrice: 7.99,
        annualTotal: 35.88,
        badge: 'Popular · Valida lo que aprendes',
        cta: 'Obtener Certificaciones',
        highlighted: true,
        features: [
          'Todo lo del plan Free',
          'Diploma de los cursos',
          '+ de 37 certificaciones',
          'Validación de certificado',
        ],
      },
      {
        name: 'Enterprise',
        priceLabel: 'A medida',
        badge: 'Capacitación para equipos y organizaciones',
        cta: 'Contactar por WhatsApp',
        href: whatsappUrl('Hola DivisionCero, estoy interesado en el plan Enterprise de CyberAcademy'),
        external: true,
        highlighted: false,
        features: [
          'Todo lo del plan Certificaciones',
          'Capacitación para toda tu organización',
          'Líneas base de concientización',
          'Capacitaciones necesarias para ISO 27001, SOC 2, NIST Cybersecurity Framework, CIS Controls y Cloud Security Alliance',
        ],
      },
    ],
  },
  {
    id: 'csaas',
    label: 'CSaaS',
    tiers: [
      {
        name: 'Free',
        priceLabel: 'Gratis',
        badge: 'Plan para comenzar',
        cta: 'Comenzar gratis',
        href: 'https://app.divisioncero.com/home',
        highlighted: false,
        features: [
          'Seguimiento informático con Conan',
          'Kudo, cumplimiento en Ciberseguridad',
          'Herramientas',
          'Recursos',
          'Cursos base de cumplimiento',
          'Cursos enfocados en el usuario final',
          'Cursos focalizados en Ciberseguridad',
        ],
      },
      {
        name: 'Pymes',
        monthlyPrice: 53.99,
        annualTotal: 239.88,
        badge: 'Popular · Plan para pequeñas y medianas empresas · Solo aplica para empresas de hasta 50 colaboradores',
        cta: 'Comenzar con Pymes',
        highlighted: true,
        features: [
          'Modelo de Maduración de Ciberseguridad',
          'Automatizaciones de protecciones de identidad',
          'Optimización BaU para cobertura en cumplimiento de Ciberseguridad',
          'Centro de confianza para sus clientes',
        ],
      },
      {
        name: 'Enterprise',
        priceLabel: 'A medida',
        badge: 'Para compañías de + de 50 colaboradores',
        cta: 'Contactar por WhatsApp',
        href: whatsappUrl('Hola DivisionCero, estoy interesado en el plan Enterprise de CSaaS'),
        external: true,
        highlighted: false,
        features: [
          'Todo lo del plan Pymes',
          'Soporte prioritario y acompañamiento directo del equipo de DivisionCero',
          'Planteamiento de características para el roadmap',
        ],
      },
    ],
  },
  {
    id: 'self-hosting',
    label: 'Self-hosting',
    tiers: [
      {
        name: 'Community',
        priceLabel: 'Gratis',
        badge: 'Versión comunitaria · Hasta 9 colaboradores',
        cta: 'Ver en GitHub',
        href: 'https://github.com/PetterVargas/divisioncero',
        external: true,
        highlighted: false,
        features: [
          'Self-hosting en tu infraestructura',
          'Versión Community open-source',
          'Hasta 9 colaboradores',
          'No aplica para empresas con ingresos anuales de más de 100K USD',
        ],
      },
      {
        name: 'Empresa de 10 a 50',
        monthlyPrice: 112.99,
        annualTotal: 500,
        badge: 'Popular · Empresas de 10 a 50 colaboradores',
        cta: 'Contactar por WhatsApp',
        href: whatsappUrl(
          'Hola DivisionCero, estoy interesado en el plan self-hosting para empresas de 10 a 50 colaboradores',
        ),
        external: true,
        highlighted: true,
        features: ['Self-hosting en tu infraestructura', 'De 10 a 50 colaboradores'],
      },
      {
        name: 'Empresa más de 50',
        monthlyPrice: 224.99,
        annualTotal: 1000,
        badge: 'Empresas con más de 50 colaboradores',
        cta: 'Contactar por WhatsApp',
        href: whatsappUrl(
          'Hola DivisionCero, estoy interesado en el plan self-hosting para empresas de más de 50 colaboradores',
        ),
        external: true,
        highlighted: false,
        features: [
          'Self-hosting en tu infraestructura',
          'Más de 50 colaboradores',
          'Single Sign-On (SSO)',
        ],
      },
    ],
  },
];

function formatPrice(value: number) {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex justify-center">
      <div className="inline-flex flex-wrap justify-center items-center gap-1 p-1 rounded-full bg-fd-muted border border-fd-border/60">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={
              value === option.id
                ? 'px-4 py-2 text-sm font-semibold rounded-full bg-fd-primary text-fd-primary-foreground transition-colors inline-flex items-center gap-2'
                : 'px-4 py-2 text-sm font-medium rounded-full text-fd-muted-foreground hover:text-fd-foreground transition-colors inline-flex items-center gap-2'
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TierPrice({ tier, billing }: { tier: Tier; billing: Billing }) {
  if (tier.priceLabel || tier.monthlyPrice === undefined || tier.annualTotal === undefined) {
    return (
      <div>
        <span className="text-4xl font-bold">{tier.priceLabel}</span>
      </div>
    );
  }

  const displayPrice = billing === 'monthly' ? tier.monthlyPrice : tier.annualTotal / 12;
  const savingsPercent = Math.round((1 - tier.annualTotal / (tier.monthlyPrice * 12)) * 100);

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">${formatPrice(displayPrice)}</span>
        <span className="text-sm text-fd-muted-foreground">USD/mes</span>
      </div>
      {billing === 'annual' ? (
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-fd-muted-foreground">
            Facturado como ${formatPrice(tier.annualTotal)}/año
          </span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600">
            Ahorras {savingsPercent}%
          </span>
        </div>
      ) : (
        <p className="text-xs text-fd-muted-foreground mt-1.5">Facturado mensualmente</p>
      )}
    </div>
  );
}

/**
 * Tarjetas de precios con menú para elegir entre CyberAcademy, CSaaS y Self-hosting.
 * El modelo inicial se puede elegir con `?modelo=`, p. ej. `/precios?modelo=self-hosting`.
 */
export function PricingTiers() {
  const [model, setModel] = useState<Model>('cyberacademy');
  const [billing, setBilling] = useState<Billing>('annual');

  // Se lee en el cliente porque el sitio se exporta como estático.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('modelo');
    const match = models.find((m) => m.id === requested);
    if (match) setModel(match.id);
  }, []);

  const { label: modelLabel, tiers } = models.find((m) => m.id === model)!;

  function purchaseUrl(tier: Tier) {
    const billingLabel = billing === 'monthly' ? 'mensual' : 'anual';
    return whatsappUrl(
      `Hola DivisionCero, estoy interesado en comprar el plan ${tier.name} de ${modelLabel} con facturación ${billingLabel}`,
    );
  }

  return (
    <div className="@container flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <SegmentedControl options={models.map(({ id, label }) => ({ id, label }))} value={model} onChange={setModel} />
        <SegmentedControl<Billing>
          options={[
            { id: 'monthly', label: 'Facturado mensualmente' },
            {
              id: 'annual',
              label: (
                <>
                  Facturado anualmente
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-600">
                    Ahorra
                  </span>
                </>
              ),
            },
          ]}
          value={billing}
          onChange={setBilling}
        />
      </div>

      <div className="grid grid-cols-1 @2xl:grid-cols-3 gap-6 items-start">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={
              tier.highlighted
                ? 'flex flex-col gap-6 p-8 rounded-xl border-2 border-fd-primary bg-fd-card shadow-lg relative'
                : 'flex flex-col gap-6 p-8 rounded-xl border border-fd-border/60 bg-fd-card/40 shadow-sm'
            }
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-fd-primary text-fd-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                Popular
              </span>
            )}
            <div>
              <h3 className="text-xl font-semibold mb-1">{tier.name}</h3>
              <p className="text-xs text-fd-muted-foreground">{tier.badge}</p>
            </div>
            <TierPrice tier={tier} billing={billing} />
            <ul className="flex flex-col gap-2.5 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  <span className="text-fd-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href={tier.href ?? purchaseUrl(tier)}
              title={tier.cta}
              {...(tier.external || !tier.href ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className={
                tier.highlighted
                  ? 'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 rounded-lg transition-colors'
                  : 'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-fd-foreground border border-fd-border hover:bg-fd-muted/50 rounded-lg transition-colors'
              }
            >
              {tier.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
