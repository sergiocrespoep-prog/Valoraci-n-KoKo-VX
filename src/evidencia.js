// EVIDENCIA CIENTÍFICA POR PRUEBA — qué dicen estudios y consensos sobre la puntuación
// obtenida, en cuanto a salud, funcionalidad y pronóstico. Solo se incluyen pruebas con
// respaldo documentado; el mensaje se adapta al valor cuando hay puntos de corte publicados.
// Lenguaje no clínico: "se asocia a", nunca diagnóstico.

const num = v => { const x = parseFloat(v); return isNaN(x) ? null : x; };

const EVIDENCIA = {
  dinamometria_manual_fuerza_prensil: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null || !v) return null;
    const corte = d.sexo === 'Hombre' ? 27 : 16;
    const base = 'La fuerza de prensión es un predictor independiente de salud: en el estudio PURE (~140.000 adultos, 17 países), cada 5 kg menos de agarre se asoció a un 16% más de mortalidad por todas las causas y más eventos cardiovasculares.';
    return {
      texto: v < corte
        ? base + ` Estar por debajo del corte EWGSOP2 (${corte} kg) es criterio de "probable sarcopenia", asociada a mayor riesgo de caídas, fracturas y pérdida de independencia: priorizar entrenamiento de fuerza y valorar consulta médica.`
        : base + ' Mantener una fuerza de agarre en rango se asocia a menor riesgo cardiovascular y mejor pronóstico funcional a largo plazo.',
      fuente: 'Leong et al. 2015 (The Lancet, estudio PURE) · Cruz-Jentoft et al. 2019 (EWGSOP2)'
    };
  },

  tug_timed_up_and_go: (d, sc) => {
    const v = num(sc?.primary?.value); if (!v) return null;
    return {
      texto: v >= 12
        ? 'Un TUG ≥12 s se asocia a riesgo aumentado de caídas en mayores (criterio CDC-STEADI) y predice deterioro funcional futuro. Los programas de fuerza de piernas + equilibrio reducen las caídas un 20-30%.'
        : 'Un TUG <10-12 s se asocia a movilidad independiente y bajo riesgo de caídas. Mantener fuerza de piernas y equilibrio preserva este estado.',
      fuente: 'Podsiadlo & Richardson 1991 · Barry et al. 2014 (metaanálisis) · CDC STEADI · Sherrington et al. 2019 (Cochrane, ejercicio y caídas)'
    };
  },

  sts_30_sentadillas_en_30_s: () => ({
    texto: 'El rendimiento al levantarse de una silla refleja la fuerza-potencia de piernas, uno de los mejores predictores de independencia futura: valores por debajo de las normas de Rikli & Jones se asocian a mayor riesgo de perder la autonomía física en la vejez. Es muy entrenable con trabajo de fuerza.',
    fuente: 'Rikli & Jones 1999 y 2013 (Senior Fitness Test, estándares de independencia)'
  }),

  sppb_short_physical_performance_battery: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null) return null;
    return {
      texto: v <= 9
        ? 'Un SPPB ≤9 predice discapacidad de movilidad, hospitalización y mortalidad en mayores (metaanálisis de 17.000+ participantes: <10 se asocia a mayor mortalidad por todas las causas). Mejorar 1 punto ya es un cambio clínicamente relevante.'
        : 'Un SPPB ≥10 se asocia a buen pronóstico funcional y menor riesgo de discapacidad de movilidad.',
      fuente: 'Guralnik et al. 1994 y 2000 (J Gerontology) · Pavasini et al. 2016 (BMC Medicine, metaanálisis)'
    };
  },

  nrs_de_dolor_0_10: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null) return null;
    const base = 'En escalas 0-10, ≥4 se considera dolor clínicamente relevante y una reducción de ~2 puntos (≈30%) es el cambio mínimo que el paciente percibe como importante.';
    return {
      texto: v >= 7
        ? base + ' Dolor ≥7 es intenso: adaptar la sesión. Si el dolor persiste >3 meses, las guías recomiendan abordaje biopsicosocial con ejercicio graduado y educación, no reposo.'
        : base + ' El ejercicio adaptado es seguro y eficaz en la mayoría de los dolores musculoesqueléticos persistentes.',
      fuente: 'Farrar et al. 2001 (Pain) · NICE NG193 2021 (dolor crónico) · Hayden et al. 2021 (Cochrane, ejercicio y lumbalgia)'
    };
  },


