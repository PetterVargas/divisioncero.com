import crypto from 'node:crypto';
import fs from 'node:fs';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { mdxATexto, parseFrontmatter, type Control, type KudoData } from './data.js';

export const VERSION = '0.1.0';

const texto = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });
const json = (data: unknown) => texto(JSON.stringify(data, null, 2));
const error = (t: string) => ({ ...texto(t), isError: true });

/** Normaliza para búsquedas sin tildes ni mayúsculas. */
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Plazo de remediación por severidad (Procedimiento de Acciones Correctivas de Kudo). */
const PLAZOS: Record<string, number> = { critica: 30, alta: 60, media: 90, baja: 180 };

export function crearServidor(datos: KudoData): McpServer {
  const server = new McpServer(
    { name: 'kudo', title: 'Kudo – Framework de Ciberseguridad', version: VERSION },
    {
      instructions: [
        'Servidor MCP de Kudo (https://divisioncero.com/kudo), framework de ciberseguridad por y para LatAm.',
        'Usa kudo_buscar para encontrar controles y documentos, kudo_obtener_control para el detalle de un control',
        '(ids como "cip-2") y kudo_obtener_documento para leer una política del proyecto.',
        'Los agentes de ciberseguridad están disponibles como prompts (agente-*) o con kudo_obtener_agente.',
        `Documentos: ${datos.carpetaDocumentos ? `proyecto local (${datos.carpetaDocumentos})` : 'referencia de Kudo empaquetada'}.`,
      ].join(' '),
    },
  );

  const docsDeControl = (id: string) => datos.documentos.filter((d) => d.controles.includes(id));
  const resumenControl = (c: Control) => ({ id: c.id, sigla: c.id.toUpperCase(), titulo: c.titulo, dominio: c.dominio, url: c.url });
  const lectura = { readOnlyHint: true, openWorldHint: false } as const;

  // ── Herramientas ──────────────────────────────────────────────────────────

  server.registerTool(
    'kudo_listar_dominios',
    {
      title: 'Listar dominios de Kudo',
      description: 'Lista los 8 dominios de Kudo con sus controles.',
      annotations: lectura,
    },
    async () =>
      json(
        datos.dominios.map((d) => ({
          id: d.id,
          sigla: d.sigla,
          titulo: d.titulo,
          descripcion: d.descripcion,
          url: d.url,
          controles: d.controles.map((id) => resumenControl(datos.controles.get(id)!)),
        })),
      ),
  );

  server.registerTool(
    'kudo_obtener_control',
    {
      title: 'Obtener control Kudo',
      description:
        'Devuelve el enunciado, los requisitos y los documentos SGX relacionados de un control Kudo (por ejemplo "adr-2" o "CIP-2").',
      inputSchema: { id: z.string().describe('Identificador del control, por ejemplo "cip-2"') },
      annotations: lectura,
    },
    async ({ id }) => {
      const control = datos.controles.get(id.trim().toLowerCase());
      if (!control) return error(`No existe el control "${id}". Usa kudo_listar_dominios para ver los identificadores.`);
      return json({
        ...resumenControl(control),
        enunciado: control.enunciado,
        requisitos: control.requisitos,
        documentos: docsDeControl(control.id).map(({ slug, titulo, codigo, tipo }) => ({ slug, titulo, codigo, tipo })),
      });
    },
  );

  server.registerTool(
    'kudo_buscar',
    {
      title: 'Buscar en Kudo',
      description: 'Busca por palabras clave en los controles, requisitos y documentos SGX (políticas y procedimientos).',
      inputSchema: {
        consulta: z.string().min(2).describe('Palabras clave, por ejemplo "mfa cuentas privilegiadas"'),
        limite: z.number().int().min(1).max(50).optional().describe('Máximo de resultados (por defecto 10)'),
      },
      annotations: lectura,
    },
    async ({ consulta, limite = 10 }) => {
      const terminos = norm(consulta).split(/\s+/).filter((t) => t.length > 1);
      const puntuar = (campos: [string, number][]) =>
        terminos.reduce((total, t) => total + campos.reduce((s, [txt, peso]) => s + (norm(txt).includes(t) ? peso : 0), 0), 0);

      const resultados: { tipo: string; id: string; titulo: string; puntaje: number; extracto?: string }[] = [];
      for (const c of datos.controles.values()) {
        const puntaje = puntuar([[c.id, 5], [c.titulo, 4], [c.enunciado, 2], [c.requisitos.map((r) => r.texto).join(' '), 1]]);
        if (puntaje) resultados.push({ tipo: 'control', id: c.id, titulo: c.titulo, puntaje, extracto: c.enunciado.slice(0, 240) });
      }
      for (const d of datos.documentos) {
        const cuerpo = mdxATexto(parseFrontmatter(fs.readFileSync(d.archivo, 'utf8')).body);
        const puntaje = puntuar([[d.titulo, 4], [d.codigo, 4], [d.descripcion, 2], [cuerpo, 1]]);
        if (puntaje) resultados.push({ tipo: 'documento', id: d.slug, titulo: d.titulo, puntaje, extracto: d.descripcion });
      }
      resultados.sort((a, b) => b.puntaje - a.puntaje);
      return json(resultados.slice(0, limite));
    },
  );

  server.registerTool(
    'kudo_listar_documentos',
    {
      title: 'Listar documentos SGX',
      description: 'Lista las políticas, procedimientos y plantillas del SGX, con filtros opcionales.',
      inputSchema: {
        dominio: z.string().optional().describe('Sigla del dominio: cor, cip, cif, cap, ccn, adr, thp o dia'),
        tipo: z.string().optional().describe('politica, procedimiento, plan, formato, plantilla, clausulas o terminos'),
        control: z.string().optional().describe('Solo documentos que desarrollan este control, por ejemplo "adr-4"'),
      },
      annotations: lectura,
    },
    async ({ dominio, tipo, control }) =>
      json(
        datos.documentos
          .filter((d) => !dominio || d.dominio === dominio.toLowerCase())
          .filter((d) => !tipo || d.tipo === tipo.toLowerCase())
          .filter((d) => !control || d.controles.includes(control.toLowerCase()))
          .map(({ archivo, ...d }) => d),
      ),
  );

  server.registerTool(
    'kudo_obtener_documento',
    {
      title: 'Leer documento SGX',
      description: 'Devuelve el contenido en Markdown de una política, procedimiento o plantilla del SGX (por su slug).',
      inputSchema: { slug: z.string().describe('Slug del documento, por ejemplo "politica-de-gestion-de-accesos"') },
      annotations: lectura,
    },
    async ({ slug }) => {
      const doc = datos.documentos.find((d) => d.slug === slug.trim());
      if (!doc) return error(`No existe el documento "${slug}". Usa kudo_listar_documentos para ver los disponibles.`);
      const { body } = parseFrontmatter(fs.readFileSync(doc.archivo, 'utf8'));
      return texto(`# ${doc.titulo}\n\n${doc.codigo ? `Código: ${doc.codigo} · ` : ''}Origen: ${doc.origen}\n\n${mdxATexto(body)}`);
    },
  );

  server.registerTool(
    'kudo_cobertura',
    {
      title: 'Cobertura de controles',
      description:
        'Muestra qué documentos del SGX desarrollan cada control Kudo y qué controles no tienen ningún documento (brechas documentales).',
      annotations: lectura,
    },
    async () => {
      const porControl = [...datos.controles.values()].map((c) => ({
        control: c.id,
        titulo: c.titulo,
        documentos: docsDeControl(c.id).map((d) => d.codigo || d.slug),
      }));
      return json({
        origen: datos.carpetaDocumentos ?? 'referencia de Kudo',
        totalControles: porControl.length,
        controlesCubiertos: porControl.filter((c) => c.documentos.length).length,
        brechas: porControl.filter((c) => !c.documentos.length).map((c) => `${c.control} – ${c.titulo}`),
        documentosSinControles: datos.documentos.filter((d) => !d.controles.length).map((d) => d.slug),
        detalle: porControl,
      });
    },
  );

  server.registerTool(
    'kudo_obtener_modelo_oscal',
    {
      title: 'Obtener modelo OSCAL',
      description:
        'Devuelve un modelo OSCAL de Kudo en JSON: catalog, profile, component-definition, ssp, assessment-plan, assessment-results, poam o mapping (correlación con ISO 27001, NIST CSF, CIS, SOC 2, PCI DSS y CSA). El catálogo completo es grande: usa kudo_obtener_control para un control puntual.',
      inputSchema: {
        modelo: z.enum(['catalog', 'profile', 'component-definition', 'ssp', 'assessment-plan', 'assessment-results', 'poam', 'mapping']),
      },
      annotations: lectura,
    },
    async ({ modelo }) => {
      const archivo = datos.oscal.get(modelo);
      if (!archivo) return error(`Modelo OSCAL no disponible: ${modelo}`);
      return texto(fs.readFileSync(archivo, 'utf8'));
    },
  );

  server.registerTool(
    'kudo_crear_item_poam',
    {
      title: 'Crear ítem de POA&M',
      description:
        'Genera un ítem de POA&M y su riesgo en formato OSCAL 1.2.3 a partir de un hallazgo, con fecha límite según la severidad (crítica 30, alta 60, media 90, baja 180 días). No escribe archivos: devuelve el JSON para agregarlo al POA&M.',
      inputSchema: {
        control: z.string().describe('Control afectado, por ejemplo "cip-2"'),
        titulo: z.string().describe('Título corto del hallazgo'),
        descripcion: z.string().describe('Qué se observó y por qué es un problema'),
        remediacion: z.string().describe('Acción correctiva propuesta'),
        severidad: z.enum(['critica', 'alta', 'media', 'baja']),
        fechaDeteccion: z.string().optional().describe('Fecha ISO (AAAA-MM-DD); por defecto hoy'),
      },
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ control, titulo, descripcion, remediacion, severidad, fechaDeteccion }) => {
      const c = datos.controles.get(control.trim().toLowerCase());
      if (!c) return error(`No existe el control "${control}".`);
      const inicio = fechaDeteccion ? new Date(`${fechaDeteccion}T00:00:00Z`) : new Date();
      if (Number.isNaN(inicio.getTime())) return error('fechaDeteccion debe tener el formato AAAA-MM-DD.');
      const limite = new Date(inicio);
      limite.setUTCDate(limite.getUTCDate() + PLAZOS[severidad]);
      const deadline = `${limite.toISOString().slice(0, 10)}T00:00:00Z`;
      const ns = 'https://divisioncero.com/kudo/framework/oscal';
      const obs = crypto.randomUUID();
      const risk = crypto.randomUUID();
      return json({
        observation: {
          uuid: obs,
          title: titulo,
          description: descripcion,
          methods: ['EXAMINE'],
          collected: `${inicio.toISOString().slice(0, 10)}T00:00:00Z`,
        },
        risk: {
          uuid: risk,
          title: titulo,
          description: descripcion,
          statement: `${descripcion} Control afectado: ${c.id.toUpperCase()} – ${c.titulo}.`,
          status: 'open',
          deadline,
          remediations: [
            {
              uuid: crypto.randomUUID(),
              lifecycle: 'planned',
              title: `Remediación: ${titulo}`,
              description: remediacion,
              tasks: [{ uuid: crypto.randomUUID(), type: 'milestone', title: 'Remediación implementada y verificada', timing: { 'on-date': { date: deadline } } }],
            },
          ],
          'related-observations': [{ 'observation-uuid': obs }],
        },
        'poam-item': {
          uuid: crypto.randomUUID(),
          title: titulo,
          description: `${remediacion} Control afectado: ${c.id.toUpperCase()}. Severidad: ${severidad}.`,
          props: [{ name: 'control-id', ns, value: c.id }, { name: 'severity', ns, value: severidad }],
          'related-observations': [{ 'observation-uuid': obs }],
          'related-risks': [{ 'risk-uuid': risk }],
        },
      });
    },
  );

  server.registerTool(
    'kudo_listar_agentes',
    {
      title: 'Listar agentes de ciberseguridad',
      description: 'Lista los agentes de ciberseguridad de Kudo y las skills que usa cada uno.',
      annotations: lectura,
    },
    async () => json([...datos.agentes.values()].map(({ contenido, ...a }) => a)),
  );

  server.registerTool(
    'kudo_obtener_agente',
    {
      title: 'Obtener agente de ciberseguridad',
      description:
        'Devuelve las instrucciones completas de un agente de Kudo junto con sus skills, para que el asistente adopte ese rol.',
      inputSchema: { nombre: z.string().describe('Nombre del agente, por ejemplo "kudo-ciso"') },
      annotations: lectura,
    },
    async ({ nombre }) => {
      const agente = datos.agentes.get(nombre.trim());
      if (!agente) return error(`No existe el agente "${nombre}". Usa kudo_listar_agentes.`);
      return texto(instruccionesAgente(datos, agente.nombre));
    },
  );

  server.registerTool(
    'kudo_obtener_skill',
    {
      title: 'Obtener skill',
      description: 'Devuelve el contenido (SKILL.md) de una skill de Kudo.',
      inputSchema: { nombre: z.string().describe('Nombre de la skill, por ejemplo "kudo-gestion-de-riesgos"') },
      annotations: lectura,
    },
    async ({ nombre }) => {
      const skill = datos.skills.get(nombre.trim());
      return skill ? texto(skill.contenido) : error(`No existe la skill "${nombre}".`);
    },
  );

  // ── Prompts: un prompt por agente ─────────────────────────────────────────

  for (const agente of datos.agentes.values()) {
    server.registerPrompt(
      agente.nombre.replace(/^kudo-/, 'agente-'),
      {
        title: agente.nombre,
        description: agente.descripcion,
        argsSchema: { tarea: z.string().optional().describe('Lo que necesitas que haga el agente') },
      },
      ({ tarea }) => ({
        messages: [
          {
            role: 'user' as const,
            content: {
              type: 'text' as const,
              text: `${instruccionesAgente(datos, agente.nombre)}\n\n---\n\n## Tarea\n\n${tarea || 'Preséntate brevemente y pregunta en qué puedes ayudar.'}`,
            },
          },
        ],
      }),
    );
  }

  // ── Recursos ──────────────────────────────────────────────────────────────

  server.registerResource(
    'oscal',
    new ResourceTemplate('kudo://oscal/{modelo}', {
      list: async () => ({
        resources: [...datos.oscal.keys()].map((m) => ({ uri: `kudo://oscal/${m}`, name: `OSCAL ${m}`, mimeType: 'application/json' })),
      }),
    }),
    { title: 'Modelos OSCAL de Kudo', mimeType: 'application/json' },
    async (uri, { modelo }) => {
      const archivo = datos.oscal.get(String(modelo));
      if (!archivo) throw new Error(`Modelo OSCAL no disponible: ${modelo}`);
      return { contents: [{ uri: uri.href, mimeType: 'application/json', text: fs.readFileSync(archivo, 'utf8') }] };
    },
  );

  server.registerResource(
    'documentos',
    new ResourceTemplate('kudo://documentos/{slug}', {
      list: async () => ({
        resources: datos.documentos.map((d) => ({ uri: `kudo://documentos/${d.slug}`, name: d.titulo, description: d.descripcion, mimeType: 'text/markdown' })),
      }),
    }),
    { title: 'Documentos SGX', mimeType: 'text/markdown' },
    async (uri, { slug }) => {
      const doc = datos.documentos.find((d) => d.slug === String(slug));
      if (!doc) throw new Error(`No existe el documento ${slug}`);
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: mdxATexto(parseFrontmatter(fs.readFileSync(doc.archivo, 'utf8')).body) }] };
    },
  );

  server.registerResource(
    'skills',
    new ResourceTemplate('kudo://skills/{nombre}', {
      list: async () => ({
        resources: [...datos.skills.values()].map((s) => ({ uri: `kudo://skills/${s.nombre}`, name: s.nombre, description: s.descripcion, mimeType: 'text/markdown' })),
      }),
    }),
    { title: 'Skills de ciberseguridad de Kudo', mimeType: 'text/markdown' },
    async (uri, { nombre }) => {
      const skill = datos.skills.get(String(nombre));
      if (!skill) throw new Error(`No existe la skill ${nombre}`);
      return { contents: [{ uri: uri.href, mimeType: 'text/markdown', text: skill.contenido }] };
    },
  );

  return server;
}

/** Instrucciones de un agente con el contenido de sus skills incrustado. */
export function instruccionesAgente(datos: KudoData, nombre: string): string {
  const agente = datos.agentes.get(nombre)!;
  const skills = agente.skills
    .map((s) => datos.skills.get(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .map((s) => `### Skill: ${s.nombre}\n\n${parseFrontmatter(s.contenido).body.trim()}`);
  return [`# Agente ${agente.nombre}`, agente.descripcion, agente.contenido, skills.length ? `## Skills\n\n${skills.join('\n\n')}` : '']
    .filter(Boolean)
    .join('\n\n');
}
