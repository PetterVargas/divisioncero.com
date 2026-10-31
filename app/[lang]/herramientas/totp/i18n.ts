import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Mi empresa': 'My company',
  'Código QR con la URI otpauth': 'QR code with the otpauth URI',
  'Copiar URI': 'Copy URI',
  'Clave secreta (Base32)': 'Secret key (Base32)',
  'Dígitos': 'Digits',
  'Periodo (segundos)': 'Period (seconds)',
  'Se actualiza en': 'Refreshes in',
  'Copiar enlace con esta configuración': 'Copy link with this configuration',
  'Agregar a una app autenticadora': 'Add to an authenticator app',
  'Escanea el código QR con Google Authenticator, Microsoft Authenticator, Authy u otra app compatible para comprobar que genera los mismos códigos.':
    'Scan the QR code with Google Authenticator, Microsoft Authenticator, Authy or another compatible app to check that it generates the same codes.',
  'Emisor (opcional)': 'Issuer (optional)',
  'Cuenta (opcional)': 'Account (optional)',
  '¿Cómo funciona TOTP?': 'How does TOTP work?',
  'TOTP (RFC 6238) combina una clave secreta compartida con la hora actual para generar un código que cambia cada cierto número de segundos':
    'TOTP (RFC 6238) combines a shared secret key with the current time to generate a code that changes every few seconds',
  'El servidor y tu app calculan el mismo código de forma independiente, sin conexión':
    'The server and your app compute the same code independently, offline',
  'Todos los cálculos se hacen en tu navegador: la clave secreta nunca se envía a ningún servidor':
    'All calculations happen in your browser: the secret key is never sent to any server',
  'Clave secreta inválida': 'Invalid secret key',
  'No se pudo calcular el código': 'The code could not be computed',
  'Error al copiar': 'Copy failed',
  'No se pudo copiar al portapapeles': 'Could not copy to the clipboard',
  'Código copiado': 'Code copied',
  'Enlace copiado': 'Link copied',
  'Ocultar clave': 'Hide key',
  'Mostrar clave': 'Show key',
  'Generar clave aleatoria': 'Generate random key',
  'Copiar código': 'Copy code',
  'La configuración estándar es SHA-1, 6 dígitos y 30 segundos; cámbiala solo si el servicio lo indica':
    'The standard configuration is SHA-1, 6 digits and 30 seconds; change it only if the service says so',
  'El enlace para compartir guarda la clave en el fragmento (#) de la URL; trátalo como una contraseña':
    'The share link stores the key in the URL fragment (#); treat it like a password',
};
