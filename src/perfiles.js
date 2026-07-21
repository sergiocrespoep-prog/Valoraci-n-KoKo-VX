// PERFILES DE CLIENTE — agrupan pruebas recomendadas por tipo de cliente.
// La selección siempre es libre: el perfil solo preselecciona; se pueden añadir o quitar pruebas.

// Pruebas base comunes a casi cualquier valoración inicial
const BASE = [
  'par_q_version_vigente',
  'checklist_de_banderas_rojas_dolor',
  'anamnesis_koko_protocolo_interno',
  'cuestionario_de_objetivos_y_expectativas',
  'checkin_koko_bienestar',
  'fc_en_reposo',
  'peso_corporal_modos_visible_ciego_no_com',
  'talla',
  'imc'
];

export const PERFILES = [
  {
    id: 'salud_general',
    nombre: 'Salud general (adulto)',
    desc: 'Valoración inicial estándar para adultos sin condiciones especiales.',
    tests: [...BASE,
      'ipaq_sf_actividad_fisica_forma_corta', 'checkin_koko_sueno',
      'checkin_koko_estres_recuperacion', 'sts_30_sentadillas_en_30_s', 'dinamometria_manual_fuerza_prensil',
      'push_up_test_flexiones', 'talk_test', 'wall_sit_sentadilla_isometrica_en_pared',
      'apoyo_monopodal_ojos_abiertos_y_cerrados', 'sentadilla_profunda_con_pica_overhead_sq',
      'knee_to_wall_dorsiflexion_de_tobillo', 'perimetro_de_cintura', 'breq_3_regulacion_de_la_motivacion']
  },
  {
    id: 'perdida_peso',
    nombre: 'Pérdida de peso',
    desc: 'Foco en composición corporal, hábitos, capacidad aeróbica y adherencia.',
    tests: [...BASE,
      'ipaq_sf_actividad_fisica_forma_corta', 'checkin_koko_sueno',
      'cuestionario_de_barreras_para_el_ejercic', 'talk_test', 'ymca_3_minute_step_test',
      'perimetro_de_cintura', 'indice_cintura_altura_whtr', 'ratio_cintura_cadera',
      'bioimpedancia_bascula_bia', 'pasos_diarios_media_semanal', 'sts_30_sentadillas_en_30_s',
      'dinamometria_manual_fuerza_prensil', 'breq_3_regulacion_de_la_motivacion', 'paces_disfrute_del_ejercicio']
  },
  {
    id: 'fuerza_fitness',
    nombre: 'Fuerza / rendimiento fitness',
    desc: 'Cliente con experiencia u objetivo de fuerza, masa muscular o rendimiento.',
    tests: [...BASE,
      'estimacion_de_1rm_submaxima_basicos', 'salto_cmj_con_app_my_jump',
      'farmer_s_carry_koko_protocolo_interno', 'push_up_test_flexiones',
      'bateria_mcgill_flexores_srensen_puente_l', 'dinamometria_manual_fuerza_prensil',
      'sebt_simplificado_3_direcciones', 'sentadilla_profunda_con_pica_overhead_sq',
      'test_de_thomas_modificado', 'checklist_koko_de_tecnica_en_basicos',
      'perimetros_segmentarios_brazo_muslo_pant', 'ymca_3_minute_step_test']
  },
  {
    id: 'senior',
    nombre: 'Adulto mayor (60+)',
    desc: 'Función, equilibrio, riesgo de caídas y autonomía. Batería de referencia SPPB.',
    tests: [...BASE,
      'cribado_koko_autonomia_fuerza', 'rapa_actividad_fisica_en_mayores',
      'sppb_short_physical_performance_battery', 'tug_timed_up_and_go',
      'arm_curl_30_s_flexiones_de_codo', '2_minute_step_test_marcha_en_el_sitio',
      'back_scratch_manos_tras_la_espalda', 'chair_sit_and_reach',
      'short_fes_i_miedo_a_caerse', 'functional_reach_test',
      'dinamometria_manual_fuerza_prensil', 'test_de_cargar_la_compra',
      'tension_arterial_en_reposo']
  },
  {
    id: 'dolor',
    nombre: 'Dolor / molestias',
    desc: 'Cliente con dolor o molestias: cribado, dolor, función personalizada y confianza para moverse. Solo se añade un cuestionario específico en dolor lumbar (RMDQ-24).',
    tests: [...BASE,
      'nrs_de_dolor_0_10', 'escala_funcional_personalizada_koko',
      'confianza_movimiento_koko', 'csi_parte_a_sensibilizacion_central']
  },
  {
    id: 'embarazo',
    nombre: 'Embarazo (Koko MAMÁ)',
    desc: 'Cribado específico de embarazo y suelo pélvico; sin pruebas de esfuerzo máximas.',
    tests: [...BASE,
      'get_active_questionnaire_for_pregnancy_c', 'cuestionario_koko_de_suelo_pelvico_al_en', 'checkin_koko_sueno',
      'checkin_koko_estres_recuperacion', 'apoyo_monopodal_ojos_abiertos_y_cerrados']
  },
  {
    id: 'postparto',
    nombre: 'Postparto (Koko MAMÁ)',
    desc: 'Recuperación postparto: suelo pélvico, incontinencia y reintroducción de carga.',
    tests: [...BASE,
      'cuestionario_postparto_koko_mama_interno', 'cuestionario_koko_de_suelo_pelvico_al_en', 'checkin_koko_sueno',
      'checkin_koko_estres_recuperacion', 'apoyo_monopodal_ojos_abiertos_y_cerrados',
      'sts_30_sentadillas_en_30_s', 'dinamometria_manual_fuerza_prensil']
  },
  {
    id: 'menopausia',
    nombre: 'Mujer 40+ / menopausia',
    desc: 'Síntomas de menopausia, suelo pélvico, fuerza y composición corporal.',
    tests: [...BASE,
      'cuestionario_koko_de_suelo_pelvico_al_en', 'cribado_koko_autonomia_fuerza',
      'checkin_koko_sueno', 'checkin_koko_estres_recuperacion',
      'diario_de_sofocos_y_sintomas_interno', 'perimetro_de_cintura', 'ratio_cintura_cadera',
      'dinamometria_manual_fuerza_prensil', 'sts_30_sentadillas_en_30_s',
      'apoyo_monopodal_ojos_abiertos_y_cerrados', 'tension_arterial_en_reposo',
      'test_de_cargar_la_compra']
  }
];

