/**
 * Genera los modelos OSCAL de Kudo a partir del catálogo (fuente de verdad) y
 * de los documentos del SGX (content/kudo/sgx/politicas-y-procedimientos):
 *
 *   Capa de control ........ catalog (existente) → profile
 *   Capa de implementación . component-definition → system-security-plan (SSP)
 *   Capa de evaluación ..... assessment-plan (AP) → assessment-results (AR) → POA&M
 *
 * Escribe cada modelo en json/, yaml/ y toon/ dentro de
 * content/kudo/framework/oscal/kudo/rev1/. El XML se produce con el conversor
 * oficial de NIST (scripts/kudo/oscal-to-xml.sh) para que cumpla el esquema XSD.
 *
 * Los UUID son deterministas (UUIDv5 sobre un nombre estable), así que
 * regenerar sin cambios en las fuentes no altera los archivos.
 *
 *   pnpm kudo:oscal
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { encode as toToon } from '@toon-format/toon';
import { leerDocumentos, type SgxDocumento } from './sync-sgx-documentos';

const ROOT = process.cwd();
const REV_DIR = path.join(ROOT, 'content/kudo/framework/oscal/kudo/rev1');
const CATALOG_FILE = path.join(REV_DIR, 'json/kudo-catalog.json');

/** Número de controles del catálogo (para los textos descriptivos de los demás modelos). */
const TOTAL_CONTROLES: number = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')).catalog.groups.reduce(
  (n: number, g: { controls?: unknown[] }) => n + (g.controls?.length ?? 0),
  0,
);

const OSCAL_VERSION = '1.2.3';
const VERSION = '0.1.0';
/** Fecha fija de publicación de la revisión 1 (cámbiala al publicar una revisión nueva). */
const FECHA = '2026-11-18T00:00:00Z';
const NS = 'https://divisioncero.com/kudo/framework/oscal';
const RAW = 'https://raw.githubusercontent.com/PetterVargas/divisioncero.com/main/content/kudo/framework/oscal/kudo/rev1';
const SITE = 'https://divisioncero.com';

// ── Utilidades ──────────────────────────────────────────────────────────────

const NAMESPACE_UUID = 'f3d1c0de-6b1d-5a6e-9c3f-6b75646f0001';

/** UUIDv5 (RFC 4122) determinista a partir de un nombre. */
function uuid(name: string): string {
  const ns = Buffer.from(NAMESPACE_UUID.replace(/-/g, ''), 'hex');
  const hash = crypto.createHash('sha1').update(Buffer.concat([ns, Buffer.from(name, 'utf8')])).digest();
  hash[6] = (hash[6] & 0x0f) | 0x50;
  hash[8] = (hash[8] & 0x3f) | 0x80;
  const h = hash.subarray(0, 16).toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}

const prop = (name: string, value: string, ns = NS) => ({ name, ns, value });

interface Control {
  id: string;
  title: string;
  dominio: string;
  dominioTitulo: string;
  requisitos: { id: string; prose: string }[];
}

function leerCatalogo() {
  const raw = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
  const catalog = raw.catalog;
  const controles: Control[] = [];
  for (const group of catalog.groups) {
    for (const c of group.controls ?? []) {
      const statement = (c.parts ?? []).find((p: { name: string }) => p.name === 'statement');
      controles.push({
        id: c.id,
        title: c.title,
        dominio: group.id,
        dominioTitulo: group.title,
        requisitos: (statement?.parts ?? []).map((p: { id: string; prose: string }) => ({ id: p.id, prose: p.prose })),
      });
    }
  }
  return { catalog, controles, grupos: catalog.groups as { id: string; title: string }[] };
}

/** Metadatos comunes a todos los modelos. */
function metadata(title: string, remarks: string, extra: Record<string, unknown> = {}) {
  return {
    title,
    published: FECHA,
    'last-modified': FECHA,
    version: VERSION,
    'oscal-version': OSCAL_VERSION,
    remarks,
    links: [
      { href: `${SITE}/kudo/framework/oscal`, rel: 'canonical', 'media-type': 'text/html', text: 'Kudo y OSCAL' },
    ],
    roles: [
      { id: 'creator', title: 'Autor del contenido' },
      { id: 'prepared-for', title: 'Organización destinataria' },
    ],
    parties: [
      {
        uuid: PARTY.divisioncero,
        type: 'organization',
        name: 'DivisionCero',
        links: [{ href: `${SITE}/kudo`, rel: 'homepage' }],
      },
      {
        uuid: PARTY.organizacion,
        type: 'organization',
        name: '[Nombre de tu organización]',
        remarks: 'Reemplaza este valor por la razón social de la organización que adopta Kudo.',
      },
    ],
    'responsible-parties': [
      { 'role-id': 'creator', 'party-uuids': [PARTY.divisioncero] },
      { 'role-id': 'prepared-for', 'party-uuids': [PARTY.organizacion] },
    ],
    ...extra,
  };
}

