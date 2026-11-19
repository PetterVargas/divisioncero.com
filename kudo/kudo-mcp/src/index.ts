#!/usr/bin/env node
/**
 * kudo-mcp — servidor MCP de Kudo.
 *
 *   npx -y @divisioncero/kudo-mcp                     # stdio, lee el proyecto del directorio actual
 *   npx -y @divisioncero/kudo-mcp --dir ./mi-sgx      # otro directorio de proyecto
 *   npx -y @divisioncero/kudo-mcp --http --port 3333  # Streamable HTTP en http://localhost:3333/mcp
 */
import http from 'node:http';
import path from 'node:path';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { cargarDatos } from './data.js';
import { crearServidor, VERSION } from './server.js';

interface Opciones {
  dir: string;
  http: boolean;
  port: number;
  host: string;
}

function leerOpciones(argv: string[]): Opciones {
  const opciones: Opciones = { dir: process.cwd(), http: false, port: 3333, host: '127.0.0.1' };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--dir' || arg === '-d') opciones.dir = path.resolve(argv[++i] ?? '.');
    else if (arg === '--http') opciones.http = true;
    else if (arg === '--port' || arg === '-p') opciones.port = Number(argv[++i]);
    else if (arg === '--host') opciones.host = argv[++i] ?? opciones.host;
    else if (arg === '--version' || arg === '-v') {
      console.log(VERSION);
      process.exit(0);
    } else if (arg === '--help' || arg === '-h') {
      console.log(`kudo-mcp ${VERSION} — servidor MCP de Kudo

Uso:
  kudo-mcp [--dir <proyecto>] [--http] [--port 3333] [--host 127.0.0.1]

Opciones:
  --dir, -d   Directorio del proyecto Kudo (por defecto, el actual)
  --http      Expone el servidor por Streamable HTTP en /mcp en lugar de stdio
  --port, -p  Puerto HTTP (por defecto 3333)
  --host      Interfaz HTTP (por defecto 127.0.0.1, solo local)

Más información: https://divisioncero.com/kudo/framework/overview/mcp-agentes-y-skills`);
      process.exit(0);
    }
  }
  if (!Number.isInteger(opciones.port) || opciones.port <= 0) throw new Error('--port debe ser un número de puerto válido');
  return opciones;
}

async function main() {
  const opciones = leerOpciones(process.argv.slice(2));
  const datos = cargarDatos(opciones.dir);
  // stdout queda reservado para el protocolo MCP: los mensajes van a stderr.
  const log = (m: string) => process.stderr.write(`[kudo-mcp] ${m}\n`);
  log(
    `${datos.controles.size} controles, ${datos.documentos.length} documentos (${datos.carpetaDocumentos ?? 'referencia de Kudo'}), ${datos.agentes.size} agentes, ${datos.skills.size} skills`,
  );

  if (!opciones.http) {
    await crearServidor(datos).connect(new StdioServerTransport());
    return;
  }

  // Modo HTTP sin estado: un servidor y un transporte nuevos por solicitud.
  const httpServer = http.createServer(async (req, res) => {
    const url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
    if (url.pathname !== '/mcp') {
      res.writeHead(404, { 'content-type': 'application/json' }).end(JSON.stringify({ error: 'Usa el endpoint /mcp' }));
      return;
    }
    if (req.method !== 'POST') {
      res.writeHead(405, { allow: 'POST', 'content-type': 'application/json' }).end(
        JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Método no permitido' }, id: null }),
      );
      return;
    }
    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : undefined;
      const server = crearServidor(datos);
      const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
      res.on('close', () => {
        void transport.close();
        void server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (e) {
      log(`Error HTTP: ${e instanceof Error ? e.message : String(e)}`);
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' }).end(
          JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Error interno' }, id: null }),
        );
      }
    }
  });
  httpServer.listen(opciones.port, opciones.host, () => log(`Escuchando en http://${opciones.host}:${opciones.port}/mcp`));
}

main().catch((e) => {
  process.stderr.write(`[kudo-mcp] ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
