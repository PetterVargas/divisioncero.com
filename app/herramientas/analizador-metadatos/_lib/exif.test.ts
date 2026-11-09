import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { extractJpegExifBlock, extractJpegXmp, parseTiff } from './exif';

// ---------------------------------------------------------------------------
// Constructor de TIFF/JPEG sintéticos
// ---------------------------------------------------------------------------

type Rational = [number, number];
interface Entry {
  tag: number;
  type: number; // 1 BYTE, 2 ASCII, 3 SHORT, 4 LONG, 5 RATIONAL, 7 UNDEFINED
  value: string | number[] | Rational[];
}

const ascii = (tag: number, value: string): Entry => ({ tag, type: 2, value });
const rationals = (tag: number, value: Rational[]): Entry => ({ tag, type: 5, value });
const byte = (tag: number, value: number): Entry => ({ tag, type: 1, value: [value] });
const undef = (tag: number, value: Uint8Array): Entry => ({ tag, type: 7, value: Array.from(value) });

function encode(e: Entry, le: boolean): { raw: Uint8Array; count: number } {
  if (e.type === 2) {
    const raw = new TextEncoder().encode(`${e.value as string}\0`);
    return { raw, count: raw.length };
  }
  if (e.type === 5) {
    const list = e.value as Rational[];
    const raw = new Uint8Array(list.length * 8);
    const view = new DataView(raw.buffer);
    list.forEach(([n, d], i) => {
      view.setUint32(i * 8, n, le);
      view.setUint32(i * 8 + 4, d, le);
    });
    return { raw, count: list.length };
  }
  if (e.type === 4) {
    const list = e.value as number[];
    const raw = new Uint8Array(list.length * 4);
    list.forEach((n, i) => new DataView(raw.buffer).setUint32(i * 4, n, le));
    return { raw, count: list.length };
  }
  const list = e.value as number[];
  return { raw: Uint8Array.from(list), count: list.length };
}

function ifdSize(entries: Entry[], le: boolean): number {
  let size = 2 + entries.length * 12 + 4;
  for (const e of entries) {
    const { raw } = encode(e, le);
    if (raw.length > 4) size += raw.length + (raw.length % 2);
  }
  return size;
}

function writeIfd(view: DataView, bytes: Uint8Array, offset: number, entries: Entry[], le: boolean): void {
  view.setUint16(offset, entries.length, le);
  let data = offset + 2 + entries.length * 12 + 4;
  entries.forEach((e, i) => {
    const p = offset + 2 + i * 12;
    const { raw, count } = encode(e, le);
    view.setUint16(p, e.tag, le);
    view.setUint16(p + 2, e.type, le);
    view.setUint32(p + 4, count, le);
    if (raw.length <= 4) {
      bytes.set(raw, p + 8);
    } else {
      view.setUint32(p + 8, data, le);
      bytes.set(raw, data);
      data += raw.length + (raw.length % 2);
    }
  });
  view.setUint32(offset + 2 + entries.length * 12, 0, le);
}

function buildTiff(opts: { ifd0?: Entry[]; exif?: Entry[]; gps?: Entry[]; le?: boolean }): Uint8Array {
  const le = opts.le ?? true;
  const ifd0 = [...(opts.ifd0 ?? [])];
  const exifPtr: Entry = { tag: 0x8769, type: 4, value: [0] };
  const gpsPtr: Entry = { tag: 0x8825, type: 4, value: [0] };
  if (opts.exif) ifd0.push(exifPtr);
  if (opts.gps) ifd0.push(gpsPtr);

  let cursor = 8 + ifdSize(ifd0, le);
  const exifOffset = cursor;
  if (opts.exif) {
    exifPtr.value = [exifOffset];
    cursor += ifdSize(opts.exif, le);
  }
  const gpsOffset = cursor;
  if (opts.gps) {
    gpsPtr.value = [gpsOffset];
    cursor += ifdSize(opts.gps, le);
  }

  const bytes = new Uint8Array(cursor);
  const view = new DataView(bytes.buffer);
  bytes[0] = bytes[1] = le ? 0x49 : 0x4d;
  view.setUint16(2, 42, le);
  view.setUint32(4, 8, le);
  writeIfd(view, bytes, 8, ifd0, le);
  if (opts.exif) writeIfd(view, bytes, exifOffset, opts.exif, le);
  if (opts.gps) writeIfd(view, bytes, gpsOffset, opts.gps, le);
  return bytes;
}

