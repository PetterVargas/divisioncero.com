---
name: kudo-gestion-de-vulnerabilidades
description: Prioriza vulnerabilidades y define planes de remediación con los plazos de Kudo según severidad y exposición, y analiza reportes de escáneres (CVE/CVSS). Úsala al revisar resultados de un escaneo, un aviso de seguridad, una prueba de penetración o al calcular el cumplimiento de plazos de parcheo.
---

# Gestión de Vulnerabilidades con Kudo

Basada en la Política de Gestión de Vulnerabilidades y Parches (`POL-ADR-02`) y los controles ADR-2, CIP-6 y CIF-3.

## Priorización

1. Parte del CVSS base y ajústalo con el contexto:
   - ¿Está **explotada activamente**? (por ejemplo, en el catálogo KEV de CISA) → trátala como Crítica.
   - ¿El activo está **expuesto a internet**?
   - ¿Hay *exploit* público?
   - Criticidad del activo y clasificación de los datos.
2. Asigna el plazo:

| Severidad | Expuesto a internet | Interno |
| --------- | ------------------- | ------- |
| Crítica o explotada | 72 horas | 7 días |
| Alta | 15 días | 30 días |
| Media | 60 días | 90 días |
| Baja | Siguiente ciclo | Siguiente ciclo |

## Análisis de un reporte de escáner

- Agrupa por causa (un parche del sistema operativo puede cerrar 40 hallazgos) y por propietario.
- Descarta falsos positivos con evidencia, no por suposición.
- Entrega una tabla: activo, vulnerabilidad (CVE), severidad ajustada, plazo, acción (parche, configuración, control compensatorio), responsable.

## Cuando no se puede remediar a tiempo

Documenta una excepción con control compensatorio (WAF, segmentación, deshabilitar la función), riesgo residual, aprobación y fecha de vencimiento. Registra el hallazgo como ítem de POA&M (`kudo_crear_item_poam`).

## Indicadores

Vulnerabilidades abiertas por severidad, % remediado en plazo y tiempo medio de remediación (MTTR), reportados mensualmente.

No ejecutes escaneos ni pruebas sobre sistemas sin autorización expresa de su propietario.
