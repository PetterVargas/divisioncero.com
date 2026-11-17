import { test } from 'node:test';
import assert from 'node:assert/strict';
import { toolFaqs } from '../../../lib/herramientas/faqs';
import { tools } from '../../../lib/herramientas/tools';

const internalPaths = tools
  .filter((tool) => !tool.external && tool.href.startsWith('/herramientas/'))
  .map((tool) => tool.href.slice('/herramientas'.length));

test('cada herramienta propia tiene al menos 3 preguntas frecuentes', () => {
  for (const path of internalPaths) {
    assert.ok((toolFaqs[path]?.length ?? 0) >= 3, `faltan preguntas frecuentes para ${path}`);
  }
});

test('no hay preguntas frecuentes de herramientas que no existen', () => {
  for (const path of Object.keys(toolFaqs)) {
    assert.ok(internalPaths.includes(path), `${path} no está en el catálogo de herramientas`);
  }
});
