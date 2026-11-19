---
name: kudo-gestion-de-riesgos
description: Identifica, evalúa y trata riesgos de ciberseguridad con la metodología de Kudo (matriz 3x3, apetito de riesgo y registro de riesgos). Úsala para construir o actualizar un registro de riesgos, evaluar un riesgo nuevo, definir tratamientos o preparar el reporte de riesgos para la gerencia.
---

# Gestión de Riesgos con Kudo

Basada en la Política de Gestión de Riesgos (`POL-COR-03`) y los controles COR-1, COR-3 y COR-4.

## Procedimiento

1. **Contexto:** pregunta (o lee del proyecto) el alcance, los procesos críticos, los activos y las obligaciones legales. Lee la política con `kudo_obtener_documento("politica-de-gestion-de-riesgos")`.
2. **Identificación:** redacta cada riesgo como *causa → evento → consecuencia*. Fuentes: incidentes, auditorías, escaneos de vulnerabilidades, proveedores, cambios y la cobertura de controles (`kudo_cobertura`).
3. **Análisis:** probabilidad (1 Baja, 2 Media, 3 Alta) × impacto (1 Bajo, 2 Medio, 3 Alto), considerando los controles existentes.
4. **Evaluación:** 1–2 Bajo (aceptable), 3–4 Medio (tratar en el plan anual), 6–9 Alto (tratamiento prioritario; solo la gerencia lo acepta).
5. **Tratamiento:** mitigar, transferir, evitar o aceptar. Para mitigar, propone controles Kudo concretos (con su id) y el documento SGX que los desarrolla.
6. **Riesgo residual:** recalcula tras el tratamiento y registra quién lo acepta.

## Formato del registro de riesgos

| ID | Riesgo (causa → evento → consecuencia) | Activo / proceso | Propietario | P | I | Nivel | Controles existentes | Tratamiento | Controles Kudo | Residual | Próxima revisión |
| -- | -------------------------------------- | ---------------- | ----------- | - | - | ----- | -------------------- | ----------- | -------------- | -------- | ---------------- |

## Buenas prácticas

- Entre 10 y 30 riesgos bien redactados valen más que 200 genéricos.
- Un riesgo sin propietario no se gestiona: asigna siempre uno.
- Revisa trimestralmente los riesgos Altos y anualmente el resto, y tras cada incidente relevante.
- Los riesgos de proveedores críticos se evalúan con la skill `kudo-riesgo-de-proveedores`.
- Para el reporte a la gerencia: mapa de calor 3×3, los 5 riesgos principales, avance de tratamientos y decisiones requeridas.