function app1(payload: Uint8Array): Uint8Array {
  const seg = new Uint8Array(4 + payload.length);
  seg[0] = 0xff;
  seg[1] = 0xe1;
  seg[2] = ((payload.length + 2) >> 8) & 0xff;
  seg[3] = (payload.length + 2) & 0xff;
  seg.set(payload, 4);
  return seg;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function buildJpeg(opts: { tiff?: Uint8Array; xmp?: string }): Uint8Array {
  const parts: Uint8Array[] = [Uint8Array.of(0xff, 0xd8)];
  if (opts.xmp) parts.push(app1(new TextEncoder().encode(`http://ns.adobe.com/xap/1.0/\0${opts.xmp}`)));
  if (opts.tiff) parts.push(app1(concat(new TextEncoder().encode('Exif\0\0'), opts.tiff)));
  parts.push(Uint8Array.of(0xff, 0xda, 0x00, 0x02, 0x00, 0xff, 0xd9));
  return concat(...parts);
}

const xmpPacket = (body: string) =>
  `<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">` +
  `<rdf:Description rdf:about="" xmlns:exif="http://ns.adobe.com/exif/1.0/" xmlns:dc="http://purl.org/dc/elements/1.1/" ${body}</rdf:Description>` +
  `</rdf:RDF></x:xmpmeta>`;

/** GPS IFD estándar: 10°25'30" N, 75°30'10" W. */
const STANDARD_GPS: Entry[] = [
  ascii(0x0001, 'N'),
  rationals(0x0002, [[10, 1], [25, 1], [30, 1]]),
  ascii(0x0003, 'W'),
  rationals(0x0004, [[75, 1], [30, 1], [10, 1]]),
];

const close = (actual: number | undefined, expected: number, eps = 1e-6) => {
  assert.ok(actual !== undefined, 'se esperaba un número');
  assert.ok(Math.abs(actual - expected) < eps, `${actual} ≉ ${expected}`);
};

// ---------------------------------------------------------------------------
// parseTiff
// ---------------------------------------------------------------------------

describe('parseTiff · EXIF GPS', () => {
  it('a) DMS estándar 10°25\'30" N, 75°30\'10" W → 10.425, -75.502777', () => {
    for (const le of [true, false]) {
      const exif = parseTiff(buildTiff({ gps: STANDARD_GPS, le }))!;
      assert.equal(exif.gps?.status, 'valida');
      assert.equal(exif.gps?.source, 'EXIF');
      close(exif.gpsLatitude, 10.425);
      close(exif.gpsLongitude, -75.502777);
      assert.equal(exif.gpsLongitude!.toFixed(6), '-75.502778');
    }
  });

  it('a) tolera referencias en minúscula y con espacios', () => {
    const exif = parseTiff(
      buildTiff({
        gps: [
          ascii(0x0001, ' s '),
          rationals(0x0002, [[33, 1], [52, 1], [4, 1]]),
          ascii(0x0003, 'e '),
          rationals(0x0004, [[151, 1], [12, 1], [36, 1]]),
        ],
      }),
    )!;
    assert.equal(exif.gps?.status, 'valida');
    close(exif.gpsLatitude, -(33 + 52 / 60 + 4 / 3600));
    close(exif.gpsLongitude, 151 + 12 / 60 + 36 / 3600);
  });

  it('b) solo grados y minutos (dos componentes)', () => {
    const exif = parseTiff(
      buildTiff({
        gps: [
          ascii(0x0001, 'N'),
          rationals(0x0002, [[10, 1], [255, 10]]),
          ascii(0x0003, 'W'),
          rationals(0x0004, [[75, 1], [3050, 100]]),
        ],
      }),
    )!;
    assert.equal(exif.gps?.status, 'valida');
    close(exif.gpsLatitude, 10.425);
    close(exif.gpsLongitude, -75.508333);
  });

  it('c) denominador 0 en un componente → no se pudo leer (no se asume 0)', () => {
    const exif = parseTiff(
      buildTiff({
        gps: [
          ascii(0x0001, 'N'),
          rationals(0x0002, [[10, 1], [25, 1], [30, 0]]),
          ascii(0x0003, 'W'),
          rationals(0x0004, [[75, 1], [30, 1], [10, 1]]),
        ],
      }),
    )!;
    assert.equal(exif.gps?.status, 'no-legible');
    assert.match(exif.gps!.detail!, /segundos/);
    assert.equal(exif.gpsLatitude, undefined);
    assert.equal(exif.gpsLongitude, undefined);
  });

  it('c) ubicación borrada (todo 0/0, como hace Android al compartir) → no se pudo leer', () => {
    const exif = parseTiff(
      buildTiff({
        gps: [
          ascii(0x0001, ''),
          rationals(0x0002, [[0, 0], [0, 0], [0, 0]]),
          ascii(0x0003, ''),
          rationals(0x0004, [[0, 0], [0, 0], [0, 0]]),
        ],
      }),
    )!;
    assert.equal(exif.gps?.status, 'no-legible');
    assert.equal(exif.gpsLatitude, undefined);
  });

  it('f) altitud: GPSAltitudeRef = 1 es bajo el nivel del mar', () => {
    const below = parseTiff(buildTiff({ gps: [...STANDARD_GPS, byte(0x0005, 1), rationals(0x0006, [[425, 10]])] }))!;
    close(below.gpsAltitude, -42.5);
    const above = parseTiff(buildTiff({ gps: [...STANDARD_GPS, byte(0x0005, 0), rationals(0x0006, [[2600, 1]])] }))!;
    close(above.gpsAltitude, 2600);
    const noRef = parseTiff(buildTiff({ gps: [...STANDARD_GPS, rationals(0x0006, [[15, 1]])] }))!;
    close(noRef.gpsAltitude, 15);
    const zeroDen = parseTiff(buildTiff({ gps: [...STANDARD_GPS, rationals(0x0006, [[15, 0]])] }))!;
    assert.equal(zeroDen.gpsAltitude, undefined);
  });
});

describe('parseTiff · XMP y texto', () => {
  it('d) XMP "41,58.2N" (grados y minutos decimales con referencia)', () => {
    const xmp = xmpPacket(`exif:GPSLatitude="41,58.2N" exif:GPSLongitude="87,37.5W">`);
    const exif = parseTiff(buildTiff({ ifd0: [undef(0x02bc, new TextEncoder().encode(xmp))] }))!;
    assert.equal(exif.gps?.status, 'valida');
    assert.equal(exif.gps?.source, 'XMP');
    close(exif.gpsLatitude, 41.97);
    close(exif.gpsLongitude, -87.625);
  });

  it('d) XMP "DDD,MM,SSk" como elementos y altitud bajo el nivel del mar', () => {
    const xmp = xmpPacket(
      `><exif:GPSLatitude>10,25,30n</exif:GPSLatitude><exif:GPSLongitude> 75,30,10 w </exif:GPSLongitude>` +
        `<exif:GPSAltitude>425/10</exif:GPSAltitude><exif:GPSAltitudeRef>1</exif:GPSAltitudeRef>`,
    );
    const exif = parseTiff(buildTiff({ ifd0: [undef(0x02bc, new TextEncoder().encode(xmp))] }))!;
    close(exif.gpsLatitude, 10.425);
    close(exif.gpsLongitude, -75.502777);
    close(exif.gpsAltitude, -42.5);
  });

  it('d) XMP en decimal con y sin referencia', () => {
    for (const [lat, lon] of [
      ['4.6097', '-74.0817'],
      ['4.6097N', '74.0817W'],
      ['4.6097 n', '74.0817 w'],
    ]) {
      const xmp = xmpPacket(`exif:GPSLatitude="${lat}" exif:GPSLongitude="${lon}">`);
      const exif = parseTiff(buildTiff({}), { xmp })!;
      assert.equal(exif.gps?.status, 'valida', `${lat}, ${lon}`);
      close(exif.gpsLatitude, 4.6097);
      close(exif.gpsLongitude, -74.0817);
    }
  });

  it('e) par decimal "4.6097, -74.0817" en XMP (dc:description)', () => {
    const xmp = xmpPacket(`><dc:description><rdf:Alt><rdf:li xml:lang="x-default">Bogotá 4.6097, -74.0817</rdf:li></rdf:Alt></dc:description>`);
    const exif = parseTiff(buildTiff({}), { xmp })!;
    assert.equal(exif.gps?.status, 'valida');
    assert.equal(exif.gps?.source, 'XMP');
    close(exif.gpsLatitude, 4.6097);
    close(exif.gpsLongitude, -74.0817);
  });

  it('e) par decimal en ImageDescription y en UserComment', () => {
    const fromDescription = parseTiff(buildTiff({ ifd0: [ascii(0x010e, 'Ubicación: 4.6097, -74.0817')] }))!;
    assert.equal(fromDescription.gps?.source, 'texto');
    close(fromDescription.gpsLatitude, 4.6097);
    close(fromDescription.gpsLongitude, -74.0817);

    const comment = concat(new TextEncoder().encode('ASCII\0\0\0'), new TextEncoder().encode('-33.8688,151.2093'));
    const fromComment = parseTiff(buildTiff({ exif: [undef(0x9286, comment)] }))!;
    close(fromComment.gpsLatitude, -33.8688);
    close(fromComment.gpsLongitude, 151.2093);
  });

  it('EXIF con 0,0 pero XMP válido → se usa el XMP', () => {
    const zero: Entry[] = [
      ascii(0x0001, 'N'),
      rationals(0x0002, [[0, 1], [0, 1], [0, 1]]),
      ascii(0x0003, 'E'),
      rationals(0x0004, [[0, 1], [0, 1], [0, 1]]),
    ];
    const xmp = xmpPacket(`exif:GPSLatitude="41,58.2N" exif:GPSLongitude="87,37.5W">`);
    const exif = parseTiff(buildTiff({ gps: zero }), { xmp })!;
    assert.equal(exif.gps?.source, 'XMP');
    close(exif.gpsLatitude, 41.97);
  });
});

describe('parseTiff · validación', () => {
  it('0,0 exacto → sin ubicación válida', () => {
    const exif = parseTiff(
      buildTiff({
        gps: [
          ascii(0x0001, 'N'),
          rationals(0x0002, [[0, 1], [0, 1], [0, 1]]),
          ascii(0x0003, 'E'),
          rationals(0x0004, [[0, 1], [0, 1], [0, 1]]),
        ],
      }),
    )!;
    assert.equal(exif.gps?.status, 'sin-ubicacion');
    assert.equal(exif.gpsLatitude, undefined);
    assert.equal(exif.gpsLongitude, undefined);
  });

  it('latitud fuera de [-90, 90] → formato no reconocido', () => {
    const exif = parseTiff(
      buildTiff({
        gps: [
          ascii(0x0001, 'N'),
          rationals(0x0002, [[95, 1], [0, 1], [0, 1]]),
          ascii(0x0003, 'W'),
          rationals(0x0004, [[75, 1], [30, 1], [10, 1]]),
        ],
      }),
    )!;
    assert.equal(exif.gps?.status, 'formato-no-reconocido');
    assert.equal(exif.gpsLatitude, undefined);
  });

  it('longitud fuera de [-180, 180] en XMP → formato no reconocido', () => {
    const xmp = xmpPacket(`exif:GPSLatitude="4.6097" exif:GPSLongitude="200.5">`);
    const exif = parseTiff(buildTiff({}), { xmp })!;
    assert.equal(exif.gps?.status, 'formato-no-reconocido');
    assert.equal(exif.gpsLongitude, undefined);
  });

  it('texto irreconocible o referencia del eje equivocado → formato no reconocido', () => {
    const garbage = parseTiff(buildTiff({}), { xmp: xmpPacket(`exif:GPSLatitude="abc" exif:GPSLongitude="74.08W">`) })!;
    assert.equal(garbage.gps?.status, 'formato-no-reconocido');
    const wrongRef = parseTiff(buildTiff({}), { xmp: xmpPacket(`exif:GPSLatitude="4.6E" exif:GPSLongitude="74.08W">`) })!;
    assert.equal(wrongRef.gps?.status, 'formato-no-reconocido');
  });

  it('solo latitud → no se pudo leer', () => {
    const exif = parseTiff(buildTiff({ gps: [ascii(0x0001, 'N'), rationals(0x0002, [[10, 1], [25, 1], [30, 1]])] }))!;
    assert.equal(exif.gps?.status, 'no-legible');
    assert.equal(exif.gpsLatitude, undefined);
  });

  it('sin datos de ubicación → gps undefined', () => {
    const exif = parseTiff(buildTiff({ ifd0: [ascii(0x010f, 'Canon')] }))!;
    assert.equal(exif.make, 'Canon');
    assert.equal(exif.gps, undefined);
  });

  it('cabecera inválida → null', () => {
    assert.equal(parseTiff(Uint8Array.of(0x00, 0x01, 0x02)), null);
    assert.equal(parseTiff(new TextEncoder().encode('XX*\0\0\0\0\x08')), null);
  });
});

// ---------------------------------------------------------------------------
// extractJpegExifBlock / extractJpegXmp
// ---------------------------------------------------------------------------

describe('extractJpegExifBlock', () => {
  it('devuelve el bloque TIFF intacto y se parsea la ubicación', () => {
    const tiff = buildTiff({ gps: STANDARD_GPS });
    const block = extractJpegExifBlock(buildJpeg({ tiff }))!;
    assert.deepEqual(block, tiff);
    const exif = parseTiff(block)!;
    close(exif.gpsLatitude, 10.425);
    close(exif.gpsLongitude, -75.502777);
  });

  it('salta un APP1 XMP previo y encuentra el EXIF; el XMP también se extrae', () => {
    const tiff = buildTiff({ gps: STANDARD_GPS });
    const xmp = xmpPacket(`exif:GPSLatitude="41,58.2N" exif:GPSLongitude="87,37.5W">`);
    const jpeg = buildJpeg({ tiff, xmp });
    assert.deepEqual(extractJpegExifBlock(jpeg), tiff);
    assert.equal(extractJpegXmp(jpeg), xmp);
    // El EXIF válido tiene prioridad sobre el XMP.
    close(parseTiff(extractJpegExifBlock(jpeg)!, { xmp })!.gpsLatitude, 10.425);
  });

  it('cada formato de coordenadas sobrevive al envoltorio JPEG', () => {
    const cases: { gps: Entry[]; lat: number; lon: number }[] = [
      { gps: STANDARD_GPS, lat: 10.425, lon: -75.502777 },
      {
        gps: [ascii(0x0001, ' n'), rationals(0x0002, [[10, 1], [255, 10]]), ascii(0x0003, 'w'), rationals(0x0004, [[75, 1], [3050, 100]])],
        lat: 10.425,
        lon: -75.508333,
      },
    ];
    for (const c of cases) {
      for (const le of [true, false]) {
        const exif = parseTiff(extractJpegExifBlock(buildJpeg({ tiff: buildTiff({ gps: c.gps, le }) }))!)!;
        close(exif.gpsLatitude, c.lat);
        close(exif.gpsLongitude, c.lon);
      }
    }
  });

  it('casos de error en JPEG: denominador 0 y 0,0 no producen coordenadas', () => {
    const zeroDen = buildTiff({
      gps: [ascii(0x0001, 'N'), rationals(0x0002, [[10, 0], [25, 1], [30, 1]]), ascii(0x0003, 'W'), rationals(0x0004, [[75, 1], [30, 1], [10, 1]])],
    });
    const exifZeroDen = parseTiff(extractJpegExifBlock(buildJpeg({ tiff: zeroDen }))!)!;
    assert.equal(exifZeroDen.gps?.status, 'no-legible');
    assert.equal(exifZeroDen.gpsLatitude, undefined);
  });

  it('sin EXIF o sin firma JPEG → null', () => {
    assert.equal(extractJpegExifBlock(buildJpeg({})), null);
    assert.equal(extractJpegExifBlock(Uint8Array.of(0x89, 0x50, 0x4e, 0x47)), null);
    assert.equal(extractJpegXmp(buildJpeg({ tiff: buildTiff({}) })), null);
  });
});
