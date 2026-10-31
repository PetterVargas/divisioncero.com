import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Ver resultados': 'See results',
  'Siguiente escenario': 'Next scenario',
  '¡Quiz completado!': 'Quiz completed!',
  '¿Qué pilar(es) de la tríada CIA se ven afectados? (selecciona uno o más)':
    'Which CIA triad pillar(s) are affected? (select one or more)',
  'Comprobar respuesta': 'Check answer',
  'Principio clave': 'Key principle',
  'Ataques y amenazas comunes': 'Common attacks and threats',
  'Controles y mitigaciones típicas': 'Typical controls and mitigations',
  'Confidencialidad': 'Confidentiality',
  'Integridad': 'Integrity',
  'Disponibilidad': 'Availability',
  '¿Quién puede ver esta información?': 'Who can see this information?',
  'Garantiza que la información solo sea accesible para las personas, sistemas o procesos autorizados a verla.':
    'Ensures information is accessible only to the people, systems or processes authorized to see it.',
  'Principio del menor privilegio: cada quien accede solo a lo que necesita.':
    'Principle of least privilege: everyone accesses only what they need.',
  'Robo o filtración de datos (data breach)': 'Data theft or leak (data breach)',
  'Ataques de phishing para robar credenciales': 'Phishing attacks to steal credentials',
  'Espionaje de tráfico de red (sniffing)': 'Network traffic eavesdropping (sniffing)',
  'Acceso indebido por permisos mal configurados': 'Improper access due to misconfigured permissions',
  'Cifrado de datos en reposo y en tránsito': 'Encryption of data at rest and in transit',
  'Control de acceso basado en roles (RBAC)': 'Role-based access control (RBAC)',
  'Autenticación multifactor (MFA)': 'Multi-factor authentication (MFA)',
  'Clasificación y etiquetado de información': 'Information classification and labeling',
  '¿Puedo confiar en que esta información no fue alterada?': 'Can I trust that this information was not altered?',
  'Asegura que la información sea exacta, completa y que no haya sido modificada de forma no autorizada o accidental.':
    'Ensures information is accurate, complete and has not been modified in an unauthorized or accidental way.',
  'Toda modificación debe ser rastreable, autorizada y verificable.':
    'Every change must be traceable, authorized and verifiable.',
  'Manipulación de datos en tránsito (man-in-the-middle)': 'Tampering with data in transit (man-in-the-middle)',
  'Inyección SQL que altera registros': 'SQL injection that alters records',
  'Malware que modifica archivos o configuraciones': 'Malware that modifies files or configurations',
  'Alteración de logs para ocultar un ataque': 'Tampering with logs to hide an attack',
  'Funciones hash y firmas digitales': 'Hash functions and digital signatures',
  'Control de versiones y logs de auditoría': 'Version control and audit logs',
  'Validación de entradas y checksums': 'Input validation and checksums',
  'Permisos de escritura restringidos': 'Restricted write permissions',
  '¿Puedo acceder a esta información cuando la necesito?': 'Can I access this information when I need it?',
  'Garantiza que los sistemas y datos estén accesibles y operativos para los usuarios autorizados cuando los necesiten.':
    'Ensures systems and data are accessible and operational for authorized users when they need them.',
  'Los sistemas deben resistir fallas e interrupciones y recuperarse rápido.':
    'Systems must withstand failures and outages and recover quickly.',
  'Ataques de denegación de servicio (DoS/DDoS)': 'Denial-of-service attacks (DoS/DDoS)',
  'Ransomware que bloquea el acceso a archivos': 'Ransomware that blocks access to files',
  'Fallas de hardware sin redundancia': 'Hardware failures without redundancy',
  'Cortes de energía o desastres naturales': 'Power outages or natural disasters',
  'Redundancia y balanceo de carga': 'Redundancy and load balancing',
  'Copias de seguridad (backups) periódicas': 'Regular backups',
  'Planes de continuidad y recuperación ante desastres': 'Business continuity and disaster recovery plans',
  'Monitoreo y mitigación de DDoS': 'DDoS monitoring and mitigation',
  'Un atacante intercepta el tráfico de una red Wi-Fi pública y lee los correos de otro usuario sin que este lo note.':
    'An attacker intercepts traffic on a public Wi-Fi network and reads another user\'s emails without them noticing.',
  'Se expone información a alguien no autorizado, sin que se modifique ni se afecte el acceso: es un problema de confidencialidad.':
    'Information is exposed to someone unauthorized, without being modified and without affecting access: it\'s a confidentiality problem.',
  'Un ataque DDoS satura los servidores de una tienda en línea y los clientes no pueden completar sus compras durante horas.':
    'A DDoS attack overwhelms an online store\'s servers and customers can\'t complete their purchases for hours.',
  'El servicio deja de estar accesible para usuarios legítimos: afecta directamente la disponibilidad.':
    'The service stops being accessible to legitimate users: it directly affects availability.',
  'Un empleado descontento modifica silenciosamente los registros contables de la empresa antes de renunciar.':
    'A disgruntled employee quietly modifies the company\'s accounting records before resigning.',
  'Los datos son alterados de forma no autorizada, comprometiendo su exactitud: es un problema de integridad.':
    'The data is altered without authorization, compromising its accuracy: it\'s an integrity problem.',
  'Un ransomware cifra todos los archivos de un hospital y exige un pago para restaurar el acceso.':
    'Ransomware encrypts all of a hospital\'s files and demands payment to restore access.',
  'Aunque cifra los datos, el objetivo del ataque es bloquear el acceso legítimo: el impacto principal es sobre la disponibilidad.':
    'Although it encrypts the data, the goal of the attack is to block legitimate access: the main impact is on availability.',
  'Una base de datos con contraseñas queda expuesta públicamente por un bucket de almacenamiento mal configurado.':
    'A database of passwords is publicly exposed through a misconfigured storage bucket.',
  'Información sensible queda visible para cualquiera, sin autorización: afecta la confidencialidad.':
    'Sensitive information becomes visible to anyone, without authorization: it affects confidentiality.',
  'Un atacante intercepta una transferencia bancaria y cambia el número de cuenta destino antes de que llegue al banco.':
    'An attacker intercepts a bank transfer and changes the destination account number before it reaches the bank.',
  'Se altera el contenido de la transacción en tránsito: compromete la integridad de los datos.':
    'The content of the transaction is altered in transit: it compromises data integrity.',
  'Una falla eléctrica sin generador de respaldo apaga el centro de datos de una aerolínea, cancelando vuelos por falta de sistemas.':
    'A power failure with no backup generator shuts down an airline\'s data center, canceling flights because systems are down.',
  'No hay pérdida ni alteración de datos, pero los sistemas quedan inaccesibles: es disponibilidad.':
    'No data is lost or altered, but the systems become inaccessible: it\'s availability.',
  'Un malware modifica el hash de un instalador oficial para incluir una puerta trasera, y el usuario lo descarga confiando en que es legítimo.':
    'Malware modifies an official installer to include a backdoor, and the user downloads it trusting that it is legitimate.',
  'El archivo fue alterado de forma no autorizada respecto a su versión original: es integridad.':
    'The file was altered without authorization compared to its original version: it\'s integrity.',
  'Un exempleado conserva acceso a un sistema interno tras dejar la empresa y consulta información de clientes sin permiso.':
    'A former employee keeps access to an internal system after leaving the company and looks up customer information without permission.',
  'El acceso no autorizado a información privada es, ante todo, un problema de confidencialidad.':
    'Unauthorized access to private information is, above all, a confidentiality problem.',
  'Un ataque combinado cifra archivos con ransomware y además filtra copias de esos archivos a la dark web (doble extorsión).':
    'A combined attack encrypts files with ransomware and also leaks copies of those files to the dark web (double extortion).',
  'Aquí hay dos impactos: los archivos originales dejan de estar disponibles (cifrados) y su contenido queda expuesto (filtrado).':
    'There are two impacts here: the original files are no longer available (encrypted) and their content is exposed (leaked).',
  'Escenario {n} de {total}': 'Scenario {n} of {total}',
  'Puntaje: {score}/{total}': 'Score: {score}/{total}',
  '¡Correcto!': 'Correct!',
  'No del todo.': 'Not quite.',
};
