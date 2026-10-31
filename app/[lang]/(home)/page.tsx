import Link from 'next/link';
import {
  ArrowRight, Rocket, GraduationCap, Building2, Radar, BookOpen,
  Timer, Headset, MapPin, Wrench, Presentation, CalendarDays,
} from 'lucide-react';
import { HeroReveal, ScrollReveal } from '@/components/home-animations';
import { HeroGrid } from '@/components/hero-grid';
import { HeroConsole } from '@/components/hero-console';
import { FullViewportSection } from '@/components/full-viewport-section';
import { PricingTiers } from '@/components/pricing-tiers';
import { ToolsSlider, type SliderTool } from '@/components/tools-slider';
import { EcosystemPanels } from '@/components/ecosystem-panels';
import { TextMaskReveal } from '@/components/text-mask-reveal';
import { getTools } from '@/lib/herramientas/i18n/tools';
import { toLocale } from '@/lib/herramientas/i18n/server';
import { toolIcons } from '@/lib/herramientas/tool-icons';
import { localizeUrl } from '@/lib/i18n';
import { DemoWhatsAppLink } from '@/components/whatsapp-button';
import { AskAgent } from '@/components/ask-agent';
import { getT, type Dictionary } from '@/lib/site-translations';

const signUpUrl = 'https://app.divisioncero.com/auth/sign-up';

const en: Dictionary = {
  'Setup en 5 minutos': '5-minute setup',
  'Soporte incluido': 'Support included',
  'Por y para LatAm': 'By and for LatAm',
  'Capacitación práctica en Ciberseguridad, con casos reales y rutas de aprendizaje.':
    'Hands-on cybersecurity training with real cases and learning paths.',
  'Visitar CyberAcademy': 'Visit CyberAcademy',
  'Framework de Ciberseguridad open-source para el cumplimiento de tu empresa.':
    "Open-source cybersecurity framework for your company's compliance.",
  'Visitar Kudo': 'Visit Kudo',
  'Tracking basado en direcciones IP para la detección de amenazas.': 'IP address-based tracking for threat detection.',
  'Visitar Conan': 'Visit Conan',
  'Automatización y consultoría en Ciberseguridad para pequeñas y medianas empresas.':
    'Cybersecurity automation and consulting for small and medium-sized businesses.',
  Comenzar: 'Get started',
  'Colección de herramientas abiertas para agilizar el trabajo diario en Ciberseguridad.':
    'A collection of open tools to speed up everyday cybersecurity work.',
  'Visitar Herramientas': 'Visit Tools',
  'Material abierto usado en las sesiones de CyberAcademy, listo para reutilizar.':
    'Open material from CyberAcademy sessions, ready to reuse.',
  'Visitar Presentaciones': 'Visit Presentations',
  'Aprende Ciberseguridad': 'Learn Cybersecurity',
  'y asegura tu negocio': 'and secure your business',
  'Enfócate en construir confianza y te ayudaremos a hacerlo realidad.':
    "Focus on building trust and we'll help you make it happen.",
  'Comenzar en DivisionCero': 'Get started with DivisionCero',
  'Agendar demo': 'Book a demo',
  'Agenda una demo por WhatsApp': 'Book a demo on WhatsApp',
  'Un ecosistema completo de Ciberseguridad': 'A complete cybersecurity ecosystem',
  'Conoce los productos que forman parte de DivisionCero.': 'Discover the products that make up DivisionCero.',
  'Herramientas para tu día a día': 'Tools for your everyday work',
  'Ver todas las herramientas de Ciberseguridad': 'See all cybersecurity tools',
  'Ver todas las herramientas': 'See all tools',
  'Precios transparentes para cada etapa de crecimiento': 'Transparent pricing for every stage of growth',
  'Comienza gratis y escala con planes diseñados para empresas de todos los tamaños. Sin sorpresas, sin letra pequeña.':
    'Start for free and scale with plans designed for companies of every size. No surprises, no fine print.',
  'Ver todos los detalles de precios': 'See all pricing details',
  'Ver todos los detalles': 'See all details',
  '¿Listo para fortalecer tu Ciberseguridad?': 'Ready to strengthen your cybersecurity?',
  'Únete a las empresas latinoamericanas que ya confían en DivisionCero para mejorar su postura de Ciberseguridad.':
    'Join the Latin American companies that already trust DivisionCero to improve their cybersecurity posture.',
  'Comenzar ahora en DivisionCero': 'Get started now with DivisionCero',
  'Comenzar ahora': 'Get started now',
};

const toolIconClass = 'h-4.5 w-4.5 text-fd-primary';

