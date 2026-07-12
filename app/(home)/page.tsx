import Link from 'next/link';
import {
  ArrowRight, Rocket, GraduationCap, Building2, Radar, BookOpen,
  Timer, Headset, MapPin,
  Map, Grid3x3, MessageCircleQuestion, Network, Calendar, KeyRound, QrCode, Hash, Mail, Binary, Link2, Fingerprint,
} from 'lucide-react';
import { HeroReveal, ScrollReveal } from '@/components/home-animations';
import { HeroUniverse } from '@/components/hero-universe';
import { FullViewportSection } from '@/components/full-viewport-section';
import { PlanetButton } from '@/components/planet-button';
import { PricingTiers } from '@/components/pricing-tiers';
import { ToolsSlider } from '@/components/tools-slider';
import { EcosystemPanels } from '@/components/ecosystem-panels';
import { TextMaskReveal } from '@/components/text-mask-reveal';
import { principalWebsiteUtm } from '@/lib/shared';

const signUpUrl = `https://app.divisioncero.com/auth/sign-up?${principalWebsiteUtm}`;
const discordUrl = 'https://discord.com/invite/RPxQTPBfvG';

const herramientasUrl = `https://herramientas.divisioncero.com/?${principalWebsiteUtm}`;

const toolIconClass = 'h-4.5 w-4.5 text-fd-primary';

const tools = [
  { icon: <Map className={toolIconClass} />, title: 'CyberMap', description: 'Visualiza el panorama de amenazas y ciberataques en tiempo real.', href: `https://herramientas.divisioncero.com/cybermap?${principalWebsiteUtm}`, external: true },
  { icon: <Grid3x3 className={toolIconClass} />, title: 'Tabla Periódica de Ciberseguridad', description: 'Explora los elementos clave de la Ciberseguridad de forma visual.', href: `https://herramientas.divisioncero.com/tabla-periodica-ciberseguridad?${principalWebsiteUtm}`, external: true },
  { icon: <MessageCircleQuestion className={toolIconClass} />, title: 'Rompehielos de Seguridad', description: 'Preguntas para romper el hielo y abrir la conversación sobre seguridad.', href: `https://herramientas.divisioncero.com/rompehielos?${principalWebsiteUtm}`, external: true },
  { icon: <Network className={toolIconClass} />, title: 'Workflow de Ciberseguridad', description: 'Diagramas de flujo para procesos y procedimientos de seguridad.', href: `https://herramientas.divisioncero.com/workflow-ciberseguridad?${principalWebsiteUtm}`, external: true },
  { icon: <Calendar className={toolIconClass} />, title: 'Calendario de Ciberseguridad', description: 'Fechas clave y eventos relevantes de Ciberseguridad.', href: `https://herramientas.divisioncero.com/calendario-ciberseguridad?${principalWebsiteUtm}`, external: true },
  { icon: <KeyRound className={toolIconClass} />, title: 'Generador de Contraseñas', description: 'Crea contraseñas seguras y aleatorias al instante.', href: `https://herramientas.divisioncero.com/generador-contrasenas?${principalWebsiteUtm}`, external: true },
  { icon: <QrCode className={toolIconClass} />, title: 'Generador de QR', description: 'Genera códigos QR gratis para tus enlaces y campañas.', href: `https://herramientas.divisioncero.com/generador-qr?${principalWebsiteUtm}`, external: true },
  { icon: <Hash className={toolIconClass} />, title: 'Generador de Hash', description: 'Calcula el hash de cualquier texto o archivo.', href: `https://herramientas.divisioncero.com/generador-hash?${principalWebsiteUtm}`, external: true },
  { icon: <Mail className={toolIconClass} />, title: 'Validador SPF', description: 'Verifica y valida los registros SPF de tu dominio.', href: `https://herramientas.divisioncero.com/validador-spf?${principalWebsiteUtm}`, external: true },
  { icon: <Binary className={toolIconClass} />, title: 'Codif/Decod Base64', description: 'Codifica y decodifica texto en Base64.', href: `https://herramientas.divisioncero.com/codificador-base64?${principalWebsiteUtm}`, external: true },
  { icon: <Link2 className={toolIconClass} />, title: 'Codif/Decod URL', description: 'Codifica y decodifica URLs fácilmente.', href: `https://herramientas.divisioncero.com/codificador-url?${principalWebsiteUtm}`, external: true },
  { icon: <Fingerprint className={toolIconClass} />, title: 'Generador de UUID', description: 'Genera identificadores únicos universales (UUID).', href: `https://herramientas.divisioncero.com/generador-uuid?${principalWebsiteUtm}`, external: true },
];

const benefits = [
  { icon: Timer, text: 'Setup en 5 minutos' },
  { icon: Headset, text: 'Soporte incluido' },
  { icon: MapPin, text: 'Por y para LatAm' },
];

const panelIconClass = 'h-6 w-6 text-fd-primary';

