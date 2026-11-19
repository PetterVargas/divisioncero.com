---
name: kudo-framework
description: Conocimiento base del framework de ciberseguridad Kudo (8 dominios, 36 controles, SGX y OSCAL) y de su servidor MCP. Úsala siempre que el usuario mencione Kudo, sus dominios (COR, CIP, CIF, CAP, CCN, ADR, THP, DIA), controles como "cip-2", el SGX o un proyecto creado con create-kudo-app.
---

# Kudo Framework

Kudo es un framework de ciberseguridad open source, por y para LatAm, creado por DivisionCero: https://divisioncero.com/kudo

## Estructura

| Dominio | Nombre | Controles |
| ------- | ------ | --------- |
| COR | Coherencia Organizacional | COR-1 a COR-4 (programa de riesgos, cumplimiento, evaluación independiente, mejora continua) |
| CIP | Identidad y Puntos Finales | CIP-1 a CIP-6 (identidades, autenticación, autorización, JML, inventario y seguridad de endpoints) |
| CIF | Infraestructura | CIF-1 a CIF-5 (proveedores de nube, inventario, red y sistemas, cifrado, claves) |
| CAP | Aplicaciones | CAP-1, CAP-2 (SDLC seguro, APIs) |
| CCN | Continuidad y Cambios | CCN-1 a CCN-4 (gestión de cambios, pruebas, rollback, continuidad y recuperación) |
| ADR | Análisis, Detección y Respuesta | ADR-1 a ADR-4 (malware, vulnerabilidades, registros, incidentes) |
| THP | Talento Humano y Proveedores | THP-1 a THP-4 (capacitación, trabajo remoto, cadena de suministro, responsabilidad compartida) |
| DIA | Datos e IA | DIA-1 a DIA-7 (inventario, recolección, ciclo de vida, protección, retención, ubicación, modelos de IA) |

- Cada control tiene un enunciado y requisitos (503 en total). Identificadores en minúsculas: `cip-2`, requisitos `cip-2_smt.a`.
- **SGX** (Sistema de Gestión "X": SGSI, SGC, SGIA…) es el conjunto de políticas, procedimientos y plantillas. Cada documento tiene código (`POL-ADR-02`), tipo, dominio, propietario y la lista de controles que desarrolla en su frontmatter (`controles: [adr-2, cip-6]`).
- **OSCAL**: Kudo publica 8 modelos (catalog, profile, component-definition, ssp, assessment-plan, assessment-results, poam y mapping) en JSON, XML, YAML y TOON.

## Herramientas MCP (servidor `kudo`)

| Herramienta | Para qué |
| ----------- | -------- |
| `kudo_buscar` | Encontrar controles y documentos por palabras clave |
| `kudo_obtener_control` | Enunciado, requisitos y documentos de un control |
| `kudo_listar_documentos` / `kudo_obtener_documento` | Leer las políticas del proyecto |
| `kudo_cobertura` | Brechas: controles sin documento |
| `kudo_obtener_modelo_oscal` | Modelos OSCAL en JSON |
| `kudo_crear_item_poam` | Ítem de POA&M OSCAL a partir de un hallazgo |
| `kudo_listar_agentes` / `kudo_obtener_agente` | Agentes de ciberseguridad y sus skills |

Si el MCP no está disponible, lee directamente `content/sgx/politicas-y-procedimientos/` (o `content/sgsi/politicas/`) y consulta https://divisioncero.com/kudo/framework.

## Reglas

1. **Cita siempre la fuente:** control (`CIP-2`) y documento (`POL-CIP-01`) en los que te basas. No inventes controles ni requisitos: verifícalos con `kudo_obtener_control`.
2. **Pragmatismo:** prioriza lo que reduce riesgo real con los recursos de la organización; evita la burocracia.
3. **Contexto LatAm:** considera la legislación local (protección de datos, reguladores sectoriales) y pregunta el país cuando sea relevante.
4. **Español claro**, sin jerga innecesaria; los términos técnicos en inglés van en cursiva cuando no tienen traducción usual.
5. Los valores entre corchetes de las plantillas (`[Nombre de tu organización]`) se reemplazan con datos reales; pregunta si no los conoces.
6. Kudo no reemplaza una certificación (ISO 27001, SOC 2): facilita su adopción mediante las correlaciones del SGX.
