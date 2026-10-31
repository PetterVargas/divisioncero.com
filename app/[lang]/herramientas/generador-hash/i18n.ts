import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Algoritmo de hash no soportado': 'Unsupported hash algorithm',
  'Entrada inválida': 'Invalid input',
  'Error al generar los hashes: ': 'Error generating the hashes: ',
  'Error desconocido': 'Unknown error',
  'Error al copiar': 'Copy failed',
  'No se pudo copiar al portapapeles': 'Could not copy to the clipboard',
  'Hola mundo! Este es un ejemplo de texto para generar hashes.':
    'Hello world! This is a sample text to generate hashes.',
  'Introduce el texto del que quieres generar los hashes...': 'Enter the text you want to generate hashes from...',
  'Generador de Hash': 'Hash Generator',
  'Texto para generar hash': 'Text to hash',
  'Resultados de Hash': 'Hash Results',
  'Información sobre Funciones Hash': 'About Hash Functions',
  '¿Qué es una función hash?': 'What is a hash function?',
  'Una función hash criptográfica convierte datos de cualquier tamaño en una cadena de longitud fija. Es determinística (mismo input = mismo output) y prácticamente irreversible.':
    'A cryptographic hash function turns data of any size into a fixed-length string. It is deterministic (same input = same output) and practically irreversible.',
  'Rápido pero no seguro': 'Fast but not secure',
  'Solo para checksums simples': 'Only for simple checksums',
  'Vulnerable a colisiones': 'Vulnerable to collisions',
  'Más seguro que MD5': 'Safer than MD5',
  'Deprecado para seguridad': 'Deprecated for security',
  'Aún usado en Git': 'Still used in Git',
  'Estándar actual seguro': 'Current secure standard',
  'Usado en Bitcoin/blockchain': 'Used in Bitcoin/blockchain',
  'Resistente a colisiones': 'Collision resistant',
  'Más seguro que SHA-256': 'Safer than SHA-256',
  'Mejor para datos grandes': 'Better for large data',
  'Usado en certificados SSL/TLS': 'Used in SSL/TLS certificates',
  'Casos de uso comunes:': 'Common use cases:',
  'Verificación de integridad de archivos': 'File integrity verification',
  'Almacenamiento seguro de contraseñas': 'Secure password storage',
  'Identificadores únicos de contenido': 'Unique content identifiers',
  'Firmas digitales y certificados': 'Digital signatures and certificates',
  'Blockchain y criptomonedas': 'Blockchain and cryptocurrencies',
  'Consideraciones importantes:': 'Important considerations:',
  'Los hashes son irreversibles - no puedes obtener el texto original':
    'Hashes are irreversible - you can\'t get the original text back',
  'MD5 y SHA-1 no deben usarse para aplicaciones críticas de seguridad':
    'MD5 and SHA-1 must not be used for security-critical applications',
  'Para contraseñas, usa funciones especializadas como bcrypt o Argon2':
    'For passwords, use specialized functions like bcrypt or Argon2',
  'Pequeños cambios en el input generan hashes completamente diferentes':
    'Small changes in the input produce completely different hashes',
  'Caracteres: {n}': 'Characters: {n}',
  'Límite máximo: {n}': 'Maximum limit: {n}',
  'Longitud: {n} caracteres': 'Length: {n} characters',
  'El texto no puede exceder 10000 caracteres por razones de seguridad':
    'The text cannot exceed 10000 characters for security reasons',
};
