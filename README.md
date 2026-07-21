# Valoraciones Espacio KoKo v2.0.0

PWA local para valoraciones físicas y funcionales no clínicas. Funciona sin backend y conserva temporalmente las evaluaciones cifradas en IndexedDB.

## Instalación y desarrollo

```bash
npm install
npm run dev
```

## Compilación

```bash
npm run build
npm run preview
```

La versión lista para publicar queda en `dist/`.

## Decisiones de la versión 2.0.0

- PAR-Q+ se mantiene tal como estaba por decisión expresa del responsable del proyecto.
- Se retiran del catálogo activo: EQ-5D-5L, WOMAC, QuickDASH, ODI, TSK-11, PSQI, PSS-10, ICIQ-UI SF, MRS, SARC-F, NDI, LEFS, SPADI y Örebro corto.
- NDI, LEFS, SPADI y Örebro quedan sin sustituto automático.
- ODI se sustituye por RMDQ-24.
- Los demás instrumentos retirados se sustituyen, cuando procede, por registros internos KoKo sin pretensión diagnóstica.
- El “Y-Balance simplificado” pasa a denominarse “SEBT simplificado de tres direcciones”.

Consulta `LICENCIAS_Y_DECISIONES.md` para el inventario exacto.

## Validación

Un cuestionario vacío ya no genera una puntuación. Cada prueba puede quedar como `completa` u `omitida`; las omitidas no se interpretan ni cuentan como realizadas. La exportación del informe HTML se bloquea si existen datos incompletos o incoherentes.

## Seguridad y privacidad

- AES-GCM 256 para evaluaciones y auditoría.
- PBKDF2 para derivar la clave del PIN y para las contraseñas de usuario nuevas.
- Sin contraseñas administrativas predeterminadas.
- Bloqueo temporal tras intentos fallidos.
- Recifrado del PIN mediante sustitución atómica en IndexedDB.
- Escapado de contenido editable en el HTML exportado.

La purga de siete días se ejecuta al volver a abrir y desbloquear la PWA. Los archivos exportados quedan fuera del control de la app y deben eliminarse manualmente del dispositivo después de trasladarlos al almacenamiento autorizado.

## Actualización desde v1.8

Las evaluaciones temporales creadas con pruebas retiradas no pueden convertirse automáticamente a los nuevos instrumentos. Antes de actualizar una instalación con datos reales, exporta o finaliza las valoraciones pendientes y elimina los temporales antiguos.
