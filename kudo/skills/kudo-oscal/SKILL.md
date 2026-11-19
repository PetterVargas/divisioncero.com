---
name: kudo-oscal
description: Lee, crea, adapta y valida documentos OSCAL 1.2.3 basados en Kudo (catalog, profile, component-definition, SSP, assessment-plan, assessment-results, POA&M y mapping). Úsala cuando el usuario pida un SSP, un perfil o una declaración de aplicabilidad, registrar resultados de auditoría en OSCAL o generar ítems de POA&M.
---

# OSCAL con Kudo

Kudo publica sus 8 modelos OSCAL (revisión 1) en `content/kudo/framework/oscal/kudo/rev1/{json,xml,yaml,toon}` y en https://divisioncero.com/kudo/framework/oscal. Obtén cualquiera con `kudo_obtener_modelo_oscal`.

## Cadena de modelos

```
catalog ──▶ profile ──▶ component-definition
                  └───▶ ssp ──▶ assessment-plan ──▶ assessment-results ──▶ poam
```

| Modelo | Pregunta que responde | Archivo Kudo |
| ------ | --------------------- | ------------ |
| catalog | ¿Qué controles existen? | `kudo-catalog` |
| profile | ¿Cuáles aplican? (declaración de aplicabilidad) | `kudo-profile` |
| component-definition | ¿Qué aporta cada componente o documento? | `kudo-component-definition` |
| ssp | ¿Cómo implementa el sistema cada control? | `kudo-ssp` |
| assessment-plan | ¿Cómo se evaluará? | `kudo-assessment-plan` |
| assessment-results | ¿Qué se encontró? | `kudo-assessment-results` |
| poam | ¿Qué se corregirá y cuándo? | `kudo-poam` |
| mapping | ¿Cómo se relaciona Kudo con ISO 27001, NIST CSF, SOC 2…? | `kudo-mapping` |

## Tareas frecuentes

- **Declaración de aplicabilidad:** copia `kudo-profile.json` y reemplaza `include-all` por `include-controls: [{ "with-ids": [...] }]`; justifica las exclusiones en `remarks`.
- **Completar el SSP:** en `control-implementation`, describe para el componente `this-system` quién, cómo y con qué evidencia se implementa cada control; actualiza `implementation-status.state` (`planned`, `partial`, `implemented`, `not-applicable`).
- **Agregar un componente técnico:** añádelo en `system-implementation.components` con `type` (`software`, `service`, `hardware`…) y referencia su `uuid` en los `by-components`.
- **Registrar una auditoría:** por evidencia una `observation` (con `methods`), por requisito un `finding` con `target.status.state` (`satisfied` / `not-satisfied`) y, si no se cumple, un `risk`.
- **Correlación con un estándar:** en `kudo-mapping`, cada `map` relaciona un control del estándar (`sources`) con controles Kudo (`targets`) mediante `relationship` (`intersects-with`, `subset-of`, `equivalent-to`…); los controles Kudo sin relación van en `target-gap-summary`.
- **POA&M:** usa `kudo_crear_item_poam` para generar observación, riesgo (con `deadline` y `remediations`) e ítem; agrégalos a los arreglos `observations`, `risks` y `poam-items`.

## Reglas de validez

- Cada objeto con `uuid` necesita un UUID v4 o v5 **único**; nunca reutilices uno de otro objeto.
- Fechas en formato `AAAA-MM-DDTHH:MM:SSZ`; `metadata` requiere `title`, `last-modified`, `version` y `oscal-version` (`1.2.3`).
- Las referencias entre modelos usan `href`; en Kudo apuntan a un recurso de `back-matter` (`"#<uuid>"`) con los enlaces a cada formato.
- Valida siempre antes de entregar: `pnpm kudo:oscal:xml` (en el repositorio de Kudo) o `oscal-cli <modelo> validate archivo.json`.
- El JSON es la fuente de verdad: genera XML con el conversor oficial de NIST, no a mano.
