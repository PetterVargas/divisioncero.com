import type { Dictionary } from '@/lib/site-translations';

export const en: Dictionary = {
  'Cuándo usarlo': 'When to use it',
  'Riesgo principal': 'Main risk',
  'Clave pública': 'Public key',
  '¿Quién puede tenerla?': 'Who can have it?',
  'Se comparte libremente, incluso publicándola. Sirve para que otros te cifren mensajes o verifiquen tus firmas.':
    'It\'s shared freely, even published. It lets others encrypt messages to you or verify your signatures.',
  'Clave privada': 'Private key',
  'Nunca se comparte con nadie. Sirve para descifrar los mensajes dirigidos a ti y para firmar los tuyos.':
    'It\'s never shared with anyone. It\'s used to decrypt messages addressed to you and to sign your own.',
  'Firma digital': 'Digital signature',
  '¿Para qué sirve?': 'What is it for?',
  'Un hash del mensaje cifrado con tu clave privada. Cualquiera puede verificarlo con tu clave pública.':
    'A hash of the message encrypted with your private key. Anyone can verify it with your public key.',
  'Paso anterior': 'Previous step',
  'Paso siguiente': 'Next step',
  'Reiniciar animación': 'Restart animation',
  'Cifrar un mensaje': 'Encrypt a message',
  'Firmar un mensaje': 'Sign a message',
  'Cifrar → Confidencialidad': 'Encrypt → Confidentiality',
  'Se cifra el mensaje con la clave pública del destinatario, para que solo quien tenga la clave privada correspondiente pueda leerlo.':
    'The message is encrypted with the recipient\'s public key, so only whoever holds the matching private key can read it.',
  'Alice cifra un contrato con la clave pública de Bob antes de enviárselo por correo.':
    'Alice encrypts a contract with Bob\'s public key before emailing it to him.',
  'Cuando el contenido es sensible y nadie más debe poder leerlo en tránsito.':
    'When the content is sensitive and nobody else should be able to read it in transit.',
  'No prueba quién lo envió: cualquiera con la clave pública del destinatario puede cifrarle algo.':
    'It doesn\'t prove who sent it: anyone with the recipient\'s public key can encrypt something for them.',
  'Firmar → Autenticidad e integridad': 'Sign → Authenticity and integrity',
  'Se cifra un hash del mensaje con la clave privada del remitente, para que cualquiera pueda verificar con su clave pública que es auténtico y no fue alterado.':
    'A hash of the message is encrypted with the sender\'s private key, so anyone can verify with their public key that it\'s authentic and wasn\'t altered.',
  'Alice firma un comunicado oficial para que todos puedan comprobar que es realmente suyo.':
    'Alice signs an official statement so everyone can check that it\'s really hers.',
  'Cuando lo importante es demostrar autoría e integridad, aunque el contenido no sea secreto.':
    'When what matters is proving authorship and integrity, even if the content isn\'t secret.',
  'No oculta el contenido: cualquiera puede leer el mensaje, solo se verifica que no fue alterado.':
    'It doesn\'t hide the content: anyone can read the message; it only verifies that it wasn\'t altered.',
  'Cifrado simétrico': 'Symmetric encryption',
  'Usa una única clave para cifrar y descifrar. Es muy rápido, pero esa misma clave debe compartirse de forma segura entre ambas partes.':
    'It uses a single key to encrypt and decrypt. It\'s very fast, but that same key must be shared securely between both parties.',
  'AES cifra el cuerpo del mensaje en PGP usando una clave de sesión generada al vuelo.':
    'In PGP, AES encrypts the message body using a session key generated on the fly.',
  'Para cifrar grandes volúmenes de datos rápidamente, una vez que ambas partes tienen la clave.':
    'To encrypt large volumes of data quickly, once both parties have the key.',
  'Si la clave se filtra al compartirla, cualquiera con ella puede descifrar todo el contenido.':
    'If the key leaks while being shared, anyone who has it can decrypt all the content.',
  'Cifrado asimétrico': 'Asymmetric encryption',
  'Usa un par de claves matemáticamente vinculadas: lo que cifra una clave pública, solo lo descifra su clave privada correspondiente.':
    'It uses a mathematically linked key pair: what a public key encrypts, only its matching private key can decrypt.',
  'RSA/ECC cifra en PGP la clave de sesión (no el mensaje completo) con la clave pública del destinatario.':
    'In PGP, RSA/ECC encrypts the session key (not the whole message) with the recipient\'s public key.',
  'Para intercambiar una clave de sesión de forma segura sin haberla compartido antes por otro canal.':
    'To exchange a session key securely without having shared it before through another channel.',
  'Es mucho más lento que el cifrado simétrico para grandes cantidades de datos.':
    'It\'s much slower than symmetric encryption for large amounts of data.',
  'Par de claves': 'Key pair',
  'Mensaje': 'Message',
  'Cifrado': 'Encryption',
  'Tránsito': 'Transit',
  'Descifrado': 'Decryption',
  'Verificación': 'Verification',
  'Firma': 'Signature',
  'Bob genera su par de claves': 'Bob generates his key pair',
  'Bob crea un par de claves matemáticamente vinculadas: una pública, que puede compartir libremente (incluso publicarla), y una privada, que guarda en secreto y nunca comparte con nadie.':
    'Bob creates a mathematically linked key pair: a public one he can share freely (even publish), and a private one he keeps secret and never shares with anyone.',
  'Clave pública de Bob → la comparte con quien quiera escribirle':
    'Bob\'s public key → he shares it with anyone who wants to write to him',
  'Clave privada de Bob → se queda solo con él': 'Bob\'s private key → stays with him only',
  'Alice redacta el mensaje': 'Alice writes the message',
  'Alice quiere enviarle a Bob información confidencial y necesita asegurarse de que nadie más, ni siquiera un intermediario, pueda leerla.':
    'Alice wants to send Bob confidential information and needs to make sure nobody else, not even an intermediary, can read it.',
  'Mensaje en texto plano: "Reunión confirmada a las 3pm..."': 'Plain-text message: "Meeting confirmed at 3pm..."',
  'Cifrado híbrido con la clave pública de Bob': 'Hybrid encryption with Bob\'s public key',
  'Cifrar todo el mensaje directamente con RSA sería lento. Por eso PGP usa cifrado híbrido: genera una clave de sesión simétrica aleatoria, cifra el mensaje con ella (rápido), y luego cifra esa clave de sesión con la clave pública de Bob.':
    'Encrypting the whole message directly with RSA would be slow. That\'s why PGP uses hybrid encryption: it generates a random symmetric session key, encrypts the message with it (fast), and then encrypts that session key with Bob\'s public key.',
  'Clave de sesión (AES) cifra el mensaje completo': 'Session key (AES) encrypts the whole message',
  'Clave pública de Bob cifra esa clave de sesión': 'Bob\'s public key encrypts that session key',
  'El mensaje viaja por un canal inseguro': 'The message travels over an insecure channel',
  'El mensaje cifrado y la clave de sesión cifrada se envían por correo o cualquier canal, sin importar que alguien los intercepte en el camino.':
    'The encrypted message and the encrypted session key are sent by email or any channel, regardless of whether someone intercepts them along the way.',
  'Un atacante intercepta el tráfico': 'An attacker intercepts the traffic',
  'No puede leerlo: no tiene la clave privada de Bob': 'They can\'t read it: they don\'t have Bob\'s private key',
  'Bob descifra con su clave privada': 'Bob decrypts with his private key',
  'Bob usa su clave privada para descifrar la clave de sesión, y con esa clave de sesión descifra el mensaje original.':
    'Bob uses his private key to decrypt the session key, and with that session key he decrypts the original message.',
  'Clave privada de Bob descifra la clave de sesión': 'Bob\'s private key decrypts the session key',
  'La clave de sesión descifra el mensaje completo': 'The session key decrypts the whole message',
  'Confidencialidad garantizada': 'Confidentiality guaranteed',
  'Solo Bob, el único que tiene la clave privada correspondiente, pudo leer el mensaje original. Cualquier otra persona que lo intercepte solo ve datos cifrados.':
    'Only Bob, the only one with the matching private key, could read the original message. Anyone else who intercepts it only sees encrypted data.',
  'Mensaje leído únicamente por Bob': 'Message read only by Bob',
  'Sin la clave privada de Bob, el mensaje es inútil': 'Without Bob\'s private key, the message is useless',
  'Alice genera su par de claves': 'Alice generates her key pair',
  'Alice también tiene su propio par de claves: usará su clave privada para firmar, y compartirá su clave pública para que cualquiera pueda verificar esa firma.':
    'Alice also has her own key pair: she\'ll use her private key to sign, and share her public key so anyone can verify that signature.',
  'Clave pública de Alice → la publica o comparte': 'Alice\'s public key → she publishes or shares it',
  'Clave privada de Alice → se queda solo con ella': 'Alice\'s private key → stays with her only',
  'Alice calcula el hash del mensaje': 'Alice computes the message hash',
  'Antes de firmar, PGP genera un hash (huella digital) del contenido: una función como SHA-256 produce un resumen único, y cualquier cambio en el mensaje —por mínimo que sea— altera ese resumen por completo.':
    'Before signing, PGP generates a hash (fingerprint) of the content: a function like SHA-256 produces a unique digest, and any change to the message —however small— completely changes that digest.',
  'Mensaje → función hash → resumen único de longitud fija': 'Message → hash function → unique fixed-length digest',
  'Alice firma el hash con su clave privada': 'Alice signs the hash with her private key',
  'Alice cifra ese hash con su clave privada. El resultado es la firma digital, que se adjunta al mensaje original (que puede viajar en claro o también cifrado si además se quiere confidencialidad).':
    'Alice encrypts that hash with her private key. The result is the digital signature, which is attached to the original message (which can travel in the clear, or also encrypted if confidentiality is wanted too).',
  'Hash cifrado con la clave privada de Alice = firma digital':
    'Hash encrypted with Alice\'s private key = digital signature',
  'El mensaje y la firma viajan juntos': 'The message and the signature travel together',
  'Alice envía el mensaje junto con su firma digital. Cualquiera puede leerlo si no está también cifrado, pero nadie más pudo haber generado esa firma en particular.':
    'Alice sends the message along with her digital signature. Anyone can read it if it isn\'t also encrypted, but nobody else could have produced that particular signature.',
  'Un atacante podría intentar alterar el mensaje en tránsito': 'An attacker could try to alter the message in transit',
  'No puede generar una firma válida sin la clave privada de Alice':
    'They can\'t produce a valid signature without Alice\'s private key',
  'Bob verifica con la clave pública de Alice': 'Bob verifies with Alice\'s public key',
  'Bob calcula su propio hash del mensaje recibido y usa la clave pública de Alice para descifrar la firma, obteniendo el hash que ella firmó originalmente.':
    'Bob computes his own hash of the received message and uses Alice\'s public key to decrypt the signature, getting the hash she originally signed.',
  'Bob recalcula el hash del mensaje recibido': 'Bob recomputes the hash of the received message',
  'La clave pública de Alice descifra la firma → hash original':
    'Alice\'s public key decrypts the signature → original hash',
  'Autenticidad e integridad verificadas': 'Authenticity and integrity verified',
  'Si ambos hashes coinciden, el mensaje es realmente de Alice y no fue modificado en el camino. Si no coinciden, el mensaje fue alterado o la firma no es válida.':
    'If both hashes match, the message really is from Alice and wasn\'t modified along the way. If they don\'t match, the message was altered or the signature is invalid.',
  'Hashes coinciden → mensaje auténtico y sin alterar': 'Hashes match → authentic, unaltered message',
  'Hashes distintos → mensaje alterado o firma inválida': 'Hashes differ → altered message or invalid signature',
  'Cifrar vs. Firmar': 'Encrypt vs. Sign',
  'Cifrado simétrico vs. asimétrico': 'Symmetric vs. asymmetric encryption',
  'Paso {n} de {total}': 'Step {n} of {total}',
};
