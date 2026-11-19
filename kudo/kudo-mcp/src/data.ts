import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Carpeta `data/` empaquetada con el servidor (catálogo, OSCAL, SGX, agentes y skills). */
export const DATA_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data');

export interface Requisito {
  id: string;
  label: string;
  texto: string;
}

export interface Control {
  id: string;
  titulo: string;
  dominio: string;
  enunciado: string;
  requisitos: Requisito[];
  url: string;
}

export interface Dominio {
  id: string;
  sigla: string;
  titulo: string;
  descripcion: string;
  controles: string[];
  url: string;
}

export interface Documento {
  slug: string;
  titulo: string;
  descripcion: string;
  codigo: string;
  tipo: string;
  dominio: string;
  propietario: string;
  version: string;
  revision: string;
  controles: string[];
  archivo: string;
  origen: 'proyecto' | 'kudo';
}

export interface Skill {
  nombre: string;
  descripcion: string;
  contenido: string;
  archivo: string;
}

export interface Agente {
  nombre: string;
  descripcion: string;
  skills: string[];
  contenido: string;
}

export interface KudoData {
  dominios: Dominio[];
  controles: Map<string, Control>;
  documentos: Documento[];
  oscal: Map<string, string>;
  skills: Map<string, Skill>;
  agentes: Map<string, Agente>;
  proyecto: string;
  carpetaDocumentos: string | null;
}

/**
 * Rutas donde un proyecto Kudo guarda sus políticas y procedimientos, en orden
 * de prioridad: proyecto creado con create-kudo-app, sitio de DivisionCero y
 * estructura antigua del CLI.
 */
const CARPETAS_SGX = [
  'content/sgx/politicas-y-procedimientos',
  'content/kudo/sgx/politicas-y-procedimientos',
  'content/sgsi/politicas',
];

