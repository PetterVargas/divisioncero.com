---
name: kudo-riesgo-de-proveedores
description: Clasifica y evalúa proveedores y terceros con los controles THP-3 y THP-4 de Kudo (inventario, criticidad, debida diligencia, cláusulas y responsabilidad compartida). Úsala para evaluar un proveedor nuevo, preparar un cuestionario de seguridad, revisar un contrato o un informe SOC 2/ISO 27001 de un tercero.
---

# Riesgo de Proveedores con Kudo

Basada en la Política (`POL-THP-03`) y el Procedimiento de Gestión de Proveedores (`PRO-THP-03`), las Cláusulas (`CLA-THP-02`) y los Términos y Condiciones para Proveedores (`TYC-THP-02`); controles THP-3, THP-4 y CIF-1.

## Clasificación

Evalúa: acceso a información (¿datos confidenciales o personales?), acceso a sistemas o instalaciones, impacto en la continuidad, exclusividad y exposición financiera.

| Nivel | Debida diligencia | Revisión |
| ----- | ----------------- | -------- |
| Crítico | Cuestionario completo + evidencias (SOC 2 / ISO 27001, pentest, plan de continuidad) + aprobación del Comité de Compras | Anual |
| Alto | Cuestionario completo + evidencias principales + Comité de Compras | Anual |
| Medio | Cuestionario básico + cláusulas estándar | Cada dos años |
| Bajo | Cláusulas estándar | Cada dos años |

## Cuestionario básico (adaptable)

1. ¿Tiene una política de seguridad aprobada y un responsable de ciberseguridad?
2. ¿Cuenta con certificaciones vigentes (ISO 27001, SOC 2)? ¿Alcance?
3. ¿Dónde se procesan y almacenan los datos? ¿Subcontratistas?
4. ¿MFA y SSO para su personal y para el acceso de clientes?
5. ¿Cifrado en tránsito y en reposo?
6. ¿Plazo de notificación de incidentes? (Kudo exige 48 horas)
7. ¿Respaldos y plan de continuidad probados?
8. ¿Usa los datos del cliente para entrenar modelos de IA?
9. ¿Cómo devuelve y elimina los datos al terminar el contrato?

## Revisión de un informe SOC 2 o certificado ISO 27001

Verifica vigencia, alcance (¿incluye el servicio contratado?), excepciones o no conformidades, y los **controles complementarios del usuario** (CUEC) que debe implementar la organización. Lo que el proveedor no cubre pasa a la matriz de responsabilidad compartida.

## Resultado

Resumen de riesgos (seguridad, continuidad, cumplimiento, cuarta parte, reputacional, financiero), clasificación propuesta, condiciones contractuales requeridas y recomendación para el Comité de Compras.
