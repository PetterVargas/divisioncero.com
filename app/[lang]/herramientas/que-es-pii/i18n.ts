import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  '¿Por qué importa?': 'Why does it matter?',
  'Ejemplos comunes': 'Common examples',
  'Cómo protegerla': 'How to protect it',
  'Minimización': 'Minimization',
  'Recolecta solo el dato que realmente necesitas para ese propósito específico, nada "por si acaso".':
    'Collect only the data you really need for that specific purpose, nothing "just in case".',
  'Limitación de propósito': 'Purpose limitation',
  'Usa el dato únicamente para el fin que informaste a la persona al recolectarlo.':
    'Use the data only for the purpose you told the person about when collecting it.',
  'Limitación de retención': 'Retention limitation',
  'Define por cuánto tiempo se guarda cada dato y elimínalo cuando ya no sea necesario.':
    'Define how long each piece of data is kept and delete it when it\'s no longer needed.',
  'Seguridad por defecto': 'Security by default',
  'Cifra, controla el acceso y registra auditoría desde el diseño, no como un parche posterior.':
    'Encrypt, control access and keep audit logs from the design stage, not as a later patch.',
  'Principios generales para proteger datos PII': 'General principles for protecting PII',
  'Marco regulatorio (referencia general, no asesoría legal)':
    'Regulatory framework (general reference, not legal advice)',
  'La mayoría de países tienen leyes de protección de datos personales que exigen bases legales para tratar PII y refuerzan los requisitos para datos sensibles: el GDPR en la Unión Europea, la LGPD en Brasil, la Ley 1581 de 2012 (Habeas Data) en Colombia, la LFPDPPP en México, o la Ley 25.326 en Argentina, entre otras. Si manejas datos personales, valida siempre los requisitos específicos de tu jurisdicción con asesoría legal.':
    'Most countries have personal data protection laws that require a legal basis to process PII and add stricter requirements for sensitive data: the GDPR in the European Union, the LGPD in Brazil, Law 1581 of 2012 (Habeas Data) in Colombia, the LFPDPPP in Mexico, or Law 25.326 in Argentina, among others. If you handle personal data, always check the specific requirements of your jurisdiction with legal counsel.',
  'Cargando escenarios...': 'Loading scenarios...',
  'Ver resultados': 'See results',
  'Siguiente escenario': 'Next scenario',
  '¡Práctica completada!': 'Practice completed!',
  'Identificaste correctamente': 'You correctly identified',
  'Es PII': 'It\'s PII',
  'No es PII': 'It\'s not PII',
  'PII directa': 'Direct PII',
  'PII indirecta': 'Indirect PII',
  'PII sensible': 'Sensitive PII',
  '¿Identifica a alguien por sí sola?': 'Does it identify someone on its own?',
  'Un dato que, por sí mismo, permite identificar de forma única e inequívoca a una persona específica.':
    'Data that, on its own, uniquely and unequivocally identifies a specific person.',
  'Basta ese único dato para saber exactamente de quién se trata.':
    'That single piece of data is enough to know exactly who it is.',
  'Nombre completo': 'Full name',
  'Número de identificación (cédula, DNI, pasaporte)': 'ID number (national ID, passport)',
  'Correo electrónico personal': 'Personal email',
  'Número de teléfono': 'Phone number',
  'Número de tarjeta bancaria': 'Bank card number',
  'Dirección física completa': 'Full physical address',
  'Minimizar qué datos directos se piden y para qué': 'Minimize which direct data is requested and why',
  'Cifrar en tránsito y en reposo': 'Encrypt in transit and at rest',
  'Enmascarar o truncar en pantallas y logs (ej. mostrar solo los últimos 4 dígitos)':
    'Mask or truncate in screens and logs (e.g. show only the last 4 digits)',
  'Controlar el acceso con el principio de mínimo privilegio': 'Control access with the principle of least privilege',
  '¿Identifica solo si se combina con otros datos?': 'Does it identify only when combined with other data?',
  'Un dato que no identifica a una persona por sí solo, pero que combinado con otros datos aparentemente inocuos sí permite identificarla.':
    'Data that doesn\'t identify a person on its own, but does when combined with other seemingly harmless data.',
  'El riesgo aparece al cruzar varias piezas "anónimas" entre sí. Un estudio clásico mostró que fecha de nacimiento + código postal + género identifican a la mayoría de personas en EE. UU.':
    'The risk appears when several "anonymous" pieces are cross-referenced. A classic study showed that date of birth + ZIP code + gender identify most people in the US.',
  'Fecha de nacimiento': 'Date of birth',
  'Código postal': 'Postal code',
  'Género': 'Gender',
  'Cargo o profesión': 'Job title or profession',
  'Dirección IP': 'IP address',
  'Identificador publicitario del dispositivo (advertising ID)': 'Device advertising identifier (advertising ID)',
  'Evaluar el riesgo de re-identificación al combinar datasets':
    'Assess the re-identification risk when combining datasets',
  'Aplicar técnicas de anonimización o generalización (ej. k-anonimidad)':
    'Apply anonymization or generalization techniques (e.g. k-anonymity)',
  'Reducir la granularidad (ej. rango de edad en vez de fecha exacta)':
    'Reduce granularity (e.g. age range instead of exact date)',
  'Aislar bases de datos que, combinadas, podrían re-identificar personas':
    'Isolate databases that, combined, could re-identify people',
  '¿Su filtración causaría un daño mayor?': 'Would its leak cause greater harm?',
  'Categoría especial de datos personales que, de filtrarse o usarse indebidamente, puede generar discriminación, daño grave o poner en riesgo la seguridad de la persona.':
    'A special category of personal data that, if leaked or misused, can lead to discrimination, serious harm, or put the person\'s safety at risk.',
  'Leyes como el GDPR (UE), la LGPD (Brasil) o la Ley 1581 de 2012 (Colombia) exigen consentimiento explícito y medidas de seguridad reforzadas para esta categoría.':
    'Laws like the GDPR (EU), the LGPD (Brazil) or Law 1581 of 2012 (Colombia) require explicit consent and stronger security measures for this category.',
  'Datos de salud (historial médico, diagnósticos)': 'Health data (medical history, diagnoses)',
  'Datos biométricos (huella, reconocimiento facial)': 'Biometric data (fingerprint, facial recognition)',
  'Orientación sexual e identidad de género': 'Sexual orientation and gender identity',
  'Creencias religiosas, políticas o afiliación sindical': 'Religious or political beliefs or union membership',
  'Origen étnico o racial': 'Ethnic or racial origin',
  'Datos de menores de edad': 'Data about minors',
  'Consentimiento explícito e informado antes de recolectarlos': 'Explicit, informed consent before collecting it',
  'Cifrado reforzado y acceso restringido a un grupo mínimo de personas':
    'Stronger encryption and access restricted to a minimal group of people',
  'Registro de auditoría de cada acceso': 'An audit log of every access',
  'Plan de respuesta a incidentes específico para este tipo de datos':
    'An incident response plan specific to this type of data',
  'El nombre completo de un cliente guardado en la base de datos de una tienda.':
    'A customer\'s full name stored in a store\'s database.',
  'Identifica de forma directa e inequívoca a una persona específica.':
    'It directly and unequivocally identifies a specific person.',
  'El color favorito que alguien eligió en una encuesta completamente anónima, sin ningún otro dato asociado.':
    'The favorite color someone chose in a completely anonymous survey, with no other associated data.',
  'Sin vincularse a ninguna identidad ni a otros datos, esa preferencia no permite identificar a nadie.':
    'Without being linked to any identity or other data, that preference can\'t identify anyone.',
  'El número de cédula o DNI de una persona.': 'A person\'s national ID number.',
  'Es un identificador único emitido por el Estado: por sí solo señala a una persona exacta.':
    'It\'s a unique identifier issued by the state: on its own it points to an exact person.',
  'La dirección IP con la que un visitante navegó por tu sitio web.':
    'The IP address a visitor used to browse your website.',
  'Por sí sola no revela un nombre, pero junto con los registros del proveedor de internet o de la plataforma puede rastrearse hasta una persona específica. Muchas leyes de protección de datos la consideran dato personal.':
    'On its own it doesn\'t reveal a name, but together with the internet provider\'s or the platform\'s records it can be traced to a specific person. Many data protection laws consider it personal data.',
  'El diagnóstico médico de un paciente registrado en su historia clínica.':
    'A patient\'s medical diagnosis recorded in their medical history.',
  'Es un dato de salud: su filtración puede derivar en discriminación o daño grave, por lo que requiere protección reforzada.':
    'It\'s health data: its leak can lead to discrimination or serious harm, so it requires stronger protection.',
  'El promedio de edad de todos los empleados de una empresa, expresado como una sola cifra agregada.':
    'The average age of all of a company\'s employees, expressed as a single aggregate figure.',
  'Es un dato estadístico agregado que no permite identificar ni distinguir a ningún individuo dentro del grupo.':
    'It\'s an aggregate statistic that can\'t identify or single out any individual within the group.',
  'La huella dactilar que alguien usa para desbloquear su celular.':
    'The fingerprint someone uses to unlock their phone.',
  'Es un dato biométrico: identifica de forma única a la persona y no puede "cambiarse" si se filtra.':
    'It\'s biometric data: it uniquely identifies the person and can\'t be "changed" if it leaks.',
  'El código postal, la fecha de nacimiento y el género de una persona, guardados juntos en el mismo registro.':
    'A person\'s postal code, date of birth and gender, stored together in the same record.',
  'Ninguno de los tres identifica por sí solo, pero combinados son un cuasi-identificador muy fuerte: estudios muestran que esta combinación re-identifica a la mayoría de la población de un país.':
    'None of the three identifies on its own, but combined they\'re a very strong quasi-identifier: studies show this combination re-identifies most of a country\'s population.',
  'El correo genérico de soporte, info@empresa.com, que reciben varias personas del equipo.':
    'The generic support email, info@empresa.com, received by several people on the team.',
  'No está vinculado a una persona física específica: es una cuenta compartida o departamental.':
    'It isn\'t linked to a specific individual: it\'s a shared or departmental account.',
  'El correo personal de un empleado, con formato nombre.apellido@empresa.com.':
    'An employee\'s personal email, in the format firstname.lastname@empresa.com.',
  'Identifica de forma directa a una persona concreta dentro de la organización.':
    'It directly identifies a specific person within the organization.',
  'Un dataset de ventas correctamente anonimizado, donde se eliminaron todos los identificadores y solo quedan montos agregados por región.':
    'A properly anonymized sales dataset, where all identifiers were removed and only aggregated amounts by region remain.',
  'Una anonimización irreversible rompe el vínculo con individuos: al no poder re-identificarse a nadie, deja de ser un dato personal (si solo estuviera "pseudonimizado" y fuera reversible, seguiría siendo PII).':
    'Irreversible anonymization breaks the link with individuals: since nobody can be re-identified, it stops being personal data (if it were only "pseudonymized" and reversible, it would still be PII).',
  'El historial de ubicaciones GPS minuto a minuto de un usuario de una app de transporte.':
    'A ride-hailing app user\'s minute-by-minute GPS location history.',
  'La geolocalización precisa y continua puede revelar dónde vive, dónde trabaja y qué lugares sensibles visita (clínicas, templos, sindicatos), por lo que se trata como dato de alto riesgo.':
    'Precise, continuous geolocation can reveal where someone lives, works and which sensitive places they visit (clinics, places of worship, unions), so it\'s treated as high-risk data.',
  'La afiliación sindical que una persona declaró en un formulario de recursos humanos.':
    'The union membership a person declared on an HR form.',
  'Es una categoría especial de dato personal que puede exponer a la persona a discriminación.':
    'It\'s a special category of personal data that can expose the person to discrimination.',
  'El identificador publicitario (advertising ID) de un teléfono, usado para rastrear su comportamiento entre apps.':
    'A phone\'s advertising identifier (advertising ID), used to track its behavior across apps.',
  'No lleva un nombre asociado, pero permite rastrear y perfilar a un dispositivo (y a quien lo usa) a lo largo del tiempo.':
    'It has no name attached, but it makes it possible to track and profile a device (and whoever uses it) over time.',
  'El nombre de la empresa donde trabaja alguien, mencionado sin referirse a ninguna persona en particular.':
    'The name of the company where someone works, mentioned without referring to any particular person.',
  'Es información sobre una organización, no sobre un individuo identificable.':
    'It\'s information about an organization, not about an identifiable individual.',
  'Escenario {n} de {total}': 'Scenario {n} of {total}',
  'Puntaje: {score}/{total}': 'Score: {score}/{total}',
  '¡Correcto!': 'Correct!',
  'No exactamente.': 'Not quite.',
};
