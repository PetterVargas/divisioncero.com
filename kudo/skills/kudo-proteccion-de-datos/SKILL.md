---
name: kudo-proteccion-de-datos
description: Gestiona la protección de datos personales y la clasificación de la información con los controles DIA de Kudo (inventario, puntos de recolección, ciclo de vida, retención, ubicación) y la legislación de LatAm. Úsala para construir el registro de actividades de tratamiento, clasificar información, definir plazos de retención, atender derechos de titulares o evaluar una transferencia internacional.
---

# Protección de Datos con Kudo

Basada en las políticas de Privacidad (`POL-DIA-01`), Clasificación y Manejo de la Información (`POL-DIA-04`) y Retención y Eliminación de Datos (`POL-DIA-05`); controles DIA-1 a DIA-6.

## Clasificación de la información

| Nivel | Ejemplos |
| ----- | -------- |
| Pública | Sitio web, comunicados |
| Interna | Procedimientos internos, directorio |
| Confidencial | Contratos, datos de clientes, código fuente, informes de vulnerabilidades |
| Restringida | Datos sensibles (salud, biométricos), tarjetas de pago, credenciales, llaves |

Sin clasificación → Interna. En conjuntos mixtos → el nivel más alto.

## Registro de actividades de tratamiento

| Base de datos / proceso | Finalidad | Base legal | Categorías de titulares | Datos (marca los sensibles) | Punto de recolección | Sistemas y ubicación | Terceros / transferencias | Plazo de conservación | Responsable |
| ----------------------- | --------- | ---------- | ----------------------- | --------------------------- | -------------------- | -------------------- | ------------------------- | --------------------- | ----------- |

## Legislación de referencia (verifica la vigencia con Legal)

Colombia: Ley 1581 de 2012 · Brasil: LGPD (Ley 13.709) · México: LFPDPPP · Perú: Ley 29733 · Argentina: Ley 25.326 · Chile: Ley 21.719 (reforma de la Ley 19.628) · Ecuador: LOPDP · y, si hay titulares en la UE, el GDPR. Pregunta en qué países opera la organización.

## Tareas frecuentes

- **Derechos de los titulares:** verificar identidad, responder dentro del plazo legal del país, registrar la solicitud y la respuesta; la supresión se aplica salvo obligación legal de conservar.
- **Retención:** define el plazo por categoría con su fundamento; al vencer, elimina o anonimiza y conserva la evidencia.
- **Transferencias internacionales:** verifica el nivel adecuado del país de destino o las garantías contractuales que exige la ley.
- **DPIA:** antes de tratamientos de alto riesgo (datos sensibles a gran escala, perfilamiento, IA).
- **Brecha de datos:** coordina con la skill `kudo-respuesta-a-incidentes` y evalúa la notificación a la autoridad y a los titulares.

Trata los datos personales que te comparta el usuario con mínima exposición: no los repitas innecesariamente y sugiere anonimizarlos.
