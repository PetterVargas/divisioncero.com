'use client';

import { useCallback, useEffect, useState } from 'react';

import { AlertTriangle, Check, Copy, Hash, Info } from 'lucide-react';
import { z } from 'zod';

import { Alert, AlertDescription } from '@/components/herramientas/ui/alert';
import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { Label } from '@/components/herramientas/ui/label';
import { toast } from '@/components/herramientas/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/herramientas/ui/tabs';
import { Textarea } from '@/components/herramientas/ui/textarea';
import { useToolT } from '@/lib/herramientas/i18n/use-tool-t';
import { en } from './i18n';

const MAX_INPUT_SIZE = 10000; // 10,000 character limit for security

const HashInputSchema = z.string().max(MAX_INPUT_SIZE, {
  message: `El texto no puede exceder ${MAX_INPUT_SIZE} caracteres por razones de seguridad`,
});

type HashType = 'MD5' | 'SHA1' | 'SHA256' | 'SHA512';

// Simple hash implementations using Web Crypto API
async function generateHash(text: string, algorithm: HashType): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  let hashAlgorithm: string;
  switch (algorithm) {
    case 'MD5':
      // MD5 is not available in Web Crypto API, use a simple implementation
      return await md5(text);
    case 'SHA1':
      hashAlgorithm = 'SHA-1';
      break;
    case 'SHA256':
      hashAlgorithm = 'SHA-256';
      break;
    case 'SHA512':
      hashAlgorithm = 'SHA-512';
      break;
    default:
      throw new Error('Algoritmo de hash no soportado');
  }

  const hashBuffer = await crypto.subtle.digest(hashAlgorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Proper MD5 implementation using a simple algorithm
async function md5(text: string): Promise<string> {
  // Convert string to bytes
  const bytes = new TextEncoder().encode(text);

  // MD5 implementation based on RFC 1321
  const h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476];

  // Pre-processing: adding a single 1 bit
  const msg = new Uint8Array(bytes.length + 1);
  msg.set(bytes);
  msg[bytes.length] = 0x80;

  // Pre-processing: padding with zeros
  const bitLength = bytes.length * 8;
  const paddedLength = Math.ceil((bytes.length + 1 + 8) / 64) * 64;
  const padded = new Uint8Array(paddedLength);
  padded.set(msg);

  // Append original length in bits mod 2^64 to message
  const view = new DataView(padded.buffer);
  view.setUint32(paddedLength - 8, bitLength, true);
  view.setUint32(paddedLength - 4, 0, true);

  // Process the message in successive 512-bit chunks
  for (let i = 0; i < paddedLength; i += 64) {
    const chunk = new Uint32Array(padded.buffer, i, 16);

    // Convert to little endian if needed
    for (let j = 0; j < 16; j++) {
      const bytes = new Uint8Array(padded.buffer, i + j * 4, 4);
      chunk[j] =
        (bytes[0] || 0) |
        ((bytes[1] || 0) << 8) |
        ((bytes[2] || 0) << 16) |
        ((bytes[3] || 0) << 24);
    }

    let [a, b, c, d] = h;

    // Main loop
    const f = (x: number, y: number, z: number) => (x & y) | (~x & z);
    const g = (x: number, y: number, z: number) => (x & z) | (y & ~z);
    const h_func = (x: number, y: number, z: number) => x ^ y ^ z;
    const i_func = (x: number, y: number, z: number) => y ^ (x | ~z);

    const rotateLeft = (value: number, amount: number) => {
      return (value << amount) | (value >>> (32 - amount));
    };

    const k = [
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a,
      0xa8304613, 0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
      0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340,
      0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8,
      0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
      0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
      0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92,
      0xffeff47d, 0x85845dd1, 0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
      0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391,
    ];

    const s = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20,
      5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4,
      11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6,
      10, 15, 21,
    ];

    for (let j = 0; j < 64; j++) {
      let func: number, g_val: number;

      if (j < 16) {
        func = f(b ?? 0, c ?? 0, d ?? 0);
        g_val = j;
      } else if (j < 32) {
        func = g(b ?? 0, c ?? 0, d ?? 0);
        g_val = (5 * j + 1) % 16;
      } else if (j < 48) {
        func = h_func(b ?? 0, c ?? 0, d ?? 0);
        g_val = (3 * j + 5) % 16;
      } else {
        func = i_func(b ?? 0, c ?? 0, d ?? 0);
        g_val = (7 * j) % 16;
      }

      const temp = d ?? 0;
      d = c ?? 0;
      c = b ?? 0;
      b =
        ((b ?? 0) +
          rotateLeft(((a ?? 0) + func + (k[j] || 0) + (chunk[g_val] || 0)) >>> 0, s[j] || 0)) >>>
        0;
      a = temp;
    }

    h[0] = ((h[0] || 0) + (a ?? 0)) >>> 0;
    h[1] = ((h[1] || 0) + (b ?? 0)) >>> 0;
    h[2] = ((h[2] || 0) + (c ?? 0)) >>> 0;
    h[3] = ((h[3] || 0) + (d ?? 0)) >>> 0;
  }

  // Convert to hex string (little endian)
  return h
    .map((x) => {
      const bytes = [x & 0xff, (x >>> 8) & 0xff, (x >>> 16) & 0xff, (x >>> 24) & 0xff];
      return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    })
    .join('');
}

