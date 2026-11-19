---
name: kudo-seguridad-en-la-nube
description: Evalúa y endurece infraestructura en la nube (AWS, Azure, GCP) y on-premise con los controles CIF de Kudo (proveedores de nube, inventario, red, cifrado y claves). Úsala para revisar infraestructura como código, una arquitectura, la postura de una cuenta de nube, la segmentación de red o la gestión de claves.
---

# Seguridad en la Nube e Infraestructura con Kudo

Basada en las políticas de Servicios en la Nube (`POL-CIF-05`), Hardening (`POL-CIP-02`), Criptografía y Gestión de Claves (`POL-CIF-08`) y Backups (`POL-CIF-06`); controles CIF-1 a CIF-5.

## Lista de verificación de una cuenta o suscripción

**Identidad**
- [ ] Cuenta raíz/propietario con MFA resistente a phishing y sin llaves de acceso.
- [ ] Acceso humano mediante SSO del IdP corporativo; sin usuarios locales con llaves de larga duración.
- [ ] Roles de mínimo privilegio; sin políticas `*:*`.

**Red**
- [ ] Una red virtual por entorno, "denegar por defecto", sin SSH/RDP abierto a `0.0.0.0/0`.
- [ ] Servicios públicos detrás de balanceador y WAF; bases de datos sin IP pública.

**Datos y claves**
- [ ] Cifrado en reposo con claves gestionadas (KMS) y rotación anual; TLS 1.2+ en tránsito.
- [ ] Almacenamiento de objetos sin acceso público salvo justificación.
- [ ] Secretos en un gestor de secretos, nunca en variables de código.
- [ ] Datos solo en regiones aprobadas (residencia y transferencia internacional).

**Operación**
- [ ] Registros de auditoría de la nube activos, centralizados e inmutables (retención ≥ 12 meses).
- [ ] CSPM o reglas de configuración activas y alertas atendidas.
- [ ] Recursos etiquetados con propietario, entorno y clasificación; inventario conciliado.
- [ ] Respaldos con copia en otra cuenta/región y copia inmutable (regla 3-2-1-1); restauración probada.

## Revisión de infraestructura como código

Para Terraform, Bicep, CloudFormation o Pulumi: señala recursos públicos, cifrado deshabilitado, puertos abiertos, permisos excesivos, secretos en texto plano y falta de etiquetas, con el bloque corregido.

## Responsabilidad compartida

Antes de recomendar un control, aclara si lo gestiona el proveedor o la organización según el tipo de servicio (IaaS, PaaS, SaaS): https://divisioncero.com/kudo/framework/overview/responsabilidad-compartida

Solo lee configuraciones; no apliques cambios en la nube sin confirmación explícita.