const PARTY = {
  divisioncero: 'ed04377f-1282-41a6-b653-477f0b38742c', // mismo UUID que en el catálogo
  organizacion: uuid('party:organizacion'),
};

/** Recurso de back-matter que apunta a otro modelo de Kudo en todos sus formatos. */
function recurso(id: string, title: string, archivo: string, description: string) {
  return {
    uuid: uuid(`resource:${id}`),
    title,
    description,
    rlinks: [
      { href: `${RAW}/json/${archivo}.json`, 'media-type': 'application/oscal+json' },
      { href: `${RAW}/xml/${archivo}.xml`, 'media-type': 'application/oscal+xml' },
      { href: `${RAW}/yaml/${archivo}.yaml`, 'media-type': 'application/oscal+yaml' },
    ],
  };
}

const RES = {
  catalog: recurso('catalog', 'Catálogo de Controles Kudo', 'kudo-catalog', `Catálogo OSCAL de Kudo (8 dominios, ${TOTAL_CONTROLES} controles).`),
  profile: recurso('profile', 'Perfil Kudo – Línea base completa', 'kudo-profile', 'Perfil OSCAL que selecciona todos los controles del catálogo Kudo.'),
  componentDefinition: recurso(
    'component-definition',
    'Definición de componentes Kudo SGX',
    'kudo-component-definition',
    'Componentes (políticas y procedimientos del SGX) y los controles que implementan.',
  ),
  ssp: recurso('ssp', 'Plan de Seguridad del Sistema – plantilla Kudo', 'kudo-ssp', 'SSP de referencia basado en el perfil Kudo.'),
  ap: recurso('ap', 'Plan de Evaluación – plantilla Kudo', 'kudo-assessment-plan', 'Plan de auditoría interna de los controles Kudo.'),
  ar: recurso('ar', 'Resultados de Evaluación – plantilla Kudo', 'kudo-assessment-results', 'Resultados de ejemplo de una auditoría interna Kudo.'),
};

const docUrl = (slug: string) => `${SITE}/kudo/sgx/politicas-y-procedimientos/${slug}`;
const controlUrl = (id: string) => `${SITE}/kudo/framework/${id.split('-')[0]}/${id}`;

// ── Profile ─────────────────────────────────────────────────────────────────

function profile() {
  return {
    profile: {
      uuid: uuid('profile:kudo-base'),
      metadata: metadata(
        'Perfil Kudo – Línea base completa',
        `Perfil OSCAL que importa el catálogo Kudo y selecciona sus ${TOTAL_CONTROLES} controles sin modificaciones. Úsalo como punto de partida: copia este archivo y reemplaza include-all por include-controls para seleccionar solo los controles aplicables a tu organización (declaración de aplicabilidad).`,
        { props: [prop('control-count', String(TOTAL_CONTROLES)), prop('baseline', 'completa')] },
      ),
      imports: [{ href: `#${RES.catalog.uuid}`, 'include-all': {} }],
      merge: { 'as-is': true },
      'back-matter': { resources: [RES.catalog] },
    },
  };
}

// ── Component Definition ────────────────────────────────────────────────────

const TIPO_COMPONENTE: Record<string, string> = {
  politica: 'policy',
  procedimiento: 'process-procedure',
  plan: 'plan',
  formato: 'guidance',
  plantilla: 'guidance',
  clausulas: 'guidance',
  terminos: 'guidance',
};

