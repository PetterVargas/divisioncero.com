'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';

import {
  AlertTriangle,
  BadgeCheck,
  Check,
  Copy,
  ExternalLink,
  FileDown,
  Info,
  Loader2,
  Lock,
  Search,
} from 'lucide-react';

import { TurnstileWidget, type TurnstileHandle } from '@/components/herramientas/turnstile-widget';
import { Alert, AlertDescription } from '@/components/herramientas/ui/alert';
import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { Input } from '@/components/herramientas/ui/input';
import { Label } from '@/components/herramientas/ui/label';
import { toast } from '@/components/herramientas/ui/sonner';

import { sha256Hex } from '@/lib/herramientas/hash';
import { CAPTCHA_HEADER } from '@/lib/herramientas/turnstile';

import {
  PLATFORM_INFO,
  parseProfileUrl,
  platforms,
  type Platform,
  type SocialProfile,
  type SocialProfileResponse,
} from '../_lib/platforms';
import { buildSocialProfileReportPdf } from '../_lib/report-pdf';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from '../i18n';

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  const t = useToolT(en);
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium break-all sm:text-right">
        {value || t('No disponible')}
      </span>
    </div>
  );
}

function formatFlag(value: boolean | null): string {
  if (value === null) return 'No disponible';
  return value ? 'Sí' : 'No';
}

