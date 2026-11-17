import { baseUrl } from '@/lib/shared';

/** Los índices de fumadocs usan rutas relativas; en llms.txt van absolutas. */
export function absoluteLinks(markdown: string) {
  return markdown.replace(/\]\(\//g, `](${baseUrl}/`);
}

/** Baja un nivel los títulos (y quita las citas) para anidar el índice de una sección. */
export function nestSection(markdown: string) {
  return markdown.replace(/^(#{1,5}) /gm, '#$1 ').replace(/^> (.*)$/gm, '$1');
}

/** Respuesta de texto plano en UTF-8 (la exportación estática sirve el archivo como .txt). */
export function textResponse(content: string) {
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
