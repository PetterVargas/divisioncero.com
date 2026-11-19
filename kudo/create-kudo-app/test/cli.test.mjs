// Prueba del CLI: genera un proyecto sin preguntas y verifica su estructura.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const CLI = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'bin', 'cli.js');

function crear(args) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'create-kudo-app-'));
  execFileSync(process.execPath, [CLI, 'mi-sgx', '--yes', ...args], { cwd: dir, stdio: 'pipe' });
  return { dir, proyecto: path.join(dir, 'mi-sgx') };
}

test('genera el proyecto con SGX, MCP, agentes y skills', () => {
  const { dir, proyecto } = crear([]);
  try {
    const existe = (p) => fs.existsSync(path.join(proyecto, p));
    assert.ok(existe('package.json'));
    assert.ok(existe('.gitignore'), 'falta .gitignore');
    assert.ok(!existe('gitignore'));
    assert.ok(existe('.mcp.json'));
    assert.equal(fs.readdirSync(path.join(proyecto, '.claude/agents')).length, 8);
    assert.ok(existe('.claude/skills/kudo-framework/SKILL.md'));

    const politicas = fs.readdirSync(path.join(proyecto, 'content/sgx/politicas-y-procedimientos')).filter((f) => f.endsWith('.mdx') && f !== 'index.mdx');
    assert.ok(politicas.length >= 45, `solo ${politicas.length} documentos`);

    const pkg = JSON.parse(fs.readFileSync(path.join(proyecto, 'package.json'), 'utf8'));
    assert.equal(pkg.name, 'mi-sgx');
    assert.ok(pkg.scripts.mcp);
    const shared = fs.readFileSync(path.join(proyecto, 'lib/shared.ts'), 'utf8');
    assert.match(shared, /repo: 'mi-sgx'/);
    assert.ok(!existe('lib/shared.ts.template'));

    // Ningún enlace interno debe apuntar a rutas del sitio que no existen en la plantilla.
    const indice = fs.readFileSync(path.join(proyecto, 'content/sgx/politicas-y-procedimientos/index.mdx'), 'utf8');
    assert.doesNotMatch(indice, /href="\/kudo\//);
    // Controles con el mismo formato que el sitio (cor-1, no cor-01).
    assert.ok(existe('content/framework/ccn/ccn-4.mdx'));
    assert.ok(!existe('content/sgsi'));
    assert.ok(existe('content/sgx/correlacion/index.mdx'));
    assert.ok(existe('public/kudo/framework/oscal-layers.png'));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('--no-ai omite la configuración de IA', () => {
  const { dir, proyecto } = crear(['--no-ai']);
  try {
    assert.ok(!fs.existsSync(path.join(proyecto, '.mcp.json')));
    assert.ok(!fs.existsSync(path.join(proyecto, '.claude')));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