function componentDefinition(documentos: SgxDocumento[], controles: Map<string, Control>) {
  const componentes = documentos.map((doc) => ({
    uuid: uuid(`component:${doc.slug}`),
    type: TIPO_COMPONENTE[doc.tipo] ?? 'guidance',
    title: doc.title,
    description: doc.description,
    purpose: `Documento ${doc.codigo} del SGX de Kudo (dominio ${doc.dominio.toUpperCase()}).`,
    props: [
      prop('document-code', doc.codigo),
      prop('document-type', doc.tipo),
      prop('domain', doc.dominio),
      prop('version', doc.version),
      prop('review-frequency', doc.revision),
    ],
    links: [{ href: docUrl(doc.slug), rel: 'reference', 'media-type': 'text/html', text: doc.title }],
    'responsible-roles': [{ 'role-id': 'document-owner', remarks: doc.propietario }],
    'control-implementations': [
      {
        uuid: uuid(`component:${doc.slug}:ci`),
        source: `#${RES.profile.uuid}`,
        description: `Controles Kudo que el documento "${doc.title}" ayuda a implementar.`,
        'implemented-requirements': doc.controles.map((id) => ({
          uuid: uuid(`component:${doc.slug}:${id}`),
          'control-id': id,
          description: `${doc.title} establece las directrices organizacionales para ${controles.get(id)!.title} (${id.toUpperCase()}).`,
          links: [{ href: controlUrl(id), rel: 'reference', 'media-type': 'text/html' }],
        })),
      },
    ],
  }));

  return {
    'component-definition': {
      uuid: uuid('component-definition:kudo-sgx'),
      metadata: metadata(
        'Definición de Componentes Kudo – SGX',
        `Cada componente es un documento del SGX de Kudo (${documentos.length} políticas, procedimientos, planes y plantillas) con la lista de controles Kudo que ayuda a implementar. Agrega aquí tus componentes técnicos (IdP, EDR, SIEM, nube) para completar la trazabilidad.`,
        {
          roles: [
            { id: 'creator', title: 'Autor del contenido' },
            { id: 'prepared-for', title: 'Organización destinataria' },
            { id: 'document-owner', title: 'Propietario del documento' },
          ],
        },
      ),
      components: componentes,
      'back-matter': { resources: [RES.profile] },
    },
  };
}

// ── System Security Plan ────────────────────────────────────────────────────

