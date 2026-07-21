// INFORMACIÓN DE AYUDA POR PRUEBA — contenidos para los iconos ℹ️ (para qué sirve),
// 🩺 (qué mide), 📖 (manual paso a paso) y 📏 (puntuaciones y valores de referencia).
// Se generan a partir de la definición de cada prueba + rangos curados para las más usadas.

import { CUESTIONARIOS } from './cuestionarios.js';

// Rangos y valores de referencia curados (los de mayor uso / con baremos publicados)
const RANGOS = {
  par_q_version_vigente: 'Cualquier respuesta "Sí" → completar las páginas de seguimiento del PAR-Q+ y aplicar el algoritmo ACSM antes de empezar o progresar. 0 síes = puede empezar actividad progresiva.',
  checklist_de_banderas_rojas_dolor: 'Cualquier señal marcada → NO evaluar ni entrenar la zona afectada y recomendar consulta con profesional sanitario. 0 señales = continuar con la valoración.',
  cribado_koko_autonomia_fuerza: 'Rango interno 0–5, sin punto de corte clínico. Cada respuesta afirmativa orienta la selección de pruebas objetivas y debe interpretarse por separado.',
  checkin_koko_bienestar: 'Media interna 0–10. No hay baremos clínicos: se compara con la propia persona y se revisa el contexto antes de sacar conclusiones.',
  checkin_koko_sueno: 'Calidad y somnolencia 0–10 más horas medias. No diagnostica trastornos del sueño; sirve para ajustar carga y recuperación.',
  checkin_koko_estres_recuperacion: 'Estrés y recuperación 0–10. Sin puntos de corte diagnósticos; usar tendencia individual.',
  nrs_de_dolor_0_10: 'Escala 0–10 por zona. ≥7 = dolor intenso: adaptar la sesión y valorar recomendación profesional. El cambio debe interpretarse junto a función y contexto.',
  escala_funcional_personalizada_koko: 'Media 0–10. Mayor puntuación = mejor capacidad. Se compara con la propia persona y con las mismas actividades en reevaluaciones.',
  rmdq_24_roland_morris: 'Rango 0–24. Mayor puntuación = más situaciones cotidianas afectadas por el dolor lumbar. No existen categorías universales obligatorias; usar seguimiento individual.',
  confianza_movimiento_koko: 'Confianza 0–10. Mayor puntuación = mayor confianza. Sin punto de corte clínico; sirve para ajustar progresión y comunicación.',
  tug_timed_up_and_go: '<10 s movilidad normal · 10–12 s vigilar · ≥12 s riesgo de caídas aumentado (priorizar fuerza de piernas y equilibrio) · ≥20 s movilidad muy comprometida.',
  sts_30_sentadillas_en_30_s: '<60 años: ≥15 repeticiones adecuado · 10–14 mejorable · <10 muy limitado. 60+: referencia por edad y sexo (Rikli & Jones), p. ej. 60-64: 12 mujeres / 14 hombres.',
  dinamometria_manual_fuerza_prensil: 'Corte EWGSOP2 de fuerza baja: <27 kg hombres · <16 kg mujeres (→ recomendar valoración médica). Medias poblacionales aprox.: 46 kg hombres · 30 kg mujeres. Asimetría >10-15% entre manos: anotar.',
  sppb_short_physical_performance_battery: 'Rango 0–12 puntos. ≥10 buen rendimiento físico · 7–9 intermedio · ≤6 rendimiento bajo (riesgo de discapacidad y caídas).',
  imc: 'OMS: <18,5 bajo peso · 18,5–24,9 normopeso · 25–29,9 sobrepeso · ≥30 obesidad. Precaución: en personas muy musculadas sobreestima la grasa; usar junto a cintura.',
  perimetro_de_cintura: 'Riesgo cardiometabólico aumentado: ≥80 cm (mujeres) / ≥94 cm (hombres); riesgo alto: ≥88 / ≥102 cm.',
  indice_cintura_altura_whtr: 'Objetivo: <0,5 (que la cintura sea menos de la mitad de la altura). 0,5–0,59 riesgo aumentado · ≥0,6 riesgo alto.',
  fc_en_reposo: 'Adulto típico: 60–80 lpm (deportistas pueden estar <60). >100 lpm en reposo de forma repetida → recomendar consulta médica antes de cargas altas.',
  tension_arterial_en_reposo: '<120/80 óptima · 120–139/80–89 normal-alta · ≥140/90 elevada (recomendar valoración médica) · ≥180/110 NO entrenar hoy y derivar.',
  short_fes_i_miedo_a_caerse: 'Rango 7–28. 7–8 sin preocupación · 9–13 moderada · ≥14 preocupación alta por caerse (trabajar equilibrio y confianza).'
};

