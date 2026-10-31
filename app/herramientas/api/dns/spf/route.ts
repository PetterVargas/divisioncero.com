import { NextRequest, NextResponse } from 'next/server';

import { z } from 'zod';

import { verifyCaptcha } from '@/lib/herramientas/turnstile';
import { msg, requestLocale, type ApiLocale } from '@/lib/herramientas/i18n/api';

const domainSchema = (locale: ApiLocale) => z.object({
  domain: z
    .string()
    .min(1, msg(locale, 'Ingresa un dominio', 'Domain required'))
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*$/,
      msg(locale, 'Formato de dominio inválido', 'Invalid domain format'),
    ),
});

interface DNSResponse {
  Status: number;
  Answer?: Array<{
    name: string;
    type: number;
    data: string;
  }>;
}

export async function POST(request: NextRequest) {
  const locale = requestLocale(request);
  try {
    const body = await request.json();
    const validationResult = domainSchema(locale).safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: validationResult.error.issues[0]?.message || msg(locale, 'Dominio inválido', 'Invalid domain'),
        },
        { status: 400 },
      );
    }

    const captchaError = await verifyCaptcha(request);
    if (captchaError) {
      return NextResponse.json({ success: false, error: captchaError }, { status: 403 });
    }

    const { domain } = validationResult.data;

    // Use multiple DNS providers for reliability
    const dnsProviders = [
      {
        name: 'cloudflare',
        url: `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=TXT`,
        headers: { Accept: 'application/dns-json' },
      },
      {
        name: 'google',
        url: `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=TXT`,
        headers: { Accept: 'application/json' },
      },
    ];

    let spfRecord = '';
    let dnsError = '';

    // Try each DNS provider
    for (const provider of dnsProviders) {
      // Create AbortController for timeout
      const controller = new AbortController();
      let timeoutId: NodeJS.Timeout | undefined;

      try {
        timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(provider.url, {
          headers: provider.headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          continue; // Try next provider
        }

        const dnsData: DNSResponse = await response.json();

        if (dnsData.Status === 0 && dnsData.Answer) {
          // Find SPF record in TXT records
          for (const record of dnsData.Answer) {
            if (record.type === 16 && record.data) {
              // Clean the record data (remove quotes and escape characters)
              let cleanData = record.data
                .replace(/^"|"$/g, '') // Remove surrounding quotes
                .replace(/\\"/g, '"') // Unescape quotes
                .replace(/\\\\/g, '\\'); // Unescape backslashes

              // Some DNS providers return the record with additional quotes
              cleanData = cleanData.replace(/^"|"$/g, '');

              if (cleanData.toLowerCase().startsWith('v=spf1')) {
                spfRecord = cleanData;
                break;
              }
            }
          }
        }

        if (spfRecord) {
          break; // Found SPF record, no need to try other providers
        }
      } catch (error) {
        dnsError = error instanceof Error ? error.message : msg(locale, 'La consulta DNS falló', 'DNS query failed');
        continue; // Try next provider
      } finally {
        // Always clean up timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    }

    if (!spfRecord) {
      return NextResponse.json({
        success: true,
        data: {
          domain,
          hasSpf: false,
          error: dnsError || msg(locale, 'No se encontró un registro SPF para este dominio', 'No SPF record found for this domain'),
        },
      });
    }

    // Parse SPF record
    const parsedSpf = parseSPFRecord(spfRecord, locale);

    return NextResponse.json({
      success: true,
      data: {
        domain,
        hasSpf: true,
        rawRecord: spfRecord,
        spfRecord: parsedSpf,
      },
    });
  } catch (error) {
    console.error('SPF validation error:', error);

    return NextResponse.json(
      {
        success: false,
        error: msg(locale, 'Error interno del servidor durante la validación SPF', 'Internal server error during SPF validation'),
      },
      { status: 500 },
    );
  }
}

function parseSPFRecord(record: string, locale: ApiLocale) {
  const mechanisms: string[] = [];
  const qualifiers: { [key: string]: string } = {};
  const includes: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!record.toLowerCase().startsWith('v=spf1')) {
    errors.push(msg(locale, 'El registro SPF debe comenzar con "v=spf1"', 'SPF record must start with "v=spf1"'));
  }

  const parts = record.split(/\s+/).filter(Boolean);

  for (const part of parts) {
    if (part === 'v=spf1') continue;

    // Check for mechanisms
    if (part.match(/^[+\-~?]?(all|include|a|mx|ptr|exists|ip4|ip6|redirect)(:.*)?$/i)) {
      const qualifier = part.charAt(0);
      if (['+', '-', '~', '?'].includes(qualifier)) {
        qualifiers[part] = getQualifierDescription(qualifier, locale);
      } else {
        qualifiers[part] = msg(locale, 'Pass (por defecto)', 'Pass (default)');
      }
      mechanisms.push(part);

      // Extract includes
      if (part.toLowerCase().includes('include:')) {
        const includeDomain = part.split(/include:/i)[1];
        if (includeDomain) includes.push(includeDomain);
      }

      // Validate IP addresses
      if (part.toLowerCase().includes('ip4:') || part.toLowerCase().includes('ip6:')) {
        const ipPart = part.split(':')[1];
        if (ipPart && !isValidIP(ipPart)) {
          warnings.push(msg(locale, `IP inválida en el mecanismo: ${part}`, `Invalid IP in mechanism: ${part}`));
        }
      }
    } else {
      warnings.push(msg(locale, `Mecanismo desconocido o mal formado: ${part}`, `Unknown or malformed mechanism: ${part}`));
    }
  }

  // Check for "all" mechanism
  const hasAll = mechanisms.some((m) => m.toLowerCase().includes('all'));
  if (!hasAll) {
    warnings.push(msg(locale, 'Se recomienda incluir un mecanismo "all" al final del registro', 'It is recommended to include an "all" mechanism at the end of the record'));
  }

  // Check for too many includes
  if (includes.length > 10) {
    warnings.push(msg(locale, 'Demasiados mecanismos "include" pueden causar problemas de rendimiento', 'Too many "include" mechanisms may cause performance issues'));
  }

  // Check record length
  if (record.length > 255) {
    warnings.push(msg(locale, 'El registro SPF supera la longitud recomendada de 255 caracteres', 'SPF record exceeds recommended length of 255 characters'));
  }

  return {
    record,
    mechanisms,
    qualifiers,
    includes,
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

function getQualifierDescription(qualifier: string, locale: ApiLocale): string {
  switch (qualifier) {
    case '+':
      return msg(locale, 'Pass (permitido)', 'Pass (allowed)');
    case '-':
      return msg(locale, 'Fail (rechazar)', 'Fail (reject)');
    case '~':
      return msg(locale, 'SoftFail (marcar como spam)', 'SoftFail (mark as spam)');
    case '?':
      return msg(locale, 'Neutral (sin política)', 'Neutral (no policy)');
    default:
      return msg(locale, 'Pass (por defecto)', 'Pass (default)');
  }
}

function isValidIP(ip: string): boolean {
  // IPv4 validation (with optional CIDR)
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\/(?:3[0-2]|[12]?[0-9]))?$/;

  // IPv6 validation (basic, with optional CIDR)
  const ipv6Regex =
    /^(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{0,4}(?:\/(?:12[0-8]|1[01][0-9]|[1-9]?[0-9]))?$|^::1$|^::$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}
