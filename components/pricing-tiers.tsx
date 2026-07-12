'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { principalWebsiteUtm } from '@/lib/shared';

const signUpUrl = `https://app.divisioncero.com/auth/sign-up?${principalWebsiteUtm}`;

type Billing = 'monthly' | 'annual';

const tiers = [
  {
    name: 'Básico',
    monthlyPrice: 5.99,
    annualTotal: 23.88,
    badge: 'Plan para comenzar',
    cta: 'Comenzar con Básico',
    highlighted: false,
    features: [
      'Seguimiento informático con Conan',
      'Kudo, cumplimiento en ciberseguridad',
      'Herramientas',
      'Recursos',
      'Cursos base de cumplimiento',
      'Cursos enfocados en el usuario final',
      'Cursos básicos de ciberseguridad y privacidad',
    ],
  },
  {
    name: 'Maestro',
    monthlyPrice: 19.99,
    annualTotal: 203.88,
    badge: 'Popular · Plan para usuarios en ciberseguridad',
    cta: 'Comenzar con Maestro',
    highlighted: true,
    features: [
      'Todas las funciones del plan Básico',
      'Cursos especializados en ciberseguridad',
      'Sugerir cursos o temas para la hoja de ruta',
      'Plantillas para documentos de cumplimiento',
      'Soporte para temas relacionados en los cursos',
    ],
  },
  {
    name: 'Empresa',
    monthlyPrice: 199,
    annualTotal: 999,
    badge: 'Plan para pequeñas y medianas empresas',
    cta: 'Comenzar con Empresa',
    highlighted: false,
    features: [
      'Modelo de Maduración de Ciberseguridad',
      'Automatizaciones de protecciones de identidad',
      'Optimización BaU para cobertura en cumplimiento de Ciberseguridad',
      'Centro de confianza para sus clientes',
    ],
  },
];

function formatPrice(value: number) {
  return value % 1 === 0 ? value.toFixed(0) : value.toFixed(2);
}

export function PricingTiers() {
  const [billing, setBilling] = useState<Billing>('annual');

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-fd-muted border border-fd-border/60">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={
              billing === 'monthly'
                ? 'px-4 py-2 text-sm font-semibold rounded-full bg-fd-primary text-fd-primary-foreground transition-colors'
                : 'px-4 py-2 text-sm font-medium rounded-full text-fd-muted-foreground hover:text-fd-foreground transition-colors'
            }
          >
            Facturado mensualmente
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            className={
              billing === 'annual'
                ? 'px-4 py-2 text-sm font-semibold rounded-full bg-fd-primary text-fd-primary-foreground transition-colors inline-flex items-center gap-2'
                : 'px-4 py-2 text-sm font-medium rounded-full text-fd-muted-foreground hover:text-fd-foreground transition-colors inline-flex items-center gap-2'
            }
          >
            Facturado anualmente
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/15 text-green-600">
              Ahorra
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {tiers.map((tier) => {
          const displayPrice = billing === 'monthly' ? tier.monthlyPrice : tier.annualTotal / 12;
          const savingsPercent = Math.round((1 - tier.annualTotal / (tier.monthlyPrice * 12)) * 100);

          return (
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
              <ul className="flex flex-col gap-2.5 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-fd-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={signUpUrl}
                className={
                  tier.highlighted
                    ? 'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 rounded-lg transition-colors'
                    : 'inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-fd-foreground border border-fd-border hover:bg-fd-muted/50 rounded-lg transition-colors'
                }
              >
                {tier.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