const ecosystemPanels = [
  {
    icon: <GraduationCap className={panelIconClass} />,
    title: 'CyberAcademy',
    description: 'Capacitación práctica en Ciberseguridad, con casos reales y rutas de aprendizaje.',
    href: `https://cyberacademy.divisioncero.com/?${principalWebsiteUtm}`,
    cta: 'Visitar CyberAcademy',
  },
  {
    icon: <BookOpen className={panelIconClass} />,
    title: 'Kudo',
    description: 'Framework de Ciberseguridad open-source para el cumplimiento de tu empresa.',
    href: `https://kudo.divisioncero.com/?${principalWebsiteUtm}`,
    cta: 'Visitar Kudo',
  },
  {
    icon: <Radar className={panelIconClass} />,
    title: 'Conan',
    description: 'Tracking basado en direcciones IP para la detección de amenazas.',
    href: 'https://app.divisioncero.com/home/conan?utm_source=petervargas.com&utm_medium=text_link&utm_campaign=personal_website',
    cta: 'Visitar Conan',
  },
  {
    icon: <Building2 className={panelIconClass} />,
    title: 'Ciberseguridad Empresarial',
    description: 'Automatización y consultoría en Ciberseguridad para pequeñas y medianas empresas.',
    href: signUpUrl,
    cta: 'Comenzar',
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col min-h-[calc(100vh-var(--header-height)-var(--footer-height))] font-sans">
      {/* Hero Section */}
      <FullViewportSection className="flex flex-col items-center justify-center py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/5 via-transparent to-fd-secondary/5 pointer-events-none" />
        <HeroUniverse className="absolute inset-0 w-full h-full pointer-events-none opacity-90" />
        <HeroReveal>
        <div className="max-w-4xl mx-auto relative z-10 -translate-y-[20%]">
          <div className="flex justify-center mb-8">
            <span data-hero-badge className="relative inline-flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-full border border-fd-border/60 bg-fd-muted/60 text-sm motion-safe:opacity-0">
              <span data-badge-pulse className="absolute inset-0 rounded-full ring-2 ring-fd-primary/50 pointer-events-none" />
              <span className="bg-fd-foreground text-fd-background text-xs font-bold px-2 py-0.5 rounded-full">Nuevo</span>
              <span className="text-fd-muted-foreground pl-1">Ciberseguridad por y para LatAm</span>
              <Link
                href={signUpUrl}
                aria-label="Regístrate"
                className="rounded-full p-1 text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground transition-colors"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </span>
          </div>
          <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="block overflow-hidden">
              <span
                data-hero-line
                className="block bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent pb-2 motion-safe:opacity-0"
              >
                Aprende Ciberseguridad
              </span>
            </span>
            <span className="block overflow-hidden">
              <span
                data-hero-line
                className="block bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent pb-2 motion-safe:opacity-0"
              >
                y asegura tu negocio
              </span>
            </span>
          </h1>
          <p data-hero-item className="text-base text-fd-muted-foreground max-w-xl mx-auto mb-10 motion-safe:opacity-0">
            Enfócate en construir confianza y te ayudaremos a hacerlo realidad.
          </p>
          <div data-hero-item className="flex flex-col sm:flex-row gap-6 items-center justify-center motion-safe:opacity-0">
            <PlanetButton
              href={signUpUrl}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 rounded-lg transition-colors"
            >
              Comenzar
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </PlanetButton>
            <Link
              href={discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-fd-foreground hover:text-fd-primary transition-colors"
            >
              Únete a Discord
            </Link>
          </div>
        </div>
        </HeroReveal>
      </FullViewportSection>

      {/* Ecosystem panels */}
      <section className="py-20 bg-fd-foreground/[0.04] border-y border-fd-border">
        <ScrollReveal className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Un ecosistema completo de Ciberseguridad</h3>
            <p className="text-xl text-fd-muted-foreground max-w-2xl mx-auto">
              Conoce los productos que forman parte de DivisionCero.
            </p>
          </div>
        </ScrollReveal>
        <EcosystemPanels items={ecosystemPanels} />
      </section>

      {/* Complete suite of tools */}
      <section className="py-20 overflow-hidden">
        <ScrollReveal className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Herramientas para tu día a día</h3>
            <Link
              href={herramientasUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-fd-foreground border border-fd-border hover:bg-fd-muted/50 rounded-lg transition-colors"
            >
              Ver todas las herramientas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
        <ToolsSlider items={tools} />
      </section>

      {/* Pricing */}
      <section className="py-20 px-4 bg-fd-foreground/[0.04] border-y border-fd-border">
        <ScrollReveal className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Precios transparentes para cada etapa de crecimiento</h3>
            <p className="text-xl text-fd-muted-foreground max-w-2xl mx-auto">
              Comienza gratis y escala con planes diseñados para empresas de todos los tamaños. Sin sorpresas, sin letra pequeña.
            </p>
          </div>
          <PricingTiers />
          <div className="text-center mt-10">
            <Link href="/precios" className="text-fd-primary font-medium hover:underline inline-flex items-center gap-1">
              Ver todos los detalles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <ScrollReveal className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">
            <TextMaskReveal text="¿Listo para fortalecer tu Ciberseguridad?" />
          </h3>
          <p className="text-xl text-fd-muted-foreground mb-8">
            Únete a las empresas latinoamericanas que ya confían en DivisionCero para mejorar su postura de Ciberseguridad.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href={signUpUrl}
              className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-fd-primary-foreground bg-fd-primary hover:bg-fd-primary/90 rounded-lg transition-colors"
            >
              <Rocket className="h-5 w-5 mr-2" />
              Comenzar ahora
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-fd-muted-foreground">
            {benefits.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-fd-primary" />
                {text}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}
