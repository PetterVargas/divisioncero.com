export type IfdValue = string | number | number[] | [number, number] | [number, number][];

interface IfdEntry {
  tag: number;
  type: number;
  count: number;
  value: IfdValue;
}

const TYPE_SIZES: Record<number, number> = {
  1: 1, // BYTE
  2: 1, // ASCII
  3: 2, // SHORT
  4: 4, // LONG
  5: 8, // RATIONAL
  6: 1, // SBYTE
  7: 1, // UNDEFINED
  8: 2, // SSHORT
  9: 4, // SLONG
  10: 8, // SRATIONAL
  11: 4, // FLOAT
  12: 8, // DOUBLE
  13: 4, // IFD (offset a otro IFD; mismo tamaño que LONG)
};

function readAscii(bytes: Uint8Array, offset: number, length: number): string {
  let end = offset + length;
  // Recorta en el primer NUL: los strings ASCII de EXIF vienen terminados en \0.
  for (let i = offset; i < offset + length; i++) {
    if (bytes[i] === 0) {
      end = i;
      break;
    }
  }
  return new TextDecoder('latin1').decode(bytes.slice(offset, end));
}

function readEntryValue(
  view: DataView,
  bytes: Uint8Array,
  tiffStart: number,
  entryOffset: number,
  littleEndian: boolean,
): IfdEntry {
  const tag = view.getUint16(entryOffset, littleEndian);
  const type = view.getUint16(entryOffset + 2, littleEndian);
  const count = view.getUint32(entryOffset + 4, littleEndian);
  const unitSize = TYPE_SIZES[type] ?? 1;
  const totalSize = unitSize * count;
  const dataOffset = totalSize <= 4 ? entryOffset + 8 : tiffStart + view.getUint32(entryOffset + 8, littleEndian);

  let value: IfdValue;

  if (type === 2) {
    value = readAscii(bytes, dataOffset, count);
  } else if (type === 5 || type === 10) {
    const rationals: [number, number][] = [];
    for (let i = 0; i < count; i++) {
      const num = type === 5 ? view.getUint32(dataOffset + i * 8, littleEndian) : view.getInt32(dataOffset + i * 8, littleEndian);
      const den = type === 5 ? view.getUint32(dataOffset + i * 8 + 4, littleEndian) : view.getInt32(dataOffset + i * 8 + 4, littleEndian);
      rationals.push([num, den]);
    }
    value = count === 1 ? rationals[0]! : rationals;
  } else if (type === 3 || type === 8) {
    const nums: number[] = [];
    for (let i = 0; i < count; i++) {
      nums.push(type === 3 ? view.getUint16(dataOffset + i * 2, littleEndian) : view.getInt16(dataOffset + i * 2, littleEndian));
    }
    value = count === 1 ? nums[0]! : nums;
  } else if (type === 4 || type === 9 || type === 13) {
    // Tipo 13 (IFD) es un puntero a otro IFD; se lee igual que LONG (tipo 4).
    const nums: number[] = [];
    for (let i = 0; i < count; i++) {
      nums.push(type === 9 ? view.getInt32(dataOffset + i * 4, littleEndian) : view.getUint32(dataOffset + i * 4, littleEndian));
    }
    value = count === 1 ? nums[0]! : nums;
  } else if (type === 1 || type === 6 || type === 7) {
    value = Array.from(bytes.slice(dataOffset, dataOffset + count));
  } else {
    value = [];
  }

  return { tag, type, count, value };
}

function readIfd(
  view: DataView,
  bytes: Uint8Array,
  tiffStart: number,
  ifdOffset: number,
  littleEndian: boolean,
): { entries: Map<number, IfdEntry>; nextIfdOffset: number } {
  const entries = new Map<number, IfdEntry>();
  const entryCount = view.getUint16(ifdOffset, littleEndian);

  for (let i = 0; i < entryCount; i++) {
    const entryOffset = ifdOffset + 2 + i * 12;
    const entry = readEntryValue(view, bytes, tiffStart, entryOffset, littleEndian);
    entries.set(entry.tag, entry);
  }

  const nextIfdOffset = view.getUint32(ifdOffset + 2 + entryCount * 12, littleEndian);
  return { entries, nextIfdOffset };
}