function ssp(documentos: SgxDocumento[], controles: Control[]) {
  const thisSystem = uuid('ssp:component:this-system');
  const porControl = new Map<string, SgxDocumento[]>();
  for (const doc of documentos) for (const id of doc.controles) porControl.set(id, [...(porControl.get(id) ?? []), doc]);

  return {
    'system-security-plan': {
      uuid: uuid('ssp:kudo-plantilla'),
      metadata: metadata(
        'Plan de Seguridad del Sistema (SSP) – Plantilla Kudo',
        'SSP de referencia: describe un sistema genérico ("Plataforma de la organización") que adopta el perfil Kudo. Reemplaza los valores entre corchetes, documenta tus componentes técnicos y actualiza el estado de implementación de cada control (planned → partial → implemented).',
        {
          roles: [
            { id: 'creator', title: 'Autor del contenido' },
            { id: 'prepared-for', title: 'Organización destinataria' },
            { id: 'system-owner', title: 'Propietario del sistema' },
            { id: 'ciso', title: 'Responsable de Ciberseguridad' },
          ],
        },
      ),
      'import-profile': { href: `#${RES.profile.uuid}` },
      'system-characteristics': {
        'system-ids': [{ 'identifier-type': 'https://ietf.org/rfc/rfc4122', id: uuid('ssp:system-id') }],
        'system-name': '[Plataforma de la organización]',
        'system-name-short': 'SGX',
        description:
          'Conjunto de procesos, personas y tecnología dentro del alcance del SGX de la organización: aplicaciones de negocio, infraestructura en la nube, puntos finales y proveedores críticos.',
        'security-sensitivity-level': 'moderate',
        'system-information': {
          'information-types': [
            {
              uuid: uuid('ssp:info:clientes'),
              title: 'Datos de clientes',
              description: 'Información de clientes y datos personales tratados por la plataforma (clasificación Confidencial).',
              'confidentiality-impact': { base: 'moderate' },
              'integrity-impact': { base: 'moderate' },
              'availability-impact': { base: 'moderate' },
            },
            {
              uuid: uuid('ssp:info:interna'),
              title: 'Información interna de la organización',
              description: 'Información financiera, contractual y operativa (clasificación Interna o Confidencial).',
              'confidentiality-impact': { base: 'moderate' },
              'integrity-impact': { base: 'moderate' },
              'availability-impact': { base: 'low' },
            },
          ],
        },
        'security-impact-level': {
          'security-objective-confidentiality': 'moderate',
          'security-objective-integrity': 'moderate',
          'security-objective-availability': 'moderate',
        },
        status: { state: 'operational' },
        'authorization-boundary': {
          description:
            '[Describe el alcance del SGX: sedes, aplicaciones, cuentas de nube, procesos y proveedores incluidos, y las exclusiones justificadas.]',
        },
      },
      'system-implementation': {
        users: [
          {
            uuid: uuid('ssp:user:colaboradores'),
            title: 'Colaboradores',
            'role-ids': ['prepared-for'],
            'authorized-privileges': [{ title: 'Usuario estándar', 'functions-performed': ['Uso de aplicaciones de negocio'] }],
          },
          {
            uuid: uuid('ssp:user:administradores'),
            title: 'Administradores de TI',
            'role-ids': ['system-owner'],
            'authorized-privileges': [{ title: 'Administrador', 'functions-performed': ['Administración de infraestructura y accesos'] }],
          },
        ],
        components: [
          {
            uuid: thisSystem,
            type: 'this-system',
            title: '[Plataforma de la organización]',
            description: 'El sistema en su conjunto.',
            status: { state: 'operational' },
          },
          ...documentos.map((doc) => ({
            uuid: uuid(`component:${doc.slug}`),
            type: TIPO_COMPONENTE[doc.tipo] ?? 'guidance',
            title: doc.title,
            description: doc.description,
            props: [prop('document-code', doc.codigo)],
            links: [{ href: docUrl(doc.slug), rel: 'reference', 'media-type': 'text/html' }],
            status: { state: 'under-development', remarks: 'Adaptar y aprobar el documento para la organización.' },
          })),
        ],
      },
      'control-implementation': {
        description:
          `Implementación de los ${TOTAL_CONTROLES} controles Kudo. Cada requisito se atiende con los documentos del SGX que lo desarrollan y con el sistema en su conjunto; agrega los componentes técnicos que correspondan.`,
        'implemented-requirements': controles.map((c) => ({
          uuid: uuid(`ssp:ir:${c.id}`),
          'control-id': c.id,
          'by-components': [
            {
              'component-uuid': thisSystem,
              uuid: uuid(`ssp:ir:${c.id}:this-system`),
              description: `[Describe cómo la organización implementa ${c.id.toUpperCase()} – ${c.title}: responsables, tecnología y evidencias.]`,
              'implementation-status': { state: 'planned' },
            },
            ...(porControl.get(c.id) ?? []).map((doc) => ({
              'component-uuid': uuid(`component:${doc.slug}`),
              uuid: uuid(`ssp:ir:${c.id}:${doc.slug}`),
              description: `${doc.title} (${doc.codigo}) define las directrices para este control.`,
              'implementation-status': { state: 'planned' },
            })),
          ],
        })),
      },
      'back-matter': { resources: [RES.profile, RES.componentDefinition] },
    },
  };
}

// ── Assessment Plan ─────────────────────────────────────────────────────────

const METODOS = [
  { id: 'examinar', metodo: 'EXAMINE', titulo: 'Revisión documental', desc: 'Revisar políticas, procedimientos, registros y configuraciones que evidencian el control.' },
  { id: 'entrevistar', metodo: 'INTERVIEW', titulo: 'Entrevista', desc: 'Entrevistar a los responsables del control y a una muestra de usuarios.' },
  { id: 'probar', metodo: 'TEST', titulo: 'Prueba técnica', desc: 'Verificar el funcionamiento del control mediante pruebas o muestreo.' },
];