// Cuestionarios específicos que se añaden según la zona de dolor indicada en la ficha
export const EXTRAS_DOLOR = {
  'Lumbar / espalda': ['rmdq_24_roland_morris'],
  'Cuello / cervical': [],
  'Hombro / brazo': [],
  'Rodilla / cadera': [],
  'Otra zona': []
};

// Sugerencia de perfil según los datos de la ficha del cliente.
// Acepta valores múltiples (arrays) en objetivos, zonas de dolor y situaciones.
// Devuelve { perfilId, extras, motivo } o null si no hay datos suficientes.
export function sugerirPerfil(cliente) {
  if (!cliente) return null;
  const arr = v => Array.isArray(v) ? v : (v && v !== 'No' && v !== 'Ninguna' ? [v] : []);
  const edad = parseInt(cliente.edad) || null;
  const objetivos = arr(cliente.objetivos ?? cliente.objetivo);
  const zonas = arr(cliente.dolorZonas ?? cliente.dolorZona);
  const situaciones = arr(cliente.situaciones ?? cliente.situacion);
  const { sexo } = cliente;
  const extras = [...new Set(zonas.flatMap(z => EXTRAS_DOLOR[z] || []))];

  if (situaciones.includes('Embarazo'))
    return { perfilId:'embarazo', extras, motivo:'situación indicada: embarazo' };
  if (situaciones.includes('Postparto (<12 meses)'))
    return { perfilId:'postparto', extras, motivo:'situación indicada: postparto' };
  if (zonas.length > 0)
    return { perfilId:'dolor', extras, motivo:`dolor/molestia indicada: ${zonas.join(', ').toLowerCase()}` };
  if (edad && edad >= 60)
    return { perfilId:'senior', extras, motivo:`edad ${edad} años` };
  if (situaciones.includes('Menopausia'))
    return { perfilId:'menopausia', extras, motivo:'situación indicada: menopausia' };
  if (objetivos.includes('Pérdida de peso'))
    return { perfilId:'perdida_peso', extras, motivo:'objetivo: pérdida de peso' };
  if (objetivos.includes('Ganar fuerza / masa muscular') || objetivos.includes('Rendimiento deportivo'))
    return { perfilId:'fuerza_fitness', extras, motivo:'objetivo: fuerza / rendimiento' };
  if (sexo === 'Mujer' && edad && edad >= 45)
    return { perfilId:'menopausia', extras, motivo:`mujer de ${edad} años (valorar síntomas 40+)` };
  if (objetivos.length > 0)
    return { perfilId:'salud_general', extras, motivo:`objetivo: ${objetivos.join(', ').toLowerCase()}` };
  return { perfilId:'salud_general', extras, motivo:'sin condiciones especiales indicadas' };
}