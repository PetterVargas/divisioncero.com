import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'No disponible': 'Not available',
  'Datos ocultos por privacidad': 'Data hidden for privacy',
  'Sin rol': 'No role',
  'Organización': 'Organization',
  'Dominio del ISP': 'ISP domain',
  'Ubicación aproximada': 'Approximate location',
  'Titular del bloque (WHOIS)': 'Block holder (WHOIS)',
  'Nombre de la red': 'Network name',
  'Tipo de asignación': 'Allocation type',
  'País': 'Country',
  'ASN de origen': 'Origin ASN',
  'Red padre': 'Parent network',
  'Fecha de registro': 'Registration date',
  'Última modificación': 'Last modified',
  'Registro regional': 'Regional registry',
  'Servidor WHOIS': 'WHOIS server',
  'El registro no publica contactos para esta red.': 'The registry does not publish contacts for this network.',
  'IANA ID del registrador': 'Registrar IANA ID',
  'Fecha de expiración': 'Expiration date',
  'Servidor RDAP': 'RDAP server',
  'El registro no publica contactos para este dominio.': 'The registry does not publish contacts for this domain.',
  'Introduce una dirección IP (por ejemplo 8.8.8.8) o un dominio válido (por ejemplo divisioncero.com)':
    'Enter an IP address (for example 8.8.8.8) or a valid domain (for example divisioncero.com)',
  'Completa la verificación anti-bots antes de consultar': 'Complete the anti-bot check before searching',
  'No se pudo conectar con el servicio WHOIS. Intenta de nuevo':
    'Could not connect to the WHOIS service. Please try again',
  'Error al generar el PDF': 'Error generating the PDF',
  'Error desconocido': 'Unknown error',
  'La respuesta RDAP se copió al portapapeles': 'The RDAP response was copied to the clipboard',
  'Error al copiar': 'Copy failed',
  'No se pudo copiar al portapapeles': 'Could not copy to the clipboard',
  'Ej: 8.8.8.8, 2800:3f0:4005::1 o divisioncero.com': 'E.g. 8.8.8.8, 2800:3f0:4005::1 or divisioncero.com',
  'Ocultar respuesta RDAP': 'Hide RDAP response',
  'Ver respuesta RDAP completa': 'View full RDAP response',
  'Copiar JSON': 'Copy JSON',
  'Observaciones del registro': 'Registry remarks',
  'Dirección IP consultada': 'Queried IP address',
  'Proveedor de Servicio de Internet (ISP)': 'Internet Service Provider (ISP)',
  'Esta es una dirección privada o reservada: no pertenece a ninguna organización en Internet y su WHOIS solo muestra el bloque reservado por IANA.':
    'This is a private or reserved address: it doesn\'t belong to any organization on the Internet and its WHOIS only shows the block reserved by IANA.',
  'Red asignada': 'Assigned network',
  'Dominio consultado': 'Queried domain',
  'Registro del dominio': 'Domain registration',
  'Servidores de nombres (DNS)': 'Name servers (DNS)',
  'El registro no publica servidores de nombres para este dominio.':
    'The registry does not publish name servers for this domain.',
  'Consultar WHOIS de una IP o dominio': 'Look up the WHOIS of an IP or domain',
  'Dirección IP (IPv4 o IPv6) o dominio': 'IP address (IPv4 or IPv6) or domain',
  'Consultando el registro WHOIS/RDAP...': 'Querying the WHOIS/RDAP registry...',
  'Hash SHA-256 del último PDF descargado:': 'SHA-256 hash of the last downloaded PDF:',
  '¿Qué es el WHOIS de una IP o de un dominio?': 'What is the WHOIS of an IP or a domain?',
  'Cada dirección IP pública pertenece a un bloque asignado por uno de los cinco registros regionales de Internet (LACNIC, ARIN, RIPE NCC, APNIC y AFRINIC). El WHOIS muestra a qué organización se asignó ese bloque, su rango, el país, el sistema autónomo (ASN) que la anuncia y los contactos técnicos y de abuso.':
    'Every public IP address belongs to a block assigned by one of the five regional Internet registries (LACNIC, ARIN, RIPE NCC, APNIC and AFRINIC). The WHOIS shows which organization the block was assigned to, its range, the country, the autonomous system (ASN) announcing it, and the technical and abuse contacts.',
  'En un dominio, el WHOIS lo publica el registro de su extensión (.com, .co, .org...) e indica el registrador con el que se compró, las fechas de registro y expiración, los servidores DNS, si tiene DNSSEC y su estado. Muchos registros ocultan los datos personales del titular por privacidad. Esta herramienta usa RDAP, el protocolo estándar que reemplaza al WHOIS clásico y entrega los mismos datos de forma estructurada.':
    'For a domain, the WHOIS is published by the registry of its extension (.com, .co, .org...) and shows the registrar it was bought from, the registration and expiration dates, the DNS servers, whether it has DNSSEC, and its status. Many registries hide the holder\'s personal data for privacy. This tool uses RDAP, the standard protocol that replaces classic WHOIS and delivers the same data in a structured way.',
  'Usos en ciberseguridad:': 'Uses in cybersecurity:',
  'Identificar el ISP detrás de una IP que aparece en logs o alertas':
    'Identifying the ISP behind an IP that appears in logs or alerts',
  'Encontrar el contacto de abuso para reportar ataques, spam o phishing':
    'Finding the abuse contact to report attacks, spam or phishing',
  'Detectar dominios de phishing recién registrados o que imitan una marca':
    'Detecting newly registered phishing domains or domains that imitate a brand',
  'Revisar cuándo expira un dominio propio para que no lo tome un tercero':
    'Checking when your own domain expires so a third party doesn\'t take it',
  'Documentar evidencias de un incidente con un reporte fechado y verificable':
    'Documenting incident evidence with a dated, verifiable report',
  'Validar si una IP pertenece a un proveedor de nube, VPN o red corporativa':
    'Checking whether an IP belongs to a cloud provider, VPN or corporate network',
  'Sobre el reporte en PDF:': 'About the PDF report:',
  'El PDF se genera en tu navegador a partir de la respuesta WHOIS/RDAP.':
    'The PDF is generated in your browser from the WHOIS/RDAP response.',
  'Al descargarlo, se calcula el hash SHA-256 del archivo y se incluye en el nombre para que puedas verificar su integridad.':
    'When you download it, the file\'s SHA-256 hash is calculated and included in the name so you can verify its integrity.',
  'En una IP, el titular del bloque (WHOIS) y el ISP pueden ser distintos: un proveedor puede recibir el bloque de otra empresa o prestar servicio sobre IPs registradas por un tercero. El ISP se obtiene de un servicio público de consulta por IP (ipwho.is).':
    'For an IP, the block holder (WHOIS) and the ISP can be different: a provider can receive the block from another company or provide service over IPs registered by a third party. The ISP comes from a public IP lookup service (ipwho.is).',
  'Teléfono': 'Phone',
  'Dirección': 'Address',
  'Reporte WHOIS de Dirección IP': 'IP Address WHOIS Report',
  'Dirección IP': 'IP address',
  'Fecha de consulta': 'Lookup date',
  'Fuente RDAP': 'RDAP source',
  'Ubicación aprox.': 'Approx. location',
  'No se encontró información del ISP para esta dirección IP (por ejemplo, rangos privados o reservados).':
    'No ISP information was found for this IP address (for example, private or reserved ranges).',
  'Titular del bloque': 'Block holder',
  'Identificador (handle)': 'Identifier (handle)',
  'Versión IP': 'IP version',
  'La información WHOIS proviene del protocolo RDAP (sucesor de WHOIS) del registro regional de Internet ':
    'The WHOIS information comes from the RDAP protocol (successor of WHOIS) of the regional Internet registry ',
  'responsable de la dirección IP; los datos son públicos y los mantiene el titular de la red. ':
    'responsible for the IP address; the data is public and maintained by the network holder. ',
  'Los datos del ISP provienen de un servicio público de consulta por IP (ipwho.is) y la ubicación es aproximada. ':
    'The ISP data comes from a public IP lookup service (ipwho.is) and the location is approximate. ',
  'El PDF se generó en tu navegador.': 'The PDF was generated in your browser.',
  'Reporte WHOIS de Dominio': 'Domain WHOIS Report',
  'Dominio registrado': 'Registered domain',
  'los datos son públicos y los mantienen el registro y el registrador. Muchos registros ocultan los datos ':
    'the data is public and maintained by the registry and the registrar. Many registries hide the holder\'s ',
  'personales del titular por privacidad. El PDF se generó en tu navegador.':
    'personal data for privacy. The PDF was generated in your browser.',
  'Transferencia bloqueada (registrador)': 'Transfer prohibited (registrar)',
  'Modificación bloqueada (registrador)': 'Update prohibited (registrar)',
  'Eliminación bloqueada (registrador)': 'Delete prohibited (registrar)',
  'Renovación bloqueada (registrador)': 'Renew prohibited (registrar)',
  'Suspendido (registrador)': 'On hold (registrar)',
  'Transferencia bloqueada (registro)': 'Transfer prohibited (registry)',
  'Modificación bloqueada (registro)': 'Update prohibited (registry)',
  'Eliminación bloqueada (registro)': 'Delete prohibited (registry)',
  'Renovación bloqueada (registro)': 'Renew prohibited (registry)',
  'Suspendido (registro)': 'On hold (registry)',
  'Pendiente de eliminación': 'Pending delete',
  'Transferencia en curso': 'Pending transfer',
  'Periodo de redención': 'Redemption period',
  'Periodo de renovación automática': 'Auto-renew period',
  'No firmado': 'Unsigned',
  'Técnico': 'Technical',
  'Facturación': 'Billing',
  'Abuso': 'Abuse',
  'Administrativo': 'Administrative',
  'Registrante': 'Registrant',
  'Registrador': 'Registrar',
  'Estado': 'Status',
  'Activo': 'Active',
  'Firmado': 'Signed',
  'Rango': 'Range',
  'Contactos': 'Contacts',
  'Ciudad': 'City',
  'Región': 'Region',
  'Correo': 'Email',
  'Dirección IP inválida': 'Invalid IP address',
  'Dominio inválido': 'Invalid domain',
  'El registro del dominio limitó las consultas. Intenta de nuevo en unos minutos':
    'The domain registry rate-limited the lookups. Please try again in a few minutes',
  'El registro regional limitó las consultas. Intenta de nuevo en unos minutos':
    'The regional registry rate-limited the lookups. Please try again in a few minutes',
  'El servicio WHOIS/RDAP no respondió correctamente': 'The WHOIS/RDAP service did not respond correctly',
  'Error al consultar el WHOIS': 'Error looking up the WHOIS',
  'La consulta WHOIS tardó demasiado. Intenta de nuevo': 'The WHOIS lookup took too long. Please try again',
  'No se encontró información WHOIS para esta dirección IP': 'No WHOIS information was found for this IP address',
  'No se pudo consultar el WHOIS de la dirección IP': 'The WHOIS of the IP address could not be looked up',
  'No se pudo consultar el WHOIS del dominio': 'The WHOIS of the domain could not be looked up',
  'Solicitud inválida': 'Invalid request',
  'Fecha y hora de generación: {date}': 'Generated on: {date}',
  'La información WHOIS proviene del protocolo RDAP (sucesor de WHOIS) del registro de la extensión ':
    'The WHOIS information comes from the RDAP protocol (successor of WHOIS) of the extension\'s registry ',
  'La información WHOIS proviene del protocolo RDAP (sucesor de WHOIS) del registro de la extensión del dominio; ':
    'The WHOIS information comes from the RDAP protocol (successor of WHOIS) of the domain extension\'s registry; ',
  'Esta IP pertenece al ISP': 'This IP belongs to the ISP',
  'No se encontró información del ISP para esta dirección IP. Titular del bloque según el WHOIS: {name}.':
    'No ISP information was found for this IP address. Block holder according to WHOIS: {name}.',
  'Ninguno de los dos identifica a la persona que usa la dirección; para eso se requiere una solicitud formal al ISP.':
    'Neither identifies the person using the address; that requires a formal request to the ISP.',
};
