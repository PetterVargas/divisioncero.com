/**
 * Textos propios del sitio. El español es el idioma fuente: la clave es el texto en
 * español y aquí solo se declara su traducción. Si falta una entrada se muestra el
 * texto original, así que nunca queda una página sin texto.
 *
 * Se usa igual en servidor (`getT(lang)`) y en cliente (`useT()` de `components/i18n`).
 */
export type Dictionary = Record<string, string>;

export const siteEn: Dictionary = {
  // Navbar
  Precio: 'Pricing',
  Documentación: 'Documentation',
  Recursos: 'Resources',
  'Síguenos en GitHub': 'Follow us on GitHub',
  'Iniciar sesión': 'Sign in',
  'Regístrate': 'Sign up',
  'Regístrate en DivisionCero': 'Sign up for DivisionCero',
  'Artículos y actualizaciones sobre ciberseguridad': 'Articles and updates on cybersecurity',
  'Proyectos y contribuciones abiertos': 'Open projects and contributions',
  Herramientas: 'Tools',
  'Ayuda en Ciberseguridad': 'Cybersecurity help',
  'Herramientas de Ciberseguridad': 'Cybersecurity Tools',
  'Actualizaciones sobre la plataforma': 'Platform updates',
  Presentaciones: 'Presentations',
  'Material de las sesiones de CyberAcademy': 'CyberAcademy session materials',
  'Cursos de Ciberseguridad gratis en español': 'Free cybersecurity courses in Spanish',
  Cursos: 'Courses',
  'Todos los cursos de CyberAcademy': 'All CyberAcademy courses',
  'Ciberseguridad para todas las personas': 'Cybersecurity for everyone',
  'Los 8 dominios para profesionales': 'The 8 domains for professionals',
  '¿Qué quieres aprender hoy?': 'What do you want to learn today?',
  'Encuentra el curso para tu objetivo': 'Find the course for your goal',
  'Framework de Ciberseguridad por y para LatAm': 'Cybersecurity Framework by and for LatAm',
  'Dominios y controles del framework': 'Framework domains and controls',
  'Controles en formato OSCAL': 'Controls in OSCAL format',
  'Sistema de Gestión, políticas y procedimientos': 'Management System, policies and procedures',
  Cuestionarios: 'Questionnaires',
  'Evalúa la madurez de tu organización': "Assess your organization's maturity",

  // Footer
  Productos: 'Products',
  'Framework Kudo': 'Kudo Framework',
  'Ciberseguridad Empresarial': 'Enterprise Cybersecurity',
  'Acerca de': 'About',
  Filosofía: 'Philosophy',
  Legal: 'Legal',
  'Términos de Servicio': 'Terms of Service',
  'Política de Privacidad': 'Privacy Policy',
  'Política de Cookies': 'Cookie Policy',
  'Centro de Confianza': 'Trust Center',
  Cuenta: 'Account',
  Registrarse: 'Sign up',
  'Elige un idioma': 'Choose a language',
  'Estado de los sistemas': 'System status',
  'Ciberseguridad creada por y para LatAm, aprendamos y aseguremos juntos. Creado por entusiastas de Ciberseguridad para CISO, CSO, CTO, CIO, SOC, CSIRT, SecOps, DevSecOps, DPO, CPO y mucho más...':
    "Cybersecurity built by and for LatAm, let's learn and secure together. Created by cybersecurity enthusiasts for CISOs, CSOs, CTOs, CIOs, SOC, CSIRT, SecOps, DevSecOps, DPOs, CPOs and much more...",
  'Síguenos en {network}': 'Follow us on {network}',
  'Únete a nuestro Discord': 'Join our Discord',
  'Sitio web de Peter Vargas': "Peter Vargas' website",
  'Pregúntale a la IA': 'Ask AI',
  'Pregúntale a {name} sobre DivisionCero': 'Ask {name} about DivisionCero',
  'Pregúntale a': 'Ask',
  'sobre DivisionCero': 'about DivisionCero',

  // Comunes
  Inicio: 'Home',
  Por: 'By',
  'Newsletter de DivisionCero': 'DivisionCero Newsletter',
  'Vigente desde:': 'Effective from:',
  'Seleccionar curso': 'Select a course',
  Explorar: 'Explore',

  // Tabs de la documentación
  'Aprende resolviendo problemas': 'Learn by solving problems',
  'Automatización en Ciberseguridad': 'Cybersecurity automation',
  'DivisionCero en tu infraestructura': 'DivisionCero on your infrastructure',
  'La documentación del framework': 'The framework documentation',
  'Sistema de Gestión': 'Management System',
  Dominios: 'Domains',
  Continuidad: 'Continuity',
  'Datos e IA': 'Data and AI',

  // CyberAcademy: dominios
  'Coherencia Organizacional': 'Organizational Coherence',
  'Gobernanza y estructura organizacional': 'Governance and organizational structure',
  'Identidad y Puntos Finales': 'Identity and Endpoints',
  'Ciberseguridad en Identidad y Puntos Finales': 'Identity and Endpoint Cybersecurity',
  'Gestión de identidades y dispositivos': 'Identity and device management',
  Infraestructura: 'Infrastructure',
  'Ciberseguridad en Infraestructura': 'Infrastructure Cybersecurity',
  'Seguridad en infraestructura y redes': 'Infrastructure and network security',
  Aplicaciones: 'Applications',
  'Ciberseguridad en Aplicaciones': 'Application Cybersecurity',
  'Desarrollo seguro y AppSec': 'Secure development and AppSec',
  'Continuidad y Cambios del Negocio': 'Business Continuity and Change',
  'Gestión de cambios y continuidad': 'Change management and continuity',
  'Talento Humano': 'Human Talent',
  'Ciberseguridad en Talento Humano y Proveedores': 'Human Talent and Vendor Cybersecurity',
  'Gestión de personas y proveedores': 'People and vendor management',
  'Ciberseguridad en Datos e Inteligencia Artificial': 'Data and Artificial Intelligence Cybersecurity',
  'Protección de datos e inteligencia artificial': 'Data and artificial intelligence protection',
  'Detección y Respuesta': 'Detection and Response',
  'Análisis, Detección y Respuesta de Ciberseguridad': 'Cybersecurity Analysis, Detection and Response',
  'Detección y respuesta a incidentes': 'Incident detection and response',
  'Rutas de aprendizaje para colaboradores y usuarios finales.': 'Learning paths for employees and end users.',

  // Prompts de "Pregúntale a la IA"
  '¿Qué es DivisionCero (divisioncero.com) y cómo ayuda a empresas y profesionales de Latinoamérica a mejorar su ciberseguridad?':
    'What is DivisionCero (divisioncero.com) and how does it help companies and professionals in Latin America improve their cybersecurity?',
  '¿Qué es el Framework Kudo de DivisionCero (divisioncero.com/kudo) y cómo ayuda a una organización a implementar y gestionar su programa de ciberseguridad?':
    "What is DivisionCero's Kudo Framework (divisioncero.com/kudo) and how does it help an organization implement and manage its cybersecurity program?",
  '¿Qué es CyberAcademy de DivisionCero (divisioncero.com/cyberacademy) y qué formación en ciberseguridad ofrece, como las rutas CyberUsuario y CyberGuardián?':
    "What is DivisionCero's CyberAcademy (divisioncero.com/cyberacademy) and what cybersecurity training does it offer, such as the CyberUsuario and CyberGuardián paths?",

  // Avisos y botones globales
  'Aviso de cookies': 'Cookie notice',
  'Nosotros usamos': 'We use',
  Rechazar: 'Reject',
  Aceptar: 'Accept',
  'Hola DivisionCero, estaba en {url} y tengo una pregunta': 'Hi DivisionCero, I was on {url} and I have a question',
  'Hola DivisionCero, tengo una pregunta': 'Hi DivisionCero, I have a question',
  'Hola DivisionCero, estaba en {url} y quiero agendar una demo': 'Hi DivisionCero, I was on {url} and I want to book a demo',
  'Hola DivisionCero, quiero agendar una demo': 'Hi DivisionCero, I want to book a demo',
  'Escríbenos por WhatsApp': 'Message us on WhatsApp',
  'Suscríbete a DivisionCero': 'Subscribe to DivisionCero',
  Cerrar: 'Close',
  'Cerrar banner': 'Close banner',
};

export type TFunction = (text: string, variables?: Record<string, string | number>) => string;

/**
 * Traductor para un idioma. `extra` permite que una página declare sus propios textos
 * (con prioridad sobre los del sitio) sin inflar el diccionario compartido.
 */
export function getT(lang: string, extra?: Dictionary): TFunction {
  return (text, variables) => {
    let out = (lang === 'en' && (extra?.[text] ?? siteEn[text])) || text;
    if (variables) for (const [key, value] of Object.entries(variables)) out = out.replaceAll(`{${key}}`, String(value));
    return out;
  };
}