function assessmentPlan(grupos: { id: string; title: string }[], controles: Control[]) {
  const actividades = METODOS.map((m) => ({
    uuid: uuid(`ap:activity:${m.id}`),
    title: m.titulo,
    description: m.desc,
    props: [{ name: 'method', value: m.metodo }],
    'related-controls': { 'control-selections': [{ 'include-all': {} }] },
  }));

  const tareas = grupos.map((g, i) => {
    const inicio = new Date(Date.UTC(2027, i, 1));
    const fin = new Date(Date.UTC(2027, i, 15));
    return {
      uuid: uuid(`ap:task:${g.id}`),
      type: 'action',
      title: `Auditoría del dominio ${g.id.toUpperCase()} – ${g.title}`,
      description: `Evaluar los controles ${controles
        .filter((c) => c.dominio === g.id)
        .map((c) => c.id.toUpperCase())
        .join(', ')} con revisión documental, entrevistas y pruebas técnicas.`,
      timing: { 'within-date-range': { start: inicio.toISOString().replace('.000', ''), end: fin.toISOString().replace('.000', '') } },
      'associated-activities': actividades.map((a) => ({
        'activity-uuid': a.uuid,
        subjects: [{ type: 'component', 'include-all': {} }],
      })),
    };
  });

  return {
    'assessment-plan': {
      uuid: uuid('ap:kudo-plantilla'),
      metadata: metadata(
        'Plan de Evaluación (AP) – Auditoría interna Kudo',
        `Programa de auditoría interna de referencia: evalúa los ${TOTAL_CONTROLES} controles Kudo, un dominio por mes, con revisión documental, entrevistas y pruebas técnicas, conforme al Procedimiento de Auditoría Interna del SGX. Ajusta fechas, alcance y auditores.`,
        {
          roles: [
            { id: 'creator', title: 'Autor del contenido' },
            { id: 'prepared-for', title: 'Organización destinataria' },
            { id: 'assessor', title: 'Auditor interno' },
          ],
        },
      ),
      'import-ssp': { href: `#${RES.ssp.uuid}` },
      'local-definitions': { activities: actividades },
      'terms-and-conditions': {
        parts: [
          {
            name: 'rules-of-engagement',
            title: 'Reglas de la evaluación',
            prose:
              'Los auditores son independientes del proceso auditado. Las pruebas técnicas se acuerdan con el propietario del sistema y no deben afectar la operación. Los hallazgos se clasifican como no conformidad mayor, no conformidad menor, observación u oportunidad de mejora.',
          },
        ],
      },
      'reviewed-controls': {
        description: 'Se evalúan todos los controles del perfil Kudo.',
        'control-selections': [{ 'include-all': {} }],
      },
      'assessment-subjects': [{ type: 'component', description: 'Todos los componentes del SSP.', 'include-all': {} }],
      tasks: tareas,
      'back-matter': { resources: [RES.ssp, RES.profile] },
    },
  };
}

// ── Assessment Results y POA&M (ejemplos) ───────────────────────────────────

/** Hallazgos ilustrativos que muestran cómo se registra una auditoría y su POA&M. */
const HALLAZGOS = [
  {
    id: 'cip-2-mfa',
    control: 'cip-2',
    titulo: 'MFA no habilitada en todas las cuentas administrativas',
    observacion: 'En una muestra de 20 cuentas administrativas, 3 no tenían MFA habilitada en la consola de nube.',
    metodo: 'TEST',
    estado: 'not-satisfied',
    riesgo: 'Compromiso de cuentas administrativas por robo o reutilización de credenciales.',
    probabilidad: 'moderate',
    impacto: 'high',
    plazoDias: 30,
    remediacion: 'Exigir MFA resistente a phishing para todas las cuentas privilegiadas mediante una política de acceso condicional.',
  },
  {
    id: 'adr-2-plazos',
    control: 'adr-2',
    titulo: 'Vulnerabilidades altas remediadas fuera de plazo',
    observacion: 'El 35 % de las vulnerabilidades de severidad Alta del último trimestre superó el plazo de 30 días.',
    metodo: 'EXAMINE',
    estado: 'not-satisfied',
    riesgo: 'Explotación de vulnerabilidades conocidas en activos internos.',
    probabilidad: 'moderate',
    impacto: 'moderate',
    plazoDias: 60,
    remediacion: 'Automatizar el despliegue de parches en servidores y reportar mensualmente el cumplimiento de plazos al Comité de Seguridad.',
  },
  {
    id: 'dia-5-retencion',
    control: 'dia-5',
    titulo: 'Sin evidencia de eliminación de datos vencidos',
    observacion: 'No existe registro de eliminación de los datos de candidatos con más de un año desde el cierre del proceso.',
    metodo: 'INTERVIEW',
    estado: 'not-satisfied',
    riesgo: 'Incumplimiento del principio de limitación del plazo de conservación y sanciones de la autoridad de protección de datos.',
    probabilidad: 'low',
    impacto: 'moderate',
    plazoDias: 90,
    remediacion: 'Configurar la eliminación automática en el sistema de selección y conservar el registro de eliminación.',
  },
  {
    id: 'thp-1-phishing',
    control: 'thp-1',
    titulo: 'Programa de concienciación operando',
    observacion: 'Se verificaron las campañas trimestrales de phishing simulado y los registros de capacitación anual del 96 % de los colaboradores.',
    metodo: 'EXAMINE',
    estado: 'satisfied',
  },
];