export interface ExifData {
  make?: string;
  model?: string;
  software?: string;
  dateTime?: string;
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;
  artist?: string;
  copyright?: string;
  orientation?: number;
  xResolution?: number;
  yResolution?: number;
  exposureTime?: [number, number];
  fNumber?: [number, number];
  isoSpeed?: number;
  focalLength?: [number, number];
  lensModel?: string;
  pixelWidth?: number;
  pixelHeight?: number;
  /** Solo se rellenan cuando la ubicación es válida (ver `gps.status`). */
  gpsLatitude?: number;
  gpsLongitude?: number;
  gpsAltitude?: number;
  /** Estado de la ubicación; `undefined` si el archivo no trae ningún dato de ubicación. */
  gps?: GpsInfo;
}

function rationalToNumber(r: [number, number] | undefined): number | undefined {
  if (!r || r[1] === 0) return undefined;
  return r[0] / r[1];
}

// ---------------------------------------------------------------------------
// Ubicación GPS
// ---------------------------------------------------------------------------

/**
 * - `valida`: hay latitud y longitud legibles, dentro de rango y distintas de 0,0.
 * - `sin-ubicacion`: las coordenadas son exactamente 0,0 (valor de relleno, no una ubicación real).
 * - `no-legible`: el dato existe pero no se pudo leer (denominador 0, campo vacío, falta un eje…).
 * - `formato-no-reconocido`: el dato se leyó pero no es una coordenada válida (fuera de rango, texto raro…).
 */
export type GpsStatus = 'valida' | 'sin-ubicacion' | 'no-legible' | 'formato-no-reconocido';
export type GpsSource = 'EXIF' | 'XMP' | 'texto';

export interface GpsInfo {
  status: GpsStatus;
  source: GpsSource;
  latitude?: number;
  longitude?: number;
  altitude?: number;
  detail?: string;
}

type Axis = 'lat' | 'lon';

type CoordResult =
  | { ok: true; value: number }
  | { ok: false; reason: 'no-legible' | 'formato-no-reconocido'; detail: string };

const AXIS_NAME: Record<Axis, string> = { lat: 'latitud', lon: 'longitud' };
const AXIS_REFS: Record<Axis, [string, string]> = { lat: ['N', 'S'], lon: ['E', 'W'] };
const COMPONENT_NAMES = ['grados', 'minutos', 'segundos'];

function fail(reason: 'no-legible' | 'formato-no-reconocido', detail: string): CoordResult {
  return { ok: false, reason, detail };
}

function normalizeRef(ref: unknown): string | undefined {
  if (typeof ref !== 'string') return undefined;
  const clean = ref.replace(/\0/g, '').trim().toUpperCase();
  return clean || undefined;
}

/** Aplica la referencia N/S/E/W (tolerando minúsculas y espacios). Sin referencia se asume positivo. */
function applyRef(value: number, ref: string | undefined, axis: Axis): CoordResult {
  if (ref === undefined) return { ok: true, value };
  const [positive, negative] = AXIS_REFS[axis];
  const letter = ref[0];
  if (letter === positive) return { ok: true, value: Math.abs(value) };
  if (letter === negative) return { ok: true, value: -Math.abs(value) };
  return fail('formato-no-reconocido', `Referencia de ${AXIS_NAME[axis]} desconocida ("${ref}").`);
}

/** Convierte 1–3 racionales (grados, minutos, segundos) a grados decimales. */
function rationalsToDegrees(parts: [number, number][], axis: Axis): CoordResult {
  if (parts.length < 1 || parts.length > 3) {
    return fail('formato-no-reconocido', `La ${AXIS_NAME[axis]} tiene ${parts.length} componentes.`);
  }
  if (parts.every(([num, den]) => num === 0 && den === 0)) {
    return fail(
      'no-legible',
      `La ${AXIS_NAME[axis]} está vacía (0/0). Suele pasar cuando el sistema borra la ubicación al compartir la foto (por ejemplo, el selector de fotos de Android).`,
    );
  }
  let degrees = 0;
  for (let i = 0; i < parts.length; i++) {
    const [num, den] = parts[i]!;
    // Denominador 0: el componente no está disponible. No se asume 0.
    if (den === 0) {
      return fail('no-legible', `Los ${COMPONENT_NAMES[i]} de la ${AXIS_NAME[axis]} no están disponibles (denominador 0).`);
    }
    degrees += num / den / 60 ** i;
  }
  if (!Number.isFinite(degrees)) return fail('formato-no-reconocido', `La ${AXIS_NAME[axis]} no es un número.`);
  return { ok: true, value: degrees };
}

