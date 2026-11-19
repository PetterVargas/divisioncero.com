/**
 * Sincroniza los bloques generados de los documentos del SGX
 * (content/kudo/sgx/politicas-y-procedimientos) a partir de su frontmatter:
 *
 *   - "Control del documento": tabla con código, tipo, dominio, versión,
 *     propietario y frecuencia de revisión.
 *   - "Controles Kudo relacionados": enlaces a los controles del framework
 *     declarados en `controles`, con el título que tienen en el catálogo OSCAL.
 *
 * Los bloques quedan entre comentarios MDX `{/* kudo:... *\/}` para poder
 * regenerarlos sin tocar el resto del contenido. Uso:
 *
 *   pnpm kudo:sgx            # reescribe los bloques
 *   pnpm kudo:sgx --check    # falla si algún documento está desactualizado
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, 'content/kudo/sgx/politicas-y-procedimientos');
const CATALOG = path.join(ROOT, 'content/kudo/framework/oscal/kudo/rev1/json/kudo-catalog.json');

const TIPOS: Record<string, string> = {
  politica: 'Política',
  procedimiento: 'Procedimiento',
  plan: 'Plan',
  formato: 'Formato',
  plantilla: 'Plantilla',
  clausulas: 'Cláusulas',
  terminos: 'Términos y condiciones',
};

export interface SgxDocumento {
  slug: string;
  title: string;
  description: string;
  codigo: string;
  tipo: string;
  dominio: string;
  propietario: string;
  version: string;
  revision: string;
  controles: string[];
}

/** Frontmatter plano (clave: valor y listas en línea `[a, b]`). */
export function parseFrontmatter(source: string): Record<string, string | string[]> {
  const match = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) return {};
  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, raw] = kv;
    const value = raw.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map((v) => v.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  return data;
}

export function leerDocumentos(dir = DOCS_DIR): SgxDocumento[] {
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') && f !== 'index.mdx')
    .map((file) => {
      const fm = parseFrontmatter(fs.readFileSync(path.join(dir, file), 'utf8'));
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: String(fm.title ?? ''),
        description: String(fm.description ?? ''),
        codigo: String(fm.codigo ?? ''),
        tipo: String(fm.tipo ?? ''),
        dominio: String(fm.dominio ?? ''),
        propietario: String(fm.propietario ?? ''),
        version: String(fm.version ?? '1.0'),
        revision: String(fm.revision ?? 'Anual'),
        controles: Array.isArray(fm.controles) ? fm.controles : [],
      };
    })
    .filter((d) => d.codigo)
    .sort((a, b) => a.codigo.localeCompare(b.codigo));
}

function titulosDeControles(): Map<string, string> {
  const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8')).catalog;
  const map = new Map<string, string>();
  for (const group of catalog.groups) {
    for (const control of group.controls ?? []) map.set(control.id, control.title);
  }
  return map;
}

function bloque(nombre: string, contenido: string) {
  return `{/* kudo:${nombre} — generado por scripts/kudo/sync-sgx-documentos.ts */}\n${contenido}\n{/* /kudo:${nombre} */}`;
}

function reemplazarBloque(source: string, nombre: string, nuevo: string, posicion: 'inicio' | 'fin') {
  const re = new RegExp(`\\{/\\* kudo:${nombre}[\\s\\S]*?\\{/\\* /kudo:${nombre} \\*/\\}\\n?`);
  if (re.test(source)) return source.replace(re, `${nuevo}\n`);
  if (posicion === 'inicio') {
    const fm = source.match(/^---\n[\s\S]*?\n---\n/);
    const corte = fm ? fm[0].length : 0;
    return `${source.slice(0, corte)}\n${nuevo}\n${source.slice(corte)}`;
  }
  return `${source.replace(/\s*$/, '')}\n\n${nuevo}\n`;
}

function main() {
  const check = process.argv.includes('--check');
  const titulos = titulosDeControles();
  const documentos = leerDocumentos();
  const desactualizados: string[] = [];

  for (const doc of documentos) {
    for (const id of doc.controles) {
      if (!titulos.has(id)) throw new Error(`${doc.slug}: el control "${id}" no existe en el catálogo`);
    }

    const tabla = [
      '| Código | Tipo | Dominio | Versión | Propietario | Revisión |',
      '| ------ | ---- | ------- | ------- | ----------- | -------- |',
      `| ${doc.codigo} | ${TIPOS[doc.tipo] ?? doc.tipo} | ${doc.dominio.toUpperCase()} | ${doc.version} | ${doc.propietario} | ${doc.revision} |`,
    ].join('\n');

    const controles = [
      '## Controles Kudo relacionados',
      '',
      ...doc.controles.map((id) => {
        const [dominio] = id.split('-');
        return `- [${id.toUpperCase()} · ${titulos.get(id)}](/kudo/framework/${dominio}/${id})`;
      }),
    ].join('\n');

    const file = path.join(DOCS_DIR, `${doc.slug}.mdx`);
    const original = fs.readFileSync(file, 'utf8');
    let actualizado = reemplazarBloque(original, 'control-documento', bloque('control-documento', tabla), 'inicio');
    actualizado = reemplazarBloque(actualizado, 'controles', bloque('controles', controles), 'fin');

    if (actualizado !== original) {
      desactualizados.push(doc.slug);
      if (!check) fs.writeFileSync(file, actualizado);
    }
  }

  if (check && desactualizados.length) {
    console.error(`Documentos SGX desactualizados (ejecuta pnpm kudo:sgx):\n- ${desactualizados.join('\n- ')}`);
    process.exit(1);
  }
  console.log(`SGX: ${documentos.length} documentos, ${desactualizados.length} actualizados.`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
