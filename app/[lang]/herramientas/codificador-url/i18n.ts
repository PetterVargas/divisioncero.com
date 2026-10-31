import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Entrada inválida': 'Invalid input',
  'Error inesperado al procesar el texto': 'Unexpected error while processing the text',
  'El resultado ha sido copiado al portapapeles': 'The result has been copied to the clipboard',
  'Error al copiar': 'Copy failed',
  'No se pudo copiar al portapapeles': 'Could not copy to the clipboard',
  'Cambiar a Decodificar': 'Switch to Decode',
  'Cambiar a Codificar': 'Switch to Encode',
  'Casos de uso comunes:': 'Common use cases:',
  'Texto decodificado': 'Decoded text',
  'Texto a codificar': 'Text to encode',
  'Consideraciones de seguridad:': 'Security considerations:',
  'Para datos sensibles, usa métodos de encriptación apropiados': 'For sensitive data, use proper encryption methods',
  'Resultado copiado': 'Result copied',
  'Copiado': 'Copied',
  'Resultado': 'Result',
  'Copiar resultado': 'Copy result',
  'Limpiar': 'Clear',
  'Error al codificar: el texto contiene caracteres no válidos': 'Encoding error: the text contains invalid characters',
  'Error al decodificar: URL encoding inválido o corrupto': 'Decoding error: invalid or corrupted URL encoding',
  'Codificar URL': 'Encode URL',
  'Decodificar URL': 'Decode URL',
  'URL o texto a codificar': 'URL or text to encode',
  'URL codificada a decodificar': 'Encoded URL to decode',
  'Introduce la URL o texto que quieres codificar...\nEjemplo: https://ejemplo.com/buscar?q=mi consulta&filtro=activo':
    'Enter the URL or text you want to encode...\nExample: https://example.com/search?q=my query&filter=active',
  'Introduce la URL codificada que quieres decodificar...\nEjemplo: https%3A//ejemplo.com/buscar%3Fq%3Dmi%20consulta%26filtro%3Dactivo':
    'Enter the encoded URL you want to decode...\nExample: https%3A//example.com/search%3Fq%3Dmy%20query%26filter%3Dactive',
  'Información sobre URL Encoding': 'About URL Encoding',
  '¿Qué es URL Encoding?': 'What is URL Encoding?',
  'URL encoding (también conocido como percent-encoding) convierte caracteres especiales en URLs a un formato seguro para transmisión web. Los caracteres se representan con % seguido de su código hexadecimal.':
    'URL encoding (also known as percent-encoding) converts special characters in URLs into a format that is safe for web transmission. Characters are represented with % followed by their hexadecimal code.',
  'Caracteres comunes codificados:': 'Common encoded characters:',
  'Parámetros de consulta en URLs con espacios o caracteres especiales':
    'Query parameters in URLs with spaces or special characters',
  'Formularios web que envían datos por GET': 'Web forms that send data via GET',
  'APIs REST con parámetros en la URL': 'REST APIs with parameters in the URL',
  'Redirecciones con URLs como parámetros': 'Redirects with URLs as parameters',
  'Construcción dinámica de enlaces': 'Dynamic link building',
  'Buenas prácticas:': 'Best practices:',
  'Siempre codifica parámetros de URL que contengan datos de usuario':
    'Always encode URL parameters that contain user data',
  'No codifiques toda la URL, solo los parámetros necesarios':
    'Don\'t encode the whole URL, only the necessary parameters',
  'Usa las funciones nativas del lenguaje (encodeURIComponent en JS)':
    'Use the language\'s native functions (encodeURIComponent in JS)',
  'Decodifica URLs antes de mostrarlas al usuario para mejor legibilidad':
    'Decode URLs before showing them to the user for better readability',
  'Caracteres: {n}': 'Characters: {n}',
  'Límite máximo: {n}': 'Maximum limit: {n}',
  'Longitud: {n} caracteres': 'Length: {n} characters',
  'El texto no puede exceder 10000 caracteres por razones de seguridad':
    'The text cannot exceed 10000 characters for security reasons',
};