const NUM = String.raw`\d+(?:\.\d+)?`;
const XMP_DM_RE = new RegExp(String.raw`^(\d{1,3}),(${NUM})(?:,(${NUM}))?\s*([A-Z])$`, 'i');
const DMS_SYMBOL_RE = new RegExp(String.raw`^(\d{1,3})\s*°\s*(${NUM})\s*['′]\s*(?:(${NUM})\s*(?:"|″|''))?\s*([A-Z])$`, 'i');
const DECIMAL_RE = new RegExp(String.raw`^([+-]?${NUM})\s*°?\s*([A-Z])?$`, 'i');

/**
 * Lee una coordenada escrita como texto:
 * - XMP "DDD,MM,SSk" o "DDD,MM.mmk" (p. ej. "41,58.2N").
 * - Grados/minutos/segundos con símbolos (p. ej. `10°25'30"N`).
 * - Decimal con referencia opcional (p. ej. "4.6097", "-74.0817", "74.0817W").
 */
export function parseCoordinateText(text: string, axis: Axis): CoordResult {
  const s = text.replace(/\0/g, '').trim();
  if (!s) return fail('no-legible', `La ${AXIS_NAME[axis]} está vacía.`);

  const dm = XMP_DM_RE.exec(s) ?? DMS_SYMBOL_RE.exec(s);
  if (dm) {
    const [, d, m, sec, ref] = dm;
    const value = Number(d) + Number(m) / 60 + (sec ? Number(sec) / 3600 : 0);
    return applyRef(value, normalizeRef(ref), axis);
  }

  const dec = DECIMAL_RE.exec(s);
  if (dec) {
    const [, n, ref] = dec;
    const value = Number(n);
    if (ref && value < 0) return fail('formato-no-reconocido', `La ${AXIS_NAME[axis]} "${s}" tiene signo y referencia a la vez.`);
    return applyRef(value, normalizeRef(ref), axis);
  }

  return fail('formato-no-reconocido', `No se reconoce el formato de la ${AXIS_NAME[axis]} ("${s}").`);
}

/** Busca un par decimal "lat, lon" ya convertido (p. ej. "4.6097, -74.0817") dentro de un texto. */
export function findCoordinatePair(text: string): { latitude: number; longitude: number } | undefined {
  const match = /(?<![\d.])([+-]?\d{1,3}\.\d{2,})\s*[,;]\s*([+-]?\d{1,3}\.\d{2,})(?![\d.])/.exec(text);
  if (!match) return undefined;
  return { latitude: Number(match[1]), longitude: Number(match[2]) };
}

function buildGps(source: GpsSource, lat: CoordResult | undefined, lon: CoordResult | undefined, altitude?: number): GpsInfo {
  if (!lat || !lon) {
    return { status: 'no-legible', source, detail: `Falta la ${lat ? 'longitud' : 'latitud'}.` };
  }
  if (!lat.ok) return { status: lat.reason, source, detail: lat.detail };
  if (!lon.ok) return { status: lon.reason, source, detail: lon.detail };

  const latitude = lat.value;
  const longitude = lon.value;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return {
      status: 'formato-no-reconocido',
      source,
      detail: `Coordenadas fuera de rango (${latitude}, ${longitude}).`,
    };
  }
  if (latitude === 0 && longitude === 0) {
    return {
      status: 'sin-ubicacion',
      source,
      detail:
        'Las coordenadas son 0,0. Suele ser un valor de relleno, por ejemplo cuando el sistema borra la ubicación al compartir la foto.',
    };
  }
  return { status: 'valida', source, latitude, longitude, altitude };
}

