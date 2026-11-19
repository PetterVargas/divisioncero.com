// Copia en data/ los contenidos de Kudo que el servidor MCP necesita, desde el
// repositorio (fuente de verdad): catálogo y modelos OSCAL, documentos SGX de
// referencia, agentes y skills.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = path.resolve(PKG, '..', '..');
const DATA = path.join(PKG, 'data');

const fuentes = [
  ['content/kudo/framework/oscal/kudo/rev1/json', 'oscal', (f) => f.endsWith('.json')],
  ['content/kudo/sgx/politicas-y-procedimientos', 'sgx', (f) => f.endsWith('.mdx') && f !== 'index.mdx'],
  ['kudo/agents', 'agents', (f) => f.endsWith('.md') && f !== 'README.md'],
  ['kudo/skills', 'skills', (f) => f !== 'README.md'],
];

fs.rmSync(DATA, { recursive: true, force: true });
for (const [origen, destino, filtro] of fuentes) {
  const src = path.join(REPO, origen);
  if (!fs.existsSync(src)) throw new Error(`No existe ${origen}`);
  fs.cpSync(src, path.join(DATA, destino), {
    recursive: true,
    filter: (p) => fs.statSync(p).isDirectory() || filtro(path.basename(p)),
  });
  const total = fs.readdirSync(path.join(DATA, destino)).length;
  console.log(`  ✓ data/${destino} (${total})`);
}
