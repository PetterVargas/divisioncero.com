---
name: kudo-redaccion-de-politicas
description: Redacta, revisa y adapta políticas, procedimientos y plantillas del SGX de Kudo con su estructura, frontmatter y trazabilidad a controles. Úsala para crear un documento nuevo, mejorar uno existente, adaptarlo a una organización o revisar ortografía y coherencia del SGX.
---

# Redacción de Políticas y Procedimientos (SGX)

Los documentos viven en `content/sgx/politicas-y-procedimientos/` (o `content/sgsi/politicas/` en proyectos antiguos). Lee primero los existentes con `kudo_listar_documentos` y `kudo_obtener_documento` para mantener el estilo.

## Política vs. procedimiento

- **Política (POL):** *qué* debe garantizarse y *por qué*; principios, responsabilidades y requisitos mínimos. Cambia poco.
- **Procedimiento (PRO):** *cómo* se hace, paso a paso, con roles, plazos y registros.
- **Plan (PLN), Formato (FOR), Plantilla (PLA), Cláusulas (CLA), Términos (TYC):** herramientas operativas.

## Frontmatter obligatorio

```yaml
---
title: "Política de …"
description: "Una línea que explique para qué sirve"
codigo: "POL-ADR-02"      # TIPO-DOMINIO-NN, sin repetir
tipo: "politica"          # politica | procedimiento | plan | formato | plantilla | clausulas | terminos
dominio: "adr"
propietario: "Responsable de Ciberseguridad (CISO)"
version: "1.0"
revision: "Anual"
controles: [adr-2, cip-6] # ids reales: verifícalos con kudo_obtener_control
---
```

En el repositorio de Kudo, `pnpm kudo:sgx` genera a partir de este frontmatter el bloque **Control del documento** y la sección **Controles Kudo relacionados**; no los edites a mano.

## Estructura recomendada

1. **Propósito** – una o dos frases.
2. **Alcance** – a quién y a qué aplica.
3. **Roles y responsabilidades** – por rol, no por persona.
4. **Estándares / Procedimiento** – requisitos concretos y medibles (plazos, frecuencias, umbrales) en listas o tablas.
5. **Excepciones** (si aplica).
6. **Registros** (en procedimientos).
7. **Monitoreo y revisión** – indicadores y frecuencia de revisión.

## Criterios de calidad

- **Pragmatismo:** cada requisito debe poder cumplirse y verificarse. Prefiere "en un máximo de 5 días hábiles" a "oportunamente".
- **Coherencia:** usa la misma clasificación de la información (Pública, Interna, Confidencial, Restringida), los mismos plazos y los mismos nombres de rol en todo el SGX; enlaza en lugar de duplicar.
- **LatAm:** cita la ley local de protección de datos aplicable y evita referencias regulatorias ajenas a la región sin explicarlas.
- **Ortografía:** tildes (política, revisión, autenticación), mayúsculas solo al inicio y en nombres propios, "estos" sin tilde, "concienciación/concientización" de forma consistente.
- **Placeholders:** los datos de la organización entre corchetes (`[Nombre del responsable]`).
- No uses `<` seguido de espacio ni llaves sueltas en MDX; escribe "menos de".

## Al terminar

Entrega el archivo completo, indica qué controles cubre y si conviene actualizar documentos relacionados (enlaces, plazos o roles).