/** Frontmatter plano: `clave: valor` y listas en línea `[a, b]`. */
export function parseFrontmatter(source: string): { data: Record<string, string | string[]>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: source };
  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_-]+):\s*(.*)$/);
    if (!kv) continue;
    const value = kv[2].trim();
    data[kv[1]] =
      value.startsWith('[') && value.endsWith(']')
        ? value.slice(1, -1).split(',').map((v) => v.trim().replace(/^["']|["']$/g, '')).filter(Boolean)
        : value.replace(/^["']|["']$/g, '');
  }
  return { data, body: source.slice(match[0].length) };
}

/** Quita sintaxis MDX (imports, comentarios y componentes) para entregar Markdown legible. */
export function mdxATexto(body: string): string {
  return body
    .replace(/^import .*$/gm, '')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/<([A-Z][A-Za-z]*)[^>]*\/>/g, '')
    .replace(/<\/?[A-Z][A-Za-z]*[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function leerCatalogo(): { dominios: Dominio[]; controles: Map<string, Control> } {
  const catalog = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'oscal', 'kudo-catalog.json'), 'utf8')).catalog;
  const dominios: Dominio[] = [];
  const controles = new Map<string, Control>();
  for (const g of catalog.groups) {
    const overview = (g.parts ?? []).find((p: { name: string }) => p.name === 'overview');
    const ids: string[] = [];
    for (const c of g.controls ?? []) {
      const statement = (c.parts ?? []).find((p: { name: string }) => p.name === 'statement');
      controles.set(c.id, {
        id: c.id,
        titulo: c.title,
        dominio: g.id,
        enunciado: statement?.prose ?? '',
        requisitos: (statement?.parts ?? []).map((p: { id: string; prose: string; props?: { name: string; value: string }[] }) => ({
          id: p.id,
          label: p.props?.find((x) => x.name === 'label')?.value ?? '',
          texto: p.prose,
        })),
        url: `https://divisioncero.com/kudo/framework/${g.id}/${c.id}`,
      });
      ids.push(c.id);
    }
    dominios.push({
      id: g.id,
      sigla: g.id.toUpperCase(),
      titulo: g.title,
      descripcion: overview?.prose ?? '',
      controles: ids,
      url: `https://divisioncero.com/kudo/framework/${g.id}`,
    });
  }
  return { dominios, controles };
}

function leerDocumentos(carpeta: string, origen: Documento['origen']): Documento[] {
  return fs
    .readdirSync(carpeta)
    .filter((f) => /\.mdx?$/.test(f) && !/^index\.mdx?$/.test(f))
    .map((f) => {
      const archivo = path.join(carpeta, f);
      const { data } = parseFrontmatter(fs.readFileSync(archivo, 'utf8'));
      const texto = (k: string, def = '') => (typeof data[k] === 'string' ? (data[k] as string) : def);
      return {
        slug: f.replace(/\.mdx?$/, ''),
        titulo: texto('title', f),
        descripcion: texto('description'),
        codigo: texto('codigo'),
        tipo: texto('tipo', 'documento'),
        dominio: texto('dominio'),
        propietario: texto('propietario'),
        version: texto('version'),
        revision: texto('revision'),
        controles: Array.isArray(data.controles) ? data.controles : [],
        archivo,
        origen,
      };
    })
    .sort((a, b) => (a.codigo || a.slug).localeCompare(b.codigo || b.slug));
}

function leerSkills(): Map<string, Skill> {
  const dir = path.join(DATA_DIR, 'skills');
  const skills = new Map<string, Skill>();
  if (!fs.existsSync(dir)) return skills;
  for (const nombre of fs.readdirSync(dir)) {
    const archivo = path.join(dir, nombre, 'SKILL.md');
    if (!fs.existsSync(archivo)) continue;
    const contenido = fs.readFileSync(archivo, 'utf8');
    const { data } = parseFrontmatter(contenido);
    skills.set(String(data.name ?? nombre), {
      nombre: String(data.name ?? nombre),
      descripcion: String(data.description ?? ''),
      contenido,
      archivo,
    });
  }
  return skills;
}

function leerAgentes(): Map<string, Agente> {
  const dir = path.join(DATA_DIR, 'agents');
  const agentes = new Map<string, Agente>();
  if (!fs.existsSync(dir)) return agentes;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const contenido = fs.readFileSync(path.join(dir, f), 'utf8');
    const { data, body } = parseFrontmatter(contenido);
    const nombre = String(data.name ?? f.replace(/\.md$/, ''));
    agentes.set(nombre, {
      nombre,
      descripcion: String(data.description ?? ''),
      skills: Array.isArray(data.skills) ? data.skills : [],
      contenido: body.trim(),
    });
  }
  return agentes;
}

function leerOscal(): Map<string, string> {
  const dir = path.join(DATA_DIR, 'oscal');
  const modelos = new Map<string, string>();
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    modelos.set(f.replace(/^kudo-/, '').replace(/\.json$/, ''), path.join(dir, f));
  }
  return modelos;
}

/**
 * Carga los datos de Kudo. Los documentos se leen del proyecto local (para que
 * el asistente trabaje con las políticas adaptadas por la organización); si el
 * proyecto no tiene documentos, se usan los de referencia empaquetados.
 */
export function cargarDatos(proyecto: string): KudoData {
  const { dominios, controles } = leerCatalogo();
  const carpetaProyecto = CARPETAS_SGX.map((c) => path.join(proyecto, c)).find((c) => fs.existsSync(c)) ?? null;
  const documentos = carpetaProyecto
    ? leerDocumentos(carpetaProyecto, 'proyecto')
    : leerDocumentos(path.join(DATA_DIR, 'sgx'), 'kudo');

  return {
    dominios,
    controles,
    documentos,
    oscal: leerOscal(),
    skills: leerSkills(),
    agentes: leerAgentes(),
    proyecto,
    carpetaDocumentos: carpetaProyecto,
  };
}
