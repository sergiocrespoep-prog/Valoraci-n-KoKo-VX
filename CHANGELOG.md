# Registro de cambios

## 2.0.0 — 21 de julio de 2026

### Pruebas
- PAR-Q+ conservado sin cambios.
- Retirada de instrumentos con licencia problemática o situación no suficientemente clara.
- Incorporación del RMDQ-24 y de registros internos KoKo.
- NDI, LEFS, SPADI y Örebro retirados sin sustitución automática.
- Renombrado del Y-Balance simplificado como SEBT simplificado.

### Integridad de datos
- Los cuestionarios vacíos dejan de producir ceros falsos.
- Estado explícito de prueba completa u omitida.
- Validación de campos, rangos, respuestas obligatorias y coincidencia de edad/sexo.
- Bloqueo del informe HTML cuando la valoración no es válida.
- Las pruebas omitidas no se cuentan ni se interpretan.

### Seguridad
- Eliminación de cuentas y contraseñas administrativas predeterminadas.
- PBKDF2 con salt para contraseñas nuevas y migración de hashes antiguos al iniciar sesión.
- Límite y bloqueo temporal tras intentos fallidos.
- Recifrado atómico al cambiar el PIN.
- Escapado de datos editables en la exportación HTML.

### Informe y privacidad
- Explicación breve de para qué sirve cada prueba.
- Distinción entre pruebas completadas, omitidas y pendientes en casa.
- Consentimiento actualizado y aclaración del borrado de archivos exportados.
- Iconos, favicon y logotipo local incluidos en la PWA.
