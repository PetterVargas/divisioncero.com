import type { ConnectionInfo } from '../../../app/herramientas/cual-es-mi-ip/ip-info';

/**
 * Lógica de la API de "¿Cuál es mi IP?" (`functions/herramientas/api/mi-ip/`):
 * devuelve lo que el servidor recibe de quien hace la petición (IP de origen,
 * encabezados HTTP y datos de conexión de Cloudflare en `request.cf`).
 * No guarda nada.
 */

/** Subconjunto de `request.cf` (Cloudflare) que usa esta API. */
interface CfProperties {
  asn?: number;
  asOrganization?: string;
  colo?: string;
  city?: string;
  country?: string;
  clientTcpRtt?: number;
  httpProtocol?: string;
  tlsVersion?: string;
  tlsCipher?: string;
}

export type CfRequest = Request & { cf?: CfProperties };

const NO_DISPONIBLE = 'No disponible';

function header(request: Request, name: string): string {
  return request.headers.get(name)?.trim() || '';
}

function clientIp(request: Request): string {
  return (
    header(request, 'cf-connecting-ip') ||
    header(request, 'x-real-ip') ||
    header(request, 'x-forwarded-for').split(',')[0]?.trim() ||
    NO_DISPONIBLE
  );
}

function collect(request: CfRequest): ConnectionInfo {
  const cf = request.cf ?? {};
  const ip = clientIp(request);
  const edge = [cf.colo, cf.city, cf.country].filter(Boolean).join(' · ');

  return {
    ip,
    ipVersion: ip.includes(':') ? 'IPv6' : 'IPv4',
    method: request.method,
    userAgent: header(request, 'user-agent'),
    acceptLanguage: header(request, 'accept-language'),
    acceptEncoding: header(request, 'accept-encoding'),
    accept: header(request, 'accept'),
    acceptCharset: header(request, 'accept-charset'),
    referer: header(request, 'referer'),
    xForwardedFor: header(request, 'x-forwarded-for'),
    clientHintsBrowser: header(request, 'sec-ch-ua'),
    clientHintsPlatform: header(request, 'sec-ch-ua-platform').replace(/"/g, ''),
    clientHintsMobile:
      header(request, 'sec-ch-ua-mobile') === '?1'
        ? 'Sí'
        : header(request, 'sec-ch-ua-mobile') === '?0'
          ? 'No'
          : '',
    httpProtocol: cf.httpProtocol || '',
    tlsVersion: cf.tlsVersion || '',
    tlsCipher: cf.tlsCipher || '',
    asn: cf.asn ? `AS${cf.asn}` : '',
    asOrganization: cf.asOrganization || '',
    edgeLocation: edge,
    roundTripMs: cf.clientTcpRtt ? `${cf.clientTcpRtt} ms` : '',
    receivedAt: new Date().toISOString(),
  };
}

/** Campos que se pueden pedir uno a uno, como `/mi-ip/ua`. */
const FIELDS: Record<string, keyof ConnectionInfo> = {
  ip: 'ip',
  version: 'ipVersion',
  ua: 'userAgent',
  idioma: 'acceptLanguage',
  encoding: 'acceptEncoding',
  mime: 'accept',
  charset: 'acceptCharset',
  referer: 'referer',
  forwarded: 'xForwardedFor',
  protocolo: 'httpProtocol',
  tls: 'tlsVersion',
  asn: 'asn',
  organizacion: 'asOrganization',
};

/** Nombres en español para la salida `todo` en texto plano. */
const TEXT_LABELS: [keyof ConnectionInfo, string][] = [
  ['ip', 'ip'],
  ['ipVersion', 'version_ip'],
  ['method', 'metodo'],
  ['userAgent', 'agente_usuario'],
  ['acceptLanguage', 'idioma'],
  ['acceptEncoding', 'encoding'],
  ['accept', 'mime'],
  ['acceptCharset', 'charset'],
  ['referer', 'referer'],
  ['xForwardedFor', 'forwarded'],
  ['httpProtocol', 'protocolo_http'],
  ['tlsVersion', 'version_tls'],
  ['tlsCipher', 'cifrado_tls'],
  ['asn', 'asn'],
  ['asOrganization', 'organizacion_asn'],
  ['edgeLocation', 'nodo_cloudflare'],
  ['roundTripMs', 'latencia_tcp'],
  ['receivedAt', 'fecha_utc'],
];

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' };

function text(body: string, status = 200): Response {
  return new Response(`${body}\n`, {
    status,
    headers: { ...NO_STORE, 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/** Responde el campo pedido (`[]` = solo la IP, `['ua']`, `['todo.json']`...). */
export function respondMiIp(request: CfRequest, params: string[] | undefined): Response {
  const info = collect(request);
  const campo = (params ?? []).join('/').toLowerCase();

  if (campo === 'todo.json') {
    return Response.json(info, { headers: NO_STORE });
  }

  if (campo === 'todo') {
    return text(TEXT_LABELS.map(([key, label]) => `${label}: ${info[key] || ''}`).join('\n'));
  }

  if (campo === '') return text(info.ip);

  const field = FIELDS[campo];
  if (!field) {
    return text(
      `Campo desconocido. Usa uno de: ${[...Object.keys(FIELDS), 'todo', 'todo.json'].join(', ')}`,
      404,
    );
  }

  return text(info[field] || '');
}

