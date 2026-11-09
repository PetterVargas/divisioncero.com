import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { formatExposureTime, gpsSection } from './analyze';

describe('formatExposureTime', () => {
  it('menos de 1 s → "1/N s"', () => {
    assert.equal(formatExposureTime([1, 125]), '1/125 s');
    assert.equal(formatExposureTime([66137, 500000000]), '1/7560 s');
  });

  it('1 s o más → segundos', () => {
    assert.equal(formatExposureTime([1, 1]), '1 s');
    assert.equal(formatExposureTime([2, 1]), '2 s');
    assert.equal(formatExposureTime([30, 1]), '30 s');
    assert.equal(formatExposureTime([15, 10]), '1.5 s');
  });

  it('numerador o denominador 0 → sin valor', () => {
    assert.equal(formatExposureTime([0, 1]), undefined);
    assert.equal(formatExposureTime([1, 0]), undefined);
    assert.equal(formatExposureTime(undefined), undefined);
  });
});

describe('gpsSection', () => {
  it('ubicación válida → coordenadas y enlace de mapa', () => {
    const section = gpsSection({ status: 'valida', source: 'EXIF', latitude: 10.425, longitude: -75.5027777, altitude: -12 });
    assert.equal(section.title, 'Ubicación (GPS)');
    const values = Object.fromEntries(section.rows.map((r) => [r.label, r.value]));
    assert.equal(values['Latitud'], '10.425000');
    assert.equal(values['Longitud'], '-75.502778');
    assert.equal(values['Altitud'], '-12 m (bajo el nivel del mar)');
    assert.equal(values['Ver en mapa'], 'https://www.google.com/maps?q=10.425000,-75.502778');
    assert.equal(section.rows.find((r) => r.label === 'Ver en mapa')?.href, 'https://www.google.com/maps?q=10.425000,-75.502778');
  });

  it('0,0 → "Sin ubicación válida", sin coordenadas ni mapa', () => {
    const section = gpsSection({ status: 'sin-ubicacion', source: 'EXIF', detail: 'x' });
    assert.notEqual(section.title, 'Ubicación (GPS)');
    assert.equal(section.rows[0]!.value, 'Sin ubicación válida');
    assert.ok(section.rows.every((r) => !r.value.includes('0.000000') && !r.value.includes('maps')));
  });

  it('no legible y formato no reconocido', () => {
    assert.equal(gpsSection({ status: 'no-legible', source: 'EXIF' }).rows[0]!.value, 'No se pudo leer');
    assert.equal(gpsSection({ status: 'formato-no-reconocido', source: 'XMP' }).rows[0]!.value, 'Formato no reconocido');
  });
});
