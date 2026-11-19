---
name: kudo-mapeo-de-cumplimiento
description: Relaciona leyes, regulaciones, contratos y estándares (ISO 27001, NIST CSF, CIS Controls, SOC 2, PCI DSS, CSA CCM/AICM) con los controles Kudo y construye la matriz de cumplimiento. Úsala cuando el usuario pregunte qué controles Kudo cubren un requisito, prepare una certificación o necesite un registro legal y regulatorio.
---

# Mapeo de Cumplimiento con Kudo

Basada en la Política de Gestión de Cumplimiento (`POL-COR-04`) y el control COR-2.

## Fuentes

- Correlaciones del SGX entre estándares y Kudo: https://divisioncero.com/kudo/sgx/correlacion (ISO 27001:2022, NIST CSF, CIS Controls, SOC 2, PCI DSS, CSA CCM y CSA AICM).
- Controles y requisitos: `kudo_obtener_control`, `kudo_buscar`.

## Procedimiento

1. **Inventario de obligaciones:** por país y sector, identifica leyes (protección de datos, ciberseguridad, sectoriales), contratos con clientes y estándares voluntarios. Pregunta el país y el sector si no los conoces.
2. **Desglose:** divide cada obligación en requisitos verificables.
3. **Mapeo:** para cada requisito, busca los controles Kudo que lo atienden (`kudo_buscar` con las palabras clave del requisito) y verifica el enunciado con `kudo_obtener_control`. Indica si la cobertura es **total**, **parcial** o **nula**.
4. **Evidencia:** define qué evidencia demuestra el cumplimiento (documento SGX, registro, configuración).
5. **Brechas:** los requisitos con cobertura parcial o nula pasan al plan de tratamiento o al POA&M.

## Formato de la matriz

| Obligación | Requisito | País / fuente | Controles Kudo | Cobertura | Documento SGX | Evidencia | Responsable | Última verificación |
| ---------- | --------- | ------------- | -------------- | --------- | ------------- | --------- | ----------- | ------------------- |

## Reglas

- No afirmes que una ley exige algo sin indicar la fuente; si no estás seguro del plazo o el artículo, dilo y recomienda validarlo con Legal.
- Kudo es una referencia de trazabilidad: la certificación la otorga un organismo acreditado.
- Si la cobertura de un estándar depende de controles técnicos, indica qué componente del Component Definition (OSCAL) debería agregarse.
