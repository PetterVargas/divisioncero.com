// Sincroniza las plantillas del CLI con el contenido vigente del sitio de Kudo
// (fuente de verdad en el repositorio divisioncero.com):
//
//   - Framework completo          → src/templates/content/framework  (ruta /framework)
//   - SGX: políticas y correlación → src/templates/content/sgx        (ruta /sgx)
//   - Imágenes que usa ese contenido → src/templates/public
//   - Agentes y skills de IA + configuración MCP → src/templates/ai
//
// Los enlaces se adaptan a las rutas del proyecto generado; las páginas del sitio
// que no forman parte de la plantilla pasan a ser enlaces absolutos.
// Se ejecuta antes de compilar el CLI (pnpm build).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(PKG, '..', '..');
const SITE = 'https://divisioncero.com';
const TPL = path.join(PKG, 'src/templates');

/** Secciones del SGX del sitio que se incluyen en la plantilla. */
const SECCIONES_SGX = ['politicas-y-procedimientos', 'correlacion'];

const esArchivo = (ruta) => /\.[a-z0-9]{2,4}(#.*)?$/i.test(ruta);

/** Convierte una ruta interna del sitio en la ruta equivalente del proyecto generado. */
function rutaPlantilla(ruta) {
  if (esArchivo(ruta)) return ruta; // imágenes: se copian a public/ con la misma ruta
  if (ruta === '/kudo/framework' || ruta.startsWith('/kudo/framework/') || ruta.startsWith('/kudo/framework#')) {
    return ruta.replace(/^\/kudo\/framework/, '/framework');
  }
  const sgx = ruta.match(/^\/kudo\/sgx(\/([a-z0-9-]+))?(.*)$/);
  if (sgx && (!sgx[2] || SECCIONES_SGX.includes(sgx[2]))) return ruta.replace(/^\/kudo\/sgx/, '/sgx');
  return `${SITE}${ruta}`; // resto del sitio (aprovisionamiento, herramientas, cyberacademy…)
}

const adaptarEnlaces = (texto) =>
  texto
    .replace(/\]\((\/[^)\s]*)\)/g, (_, r) => `](${rutaPlantilla(r)})`)
    .replace(/\b(href|src|light|dark)="(\/[^"]*)"/g, (_, attr, r) => `${attr}="${rutaPlantilla(r)}"`);

const imagenes = new Set();

function copiarContenido(origen, destino, { excluir = () => false } = {}) {
  fs.rmSync(destino, { recursive: true, force: true });
  let total = 0;
  const recorrer = (src, dst) => {
    fs.mkdirSync(dst, { recursive: true });
    for (const entrada of fs.readdirSync(src, { withFileTypes: true })) {
      const s = path.join(src, entrada.name);
      const d = path.join(dst, entrada.name);
      if (excluir(path.relative(origen, s))) continue;
      if (entrada.isDirectory()) recorrer(s, d);
      else if (/\.mdx?$/.test(entrada.name)) {
        const texto = adaptarEnlaces(fs.readFileSync(s, 'utf8'));
        for (const m of texto.matchAll(/(?:\]\(|=")(\/kudo\/[^)"\s]+\.(?:png|jpe?g|svg|webp|gif))/g)) imagenes.add(m[1]);
        fs.writeFileSync(d, texto);
        total++;
      } else if (entrada.name === 'meta.json') {
        fs.copyFileSync(s, d);
      }
    }
  };
  recorrer(origen, destino);
  return total;
}

function sincronizarContenido() {
  const framework = copiarContenido(path.join(REPO, 'content/kudo/framework'), path.join(TPL, 'content/framework'), {
    // Los archivos OSCAL (json/xml/yaml/toon) se enlazan desde GitHub; no se copian.
    excluir: (rel) => rel === path.join('oscal', 'kudo'),
  });

  const sgxDst = path.join(TPL, 'content/sgx');
  fs.rmSync(sgxDst, { recursive: true, force: true });
  fs.mkdirSync(sgxDst, { recursive: true });
  let sgx = 0;
  for (const seccion of SECCIONES_SGX) {
    sgx += copiarContenido(path.join(REPO, 'content/kudo/sgx', seccion), path.join(sgxDst, seccion));
  }
  const meta = JSON.parse(fs.readFileSync(path.join(REPO, 'content/kudo/sgx/meta.json'), 'utf8'));
  meta.pages = meta.pages.filter((p) => SECCIONES_SGX.includes(p));
  fs.writeFileSync(path.join(sgxDst, 'meta.json'), `${JSON.stringify(meta, null, 2)}\n`);
  fs.writeFileSync(path.join(sgxDst, 'index.mdx'), adaptarEnlaces(fs.readFileSync(path.join(REPO, 'content/kudo/sgx/index.mdx'), 'utf8')));

  const publico = path.join(TPL, 'public');
  fs.rmSync(publico, { recursive: true, force: true });
  for (const img of imagenes) {
    const src = path.join(REPO, 'public', img);
    if (!fs.existsSync(src)) throw new Error(`Imagen no encontrada en public/: ${img}`);
    fs.mkdirSync(path.dirname(path.join(publico, img)), { recursive: true });
    fs.copyFileSync(src, path.join(publico, img));
  }
  console.log(`  ✓ Contenido: framework ${framework} páginas, SGX ${sgx} páginas, ${imagenes.size} imágenes`);
}

function sincronizarIa() {
  const AI_DST = path.join(TPL, 'ai');
  fs.rmSync(AI_DST, { recursive: true, force: true });
  // Sin punto inicial: npm omite o renombra algunos archivos ocultos al publicar.
  // copy-template.ts los renombra a .claude/ y .mcp.json al crear el proyecto.
  const agentes = path.join(AI_DST, 'claude/agents');
  const skills = path.join(AI_DST, 'claude/skills');
  fs.mkdirSync(agentes, { recursive: true });
  for (const f of fs.readdirSync(path.join(REPO, 'kudo/agents')).filter((x) => x.endsWith('.md'))) {
    fs.copyFileSync(path.join(REPO, 'kudo/agents', f), path.join(agentes, f));
  }
  fs.cpSync(path.join(REPO, 'kudo/skills'), skills, { recursive: true, filter: (p) => path.basename(p) !== 'README.md' });
  fs.writeFileSync(
    path.join(AI_DST, 'mcp.json'),
    `${JSON.stringify({ mcpServers: { kudo: { command: 'npx', args: ['-y', '@divisioncero/kudo-mcp@latest'] } } }, null, 2)}\n`,
  );
  console.log(`  ✓ IA: ${fs.readdirSync(agentes).length} agentes, ${fs.readdirSync(skills).length} skills, .mcp.json`);
}

console.log('Sincronizando plantillas desde el sitio de Kudo…');
// La estructura anterior (content/sgsi) se reemplaza por content/sgx.
fs.rmSync(path.join(TPL, 'content/sgsi'), { recursive: true, force: true });
sincronizarContenido();
sincronizarIa();
