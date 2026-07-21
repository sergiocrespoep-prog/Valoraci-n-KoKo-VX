// CUESTIONARIOS ÍTEM A ÍTEM — definiciones completas con puntuación automática.
// Lenguaje no clínico: interpretaciones como "observación", nunca "diagnóstico".

// Colores para las barras comparativas con valores de referencia (ver NormBar en ui.jsx)
const ZC = { ok:'#dcefe3', mid:'#fdeeda', bad:'#f9e0e0' };

const L04 = ['Ninguno','Poco','Bastante','Mucho','Muchísimo'];
const DIF = ['Sin dificultad','Dificultad leve','Dificultad moderada','Dificultad severa','Incapaz'];
const SYM = ['Ninguno','Leve','Moderado','Grave','Muy grave'];
const SN = ['No','Sí'];

export const CUESTIONARIOS = {

par_q_version_vigente: {
  tipo: 'si_no',
  instruccion: 'Responde SÍ o NO a cada pregunta pensando en tu estado de salud actual.',
  items: [
    { id:'p1', text:'¿Te ha dicho alguna vez un médico que tienes un problema de corazón O tensión arterial alta?' },
    { id:'p2', text:'¿Sientes dolor en el pecho en reposo, durante tus actividades diarias o al hacer actividad física?' },
    { id:'p3', text:'¿Pierdes el equilibrio por mareos O has perdido el conocimiento en los últimos 12 meses?' },
    { id:'p4', text:'¿Te han diagnosticado alguna otra condición de salud crónica (aparte de corazón o tensión)?' },
    { id:'p5', text:'¿Tomas actualmente medicación prescrita para alguna condición crónica?' },
    { id:'p6', text:'¿Tienes actualmente (o has tenido en los últimos 12 meses) un problema de hueso, articulación o tejido blando que pueda empeorar con la actividad física?' },
    { id:'p7', text:'¿Te ha dicho un médico que solo deberías hacer actividad física supervisada por un profesional sanitario?' }
  ],
  score(d) {
    const yes = ['p1','p2','p3','p4','p5','p6','p7'].filter(k => d[k] === 1).length;
    return {
      primary: { label:'Respuestas "Sí"', value: yes, max: 7 },
      interpretation: yes === 0
        ? 'Sin señales que impidan empezar actividad física de forma progresiva.'
        : `Hay ${yes} respuesta(s) afirmativa(s) → completar las páginas de seguimiento del PAR-Q+ y, si procede, recomendar consulta con profesional sanitario antes de empezar o progresar. Pasar al algoritmo ACSM.`,
      alerta: yes > 0,
      higherIsWorse: true
    };
  }
},

checklist_de_banderas_rojas_dolor: {
  tipo: 'checklist',
  instruccion: 'Marcar solo las señales presentes según lo comunicado por el cliente.',
  items: [
    'Dolor nocturno que despierta y no cambia con la postura',
    'Pérdida de peso involuntaria reciente',
    'Hormigueo o pérdida de sensibilidad en brazos o piernas',
    'Pérdida de fuerza progresiva',
    'Fiebre persistente sin causa clara',
    'Antecedente de cáncer',
    'Golpe o caída importante reciente',
    'Cambios en el control de esfínteres',
    'Dolor que no mejora con reposo ni cambia con el movimiento',
    'Mareos, alteraciones visuales u otros síntomas neurológicos'
  ],
  score(d) {
    const marked = d.marcadas || [];
    return {
      primary: { label:'Señales marcadas', value: marked.length, max: 10 },
      interpretation: marked.length === 0
        ? 'Sin señales de alerta comunicadas. Se puede continuar con la valoración.'
        : `Hay ${marked.length} señal(es) de alerta → NO continuar con pruebas de la zona afectada y recomendar consulta con profesional sanitario antes de entrenar esa zona.`,
      alerta: marked.length > 0,
      detalle: marked,
      higherIsWorse: true
    };
  }
},

cribado_koko_autonomia_fuerza: {
  tipo: 'si_no',
  instruccion: 'Responde SÍ o NO pensando en la situación habitual de las últimas semanas.',
  items: [
    { id:'a1', text:'¿Necesita ayuda de otra persona para levantarse de una silla, de la cama o del inodoro?' },
    { id:'a2', text:'¿Ha dejado de subir escaleras por falta de fuerza, seguridad o estabilidad?' },
    { id:'a3', text:'¿Le cuesta transportar objetos cotidianos, como una bolsa de la compra?' },
    { id:'a4', text:'¿Ha sufrido alguna caída en los últimos 12 meses?' },
    { id:'a5', text:'¿Ha notado una pérdida clara de capacidad para realizar sus tareas habituales durante los últimos 6 meses?' }
  ],
  score(d) {
    const keys = ['a1','a2','a3','a4','a5'];
    const total = keys.filter(k => d[k] === 1).length;
    return {
      primary: { label:'Señales funcionales comunicadas', value: total, max: 5 },
      interpretation: total === 0
        ? 'No se han comunicado señales funcionales en este cribado interno.'
        : `${total} señal(es) funcional(es) comunicada(s): completar la valoración con pruebas objetivas y contextualizar cada respuesta.`,
      alerta: false,
      higherIsWorse: true
    };
  }
},

rmdq_24_roland_morris: {
  tipo: 'si_no',
  instruccion: 'Piensa en cómo te encuentras HOY. Marca SÍ solo cuando la frase describa tu situación actual por el dolor de espalda.',
  nota: 'Versión española © Fundación Kovacs. Uso clínico libre con atribución. Kovacs et al., Spine 2002;27:538-542.',
  items: [
    { id:'r1', text:'Me quedo en casa la mayor parte del tiempo por mi dolor de espalda.' },
    { id:'r2', text:'Cambio de postura con frecuencia para intentar aliviar la espalda.' },
    { id:'r3', text:'Debido a mi espalda, camino más lentamente de lo normal.' },
    { id:'r4', text:'Debido a mi espalda, no puedo hacer ninguna de las faenas que habitualmente hago en casa.' },
    { id:'r5', text:'Por mi espalda, uso el pasamanos para subir escaleras.' },
    { id:'r6', text:'A causa de mi espalda, debo acostarme más a menudo para descansar.' },
    { id:'r7', text:'Debido a mi espalda, necesito agarrarme a algo para levantarme de los sillones o sofás.' },
    { id:'r8', text:'Por culpa de mi espalda, pido a los demás que me hagan las cosas.' },
    { id:'r9', text:'Me visto más lentamente de lo normal a causa de mi espalda.' },
    { id:'r10', text:'A causa de mi espalda, solo me quedo de pie durante cortos períodos de tiempo.' },
    { id:'r11', text:'A causa de mi espalda, procuro evitar inclinarme o arrodillarme.' },
    { id:'r12', text:'Me cuesta levantarme de una silla por culpa de mi espalda.' },
    { id:'r13', text:'Me duele la espalda casi siempre.' },
    { id:'r14', text:'Me cuesta darme la vuelta en la cama por culpa de mi espalda.' },
    { id:'r15', text:'Debido a mi dolor de espalda, no tengo mucho apetito.' },
    { id:'r16', text:'Me cuesta ponerme los calcetines —o medias— por mi dolor de espalda.' },
    { id:'r17', text:'Debido a mi dolor de espalda, tan solo ando distancias cortas.' },
    { id:'r18', text:'Duermo peor debido a mi espalda.' },
    { id:'r19', text:'Por mi dolor de espalda, deben ayudarme a vestirme.' },
    { id:'r20', text:'Estoy casi todo el día sentado a causa de mi espalda.' },
    { id:'r21', text:'Evito hacer trabajos pesados en casa, por culpa de mi espalda.' },
    { id:'r22', text:'Por mi dolor de espalda, estoy más irritable y de peor humor de lo normal.' },
    { id:'r23', text:'A causa de mi espalda, subo las escaleras más lentamente de lo normal.' },
    { id:'r24', text:'Me quedo casi constantemente en la cama por mi espalda.' }
  ],
  score(d) {
    const keys = Array.from({length:24}, (_,i) => `r${i+1}`);
    const total = keys.filter(k => d[k] === 1).length;
    return {
      primary: { label:'RMDQ-24', value: total, max: 24 },
      interpretation: total === 0
        ? 'No se han marcado limitaciones funcionales relacionadas con la espalda hoy.'
        : `${total} de 24 situaciones describen limitaciones relacionadas con la espalda hoy. Comparar con futuras reevaluaciones.`,
      alerta: false,
      higherIsWorse: true,
      norm: { value: total, min:0, max:24,
        zones:[{to:24, color:ZC.mid, label:'Seguimiento individual 0-24'}],
        refs:[] }
    };
  }
},

tug_timed_up_and_go: {
  tipo: 'medida',
  protocolo: 'Sentado en silla con respaldo (43-45 cm). A la señal: levantarse, caminar 3 m a paso normal y seguro, girar, volver y sentarse. Cronometrar desde "ya" hasta apoyar la espalda. 1 intento de práctica + 1 medido.',
  fields: [
    { id:'time', label:'Tiempo', type:'number', unit:'s', min:0, max:60, step:0.1, required:true },
    { id:'aid', label:'Ayuda técnica', type:'select', options:['Ninguna','Bastón','Andador','Otro'] }
  ],
  score(d) {
    const t = +(d.time ?? 0);
    let msg;
    if (!t) msg='Sin dato';
    else if (t<10) msg='Movilidad normal.';
    else if (t<12) msg='Movilidad razonable; vigilar evolución.';
    else if (t<20) msg='≥12 s: riesgo de caídas aumentado → priorizar fuerza de piernas y equilibrio; recomendable comentarlo con profesional sanitario.';
    else msg='Movilidad muy comprometida → trabajo supervisado y recomendación de valoración sanitaria.';
    return { primary:{label:'TUG',value:t,unit:'s'}, interpretation: msg, alerta: t>=12, higherIsWorse:true,
      norm: t ? { value: t, min:0, max:20, unit:' s',
        zones:[{to:10, color:ZC.ok, label:'Normal'},{to:12, color:ZC.mid, label:'Vigilar'},{to:20, color:ZC.bad, label:'Riesgo aumentado'}],
        refs:[{v:12, label:'Corte de riesgo 12 s'}] } : null };
  }
},

sts_30_sentadillas_en_30_s: {
  tipo: 'medida',
  protocolo: 'Silla 43 cm sin brazos contra pared. Brazos cruzados al pecho. Repeticiones completas (levantarse del todo y sentarse) en 30 segundos.',
  fields: [
    { id:'reps', label:'Repeticiones en 30 s', unit:'reps', help:'Sentadillas completas en 30 segundos, con los brazos cruzados sobre el pecho.', type:'number', min:0, max:50, required:true },
    { id:'edad', label:'Edad', type:'number', min:18, max:100, required:true, unit:'años', help:'Se usa para comparar con los valores normativos por edad y sexo.'},
    { id:'sexo', label:'Sexo', type:'select', options:['Mujer','Hombre'], required:true }
  ],
  score(d) {
    const W={60:12,65:11,70:10,75:10,80:9,85:8,90:4}, M={60:14,65:12,70:12,75:11,80:10,85:8,90:7};
    const reps=+(d.reps??0), edad=+(d.edad??0), tbl=d.sexo==='Hombre'?M:W;
    let thr=null;
    if (edad>=60) { const ks=Object.keys(tbl).map(Number).sort((a,b)=>b-a); for(const k of ks){ if(edad>=k){thr=tbl[k];break;} } }
    let msg;
    if (edad<60) msg = reps>=15?'Fuerza funcional de piernas adecuada.':reps>=10?'Fuerza de piernas mejorable: prioridad del programa.':'Fuerza de piernas muy limitada: base del trabajo inicial.';
    else msg = thr==null?'Sin referencia disponible.':(reps<thr?`Por debajo de la referencia de riesgo (${thr}): priorizar fuerza de piernas.`:`Por encima de la referencia (${thr}).`);
    const norm = edad<60
      ? { value: reps, min:0, max:25,
          zones:[{to:10, color:ZC.bad, label:'Muy limitada'},{to:15, color:ZC.mid, label:'Mejorable'},{to:25, color:ZC.ok, label:'Adecuada'}],
          refs:[{v:15, label:'Referencia ≥15 (adultos <60)'}] }
      : (thr!=null ? { value: reps, min:0, max:25,
          zones:[{to:thr, color:ZC.bad, label:'Bajo referencia'},{to:25, color:ZC.ok, label:'En rango o superior'}],
          refs:[{v:thr, label:`Referencia poblacional edad/sexo (${thr})`}] } : null);
    return { primary:{label:'Repeticiones',value:reps}, secondary: thr?[{label:'Referencia',value:thr}]:[], interpretation: msg, alerta: thr!=null&&reps<thr, higherIsWorse:false, norm };
  }
},

dinamometria_manual_fuerza_prensil: {
  tipo: 'medida',
  protocolo: 'Sentado, hombro pegado al tronco, codo a 90°, muñeca neutra, brazo sin apoyar. 3 intentos por mano ALTERNANDO, 30 s de descanso. Misma frase de ánimo siempre. Se registra el MÁXIMO.',
  fields: [
    { id:'dominante', label:'Mano dominante', type:'select', options:['Derecha','Izquierda'], required:true },
    { id:'d1', label:'Dominante 1', type:'number', unit:'kg', min:0, max:90, step:0.5 },
    { id:'d2', label:'Dominante 2', type:'number', unit:'kg', min:0, max:90, step:0.5 },
    { id:'d3', label:'Dominante 3', type:'number', unit:'kg', min:0, max:90, step:0.5 },
    { id:'n1', label:'No dominante 1', type:'number', unit:'kg', min:0, max:90, step:0.5 },
    { id:'n2', label:'No dominante 2', type:'number', unit:'kg', min:0, max:90, step:0.5 },
    { id:'n3', label:'No dominante 3', type:'number', unit:'kg', min:0, max:90, step:0.5 },
    { id:'sexo', label:'Sexo', type:'select', options:['Mujer','Hombre'], required:true }
  ],
  score(d) {
    const mx = a => { const v=a.filter(x=>x!=null&&x!==''&&!isNaN(x)).map(Number); return v.length?Math.max(...v):0; };
    const dom = mx([d.d1,d.d2,d.d3]), nd = mx([d.n1,d.n2,d.n3]);
    const corte = d.sexo==='Hombre'?27:16;
    const asim = dom>0&&nd>0 ? +((Math.abs(dom-nd)/dom*100).toFixed(1)) : null;
    let msg;
    if (!dom) msg='Sin dato.';
    else if (dom<corte) msg=`Por debajo del punto de corte EWGSOP2 (${corte} kg) → recomendar valoración médica (posible pérdida de masa muscular) y priorizar fuerza.`;
    else msg='Dentro del rango esperable. La fuerza de agarre es uno de los mejores indicadores de salud general: mantenerla es objetivo del programa.';
    return {
      primary:{label:'Máx. dominante',value:dom,unit:'kg'},
      secondary:[{label:'Máx. no dominante',value:nd,unit:'kg'},{label:'Asimetría',value:asim!=null?asim:'—',unit:'%'},{label:'Corte EWGSOP2',value:corte,unit:'kg'}],
      interpretation: msg, alerta: dom>0&&dom<corte, higherIsWorse:false,
      norm: dom ? { value: dom, min:0, max:60, unit:' kg',
        zones:[{to:corte, color:ZC.bad, label:'Bajo corte'},{to:60, color:ZC.ok, label:'Rango esperable'}],
        refs:[{v:corte, label:'Corte EWGSOP2'},{v: d.sexo==='Hombre'?46:30, label:'Media poblacional aprox.'}] } : null
    };
  }
},

rapa_actividad_fisica_en_mayores: {
  tipo: 'si_no',
  instruccion: 'Marca "Sí" o "No" en cada frase, según describa con precisión lo que haces habitualmente. La puntuación es el número más alto marcado como "Sí".',
  secciones: [
    { titulo: 'Parte 1 — Actividad aeróbica (nivel 1-7)', items: [
      { id: 'r1', text: '1. Nunca o casi nunca hago actividades físicas.' },
      { id: 'r2', text: '2. Hago algunas actividades físicas ligeras y/o moderadas, pero no cada semana.' },
      { id: 'r3', text: '3. Hago algunas actividades físicas ligeras cada semana.' },
      { id: 'r4', text: '4. Hago actividades físicas moderadas cada semana, pero menos de cinco días a la semana, o menos de 30 minutos diarios en esos días.' },
      { id: 'r5', text: '5. Hago actividades físicas intensas cada semana, pero menos de tres días por semana, o menos de 20 minutos diarios en esos días.' },
      { id: 'r6', text: '6. Hago 30 minutos o más de actividades físicas moderadas al día, 5 o más días por semana.' },
      { id: 'r7', text: '7. Hago 20 minutos o más de actividades físicas intensas al día, 3 o más días por semana.' },
    ]},
    { titulo: 'Parte 2 — Fuerza y flexibilidad', items: [
      { id: 'r8', text: 'Hago actividades para aumentar la fuerza muscular, como levantar pesas, una o más veces por semana.' },
      { id: 'r9', text: 'Hago actividades para mejorar la flexibilidad, como estiramientos o yoga, una o más veces por semana.' },
    ]},
  ],
  score(d) {
    const ids = ['r1','r2','r3','r4','r5','r6','r7'];
    let nivel = 0;
    ids.forEach((k, i) => { if (d[k] === 1) nivel = i + 1; });
    if (!nivel && d.r8 == null && d.r9 == null) return null;
    const fuerza = d.r8 === 1, flex = d.r9 === 1;
    const ff = (fuerza ? 1 : 0) + (flex ? 2 : 0);   // 0 ninguna · 1 fuerza · 2 flexibilidad · 3 ambas
    const cat = nivel >= 6 ? 'Activo'
      : nivel === 5 || nivel === 4 ? 'Poco activo pero regular'
      : nivel === 3 ? 'Poco activo regular (actividades ligeras)'
      : nivel === 2 ? 'Poco activo' : 'Sedentario';
    const msg = nivel >= 6
      ? 'Cumple las recomendaciones de actividad aeróbica. El objetivo es mantenerlo.'
      : nivel === 0
        ? 'Sin respuestas afirmativas: no se puede calcular el nivel.'
        : `Por debajo del nivel 6: la actividad aeróbica actual queda por debajo de lo recomendado (30 min de actividad moderada 5 días/semana o 20 min de intensa 3 días/semana).`;
    return {
      primary: { label: 'Nivel RAPA aeróbico', value: nivel || '—', max: 7 },
      secondary: [
        { label: 'Categoría', value: cat },
        { label: 'Fuerza semanal', value: fuerza ? 'Sí' : 'No' },
        { label: 'Flexibilidad semanal', value: flex ? 'Sí' : 'No' },
        { label: 'Indicador fuerza/flexibilidad', value: `${ff} de 3` },
      ],
      interpretation: msg,
      alerta: false,
      higherIsWorse: false,
      norm: nivel ? { value: nivel, min: 1, max: 7,
        zones: [{ to: 3, color: ZC.bad, label: 'Sedentario / poco activo' }, { to: 5, color: ZC.mid, label: 'Insuficiente' }, { to: 7, color: ZC.ok, label: 'Activo' }],
        refs: [{ v: 6, label: 'Cumple recomendaciones' }] } : null
    };
  }
},

ipaq_sf_actividad_fisica_forma_corta: {
  tipo: 'medida',
  protocolo: 'Pregunta por los ÚLTIMOS 7 DÍAS y solo por actividades de al menos 10 minutos seguidos. Anota los minutos de un día habitual, no el total de la semana. La app calcula los MET-min/semana y la categoría automáticamente.',
  fields: [
    { id: 'vig_dias', required: true, label: 'Actividad INTENSA: días en los últimos 7 días', help: 'Esfuerzo intenso que hace respirar mucho más fuerte de lo normal: levantar pesos pesados, cavar, aeróbic, bicicleta rápida.', type: 'number', min: 0, max: 7 },
    { id: 'vig_min', label: 'Actividad INTENSA: minutos en uno de esos días', type: 'number', unit: 'min', min: 0, max: 960 },
    { id: 'mod_dias', required: true, label: 'Actividad MODERADA: días en los últimos 7 días', help: 'Esfuerzo moderado que hace respirar algo más fuerte de lo normal: cargar pesos ligeros, bicicleta a ritmo normal. NO incluye caminar.', type: 'number', min: 0, max: 7 },
    { id: 'mod_min', label: 'Actividad MODERADA: minutos en uno de esos días', type: 'number', unit: 'min', min: 0, max: 960 },
    { id: 'cam_dias', required: true, label: 'CAMINAR: días que caminó al menos 10 minutos seguidos', help: 'Incluye caminar en el trabajo, en casa, para desplazarse o en el tiempo libre.', type: 'number', min: 0, max: 7 },
    { id: 'cam_min', label: 'CAMINAR: minutos en uno de esos días', type: 'number', unit: 'min', min: 0, max: 960 },
    { id: 'sentado_h', label: 'Tiempo SENTADO en un día entre semana', help: 'Se reporta aparte: no entra en el cálculo de MET-min/semana.', type: 'number', unit: 'h', min: 0, max: 24, step: 0.5 },
    { id: 'obs', label: 'Observaciones del entrenador', type: 'observacion' },
  ],
  score(d) {
    const n = v => { const x = parseFloat(v); return isNaN(x) ? 0 : x; };
    // Protocolo: episodios < 10 min se recodifican a 0; el resto se trunca a 180 min/día.
    const limpiar = m => { const x = n(m); return x < 10 ? 0 : Math.min(x, 180); };
    const vd = Math.min(n(d.vig_dias), 7), md = Math.min(n(d.mod_dias), 7), cd = Math.min(n(d.cam_dias), 7);
    const vm = limpiar(d.vig_min), mm = limpiar(d.mod_min), cm = limpiar(d.cam_min);
    if (!vd && !md && !cd && d.sentado_h == null) return null;
    const metVig = 8.0 * vm * vd, metMod = 4.0 * mm * md, metCam = 3.3 * cm * cd;
    const total = Math.round(metVig + metMod + metCam);
    const dias = vd + md + cd;   // el protocolo suma los días de las tres intensidades
    let cat;
    if ((vd >= 3 && total >= 1500) || (dias >= 7 && total >= 3000)) cat = 'Alta';
    else if ((vd >= 3 && vm >= 20) || ((md + cd) >= 5 && (mm >= 30 || cm >= 30)) || (dias >= 5 && total >= 600)) cat = 'Moderada';
    else cat = 'Baja';
    const sentado = d.sentado_h != null && d.sentado_h !== '' ? n(d.sentado_h) : null;
    const msg = cat === 'Alta'
      ? 'Nivel de actividad alto: por encima de las recomendaciones mínimas.'
      : cat === 'Moderada'
        ? 'Nivel de actividad moderado: cumple el mínimo recomendado, con margen de mejora.'
        : 'Nivel de actividad bajo: por debajo del mínimo recomendado por la OMS (150 min semanales de actividad moderada).';
    return {
      primary: { label: 'Actividad física total', value: total, unit: 'MET-min/semana' },
      secondary: [
        { label: 'Categoría IPAQ', value: cat },
        { label: 'Caminar', value: Math.round(metCam), unit: 'MET-min/sem' },
        { label: 'Moderada', value: Math.round(metMod), unit: 'MET-min/sem' },
        { label: 'Intensa', value: Math.round(metVig), unit: 'MET-min/sem' },
        { label: 'Días activos (suma)', value: dias, unit: 'de 21' },
        { label: 'Tiempo sentado', value: sentado != null ? sentado : '—', unit: 'h/día' },
      ],
      interpretation: msg + (sentado != null && sentado >= 8 ? ' El tiempo sentado declarado es alto: conviene romperlo con pausas frecuentes.' : ''),
      alerta: false,
      higherIsWorse: false,
      norm: { value: Math.min(total, 5000), min: 0, max: 5000, unit: ' MET-min',
        zones: [{ to: 600, color: ZC.bad, label: 'Baja' }, { to: 1500, color: ZC.mid, label: 'Moderada' }, { to: 5000, color: ZC.ok, label: 'Alta' }],
        refs: [{ v: 600, label: 'Mínimo recomendado' }] }
    };
  }
},

cuestionario_de_barreras_para_el_ejercic: {
  tipo: 'likert',
  instruccion: 'Estas son razones que la gente da para explicar por qué no hace tanta actividad física como debería. Indica qué probabilidad tienes de decir cada una. Una puntuación de 5 o más en una categoría señala una barrera importante a trabajar.',
  scale: ['Muy poco probable', 'Algo improbable', 'Algo probable', 'Muy probable'],
  items: [
    { id: 'b1',  text: '1. Mi día es tan ocupado ahora que no creo que pueda apartar tiempo para hacer actividad física en mi horario normal.' },
    { id: 'b2',  text: '2. A ninguno de mis familiares o amigos les gusta hacer actividad física, así que no tengo oportunidad de hacer ejercicio.' },
    { id: 'b3',  text: '3. Estoy muy cansado/a después del trabajo como para hacer ejercicio.' },
    { id: 'b4',  text: '4. He estado pensando en hacer ejercicio, pero no he sido capaz de dar el primer paso.' },
    { id: 'b5',  text: '5. Hacer ejercicio puede ser arriesgado a mi edad.' },
    { id: 'b6',  text: '6. No hago suficiente ejercicio porque nunca he aprendido ningún deporte.' },
    { id: 'b7',  text: '7. No tengo acceso a sitios para correr, piscinas, carriles bici, etc.' },
    { id: 'b8',  text: '8. Hacer actividad física me quita mucho tiempo de otras obligaciones: trabajo, familia, horarios, etc.' },
    { id: 'b9',  text: '9. Me da vergüenza cómo me voy a ver cuando haga ejercicio delante de otras personas.' },
    { id: 'b10', text: '10. Ni siquiera duermo lo suficiente. No podría levantarme más temprano ni acostarme más tarde para hacer ejercicio.' },
    { id: 'b11', text: '11. Es más fácil para mí encontrar excusas para no hacer ejercicio que ponerme a hacerlo.' },
    { id: 'b12', text: '12. Conozco a muchas personas que se han lesionado por esforzarse demasiado al hacer ejercicio.' },
    { id: 'b13', text: '13. Realmente no me veo aprendiendo un deporte nuevo a mi edad.' },
    { id: 'b14', text: '14. Es simplemente muy caro. Hay que pagar una clase, apuntarse a un club o comprar el equipo adecuado.' },
    { id: 'b15', text: '15. Tengo muy poco tiempo libre durante el día para hacer ejercicio.' },
    { id: 'b16', text: '16. Mis actividades sociales habituales con familiares y amigos no incluyen actividad física.' },
    { id: 'b17', text: '17. Estoy muy cansado/a durante la semana y necesito el fin de semana para recuperarme.' },
    { id: 'b18', text: '18. Quiero hacer más ejercicio, pero parece que no consigo mantenerme constante.' },
    { id: 'b19', text: '19. Me da miedo lesionarme o que me dé un ataque al corazón.' },
    { id: 'b20', text: '20. No se me da lo bastante bien ninguna actividad física como para que me resulte divertida.' },
    { id: 'b21', text: '21. Si hubiese un sitio para hacer ejercicio y duchas en el trabajo, sería más probable que hiciera ejercicio.' },
  ],
  score(d) {
    const CATS = [
      { nombre: 'Falta de tiempo',      items: ['b1','b8','b15'] },
      { nombre: 'Influencia social',    items: ['b2','b9','b16'] },
      { nombre: 'Falta de energía',     items: ['b3','b10','b17'] },
      { nombre: 'Falta de voluntad',    items: ['b4','b11','b18'] },
      { nombre: 'Miedo a lesionarse',   items: ['b5','b12','b19'] },
      { nombre: 'Falta de habilidades', items: ['b6','b13','b20'] },
      { nombre: 'Falta de recursos',    items: ['b7','b14','b21'] },
    ];
    const resp = Object.keys(d).filter(k => /^b\d+$/.test(k) && d[k] != null).length;
    if (!resp) return null;
    const puntos = CATS.map(c => ({
      nombre: c.nombre,
      valor: c.items.reduce((a, k) => a + (typeof d[k] === 'number' ? d[k] : 0), 0),
    })).sort((a, b) => b.valor - a.valor);
    const relevantes = puntos.filter(p => p.valor >= 5);
    const msg = relevantes.length
      ? `Barrera(s) importante(s) a trabajar: ${relevantes.map(p => `${p.nombre.toLowerCase()} (${p.valor}/9)`).join(', ')}. Conviene diseñar una estrategia concreta para cada una antes de subir la carga de entrenamiento.`
      : 'Ninguna categoría alcanza el umbral de 5 puntos: no aparecen barreras destacadas. Aun así, la barrera con más puntuación es la primera candidata a vigilar.';
    return {
      primary: { label: 'Barrera principal', value: `${puntos[0].nombre} (${puntos[0].valor}/9)` },
      secondary: puntos.slice(1).map(p => ({ label: p.nombre, value: `${p.valor} / 9` })),
      interpretation: msg,
      alerta: false,
      higherIsWorse: true,
      norm: { value: puntos[0].valor, min: 0, max: 9,
        zones: [{ to: 4, color: ZC.ok, label: 'No es barrera' }, { to: 9, color: ZC.bad, label: 'Barrera importante' }],
        refs: [{ v: 5, label: 'Umbral CDC' }] }
    };
  }
},

short_fes_i_miedo_a_caerse: {
  tipo: 'likert',
  instruccion: 'Preguntas sobre su preocupación ante la posibilidad de caerse. Responda pensando en cómo hace habitualmente la actividad. Si no la realiza, responda si estaría preocupado/a de caerse SI la hiciera.',
  scale: ['No preocupado/a en absoluto', 'Algo preocupado/a', 'Bastante preocupado/a', 'Muy preocupado/a'],
  items: [
    { id: 'f1', text: '1. Vestirse o desvestirse' },
    { id: 'f2', text: '2. Bañarse o ducharse' },
    { id: 'f3', text: '3. Sentarse o levantarse de una silla' },
    { id: 'f4', text: '4. Subir o bajar escaleras' },
    { id: 'f5', text: '5. Coger algo por encima de la cabeza o del suelo' },
    { id: 'f6', text: '6. Subir o bajar una rampa' },
    { id: 'f7', text: '7. Salir a un acto social (reunión familiar, acto religioso, quedada…)' },
  ],
  score(d) {
    const ids = ['f1','f2','f3','f4','f5','f6','f7'];
    // La escala oficial va de 1 a 4; los botones devuelven 0-3.
    const vals = ids.map(k => typeof d[k] === 'number' ? d[k] + 1 : null);
    const dados = vals.filter(v => v != null);
    if (!dados.length) return null;
    const faltan = 7 - dados.length;
    if (faltan >= 3) return {
      primary: { label: 'Short FES-I', value: '—', max: 28 },
      secondary: [{ label: 'Ítems sin responder', value: faltan }],
      interpretation: 'Faltan 3 o más ítems: según el protocolo oficial la escala no es puntuable.',
      avisos: [], alerta: false, higherIsWorse: true
    };
    // Protocolo oficial para 1-2 ítems faltantes: prorratear y redondear hacia arriba.
    const suma = dados.reduce((a, b) => a + b, 0);
    const total = faltan === 0 ? suma : Math.ceil(suma / dados.length * 7);
    const nivel = total <= 8 ? 'Baja' : total <= 13 ? 'Moderada' : 'Alta';
    const msg = nivel === 'Alta'
      ? 'Preocupación alta por caerse. El miedo a caerse condiciona la actividad y es en sí mismo un factor de riesgo: conviene trabajar equilibrio y confianza de forma progresiva, y comentarlo con un profesional sanitario si limita la vida diaria.'
      : nivel === 'Moderada'
        ? 'Preocupación moderada por caerse. Merece la pena incluir trabajo específico de equilibrio y exposición gradual a las actividades que más inquietan.'
        : 'Preocupación baja por caerse.';
    return {
      primary: { label: 'Short FES-I total', value: total, max: 28 },
      secondary: [
        { label: 'Nivel de preocupación', value: nivel },
        ...(faltan ? [{ label: 'Ítems prorrateados', value: faltan }] : []),
      ],
      interpretation: msg,
      alerta: nivel === 'Alta',
      higherIsWorse: true,
      norm: { value: total, min: 7, max: 28,
        zones: [{ to: 8, color: ZC.ok, label: 'Baja' }, { to: 13, color: ZC.mid, label: 'Moderada' }, { to: 28, color: ZC.bad, label: 'Alta' }],
        refs: [{ v: 14, label: 'Umbral de preocupación alta' }] }
    };
  }
}

};