export function SocialIdComponent() {
  const t = useToolT(en);
  const [platform, setPlatform] = useState<Platform>('facebook');
  const [url, setUrl] = useState('');
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [lastHash, setLastHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<TurnstileHandle>(null);

  const selectPlatform = (value: Platform) => {
    setPlatform(value);
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const target = parseProfileUrl(platform, url);
    if (typeof target === 'string') {
      setError(target);
      return;
    }
    if (!captchaToken) {
      setError(t('Completa la verificación anti-bots antes de consultar'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setProfile(null);
    setLastHash(null);
    setAvatarFailed(false);

    try {
      const response = await fetch('/herramientas/api/social-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', [CAPTCHA_HEADER]: captchaToken },
        body: JSON.stringify({ platform, url: url.trim() }),
      });
      const data: SocialProfileResponse = await response.json();

      if (!data.success) {
        setError(data.error);
        return;
      }
      setProfile(data.data);
    } catch {
      setError(t('No se pudo conectar con el servicio. Intenta de nuevo'));
    } finally {
      setIsLoading(false);
      captchaRef.current?.reset();
    }
  };

  const copyId = async () => {
    if (!profile) return;
    try {
      await navigator.clipboard.writeText(profile.id);
      setCopied(true);
      toast.success('Copiado', { description: t('El ID se copió al portapapeles') });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error(t('Error al copiar'), { description: t('No se pudo copiar al portapapeles') });
    }
  };

  const handleDownloadPdf = async () => {
    if (!profile) return;

    setIsGeneratingPdf(true);
    try {
      const pdfBytes = buildSocialProfileReportPdf(profile, t);
      const hash = await sha256Hex(pdfBytes);
      setLastHash(hash);

      const filename = `reporte-id-${profile.platform}-${hash}.pdf`;
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);

      toast.success('PDF descargado', { description: filename });
    } catch (err) {
      toast.error(t('Error al generar el PDF'), {
        description: err instanceof Error ? err.message : t('Error desconocido'),
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const platformLabel = profile ? PLATFORM_INFO[profile.platform].label : '';

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <Heading level={3}>{t('Consultar perfil')}</Heading>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label id="platform-label">{t('Red social')}</Label>
            <div
              role="group"
              aria-labelledby="platform-label"
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
            >
              {platforms.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectPlatform(value)}
                  aria-pressed={platform === value}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                    platform === value
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border hover:border-primary/40 hover:bg-accent'
                  }`}
                  data-test={`platform-${value}`}
                >
                  {PLATFORM_INFO[value].label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-url">{t('URL del perfil')}</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="profile-url"
                placeholder={PLATFORM_INFO[platform].placeholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                maxLength={500}
                data-test="profile-url"
              />
              <Button
                type="submit"
                disabled={isLoading || !url.trim() || !captchaToken}
                data-test="lookup-button"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Consultar
              </Button>
            </div>
          </div>

          <TurnstileWidget ref={captchaRef} onToken={setCaptchaToken} />
        </form>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t(error)}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('Consultando el perfil en {platform}...', { platform: PLATFORM_INFO[platform].label })}
          </div>
        )}

        {profile && (
          <>
            <div className="bg-muted/50 flex flex-wrap items-center gap-4 rounded-lg border p-6">
              {profile.avatarUrl && !avatarFailed && (
                // Imagen remota del CDN de cada red; next/image no aporta nada sin optimizador.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={`Foto de perfil de ${profile.name || profile.username}`}
                  referrerPolicy="no-referrer"
                  onError={() => setAvatarFailed(true)}
                  className="size-20 rounded-full border object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs tracking-wide uppercase">
                  ID de {platformLabel}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-mono text-3xl font-bold break-all" data-test="profile-id">
                    {profile.id}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyId}
                    className="flex items-center gap-1"
                    data-test="copy-id"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied ? 'Copiado' : t('Copiar ID')}
                  </Button>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-1 text-sm">
                  <span className="font-medium">{profile.name}</span>
                  {profile.verified && (
                    <BadgeCheck className="h-4 w-4 text-blue-500" aria-label={t('Verificada')} />
                  )}
                  {profile.isPrivate && (
                    <Lock className="text-muted-foreground h-3.5 w-3.5" aria-label={t('Privada')} />
                  )}
                  {profile.username && (
                    <span className="text-muted-foreground">@{profile.username}</span>
                  )}
                </p>
              </div>
              <Button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                data-test="download-pdf"
              >
                {isGeneratingPdf ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-2 h-4 w-4" />
                )}
                Descargar reporte PDF
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <span className="mb-2 block text-sm font-semibold">{t('Información del perfil')}</span>
                <div className="divide-y rounded-lg border">
                  <InfoRow label={t('Red social')} value={platformLabel} />
                  <InfoRow label="ID" value={<span className="font-mono">{profile.id}</span>} />
                  <InfoRow label="Usuario" value={profile.username && `@${profile.username}`} />
                  <InfoRow label={t('Nombre')} value={profile.name} />
                  <InfoRow label={t('Cuenta verificada')} value={t(formatFlag(profile.verified))} />
                  <InfoRow label={t('Cuenta privada')} value={t(formatFlag(profile.isPrivate))} />
                  <InfoRow
                    label={t('URL del perfil')}
                    value={
                      <a
                        href={profile.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-center gap-1 hover:underline"
                      >
                        {profile.profileUrl}
                        <ExternalLink className="h-3 w-3 shrink-0" />
                      </a>
                    }
                  />
                </div>
              </div>

              <div>
                <span className="mb-2 block text-sm font-semibold">{t('Datos públicos')}</span>
                {profile.details.length > 0 ? (
                  <div className="divide-y rounded-lg border">
                    {profile.details.map((field) => (
                      <InfoRow key={field.label} label={t(field.label)} value={field.value} />
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground rounded-lg border p-3 text-sm">
                    {t('{platform} no publica estadísticas adicionales para este perfil.', { platform: platformLabel })}
                  </p>
                )}
              </div>
            </div>

            {profile.description && (
              <div>
                <span className="mb-2 block text-sm font-semibold">{t('Descripción')}</span>
                <p className="text-muted-foreground rounded-lg border p-3 text-sm whitespace-pre-line">
                  {profile.description}
                </p>
              </div>
            )}

            <p className="text-muted-foreground text-xs">{t('Fuente: {source}', { source: t(profile.source) })}</p>
          </>
        )}

        {lastHash && (
          <div className="bg-muted rounded-md p-3 text-xs">
            <p className="mb-1 font-medium">{t('Hash SHA-256 del último PDF descargado:')}</p>
            <p className="text-muted-foreground font-mono break-all">{lastHash}</p>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Heading level={3} className="mb-4">
          {t('¿Para qué sirve el ID de un perfil?')}
        </Heading>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            {t('Cada cuenta de Facebook, Instagram, TikTok y X tiene un identificador numérico interno que nunca cambia. El nombre de usuario (@usuario) se puede cambiar en cualquier momento, pero el ID permanece: por eso es el dato que se usa para documentar, denunciar o dar seguimiento a una cuenta aunque su titular cambie de nombre.')}
          </p>

          <div>
            <h4 className="mb-2 font-medium">{t('Usos en ciberseguridad:')}</h4>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>{t('Documentar perfiles falsos o de suplantación antes de que cambien de nombre')}</li>
              <li>{t('Reportar cuentas ante la plataforma o las autoridades con un dato inequívoco')}</li>
              <li>{t('Preservar evidencia de ciberacoso, extorsión o fraude en redes sociales')}</li>
              <li>{t('Verificar si dos perfiles con distinto nombre son en realidad la misma cuenta')}</li>
            </ul>
          </div>

          <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <Info className="h-4 w-4 text-blue-600" />
              {t('Sobre la consulta y el reporte:')}
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-200">
              <li>
                {t('Solo se consulta información pública, la misma que ve cualquier persona sin iniciar sesión.')}
              </li>
              <li>
                {t('Las redes sociales pueden limitar o bloquear consultas temporalmente; si ocurre, intenta de nuevo en unos minutos.')}
              </li>
              <li>
                {t('El PDF se genera en tu navegador y su hash SHA-256 se incluye en el nombre del archivo para verificar su integridad.')}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
