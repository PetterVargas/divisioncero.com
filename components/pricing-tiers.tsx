'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/shared';

const cyberacademyUrl = '/cyberacademy';

/**
 * Con NEXT_PUBLIC_CHECKOUT_ENABLED=true los planes de pago llevan al checkout
 * de la plataforma en lugar de WhatsApp: CyberAcademy a la facturación de la
 * cuenta personal con el plan preseleccionado, CSaaS y Self-hosting a crear
 * (o abrir) la empresa, desde cuya facturación se contratan.
 */
const checkoutEnabled = process.env.NEXT_PUBLIC_CHECKOUT_ENABLED === 'true';
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.divisioncero.com';

type Billing = 'monthly' | 'annual';
/** Una característica puede enlazar a otra página del sitio. */
type Feature = string | { text: string; href: string };

const baseSkus: Feature = { text: 'Tener en cuenta los SKU base del plan', href: '/legal/terminos-de-servicio' };
type Model = 'cyberacademy' | 'csaas' | 'self-hosting';

interface Tier {
  name: string;
  /** Sin monthlyPrice (y con annualTotal), el plan solo se ofrece con facturación anual. */
  monthlyPrice?: number;
  annualTotal?: number;
  /** Texto en lugar del precio, p. ej. "Gratis" o "A medida". */
  priceLabel?: string;
  badge: string;
  cta: string;
  /** Sin href, el botón abre WhatsApp para comprar el plan con la facturación elegida. */
  href?: string;
  /** Mensaje de WhatsApp (en español; se traduce al mostrarse). */
  whatsapp?: string;
  external?: boolean;
  /** Dónde se compra en la plataforma, cuando el checkout está habilitado. */
  checkout?: { account: 'personal'; plans: { monthly?: string; annual: string } } | { account: 'team' };
  highlighted: boolean;
  features: Feature[];
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
        checkout: {
          account: 'personal',
          plans: { monthly: 'certificaciones-monthly', annual: 'certificaciones-yearly' },
        },
        highlighted: true,
        features: [
          'Todo lo del plan Free',
          'Diploma de los cursos',
          '+ de 37 certificaciones',
          'Validación de certificado',
        ],
      },
      {
        name: 'Medallas',
        annualTotal: 239.88,
        badge: 'Certificaciones y medallas físicas',
        cta: 'Obtener Medallas',
        checkout: { account: 'personal', plans: { annual: 'medallas-yearly' } },
        highlighted: false,
        features: ['Todo lo del plan Certificaciones', 'Medallas físicas'],
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
        name: 'Starter',
        monthlyPrice: 53.99,
        annualTotal: 239.88,
        badge: 'Popular · Plan para pequeñas y medianas empresas · Solo aplica para empresas de hasta 50 colaboradores',
        cta: 'Comenzar con Starter',
        checkout: { account: 'team' },
        highlighted: true,
        features: [
          'Modelo de Maduración de Ciberseguridad',
          'Automatizaciones de protecciones de identidad',
          'Optimización BaU para cobertura en cumplimiento de Ciberseguridad',
          'Centro de confianza para sus clientes',
          baseSkus,
        ],
      },
      {
        name: 'Pro',
        monthlyPrice: 224.99,
        annualTotal: 999,
        badge: 'Para compañías de + de 50 colaboradores',
        cta: 'Comenzar con Pro',
        checkout: { account: 'team' },
        highlighted: false,
        features: [
          'Todo lo del plan Starter',
          'Más de 50 colaboradores',
          'Single Sign-On (SSO)',
          'Soporte prioritario y acompañamiento directo del equipo de DivisionCero',
          'Planteamiento de características para el roadmap',
          baseSkus,
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
        annualTotal: 499,
        badge: 'Popular · Empresas de 10 a 50 colaboradores',
        cta: 'Contactar por WhatsApp',
        whatsapp: 'Hola DivisionCero, estoy interesado en el plan self-hosting para empresas de 10 a 50 colaboradores',
        checkout: { account: 'team' },
        external: true,
        highlighted: true,
        features: ['Self-hosting en tu infraestructura', 'De 10 a 50 colaboradores'],
      },
      {
        name: 'Empresa más de 50',
        monthlyPrice: 224.99,
        annualTotal: 999,
        badge: 'Empresas con más de 50 colaboradores',
        cta: 'Contactar por WhatsApp',
        whatsapp: 'Hola DivisionCero, estoy interesado en el plan self-hosting para empresas de más de 50 colaboradores',
        checkout: { account: 'team' },
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

function tierBilling(tier: Tier, billing: Billing): Billing {
  return tier.monthlyPrice === undefined ? 'annual' : billing;
}

function TierPrice({ tier, billing }: { tier: Tier; billing: Billing; }) {
  if (tier.priceLabel || tier.annualTotal === undefined) {
    return (
      <div>
        <span className="text-4xl font-bold">{tier.priceLabel && tier.priceLabel}</span>
      </div>
    );
  }

  billing = tierBilling(tier, billing);
  const displayPrice = billing === 'monthly' && tier.monthlyPrice ? tier.monthlyPrice : tier.annualTotal / 12;
  const savingsPercent = tier.monthlyPrice ? Math.round((1 - tier.annualTotal / (tier.monthlyPrice * 12)) * 100) : 0;

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-4xl font-bold">${formatPrice(displayPrice)}</span>
        <span className="text-sm text-fd-muted-foreground">USD/mes</span>
      </div>
      {billing === 'annual' ? (
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs text-fd-muted-foreground">
            {`Facturado como $${formatPrice(tier.annualTotal)}/año`}
          </span>
          {savingsPercent > 0 && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-600">
              {`Ahorras ${savingsPercent}%`}
            </span>
          )}
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

  // Se lee en el cliente para que la página se pueda prerenderizar.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('modelo');
    const match = models.find((m) => m.id === requested);
    if (match) setModel(match.id);
  }, []);

  const { label: modelLabel, tiers } = models.find((m) => m.id === model)!;

  function purchaseUrl(tier: Tier) {
    if (checkoutEnabled && tier.checkout) {
      if (tier.checkout.account === 'team') return `${appUrl}/home/create-team`;

      const { monthly, annual } = tier.checkout.plans;
      const plan = tierBilling(tier, billing) === 'monthly' && monthly ? monthly : annual;

      return `${appUrl}/home/billing?plan=${plan}`;
    }

    if (tier.whatsapp) return whatsappUrl(tier.whatsapp);
    return whatsappUrl(
      `Hola DivisionCero, estoy interesado en comprar el plan ${tier.name} de ${modelLabel} con facturación ${tierBilling(tier, billing) === 'monthly' ? 'mensual' : 'anual'}`,
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
              {tier.features.map((feature) => {
                const text = typeof feature === 'string' ? feature : feature.text;
                return (
                  <li key={text} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    {typeof feature === 'string' ? (
                      <span className="text-fd-muted-foreground">{text}</span>
                    ) : (
                      <Link
                        href={feature.href}
                        className="text-fd-muted-foreground underline underline-offset-2 hover:text-fd-foreground"
                      >
                        {text}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
            <Link
              href={tier.href ? (tier.external ? tier.href : tier.href) : purchaseUrl(tier)}
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
