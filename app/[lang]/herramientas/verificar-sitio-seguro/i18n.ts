import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Paso anterior': 'Previous step',
  'Paso siguiente': 'Next step',
  'Reiniciar animación': 'Restart animation',
  'No seguro': 'Not secure',
  'Certificado digital': 'Digital certificate',
  'Emitido para:': 'Issued to:',
  'Emitido por:': 'Issued by:',
  'Válido hasta:': 'Valid until:',
  '0 advertencias de seguridad del navegador': '0 browser security warnings',
  'mibanco.com verificado como seguro': 'mibanco.com verified as secure',
  'Sin cifrado (HTTP)': 'No encryption (HTTP)',
  'Esta conexión no está cifrada. Cualquier persona en la misma red podría leer o modificar los datos que envías, incluyendo contraseñas.':
    'This connection is not encrypted. Anyone on the same network could read or modify the data you send, including passwords.',
  'Conexión cifrada (HTTPS)': 'Encrypted connection (HTTPS)',
  'Aparece el candado y el prefijo "https://": los datos viajan cifrados entre tu navegador y el sitio, y ya no pueden leerse en tránsito.':
    'The padlock and the "https://" prefix appear: data travels encrypted between your browser and the site, and can no longer be read in transit.',
  'El dominio es exactamente el oficial': 'The domain is exactly the official one',
  'HTTPS no basta: verifica que el dominio sea idéntico al oficial. Una variación como "mibanco-verificacion.com" es una señal clásica de phishing, aunque también use candado.':
    'HTTPS is not enough: check that the domain is identical to the official one. A variation like "mibanco-verificacion.com" is a classic phishing sign, even if it also has a padlock.',
  'Certificado digital válido': 'Valid digital certificate',
  'Al revisar el certificado, confirma que fue emitido para ese dominio específico por una autoridad certificadora reconocida, y que sigue vigente.':
    'When reviewing the certificate, confirm it was issued for that specific domain by a recognized certificate authority and that it is still valid.',
  'Sin advertencias del navegador': 'No browser warnings',
  'El navegador no muestra alertas de contenido mixto ni de certificado inválido. Cualquier advertencia aquí debería detenerte de inmediato.':
    'The browser shows no mixed-content or invalid-certificate alerts. Any warning here should stop you immediately.',
  'Sitio verificado como seguro': 'Site verified as secure',
  'Cifrado activo, dominio correcto, certificado válido y sin advertencias: ya puedes confiar en que la conexión con este sitio es segura.':
    'Encryption active, correct domain, valid certificate and no warnings: you can now trust that the connection to this site is secure.',
  'Paso {n} de {total}:': 'Step {n} of {total}:',
};
