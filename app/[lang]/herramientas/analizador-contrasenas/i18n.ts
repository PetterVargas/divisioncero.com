import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Muy débil': 'Very weak',
  'Débil': 'Weak',
  'Aceptable': 'Fair',
  'Fuerte': 'Strong',
  'Muy fuerte': 'Very strong',
  'Minúsculas': 'Lowercase',
  'Mayúsculas': 'Uppercase',
  'Números': 'Numbers',
  'Símbolos': 'Symbols',
  'Ingresa una contraseña...': 'Enter a password...',
  'Ocultar contraseña': 'Hide password',
  'Mostrar contraseña': 'Show password',
  'Escribe una contraseña para analizarla': 'Type a password to analyze it',
  'Puntos débiles detectados': 'Weaknesses detected',
  '¿Cuánto tardaría en descifrarse?': 'How long would it take to crack?',
  'Todo el análisis ocurre en tu navegador: la contraseña nunca se envía ni se almacena en ningún servidor.':
    'All analysis happens in your browser: the password is never sent to or stored on any server.',
  '¿Cómo se calcula esto?': 'How is this calculated?',
  'Se estima la': 'We estimate the',
  'entropía': 'entropy',
  'de la contraseña (cuántas combinaciones distintas tendría que probar un atacante) según su longitud y los tipos de caracteres usados, y se penalizan patrones predecibles o contraseñas comunes. Con esa entropía se calcula, para cada escenario, cuánto tardaría en promedio un ataque de fuerza bruta a la velocidad de cómputo típica de hardware de descifrado actual. Es una aproximación educativa: los tiempos reales dependen del hardware exacto del atacante y de si tu contraseña fue filtrada en texto plano por otra vía.':
    'of the password (how many different combinations an attacker would have to try) based on its length and the character types used, penalizing predictable patterns or common passwords. With that entropy we calculate, for each scenario, how long an average brute-force attack would take at the typical computing speed of current cracking hardware. It is an educational approximation: real times depend on the attacker\'s exact hardware and on whether your password was leaked in plain text some other way.',
  'Login online con límite de intentos': 'Online login with attempt limits',
  'Un sitio que bloquea la cuenta tras varios intentos fallidos.':
    'A site that locks the account after several failed attempts.',
  'Login online sin protección': 'Unprotected online login',
  'Un servicio sin límite de intentos ni captcha.': 'A service with no attempt limit or captcha.',
  'Offline, hash lento (bcrypt / Argon2)': 'Offline, slow hash (bcrypt / Argon2)',
  'La base de datos se filtró y el hash está bien protegido.':
    'The database was leaked and the hash is well protected.',
  'Offline, hash rápido (SHA-256) con GPU': 'Offline, fast hash (SHA-256) with a GPU',
  'Hash filtrado sin protección adecuada, atacado con una GPU potente.':
    'A leaked hash without proper protection, attacked with a powerful GPU.',
  'Offline, clúster de GPUs (MD5 / SHA-1)': 'Offline, GPU cluster (MD5 / SHA-1)',
  'Ataque con un clúster de GPUs contra un hash débil y sin sal.':
    'An attack with a GPU cluster against a weak, unsalted hash.',
  'Instantáneamente': 'Instantly',
  'contraseña': 'password',
  'Es muy corta: se recomiendan al menos 12 caracteres.': 'It is very short: at least 12 characters are recommended.',
  'Usa un solo tipo de carácter, lo que reduce mucho las combinaciones posibles.':
    'It uses a single character type, which greatly reduces the possible combinations.',
  'Contiene una secuencia predecible (como "abcd", "1234" o "qwerty").':
    'It contains a predictable sequence (like "abcd", "1234" or "qwerty").',
  'Contiene caracteres repetidos consecutivos (como "aaa" o "111").':
    'It contains consecutive repeated characters (like "aaa" or "111").',
  'Está entre las contraseñas más usadas del mundo: los atacantes la prueban primero, sin importar su longitud.':
    'It is among the most used passwords in the world: attackers try it first, regardless of its length.',
  'Regular': 'Fair',
  '{n} segundos': '{n} seconds',
  '{n} minutos': '{n} minutes',
  '{n} horas': '{n} hours',
  '{n} días': '{n} days',
  '{n} años': '{n} years',
  '{n} mil años': '{n} thousand years',
  '{n} millones de años': '{n} million years',
  '{n} mil millones de años': '{n} billion years',
  '10^{n} años': '10^{n} years',
  'Entropía estimada: {bits} bits · {n} caracteres': 'Estimated entropy: {bits} bits · {n} characters',
};