const limpio = v => (v == null || v === '' ? null : String(v));

// ℹ️ Para qué sirve (breve)
export function infoBreve(t) {
  return [
    { h: 'Para qué sirve', p: limpio(t.descripcion) },
    { h: 'Resultado que da', p: limpio(t.resultado) },
    { h: 'Datos rápidos', p: `Tiempo: ${t.tiempo || '—'} · Dónde: ${t.donde || '—'} · Materiales: ${t.materiales || 'Ninguno'}` }
  ].filter(s => s.p);
}

// 🩺 Qué mide fundamentalmente
export function infoMedico(t) {
  return [
    { h: 'Qué mide fundamentalmente', p: limpio(t.resultado) },
    { h: 'Descripción', p: limpio(t.descripcion) },
    { h: 'Para quién está indicada', p: limpio(t.poblaciones) },
    { h: 'Encuadre profesional (no clínico)', p: limpio(t.encuadre) },
    { h: 'Base científica / referencia', p: limpio(t.referencia) }
  ].filter(s => s.p);
}

// 📖 Manual paso a paso, ítem a ítem
export function infoManual(t) {
  const Q = CUESTIONARIOS[t.id];
  const sec = [];
  sec.push({ h: 'Preparación', p: `Dónde: ${t.donde || '—'} · Tiempo estimado: ${t.tiempo || '—'} · Materiales: ${t.materiales || 'Ninguno'}` });
  if (t.reglaUso) sec.push({ h: 'Cuándo usarla', p: t.reglaUso });
  if (Q?.protocolo) sec.push({ h: 'Protocolo exacto de ejecución', p: Q.protocolo });
  if (Q?.instruccion) sec.push({ h: 'Instrucción que se lee al cliente', p: Q.instruccion });
  if (Q?.scale) sec.push({ h: 'Escala de respuesta', p: Q.scale.join(' · ') });
  if (Q?.items) sec.push({ h: `Ítems (${Q.items.length})`, list: Q.items.map(it => typeof it === 'string' ? it : (it.text || it.title)) });
  if (Q?.sections) for (const scn of Q.sections) sec.push({ h: scn.title, list: scn.items.map(i => i.text) });
  const fields = (Q?.fields || t.fields || []).filter(f => f.type !== 'observacion');
  if (fields.length) sec.push({ h: 'Campos a registrar', list: fields.map(f =>
    f.label + (f.unit ? ` (${f.unit})` : '') + (f.required ? ' — obligatorio' : '') + (f.help ? `. ${f.help}` : '') +
    (f.options ? `. Opciones: ${f.options.join(' / ')}` : '')) });
  if (t.encuadre) sec.push({ h: 'Lenguaje y encuadre en sala', p: t.encuadre });
  if (t.referencia) sec.push({ h: 'Referencia', p: t.referencia });
  return sec;
}

// 📏 Puntuaciones, valores normales y precauciones
export function infoPuntuacion(t) {
  const sec = [];
  if (t.resultado) sec.push({ h: 'Qué devuelve la prueba', p: t.resultado });
  if (RANGOS[t.id]) sec.push({ h: 'Rangos y valores de referencia', p: RANGOS[t.id] });
  const rules = (t.interpret || []).map(r => `${r.nivel === 'alerta' ? '⚠ ALERTA' : 'Aviso'}: ${r.texto}`);
  if (rules.length) sec.push({ h: 'Avisos automáticos de la app', list: rules });
  if (!RANGOS[t.id] && !rules.length) sec.push({ h: 'Interpretación', p: 'Sin baremos poblacionales publicados para esta prueba: usar comparación intra-sujeto (evolución del propio cliente entre valoraciones).' });
  sec.push({ h: 'Precaución general', p: 'Los valores de referencia son orientativos y NO constituyen diagnóstico. Ante resultados en zona de riesgo, dolor ≥7/10 o señales de alerta, adaptar la sesión y valorar recomendar consulta con un profesional sanitario.' });
  return sec;
}