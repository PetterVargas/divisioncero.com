'use client';

import { useCallback, useState } from 'react';

import { AlertTriangle, ArrowUpDown, Check, Copy } from 'lucide-react';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/herramientas/ui/alert';
import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { Label } from '@/components/herramientas/ui/label';
import { toast } from '@/components/herramientas/ui/sonner';
import { Textarea } from '@/components/herramientas/ui/textarea';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from './i18n';

const MAX_INPUT_SIZE = 10000; // 10,000 character limit for security

const Base64InputSchema = z.string().max(MAX_INPUT_SIZE, {
  message: `El texto no puede exceder ${MAX_INPUT_SIZE} caracteres por razones de seguridad`,
});

export function Base64EncoderComponent() {
  const t = useToolT(en);
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processText = useCallback(() => {
    setError(null);

    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    try {
      const validationResult = Base64InputSchema.safeParse(inputText);

      if (!validationResult.success) {
        setError(t(validationResult.error.issues[0]?.message ?? t('Entrada inválida')));
        setOutputText('');
        return;
      }

      if (mode === 'encode') {
        try {
          const encoded = btoa(unescape(encodeURIComponent(inputText)));
          setOutputText(encoded);
        } catch {
          setError(t('Error al codificar: el texto contiene caracteres no válidos'));
          setOutputText('');
        }
      } else {
        try {
          const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
          const cleanInput = inputText.replace(/\s/g, '');

          if (!base64Regex.test(cleanInput)) {
            setError(t('El texto no es una cadena Base64 válida'));
            setOutputText('');
            return;
          }

          const decoded = decodeURIComponent(escape(atob(cleanInput)));
          setOutputText(decoded);
        } catch {
          setError(t('Error al decodificar: Base64 inválido o corrupto'));
          setOutputText('');
        }
      }
    } catch {
      setError(t('Error inesperado al procesar el texto'));
      setOutputText('');
    }
  }, [inputText, mode]);

  const handleInputChange = (value: string) => {
    setInputText(value);
    setError(null);
  };

  const toggleMode = () => {
    setMode(mode === 'encode' ? 'decode' : 'encode');
    setInputText(outputText);
    setOutputText('');
    setError(null);
  };

  const copyToClipboard = async () => {
    if (!outputText) return;

    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      toast.success(t('Copiado'), {
        description: t('El resultado ha sido copiado al portapapeles'),
      });

      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error(t('Error al copiar'), {
        description: t('No se pudo copiar al portapapeles'),
      });
    }
  };

  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setError(null);
    setCopied(false);
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <Heading level={3}>
            {mode === 'encode' ? t('Codificar a Base64') : t('Decodificar desde Base64')}
          </Heading>

          <Button
            variant="outline"
            onClick={toggleMode}
            className="flex items-center gap-2"
            data-test="toggle-mode"
          >
            <ArrowUpDown className="h-4 w-4" />
            {mode === 'encode' ? t('Cambiar a Decodificar') : t('Cambiar a Codificar')}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="input-text">
            {mode === 'encode' ? t('Texto a codificar') : t('Base64 a decodificar')}
          </Label>
          <Textarea
            id="input-text"
            placeholder={
              mode === 'encode'
                ? t('Introduce el texto que quieres codificar en Base64...')
                : t('Introduce la cadena Base64 que quieres decodificar...')
            }
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            className="min-h-[120px] resize-y"
            data-test="input-text"
          />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>{t('Caracteres: {n}', { n: inputText.length.toLocaleString() })}</span>
            <span>{t('Límite máximo: {n}', { n: MAX_INPUT_SIZE.toLocaleString() })}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={processText} className="flex-1" data-test="process-button">
            {mode === 'encode' ? 'Codificar' : 'Decodificar'}
          </Button>
          <Button variant="outline" onClick={clearAll} data-test="clear-button">
            {t('Limpiar')}
          </Button>
        </div>

        {outputText && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="output-text">
                {mode === 'encode' ? t('Resultado Base64') : t('Texto decodificado')}
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-1"
                data-test="copy-button"
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
            <Textarea
              id="output-text"
              value={outputText}
              readOnly
              className="bg-muted min-h-[120px] resize-y font-mono"
              data-test="output-text"
            />
            <div className="text-muted-foreground text-xs">
              {t('Caracteres: {n}', { n: outputText.length.toLocaleString() })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Heading level={3} className="mb-4">
          {t('Información sobre Base64')}
        </Heading>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">{t('¿Qué es Base64?')}</h4>
            <p className="text-muted-foreground text-sm">
              {t('Base64 es un esquema de codificación que convierte datos binarios en texto ASCII. Se utiliza comúnmente para transmitir datos binarios a través de medios de texto, como email o JSON.')}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium">{t('Casos de uso comunes:')}</h4>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>{t('Codificación de imágenes en CSS o HTML')}</li>
              <li>{t('Transmisión de datos binarios en JSON')}</li>
              <li>{t('Almacenamiento de credenciales en configuraciones')}</li>
              <li>{t('Encoding de URLs y headers HTTP')}</li>
              <li>{t('Intercambio de datos entre sistemas')}</li>
            </ul>
          </div>

          <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              {t('Consideraciones de seguridad:')}
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-200">
              <li>{t('Base64 NO es un método de encriptación, solo codificación')}</li>
              <li>{t('Los datos codificados en Base64 pueden ser fácilmente decodificados')}</li>
              <li>{t('No uses Base64 para ocultar información sensible')}</li>
              <li>{t('Para datos sensibles, usa métodos de encriptación apropiados')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