export function HashGeneratorComponent() {
  const t = useToolT(en);
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState<Record<HashType, string>>({
    MD5: '',
    SHA1: '',
    SHA256: '',
    SHA512: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState<HashType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAllHashes = useCallback(async () => {
    setError(null);

    if (!inputText.trim()) {
      setHashes({ MD5: '', SHA1: '', SHA256: '', SHA512: '' });
      return;
    }

    try {
      const validationResult = HashInputSchema.safeParse(inputText);

      if (!validationResult.success) {
        setError(t(validationResult.error.issues[0]?.message ?? t('Entrada inválida')));
        setHashes({ MD5: '', SHA1: '', SHA256: '', SHA512: '' });
        return;
      }

      setIsGenerating(true);

      const [md5Hash, sha1Hash, sha256Hash, sha512Hash] = await Promise.all([
        generateHash(inputText, 'MD5'),
        generateHash(inputText, 'SHA1'),
        generateHash(inputText, 'SHA256'),
        generateHash(inputText, 'SHA512'),
      ]);

      setHashes({ MD5: md5Hash, SHA1: sha1Hash, SHA256: sha256Hash, SHA512: sha512Hash });
    } catch (err) {
      setError(
        t('Error al generar los hashes: ') + (err instanceof Error ? err.message : t('Error desconocido')),
      );
      setHashes({ MD5: '', SHA1: '', SHA256: '', SHA512: '' });
    } finally {
      setIsGenerating(false);
    }
  }, [inputText]);

  const handleInputChange = (value: string) => {
    setInputText(value);
    setError(null);
    setCopied(null);
  };

  const copyToClipboard = async (hashType: HashType) => {
    const hashValue = hashes[hashType];
    if (!hashValue) return;

    try {
      await navigator.clipboard.writeText(hashValue);
      setCopied(hashType);
      toast.success('Copiado', {
        description: `Hash ${hashType} copiado al portapapeles`,
      });

      setTimeout(() => setCopied(null), 3000);
    } catch {
      toast.error(t('Error al copiar'), {
        description: t('No se pudo copiar al portapapeles'),
      });
    }
  };

  const clearAll = () => {
    setInputText('');
    setHashes({ MD5: '', SHA1: '', SHA256: '', SHA512: '' });
    setError(null);
    setCopied(null);
  };

  const addExample = () => {
    setInputText('Hola mundo! Este es un ejemplo de texto para generar hashes.');
    setError(null);
  };

  // Auto-generate hashes when input changes (with debounce effect)
  useEffect(() => {
    const timer = setTimeout(() => {
      generateAllHashes();
    }, 300);

    return () => clearTimeout(timer);
  }, [generateAllHashes]);

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <Heading level={3}>{t('Generador de Hash')}</Heading>

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

        <div className="space-y-2">
          <Label htmlFor="input-text">{t('Texto para generar hash')}</Label>
          <Textarea
            id="input-text"
            placeholder={t('Introduce el texto del que quieres generar los hashes...')}
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

        {(hashes.MD5 || hashes.SHA1 || hashes.SHA256 || hashes.SHA512) && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              <Label>{t('Resultados de Hash')}</Label>
              {isGenerating && <span className="text-muted-foreground text-xs">Generando...</span>}
            </div>

            <Tabs defaultValue="MD5" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="MD5">MD5</TabsTrigger>
                <TabsTrigger value="SHA1">SHA-1</TabsTrigger>
                <TabsTrigger value="SHA256">SHA-256</TabsTrigger>
                <TabsTrigger value="SHA512">SHA-512</TabsTrigger>
              </TabsList>

              {(['MD5', 'SHA1', 'SHA256', 'SHA512'] as HashType[]).map((hashType) => (
                <TabsContent key={hashType} value={hashType} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Hash {hashType}</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(hashType)}
                      className="flex items-center gap-1"
                      data-test={`copy-${hashType.toLowerCase()}`}
                      disabled={!hashes[hashType]}
                    >
                      {copied === hashType ? (
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
                    value={hashes[hashType]}
                    readOnly
                    className="bg-muted font-mono text-sm"
                    rows={2}
                    data-test={`output-${hashType.toLowerCase()}`}
                  />
                  <div className="text-muted-foreground text-xs">
                    {t('Longitud: {n} caracteres', { n: hashes[hashType].length })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Heading level={3} className="mb-4">
          {t('Información sobre Funciones Hash')}
        </Heading>

        <div className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">{t('¿Qué es una función hash?')}</h4>
            <p className="text-muted-foreground text-sm">
              {t('Una función hash criptográfica convierte datos de cualquier tamaño en una cadena de longitud fija. Es determinística (mismo input = mismo output) y prácticamente irreversible.')}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">MD5</h4>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                <li>128 bits (32 caracteres hex)</li>
                <li>{t('Rápido pero no seguro')}</li>
                <li>{t('Solo para checksums simples')}</li>
                <li>{t('Vulnerable a colisiones')}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">SHA-1</h4>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                <li>160 bits (40 caracteres hex)</li>
                <li>{t('Más seguro que MD5')}</li>
                <li>{t('Deprecado para seguridad')}</li>
                <li>{t('Aún usado en Git')}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">SHA-256</h4>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                <li>256 bits (64 caracteres hex)</li>
                <li>{t('Estándar actual seguro')}</li>
                <li>{t('Usado en Bitcoin/blockchain')}</li>
                <li>{t('Resistente a colisiones')}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">SHA-512</h4>
              <ul className="text-muted-foreground list-disc space-y-1 pl-4 text-xs">
                <li>512 bits (128 caracteres hex)</li>
                <li>{t('Más seguro que SHA-256')}</li>
                <li>{t('Mejor para datos grandes')}</li>
                <li>{t('Usado en certificados SSL/TLS')}</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium">{t('Casos de uso comunes:')}</h4>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>{t('Verificación de integridad de archivos')}</li>
              <li>{t('Almacenamiento seguro de contraseñas')}</li>
              <li>{t('Identificadores únicos de contenido')}</li>
              <li>{t('Firmas digitales y certificados')}</li>
              <li>{t('Blockchain y criptomonedas')}</li>
            </ul>
          </div>

          <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <Info className="h-4 w-4 text-amber-600" />
              {t('Consideraciones importantes:')}
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-amber-800 dark:text-amber-200">
              <li>{t('Los hashes son irreversibles - no puedes obtener el texto original')}</li>
              <li>{t('MD5 y SHA-1 no deben usarse para aplicaciones críticas de seguridad')}</li>
              <li>{t('Para contraseñas, usa funciones especializadas como bcrypt o Argon2')}</li>
              <li>{t('Pequeños cambios en el input generan hashes completamente diferentes')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
