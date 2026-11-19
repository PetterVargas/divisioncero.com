---
name: kudo-identidad-y-accesos
description: Diseña y revisa la gestión de identidades, autenticación, autorización y puntos finales con los controles CIP de Kudo (inventario de identidades, MFA, mínimo privilegio, Joiner-Mover-Leaver, EDR). Úsala para revisiones de acceso, configurar un IdP, políticas de contraseñas y MFA, cuentas privilegiadas o el ciclo de vida de colaboradores.
---

# Identidad, Accesos y Puntos Finales con Kudo

Basada en la Política de Gestión de Accesos (`POL-CIP-01`), Seguridad de TI (`POL-CIF-02`) y Trabajo Remoto (`POL-THP-04`); controles CIP-1 a CIP-6.

## Estándares mínimos

| Tema | Requisito Kudo |
| ---- | -------------- |
| Autenticación | SSO con el IdP; MFA en accesos remotos, administrativos, correo y sistemas críticos; FIDO2/passkeys para privilegiados |
| Contraseñas | ≥ 12 caracteres (16 privilegiadas), verificación contra contraseñas filtradas, cambio solo ante compromiso, gestor de contraseñas |
| Bloqueo | Tras 5 intentos fallidos |
| Joiner | Aprovisionamiento automático desde RRHH según plantilla de rol |
| Mover | Ajuste de accesos en ≤ 5 días hábiles |
| Leaver | Revocación el mismo día (inmediata si la salida no es voluntaria) |
| Inactividad | Cuentas sin uso > 90 días deshabilitadas |
| Secretos técnicos | Gestor de secretos y rotación ≤ 180 días |
| Revisión de accesos | Privilegiados trimestral; críticos y terceros semestral; resto anual |
| Endpoints | MDM, cifrado de disco, EDR, parches, bloqueo ≤ 5 minutos, sin administrador local |

## Revisión de accesos (procedimiento)

1. Exporta usuarios y permisos del sistema y crúzalos con RRHH (activos, cargo, área).
2. Marca: cuentas de personas retiradas, sin MFA, con privilegios no justificados por su rol, compartidas, de servicio sin propietario e inactivas.
3. Pide al propietario del sistema que certifique o retire cada acceso marcado.
4. Registra el resultado como evidencia (control CIP-3) y los hallazgos pendientes en el POA&M.

## Cuentas privilegiadas

Nominales y separadas de la cuenta diaria, elevación *just-in-time* con aprobación, cuentas *break-glass* custodiadas y revisadas tras cada uso, sesiones registradas.

No solicites ni muestres contraseñas, códigos MFA o secretos reales; trabaja con exportaciones anonimizadas cuando sea posible.
