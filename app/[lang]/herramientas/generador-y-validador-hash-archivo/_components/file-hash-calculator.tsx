'use client';

import { useRef, useState } from 'react';

import {
  AlertTriangle,
  Check,
  Copy,
  Download,
  File as FileIcon,
  Loader2,
  RotateCcw,
  ShieldCheck,
  UploadCloud,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/herramientas/ui/alert';
import { Badge } from '@/components/herramientas/ui/badge';
import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { toast } from '@/components/herramientas/ui/sonner';
import { sha256Hex } from '@/lib/herramientas/hash';
import { cn } from '@/lib/herramientas/utils';

import { ACCEPT_ATTR, ACCEPTED_FORMATS, MAX_FILE_SIZE, validateFile } from '../_lib/file-validation';
import { computeFileHashes, type FileHashes } from '../_lib/hashing';
import { buildHashReportPdf } from '../_lib/report-pdf';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from '../i18n';

type HashType = keyof FileHashes;
const HASH_TYPES: HashType[] = ['MD5', 'SHA1', 'SHA256', 'SHA512'];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function FileHashCalculator() {
  const t = useToolT(en);
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<FileHashes | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [copied, setCopied] = useState<HashType | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [lastReportHash, setLastReportHash] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setHashes(null);
    setError(null);
    setWarning(null);
    setCopied(null);
    setLastReportHash(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (selected: File | undefined | null) => {
    if (!selected) return;

    setFile(selected);
    setHashes(null);
    setError(null);
    setWarning(null);
    setLastReportHash(null);

    const result = await validateFile(selected, t);
    if (!result.valid) {
      setError(result.error ?? t('Archivo no válido.'));
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }

    if (result.warning) setWarning(result.warning);

    setIsProcessing(true);
    try {
      const computed = await computeFileHashes(selected);
      setHashes(computed);
    } catch (err) {
      setError(t('No se pudieron calcular los hashes: ') + (err instanceof Error ? err.message : t('error desconocido')));
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = async (hashType: HashType) => {
    if (!hashes) return;
    try {
      await navigator.clipboard.writeText(hashes[hashType]);
      setCopied(hashType);
      toast.success('Copiado', { description: `Hash ${hashType} copiado al portapapeles` });
      setTimeout(() => setCopied(null), 3000);
    } catch {
      toast.error(t('Error al copiar'), { description: t('No se pudo copiar al portapapeles') });
    }
  };

  const downloadReport = async () => {
    if (!file || !hashes) return;
    setIsGeneratingPdf(true);
    try {
      const pdfBytes = buildHashReportPdf({
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        hashes,
      }, t);
      const reportHash = await sha256Hex(pdfBytes);
      setLastReportHash(reportHash);

      const filename = `reporte-hash-${file.name.replace(/\.[^.]+$/, '')}-${reportHash}.pdf`;
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('PDF descargado', { description: filename });
    } catch (err) {
      toast.error(t('Error al generar el PDF'), {
        description: err instanceof Error ? err.message : t('Error desconocido'),
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <Heading level={3}>{t('Generador y Validador de Hash de Archivo')}</Heading>
          {file && (
            <Button variant="outline" onClick={reset} data-test="reset-button">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('Limpiar')}
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t(error)}</AlertDescription>
          </Alert>
        )}

        {warning && !error && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{warning}</AlertDescription>
          </Alert>
        )}

        {!file && (
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              void handleFile(e.dataTransfer.files[0]);
            }}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-10 text-center transition-colors',
              isDragging ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50',
            )}
            data-test="dropzone"
          >
            <UploadCloud className="text-muted-foreground h-8 w-8" />
            <div>
              <p className="text-sm font-medium">{t('Arrastra un archivo aquí o haz clic para seleccionarlo')}</p>
              <p className="text-muted-foreground mt-1 text-xs">{t('Máximo 10 MB · procesado 100% en tu navegador')}</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPT_ATTR}
              className="hidden"
              onChange={(e) => void handleFile(e.target.files?.[0])}
              data-test="file-input"
            />
          </div>
        )}

        {file && (
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <FileIcon className="text-primary h-8 w-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" data-test="file-name">
                {file.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatBytes(file.size)} · {file.type || 'tipo desconocido'}
              </p>
            </div>
            {isProcessing && <Loader2 className="text-muted-foreground h-5 w-5 shrink-0 animate-spin" />}
            {!isProcessing && hashes && <ShieldCheck className="h-5 w-5 shrink-0 text-green-600" />}
          </div>
        )}

        {hashes && (
          <div className="space-y-3">
            {HASH_TYPES.map((hashType) => (
              <div key={hashType} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{hashType}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(hashType)}
                    data-test={`copy-${hashType.toLowerCase()}`}
                  >
                    {copied === hashType ? (
                      <>
                        <Check className="mr-1 h-3 w-3" />
                        {t('Copiado')}
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1 h-3 w-3" />
                        {t('Copiar')}
                      </>
                    )}
                  </Button>
                </div>
                <p
                  className="bg-muted overflow-x-auto rounded-md border p-2 font-mono text-xs break-all"
                  data-test={`output-${hashType.toLowerCase()}`}
                >
                  {hashes[hashType]}
                </p>
              </div>
            ))}

            <Button onClick={downloadReport} disabled={isGeneratingPdf} data-test="download-pdf">
              {isGeneratingPdf ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Download className="mr-2 h-4 w-4" />
              )}
              Descargar reporte PDF
            </Button>

            {lastReportHash && (
              <div className="bg-muted rounded-md p-3 text-xs">
                <p className="mb-1 font-medium">{t('Hash SHA-256 del último PDF descargado:')}</p>
                <p className="text-muted-foreground font-mono break-all">{lastReportHash}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Heading level={3} className="mb-4">
          {t('Formatos aceptados')}
        </Heading>
        <div className="mb-4 flex flex-wrap gap-2">
          {ACCEPTED_FORMATS.map((format) => (
            <Badge key={format.label} variant="outline">
              {t(format.label)} ({format.extensions.join(', ')})
            </Badge>
          ))}
        </div>
        <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
          <li>{t('Tamaño máximo: {size}.', { size: formatBytes(MAX_FILE_SIZE) })}</li>
          <li>{t('El archivo nunca sale de tu navegador: todo el cálculo ocurre en tu equipo.')}</li>
          <li>{t('MD5 y SHA-1 ya no son seguros contra colisiones intencionales; úsalos solo para verificar integridad accidental, no como control de seguridad.')}</li>
          <li>{t('SHA-256 y SHA-512 son las opciones recomendadas para verificar la autenticidad de una descarga.')}</li>
        </ul>
      </div>
    </div>
  );
}
