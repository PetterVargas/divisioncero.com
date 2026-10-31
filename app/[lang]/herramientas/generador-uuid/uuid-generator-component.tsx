'use client';

import { useCallback, useEffect, useState } from 'react';

import { Check, Copy, RefreshCcw } from 'lucide-react';

import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { Input } from '@/components/herramientas/ui/input';
import { toast } from '@/components/herramientas/ui/sonner';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from './i18n';

export function UuidGeneratorComponent() {
  const t = useToolT(en);
  const [uuid, setUuid] = useState('');
  const [copied, setCopied] = useState(false);

  const generateUuid = useCallback(() => {
    const newUuid = crypto.randomUUID();
    setUuid(newUuid);
    setCopied(false);
  }, []);

  const copyToClipboard = async () => {
    if (!uuid) return;

    try {
      await navigator.clipboard.writeText(uuid);
      setCopied(true);
      toast.success(t('UUID copiado'), {
        description: t('UUID ha sido copiado al portapapeles'),
      });

      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast.error(t('Error al copiar'), {
        description: t('No se pudo copiar el UUID al portapapeles'),
      });
    }
  };

  useEffect(() => {
    if (!uuid) {
      // Genera el UUID inicial solo en cliente para evitar mismatch de hidratación.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generateUuid();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="bg-card space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Input
              id="generated-uuid"
              type="text"
              value={uuid}
              readOnly
              className="bg-muted/80 border-primary/50 text-foreground dark:bg-muted/90 h-auto rounded-md border-2 px-4 py-3 text-center font-mono text-lg font-bold tracking-wide shadow-md transition-shadow hover:shadow-lg"
              data-test="generated-uuid"
            />

            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              title={t('Copiar al portapapeles')}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={generateUuid}
              title={t('Generar nuevo UUID')}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button onClick={generateUuid} className="mt-4 w-full">
          {t('Generar un nuevo UUID')}
        </Button>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Heading level={3} className="mb-4">
          {t('Tips sobre UUIDs')}
        </Heading>

        <ul className="list-disc space-y-1 pl-5">
          <li>{t('Los UUIDs son únicos globalmente sin coordinación central')}</li>
          <li>{t('Perfectos como claves primarias en bases de datos distribuidas')}</li>
          <li>{t('El formato v4 es completamente aleatorio y más seguro que v1')}</li>
          <li>{t('Usa UUIDs para identificadores de sesión, archivos o transacciones')}</li>
          <li>{t('La probabilidad de colisión es prácticamente inexistente')}</li>
        </ul>
      </div>
    </div>
  );
}