const RESULT_START = '2027-01-01T00:00:00Z';
const RESULT_END = '2027-08-15T00:00:00Z';

function addDays(iso: string, days: number) {
  const d = new Date(iso);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function observacion(h: (typeof HALLAZGOS)[number]) {
  return {
    uuid: uuid(`obs:${h.id}`),
    title: h.titulo,
    description: h.observacion,
    methods: [h.metodo],
    types: [h.estado === 'satisfied' ? 'control-objective' : 'finding'],
    collected: RESULT_START,
    remarks: 'Ejemplo ilustrativo.',
  };
}

function riesgo(h: (typeof HALLAZGOS)[number]) {
  return {
    uuid: uuid(`risk:${h.id}`),
    title: h.titulo,
    description: h.riesgo!,
    statement: `${h.observacion} ${h.riesgo}`,
    status: 'open',
    characterizations: [
      {
        origin: { actors: [{ type: 'party', 'actor-uuid': PARTY.organizacion }] },
        facets: [
          { name: 'likelihood', system: NS, value: h.probabilidad! },
          { name: 'impact', system: NS, value: h.impacto! },
        ],
      },
    ],
    'related-observations': [{ 'observation-uuid': uuid(`obs:${h.id}`) }],
  };
}

function assessmentResults() {
  const conHallazgo = HALLAZGOS.filter((h) => h.estado !== 'satisfied');
  return {
    'assessment-results': {
      uuid: uuid('ar:kudo-ejemplo'),
      metadata: metadata(
        'Resultados de Evaluación (AR) – Ejemplo de auditoría interna Kudo',
        'Resultados ILUSTRATIVOS de una auditoría interna con el plan de evaluación de Kudo. Muestran cómo registrar observaciones, hallazgos y riesgos por control. Reemplázalos por los resultados reales de tu organización.',
      ),
      'import-ap': { href: `#${RES.ap.uuid}` },
      results: [
        {
          uuid: uuid('ar:result:2027'),
          title: 'Auditoría interna 2027',
          description: 'Resultados consolidados de la auditoría interna anual de los controles Kudo.',
          start: RESULT_START,
          end: RESULT_END,
          'reviewed-controls': { 'control-selections': [{ 'include-all': {} }] },
          observations: HALLAZGOS.map(observacion),
          risks: conHallazgo.map(riesgo),
          findings: HALLAZGOS.map((h) => ({
            uuid: uuid(`finding:${h.id}`),
            title: h.titulo,
            description: h.observacion,
            target: {
              type: 'objective-id',
              'target-id': `${h.control}_smt`,
              status: { state: h.estado },
            },
            'related-observations': [{ 'observation-uuid': uuid(`obs:${h.id}`) }],
            ...(h.estado !== 'satisfied' ? { 'related-risks': [{ 'risk-uuid': uuid(`risk:${h.id}`) }] } : {}),
          })),
        },
      ],
      'back-matter': { resources: [RES.ap] },
    },
  };
}

function poam() {
  const conHallazgo = HALLAZGOS.filter((h) => h.estado !== 'satisfied');
  return {
    'plan-of-action-and-milestones': {
      uuid: uuid('poam:kudo-ejemplo'),
      metadata: metadata(
        'Plan de Acción y Hitos (POA&M) – Ejemplo Kudo',
        'POA&M ILUSTRATIVO derivado de los resultados de evaluación de ejemplo: cada hallazgo abierto tiene un riesgo, un plan de remediación y un hito con fecha según su severidad (Procedimiento de Acciones Correctivas y Mejora Continua). Reemplázalo por tus propios hallazgos.',
      ),
      'import-ssp': { href: `#${RES.ssp.uuid}` },
      observations: conHallazgo.map(observacion),
      risks: conHallazgo.map((h) => ({
        ...riesgo(h),
        deadline: `${addDays(RESULT_END, h.plazoDias!)}T00:00:00Z`,
        remediations: [
          {
            uuid: uuid(`remediation:${h.id}`),
            lifecycle: 'planned',
            title: `Remediación: ${h.titulo}`,
            description: h.remediacion!,
            tasks: [
              {
                uuid: uuid(`milestone:${h.id}`),
                type: 'milestone',
                title: 'Remediación implementada y verificada',
                timing: { 'on-date': { date: `${addDays(RESULT_END, h.plazoDias!)}T00:00:00Z` } },
              },
            ],
          },
        ],
      })),
      'poam-items': conHallazgo.map((h) => ({
        uuid: uuid(`poam-item:${h.id}`),
        title: h.titulo,
        description: `${h.remediacion} Control afectado: ${h.control.toUpperCase()}. Plazo: ${h.plazoDias} días.`,
        props: [prop('control-id', h.control), prop('source-finding', uuid(`finding:${h.id}`))],
        'related-observations': [{ 'observation-uuid': uuid(`obs:${h.id}`) }],
        'related-risks': [{ 'risk-uuid': uuid(`risk:${h.id}`) }],
      })),
      'back-matter': { resources: [RES.ssp, RES.ar] },
    },
  };
}


// ── Mapping (correlación con estándares) ────────────────────────────────────

interface Estandar {
  id: string;
  carpeta: string;
  titulo: string;
  prefijo: string;
  referencia: string;
}

/** Estándares con tabla de correlación en el SGX (content/kudo/sgx/correlacion). */
const ESTANDARES: Estandar[] = [
  { id: 'iso27001', carpeta: 'iso27001-v2022-y-kudo', titulo: 'ISO/IEC 27001:2022 – Anexo A', prefijo: 'iso', referencia: 'https://www.iso.org/standard/27001' },
  { id: 'nist-csf', carpeta: 'nist-cybersecurity-framework-y-kudo', titulo: 'NIST Cybersecurity Framework 2.0', prefijo: 'csf', referencia: 'https://www.nist.gov/cyberframework' },
  { id: 'cis-controls', carpeta: 'cis-controls-y-kudo', titulo: 'CIS Controls v8.1', prefijo: 'cis', referencia: 'https://www.cisecurity.org/controls' },
  { id: 'soc2', carpeta: 'soc-2-y-kudo', titulo: 'SOC 2 – Trust Services Criteria', prefijo: 'tsc', referencia: 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2' },
  { id: 'pci-dss', carpeta: 'pci-dss-y-kudo', titulo: 'PCI DSS v4.0.1', prefijo: 'pci', referencia: 'https://www.pcisecuritystandards.org/document_library/' },
  { id: 'csa-ccm', carpeta: 'csa-ccm-y-kudo', titulo: 'CSA Cloud Controls Matrix v4', prefijo: 'ccm', referencia: 'https://cloudsecurityalliance.org/research/cloud-controls-matrix' },
  { id: 'csa-aicm', carpeta: 'csa-aicm-y-kudo', titulo: 'CSA AI Controls Matrix', prefijo: 'aicm', referencia: 'https://cloudsecurityalliance.org/artifacts/ai-controls-matrix' },
];

const CORRELACION_DIR = path.join(ROOT, 'content/kudo/sgx/correlacion');

/** Lee la tabla "Código | Política SGSI" de un estándar: código del estándar → slug de la política. */
function leerCorrelacion(e: Estandar): { codigo: string; slug: string }[] {
  const dir = path.join(CORRELACION_DIR, e.carpeta);
  const archivo = fs.readdirSync(dir).find((f) => f.includes('estructura-de-controles'));
  if (!archivo) throw new Error(`Sin tabla de correlación en ${e.carpeta}`);
  const filas: { codigo: string; slug: string }[] = [];
  for (const linea of fs.readFileSync(path.join(dir, archivo), 'utf8').split('\n')) {
    const m = linea.match(/^\|\s*([^|]+?)\s*\|\s*\[[^\]]*\]\(\/kudo\/sgx\/politicas-y-procedimientos\/([a-z0-9-]+)\)/);
    if (m) filas.push({ codigo: m[1], slug: m[2] });
  }
  return filas;
}

/** Identificador OSCAL (token) para un código de control de un estándar externo. */
const tokenEstandar = (prefijo: string, codigo: string) => `${prefijo}_${codigo.replace(/[^A-Za-z0-9.\-_]/g, '-')}`;

function mappingCollection(documentos: SgxDocumento[], controles: Control[]) {
  const porSlug = new Map(documentos.map((d) => [d.slug, d]));
  const idsKudo = controles.map((c) => c.id);

  const mappings = ESTANDARES.map((e) => {
    const filas = leerCorrelacion(e);
    const cubiertos = new Set<string>();
    const maps = filas.map((f) => {
      const doc = porSlug.get(f.slug);
      if (!doc) throw new Error(`${e.id} ${f.codigo}: la política "${f.slug}" no existe`);
      doc.controles.forEach((c) => cubiertos.add(c));
      return {
        uuid: uuid(`mapping:${e.id}:${f.codigo}`),
        relationship: 'intersects-with',
        sources: [{ type: 'control', 'id-ref': tokenEstandar(e.prefijo, f.codigo), props: [prop('label', f.codigo)] }],
        targets: doc.controles.map((id) => ({ type: 'control', 'id-ref': id })),
        props: [prop('sgx-document', doc.codigo)],
        links: [{ href: docUrl(doc.slug), rel: 'reference', 'media-type': 'text/html', text: doc.title }],
      };
    });
    const sinMapear = idsKudo.filter((id) => !cubiertos.has(id));
    return {
      uuid: uuid(`mapping:${e.id}`),
      'source-resource': {
        type: 'catalog',
        href: e.referencia,
        props: [prop('standard', e.titulo)],
        remarks: 'Recurso de referencia: el texto de este estándar no se redistribuye.',
      },
      'target-resource': { type: 'catalog', href: `#${RES.catalog.uuid}` },
      'mapping-description': `${e.titulo} → Kudo. Cada control del estándar se relaciona con los controles Kudo que desarrolla la política del SGX asociada en la correlación (${filas.length} controles del estándar).`,
      maps,
      ...(sinMapear.length
        ? {
            'target-gap-summary': {
              uuid: uuid(`mapping:${e.id}:gap`),
              'unmapped-controls': [{ 'with-ids': sinMapear }],
            },
          }
        : {}),
      remarks: `${filas.length} controles del estándar; ${cubiertos.size} de ${idsKudo.length} controles Kudo relacionados.`,
    };
  });

  return {
    'mapping-collection': {
      uuid: uuid('mapping-collection:kudo'),
      metadata: metadata(
        'Mapping – Correlación de estándares con Kudo',
        'Correlaciones del SGX de Kudo expresadas en el modelo OSCAL mapping: ISO 27001:2022, NIST CSF, CIS Controls, SOC 2, PCI DSS, CSA CCM y CSA AICM. La relación se deriva de la política del SGX asociada a cada control del estándar, por eso se declara como intersects-with.',
      ),
      provenance: {
        method: 'hybrid',
        'matching-rationale': 'semantic',
        status: 'complete',
        'mapping-description':
          'Mapeo elaborado por DivisionCero a partir de las tablas de correlación del SGX (control del estándar → política SGX) y de los controles Kudo que cada política declara en su frontmatter (política → controles Kudo). Generado con scripts/kudo/oscal-generate.ts.',
      },
      mappings,
      'back-matter': { resources: [RES.catalog] },
    },
  };
}

// ── Escritura ───────────────────────────────────────────────────────────────

function escribir(archivo: string, data: unknown) {
  const json = `${JSON.stringify(data, null, 2)}\n`;
  for (const [dir, contenido] of [
    ['json', json],
    ['yaml', YAML.stringify(data, { lineWidth: 0 })],
    ['toon', `${toToon(data)}\n`],
  ] as const) {
    fs.mkdirSync(path.join(REV_DIR, dir), { recursive: true });
    fs.writeFileSync(path.join(REV_DIR, dir, `${archivo}.${dir}`), contenido);
  }
  console.log(`  ✓ ${archivo}`);
}

function main() {
  const { controles, grupos } = leerCatalogo();
  const porId = new Map(controles.map((c) => [c.id, c]));
  const documentos = leerDocumentos();

  console.log('Generando modelos OSCAL de Kudo (rev1):');
  // El JSON del catálogo es la fuente de verdad: sus versiones YAML y TOON se derivan de él.
  escribir('kudo-catalog', JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8')));
  escribir('kudo-profile', profile());
  escribir('kudo-component-definition', componentDefinition(documentos, porId));
  escribir('kudo-ssp', ssp(documentos, controles));
  escribir('kudo-assessment-plan', assessmentPlan(grupos, controles));
  escribir('kudo-assessment-results', assessmentResults());
  escribir('kudo-poam', poam());
  escribir('kudo-mapping', mappingCollection(documentos, controles));
  console.log('Listo. Ejecuta scripts/kudo/oscal-to-xml.sh para regenerar los XML y validar.');
}

main();
