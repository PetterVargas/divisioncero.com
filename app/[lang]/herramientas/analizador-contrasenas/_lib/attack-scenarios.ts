export interface AttackScenario {
  id: string;
  label: string;
  description: string;
  guessesPerSecond: number;
}

// Órdenes de magnitud de referencia (benchmarks públicos de hashcat/hardware
// de descifrado actual). Son estimaciones ilustrativas, no medidas exactas.
export const attackScenarios: AttackScenario[] = [
  {
    id: 'online-limitado',
    label: 'Login online con límite de intentos',
    description: 'Un sitio que bloquea la cuenta tras varios intentos fallidos.',
    guessesPerSecond: 100 / 3600,
  },
  {
    id: 'online-sin-limite',
    label: 'Login online sin protección',
    description: 'Un servicio sin límite de intentos ni captcha.',
    guessesPerSecond: 10,
  },
  {
    id: 'offline-lento',
    label: 'Offline, hash lento (bcrypt / Argon2)',
    description: 'La base de datos se filtró y el hash está bien protegido.',
    guessesPerSecond: 10_000,
  },
  {
    id: 'offline-rapido',
    label: 'Offline, hash rápido (SHA-256) con GPU',
    description: 'Hash filtrado sin protección adecuada, atacado con una GPU potente.',
    guessesPerSecond: 20_000_000_000,
  },
  {
    id: 'offline-cluster',
    label: 'Offline, clúster de GPUs (MD5 / SHA-1)',
    description: 'Ataque con un clúster de GPUs contra un hash débil y sin sal.',
    guessesPerSecond: 200_000_000_000,
  },
];

const YEAR_SECONDS = 365.25 * 24 * 3600;

// Tiempo promedio: se asume que, en promedio, un atacante recorre la mitad
// del espacio de búsqueda antes de acertar.
export function crackTimeSeconds(entropyBits: number, guessesPerSecond: number): number {
  if (entropyBits <= 0 || guessesPerSecond <= 0) return 0;
  return Math.pow(2, entropyBits) / guessesPerSecond / 2;
}

export function formatDuration(seconds: number, t: (text: string, variables?: Record<string, string | number>) => string = (text) => text): string {
  if (!Number.isFinite(seconds) || seconds < 1) return t('Instantáneamente');
  if (seconds < 60) return t('{n} segundos', { n: Math.round(seconds) });
  if (seconds < 3600) return t('{n} minutos', { n: Math.round(seconds / 60) });
  if (seconds < 86400) return t('{n} horas', { n: Math.round(seconds / 3600) });
  if (seconds < YEAR_SECONDS) return t('{n} días', { n: Math.round(seconds / 86400) });

  const years = seconds / YEAR_SECONDS;
  if (years < 1000) return t('{n} años', { n: Math.round(years) });
  if (years < 1_000_000) return t('{n} mil años', { n: Math.round(years / 1000) });
  if (years < 1_000_000_000) return t('{n} millones de años', { n: Math.round(years / 1_000_000) });
  if (years < 1_000_000_000_000) return t('{n} mil millones de años', { n: Math.round(years / 1_000_000_000) });

  const exponent = Math.floor(Math.log10(years));
  return t('10^{n} años', { n: exponent });
}