/** Elige la primera ubicación válida; si no hay ninguna, el primer diagnóstico disponible. */
export function combineGps(candidates: (GpsInfo | undefined)[]): GpsInfo | undefined {
  const present = candidates.filter((c): c is GpsInfo => c !== undefined);
  return present.find((c) => c.status === 'valida') ?? present[0];
}

function gpsFromIfd(entries: Map<number, IfdEntry>): GpsInfo | undefined {
  const latEntry = entries.get(0x0002);
  const lonEntry = entries.get(0x0004);
  if (!latEntry && !lonEntry) return undefined;

  const readAxis = (entry: IfdEntry | undefined, refTag: number, axis: Axis): CoordResult | undefined => {
    if (!entry) return undefined;
    const ref = normalizeRef(entries.get(refTag)?.value);
    const v = entry.value;
    let degrees: CoordResult;
    if (typeof v === 'string') {
      // Algunos programas escriben la coordenada como texto en vez de RATIONAL.
      degrees = parseCoordinateText(v, axis);
      if (degrees.ok && ref) degrees = applyRef(degrees.value, ref, axis);
      return degrees;
    }
    if (Array.isArray(v) && v.length > 0 && Array.isArray(v[0])) {
      degrees = rationalsToDegrees(v as [number, number][], axis);
    } else if (Array.isArray(v) && v.length === 2 && (entry.type === 5 || entry.type === 10)) {
      degrees = rationalsToDegrees([v as [number, number]], axis);
    } else {
      return fail('formato-no-reconocido', `La ${AXIS_NAME[axis]} usa un tipo de dato no soportado (${entry.type}).`);
    }
    if (!degrees.ok) return degrees;
    return applyRef(degrees.value, ref, axis);
  };

  const lat = readAxis(latEntry, 0x0001, 'lat');
  const lon = readAxis(lonEntry, 0x0003, 'lon');

  let altitude: number | undefined;
  const altRaw = entries.get(0x0006)?.value;
  if (Array.isArray(altRaw) && altRaw.length === 2 && typeof altRaw[0] === 'number') {
    altitude = rationalToNumber(altRaw as [number, number]);
    // GPSAltitudeRef (0x0005): 1 = bajo el nivel del mar.
    const altRef = entries.get(0x0005)?.value;
    const refByte = Array.isArray(altRef) ? altRef[0] : altRef;
    if (altitude !== undefined && refByte === 1) altitude = -Math.abs(altitude);
  }

  return buildGps('EXIF', lat, lon, altitude);
}

