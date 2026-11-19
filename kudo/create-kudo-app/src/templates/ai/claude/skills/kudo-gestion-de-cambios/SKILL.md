---
name: kudo-gestion-de-cambios
description: Evalúa y documenta cambios en sistemas con los controles CCN de Kudo (clasificación, análisis de impacto, pruebas y plan de rollback). Úsala para preparar una solicitud de cambio, revisar un despliegue a producción, definir criterios de reversión o configurar estrategias como blue-green y canary.
---

# Gestión de Cambios con Kudo

Basada en la Política de Gestión de Cambios y Configuraciones (`POL-CCN-03`) y los controles CCN-1, CCN-2 y CCN-3.

## Clasificación

| Tipo | Ejemplo | Aprobación |
| ---- | ------- | ---------- |
| Estándar | Despliegue automatizado con pruebas superadas | Preaprobado; se registra |
| Normal | Cambio con impacto limitado | Responsable técnico o par revisor |
| Mayor | Afecta datos de clientes, servicios críticos o seguridad | Comité de Cambios |
| Emergencia | Corrige un incidente en curso | Gerente de Cambios; revisión en 2 días hábiles |

## Plantilla de solicitud de cambio

- **Qué cambia y por qué** (enlace al ticket o *pull request*).
- **Sistemas y elementos de configuración afectados.**
- **Análisis de impacto:** seguridad, disponibilidad, datos, usuarios y continuidad.
- **Pruebas realizadas** en un entorno equivalente a producción (incluidas las de seguridad).
- **Ventana y comunicación** a los afectados.
- **Plan de rollback:** pasos, tiempo estimado y **criterios de activación** (por ejemplo: tasa de errores > 2 % durante 10 minutos o una funcionalidad crítica caída).
- **Verificación posterior** y responsable.

## Buenas prácticas

- Un cambio sin plan de reversión probado no está listo para producción.
- Prefiere estrategias reversibles: *feature flags*, *blue-green*, *canary*, migraciones de base de datos compatibles hacia atrás.
- Los cambios no autorizados detectados se tratan como posibles incidentes.
- Mantén las líneas base de configuración como código y detecta desviaciones (*drift*) automáticamente.
