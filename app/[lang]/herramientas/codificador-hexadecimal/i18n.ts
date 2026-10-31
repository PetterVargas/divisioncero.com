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
  'El texto contiene caracteres que no son hexadecimales válidos (0-9, A-F).':
    'The text contains characters that are not valid hexadecimal (0-9, A-F).',
  'La cadena hexadecimal tiene un número impar de dígitos: faltan bytes completos.':
    'The hexadecimal string has an odd number of digits: complete bytes are missing.',
  'Los bytes decodificados no forman texto UTF-8 válido.': 'The decoded bytes do not form valid UTF-8 text.',
  'Codificar a Hexadecimal': 'Encode to Hexadecimal',
  'Decodificar desde Hexadecimal': 'Decode from Hexadecimal',
  'Hexadecimal a decodificar': 'Hexadecimal to decode',
  'Introduce el texto que quieres codificar en hexadecimal...': 'Enter the text you want to encode in hexadecimal...',
  'Introduce el hexadecimal a decodificar (con o sin espacios, ej. 48 65 6c 6c 6f)...':
    'Enter the hexadecimal to decode (with or without spaces, e.g. 48 65 6c 6c 6f)...',
  'Resultado hexadecimal': 'Hexadecimal result',
  'Información sobre codificación hexadecimal': 'About hexadecimal encoding',
  '¿Qué es la codificación hexadecimal?': 'What is hexadecimal encoding?',
  'Representa cada byte de un texto (codificado en UTF-8) como dos dígitos en base 16 (0-9 y A-F). Es una forma legible de inspeccionar o transmitir datos binarios, muy usada en programación, protocolos de red y análisis de datos.':
    'It represents each byte of a text (encoded in UTF-8) as two base-16 digits (0-9 and A-F). It is a readable way to inspect or transmit binary data, widely used in programming, network protocols and data analysis.',
  'Depuración de datos binarios o payloads de red': 'Debugging binary data or network payloads',
  'Representar colores, hashes o claves criptográficas': 'Representing colors, hashes or cryptographic keys',
  'Inspeccionar el contenido crudo de un archivo': 'Inspecting the raw content of a file',
  'Interoperar con sistemas que esperan datos en hex': 'Interoperating with systems that expect hex data',
  'El hexadecimal NO es un método de encriptación, solo codificación':
    'Hexadecimal is NOT an encryption method, only an encoding',
  'Los datos codificados en hexadecimal se decodifican trivialmente': 'Hex-encoded data is trivially decoded',
  'No uses hexadecimal para ocultar información sensible': 'Don\'t use hexadecimal to hide sensitive information',
  'Caracteres: {n}': 'Characters: {n}',
  'Límite máximo: {n}': 'Maximum limit: {n}',
  'Longitud: {n} caracteres': 'Length: {n} characters',
  'El texto no puede exceder 10000 caracteres por razones de seguridad':
    'The text cannot exceed 10000 characters for security reasons',
};
