'use client';

import { useRef, useState } from 'react';

import {
  AlertTriangle,
  File as FileIcon,
  FileDown,
  Loader2,
  RotateCcw,
  ShieldAlert,
  UploadCloud,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/herramientas/ui/alert';
import { Badge } from '@/components/herramientas/ui/badge';
import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { toast } from '@/components/herramientas/ui/sonner';
import { sha256Hex } from '@/lib/herramientas/hash';
import { cn } from '@/lib/herramientas/utils';

import { ACCEPT_ATTR, MAX_FILE_SIZE, validateFile } from '../_lib/file-validation';
import { analyzeFile, type AnalysisResult } from '../_lib/analyze';
import { buildMetadataReportPdf } from '../_lib/report-pdf';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from '../i18n';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MetadataAnalyzer() {
  const t = useToolT(en);
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number; type: string } | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [lastHash, setLastHash] = useState<string | null>(null);

  const reset = () => {
    setFileMeta(null);
    setResult(null);
    setError(null);
    setWarning(null);
    setLastHash(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleFile = async (selected: File | undefined | null) => {
    if (!selected) return;

    setFileMeta({ name: selected.name, size: selected.size, type: selected.type });
    setResult(null);
    setError(null);
    setWarning(null);
    setLastHash(null);

    const validation = await validateFile(selected, t);
    if (!validation.valid) {
      setError(validation.error ?? t('Archivo no válido.'));
      setFileMeta(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (validation.warning) setWarning(validation.warning);

    setIsProcessing(true);
    try {
      const analysis = await analyzeFile(selected);
      setResult(analysis);
    } catch (err) {
      setError(t('No se pudo analizar el archivo: ') + (err instanceof Error ? err.message : 'error desconocido'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadReport = async () => {
    if (!result) return;
    setIsGeneratingPdf(true);
    try {
      const pdfBytes = buildMetadataReportPdf(result, t);
      const hash = await sha256Hex(pdfBytes);
      setLastHash(hash);

      const filename = `reporte-metadatos-${result.fileName.replace(/\.[^.]+$/, '')}-${hash}.pdf`;
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
          <Heading level={3}>{t('Analizador de Metadatos')}</Heading>
          {fileMeta && (
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
            <AlertDescription>{t(warning)}</AlertDescription>
          </Alert>
        )}

        {!fileMeta && (
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
              <p className="text-sm font-medium">{t('Arrastra una imagen o documento aquí, o haz clic para seleccionarlo')}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {t('PNG, JPG, PDF o Word/Excel/PowerPoint · máximo {size} · procesado 100% en tu navegador', { size: formatBytes(MAX_FILE_SIZE) })}
              </p>
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

        {fileMeta && (
          <div className="flex items-center gap-3 rounded-lg border p-4">
            <FileIcon className="text-primary h-8 w-8 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium" data-test="file-name">
                {fileMeta.name}
              </p>
              <p className="text-muted-foreground text-xs">
                {formatBytes(fileMeta.size)} · {fileMeta.type || 'tipo desconocido'}
              </p>
            </div>
            {isProcessing && <Loader2 className="text-muted-foreground h-5 w-5 shrink-0 animate-spin" />}
          </div>
        )}

        {result && (
          <>
            {result.hasSensitiveData && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertDescription>
                  {t('Este archivo contiene metadatos potencialmente sensibles (marcados con')}{' '}
                  <Badge variant="destructive">{t('sensible')}</Badge>{' '}
                  {t('abajo), como ubicación GPS o nombres de personas. Revísalos antes de compartir el archivo públicamente.')}
                </AlertDescription>
              </Alert>
            )}

            <Button onClick={downloadReport} disabled={isGeneratingPdf} data-test="download-pdf">
              {isGeneratingPdf ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <FileDown className="mr-2 h-4 w-4" />
              )}
              {t('Descargar reporte PDF')}
            </Button>

            <div className="space-y-5">
              {result.sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-2 text-sm font-semibold">{t(section.title)}</p>
                  <div className="divide-y rounded-lg border">
                    {section.rows.map((row) => (
                      <div
                        key={row.label}
                        className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                      >
                        <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                          {t(row.label)}
                          {row.sensitive && (
                            <Badge variant="destructive" className="text-[10px]">
                              {t('sensible')}
                            </Badge>
                          )}
                        </span>
                        <span className="text-sm font-medium break-all sm:text-right">{t(row.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {lastHash && (
              <div className="bg-muted rounded-md p-3 text-xs">
                <p className="mb-1 font-medium">{t('Hash SHA-256 del último PDF descargado:')}</p>
                <p className="text-muted-foreground font-mono break-all">{lastHash}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
