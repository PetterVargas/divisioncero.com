import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Contraseñas': 'Passwords',
  'Red y Wi-Fi': 'Network and Wi-Fi',
  'Correo y Phishing': 'Email and Phishing',
  'Seguridad física': 'Physical security',
  'Colaboración': 'Collaboration',
  'Revelar respuesta': 'Reveal answer',
  'Buena práctica': 'Good practice',
  'Mala práctica': 'Bad practice',
  'Discutan en equipo: ¿es una buena o una mala práctica de ciberseguridad? ¿Por qué?':
    'Discuss as a team: is it a good or a bad cybersecurity practice? Why?',
  'Haz clic en cualquier cuadro, discutan en equipo si es buena o mala práctica y revelen la respuesta':
    'Click any box, discuss as a team whether it\'s a good or bad practice, and reveal the answer',
  'Alguien encuentra un cable o memoria USB en la sala de reuniones y lo conecta a su laptop de trabajo para ver de quién es.':
    'Someone finds a cable or USB drive in the meeting room and plugs it into their work laptop to see whose it is.',
  'Un USB de origen desconocido puede contener malware que infecta el equipo apenas se conecta (BadUSB). Nunca se debe conectar hardware desconocido.':
    'A USB device of unknown origin can contain malware that infects the computer as soon as it\'s plugged in (BadUSB). Unknown hardware should never be connected.',
  'El equipo activa el bloqueo automático de pantalla tras pocos minutos de inactividad en todos los laptops.':
    'The team enables automatic screen lock after a few minutes of inactivity on all laptops.',
  'Reduce la ventana de exposición si alguien se aleja de su puesto sin bloquear manualmente el equipo.':
    'It reduces the exposure window if someone walks away from their desk without locking the computer manually.',
  'Un integrante instala software pirata en su equipo de trabajo para ahorrar en licencias.':
    'A team member installs pirated software on their work computer to save on licenses.',
  'El software de fuentes no oficiales suele venir modificado con malware y compromete todo el equipo y la red corporativa.':
    'Software from unofficial sources often comes modified with malware and compromises the whole computer and the corporate network.',
  'El equipo mantiene el sistema operativo y las aplicaciones con actualizaciones automáticas activadas.':
    'The team keeps automatic updates enabled for the operating system and applications.',
  'Las actualizaciones incluyen parches de seguridad que cierran vulnerabilidades ya conocidas y explotadas activamente.':
    'Updates include security patches that close known and actively exploited vulnerabilities.',
  'Se presta la laptop corporativa a un familiar para usarla durante el fin de semana.':
    'The corporate laptop is lent to a family member to use over the weekend.',
  'Expone datos y accesos corporativos a una persona sin autorización ni responsabilidad sobre la información de la empresa.':
    'It exposes corporate data and access to a person with no authorization or responsibility over the company\'s information.',
  'Todo el equipo usa la misma contraseña compartida para el panel de administración del servidor.':
    'The whole team uses the same shared password for the server\'s admin panel.',
  'Sin credenciales individuales no hay trazabilidad de quién hizo qué, y si se filtra, compromete el acceso de todos a la vez.':
    'Without individual credentials there\'s no traceability of who did what, and if it leaks, it compromises everyone\'s access at once.',
  'El equipo usa un gestor de contraseñas compartido con acceso auditado para las credenciales del proyecto.':
    'The team uses a shared password manager with audited access for the project\'s credentials.',
  'Permite rotar credenciales, otorgar o revocar acceso individualmente y mantener un registro de quién las usa.':
    'It allows rotating credentials, granting or revoking access individually, and keeping a record of who uses them.',
  'Un desarrollador deja las credenciales de la base de datos escritas directamente en el código que sube al repositorio.':
    'A developer leaves the database credentials written directly in the code they push to the repository.',
  'Quedan expuestas en el historial de Git para siempre, incluso si luego se eliminan del archivo actual.':
    'They stay exposed in the Git history forever, even if they are later removed from the current file.',
  'El equipo activa autenticación multifactor (MFA) en todas las cuentas corporativas críticas.':
    'The team enables multi-factor authentication (MFA) on all critical corporate accounts.',
  'Aunque una contraseña se filtre, el segundo factor evita que un atacante pueda acceder a la cuenta.':
    'Even if a password leaks, the second factor prevents an attacker from accessing the account.',
  'Alguien reutiliza la contraseña de su correo corporativo en una herramienta externa de terceros.':
    'Someone reuses their corporate email password on an external third-party tool.',
  'Si esa herramienta externa sufre una filtración, la misma contraseña queda expuesta para acceder al correo corporativo.':
    'If that external tool suffers a breach, the same password is exposed and can be used to access the corporate email.',
  'Alguien conecta su laptop de trabajo al wifi abierto de una cafetería para revisar el correo, sin usar VPN.':
    'Someone connects their work laptop to a café\'s open Wi-Fi to check email, without using a VPN.',
  'En una red pública sin cifrar, el tráfico puede ser interceptado por cualquiera conectado a la misma red.':
    'On an unencrypted public network, traffic can be intercepted by anyone connected to the same network.',
  'El equipo exige usar la VPN corporativa siempre que se trabaje desde una red wifi pública.':
    'The team requires using the corporate VPN whenever working from a public Wi-Fi network.',
  'La VPN cifra el tráfico y evita que terceros en la misma red intercepten información sensible.':
    'The VPN encrypts traffic and prevents third parties on the same network from intercepting sensitive information.',
  'Se deja el router de la oficina con el usuario y la contraseña de administración por defecto.':
    'The office router is left with the default admin username and password.',
  'Las credenciales de fábrica son públicas y conocidas; cualquiera en la red podría tomar control del router.':
    'Factory credentials are public and well known; anyone on the network could take control of the router.',
  'El equipo separa la red de invitados de la red interna donde están los servidores y equipos de trabajo.':
    'The team separates the guest network from the internal network where servers and work computers are.',
  'Aísla a los visitantes de los sistemas críticos, así un dispositivo comprometido de un invitado no llega a la red interna.':
    'It isolates visitors from critical systems, so a guest\'s compromised device doesn\'t reach the internal network.',
  'Un integrante hace clic en un enlace de un correo urgente de "IT" pidiendo confirmar su contraseña, sin verificar el remitente.':
    'A team member clicks a link in an urgent email from "IT" asking them to confirm their password, without checking the sender.',
  'Es un patrón clásico de phishing: urgencia, solicitud de credenciales y un remitente que aparenta ser confiable.':
    'It\'s a classic phishing pattern: urgency, a request for credentials and a sender who appears trustworthy.',
  'El equipo reporta a seguridad cualquier correo sospechoso antes de interactuar con él.':
    'The team reports any suspicious email to security before interacting with it.',
  'Permite bloquear la campaña de phishing para el resto de la organización antes de que más personas caigan en ella.':
    'It allows blocking the phishing campaign for the rest of the organization before more people fall for it.',
  'Se responde con archivos adjuntos de trabajo a un remitente desconocido que dice ser un "proveedor nuevo", sin confirmar por otro canal.':
    'Work attachments are sent in reply to an unknown sender claiming to be a "new vendor", without confirming through another channel.',
  'Sin verificar la identidad por un canal distinto, es fácil caer en suplantación de proveedores para robar información.':
    'Without verifying identity through a different channel, it\'s easy to fall for vendor impersonation aimed at stealing information.',
  'Antes de aprobar una transferencia o un cambio de datos bancarios, el equipo confirma la solicitud por un canal distinto al correo.':
    'Before approving a transfer or a change of bank details, the team confirms the request through a channel other than email.',
  'Previene el fraude de compromiso de correo corporativo (BEC), donde un atacante suplanta a un proveedor o directivo por correo.':
    'It prevents business email compromise (BEC) fraud, where an attacker impersonates a vendor or executive by email.',
  'En una videollamada se comparte por error una pantalla con credenciales de prueba y diagramas de arquitectura visibles.':
    'During a video call, a screen with test credentials and architecture diagrams is shared by mistake.',
  'Cualquier participante externo a la llamada puede capturar esa información sensible con una simple captura de pantalla.':
    'Any external participant on the call can capture that sensitive information with a simple screenshot.',
  'El equipo aplica una política de "escritorio limpio": nada con información sensible queda a la vista al terminar la jornada.':
    'The team applies a "clean desk" policy: nothing with sensitive information is left in sight at the end of the day.',
  'Evita que visitantes o personal no autorizado vean o fotografíen documentos confidenciales.':
    'It prevents visitors or unauthorized staff from seeing or photographing confidential documents.',
  'Alguien sostiene la puerta de acceso a la oficina para que entre una persona sin gafete visible.':
    'Someone holds the office access door open for a person with no visible badge.',
  'Es la técnica de "tailgating": permite que alguien no autorizado entre a instalaciones restringidas sin ser verificado.':
    'It\'s the "tailgating" technique: it lets an unauthorized person enter restricted facilities without being verified.',
  'El equipo verifica la identidad de los visitantes y los acompaña siempre dentro de zonas restringidas.':
    'The team verifies visitors\' identity and always escorts them in restricted areas.',
  'Reduce el riesgo de que alguien no autorizado acceda a áreas o equipos sensibles sin supervisión.':
    'It reduces the risk of someone unauthorized accessing sensitive areas or equipment without supervision.',
  'Se desecha en la basura normal un documento impreso con datos de clientes en vez de triturarlo.':
    'A printed document with customer data is thrown in the regular trash instead of being shredded.',
  'Cualquiera con acceso a la basura podría recuperar información confidencial de clientes.':
    'Anyone with access to the trash could recover confidential customer information.',
  'El equipo comparte los archivos de un proyecto sensible con un enlace público "para que sea más rápido".':
    'The team shares the files of a sensitive project via a public link "to make it faster".',
  'Cualquiera con el enlace puede acceder, sin control de quién lo vio, descargó o reenvió.':
    'Anyone with the link can access them, with no control over who viewed, downloaded or forwarded them.',
  'El equipo revisa los permisos de acceso a repositorios y carpetas compartidas cada cierto tiempo.':
    'The team periodically reviews access permissions to repositories and shared folders.',
  'Detecta y elimina accesos que ya no deberían existir, reduciendo la superficie de ataque.':
    'It detects and removes access that should no longer exist, reducing the attack surface.',
  'Un desarrollador despliega a producción directamente, sin pasar por revisión de código ni por el pipeline de seguridad.':
    'A developer deploys directly to production, skipping code review and the security pipeline.',
  'Se saltan controles que detectan vulnerabilidades, credenciales expuestas o errores antes de llegar a producción.':
    'It skips controls that detect vulnerabilities, exposed credentials or errors before they reach production.',
  'El equipo realiza simulacros de phishing e incidentes de seguridad de forma periódica.':
    'The team runs phishing and security incident drills periodically.',
  'Entrena la capacidad de detección y respuesta del equipo en un entorno controlado, antes de un incidente real.':
    'It trains the team\'s detection and response skills in a controlled environment, before a real incident.',
  'Se ignora una alerta de seguridad automatizada porque "seguro es un falso positivo", sin investigarla.':
    'An automated security alert is ignored because "it\'s surely a false positive", without investigating it.',
  'Descartar alertas sin revisarlas puede dejar pasar un incidente real que ya está en curso.':
    'Dismissing alerts without reviewing them can let a real incident that is already underway slip through.',
  'Cuando alguien deja el equipo o cambia de rol, sus accesos se revocan el mismo día.':
    'When someone leaves the team or changes roles, their access is revoked the same day.',
  'Evita cuentas huérfanas con acceso activo que nadie está monitoreando.':
    'It avoids orphaned accounts with active access that no one is monitoring.',
  'El equipo documenta y practica un plan de respuesta a incidentes antes de que ocurra uno real.':
    'The team documents and practices an incident response plan before a real one happens.',
  'Permite reaccionar con roles y pasos claros bajo presión, en vez de improvisar durante una crisis.':
    'It makes it possible to react with clear roles and steps under pressure, instead of improvising during a crisis.',
  'Dispositivos': 'Devices',
  'Práctica #{id}': 'Practice #{id}',
  'Práctica {id}': 'Practice {id}',
  'Progreso: {done}/{total}': 'Progress: {done}/{total}',
};
