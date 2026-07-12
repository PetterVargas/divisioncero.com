import Link from 'next/link';
import {
  ShieldCheck, Lock, KeyRound, ServerCog, FileCheck2, BadgeCheck,
  Eye, ClipboardCheck, Bell, LockKeyhole,
} from 'lucide-react';

const certifications = [
  { name: 'Kudo Framework', status: 'Activo', detail: 'Cumplimiento vigente' },
  { name: 'ISO 27001', status: 'Planeado', detail: 'Q4 2026' },
  { name: 'SOC 2 Type II', status: 'Planeado', detail: 'Q4 2027' },
  { name: 'GDPR', status: 'Planeado', detail: 'Q4 2028' },
];

const practices = [
  {
    title: 'Infraestructura',
    icon: ServerCog,
    items: [
      'Datacenters certificados ISO 27001',
      'Web Application Firewall (WAF)',
      'Protección contra ataques DDoS',
      'Monitoreo de seguridad continuo',
    ],
  },
  {
    title: 'Protección de Datos',
    icon: Lock,
    items: [
      'Cifrado AES-256 en tránsito y en reposo',
      'TLS 1.2 / 1.3',
      'Copias de seguridad diarias cifradas',
      'Eliminación segura de datos',
    ],
  },
  {
    title: 'Control de Acceso',
    icon: KeyRound,
    items: [
      'Autenticación multifactor (MFA)',
      'Control de acceso basado en roles',
      'Registro de auditoría',
      'Expiración de sesiones',
    ],
  },
  {
    title: 'Desarrollo',
    icon: FileCheck2,
    items: [
      'Revisiones de código',
      'Diseño seguro por defecto',
      'Programas de capacitación',
      'Gestión de vulnerabilidades',
    ],
  },
];

const commitments = [
  { icon: Eye, text: 'Transparencia total en nuestras políticas de privacidad' },
  { icon: ClipboardCheck, text: 'Recopilación mínima de datos' },
  { icon: ShieldCheck, text: 'Equipo de respuesta a incidentes disponible' },
  { icon: Bell, text: 'Notificación inmediata ante cualquier incidente' },
];

export default function TrustCenterPage() {
  return (
    <main className="grow w-full max-w-(--fd-layout-width) mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-fd-primary/10 rounded-lg flex items-center justify-center">
            <ShieldCheck className="h-7 w-7 text-fd-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Centro de Confianza</h1>
        <p className="text-lg text-fd-muted-foreground max-w-2xl mx-auto">
          Mejorando continuamente por y para ustedes
        </p>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-2xl font-bold mb-4">Protección de Datos de Clase Mundial</h2>
        <p className="text-fd-muted-foreground">
          Protegemos tu información con cifrado de extremo a extremo AES-256 para datos en tránsito
          y en reposo, cumplimiento con el Kudo Framework de Ciberseguridad, y revisiones anuales
          de ciberseguridad realizadas por nuestros colaboradores.
        </p>
      </div>

      {/* Certifications */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Certificaciones y cumplimiento</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {certifications.map(({ name, status, detail }) => (
            <div
              key={name}
              className="flex flex-col gap-2 p-5 rounded-xl border border-fd-border/60 bg-fd-card/40 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <BadgeCheck className={status === 'Activo' ? 'h-5 w-5 text-green-500' : 'h-5 w-5 text-fd-muted-foreground'} />
                <span
                  className={
                    status === 'Activo'
                      ? 'text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600'
                      : 'text-xs font-semibold px-2 py-0.5 rounded-full bg-fd-muted text-fd-muted-foreground'
                  }
                >
                  {status}
                </span>
              </div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-xs text-fd-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security practices */}
      <div className="max-w-5xl mx-auto mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Prácticas de seguridad</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {practices.map(({ title, icon: Icon, items }) => (
            <div
              key={title}
              className="flex flex-col gap-4 p-6 rounded-xl border border-fd-border/60 bg-fd-card/40 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-fd-primary/10 rounded-lg flex items-center justify-center">
                  <Icon className="h-5 w-5 text-fd-primary" />
                </div>
                <h3 className="font-semibold">{title}</h3>
              </div>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item} className="text-sm text-fd-muted-foreground flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-fd-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy commitments */}
      <div className="max-w-4xl mx-auto mb-16 text-center">
        <div className="flex items-center justify-center mb-4">
          <LockKeyhole className="h-8 w-8 text-fd-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-8">Tienes control total sobre tus datos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          {commitments.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3 p-4 rounded-lg bg-fd-muted/50">
              <Icon className="h-5 w-5 text-fd-primary mt-0.5 shrink-0" />
              <span className="text-sm">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Related legal pages */}
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-fd-muted-foreground mb-4">Documentos relacionados</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/politica-de-privacidad" className="text-sm font-medium text-fd-primary hover:underline">
            Política de Privacidad
          </Link>
          <Link href="/terminos-de-servicio" className="text-sm font-medium text-fd-primary hover:underline">
            Términos de Servicio
          </Link>
          <Link href="/politica-de-cookies" className="text-sm font-medium text-fd-primary hover:underline">
            Política de Cookies
          </Link>
        </div>
      </div>
    </main>
  );
}

export function generateMetadata() {
  return {
    title: 'Centro de Confianza | DivisionCero',
    description: 'Certificaciones, prácticas de seguridad y compromisos de privacidad de DivisionCero.',
  };
}
