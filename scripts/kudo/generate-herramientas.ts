/**
 * Genera las páginas de herramientas de cada dominio de Kudo
 * (content/kudo/framework/<dominio>/herramientas.mdx) a partir del catálogo
 * central de herramientas (lib/herramientas/tools.ts), para que siempre
 * muestren todas las herramientas disponibles en /herramientas.
 *
 * Cada página muestra primero las herramientas recomendadas para el dominio y
 * después el resto del catálogo agrupado por categoría.
 *
 *   pnpm kudo:herramientas
 */
import fs from 'node:fs';
import path from 'node:path';
import { categories, tools, type Tool } from '../../lib/herramientas/tools';

const ROOT = process.cwd();

interface Dominio {
  id: string;
  sigla: string;
  nombre: string;
  enfoque: string;
  recomendadas: string[];
}

const DOMINIOS: Dominio[] = [
  {
    id: 'cor',
    sigla: 'COR',
    nombre: 'Coherencia Organizacional',
    enfoque: 'gobierno, gestión de riesgos, cumplimiento y mejora continua',
    recomendadas: ['framework-kudo', 'grc-companias', 'cyberkit', 'workflow-ciberseguridad', 'tabla-periodica-ciberseguridad', 'triada-cia', 'checklist-buenas-practicas-equipo', 'calendario-ciberseguridad', 'endoflife-date'],
  },
  {
    id: 'cip',
    sigla: 'CIP',
    nombre: 'Ciberseguridad en Identidad y Puntos Finales',
    enfoque: 'identidades, autenticación, autorización y puntos finales',
    recomendadas: ['generador-contrasenas', 'analizador-contrasenas', 'totp', 'flujo-autenticacion-autorizacion', 'have-i-been-pwned', 'malas-practicas-escritorio', 'checklist-buenas-practicas-equipo'],
  },
  {
    id: 'cif',
    sigla: 'CIF',
    nombre: 'Ciberseguridad en Infraestructura',
    enfoque: 'nube, inventario de activos, redes, cifrado y gestión de claves',
    recomendadas: ['cual-es-mi-ip', 'whois-ip-y-dominio', 'validador-spf', 'mxtoolbox', 'dns-dumpster', 'shodan', 'verificar-sitio-seguro', 'generador-hash', 'generador-y-validador-hash-archivo', 'cifrado-pgp', 'endoflife-date'],
  },
  {
    id: 'cap',
    sigla: 'CAP',
    nombre: 'Ciberseguridad en Aplicaciones',
    enfoque: 'desarrollo seguro y seguridad en APIs',
    recomendadas: ['detector-codigo-vulnerable', 'flujo-autenticacion-autorizacion', 'codificador-base64', 'codificador-url', 'codificador-hexadecimal', 'generador-hash', 'generador-uuid', 'conversion-de-fecha-y-hora', 'github-dorking'],
  },
  {
    id: 'ccn',
    sigla: 'CCN',
    nombre: 'Continuidad y Cambios del Negocio',
    enfoque: 'gestión de cambios, pruebas, reversión y continuidad',
    recomendadas: ['workflow-ciberseguridad', 'checklist-incidente-seguridad', 'endoflife-date', 'calendario-ciberseguridad', 'temporizador', 'conversion-de-fecha-y-hora'],
  },
  {
    id: 'adr',
    sigla: 'ADR',
    nombre: 'Análisis, Detección y Respuesta de Ciberseguridad',
    enfoque: 'malware, vulnerabilidades, monitoreo y respuesta a incidentes',
    recomendadas: ['conan', 'cybermap', 'checklist-incidente-seguridad', 'virustotal', 'hybrid-analysis', 'urlscan', 'reputacion-ip', 'dominios-similares', 'emailrep', 'analizador-metadatos', 'generador-y-validador-hash-archivo', 'visor-hexadecimal', 'fotoforensics', 'wayback-machine'],
  },
  {
    id: 'thp',
    sigla: 'THP',
    nombre: 'Ciberseguridad en Talento Humano y Proveedores',
    enfoque: 'concienciación, trabajo remoto y cadena de suministro',
    recomendadas: ['rompehielos', 'rompehielos-practicas-ciberseguridad', 'deteccion-phishing', 'suplantacion-marcas', 'identificador-correos-seguros', 'verificar-sitio-seguro', 'malas-practicas-escritorio', 'checklist-buenas-practicas-equipo', 'museo-cibercrimen', 'que-es-grooming', 'que-es-sexting', 'que-es-sextorsion', 'comprobar-correo'],
  },
  {
    id: 'dia',
    sigla: 'DIA',
    nombre: 'Ciberseguridad en Datos e Inteligencia Artificial',
    enfoque: 'inventario, clasificación, privacidad y exposición de datos',
    recomendadas: ['que-es-pii', 'analizador-metadatos', 'pdf-candy-metadata', 'fotoforensics', 'have-i-been-pwned', 'cifrado-pgp', 'generador-y-validador-hash-archivo', 'identificador-id-red-social', 'whatmyname', 'sherlock', 'maigret', 'theharvester'],
  },
];

