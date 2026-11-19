/**
 * Regenera las páginas resumen de correlación ("<estándar> con SGSI") a partir
 * de sus tablas control por control ("... estructura de controles ..."), que
 * son la fuente de verdad. Agrupa los controles del estándar por dominio Kudo
 * (el del documento SGX asociado) y por documento, compactando los códigos
 * consecutivos en rangos.
 *
 *   pnpm kudo:correlacion            # reescribe las páginas resumen
 *   pnpm kudo:correlacion --check    # falla si alguna está desactualizada
 */
import fs from 'node:fs';
import path from 'node:path';
import { leerDocumentos } from './sync-sgx-documentos';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'content/kudo/sgx/correlacion');
const INDICE_SGX = path.join(ROOT, 'content/kudo/sgx/politicas-y-procedimientos/index.mdx');

const DOMINIOS: [string, string][] = [
  ['cor', 'COR — Coherencia Organizacional'],
  ['cip', 'CIP — Ciberseguridad en Identidad y Puntos Finales'],
  ['cif', 'CIF — Ciberseguridad en Infraestructura'],
  ['cap', 'CAP — Ciberseguridad en Aplicaciones'],
  ['ccn', 'CCN — Continuidad y Cambios del Negocio'],
  ['thp', 'THP — Talento Humano y Proveedores'],
  ['dia', 'DIA — Datos e Inteligencia Artificial'],
  ['adr', 'ADR — Análisis, Detección y Respuesta'],
];

/** Títulos con emoji de las tarjetas del índice del SGX (por slug). */
function titulosConEmoji(): Map<string, string> {
  const texto = fs.readFileSync(INDICE_SGX, 'utf8');
  const map = new Map<string, string>();
  for (const m of texto.matchAll(/href="\/kudo\/sgx\/politicas-y-procedimientos\/([a-z0-9-]+)"\s*\n\s*title="([^"]+)"/g)) {
    map.set(m[1], m[2]);
  }
  return map;
}

/** Compacta "A.5.1, A.5.2, A.5.3" en "A.5.1–A.5.3" (tres o más consecutivos). */
export function compactar(codigos: string[]): string {
  const partes = codigos.map((c) => {
    const m = c.match(/^(.*?)(\d+)$/);
    return m ? { c, prefijo: m[1], n: Number(m[2]) } : { c, prefijo: c, n: Number.NaN };
  });
  const salida: string[] = [];
  for (let i = 0; i < partes.length; ) {
    let j = i;
    while (
      j + 1 < partes.length &&
      partes[j + 1].prefijo === partes[i].prefijo &&
      !Number.isNaN(partes[j].n) &&
      partes[j + 1].n === partes[j].n + 1
    ) {
      j++;
    }
    if (j - i >= 2) salida.push(`${partes[i].c}–${partes[j].c}`);
    else for (let k = i; k <= j; k++) salida.push(partes[k].c);
    i = j + 1;
  }
  return salida.join(', ');
}

function main() {
  const check = process.argv.includes('--check');
  const docs = new Map(leerDocumentos().map((d) => [d.slug, d]));
  const emojis = titulosConEmoji();
  const desactualizadas: string[] = [];

  for (const carpeta of fs.readdirSync(DIR, { withFileTypes: true }).filter((e) => e.isDirectory())) {
    const archivos = fs.readdirSync(path.join(DIR, carpeta.name));
    const tabla = archivos.find((f) => f.includes('estructura-de-controles'));
    const resumen = archivos.find((f) => f.endsWith('-con-sgsi.mdx') && !f.includes('estructura'));
    if (!tabla || !resumen) continue;

    // Código del estándar → documento SGX, en el orden de la tabla.
    const filas: { codigo: string; slug: string }[] = [];
    for (const linea of fs.readFileSync(path.join(DIR, carpeta.name, tabla), 'utf8').split('\n')) {
      const m = linea.match(/^\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\(\/kudo\/sgx\/politicas-y-procedimientos\/([a-z0-9-]+)\)/);
      if (m) filas.push({ codigo: m[1], slug: m[2] });
    }

    const secciones = DOMINIOS.map(([id, titulo]) => {
      const porDoc = new Map<string, string[]>();
      for (const f of filas) {
        const doc = docs.get(f.slug);
        if (!doc) throw new Error(`${carpeta.name}: el documento "${f.slug}" no existe`);
        if (doc.dominio !== id) continue;
        porDoc.set(f.slug, [...(porDoc.get(f.slug) ?? []), f.codigo]);
      }
      if (!porDoc.size) return '';
      const cards = [...porDoc.entries()].map(([slug, codigos]) => {
        const doc = docs.get(slug)!;
        return [
          `  <Card href="/kudo/sgx/politicas-y-procedimientos/${slug}" title="${emojis.get(slug) ?? doc.title}">`,
          `    ${compactar(codigos)} — ${doc.description}.`,
          '  </Card>',
        ].join('\n');
      });
      return `### ${titulo}\n\n<Cards>\n${cards.join('\n')}\n</Cards>`;
    }).filter(Boolean);

    const archivo = path.join(DIR, carpeta.name, resumen);
    const original = fs.readFileSync(archivo, 'utf8');
    // Se conservan el frontmatter y el párrafo introductorio; el resto se regenera.
    const corte = original.indexOf('\n### ');
    const cabecera = (corte === -1 ? original : original.slice(0, corte)).replace(/\s*$/, '');
    const actualizado = `${cabecera}\n\n${secciones.join('\n\n')}\n`.replace(/\.\.\n/g, '.\n');

    if (actualizado !== original) {
      desactualizadas.push(resumen);
      if (!check) fs.writeFileSync(archivo, actualizado);
    }
  }

  if (check && desactualizadas.length) {
    console.error(`Resúmenes de correlación desactualizados (ejecuta pnpm kudo:correlacion):\n- ${desactualizadas.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`Correlación: ${desactualizadas.length} páginas resumen actualizadas.`);
}

main();