// Herramientas del carrusel, en orden; títulos y descripciones salen del catálogo de /herramientas.
const sliderToolSlugs = [
  'grc-companias', 'cyberkit', 'cybermap', 'tabla-periodica-ciberseguridad', 'rompehielos', 'workflow-ciberseguridad',
  'calendario-ciberseguridad', 'generador-contrasenas', 'generador-qr', 'generador-hash', 'validador-spf',
  'codificador-base64', 'codificador-url', 'generador-uuid', 'totp', 'conversion-de-fecha-y-hora',
  'codificador-hexadecimal', 'museo-cibercrimen', 'triada-cia', 'analizador-contrasenas', 'deteccion-phishing',
  'suplantacion-marcas', 'identificador-correos-seguros', 'verificar-sitio-seguro', 'malas-practicas-escritorio',
  'cual-es-mi-ip', 'whois-ip-y-dominio', 'identificador-id-red-social', 'rompehielos-practicas-ciberseguridad',
  'checklist-buenas-practicas-equipo', 'checklist-incidente-seguridad', 'flujo-autenticacion-autorizacion',
  'detector-codigo-vulnerable', 'cifrado-pgp', 'que-es-pii', 'que-es-grooming', 'que-es-sexting', 'que-es-sextorsion',
  'generador-y-validador-hash-archivo', 'analizador-metadatos', 'visor-hexadecimal',
];

function getSliderTools(lang: string): SliderTool[] {
  const bySlug = new Map(getTools(toLocale(lang)).map((tool) => [tool.slug, tool]));
  return sliderToolSlugs.flatMap((slug) => {
    const tool = bySlug.get(slug);
    if (!tool) return [];
    const Icon = toolIcons[tool.iconName];
    return [{
      icon: <Icon className={toolIconClass} />,
      title: tool.title,
      description: tool.description,
      href: tool.external ? tool.href : localizeUrl(tool.href, lang),
      external: tool.external,
    }];
  });
}

const benefits = [
  { icon: Timer, text: 'Setup en 5 minutos' },
  { icon: Headset, text: 'Soporte incluido' },
  { icon: MapPin, text: 'Por y para LatAm' },
];

const panelIconClass = 'h-6 w-6 text-fd-primary';

const ecosystemPanels: { icon: React.ReactNode; title: string; description: string; href: string; cta: string }[] = [
  {
    icon: <GraduationCap className={panelIconClass} />,
    title: 'CyberAcademy',
    description: 'Capacitación práctica en Ciberseguridad, con casos reales y rutas de aprendizaje.',
    href: '/cyberacademy',
    cta: 'Visitar CyberAcademy',
  },
  {
    icon: <BookOpen className={panelIconClass} />,
    title: 'Kudo',
    description: 'Framework de Ciberseguridad open-source para el cumplimiento de tu empresa.',
    href: '/kudo',
    cta: 'Visitar Kudo',
  },
  {
    icon: <Radar className={panelIconClass} />,
    title: 'Conan',
    description: 'Tracking basado en direcciones IP para la detección de amenazas.',
    href: 'https://app.divisioncero.com/home/conan',
    cta: 'Visitar Conan',
  },
  {
    icon: <Building2 className={panelIconClass} />,
    title: 'Ciberseguridad Empresarial',
    description: 'Automatización y consultoría en Ciberseguridad para pequeñas y medianas empresas.',
    href: 'https://app.divisioncero.com/home/empresas',
    cta: 'Comenzar',
  },
  {
    icon: <Wrench className={panelIconClass} />,
    title: 'Herramientas',
    description: 'Colección de herramientas abiertas para agilizar el trabajo diario en Ciberseguridad.',
    href: '/herramientas',
    cta: 'Visitar Herramientas',
  },
  {
    icon: <Presentation className={panelIconClass} />,
    title: 'Presentaciones',
    description: 'Material abierto usado en las sesiones de CyberAcademy, listo para reutilizar.',
    href: '/cyberacademy/presentaciones',
    cta: 'Visitar Presentaciones',
  },
];