const escapeAttr = (s: string) => s.replace(/"/g, '&quot;');

function card(tool: Tool) {
  const deDivisionCero = tool.firstParty || tool.href.startsWith('/') || /^https:\/\/([a-z]+\.)?divisioncero\.com\//.test(tool.href);
  const externa = tool.external && !deDivisionCero ? ' (externa)' : '';
  return [
    '  <Card',
    `    href="${tool.href}"`,
    `    icon={<Icon${tool.iconName} />}`,
    `    title="${escapeAttr(tool.title)}"`,
    `    description="${escapeAttr(tool.description + externa)}"`,
    '  />',
  ].join('\n');
}

const cards = (lista: Tool[]) => ['<Cards>', ...lista.map(card), '</Cards>'].join('\n');

function pagina(d: Dominio) {
  const porSlug = new Map(tools.map((t) => [t.slug, t]));
  const recomendadas = d.recomendadas.map((slug) => {
    const tool = porSlug.get(slug);
    if (!tool) throw new Error(`${d.id}: la herramienta "${slug}" no existe en lib/herramientas/tools.ts`);
    return tool;
  });
  const usadas = new Set(d.recomendadas);
  const resto = tools.filter((t) => !usadas.has(t.slug));
  // Alias `Icon*` para no sombrear globales como `Map` dentro del módulo MDX.
  const iconos = [...new Set(tools.map((t) => t.iconName))].sort().map((n) => `${n} as Icon${n}`);

  const secciones = categories
    .map((categoria) => {
      // Cada herramienta aparece una sola vez, en su primera categoría.
      const lista = resto.filter((t) => t.categories[0] === categoria);
      return lista.length ? `### ${categoria}\n\n${cards(lista)}` : '';
    })
    .filter(Boolean)
    .join('\n\n');

  return `---
title: Herramientas — ${d.nombre} (${d.sigla})
description: "Herramientas gratuitas de DivisionCero para el dominio ${d.sigla} de Kudo: ${d.enfoque}."
---

{/* Generado por scripts/kudo/generate-herramientas.ts a partir de lib/herramientas/tools.ts. No editar a mano. */}

import { ${iconos.join(', ')} } from 'lucide-react';

<Callout>
  Todas las herramientas disponibles en [DivisionCero](/herramientas), con las más útiles para ${d.enfoque} primero. Las marcadas como *externa* son de terceros.
</Callout>

## Recomendadas para ${d.sigla}

${cards(recomendadas)}

## Más herramientas

${secciones}
`;
}

let cambios = 0;
for (const d of DOMINIOS) {
  const file = path.join(ROOT, 'content/kudo/framework', d.id, 'herramientas.mdx');
  const contenido = pagina(d);
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== contenido) {
    fs.writeFileSync(file, contenido);
    cambios++;
  }
}
console.log(`Herramientas Kudo: ${DOMINIOS.length} páginas, ${cambios} actualizadas (${tools.length} herramientas en el catálogo).`);
