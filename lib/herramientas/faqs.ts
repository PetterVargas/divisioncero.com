/**
 * Preguntas frecuentes de cada herramienta, por su ruta dentro de /herramientas.
 * Se muestran al final de la página (`ToolFaq`) y como JSON-LD `FAQPage`: dan a
 * buscadores y LLMs texto con las dudas reales de quien usa la herramienta.
 *
 * Las respuestas describen lo que la herramienta hace de verdad: si cambia su
 * funcionamiento (p. ej. empieza a enviar datos a un servidor), actualízalas.
 */
export interface Faq {
  question: string;
  answer: string;
}

export const toolFaqs: Record<string, Faq[]> = {
  '/analizador-contrasenas': [
    {
      question: '¿Cómo calcula el analizador cuánto tardaría en descifrarse mi contraseña?',
      answer:
        'Estima cuántas combinaciones tendría que probar un atacante según la longitud y los tipos de caracteres de la contraseña, y descuenta patrones predecibles. Luego divide ese número entre la velocidad de distintos escenarios de ataque: un login en línea con o sin límite de intentos, y ataques offline contra hashes lentos (bcrypt, Argon2) o rápidos (MD5, SHA-1, SHA-256) con GPU.',
    },
    {
      question: '¿Es seguro escribir mi contraseña real en el analizador?',
      answer:
        'El análisis se hace en tu navegador y la contraseña no se envía a ningún servidor. Aun así, la buena práctica es no escribir tus contraseñas reales en ningún sitio que no sea el servicio al que pertenecen: prueba con una contraseña parecida a la tuya.',
    },
    {
      question: '¿Por qué el tiempo cambia tanto entre un escenario y otro?',
      answer:
        'Porque un login en línea con bloqueo permite pocos intentos por hora, mientras que un atacante que robó una base de datos con hashes rápidos puede probar miles de millones de contraseñas por segundo con GPU. Por eso importa tanto la contraseña como la forma en que el servicio la almacena.',
    },
    {
      question: '¿Qué hace que una contraseña sea fuerte?',
      answer:
        'Sobre todo la longitud y que sea impredecible. Una frase de contraseña de varias palabras al azar o una contraseña aleatoria de 16 caracteres o más, única para cada servicio, guardada en un gestor de contraseñas y acompañada de autenticación de dos factores (2FA).',
    },
  ],
  '/analizador-metadatos': [
    {
      question: '¿Qué son los metadatos de un archivo?',
      answer:
        'Son datos sobre el archivo que no se ven a simple vista: en una foto, la cámara o el celular, la fecha y a veces la ubicación GPS (EXIF); en un PDF o un documento de Office, el autor, la organización, el software usado y las fechas de creación y edición.',
    },
    {
      question: '¿Qué tipos de archivo puedo analizar?',
      answer:
        'Imágenes (por ejemplo JPEG y PNG), PDF y documentos de Word, Excel y PowerPoint, tanto en formato moderno (.docx, .xlsx, .pptx) como en el formato antiguo de Office (.doc, .xls, .ppt).',
    },
    {
      question: '¿Mi archivo se sube a algún servidor?',
      answer:
        'No. El archivo se lee y se analiza en tu navegador; no sale de tu equipo. El reporte en PDF también se genera localmente.',
    },
    {
      question: '¿Por qué es un riesgo compartir archivos con metadatos?',
      answer:
        'Porque pueden revelar información que no querías publicar: dónde se tomó una foto, nombres de usuarios internos, la versión del software de la organización o fechas que contradicen un documento. Antes de compartir un archivo hacia afuera, revisa y elimina los metadatos que no sean necesarios.',
    },
  ],
  '/calendario-ciberseguridad': [
    {
      question: '¿Qué es el Calendario de Ciberseguridad?',
      answer:
        'Un calendario con un tema, consejo o efeméride de ciberseguridad para cada día del año, pensado para aprender un poco cada día y construir el hábito.',
    },
    {
      question: '¿Cómo puedo usarlo en mi organización?',
      answer:
        'Como fuente de contenido para campañas de concientización: compartir el consejo del día en el chat del equipo, abrir reuniones con un tema corto o planear las comunicaciones del mes alrededor de las fechas clave.',
    },
    {
      question: '¿Necesito registrarme para usarlo?',
      answer: 'No. El calendario es gratuito y se puede consultar sin cuenta.',
    },
  ],
  '/checklist-buenas-practicas-equipo': [
    {
      question: '¿Para quién es este checklist?',
      answer:
        'Para líderes de equipo que quieren verificar que las personas a su cargo y sus equipos de cómputo cumplen las buenas prácticas y protecciones básicas de ciberseguridad, sin necesidad de ser especialistas.',
    },
    {
      question: '¿Qué revisa el checklist?',
      answer:
        'Cinco grupos de prácticas básicas: contraseñas y accesos, dispositivos y equipo de cómputo, red y conexión remota, correo, navegación y manejo de datos, y cultura y capacitación del equipo.',
    },
    {
      question: '¿Cada cuánto debería revisarlo?',
      answer:
        'Una buena referencia es hacerlo cuando llega alguien nuevo al equipo, cuando se entrega un equipo de cómputo y luego de forma periódica, por ejemplo cada trimestre.',
    },
    {
      question: '¿Reemplaza una auditoría de seguridad?',
      answer:
        'No. Es una verificación básica para el día a día. Una auditoría evalúa de forma formal controles, procesos y evidencias, por ejemplo con un marco como el Kudo Framework.',
    },
  ],
  '/checklist-incidente-seguridad': [
    {
      question: '¿Qué hago primero si sospecho un incidente de seguridad?',
      answer:
        'No borres nada ni intentes arreglarlo por tu cuenta: desconecta el equipo de la red si está comprometido, anota lo que viste y a qué hora, y avisa de inmediato a tu líder o al equipo de seguridad por un canal distinto al afectado.',
    },
    {
      question: '¿Por qué hay pasos distintos para el colaborador y para el líder?',
      answer:
        'Porque tienen responsabilidades distintas: el colaborador contiene el daño y reporta; el líder evalúa el impacto, escala al equipo de seguridad o de TI, coordina la comunicación y se asegura de que se conserve la evidencia.',
    },
    {
      question: '¿Qué cuenta como un incidente de seguridad?',
      answer:
        'Cualquier evento que comprometa la confidencialidad, integridad o disponibilidad de la información: hacer clic en un enlace de phishing, perder un equipo, compartir datos por error, detectar malware o accesos no autorizados a una cuenta.',
    },
    {
      question: '¿Debo reportar aunque no esté seguro de que sea un incidente?',
      answer:
        'Sí. Es mejor reportar una falsa alarma que dejar pasar un incidente real: cuanto antes se detecta, menor es el daño.',
    },
  ],
  '/cifrado-pgp': [
    {
      question: '¿Qué es PGP?',
      answer:
        'PGP (Pretty Good Privacy) es un sistema para cifrar y firmar mensajes y archivos. Su estándar abierto es OpenPGP, que implementan herramientas como GnuPG (GPG).',
    },
    {
      question: '¿Qué diferencia hay entre la clave pública y la clave privada?',
      answer:
        'La clave pública se comparte con cualquiera y sirve para cifrar mensajes dirigidos a ti y verificar tus firmas. La clave privada solo la tienes tú y sirve para descifrar esos mensajes y firmar. Si alguien obtiene tu clave privada, puede leer tus mensajes y firmar en tu nombre.',
    },
    {
      question: '¿Por qué se dice que PGP usa cifrado híbrido?',
      answer:
        'Porque cifra el mensaje con una clave simétrica aleatoria, que es rápida, y luego cifra solo esa clave con la clave pública del destinatario. Así combina la velocidad del cifrado simétrico con la facilidad de intercambio del cifrado asimétrico.',
    },
    {
      question: '¿Qué garantiza una firma digital PGP?',
      answer:
        'Que el mensaje lo envió quien tiene la clave privada (autenticidad) y que no fue modificado después de firmarse (integridad). Firmar no oculta el contenido: para eso hay que cifrar.',
    },
  ],
  '/codificador-base64': [
    {
      question: '¿Qué es Base64?',
      answer:
        'Es una forma de representar datos binarios o texto usando solo 64 caracteres seguros (A-Z, a-z, 0-9, + y /). Se usa para enviar datos por canales que solo aceptan texto, como correos, JSON, URLs de datos o cabeceras HTTP.',
    },
    {
      question: '¿Base64 es un tipo de cifrado?',
      answer:
        'No. Base64 es una codificación: cualquiera puede decodificarla sin clave. Nunca la uses para proteger contraseñas o información sensible.',
    },
    {
      question: '¿Mis datos se envían a un servidor?',
      answer: 'No. La codificación y la decodificación se hacen en tu navegador.',
    },
    {
      question: '¿Por qué el texto en Base64 es más largo que el original?',
      answer:
        'Porque cada 3 bytes de entrada se representan con 4 caracteres, así que el resultado ocupa aproximadamente un 33 % más.',
    },
  ],
  '/codificador-hexadecimal': [
    {
      question: '¿Qué es la codificación hexadecimal?',
      answer:
        'Es representar cada byte con dos dígitos en base 16 (0-9 y A-F). Por ejemplo, la letra "A" es 41 en hexadecimal. Es la forma habitual de mostrar datos binarios, hashes, direcciones de memoria y paquetes de red.',
    },
    {
      question: '¿Para qué sirve convertir texto a hexadecimal en ciberseguridad?',
      answer:
        'Para analizar datos en bajo nivel: revisar payloads, entender cómo se codifican caracteres especiales o tildes en UTF-8, leer volcados de memoria o comparar bytes en análisis forense y CTF.',
    },
    {
      question: '¿Mis datos salen de mi navegador?',
      answer: 'No. La conversión se hace localmente en tu navegador.',
    },
  ],
  '/codificador-url': [
    {
      question: '¿Qué es la codificación URL (percent-encoding)?',
      answer:
        'Es la forma de escribir en una URL caracteres que no están permitidos o tienen un significado especial, reemplazándolos por % seguido de su valor hexadecimal. Por ejemplo, un espacio se convierte en %20 y la "ñ" en %C3%B1.',
    },
    {
      question: '¿Cuándo necesito codificar una URL?',
      answer:
        'Cuando pasas texto como parámetro de una URL (búsquedas, mensajes de WhatsApp, redirecciones) o cuando el texto lleva espacios, tildes, &, ?, = o #, que de otra forma romperían el enlace.',
    },
    {
      question: '¿Por qué es útil decodificar URLs en seguridad?',
      answer:
        'Porque los atacantes codifican enlaces para esconder su destino real o un payload, por ejemplo en phishing o en intentos de inyección. Decodificarlos permite ver a dónde llevan de verdad.',
    },
  ],
  '/conversion-de-fecha-y-hora': [
    {
      question: '¿Cómo convierto la hora UTC a la hora de Colombia?',
      answer:
        'Colombia usa UTC-5 todo el año (no tiene horario de verano): resta 5 horas a la hora UTC. Por ejemplo, las 15:00 UTC son las 10:00 en Bogotá. La herramienta hace la conversión por ti entre esta y otras zonas horarias.',
    },
    {
      question: '¿Qué es un timestamp Unix?',
      answer:
        'Es el número de segundos transcurridos desde el 1 de enero de 1970 a las 00:00:00 UTC. Se usa en sistemas, bases de datos y logs porque no depende de la zona horaria.',
    },
    {
      question: '¿Por qué importa la zona horaria en ciberseguridad?',
      answer:
        'Porque al investigar un incidente hay que alinear eventos de logs, servidores y servicios que registran la hora en zonas distintas. Una línea de tiempo con horas mal convertidas lleva a conclusiones equivocadas.',
    },
  ],
  '/cual-es-mi-ip': [
    {
      question: '¿Qué es una dirección IP pública?',
      answer:
        'Es la dirección con la que tu conexión se identifica en Internet. La asigna tu proveedor de Internet y la comparten los dispositivos de tu red. Es distinta de la IP privada que tiene cada equipo dentro de tu casa u oficina.',
    },
    {
      question: '¿Qué tan exacta es la ubicación que se muestra?',
      answer:
        'Es aproximada: suele indicar la ciudad o región del proveedor de Internet, no tu dirección exacta. Si usas una VPN o un proxy, verás la ubicación de ese servicio.',
    },
    {
      question: '¿De dónde se obtiene la información de mi IP?',
      answer:
        'Tu navegador consulta un servicio público de geolocalización de IP (ipwho.is) que devuelve la IP pública, la ubicación aproximada y el proveedor. Los datos del navegador se leen localmente.',
    },
    {
      question: '¿Para qué sirve el reporte en PDF con hash SHA-256?',
      answer:
        'Para guardar evidencia de la consulta: el hash SHA-256 permite comprobar después que el reporte no fue modificado. Es útil, por ejemplo, para documentar desde qué conexión se hizo una acción.',
    },
    {
      question: '¿Qué son los encabezados HTTP que recibe el servidor?',
      answer:
        'Son los datos que tu navegador envía en cada petición: User-Agent, idiomas (Accept-Language), compresión (Accept-Encoding), tipos de contenido (Accept), página de referencia (Referer) y, si hay proxies de por medio, X-Forwarded-For. Cualquier sitio web los recibe y puede registrarlos junto con tu IP.',
    },
    {
      question: '¿Puedo consultar mi IP desde la terminal?',
      answer:
        'Sí. Ejecuta curl https://divisioncero.com/herramientas/api/mi-ip para obtener tu IP, o agrega /ua, /idioma, /forwarded, /todo o /todo.json para ver otros datos. Funciona con curl, wget o cualquier cliente HTTP.',
    },
    {
      question: '¿Por qué mi IP cambia o la comparto con otras personas?',
      answer:
        'La mayoría de los proveedores asignan IP dinámicas, que cambian con el tiempo. En redes móviles es común el CGNAT, donde muchos clientes comparten la misma IP pública a la vez. Por eso una IP identifica una conexión en un momento dado, no a una persona.',
    },
    {
      question: '¿Cuál es la diferencia entre IPv4 e IPv6?',
      answer:
        'IPv4 usa cuatro números separados por puntos (por ejemplo 186.0.80.197) y sus direcciones ya se agotaron. IPv6 usa grupos hexadecimales separados por dos puntos y permite una dirección por dispositivo. Muchas conexiones tienen ambas y el sitio ve la que se usó en esa petición.',
    },
  ],
  '/cybermap': [
    {
      question: '¿Qué muestra CyberMap?',
      answer:
        'Un mapa mundial interactivo con el panorama de amenazas y el perfil de ciberseguridad de cada país. Al seleccionar un país se abre su ficha con la información disponible.',
    },
    {
      question: '¿Para qué sirve conocer el perfil de ciberseguridad de un país?',
      answer:
        'Para entender el contexto de amenazas y de regulación donde opera una organización o un proveedor, y para usarlo en clases, charlas y campañas de concientización.',
    },
    {
      question: '¿Puedo verlo en pantalla completa?',
      answer: 'Sí. El mapa tiene un botón de pantalla completa, útil para proyectarlo en presentaciones o en un SOC.',
    },
  ],
  '/deteccion-phishing': [
    {
      question: '¿Qué es el phishing?',
      answer:
        'Es un ataque en el que alguien se hace pasar por una entidad de confianza (un banco, una empresa de envíos, tu jefe) por correo, SMS o mensajería para que hagas clic en un enlace, descargues un archivo o entregues contraseñas y datos.',
    },
    {
      question: '¿Cómo funciona la práctica?',
      answer:
        'Se muestran correos y SMS, algunos fraudulentos y otros legítimos. Decides si cada uno es phishing y la herramienta te explica qué señales había para reconocerlo.',
    },
    {
      question: '¿Cuáles son las señales más comunes de un phishing?',
      answer:
        'Urgencia o amenazas ("tu cuenta será bloqueada"), remitentes o dominios que imitan a uno real, enlaces que no llevan a donde dicen, solicitudes de contraseñas o códigos, archivos adjuntos inesperados y premios o devoluciones que no esperabas.',
    },
    {
      question: '¿Qué hago si ya hice clic en un enlace de phishing?',
      answer:
        'Cambia de inmediato la contraseña afectada desde el sitio oficial, activa la autenticación de dos factores, revisa la actividad de la cuenta y repórtalo a tu equipo de seguridad o a tu banco. Si fue en un equipo del trabajo, sigue el checklist de incidentes.',
    },
  ],
  '/detector-codigo-vulnerable': [
    {
      question: '¿Cómo funciona el Detector de Código Vulnerable?',
      answer:
        'Es un ejercicio: se muestran fragmentos de código y decides si son vulnerables o seguros. Luego se explica la vulnerabilidad y cómo corregirla. No analiza tu propio código.',
    },
    {
      question: '¿Qué tipos de vulnerabilidades incluye?',
      answer:
        'Casos del OWASP Top 10 (como inyección SQL o XSS), del OWASP Top 10 para aplicaciones con LLM, secretos escritos en el código, dependencias vulnerables (SCA) y ejemplos relacionados con SAST, DAST y pentesting.',
    },
    {
      question: '¿Para quién es esta herramienta?',
      answer:
        'Para desarrolladores, estudiantes y equipos de AppSec que quieren entrenar el ojo para revisar código de forma segura, y para capacitaciones de desarrollo seguro.',
    },
  ],
  '/flujo-autenticacion-autorizacion': [
    {
      question: '¿Cuál es la diferencia entre autenticación y autorización?',
      answer:
        'La autenticación comprueba quién eres (con contraseña, 2FA, un token o una llave). La autorización decide qué puedes hacer una vez identificado, por ejemplo según tu rol o los permisos de tu token.',
    },
    {
      question: '¿Qué son los roles en un control de acceso?',
      answer:
        'Son conjuntos de permisos que se asignan a usuarios o aplicaciones según su función (por ejemplo lector, editor o administrador), para no tener que dar permisos uno por uno y aplicar el principio de mínimo privilegio.',
    },
    {
      question: '¿Cómo se aplica esto en accesos por API y por MCP?',
      answer:
        'La aplicación o el agente se autentica con una credencial (una API key o un token OAuth), el servidor valida esa credencial y luego revisa si sus permisos o scopes permiten la acción solicitada antes de ejecutarla.',
    },
  ],
  '/generador-contrasenas': [
    {
      question: '¿Las contraseñas se generan de forma segura?',
      answer:
        'Sí. Se generan en tu navegador con el generador de números aleatorios criptográficamente seguro (Web Crypto) y no se envían a ningún servidor.',
    },
    {
      question: '¿Qué longitud de contraseña debería usar?',
      answer:
        'Al menos 16 caracteres para cuentas importantes, combinando mayúsculas, minúsculas, números y símbolos. El generador permite elegir entre 4 y 64 caracteres.',
    },
    {
      question: '¿Cómo recuerdo contraseñas tan largas?',
      answer:
        'No hace falta recordarlas: guárdalas en un gestor de contraseñas y memoriza solo la contraseña maestra. Usa una contraseña distinta para cada servicio.',
    },
    {
      question: '¿Basta con una contraseña fuerte?',
      answer:
        'Ayuda mucho, pero conviene sumar autenticación de dos factores (2FA), porque una contraseña puede filtrarse por phishing o por una brecha del servicio aunque sea fuerte.',
    },
  ],
  '/generador-hash': [
    {
      question: '¿Qué es un hash?',
      answer:
        'Es una huella de longitud fija que se calcula a partir de cualquier dato. El mismo texto siempre da el mismo hash, un cambio mínimo da un hash completamente distinto y no se puede recuperar el texto original a partir del hash.',
    },
    {
      question: '¿Qué algoritmo debo usar: MD5, SHA-1, SHA-256 o SHA-512?',
      answer:
        'Para seguridad, SHA-256 o SHA-512. MD5 y SHA-1 tienen colisiones conocidas y solo sirven para comprobaciones no críticas, como detectar archivos duplicados.',
    },
    {
      question: '¿Puedo usar SHA-256 para guardar contraseñas?',
      answer:
        'No es recomendable: es demasiado rápido y facilita los ataques de fuerza bruta. Para contraseñas se usan funciones lentas y con sal como Argon2, bcrypt o scrypt.',
    },
    {
      question: '¿El texto se envía a un servidor?',
      answer: 'No. El hash se calcula en tu navegador. Para calcular el hash de un archivo, usa el Generador y Validador de Hash de Archivo.',
    },
  ],
  '/generador-qr': [
    {
      question: '¿Qué tipos de código QR puedo crear?',
      answer: 'Códigos QR para enlaces (URL), texto, WhatsApp, correo electrónico, SMS y redes Wi-Fi.',
    },
    {
      question: '¿Los códigos QR generados caducan?',
      answer:
        'No. El contenido va dentro del propio código, sin redirecciones intermedias, así que el QR funciona mientras el enlace o los datos que contiene sigan siendo válidos.',
    },
    {
      question: '¿Necesito registrarme o pagar?',
      answer: 'No. Es gratis, sin registro, y el QR se genera en tu navegador.',
    },
    {
      question: '¿Los códigos QR pueden ser peligrosos?',
      answer:
        'Sí: el "quishing" es phishing con códigos QR pegados en carteles, parqueaderos o correos para llevarte a sitios falsos. Antes de abrir un QR, revisa la URL que muestra la cámara y desconfía de los que piden pagos o contraseñas.',
    },
  ],
  '/generador-uuid': [
    {
      question: '¿Qué es un UUID?',
      answer:
        'Un UUID (Universally Unique Identifier), también llamado GUID, es un identificador de 128 bits que se escribe como 32 caracteres hexadecimales en cinco grupos, por ejemplo 550e8400-e29b-41d4-a716-446655440000.',
    },
    {
      question: '¿Qué versión de UUID genera la herramienta?',
      answer:
        'UUID versión 4, generada con crypto.randomUUID() del navegador: 122 bits aleatorios, sin información sobre el equipo ni la fecha de creación.',
    },
    {
      question: '¿Puede repetirse un UUID v4?',
      answer:
        'En la práctica no: la probabilidad de colisión es tan baja que se pueden generar miles de millones sin esperar un duplicado.',
    },
    {
      question: '¿Puedo usar un UUID como token secreto?',
      answer:
        'Un UUID v4 es aleatorio, pero no fue diseñado como secreto. Para tokens de sesión, restablecimiento de contraseña o API keys es mejor usar valores aleatorios más largos generados para ese fin.',
    },
  ],
  '/generador-y-validador-hash-archivo': [
    {
      question: '¿Para qué sirve calcular el hash de un archivo?',
      answer:
        'Para comprobar su integridad: si el hash que calculas coincide con el que publica el autor, el archivo no fue alterado ni se corrompió en la descarga. En análisis forense también se usa para demostrar que la evidencia no cambió.',
    },
    {
      question: '¿Cómo valido un archivo descargado?',
      answer:
        'Copia el hash publicado por el sitio oficial (normalmente SHA-256), carga el archivo en la herramienta y compara los valores. Si no coinciden, no abras ni instales el archivo.',
    },
    {
      question: '¿Mi archivo se sube a un servidor?',
      answer: 'No. El hash se calcula en tu navegador y el archivo nunca sale de tu equipo.',
    },
    {
      question: '¿Qué algoritmos calcula?',
      answer: 'MD5, SHA-1, SHA-256 y SHA-512. Para validar integridad con fines de seguridad, usa SHA-256 o SHA-512.',
    },
  ],
  '/identificador-correos-seguros': [
    {
      question: '¿Cómo funciona la práctica de correos seguros?',
      answer:
        'Se muestra una bandeja de entrada simulada con correos legítimos y maliciosos. Decides cuáles son seguros y la herramienta te explica en qué fijarte en cada caso.',
    },
    {
      question: '¿Qué reviso para saber si un correo es seguro?',
      answer:
        'El dominio real del remitente (no solo el nombre visible), a dónde llevan los enlaces al pasar el cursor, si hay adjuntos inesperados, si hay urgencia o amenazas y si te piden datos o pagos fuera del proceso habitual.',
    },
    {
      question: '¿Qué hago con un correo sospechoso?',
      answer:
        'No hagas clic ni respondas. Repórtalo al equipo de seguridad o usa la opción de reportar phishing de tu correo y, si dudas, confirma con el remitente por otro canal.',
    },
  ],
  '/identificador-id-red-social': [
    {
      question: '¿Qué es el ID numérico de un perfil?',
      answer:
        'Es el identificador interno que la red social asigna a cada cuenta. A diferencia del nombre de usuario, normalmente no cambia aunque la persona cambie su @ o su nombre.',
    },
    {
      question: '¿De qué redes sociales puedo obtener el ID?',
      answer: 'De perfiles de Facebook, Instagram, TikTok y X (antes Twitter).',
    },
    {
      question: '¿Para qué sirve conocer el ID de un perfil?',
      answer:
        'Para investigaciones OSINT y de fraude, reportes de suplantación o acoso y para documentar evidencia: el ID permite seguir la misma cuenta aunque cambie de nombre. El reporte en PDF ayuda a dejar constancia de la consulta.',
    },
    {
      question: '¿La herramienta accede a información privada?',
      answer: 'No. Solo consulta la información pública del perfil.',
    },
  ],
  '/malas-practicas-escritorio': [
    {
      question: '¿En qué consiste la actividad?',
      answer:
        'En encontrar las 10 malas prácticas de seguridad escondidas en un puesto de trabajo simulado. Al encontrar cada una se explica por qué es un riesgo y qué hacer en su lugar.',
    },
    {
      question: '¿Qué malas prácticas son las más comunes en un escritorio?',
      answer:
        'Contraseñas en notas adhesivas, pantalla desbloqueada al levantarse, documentos sensibles a la vista, memorias USB desconocidas conectadas y dispositivos sin supervisión.',
    },
    {
      question: '¿Cómo puedo usarla en una capacitación?',
      answer:
        'Proyéctala en pantalla completa y pide al grupo que encuentre los riesgos, o compártela como reto antes de una charla de concientización sobre política de escritorio limpio.',
    },
  ],
  '/museo-cibercrimen': [
    {
      question: '¿Qué es el Museo del Cibercrimen?',
      answer:
        'Una galería visual con los hitos, hackers, malware y ciberataques más icónicos de la historia, cada uno con una explicación corta.',
    },
    {
      question: '¿Por qué conocer la historia del cibercrimen?',
      answer:
        'Porque muchos ataques actuales repiten técnicas antiguas, como la ingeniería social, los gusanos o el ransomware. Conocer los casos ayuda a entender las amenazas y a explicarlas mejor en capacitaciones.',
    },
    {
      question: '¿Puedo usar el museo en clases o charlas?',
      answer: 'Sí. Está pensado como material de apoyo para docentes, equipos de concientización y charlas de ciberseguridad.',
    },
  ],
  '/que-es-grooming': [
    {
      question: '¿Qué es el grooming?',
      answer:
        'Es cuando un adulto contacta a un niño, niña o adolescente por Internet, se gana su confianza, muchas veces con una identidad falsa, y lo manipula con el fin de abusar sexualmente de él o ella, en línea o en persona.',
    },
    {
      question: '¿Cuáles son las señales de alerta?',
      answer:
        'Un contacto nuevo que da muchos halagos o regalos, que pide mantener la relación en secreto, que lleva la conversación a canales privados, que hace preguntas sobre el cuerpo o la sexualidad o que pide fotos o un encuentro.',
    },
    {
      question: '¿Qué hago si sospecho que mi hijo o hija es víctima de grooming?',
      answer:
        'Mantén la calma y no culpes al niño o niña. No borres las conversaciones: guarda capturas como evidencia, bloquea y reporta la cuenta en la plataforma y denuncia ante las autoridades de tu país (policía o fiscalía especializada en delitos informáticos).',
    },
    {
      question: '¿Cómo prevenir el grooming?',
      answer:
        'Hablando con frecuencia y sin juzgar sobre lo que hacen en línea, configurando la privacidad de sus cuentas, acordando no compartir fotos ni datos personales con desconocidos y dejando claro que pueden contarte cualquier cosa sin miedo a un castigo.',
    },
  ],
  '/que-es-pii': [
    {
      question: '¿Qué es un dato PII?',
      answer:
        'PII (Personally Identifiable Information) es cualquier información que permite identificar a una persona, ya sea por sí sola, como el nombre o el número de documento, o combinada con otros datos, como la fecha de nacimiento y el código postal.',
    },
    {
      question: '¿Qué diferencia hay entre identificadores directos y cuasi-identificadores?',
      answer:
        'Un identificador directo señala a una persona por sí solo (número de identificación, correo personal, número de teléfono). Un cuasi-identificador no lo hace solo, pero combinado con otros sí (edad, género, ciudad, cargo).',
    },
    {
      question: '¿Qué son los datos sensibles?',
      answer:
        'Son datos cuyo uso indebido puede causar discriminación o daños graves: salud, orientación sexual, origen étnico, creencias religiosas o políticas, datos biométricos y, en general, los de niños, niñas y adolescentes. Las leyes de protección de datos les exigen protección reforzada.',
    },
    {
      question: '¿Cómo proteger la PII en una organización?',
      answer:
        'Recolecta solo lo necesario, clasifica la información, limita quién puede acceder, cifra los datos sensibles, anonimiza o seudonimiza cuando sea posible y elimina lo que ya no necesitas.',
    },
  ],
  '/que-es-sexting': [
    {
      question: '¿Qué es el sexting?',
      answer:
        'Es enviar o recibir mensajes, fotos o videos de contenido sexual propio por celular o Internet. Aunque se comparta con alguien de confianza, se pierde el control de ese contenido una vez enviado.',
    },
    {
      question: '¿Cuáles son los riesgos del sexting?',
      answer:
        'Que el contenido se reenvíe o se publique sin consentimiento, que se use para chantajear (sextorsión), el ciberacoso y el daño a la reputación. Cuando hay menores de edad, ese contenido es material de abuso sexual infantil y es un delito.',
    },
    {
      question: '¿Qué hago si alguien comparte una foto íntima mía sin permiso?',
      answer:
        'No es tu culpa. Guarda evidencia (capturas, enlaces, perfiles), reporta el contenido en la plataforma para que lo retiren, busca apoyo en una persona de confianza y denuncia ante las autoridades. Si eres menor de edad, cuéntale a un adulto de confianza.',
    },
    {
      question: '¿Cómo hablar de sexting con niños, niñas y adolescentes?',
      answer:
        'Sin alarmismo y sin culpar: explica que lo que se envía puede salirse de control, que nadie puede presionarlos para enviar fotos y que siempre pueden pedir ayuda si algo sale mal.',
    },
  ],
  '/que-es-sextorsion': [
    {
      question: '¿Qué es la sextorsión?',
      answer:
        'Es un chantaje en el que alguien amenaza con publicar o enviar imágenes o videos íntimos de la víctima, reales o falsos, para obtener dinero, más contenido sexual u otros beneficios.',
    },
    {
      question: '¿Cómo suele empezar una sextorsión?',
      answer:
        'Con un perfil falso que coquetea y gana confianza rápido, lleva la conversación a lo íntimo y consigue una foto o una videollamada. Después llega la amenaza. También hay correos masivos que dicen tener videos tuyos sin tenerlos.',
    },
    {
      question: '¿Debo pagar si me extorsionan?',
      answer:
        'No. Pagar no garantiza que borren el contenido y normalmente lleva a nuevas exigencias. Deja de responder, no borres la conversación, guarda evidencia, bloquea y reporta el perfil y denuncia ante las autoridades.',
    },
    {
      question: '¿Qué hacer si la víctima es un niño, niña o adolescente?',
      answer:
        'Escúchalo sin culparlo, conserva la evidencia sin reenviar las imágenes, reporta el perfil en la plataforma y denuncia de inmediato ante la policía o fiscalía especializada. El contenido sexual de menores es un delito grave y las autoridades pueden actuar.',
    },
  ],
  '/rompehielos': [
    {
      question: '¿Para qué sirve el rompehielos?',
      answer:
        'Para empezar reuniones, talleres o capacitaciones de ciberseguridad con preguntas y dinámicas que ayudan al equipo a conocerse, relajarse y hablar de seguridad sin que se sienta como una clase.',
    },
    {
      question: '¿Cómo se usa en una sesión?',
      answer:
        'Proyecta la herramienta, elige una pregunta al azar y deja que varias personas respondan. Unos 5 a 10 minutos al inicio suelen ser suficientes.',
    },
    {
      question: '¿Sirve para equipos que no son técnicos?',
      answer:
        'Sí. Las preguntas no requieren conocimientos técnicos y ayudan a crear una cultura de seguridad en toda la organización.',
    },
  ],
  '/rompehielos-practicas-ciberseguridad': [
    {
      question: '¿Cómo funciona la dinámica de buenas y malas prácticas?',
      answer:
        'Se presenta una práctica sobre dispositivos, contraseñas, red, correo o procesos; el grupo discute si es buena o mala y luego se revela la respuesta con su explicación.',
    },
    {
      question: '¿Cuántas personas pueden participar?',
      answer:
        'Funciona en grupos pequeños y grandes, presencial o virtual: basta con proyectar la pantalla y abrir la discusión.',
    },
    {
      question: '¿Qué gana el equipo con esta dinámica?',
      answer:
        'Aclarar mitos frecuentes, discutir casos reales del día a día y recordar las prácticas correctas de forma participativa, que se recuerda mejor que una presentación.',
    },
  ],
  '/suplantacion-marcas': [
    {
      question: '¿Qué es la suplantación de marca?',
      answer:
        'Es cuando delincuentes crean cuentas, anuncios, sitios web o números de WhatsApp que imitan a una marca real para engañar a sus clientes, robar datos o dinero, o dañar su reputación.',
    },
    {
      question: '¿Cómo verifico si una cuenta en redes sociales es oficial?',
      answer:
        'Entra desde el sitio web oficial de la marca a sus redes, revisa la insignia de verificación, la antigüedad de la cuenta, el número de seguidores y publicaciones y que el nombre de usuario sea exactamente el oficial, sin letras o guiones extra.',
    },
    {
      question: '¿Qué hago si encuentro una cuenta que suplanta una marca?',
      answer:
        'No interactúes ni compartas datos. Repórtala en la plataforma como suplantación y avisa a la marca por sus canales oficiales. Si eres la marca, documenta la evidencia y solicita la baja.',
    },
  ],
  '/tabla-periodica-ciberseguridad': [
    {
      question: '¿Qué es la Tabla Periódica de Ciberseguridad?',
      answer:
        'Una forma visual de explorar los controles del Kudo Framework, organizados por dominio como los elementos de una tabla periódica. Cada elemento abre la información de su control.',
    },
    {
      question: '¿Qué es el Kudo Framework?',
      answer:
        'Es el framework de ciberseguridad open-source de DivisionCero, hecho por y para LatAm, con dominios, controles, cuestionarios de autoevaluación y plantillas de políticas.',
    },
    {
      question: '¿Para qué sirve la tabla?',
      answer:
        'Para tener una vista general de los controles, explicar la ciberseguridad en charlas y capacitaciones y ubicar rápidamente qué dominio cubre cada tema.',
    },
  ],
  '/temporizador': [
    {
      question: '¿Para qué sirve este temporizador?',
      answer:
        'Para controlar el tiempo en charlas, clases, dinámicas y transmisiones: defines los minutos, lo proyectas en pantalla completa y todos ven el tiempo restante.',
    },
    {
      question: '¿Avisa cuando se está acabando el tiempo?',
      answer: 'Sí. Cambia de color en los últimos 10 segundos para que quien habla y el público lo noten.',
    },
    {
      question: '¿Necesito instalar algo?',
      answer: 'No. Funciona en el navegador, gratis y sin registro.',
    },
  ],
  '/totp': [
    {
      question: '¿Qué es un código TOTP?',
      answer:
        'TOTP (Time-based One-Time Password, RFC 6238) es el código de un solo uso que muestran apps como Google Authenticator o Microsoft Authenticator. Se calcula a partir de una clave secreta compartida y la hora actual, y cambia cada cierto periodo, normalmente 30 segundos.',
    },
    {
      question: '¿Para qué sirve este generador?',
      answer:
        'Para probar y depurar implementaciones de 2FA, verificar que una clave secreta Base32 genera los códigos esperados o crear el QR para añadirla a una app autenticadora. Puedes configurar los dígitos, el periodo y el algoritmo (SHA-1, SHA-256 o SHA-512).',
    },
    {
      question: '¿Mi clave secreta se envía a algún servidor?',
      answer:
        'No. Los códigos se calculan en tu navegador. Aun así, no uses aquí las claves de tus cuentas reales: quien tenga la clave secreta puede generar tus códigos de 2FA.',
    },
    {
      question: '¿Por qué el código no coincide con el de mi app?',
      answer:
        'Normalmente porque el reloj del dispositivo está desincronizado o porque los parámetros no coinciden: revisa que el número de dígitos, el periodo y el algoritmo sean los mismos en ambos lados.',
    },
  ],
  '/triada-cia': [
    {
      question: '¿Qué es la tríada CIA?',
      answer:
        'Es el modelo básico de la seguridad de la información y sus tres pilares: Confidencialidad (solo acceden quienes deben), Integridad (la información no se altera sin autorización) y Disponibilidad (la información está accesible cuando se necesita).',
    },
    {
      question: '¿Por qué se llama CIA?',
      answer:
        'Por las iniciales en inglés: Confidentiality, Integrity y Availability. No tiene relación con la agencia de inteligencia. En español también se le llama tríada CID.',
    },
    {
      question: '¿Puedes dar un ejemplo de cada pilar?',
      answer:
        'Confidencialidad: cifrar un portátil para que nadie lea sus datos si se pierde. Integridad: verificar el hash de un archivo antes de instalarlo. Disponibilidad: tener copias de seguridad y redundancia para seguir operando ante un ransomware.',
    },
  ],
  '/validador-spf': [
    {
      question: '¿Qué es un registro SPF?',
      answer:
        'SPF (Sender Policy Framework) es un registro TXT en el DNS de tu dominio que indica qué servidores pueden enviar correo en su nombre. Ayuda a que otros servidores rechacen o marquen los correos que suplantan tu dominio.',
    },
    {
      question: '¿Qué revisa el validador?',
      answer:
        'Consulta el DNS del dominio, obtiene el registro SPF y revisa su sintaxis, sus mecanismos (include, ip4, ip6, a, mx…) y su política final (~all, -all), señalando errores y configuraciones débiles.',
    },
    {
      question: '¿Qué diferencia hay entre ~all y -all?',
      answer:
        '-all (hardfail) indica que se rechace el correo de servidores no autorizados; ~all (softfail) indica que se acepte pero se marque como sospechoso. +all permite que cualquiera envíe en tu nombre y nunca debe usarse.',
    },
    {
      question: '¿SPF basta para proteger mi dominio de la suplantación?',
      answer:
        'No. SPF debe combinarse con DKIM, que firma los correos, y DMARC, que define qué hacer cuando fallan las verificaciones y envía reportes. Los tres juntos son la base de la seguridad del correo.',
    },
  ],
  '/verificar-sitio-seguro': [
    {
      question: '¿Cómo sé si un sitio web es seguro?',
      answer:
        'Revisa que el dominio sea exactamente el oficial, que la conexión use HTTPS con un certificado válido, que llegaste escribiendo la dirección o desde un enlace confiable y que el sitio no te presione para pagar o entregar datos con urgencia.',
    },
    {
      question: '¿El candado de HTTPS significa que el sitio es confiable?',
      answer:
        'No por sí solo. El candado indica que la conexión está cifrada, pero cualquier persona, incluso un estafador, puede obtener un certificado. Hay que revisar también el dominio.',
    },
    {
      question: '¿Cómo detecto un dominio falso?',
      answer:
        'Busca letras cambiadas o añadidas (paypa1, bancco), subdominios engañosos (banco.com.seguridad-login.net), extensiones distintas a la oficial y enlaces acortados que esconden el destino.',
    },
  ],
  '/visor-hexadecimal': [
    {
      question: '¿Qué es un visor hexadecimal?',
      answer:
        'Es una herramienta que muestra el contenido de un archivo byte a byte en hexadecimal, junto con su representación en ASCII, para ver lo que realmente contiene más allá de su extensión.',
    },
    {
      question: '¿Para qué sirve en ciberseguridad?',
      answer:
        'Para identificar el tipo real de un archivo por su firma (magic bytes), encontrar texto oculto o cadenas sospechosas, revisar archivos dañados y apoyar el análisis forense y de malware.',
    },
    {
      question: '¿Qué tamaño de archivo puedo cargar?',
      answer: 'Hasta 10 MB. Puedes buscar texto o secuencias de bytes dentro del archivo.',
    },
    {
      question: '¿El archivo se sube a un servidor?',
      answer: 'No. El archivo se lee en tu navegador y no sale de tu equipo.',
    },
  ],
  '/whois-ip-y-dominio': [
    {
      question: '¿Qué es una consulta WHOIS?',
      answer:
        'Es una consulta a los registros públicos de Internet para saber quién tiene asignada una dirección IP o un dominio: titular u organización, registrador, fechas de registro y expiración, servidores DNS y contactos de abuso.',
    },
    {
      question: '¿De dónde se obtiene la información?',
      answer:
        'De los registros regionales de Internet (LACNIC, ARIN, RIPE, entre otros) y de los registros de dominios, mediante RDAP, el protocolo que reemplaza al WHOIS tradicional.',
    },
    {
      question: '¿Para qué sirve en ciberseguridad?',
      answer:
        'Para investigar una IP que aparece en tus logs, saber a qué organización y ASN pertenece, identificar a quién reportar un abuso, revisar si un dominio sospechoso fue registrado hace pocos días y documentar la consulta con el reporte en PDF.',
    },
    {
      question: '¿Por qué algunos datos aparecen ocultos?',
      answer:
        'Porque muchos registradores ocultan los datos personales del titular por privacidad, por ejemplo para cumplir el GDPR. En esos casos se muestra el registrador o un servicio de privacidad.',
    },
  ],
  '/workflow-ciberseguridad': [
    {
      question: '¿Qué muestra el Workflow de Ciberseguridad?',
      answer:
        'Un diagrama con una visión general de cómo funcionan los procesos de ciberseguridad de una organización y cómo capacitar, optimizar y automatizar cada etapa.',
    },
    {
      question: '¿Para quién es útil?',
      answer:
        'Para líderes, equipos de seguridad y personas de negocio que necesitan explicar o entender cómo se conectan las actividades de ciberseguridad en el día a día.',
    },
    {
      question: '¿Cómo se relaciona con el Kudo Framework?',
      answer:
        'El Kudo Framework de DivisionCero define los dominios y controles; el workflow ayuda a ver cómo esos procesos se llevan a la operación.',
    },
  ],
};
