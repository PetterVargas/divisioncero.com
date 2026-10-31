// Clave de localStorage/clase del banner descartable. Usa la misma codificación
// que el <Banner> de fumadocs-ui para respetar a quien ya lo cerró.
export const subscribeBannerId = 'subscribe-divisioncero';

function encodeBase32(str: string) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
  let encoded = '';
  let buffer = 0;
  let bitsLeft = 0;
  for (let i = 0; i < str.length; i++) {
    buffer = (buffer << 8) | str.charCodeAt(i);
    bitsLeft += 8;
    while (bitsLeft >= 5) {
      bitsLeft -= 5;
      encoded += alphabet[(buffer >> bitsLeft) & 31];
    }
  }
  if (bitsLeft > 0) encoded += alphabet[(buffer << (5 - bitsLeft)) & 31];
  return encoded;
}

export function bannerKey(id: string) {
  return `nd-banner-${encodeBase32(id)}`;
}

/**
 * Script para el <head>: oculta el banner antes de hidratar si ya se cerró,
 * así no parpadea. Va en el root layout (componente de servidor) porque React
 * no ejecuta un <script> renderizado dentro de un componente cliente.
 */
export function bannerHideScript(id: string) {
  const key = bannerKey(id);
  return `try{if(localStorage.getItem('${key}')==='true')document.documentElement.classList.add('${key}')}catch(e){}`;
}
