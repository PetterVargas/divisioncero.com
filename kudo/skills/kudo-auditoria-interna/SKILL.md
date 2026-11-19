---
name: kudo-auditoria-interna
description: Planifica y ejecuta auditorías internas de los controles Kudo, redacta hallazgos y el informe de auditoría. Úsala para armar el programa anual de auditoría, listas de verificación por control, evaluar evidencias o clasificar no conformidades.
---

# Auditoría Interna con Kudo

Basada en el Procedimiento de Auditoría Interna (`PRO-COR-01`) y el control COR-3.

## Procedimiento

1. **Programa:** todos los dominios al menos una vez cada tres años y, cada año, los de mayor riesgo o con incidentes y hallazgos previos. Parte del Assessment Plan OSCAL (`kudo_obtener_modelo_oscal("assessment-plan")`).
2. **Lista de verificación:** para cada control en alcance, obtén sus requisitos con `kudo_obtener_control` y convierte cada uno en una pregunta verificable con la evidencia esperada.
3. **Evidencias:** combina revisión documental (EXAMINE), entrevistas (INTERVIEW) y pruebas técnicas o muestreo (TEST). Una afirmación sin evidencia no es evidencia.
4. **Evaluación por requisito:** cumple / cumple parcialmente / no cumple.
5. **Hallazgos:** clasifícalos y redáctalos con el formato de abajo.
6. **Informe:** resumen ejecutivo, alcance, criterios, hallazgos con evidencia y conclusión sobre la eficacia.

## Clasificación

| Tipo | Criterio | Plan de acción |
| ---- | -------- | -------------- |
| No conformidad mayor | Falla sistemática o ausencia de un control con riesgo alto | 10 días hábiles |
| No conformidad menor | Incumplimiento puntual o parcial | 20 días hábiles |
| Observación | Debilidad que podría convertirse en no conformidad | Opcional |
| Oportunidad de mejora | Recomendación | Opcional |

## Formato de un hallazgo

- **Control:** CIP-2 – Ciberseguridad en Autenticación (requisito `cip-2_smt.b`)
- **Criterio:** lo que exige el control o la política (cita el documento SGX).
- **Condición:** lo que se encontró, con datos concretos (muestra, cantidad, fechas).
- **Evidencia:** qué se revisó.
- **Causa probable** y **efecto / riesgo**.
- **Clasificación** y **recomendación**.

## Reglas

- Independencia: el auditor no evalúa su propio trabajo.
- Sé específico y verificable ("3 de 20 cuentas sin MFA"), nunca vago ("algunas cuentas").
- Registra los resultados como Assessment Results OSCAL (skill `kudo-oscal`) y los hallazgos abiertos como ítems de POA&M (`kudo_crear_item_poam`).