export default async function HomePage(props: PageProps<'/[lang]'>) {
  const { lang } = await props.params;
  const t = getT(lang, en);
  const url = (href: string) => localizeUrl(href, lang);
  const panels = ecosystemPanels.map((panel) => ({
    ...panel,
    title: t(panel.title),
    description: t(panel.description),
    cta: t(panel.cta),
    href: url(panel.href),
  }));

  return (
    <main className="flex flex-1 flex-col min-h-[calc(100vh-var(--header-height)-var(--footer-height))] font-sans">
      {/* Hero Section */}
      <FullViewportSection className="flex flex-col items-center justify-center pt-20 pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/5 via-transparent to-fd-secondary/5 pointer-events-none" />
        <HeroGrid className="absolute inset-0 w-full h-full pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_85%)]" />
        <HeroReveal>
        <div className="max-w-5xl mx-auto relative z-10">
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="block overflow-hidden">
              <span
                data-hero-line
                className="block bg-gradient-to-br from-fd-foreground via-fd-foreground to-fd-muted-foreground bg-clip-text text-transparent pb-2 motion-safe:opacity-0"
              >
                {t('Aprende Ciberseguridad')}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                data-hero-line
                className="block bg-gradient-to-r from-[#4DAE84] to-[#39b298] bg-clip-text text-transparent pb-2 motion-safe:opacity-0"
              >
                {t('y asegura tu negocio')}
              </span>
            </span>
          </h1>
          <p data-hero-item className="text-base text-fd-muted-foreground max-w-xl mx-auto mb-10 motion-safe:opacity-0">
            {t('Enfócate en construir confianza y te ayudaremos a hacerlo realidad.')}
          </p>
          <div data-hero-item className="flex flex-row gap-3 items-center justify-center motion-safe:opacity-0">
            <Link
              data-hero-cta
              href={signUpUrl}
              title={t('Comenzar en DivisionCero')}
              className="group inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 rounded-lg transition-colors"
            >
              {t('Comenzar')}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <DemoWhatsAppLink
              title={t('Agenda una demo por WhatsApp')}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-semibold text-fd-foreground border border-fd-border bg-fd-background/60 backdrop-blur-sm hover:bg-fd-muted/60 rounded-lg transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              {t('Agendar demo')}
            </DemoWhatsAppLink>
          </div>
          <div data-hero-item className="mt-6 flex justify-center motion-safe:opacity-0">
            <AskAgent />
          </div>
          <div data-hero-item className="relative mt-16 motion-safe:opacity-0">
            <div className="absolute -inset-x-10 -top-10 bottom-0 bg-gradient-to-b from-[#4DAE84]/20 via-[#4DAE84]/5 to-transparent blur-3xl rounded-full pointer-events-none" />
            <HeroConsole />
          </div>
        </div>
        </HeroReveal>
      </FullViewportSection>

      {/* Ecosystem panels */}
      <section className="py-20 bg-fd-foreground/[0.04] border-y border-fd-border">
        <ScrollReveal className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">{t('Un ecosistema completo de Ciberseguridad')}</h3>
            <p className="text-xl text-fd-muted-foreground max-w-2xl mx-auto">
              {t('Conoce los productos que forman parte de DivisionCero.')}
            </p>
          </div>
        </ScrollReveal>
        <EcosystemPanels items={panels} />
      </section>

      {/* Complete suite of tools */}
      <section className="py-20 overflow-hidden">
        <ScrollReveal className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">{t('Herramientas para tu día a día')}</h3>
            <Link
              href={url('/herramientas')}
              title={t('Ver todas las herramientas de Ciberseguridad')}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-fd-foreground border border-fd-border hover:bg-fd-muted/50 rounded-lg transition-colors"
            >
              {t('Ver todas las herramientas')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
        <ToolsSlider items={getSliderTools(lang)} />
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-fd-foreground/[0.04] border-y border-fd-border">
        <ScrollReveal className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">{t('Precios transparentes para cada etapa de crecimiento')}</h3>
            <p className="text-xl text-fd-muted-foreground max-w-2xl mx-auto">
              {t('Comienza gratis y escala con planes diseñados para empresas de todos los tamaños. Sin sorpresas, sin letra pequeña.')}
            </p>
          </div>
          <PricingTiers />
          <div className="text-center mt-10">
            <Link href={url('/precios')} title={t('Ver todos los detalles de precios')} className="text-fd-primary font-medium hover:underline inline-flex items-center gap-1">
              {t('Ver todos los detalles')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <ScrollReveal className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">
            <TextMaskReveal text={t('¿Listo para fortalecer tu Ciberseguridad?')} />
          </h3>
          <p className="text-xl text-fd-muted-foreground mb-8">
            {t('Únete a las empresas latinoamericanas que ya confían en DivisionCero para mejorar su postura de Ciberseguridad.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={signUpUrl}
              title={t('Comenzar ahora en DivisionCero')}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 rounded-lg transition-colors"
            >
              <Rocket className="h-5 w-5 mr-2" />
              {t('Comenzar ahora')}
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-fd-muted-foreground">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-fd-primary" />
                {t(text)}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
