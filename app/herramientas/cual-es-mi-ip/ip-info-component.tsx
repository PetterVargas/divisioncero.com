'use client';

import { useEffect, useState, type ReactNode } from 'react';

import {
  AlertTriangle,
  FileDown,
  Globe,
  Info,
  Loader2,
  MonitorSmartphone,
  Server,
  Terminal,
} from 'lucide-react';

import { Alert, AlertDescription } from '@/components/herramientas/ui/alert';
import { Button } from '@/components/herramientas/ui/button';
import { Heading } from '@/components/herramientas/ui/heading';
import { toast } from '@/components/herramientas/ui/sonner';

import { formatDateWithUtcOffset } from '@/lib/herramientas/datetime';
import { sha256Hex } from '@/lib/herramientas/hash';

import {
  CONNECTION_API_PATH,
  collectBrowserInfo,
  fetchConnectionInfo,
  fetchIpGeoInfo,
  type BrowserInfo,
  type ConnectionInfo,
  type IpGeoInfo,
} from './ip-info';
import { buildIpReportPdf } from './ip-report-pdf';

const SITE_URL = 'https://divisioncero.com';

/** Comandos de terminal que responde la API, con la descripción de cada uno. */
const CLI_COMMANDS: { path: string; description: string }[] = [
  { path: '', description: 'Tu dirección IP pública' },
  { path: '/ua', description: 'Agente de usuario (User-Agent)' },
  { path: '/idioma', description: 'Idiomas aceptados (Accept-Language)' },
  { path: '/encoding', description: 'Compresión aceptada (Accept-Encoding)' },
  { path: '/mime', description: 'Tipos de contenido aceptados (Accept)' },
  { path: '/forwarded', description: 'Cadena de proxies (X-Forwarded-For)' },
  { path: '/protocolo', description: 'Versión de HTTP de la conexión' },
  { path: '/tls', description: 'Versión de TLS de la conexión' },
  { path: '/asn', description: 'Sistema autónomo (ASN) de tu IP' },
  { path: '/todo', description: 'Todos los datos, en texto plano' },
  { path: '/todo.json', description: 'Todos los datos, en JSON' },
];

function orEmpty(value: string): string {
  return value || 'No enviado';
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-sm font-medium break-all sm:text-right">{value}</span>
    </div>
  );
}

