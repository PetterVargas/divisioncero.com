'use client';

import { useCallback, useRef, useState } from 'react';

import { AlertTriangle, Check, Copy, Info, Shield, X } from 'lucide-react';
import { z } from 'zod';

import { TurnstileWidget, type TurnstileHandle } from '@/components/herramientas/turnstile-widget';
import { Alert, AlertDescription } from '@/components/herramientas/ui/alert';
import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { Input } from '@/components/herramientas/ui/input';
import { Label } from '@/components/herramientas/ui/label';
import { toast } from '@/components/herramientas/ui/sonner';

import { CAPTCHA_HEADER } from '@/lib/herramientas/turnstile';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { LOCALE_HEADER } from '@/lib/herramientas/i18n/api';
import { useI18n } from '@/components/herramientas/i18n-provider';
import { en } from './i18n';

const DomainSchema = z
  .string()
  .min(1, 'Ingresa un dominio')
  .regex(
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/,
    'Formato de dominio inválido',
  );

interface SPFRecord {
  record: string;
  mechanisms: string[];
  qualifiers: { [key: string]: string };
  includes: string[];
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

interface ValidationResult {
  domain: string;
  hasSpf: boolean;
  spfRecord?: SPFRecord;
  rawRecord?: string;
  error?: string;
}

export function SPFValidatorComponent() {
  const t = useToolT(en);
  const { locale } = useI18n();
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<TurnstileHandle>(null);

  const validateSPF = useCallback(async () => {
    setError(null);

    if (!domain.trim()) {
      setError(t('Por favor ingresa un dominio'));
      return;
    }

    if (!captchaToken) {
      setError(t('Completa la verificación anti-bots antes de validar'));
      return;
    }

    try {
      const validationResult = DomainSchema.safeParse(domain.trim());

      if (!validationResult.success) {
        setError(t(validationResult.error.issues[0]?.message ?? t('Dominio inválido')));
        return;
      }

      setIsValidating(true);

      const response = await fetch('/herramientas/api/dns/spf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [CAPTCHA_HEADER]: captchaToken,
          [LOCALE_HEADER]: locale,
        },
        body: JSON.stringify({
          domain: domain.trim(),
        }),
      });

      const apiResult = await response.json().catch(() => null);

      if (!apiResult) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!apiResult.success) {
        throw new Error(apiResult.error || t('Error en la validación SPF'));
      }

      setResult(apiResult.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('Error desconocido');
      setError(t('Error al validar SPF: {error}', { error: errorMessage }));
      setResult(null);
    } finally {
      setIsValidating(false);
      captchaRef.current?.reset();
    }
  }, [domain, captchaToken]);

  const handleInputChange = (value: string) => {
    setDomain(value);
    setError(null);
    setResult(null);
    setCopied(false);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copiado', {
        description: t('Registro SPF copiado al portapapeles'),
      });

      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error(t('Error al copiar'), {
        description: t('No se pudo copiar al portapapeles'),
      });
    }
  };

  const clearAll = () => {
    setDomain('');
    setResult(null);
    setError(null);
    setCopied(false);
  };

  const addExample = () => {
    setDomain('google.com');
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <Heading level={3}>{t('Validador SPF')}</Heading>

          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={addExample} className="text-xs" data-test="add-example">
              {t('Ejemplo')}
            </Button>
            <Button variant="outline" onClick={clearAll} data-test="clear-button">
              {t('Limpiar')}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain-input">{t('Dominio a validar')}</Label>
            <div className="flex gap-2">
              <Input
                id="domain-input"
                type="text"
                placeholder="ejemplo.com"
                value={domain}
                onChange={(e) => handleInputChange(e.target.value)}
                className="flex-1"
                data-test="domain-input"
                onKeyDown={(e) => e.key === 'Enter' && validateSPF()}
              />
              <Button
                onClick={validateSPF}
                disabled={isValidating || !domain.trim() || !captchaToken}
                data-test="validate-button"
              >
                {isValidating ? 'Validando...' : t('Validar SPF')}
              </Button>
            </div>
          </div>

          <TurnstileWidget ref={captchaRef} onToken={setCaptchaToken} />
        </div>

        {result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <Label>{t('Resultado de Validación')}</Label>
            </div>

            {result.hasSpf && result.spfRecord ? (
              <div className="space-y-4">
                <div
                  className={`rounded-lg p-4 ${
                    result.spfRecord.isValid
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20'
                      : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.spfRecord.isValid ? (
                      <Check className="h-5 w-5 text-green-600" />
                    ) : (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                    <h4 className="font-medium">
                      {result.spfRecord.isValid ? t('Registro SPF válido') : t('Registro SPF con errores')}
                    </h4>
                  </div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Dominio: <strong>{result.domain}</strong>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{t('Registro SPF')}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.rawRecord || '')}
                      className="flex items-center gap-1"
                      data-test="copy-record"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3" />
                          {t('Copiado')}
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          {t('Copiar')}
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-muted rounded border p-3 font-mono text-sm">{result.rawRecord}</div>
                </div>

                {result.spfRecord.mechanisms.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Mecanismos</Label>
                    <div className="space-y-1">
                      {result.spfRecord.mechanisms.map((mechanism, index) => (
                        <div key={index} className="bg-muted flex items-center justify-between rounded p-2 text-sm">
                          <code>{mechanism}</code>
                          {result.spfRecord!.qualifiers[mechanism] && (
                            <span className="text-muted-foreground text-xs">
                              {result.spfRecord!.qualifiers[mechanism]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.spfRecord.includes.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">{t('Dominios incluidos')}</Label>
                    <div className="space-y-1">
                      {result.spfRecord.includes.map((include, index) => (
                        <div key={index} className="bg-muted rounded p-2 text-sm">
                          <code>{include}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.spfRecord.errors.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-red-600">Errores</Label>
                    <div className="space-y-1">
                      {result.spfRecord.errors.map((error, index) => (
                        <div
                          key={index}
                          className="rounded border border-red-200 bg-red-50 p-2 text-sm dark:border-red-800 dark:bg-red-950/20"
                        >
                          <div className="flex items-center gap-2">
                            <X className="h-4 w-4 text-red-600" />
                            <span>{error}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.spfRecord.warnings.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-amber-600">Advertencias</Label>
                    <div className="space-y-1">
                      {result.spfRecord.warnings.map((warning, index) => (
                        <div
                          key={index}
                          className="rounded border border-amber-200 bg-amber-50 p-2 text-sm dark:border-amber-800 dark:bg-amber-950/20"
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-600" />
                            <span>{warning}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950/20">
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium text-red-800 dark:text-red-200">{t('Sin registro SPF')}</h4>
                </div>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {result.error || `El dominio ${result.domain} no tiene un registro SPF configurado.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Heading level={3} className="mb-4">
          {t('Información sobre SPF')}
        </Heading>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">{t('¿Qué es SPF?')}</h4>
            <p className="text-muted-foreground text-sm">
              {t('SPF (Sender Policy Framework) es un protocolo de autenticación de email que permite a los propietarios de dominios especificar qué servidores están autorizados a enviar correos en nombre de su dominio.')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">{t('Mecanismos comunes')}</h4>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                <li>
                  <strong>all</strong> {t('- Coincide con todas las IPs (siempre al final)')}
                </li>
                <li>
                  <strong>include:</strong> {t('- Incluye reglas SPF de otro dominio')}
                </li>
                <li>
                  <strong>a</strong> {t('- Autoriza IPs de registros A del dominio')}
                </li>
                <li>
                  <strong>mx</strong> {t('- Autoriza IPs de registros MX del dominio')}
                </li>
                <li>
                  <strong>ip4/ip6:</strong> {t('- Autoriza IP específica o rango')}
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Calificadores</h4>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                <li>
                  <strong>+</strong> {t('(Pass) - Autorizado (por defecto)')}
                </li>
                <li>
                  <strong>-</strong> {t('(Fail) - No autorizado, rechazar email')}
                </li>
                <li>
                  <strong>~</strong> {t('(SoftFail) - No autorizado, marcar como spam')}
                </li>
                <li>
                  <strong>?</strong> {t('(Neutral) - No hay política definida')}
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">{t('Beneficios del SPF:')}</h4>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>{t('Previene el spoofing de dominios')}</li>
              <li>{t('Mejora la deliverability de emails legítimos')}</li>
              <li>{t('Reduce el spam que usa tu dominio')}</li>
              <li>{t('Protege la reputación de tu dominio')}</li>
              <li>{t('Requerido por muchos proveedores de email')}</li>
            </ul>
          </div>

          <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <Info className="h-4 w-4 text-blue-600" />
              {t('Ejemplo de registro SPF:')}
            </h4>
            <code className="block rounded bg-blue-100 p-2 text-sm dark:bg-blue-900/30">
              v=spf1 include:_spf.google.com ip4:192.168.1.1 ~all
            </code>
            <p className="mt-2 text-xs text-blue-800 dark:text-blue-200">
              {t('Este registro autoriza Google Workspace y una IP específica, marcando como spam otros servidores.')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
