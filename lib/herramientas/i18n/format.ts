/** Reemplaza los marcadores `{clave}` de un texto del diccionario. */
export function format(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
