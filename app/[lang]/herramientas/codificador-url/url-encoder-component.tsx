'use client';

import { useCallback, useState } from 'react';

import { AlertTriangle, ArrowUpDown, Check, Copy, Link } from 'lucide-react';
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

const UrlInputSchema = z.string().max(MAX_INPUT_SIZE, {
  message: `El texto no puede exceder ${MAX_INPUT_SIZE} caracteres por razones de seguridad`,
});

export function UrlEncoderComponent() {
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
      const validationResult = UrlInputSchema.safeParse(inputText);

      if (!validationResult.success) {
        setError(t(validationResult.error.issues[0]?.message ?? t('Entrada inválida')));
        setOutputText('');
        return;
      }

      if (mode === 'encode') {
        try {
          const encoded = encodeURIComponent(inputText);
          setOutputText(encoded);
        } catch {
          setError(t('Error al codificar: el texto contiene caracteres no válidos'));
          setOutputText('');
        }
      } else {
        try {
          const decoded = decodeURIComponent(inputText);
          setOutputText(decoded);
        } catch {
          setError(t('Error al decodificar: URL encoding inválido o corrupto'));
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

  const addExample = () => {
    const examples = {
      encode: 'https://ejemplo.com/buscar?q=mi consulta&filtro=activo',
      decode: 'https%3A//ejemplo.com/buscar%3Fq%3Dmi%20consulta%26filtro%3Dactivo',
    };

    setInputText(examples[mode]);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <Heading level={3}>{mode === 'encode' ? t('Codificar URL') : t('Decodificar URL')}</Heading>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={addExample}
              className="text-xs"
              data-test="add-example"
            >
              {t('Ejemplo')}
            </Button>
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
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <Label htmlFor="input-text">
            {mode === 'encode' ? t('URL o texto a codificar') : t('URL codificada a decodificar')}
          </Label>
          <Textarea
            id="input-text"
            placeholder={
              mode === 'encode'
                ? t('Introduce la URL o texto que quieres codificar...\nEjemplo: https://ejemplo.com/buscar?q=mi consulta&filtro=activo')
                : t('Introduce la URL codificada que quieres decodificar...\nEjemplo: https%3A//ejemplo.com/buscar%3Fq%3Dmi%20consulta%26filtro%3Dactivo')
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
                {mode === 'encode' ? 'URL codificada' : 'URL decodificada'}
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
          {t('Información sobre URL Encoding')}
        </Heading>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">{t('¿Qué es URL Encoding?')}</h4>
            <p className="text-muted-foreground text-sm">
              {t('URL encoding (también conocido como percent-encoding) convierte caracteres especiales en URLs a un formato seguro para transmisión web. Los caracteres se representan con % seguido de su código hexadecimal.')}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium">{t('Caracteres comunes codificados:')}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-mono">espacio</span>
                  <span className="text-muted-foreground font-mono">%20</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">!</span>
                  <span className="text-muted-foreground font-mono">%21</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">#</span>
                  <span className="text-muted-foreground font-mono">%23</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">$</span>
                  <span className="text-muted-foreground font-mono">%24</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="font-mono">&amp;</span>
                  <span className="text-muted-foreground font-mono">%26</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">+</span>
                  <span className="text-muted-foreground font-mono">%2B</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">=</span>
                  <span className="text-muted-foreground font-mono">%3D</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono">?</span>
                  <span className="text-muted-foreground font-mono">%3F</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">{t('Casos de uso comunes:')}</h4>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>{t('Parámetros de consulta en URLs con espacios o caracteres especiales')}</li>
              <li>{t('Formularios web que envían datos por GET')}</li>
              <li>{t('APIs REST con parámetros en la URL')}</li>
              <li>{t('Redirecciones con URLs como parámetros')}</li>
              <li>{t('Construcción dinámica de enlaces')}</li>
            </ul>
          </div>

          <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <Link className="h-4 w-4 text-blue-600" />
              {t('Buenas prácticas:')}
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-200">
              <li>{t('Siempre codifica parámetros de URL que contengan datos de usuario')}</li>
              <li>{t('No codifiques toda la URL, solo los parámetros necesarios')}</li>
              <li>{t('Usa las funciones nativas del lenguaje (encodeURIComponent en JS)')}</li>
              <li>{t('Decodifica URLs antes de mostrarlas al usuario para mejor legibilidad')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
