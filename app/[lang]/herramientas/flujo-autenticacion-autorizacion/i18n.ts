import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Paso anterior': 'Previous step',
  'Paso siguiente': 'Next step',
  'Reiniciar animación': 'Restart animation',
  'Método de autenticación': 'Authentication method',
  'Por API': 'Via API',
  'Por MCP': 'Via MCP',
  'Tipo de rol': 'Role type',
  'Roles fijos': 'Fixed roles',
  'Roles custom': 'Custom roles',
  'Cuándo usarlo': 'When to use it',
  'Riesgo principal': 'Main risk',
  'Autenticación': 'Authentication',
  '¿Quién eres?': 'Who are you?',
  'Confirma que una identidad (persona, app o agente) es quien dice ser, validando una credencial.':
    'Confirms that an identity (person, app or agent) is who it claims to be by validating a credential.',
  'Roles': 'Roles',
  '¿A qué grupo perteneces?': 'Which group do you belong to?',
  'Agrupan un conjunto de permisos y se asignan a una identidad ya autenticada.':
    'They group a set of permissions and are assigned to an already authenticated identity.',
  'Autorización': 'Authorization',
  '¿Qué puedes hacer?': 'What can you do?',
  'Evalúa si el rol de esa identidad tiene permiso para la acción y el recurso solicitados.':
    'Evaluates whether that identity\'s role has permission for the requested action and resource.',
  'Roles fijos del sistema': 'System fixed roles',
  'Vienen predefinidos por la plataforma, con un conjunto de permisos que no se puede editar (ej. Admin, Editor, Lector).':
    'They come predefined by the platform, with a set of permissions that cannot be edited (e.g. Admin, Editor, Viewer).',
  '"Editor" siempre puede crear y modificar contenido, en cualquier cuenta que lo use.':
    '"Editor" can always create and modify content, in any account that uses it.',
  'Casos genéricos y comunes a todos los clientes, donde no hace falta granularidad extra.':
    'Generic cases common to all customers, where no extra granularity is needed.',
  'Poca flexibilidad: si el negocio necesita un permiso a medio camino entre dos roles, no existe.':
    'Little flexibility: if the business needs a permission halfway between two roles, it doesn\'t exist.',
  'Roles personalizados (custom)': 'Custom roles',
  'Los define el propio negocio combinando permisos específicos y agrupándolos en un rol a medida.':
    'The business defines them by combining specific permissions and grouping them into a tailored role.',
  '"Auditor de Finanzas": solo lectura sobre reportes financieros, sin acceso a ningún otro módulo.':
    '"Finance Auditor": read-only on financial reports, with no access to any other module.',
  'Cuando distintos equipos necesitan combinaciones de permisos muy específicas.':
    'When different teams need very specific combinations of permissions.',
  'Requiere más gestión: hay que mantener y auditar los roles a medida que el negocio cambia.':
    'It requires more management: roles must be maintained and audited as the business changes.',
  'Autenticación por API': 'API authentication',
  'Una aplicación o servicio se identifica ante el servidor con una API Key o un Bearer Token en cada petición HTTP.':
    'An application or service identifies itself to the server with an API Key or a Bearer Token on every HTTP request.',
  'Integraciones entre sistemas, apps propias, o cuando el cliente es un servicio conocido.':
    'Integrations between systems, your own apps, or when the client is a known service.',
  'Si la credencial se filtra, funciona para cualquiera que la tenga hasta que se revoque.':
    'If the credential leaks, it works for anyone who has it until it is revoked.',
  'Autenticación por MCP': 'MCP authentication',
  'Un agente de IA se conecta a un servidor MCP (Model Context Protocol); la persona usuaria aprueba esa conexión y el servidor valida el token asociado en cada uso.':
    'An AI agent connects to an MCP (Model Context Protocol) server; the user approves that connection and the server validates the associated token on each use.',
  'Un asistente de IA usa una herramienta MCP para leer reportes, actuando en nombre de la persona que lo autorizó.':
    'An AI assistant uses an MCP tool to read reports, acting on behalf of the person who authorized it.',
  'Cuando un agente de IA necesita actuar en nombre de una persona sobre sistemas internos.':
    'When an AI agent needs to act on behalf of a person on internal systems.',
  'El agente hereda los permisos de quien lo autorizó: hay que limitar bien el alcance de esa autorización.':
    'The agent inherits the permissions of whoever authorized it: the scope of that authorization must be well limited.',
  'Identidad y rol': 'Identity and role',
  'Decisión': 'Decision',
  'Auditoría': 'Audit',
  'Solicitud de acceso': 'Access request',
  'Una aplicación cliente envía una petición HTTP a la API, incluyendo una credencial (API Key o Bearer Token) en el encabezado Authorization.':
    'A client application sends an HTTP request to the API, including a credential (API Key or Bearer Token) in the Authorization header.',
  'Un agente de IA (por ejemplo, un asistente conectado por Claude) invoca una herramienta o solicita un recurso a través de un servidor MCP.':
    'An AI agent (for example, an assistant connected through Claude) invokes a tool or requests a resource through an MCP server.',
  'Autenticación: ¿quién eres?': 'Authentication: who are you?',
  'El servidor valida la API Key o el token: revisa que exista, que no haya expirado y que no haya sido revocada.':
    'The server validates the API Key or token: it checks that it exists, hasn\'t expired and hasn\'t been revoked.',
  'El servidor MCP valida el token OAuth (o de sesión) que la persona usuaria autorizó previamente para ese agente.':
    'The MCP server validates the OAuth (or session) token that the user previously authorized for that agent.',
  'API Key válida y vigente': 'Valid, active API Key',
  'Token OAuth vigente y aprobado': 'Active, approved OAuth token',
  'Ejemplo de API Key revocada': 'Example of a revoked API Key',
  'Ejemplo de token de sesión revocado': 'Example of a revoked session token',
  'Identidad y rol asignado': 'Identity and assigned role',
  'La credencial pertenece a una cuenta con un rol fijo del catálogo del sistema: viene predefinido de fábrica y no puede modificarse.':
    'The credential belongs to an account with a fixed role from the system catalog: it comes predefined and cannot be modified.',
  'La credencial pertenece a una cuenta con un rol personalizado, creado por el negocio combinando permisos específicos a medida.':
    'The credential belongs to an account with a custom role, created by the business by combining specific permissions.',
  'Rol: "Editor" (predefinido por el sistema)': 'Role: "Editor" (predefined by the system)',
  'Permisos fijos, iguales para todo Editor': 'Fixed permissions, the same for every Editor',
  'Rol: "Auditor de Finanzas" (creado por el negocio)': 'Role: "Finance Auditor" (created by the business)',
  'Permisos combinados a medida para ese rol': 'Permissions combined specifically for that role',
  'Autorización: ¿qué puedes hacer?': 'Authorization: what can you do?',
  'Se evalúan los permisos del rol contra la acción solicitada: ¿ese rol permite esta operación sobre este recurso específico?':
    'The role\'s permissions are evaluated against the requested action: does that role allow this operation on this specific resource?',
  'Permiso: leer reportes financieros': 'Permission: read financial reports',
  'Permiso: eliminar reportes financieros': 'Permission: delete financial reports',
  'Decisión de acceso': 'Access decision',
  'Si el permiso existe, la acción se ejecuta y se entrega el recurso (200 OK). Si no existe, se rechaza sin exponer ningún dato (403 Forbidden).':
    'If the permission exists, the action runs and the resource is delivered (200 OK). If not, it is rejected without exposing any data (403 Forbidden).',
  'Permitido → 200 OK, se entrega el recurso': 'Allowed → 200 OK, the resource is delivered',
  'Denegado → 403 Forbidden, sin datos': 'Denied → 403 Forbidden, no data',
  'Registro y auditoría': 'Logging and audit',
  'Toda solicitud —autorizada o no— queda registrada: quién, cuándo, qué recurso y con qué resultado. Es clave para trazabilidad y cumplimiento.':
    'Every request —authorized or not— is logged: who, when, which resource and with what result. It is key for traceability and compliance.',
  'Log: usuario, API Key (id), endpoint, resultado': 'Log: user, API Key (id), endpoint, result',
  'Log: usuario, agente MCP, herramienta invocada, resultado': 'Log: user, MCP agent, invoked tool, result',
  'Roles fijos vs. roles personalizados': 'Fixed roles vs. custom roles',
  'Autenticación por API vs. por MCP': 'API vs. MCP authentication',
  'Paso {n} de {total}': 'Step {n} of {total}',
};
