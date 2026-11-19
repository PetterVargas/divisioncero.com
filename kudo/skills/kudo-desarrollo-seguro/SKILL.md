---
name: kudo-desarrollo-seguro
description: Aplica los controles de Kudo para desarrollo seguro y APIs (CAP-1, CAP-2) en revisiones de código, modelado de amenazas, pipelines CI/CD y diseño de APIs. Úsala al revisar un pull request desde la óptica de seguridad, diseñar una funcionalidad sensible, configurar SAST/SCA/secret scanning o evaluar una API.
---

# Desarrollo Seguro con Kudo

Basada en la Política de Desarrollo Seguro (`POL-CAP-01`) y los controles CAP-1, CAP-2 y CCN-2.

## Revisión de seguridad de un cambio

Revisa, en este orden:
1. **Entradas y salidas:** validación de entradas, consultas parametrizadas, codificación de salidas (XSS), deserialización segura.
2. **Autenticación y autorización:** que cada endpoint verifique identidad **y** permiso sobre el objeto (BOLA/IDOR) y la función.
3. **Secretos:** ninguna credencial, token o llave en el código, en los logs ni en el repositorio.
4. **Datos sensibles:** mínimos necesarios, cifrados según su clasificación, nunca en logs.
5. **Dependencias:** nuevas librerías con mantenimiento activo, sin vulnerabilidades críticas y con licencia compatible.
6. **Errores y registro:** sin trazas internas expuestas al usuario; eventos de seguridad registrados.

Reporta cada hallazgo con: archivo y línea, problema, impacto, severidad y corrección propuesta (con código).

## Modelado de amenazas (rápido)

Para una funcionalidad nueva: diagrama de flujo de datos → fronteras de confianza → amenazas STRIDE por elemento → controles y requisitos de seguridad → casos de prueba.

## Pipeline mínimo recomendado

| Etapa | Control |
| ----- | ------- |
| Pre-commit / PR | Detección de secretos, SAST, SCA, revisión por pares obligatoria |
| Build | Generación de SBOM, firma o verificación de artefactos |
| Pruebas | DAST en entorno de pruebas; pruebas de seguridad de los cambios |
| Despliegue | Bloqueo ante vulnerabilidades críticas, aprobación según la gestión de cambios, plan de rollback |

## APIs (CAP-2)

Inventario con propietario, autenticación OAuth 2.0/OIDC, autorización por objeto, *rate limiting*, validación de esquema, respuestas mínimas, publicación detrás de *gateway* o WAF y registro de accesos. Usa el OWASP API Security Top 10 como lista de verificación.

## Reglas

- El código generado por IA se revisa con el mismo rigor que el humano.
- Propón correcciones concretas y compatibles con el stack del proyecto; no reescribas módulos completos sin necesidad.
