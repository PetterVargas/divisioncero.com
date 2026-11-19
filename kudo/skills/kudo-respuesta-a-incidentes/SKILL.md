---
name: kudo-respuesta-a-incidentes
description: Guía la respuesta a incidentes de ciberseguridad con el procedimiento de Kudo (triage, contención, erradicación, recuperación, notificación y lecciones aprendidas) y redacta bitácoras, comunicaciones e informes posincidente. Úsala ante un incidente en curso, un ejercicio de mesa o para preparar playbooks.
---

# Respuesta a Incidentes con Kudo

Basada en la Política de Gestión de Incidentes (`POL-ADR-01`), el Procedimiento de Respuesta a Incidentes (`PRO-ADR-01`) y el control ADR-4.

## Si el incidente está en curso

1. **Calma y bitácora:** abre una bitácora con hora (UTC o local, siempre la misma), hecho, decisión y responsable.
2. **Triage:** confirma que es un incidente real y asigna el nivel:

| Nivel | Criterio | Inicio de la respuesta |
| ----- | -------- | ---------------------- |
| 1 Bajo | Impacto local, sin datos sensibles | 1 día hábil |
| 2 Medio | Moderado o visible a clientes | 4 horas |
| 3 Alto | Varias áreas, sistemas críticos o datos confidenciales | 1 hora |
| 4 Crítico | Impacto severo, datos personales a gran escala o servicios detenidos | Inmediato; escalar a crisis |

3. **Contención antes que investigación profunda**, pero **preserva evidencia** antes de modificar sistemas (registros, imágenes si aplica, cadena de custodia).
4. **Erradicación:** causa raíz, vector de entrada, persistencia; busca indicadores en otros sistemas.
5. **Recuperación:** restaura desde respaldos verificados, rota credenciales y monitorea al menos 30 días.
6. **Notificación:** con Legal y el Oficial de Protección de Datos, determina obligaciones y plazos por país (autoridad de datos, titulares, reguladores, CSIRT, clientes por contrato). No asumas un plazo: pregunta el país y recomienda validarlo con Legal.
7. **Cierre y lecciones aprendidas** en un máximo de 10 días hábiles, sin buscar culpables; registra acciones con `kudo_crear_item_poam`.

## Guías rápidas

- **Phishing con credenciales entregadas:** restablecer contraseña, revocar sesiones y tokens, revisar reglas de reenvío, buscar otros destinatarios.
- **Ransomware:** aislar de la red, proteger respaldos, determinar alcance, escalar a crisis; no pagar sin decisión de la gerencia y asesoría legal.
- **Fuga de datos:** identificar datos y titulares, cortar el canal, evaluar notificaciones.
- **Cuenta de nube comprometida:** revocar llaves y sesiones, revisar IAM y recursos creados, revisar facturación.
- **Equipo perdido:** bloqueo y borrado remoto, revocar sesiones, verificar cifrado.

## Entregables

- Bitácora cronológica, comunicación inicial / de actualización / de cierre (aprobadas por Legal y Comunicaciones) e informe posincidente con: resumen, cronología, impacto, causa raíz, acciones y métricas (tiempo de detección y de respuesta).

Nunca ejecutes acciones destructivas en sistemas de la organización sin confirmación explícita del responsable.