rmdq_24_roland_morris: (d, sc) => {
  const v = num(sc?.primary?.value); if (v == null) return null;
  return {
    texto: `El RMDQ registra cuántas situaciones cotidianas están afectadas por el dolor lumbar hoy (${v} de 24). Su principal utilidad es comparar la evolución de la misma persona entre valoraciones, junto con dolor y actividad.`,
    fuente: 'Roland & Morris 1983 · Kovacs et al. 2002 (validación española)'
  };
},

  ipaq_sf_actividad_fisica_forma_corta: (d) => {
    const met = num(d.met_min);
    return {
      texto: (met != null && met < 600
        ? 'Actualmente por debajo de las recomendaciones OMS (≥150-300 min/semana de actividad moderada, ≈600+ MET-min). '
        : '') + 'Cumplir las recomendaciones de actividad física se asocia a un 20-30% menos de mortalidad por todas las causas; los mayores beneficios se producen al pasar de "nada" a "algo". El tiempo sentado prolongado es un factor de riesgo independiente.',
      fuente: 'OMS 2020 (directrices de actividad física) · Arem et al. 2015 (JAMA Intern Med) · Ekelund et al. 2019 (BMJ)'
    };
  },

  tension_arterial_en_reposo: (d) => {
    const s = num(d.sistolica), di = num(d.diastolica);
    if (s == null || di == null) return null;
    if (s < 40 || s > 300) return null; // dato improbable, no interpretar
    let t;
    if (s >= 180 || di >= 110) t = 'Cifras muy elevadas: no entrenar hoy y derivar a valoración médica. La hipertensión es el principal factor de riesgo modificable de ictus e infarto.';
    else if (s >= 140 || di >= 90) t = 'Cifras compatibles con hipertensión (≥140/90): confirmar con medidas repetidas y recomendar valoración médica. La hipertensión es el principal factor de riesgo modificable de ictus e infarto; el ejercicio regular reduce la TA ~5-8 mmHg en hipertensos.';
    else if (s >= 120 || di >= 80) t = 'Cifras normal-altas: vigilar evolución. El ejercicio aeróbico y de fuerza regular ayuda a mantener la tensión en rango (reducciones medias de 5-8 mmHg).';
    else t = 'Tensión óptima (<120/80): asociada al menor riesgo cardiovascular. El ejercicio regular ayuda a mantenerla.';
    return { texto: t, fuente: 'Guías ESC/ESH 2018-2023 (hipertensión) · Cornelissen & Smart 2013 (metaanálisis ejercicio y TA)' };
  },

  fc_en_reposo: (d) => {
    const v = num(d.fc); if (v == null || !v) return null;
    return {
      texto: v > 80
        ? 'Una FC en reposo >80 lpm se asocia a mayor riesgo cardiovascular y de mortalidad (cada +10 lpm, ≈9% más riesgo). El entrenamiento aeróbico regular la reduce de forma consistente.'
        : 'FC en reposo en rango favorable: se asocia a menor riesgo cardiovascular. En personas entrenadas es habitual <60 lpm.',
      fuente: 'Zhang et al. 2016 (CMAJ, metaanálisis 46 estudios / 1,2 M personas)'
    };
  },

  fc_de_recuperacion_1_min_hrr: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null) return null;
    return {
      texto: v <= 12
        ? 'Una recuperación ≤12 lpm en el primer minuto es un predictor independiente de mortalidad (función autonómica reducida). Es muy mejorable con entrenamiento aeróbico regular: es un objetivo del programa, no una sentencia.'
        : 'Buena recuperación de la frecuencia cardiaca: indica buena función autonómica cardiovascular, asociada a mejor pronóstico.',
      fuente: 'Cole et al. 1999 (New England Journal of Medicine)'
    };
  },

  imc: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null) return null;
    let t;
    if (v >= 30) t = 'Un IMC ≥30 se asocia a mayor riesgo de diabetes tipo 2, enfermedad cardiovascular y varios tipos de cáncer. Una pérdida del 5-10% del peso ya produce mejoras metabólicas clínicamente relevantes, sobre todo combinada con fuerza.';
    else if (v >= 25) t = 'IMC en rango de sobrepeso: el riesgo metabólico aumenta de forma progresiva, pero depende mucho de la composición y la cintura — interpretar junto al perímetro de cintura. La condición física puede compensar parte del riesgo ("fit but fat").';
    else if (v < 18.5) t = 'IMC bajo: valorar ingesta energética y masa muscular; en mayores se asocia a fragilidad.';
    else t = 'IMC en rango asociado a menor riesgo metabólico. Recordar que el IMC no distingue músculo de grasa: en personas musculadas puede sobreestimar.';
    return { texto: t, fuente: 'OMS · Prospective Studies Collaboration 2009 (The Lancet, 900.000 adultos) · Wing et al. 2011 (beneficios del 5-10%)' };
  },

  perimetro_de_cintura: (d, sc, ev) => {
    const v = num(d.cintura); if (v == null) return null;
    const mujer = ev?.cliente?.sexo === 'Mujer';
    const alto = mujer ? 88 : 102, mod = mujer ? 80 : 94;
    let t;
    if (v >= alto) t = `Cintura en zona de riesgo alto (≥${alto} cm): la obesidad abdominal se asocia a mayor riesgo cardiometabólico con independencia del IMC. Es de los marcadores que más rápido mejora con ejercicio, incluso sin grandes cambios de peso.`;
    else if (v >= mod) t = `Cintura en zona de riesgo moderado (≥${mod} cm): vigilar evolución; la grasa abdominal responde especialmente bien al ejercicio combinado (aeróbico + fuerza).`;
    else t = 'Cintura en rango de bajo riesgo cardiometabólico.';
    return { texto: t, fuente: 'OMS 2008 · Ross et al. 2020 (Nature Reviews Endocrinology, consenso IAS/ICCR)' };
  },

  indice_cintura_altura_whtr: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null) return null;
    return {
      texto: v >= 0.5
        ? 'Un índice cintura-altura ≥0,5 predice riesgo cardiometabólico (diabetes, hipertensión, eventos cardiovasculares) mejor que el IMC según metaanálisis con >300.000 adultos. Regla simple: "mantén tu cintura por debajo de la mitad de tu estatura".'
        : 'Índice <0,5: rango objetivo, asociado a bajo riesgo cardiometabólico ("cintura menor que la mitad de la estatura").',
      fuente: 'Ashwell et al. 2012 (Obesity Reviews, metaanálisis) · NICE 2022'
    };
  },

  pasos_diarios_media_semanal: (d) => {
    const v = num(d.pasos); if (v == null) return null;
    return {
      texto: v < 7000
        ? 'Los metaanálisis sitúan el mayor beneficio en 7.000-9.000 pasos/día (menor mortalidad); los beneficios empiezan desde ~4.000 y cada incremento cuenta — no hace falta llegar a 10.000 de golpe.'
        : 'Media de pasos en el rango asociado a reducciones importantes de mortalidad (7.000-9.000+/día en adultos).',
      fuente: 'Paluch et al. 2022 (The Lancet Public Health, metaanálisis de 15 cohortes)'
    };
  },

  push_up_test_flexiones: (d) => {
    const v = num(d.reps); if (v == null) return null;
    return {
      texto: 'La capacidad de hacer flexiones refleja fuerza-resistencia del tren superior y salud cardiovascular: en una cohorte de >1.100 hombres, completar >40 flexiones se asoció a un 96% menos de eventos cardiovasculares a 10 años frente a <10 (estudio en varones; orientativo en mujeres).',
      fuente: 'Yang et al. 2019 (JAMA Network Open)'
    };
  },

  apoyo_monopodal_ojos_abiertos_y_cerrados: (d) => {
    const oa = Math.max(num(d.oa_d) ?? -1, num(d.oa_i) ?? -1); if (oa < 0) return null;
    return {
      texto: oa < 10
        ? 'No mantener 10 s el apoyo a una pierna (ojos abiertos) se asoció a casi el doble de mortalidad en adultos de 51-75 años en un seguimiento de 7 años, y a mayor riesgo de caídas. El equilibrio es entrenable a cualquier edad.'
        : 'Mantener ≥10 s el apoyo monopodal se asocia a mejor pronóstico de salud y menor riesgo de caídas: buen marcador de salud neuromuscular.',
      fuente: 'Araujo et al. 2022 (British Journal of Sports Medicine)'
    };
  },

  tinetti_poma_t: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null) return null;
    return {
      texto: v < 19
        ? 'Tinetti <19: riesgo alto de caídas; entre 19-23, riesgo moderado. Los programas de ejercicio multicomponente (equilibrio + fuerza) reducen las caídas en mayores un 20-30%.'
        : 'Tinetti ≥24: bajo riesgo de caídas según el baremo original.',
      fuente: 'Tinetti 1986 (J Am Geriatr Soc) · Sherrington et al. 2019 (Cochrane)'
    };
  },

  short_fes_i_miedo_a_caerse: (d) => {
    const v = num(d.total); if (v == null) return null;
    return {
      texto: v >= 14
        ? 'La preocupación alta por caerse predice caídas futuras y restricción de actividad incluso en personas que nunca se han caído, generando un círculo de desacondicionamiento. El ejercicio de equilibrio progresivo reduce el miedo y las caídas.'
        : 'Preocupación por caerse baja-moderada: buen punto de partida para progresar el trabajo de equilibrio.',
      fuente: 'Delbaere et al. 2010 (Age and Ageing / BMJ)'
    };
  },

  bateria_mcgill_flexores_srensen_puente_l: () => ({
    texto: 'La resistencia de la musculatura del tronco (más que su fuerza máxima) y el equilibrio entre cadenas se asocian a la salud lumbar: asimetrías laterales >5% y ratios alterados son más frecuentes en personas con historia de dolor lumbar.',
    fuente: 'McGill, Childs & Liebenson 1999 (Arch Phys Med Rehabil)'
  }),

  csi_parte_a_sensibilizacion_central: (d) => {
    const v = num(d.total); if (v == null) return null;
    return {
      texto: v >= 40
        ? 'CSI ≥40 sugiere sensibilización central: el sistema nervioso amplifica las señales de dolor más allá del estado de los tejidos. Este perfil responde mejor a educación en neurociencia del dolor + ejercicio gradual que a enfoques centrados solo en el tejido.'
        : 'Puntuación por debajo del corte de sensibilización central (40).',
      fuente: 'Mayer et al. 2012 (Pain Practice) · Neblett et al. 2013 (J Pain)'
    };
  },

  salto_cmj_con_app_my_jump: () => ({
    texto: 'La potencia del tren inferior declina más rápido que la fuerza con la edad (~1%/año desde los 30) y se relaciona con la función y el riesgo futuro de fragilidad. El CMJ es una medida validada con app para monitorizarla; el trabajo de potencia es seguro y eficaz también en mayores.',
    fuente: 'Bosco et al. 1983 · Balsalobre-Fernández et al. 2015 (validación My Jump) · Runge et al. 2004'
  }),

  estimacion_de_1rm_submaxima_basicos: () => ({
    texto: 'La fuerza muscular se asocia inversamente a la mortalidad, y el entrenamiento de fuerza 2+ días/semana se asocia a un 10-17% menos de mortalidad por todas las causas, además de beneficios en diabetes y cáncer, independientemente del ejercicio aeróbico.',
    fuente: 'Momma et al. 2022 (Br J Sports Med, metaanálisis) · García-Hermoso et al. 2018'
  }),

  '2_minute_step_test_marcha_en_el_sitio': () => ({
    texto: 'La capacidad aeróbica es uno de los predictores más potentes de salud: cada MET adicional de capacidad se asocia a ~13% menos mortalidad. Es el marcador más mejorable con entrenamiento regular.',
    fuente: 'Kodama et al. 2009 (JAMA, metaanálisis) · Rikli & Jones 1999'
  }),

  ymca_3_minute_step_test: () => ({
    texto: 'La capacidad aeróbica es uno de los predictores más potentes de salud y mortalidad: cada MET adicional se asocia a ~13% menos mortalidad por todas las causas. Una FC de recuperación que baja rápido tras el escalón indica buena condición cardiovascular.',
    fuente: 'Kodama et al. 2009 (JAMA, metaanálisis) · Golding (YMCA Fitness Testing Manual)'
  }),

  knee_to_wall_dorsiflexion_de_tobillo: (d) => {
    const a = num(d.dist_d), b = num(d.dist_i);
    if (a == null || b == null) return null;
    return {
      texto: Math.abs(a - b) >= 2
        ? 'Asimetrías ≥2 cm o restricción de dorsiflexión (<9-10 cm) se asocian a mayor riesgo de lesión de rodilla/tobillo y alteran la mecánica de sentadilla y aterrizajes. La movilidad de tobillo mejora con trabajo específico de carga y movilidad.'
        : 'Dorsiflexión simétrica: buen punto de partida para sentadillas, zancadas y aterrizajes seguros.',
      fuente: 'Basnett et al. 2013 (Int J Sports Phys Ther) · Pope et al. 1998'
    };
  },

  par_q_version_vigente: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null) return null;
    return {
      texto: v > 0
        ? 'El cribado preparticipación identifica a quienes necesitan valoración previa: seguir el algoritmo ACSM reduce el riesgo de eventos durante el ejercicio. Aun así, para la inmensa mayoría el ejercicio es seguro y el riesgo de la inactividad es mayor que el del ejercicio.'
        : 'Sin señales en el cribado: el ejercicio progresivo es seguro. El riesgo de permanecer inactivo supera con creces el del ejercicio bien pautado.',
      fuente: 'Warburton et al. 2011 (PAR-Q+) · Riebe et al. 2015 (ACSM)'
    };
  },

  checklist_de_banderas_rojas_dolor: (d, sc) => {
    const v = num(sc?.primary?.value); if (v == null || v === 0) return null;
    return {
      texto: 'Las banderas rojas no diagnostican nada por sí solas, pero obligan a descartar patología seria antes de cargar la zona: las guías clínicas (p. ej. NICE para lumbalgia) recomiendan derivación para valoración cuando están presentes.',
      fuente: 'NICE NG59 (lumbalgia) · Downie et al. 2013 (BMJ, banderas rojas)'
    };
  }
};

// Devuelve { texto, fuente } o null si no hay evidencia curada para esa prueba/valor.
export function evidenciaDe(test, r, ev) {
  const f = test && EVIDENCIA[test.id];
  if (!f) return null;
  try { return f(r?.data || {}, r?.score || null, ev) || null; } catch { return null; }
}