function decodeXmlText(s: string): string {
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Lee una propiedad XMP escrita como atributo (`exif:X="…"`) o como elemento (`<exif:X>…</exif:X>`). */
function readXmpProperty(xmp: string, name: string): string | undefined {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const attr = new RegExp(String.raw`[\s<]${escaped}\s*=\s*(?:"([^"]*)"|'([^']*)')`).exec(xmp);
  if (attr) return decodeXmlText(attr[1] ?? attr[2] ?? '');
  const elem = new RegExp(String.raw`<${escaped}(?:\s[^>]*)?>([\s\S]*?)</${escaped}>`).exec(xmp);
  if (elem) return decodeXmlText(elem[1] ?? '');
  return undefined;
}

const XMP_TEXT_PROPERTIES = ['dc:description', 'exif:UserComment', 'dc:title', 'photoshop:Headline', 'xmp:Label'];

/** Extrae la ubicación de un paquete XMP (exif:GPSLatitude/GPSLongitude o un par decimal en campos de texto). */
export function gpsFromXmp(xmp: string): GpsInfo | undefined {
  const latText = readXmpProperty(xmp, 'exif:GPSLatitude');
  const lonText = readXmpProperty(xmp, 'exif:GPSLongitude');

  if (latText !== undefined || lonText !== undefined) {
    // Caso "4.6097, -74.0817" metido entero en una sola propiedad.
    if (latText !== undefined && lonText === undefined) {
      const pair = findCoordinatePair(latText);
      if (pair) return buildGps('XMP', { ok: true, value: pair.latitude }, { ok: true, value: pair.longitude });
    }

    let altitude: number | undefined;
    const altText = readXmpProperty(xmp, 'exif:GPSAltitude');
    if (altText) {
      const frac = /^(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)$/.exec(altText);
      const parsed = frac ? (Number(frac[2]) === 0 ? undefined : Number(frac[1]) / Number(frac[2])) : Number(altText);
      if (parsed !== undefined && Number.isFinite(parsed)) {
        altitude = readXmpProperty(xmp, 'exif:GPSAltitudeRef')?.trim() === '1' ? -Math.abs(parsed) : parsed;
      }
    }

    return buildGps(
      'XMP',
      latText === undefined ? undefined : parseCoordinateText(latText, 'lat'),
      lonText === undefined ? undefined : parseCoordinateText(lonText, 'lon'),
      altitude,
    );
  }

  const texts = XMP_TEXT_PROPERTIES.map((p) => readXmpProperty(xmp, p)).filter((t): t is string => !!t);
  const fromText = gpsFromText(texts);
  return fromText ? { ...fromText, source: 'XMP' } : undefined;
}

/** Busca un par decimal "lat, lon" en campos de texto libres (descripción, comentario…). */
export function gpsFromText(texts: (string | undefined)[]): GpsInfo | undefined {
  for (const text of texts) {
    if (!text) continue;
    const pair = findCoordinatePair(text);
    if (pair) return buildGps('texto', { ok: true, value: pair.latitude }, { ok: true, value: pair.longitude });
  }
  return undefined;
}

function decodeUserComment(v: IfdValue | undefined, littleEndian: boolean): string | undefined {
  if (!Array.isArray(v) || v.length <= 8 || typeof v[0] !== 'number') return undefined;
  const raw = Uint8Array.from(v as number[]);
  const code = new TextDecoder('latin1').decode(raw.slice(0, 8)).replace(/\0/g, '').trim();
  const body = raw.slice(8);
  if (code === 'UNICODE') return new TextDecoder(littleEndian ? 'utf-16le' : 'utf-16be').decode(body).replace(/\0/g, '').trim();
  return new TextDecoder('utf-8').decode(body).replace(/\0/g, '').trim();
}

/** Parsea un bloque TIFF/EXIF crudo (sin el prefijo "Exif\0\0" de JPEG). */
export function parseTiff(bytes: Uint8Array, options: { xmp?: string | null } = {}): ExifData | null {
  if (bytes.length < 8) return null;

  const byteOrder = String.fromCharCode(bytes[0] ?? 0, bytes[1] ?? 0);
  if (byteOrder !== 'II' && byteOrder !== 'MM') return null;
  const littleEndian = byteOrder === 'II';

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const magic = view.getUint16(2, littleEndian);
  if (magic !== 42) return null;

  const ifd0Offset = view.getUint32(4, littleEndian);
  const { entries: ifd0 } = readIfd(view, bytes, 0, ifd0Offset, littleEndian);

  const result: ExifData = {};
  const asString = (v: IfdValue | undefined) => (typeof v === 'string' ? v.trim() : undefined);
  const asNumber = (v: IfdValue | undefined) => (typeof v === 'number' ? v : undefined);
  const asRational = (v: IfdValue | undefined): [number, number] | undefined =>
    Array.isArray(v) && v.length === 2 && typeof v[0] === 'number' ? (v as [number, number]) : undefined;

  result.make = asString(ifd0.get(0x010f)?.value);
  result.model = asString(ifd0.get(0x0110)?.value);
  result.orientation = asNumber(ifd0.get(0x0112)?.value);
  result.xResolution = rationalToNumber(asRational(ifd0.get(0x011a)?.value));
  result.yResolution = rationalToNumber(asRational(ifd0.get(0x011b)?.value));
  result.software = asString(ifd0.get(0x0131)?.value);
  result.dateTime = asString(ifd0.get(0x0132)?.value);
  result.artist = asString(ifd0.get(0x013b)?.value);
  result.copyright = asString(ifd0.get(0x8298)?.value);

  let userComment: string | undefined;
  const exifOffsetEntry = ifd0.get(0x8769);
  if (typeof exifOffsetEntry?.value === 'number') {
    const { entries: exifIfd } = readIfd(view, bytes, 0, exifOffsetEntry.value, littleEndian);
    result.exposureTime = asRational(exifIfd.get(0x829a)?.value);
    result.fNumber = asRational(exifIfd.get(0x829d)?.value);
    result.isoSpeed = asNumber(exifIfd.get(0x8827)?.value);
    result.dateTimeOriginal = asString(exifIfd.get(0x9003)?.value);
    result.dateTimeDigitized = asString(exifIfd.get(0x9004)?.value);
    result.focalLength = asRational(exifIfd.get(0x920a)?.value);
    result.lensModel = asString(exifIfd.get(0xa434)?.value);
    result.pixelWidth = asNumber(exifIfd.get(0xa002)?.value);
    result.pixelHeight = asNumber(exifIfd.get(0xa003)?.value);
    userComment = decodeUserComment(exifIfd.get(0x9286)?.value, littleEndian);
  }

  let exifGps: GpsInfo | undefined;
  const gpsOffsetEntry = ifd0.get(0x8825);
  if (typeof gpsOffsetEntry?.value === 'number') {
    try {
      exifGps = gpsFromIfd(readIfd(view, bytes, 0, gpsOffsetEntry.value, littleEndian).entries);
    } catch {
      exifGps = { status: 'no-legible', source: 'EXIF', detail: 'El bloque GPS del EXIF está dañado.' };
    }
  }

  // XMP embebido en el propio TIFF (tag XMLPacket 0x02BC) o recibido aparte (APP1 XMP en JPEG).
  const xmlPacket = ifd0.get(0x02bc)?.value;
  const tiffXmp = Array.isArray(xmlPacket) && typeof xmlPacket[0] === 'number'
    ? new TextDecoder('utf-8').decode(Uint8Array.from(xmlPacket as number[]))
    : typeof xmlPacket === 'string' ? xmlPacket : undefined;
  const xmpGps = [tiffXmp, options.xmp ?? undefined].map((x) => (x ? gpsFromXmp(x) : undefined));

  const textGps = gpsFromText([asString(ifd0.get(0x010e)?.value), userComment]);

  result.gps = combineGps([exifGps, ...xmpGps, textGps]);
  if (result.gps?.status === 'valida') {
    result.gpsLatitude = result.gps.latitude;
    result.gpsLongitude = result.gps.longitude;
    result.gpsAltitude = result.gps.altitude;
  }

  return result;
}

/** Recorre los segmentos de cabecera de un JPEG y devuelve el contenido del primer APP1 con esa firma. */
function findJpegApp1(bytes: Uint8Array, signature: string): Uint8Array | null {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;

  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1] ?? 0;

    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    if (marker === 0xd9 || marker === 0xda) break; // EOI o inicio de datos de escaneo

    const length = ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0);
    if (marker === 0xe1) {
      const segStart = offset + 4;
      const sig = new TextDecoder('latin1').decode(bytes.slice(segStart, segStart + signature.length));
      if (sig === signature) {
        return bytes.slice(segStart + signature.length, offset + 2 + length);
      }
    }
    offset += 2 + length;
  }
  return null;
}

/** Devuelve el paquete XMP (APP1 "http://ns.adobe.com/xap/1.0/") de un JPEG, si existe. */
export function extractJpegXmp(bytes: Uint8Array): string | null {
  const block = findJpegApp1(bytes, 'http://ns.adobe.com/xap/1.0/\0');
  return block ? new TextDecoder('utf-8').decode(block) : null;
}

/** Busca el segmento APP1 "Exif" dentro de un JPEG y devuelve su bloque TIFF. */
export function extractJpegExifBlock(bytes: Uint8Array): Uint8Array | null {
  return findJpegApp1(bytes, 'Exif\0\0');
}

export function getJpegDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) break;
    const marker = bytes[offset + 1] ?? 0;
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    if (marker === 0xda) break;
    const length = ((bytes[offset + 2] ?? 0) << 8) | (bytes[offset + 3] ?? 0);
    const isSofMarker = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSofMarker) {
      const height = ((bytes[offset + 5] ?? 0) << 8) | (bytes[offset + 6] ?? 0);
      const width = ((bytes[offset + 7] ?? 0) << 8) | (bytes[offset + 8] ?? 0);
      return { width, height };
    }
    offset += 2 + length;
  }
  return null;
}
