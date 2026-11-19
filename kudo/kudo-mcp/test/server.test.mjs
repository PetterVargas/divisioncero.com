// Pruebas de extremo a extremo: levantan dist/index.js por stdio y lo usan con el cliente MCP oficial.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const PKG = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let client;
let vacio;

const llamar = async (name, args = {}) => {
  const r = await client.callTool({ name, arguments: args });
  return { ...r, texto: r.content.map((c) => c.text).join('') };
};

before(async () => {
  // Directorio sin documentos: el servidor debe usar los de referencia empaquetados.
  vacio = fs.mkdtempSync(path.join(os.tmpdir(), 'kudo-mcp-'));
  client = new Client({ name: 'kudo-mcp-test', version: '1.0.0' });
  await client.connect(
    new StdioClientTransport({ command: process.execPath, args: [path.join(PKG, 'dist/index.js'), '--dir', vacio], stderr: 'ignore' }),
  );
});

after(async () => {
  await client?.close();
  fs.rmSync(vacio, { recursive: true, force: true });
});

test('expone las herramientas de Kudo', async () => {
  const { tools } = await client.listTools();
  const nombres = tools.map((t) => t.name);
  for (const n of ['kudo_buscar', 'kudo_obtener_control', 'kudo_listar_documentos', 'kudo_obtener_documento', 'kudo_cobertura', 'kudo_obtener_modelo_oscal', 'kudo_crear_item_poam', 'kudo_listar_agentes', 'kudo_obtener_agente', 'kudo_obtener_skill']) {
    assert.ok(nombres.includes(n), `falta ${n}`);
  }
});

test('obtiene un control con sus requisitos y documentos', async () => {
  const r = await llamar('kudo_obtener_control', { id: 'CIP-2' });
  const control = JSON.parse(r.texto);
  assert.equal(control.id, 'cip-2');
  assert.ok(control.requisitos.length > 5);
  assert.ok(control.documentos.some((d) => d.slug === 'politica-de-gestion-de-accesos'));
});

test('informa un error claro para un control inexistente', async () => {
  const r = await llamar('kudo_obtener_control', { id: 'xyz-9' });
  assert.equal(r.isError, true);
});

test('busca sin importar tildes', async () => {
  const r = JSON.parse((await llamar('kudo_buscar', { consulta: 'autenticacion multifactor' })).texto);
  assert.ok(r.length > 0);
  assert.ok(r.some((x) => x.id === 'cip-2' || x.id === 'politica-de-gestion-de-accesos'));
});

test('los documentos de referencia cubren los 36 controles', async () => {
  const r = JSON.parse((await llamar('kudo_cobertura')).texto);
  assert.equal(r.totalControles, 36);
  assert.deepEqual(r.brechas, []);
});

test('lee un documento como Markdown sin sintaxis MDX', async () => {
  const r = await llamar('kudo_obtener_documento', { slug: 'politica-de-gestion-de-riesgos' });
  assert.match(r.texto, /POL-COR-03/);
  assert.doesNotMatch(r.texto, /\{\/\*/);
});

test('crea un ítem de POA&M con plazo según severidad', async () => {
  const r = JSON.parse(
    (await llamar('kudo_crear_item_poam', { control: 'adr-2', titulo: 'Parches vencidos', descripcion: 'Hay servidores sin parches críticos.', remediacion: 'Aplicar parches.', severidad: 'alta', fechaDeteccion: '2027-01-01' })).texto,
  );
  assert.equal(r.risk.deadline, '2027-03-02T00:00:00Z');
  assert.equal(r['poam-item']['related-risks'][0]['risk-uuid'], r.risk.uuid);
});

test('expone un prompt por agente con sus skills', async () => {
  const { prompts } = await client.listPrompts();
  assert.equal(prompts.length, 8);
  const p = await client.getPrompt({ name: 'agente-ciso', arguments: { tarea: 'Prioriza mi programa' } });
  const texto = p.messages[0].content.text;
  assert.match(texto, /Skill: kudo-gestion-de-riesgos/);
  assert.match(texto, /Prioriza mi programa/);
});

test('lista y lee recursos OSCAL y skills', async () => {
  const { resources } = await client.listResources();
  assert.ok(resources.some((r) => r.uri === 'kudo://oscal/poam'));
  assert.ok(resources.some((r) => r.uri === 'kudo://oscal/mapping'));
  const skill = await client.readResource({ uri: 'kudo://skills/kudo-oscal' });
  assert.match(skill.contents[0].text, /name: kudo-oscal/);
});