export function IpInfoComponent() {
  const [ipInfo, setIpInfo] = useState<IpGeoInfo | null>(null);
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo | null>(null);
  const [connectionError, setConnectionError] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [lastHash, setLastHash] = useState<string | null>(null);

  useEffect(() => {
    const info = collectBrowserInfo();

    // Independiente de la geolocalización: si la API propia no responde
    // (por ejemplo, con `next dev`, que no ejecuta Pages Functions), el resto
    // de la herramienta sigue funcionando.
    fetchConnectionInfo()
      .then(setConnectionInfo)
      .catch(() => setConnectionError(true));

    fetchIpGeoInfo()
      .then((geo) => {
        setBrowserInfo(info);
        setIpInfo(geo);
      })
      .catch((err) => {
        setBrowserInfo(info);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownloadPdf = async () => {
    if (!ipInfo || !browserInfo) return;

    setIsGeneratingPdf(true);
    try {
      const pdfBytes = buildIpReportPdf(ipInfo, browserInfo, connectionInfo);
      const hash = await sha256Hex(pdfBytes);
      setLastHash(hash);

      const filename = `reporte-ip-sha256-${hash}.pdf`;
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
      toast.error('Error al generar el PDF', {
        description: err instanceof Error ? err.message : 'Error desconocido',
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="bg-card space-y-6 rounded-lg border p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Heading level={3}>Tu información pública</Heading>
          <Button
            onClick={handleDownloadPdf}
            disabled={isLoading || !ipInfo || isGeneratingPdf}
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

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Consultando tu dirección IP pública...
          </div>
        )}

        {ipInfo && (
          <div className="bg-muted/50 rounded-lg border p-6 text-center">
            <p className="text-muted-foreground text-xs tracking-wide uppercase">
              Tu dirección IP pública
            </p>
            <p className="font-mono text-3xl font-bold" data-test="public-ip">
              {ipInfo.ip}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              {ipInfo.city}, {ipInfo.region}, {ipInfo.country} · {ipInfo.isp}
            </p>
          </div>
        )}

        {ipInfo && browserInfo && (
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Globe className="text-primary h-4 w-4" />
                <span className="text-sm font-semibold">Información de red</span>
              </div>
              <div className="rounded-lg border divide-y">
                <InfoRow label="Tipo de IP" value={ipInfo.type} />
                <InfoRow label="Ciudad" value={ipInfo.city} />
                <InfoRow label="Región" value={ipInfo.region} />
                <InfoRow label="País" value={`${ipInfo.country} (${ipInfo.countryCode})`} />
                <InfoRow label="Código postal" value={ipInfo.postal} />
                <InfoRow label="Proveedor (ISP)" value={ipInfo.isp} />
                <InfoRow label="Organización" value={ipInfo.org} />
                <InfoRow label="ASN" value={String(ipInfo.asn)} />
                <InfoRow
                  label="Zona horaria (IP)"
                  value={`${ipInfo.timezoneId}${ipInfo.timezoneUtc ? ` (UTC${ipInfo.timezoneUtc})` : ''}`}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <MonitorSmartphone className="text-primary h-4 w-4" />
                <span className="text-sm font-semibold">Navegador y dispositivo</span>
              </div>
              <div className="rounded-lg border divide-y">
                <InfoRow
                  label="Fecha y hora de visita"
                  value={formatDateWithUtcOffset(browserInfo.visitedAt)}
                />
                <InfoRow label="Idioma preferido" value={browserInfo.language} />
                <InfoRow label="Plataforma" value={browserInfo.platform} />
                <InfoRow label="Resolución de pantalla" value={browserInfo.screenResolution} />
                <InfoRow label="Zona horaria (navegador)" value={browserInfo.browserTimezone} />
                <InfoRow
                  label="Cookies habilitadas"
                  value={browserInfo.cookiesEnabled ? 'Sí' : 'No'}
                />
                <InfoRow label="Do Not Track" value={browserInfo.doNotTrack} />
                <InfoRow
                  label="Estado de conexión"
                  value={browserInfo.onLine ? 'En línea' : 'Sin conexión'}
                />
                <InfoRow label="Página de referencia" value={browserInfo.referrer} />
                <InfoRow label="User Agent" value={browserInfo.userAgent} />
              </div>
            </div>
          </div>
        )}

        {lastHash && (
          <div className="bg-muted rounded-md p-3 text-xs">
            <p className="mb-1 font-medium">Hash SHA-256 del último PDF descargado:</p>
            <p className="text-muted-foreground font-mono break-all">{lastHash}</p>
          </div>
        )}
      </div>

      <div className="bg-card space-y-4 rounded-lg border p-6">
        <div className="flex items-center gap-2">
          <Server className="text-primary h-5 w-5" />
          <Heading level={3}>Lo que recibe el servidor</Heading>
        </div>
        <p className="text-muted-foreground text-sm">
          Estos datos no los lee tu navegador: son los encabezados HTTP y la información de la conexión que llegan al
          servidor de DivisionCero cuando tu navegador le hace una petición. Es exactamente lo que cualquier sitio web,
          o una herramienta de rastreo como Conan, puede registrar de un visitante.
        </p>

        {!connectionInfo && !connectionError && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Consultando lo que recibe el servidor...
          </div>
        )}

        {connectionError && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              No se pudo consultar el servidor en este momento. El resto de la información de esta página sigue siendo
              válida.
            </AlertDescription>
          </Alert>
        )}

        {connectionInfo && (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border divide-y" data-test="server-headers">
              <InfoRow label="Dirección IP de origen" value={connectionInfo.ip} />
              <InfoRow label="Versión de IP" value={connectionInfo.ipVersion} />
              <InfoRow label="Método" value={connectionInfo.method} />
              <InfoRow label="User-Agent" value={orEmpty(connectionInfo.userAgent)} />
              <InfoRow label="Accept-Language" value={orEmpty(connectionInfo.acceptLanguage)} />
              <InfoRow label="Accept-Encoding" value={orEmpty(connectionInfo.acceptEncoding)} />
              <InfoRow label="Accept (MIME)" value={orEmpty(connectionInfo.accept)} />
              <InfoRow label="Accept-Charset" value={orEmpty(connectionInfo.acceptCharset)} />
              <InfoRow label="Referer" value={orEmpty(connectionInfo.referer)} />
              <InfoRow label="X-Forwarded-For" value={orEmpty(connectionInfo.xForwardedFor)} />
            </div>
            <div className="rounded-lg border divide-y">
              <InfoRow label="Navegador (Client Hints)" value={orEmpty(connectionInfo.clientHintsBrowser)} />
              <InfoRow label="Plataforma (Client Hints)" value={orEmpty(connectionInfo.clientHintsPlatform)} />
              <InfoRow label="Dispositivo móvil (Client Hints)" value={orEmpty(connectionInfo.clientHintsMobile)} />
              <InfoRow label="Protocolo HTTP" value={orEmpty(connectionInfo.httpProtocol)} />
              <InfoRow label="Versión de TLS" value={orEmpty(connectionInfo.tlsVersion)} />
              <InfoRow label="Cifrado TLS" value={orEmpty(connectionInfo.tlsCipher)} />
              <InfoRow label="ASN" value={orEmpty(connectionInfo.asn)} />
              <InfoRow label="Organización del ASN" value={orEmpty(connectionInfo.asOrganization)} />
              <InfoRow label="Nodo de Cloudflare" value={orEmpty(connectionInfo.edgeLocation)} />
              <InfoRow label="Latencia TCP" value={orEmpty(connectionInfo.roundTripMs)} />
            </div>
          </div>
        )}
      </div>

      <div className="bg-card space-y-4 rounded-lg border p-6">
        <div className="flex items-center gap-2">
          <Terminal className="text-primary h-5 w-5" />
          <Heading level={3}>Consulta desde la terminal</Heading>
        </div>
        <p className="text-muted-foreground text-sm">
          Puedes obtener los mismos datos sin abrir el navegador, por ejemplo desde un servidor, un script o una
          máquina virtual de análisis. Funciona con <code>curl</code>, <code>wget</code> o cualquier cliente HTTP.
        </p>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="px-3 py-2 font-semibold">Comando</th>
                <th className="px-3 py-2 font-semibold">Respuesta</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {CLI_COMMANDS.map((command) => (
                <tr key={command.path}>
                  <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                    curl {SITE_URL}
                    {CONNECTION_API_PATH}
                    {command.path}
                  </td>
                  <td className="text-muted-foreground px-3 py-2">{command.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground text-xs">
          Desde la terminal verás otros valores en User-Agent, Accept o Accept-Language: cada cliente HTTP envía sus
          propios encabezados. Por eso un registro que dice <code>curl/8.x</code> no corresponde a una persona navegando.
        </p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <Heading level={3} className="mb-4">
          ¿Qué información recibe un sitio web al visitarlo?
        </Heading>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Cada vez que visitas una página, tu navegador y tu proveedor de internet revelan automáticamente cierta información: tu dirección IP pública, una ubicación aproximada derivada de esa IP, y datos de tu navegador como el user agent, el idioma y la resolución de pantalla. Esta herramienta consulta un servicio público de geolocalización por IP y reúne los datos que expone tu propio navegador para mostrarte exactamente lo que un sitio web podría ver.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-1 text-sm font-semibold">IP pública e IP privada</h4>
              <p className="text-muted-foreground text-sm">
                Tu proveedor de Internet (ISP) asigna la IP pública, la que ven los sitios web. Dentro de tu casa u
                oficina, el router reparte IP privadas (como 192.168.x.x o 10.x.x.x) que no salen a Internet. Todos los
                dispositivos de una misma red suelen compartir la misma IP pública.
              </p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-semibold">IPv4 e IPv6</h4>
              <p className="text-muted-foreground text-sm">
                IPv4 usa cuatro números separados por puntos (186.0.80.197) y sus direcciones ya se agotaron. IPv6 usa
                grupos hexadecimales separados por dos puntos (2800:484:...) y permite asignar una dirección propia a
                cada dispositivo. Muchas conexiones tienen ambas, y el sitio ve la que se usó en esa petición.
              </p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-semibold">IP dinámica y CGNAT</h4>
              <p className="text-muted-foreground text-sm">
                La mayoría de los ISP asignan IP dinámicas, que cambian con el tiempo o al reiniciar el router. En redes
                móviles es común el CGNAT: cientos de clientes comparten una sola IP pública al mismo tiempo. Por eso,
                para identificar a un suscriptor, el ISP necesita la IP junto con la fecha y hora exactas.
              </p>
            </div>
            <div>
              <h4 className="mb-1 text-sm font-semibold">VPN, proxy y Tor</h4>
              <p className="text-muted-foreground text-sm">
                Si te conectas a través de una VPN, un proxy o la red Tor, el sitio web ve la IP de ese servicio y no la
                de tu ISP. Lo notarás porque el ASN y la organización corresponden a una empresa de hosting o de VPN, y
                la ubicación no coincide con la tuya.
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-semibold">Los encabezados HTTP, uno por uno</h4>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>
                <strong>User-Agent:</strong> identifica el navegador, su versión y el sistema operativo. Los navegadores
                basados en Chromium lo complementan con los <strong>Client Hints</strong> (Sec-CH-UA), más precisos.
              </li>
              <li>
                <strong>Accept-Language:</strong> los idiomas configurados en el navegador, en orden de preferencia
                (el valor <code>q</code> indica el peso de cada uno).
              </li>
              <li>
                <strong>Accept-Encoding:</strong> los formatos de compresión que entiende tu navegador (gzip, br, zstd).
              </li>
              <li>
                <strong>Accept:</strong> los tipos de contenido (MIME) que el navegador espera recibir. Cambia según si
                se pide una página, una imagen o datos.
              </li>
              <li>
                <strong>Referer:</strong> la página desde la que llegaste. Los navegadores lo recortan o lo omiten
                según la política de privacidad del sitio.
              </li>
              <li>
                <strong>X-Forwarded-For:</strong> la cadena de direcciones IP por las que pasó la petición cuando hay
                proxies o redes de distribución de contenido (CDN) de por medio. La primera suele ser la del cliente.
              </li>
              <li>
                <strong>Protocolo HTTP y TLS:</strong> la versión del protocolo (HTTP/1.1, HTTP/2, HTTP/3) y del
                cifrado (TLS 1.2, TLS 1.3) negociados entre tu navegador y el servidor.
              </li>
            </ul>
          </div>

          <div className="rounded-md bg-amber-50 p-3 dark:bg-amber-950/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              Una IP identifica una conexión, no a una persona
            </h4>
            <p className="text-sm text-amber-900 dark:text-amber-200">
              La misma IP puede ser usada por una familia, una empresa o miles de clientes de un operador móvil. En una
              investigación, la IP es el punto de partida para que una autoridad facultada solicite al ISP los datos
              del suscriptor, y siempre debe acompañarse de otras evidencias. Aprende a usarla en la lección{' '}
              <a
                className="text-primary underline underline-offset-2"
                href="/cyberacademy/adr/investigacion-de-cibercrimen/modulo-3-tecnicas-de-investigacion-digital/rastreo-informatico-basado-en-direccion-ip-con-conan"
              >
                Rastreo Informático basado en Dirección IP con Conan
              </a>
              .
            </p>
          </div>

          <div className="rounded-md bg-blue-50 p-3 dark:bg-blue-950/20">
            <h4 className="mb-2 flex items-center gap-2 font-medium">
              <Info className="h-4 w-4 text-blue-600" />
              Sobre el reporte en PDF:
            </h4>
            <ul className="list-disc space-y-1 pl-5 text-sm text-blue-800 dark:text-blue-200">
              <li>El PDF se genera completamente en tu navegador, sin pasar por ningún servidor.</li>
              <li>
                Al descargarlo, se calcula el hash SHA-256 del archivo y se incluye en el nombre para que puedas verificar su integridad.
              </li>
              <li>La ubicación por IP es aproximada y puede no corresponder a tu dirección exacta.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
