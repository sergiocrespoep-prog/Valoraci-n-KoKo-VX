// BATERÍA KOKO — generada desde bateria_evaluaciones_koko_depurada.xlsx
// Editable: añade/quita pruebas o campos siguiendo la misma estructura.
// implementacion: 'items' (ítem a ítem en cuestionarios.js) | 'campos' | 'registro' (puntuación de cuestionario hecho en casa)
export const BATERIA = [
{
  "id": "par_q_version_vigente",
  "nombre": "PAR-Q+ (versión vigente)",
  "categoria": "1. Cribado inicial y seguridad",
  "tipo": "Cuestionario",
  "poblaciones": "Todos",
  "descripcion": "Cuestionario autoadministrado de aptitud para el ejercicio: 7 preguntas iniciales sí/no sobre salud cardiovascular, dolor torácico, mareos, articulaciones, medicación y otras condiciones; si hay algún 'sí', páginas de seguimiento condicionales por patología.",
  "resultado": "Apto para empezar / recomendación de consulta médica previa",
  "tiempo": "5-10 min",
  "materiales": "Ninguno (papel, formulario o Harbiz)",
  "donde": "Ambos",
  "referencia": "Warburton et al. 2011, Health & Fitness Journal of Canada · eparmedx.com",
  "encuadre": "Apto EP: cribado preparticipación estándar internacional. Un 'sí' relevante → recomendar valoración médica antes de empezar.",
  "reglaUso": "Universal, en casa antes de la cita. Cualquier 'sí' → pasar al algoritmo ACSM.",
  "implementacion": "items",
  "enInforme": true
 },
{
  "id": "algoritmo_de_cribado_preparticipacion_ac",
  "nombre": "Algoritmo de cribado preparticipación ACSM (2015)",
  "categoria": "1. Cribado inicial y seguridad",
  "tipo": "Cuestionario / árbol de decisión",
  "poblaciones": "Todos",
  "descripcion": "Árbol de decisión del entrenador basado en 3 factores: nivel de actividad actual, enfermedad cardiovascular/metabólica/renal conocida, y presencia de signos o síntomas. Clasifica si se puede empezar sin autorización médica y a qué intensidad.",
  "resultado": "Autorización médica necesaria sí/no + intensidad inicial recomendada",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Centro",
  "referencia": "Riebe et al. 2015, Medicine & Science in Sports & Exercise",
  "encuadre": "Apto EP: cribado de seguridad; sustituye/complementa al PAR-Q+ con criterio de intensidad.",
  "reglaUso": "Solo si el PAR-Q+ marca algo o hay dudas; lo aplica el entrenador.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "ejercicio_regular",
    "label": "¿Hace ejercicio regular (≥3 días/sem, 30 min moderado, últimos 3 meses)?",
    "type": "select",
    "options": [
     "Sí",
     "No"
    ],
    "required": true
   },
   {
    "id": "enfermedad_cmr",
    "label": "¿Enfermedad cardiovascular, metabólica o renal conocida?",
    "type": "select",
    "options": [
     "No",
     "Sí"
    ],
    "required": true
   },
   {
    "id": "sintomas",
    "label": "¿Signos o síntomas sugestivos en reposo o esfuerzo?",
    "type": "select",
    "options": [
     "No",
     "Sí"
    ],
    "required": true,
    "help": "Dolor torácico, disnea inusual, mareo/síncope, edema de tobillos, palpitaciones, claudicación"
   },
   {
    "id": "intensidad_prevista",
    "label": "Intensidad de ejercicio prevista",
    "type": "select",
    "options": [
     "Ligera-moderada",
     "Vigorosa"
    ],
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "sintomas": "Sí"
    },
    "nivel": "alerta",
    "texto": "Síntomas presentes → recomendar valoración médica antes de iniciar o continuar el programa."
   },
   {
    "when": {
     "enfermedad_cmr": "Sí",
     "ejercicio_regular": "No"
    },
    "nivel": "alerta",
    "texto": "Enfermedad conocida sin ejercicio previo → recomendable autorización médica antes de empezar."
   },
   {
    "when": {
     "enfermedad_cmr": "Sí",
     "intensidad_prevista": "Vigorosa"
    },
    "nivel": "aviso",
    "texto": "Enfermedad conocida + intensidad vigorosa prevista → recomendable consulta médica antes de progresar a vigoroso."
   }
  ]
 },
{
  "id": "checklist_de_banderas_rojas_dolor",
  "nombre": "Checklist de banderas rojas (dolor)",
  "categoria": "1. Cribado inicial y seguridad",
  "tipo": "Cuestionario",
  "poblaciones": "Con dolor",
  "descripcion": "Lista de 10 señales de alarma sí/no: dolor nocturno no mecánico, pérdida de peso involuntaria, parestesias, pérdida de fuerza progresiva, fiebre, historia de cáncer, trauma reciente, síntomas urinarios, dolor que no mejora con reposo, síntomas neurológicos.",
  "resultado": "Nº de banderas presentes → derivación si alguna positiva",
  "tiempo": "2-3 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Adaptado de guías clínicas de lumbalgia (p. ej. NICE NG59)",
  "encuadre": "Cribado no diagnóstico → cualquier positivo: derivar a médico antes de continuar.",
  "reglaUso": "Solo clientes con dolor; SIEMPRE antes que cualquier PROM o prueba física de esa zona.",
  "implementacion": "items",
  "enInforme": true
 },
{
  "id": "cribado_koko_autonomia_fuerza",
  "nombre": "Cribado KoKo de autonomía y fuerza percibida (interno)",
  "categoria": "1. Cribado inicial y seguridad",
  "tipo": "Cuestionario interno",
  "poblaciones": "60+, Menopausia, Pérdida funcional",
  "descripcion": "Cinco preguntas originales de KoKo sobre ayuda en transferencias, escaleras, carga cotidiana, caídas y pérdida reciente de capacidad. Sirve para decidir qué pruebas objetivas conviene realizar; no diagnostica sarcopenia.",
  "resultado": "Número de señales funcionales comunicadas (0-5), sin punto de corte clínico",
  "tiempo": "2 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Protocolo interno KoKo; completar con dinamometría, STS-30, TUG/SPPB según edad y contexto",
  "encuadre": "Cribado interno no diagnóstico. Las respuestas orientan la selección de pruebas objetivas y la progresión del entrenamiento.",
  "reglaUso": "Preferente en 60+, menopausia o cuando se observe pérdida de autonomía. Una o más señales → realizar pruebas objetivas y valorar consulta sanitaria si la limitación es nueva, progresiva o importante.",
  "implementacion": "items",
  "enInforme": true
},
{
  "id": "anamnesis_koko_protocolo_interno",
  "nombre": "Anamnesis Koko (protocolo interno)",
  "categoria": "2. Anamnesis y contexto",
  "tipo": "Formulario",
  "poblaciones": "Todos",
  "descripcion": "Recogida estructurada: objetivo principal, historial de lesiones y cirugías relevantes al ejercicio, medicación (aviso betabloqueantes/FC), actividad previa, trabajo y ergonomía, horarios, preferencias y aversiones de ejercicio.",
  "resultado": "Perfil de partida del cliente",
  "tiempo": "10 min",
  "materiales": "Ninguno",
  "donde": "Centro",
  "referencia": "Protocolo interno Koko (basado en app Evaluación SC)",
  "encuadre": "Apto EP: recogida de información para programar; no es historia clínica sanitaria.",
  "reglaUso": "Universal, presencial: repaso de lo enviado a casa.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "objetivo",
    "label": "Objetivo principal del cliente",
    "type": "text"
   },
   {
    "id": "historial",
    "label": "Antecedentes relevantes comunicados (lesiones, cirugías, condiciones)",
    "type": "text"
   },
   {
    "id": "medicacion",
    "label": "Medicación comunicada",
    "type": "text",
    "help": "Atención a betabloqueantes: alteran la FC; usar RPE en vez de FC objetivo"
   },
   {
    "id": "experiencia",
    "label": "Experiencia previa de entrenamiento (tiempo total entrenando)",
    "type": "select",
    "options": [
     "Menos de 6 meses",
     "6 meses – 1 año",
     "1 – 3 años",
     "3 – 5 años",
     "Más de 5 años"
    ]
   },
   {
    "id": "dolor_actual",
    "label": "Molestias o limitaciones actuales comunicadas",
    "type": "text"
   },
   {
    "id": "preferencias",
    "label": "Preferencias y rechazos (ejercicios, horarios, estilo)",
    "type": "text"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "cuestionario_de_objetivos_y_expectativas",
  "nombre": "Cuestionario de objetivos y expectativas (interno)",
  "categoria": "2. Anamnesis y contexto",
  "tipo": "Formulario",
  "poblaciones": "Todos",
  "descripcion": "5-8 preguntas abiertas (qué quiere conseguir, para cuándo, qué ha probado, qué le funcionó) + 2 reglas 0-10 de importancia y confianza (estilo entrevista motivacional).",
  "resultado": "Objetivos priorizados + reglas importancia/confianza",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Protocolo interno · reglas: Miller & Rollnick, Entrevista Motivacional",
  "encuadre": "Apto EP: coaching de objetivos.",
  "reglaUso": "Universal, en casa; se repasa en el cierre de la hora.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "objetivo_3m",
    "label": "Objetivo a 3 meses (en palabras del cliente)",
    "type": "text"
   },
   {
    "id": "objetivo_12m",
    "label": "Objetivo a 12 meses",
    "type": "text"
   },
   {
    "id": "importancia",
    "label": "Importancia que le da (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10
   },
   {
    "id": "confianza",
    "label": "Confianza en conseguirlo (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10
   },
   {
    "id": "exito",
    "label": "¿Qué sería un éxito para ti?",
    "type": "text"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "ipaq_sf_actividad_fisica_forma_corta",
  "nombre": "IPAQ-SF (actividad física, forma corta)",
  "categoria": "3. Hábitos y estilo de vida",
  "tipo": "Cuestionario",
  "poblaciones": "Todos (18-69 años)",
  "descripcion": "7 ítems: días y minutos de actividad vigorosa, moderada y de caminar en la última semana, más tiempo sentado un día laborable.",
  "resultado": "MET-min/semana + categoría baja/moderada/alta + sedentarismo",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Craig et al. 2003, Med Sci Sports Exerc · ipaq.ki.se (uso libre)",
  "encuadre": "Apto EP: hábitos de actividad física.",
  "reglaUso": "Adultos <60 como foto inicial. No repetir si ya se monitorizan pasos. Elegido sobre GPAQ.",
  "implementacion": "items",
  "enInforme": true,
  "fields": []
 },
{
  "id": "rapa_actividad_fisica_en_mayores",
  "nombre": "RAPA (actividad física en mayores)",
  "categoria": "3. Hábitos y estilo de vida",
  "tipo": "Cuestionario",
  "poblaciones": "60+",
  "descripcion": "9 ítems sí/no muy sencillos; puntúa nivel de actividad aeróbica (1-7) y, aparte, fuerza y flexibilidad. Diseñado para mayores con baja carga de lectura.",
  "resultado": "Nivel 1-7 aeróbico + indicador fuerza/flexibilidad",
  "tiempo": "3 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Topolski et al. 2006, Preventing Chronic Disease (uso libre)",
  "encuadre": "Apto EP: hábitos en población mayor.",
  "reglaUso": "Sustituye al IPAQ en 60+.",
  "implementacion": "items",
  "enInforme": true,
  "fields": []
 },
{
  "id": "mini_cuestionario_de_hidratacion_y_alcoh",
  "nombre": "Mini-cuestionario de hidratación y alcohol (interno)",
  "categoria": "3. Hábitos y estilo de vida",
  "tipo": "Cuestionario",
  "poblaciones": "Todos",
  "descripcion": "4-6 ítems de frecuencia: vasos de agua/día, refrescos azucarados, alcohol (unidades/semana y patrón), cafeína y horario.",
  "resultado": "Perfil de bebidas y señales a trabajar",
  "tiempo": "2 min",
  "materiales": "Ninguno",
  "donde": "Casa",
  "referencia": "Protocolo interno Koko",
  "encuadre": "Apto EP/TSD: hábitos.",
  "reglaUso": "Universal, en casa.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "agua_vasos",
    "label": "Vasos de agua/día (aprox.)",
    "type": "number",
    "min": 0,
    "max": 20,
    "help": "Vasos de unos 250 ml. Referencia orientativa: 6-8 vasos diarios de líquido total en adultos sanos.",
    "unit": "vasos/día"
   },
   {
    "id": "alcohol",
    "label": "Consumo de alcohol",
    "type": "select",
    "options": [
     "No bebe",
     "Ocasional (≤1/sem)",
     "Semanal (2-6/sem)",
     "Diario"
    ]
   },
   {
    "id": "bebidas_azucar",
    "label": "Bebidas azucaradas/energéticas habituales",
    "type": "text"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "checkin_koko_sueno",
  "nombre": "Check-in KoKo de sueño y recuperación (interno)",
  "categoria": "3. Hábitos y estilo de vida",
  "tipo": "Formulario interno",
  "poblaciones": "Todos, Menopausia",
  "descripcion": "Registro breve y original sobre horas de sueño, calidad percibida, somnolencia diurna y regularidad. Se usa para adaptar carga, horarios y recuperación; no diagnostica trastornos del sueño.",
  "resultado": "Calidad percibida 0-10 + horas + somnolencia 0-10",
  "tiempo": "2-3 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Protocolo interno KoKo",
  "encuadre": "Contexto de recuperación para programar entrenamiento. No sustituye una valoración médica del sueño.",
  "reglaUso": "Universal si hay cansancio, sueño irregular o mala recuperación; repetir para comparar con la propia persona.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
    { "id": "horas", "label": "Horas de sueño reales por noche (media últimos 7 días)", "type": "number", "unit": "h", "min": 0, "max": 14, "step": 0.5, "required": true },
    { "id": "calidad", "label": "Calidad percibida del sueño (0 = muy mala, 10 = muy buena)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "somnolencia", "label": "Somnolencia o cansancio durante el día (0 = nada, 10 = extremo)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "regularidad", "label": "Regularidad de horarios de sueño", "type": "select", "options": ["Bastante regular", "Algo variable", "Muy variable"], "required": true },
    { "id": "dificultad", "label": "Principal dificultad observada (opcional)", "type": "text" },
    { "id": "obs", "label": "Observaciones del entrenador", "type": "observacion" }
  ],
  "computed": [
    { "id": "calidad_sueno", "label": "Calidad percibida", "formula": "identidad", "inputs": ["calidad"], "max": 10 },
    { "id": "somnolencia_dia", "label": "Somnolencia diurna", "formula": "identidad", "inputs": ["somnolencia"], "max": 10 },
    { "id": "horas_sueno", "label": "Horas medias", "formula": "identidad", "inputs": ["horas"], "unit": "h" }
  ],
  "interpret": [
    { "when": { "calidad_lte": 3 }, "nivel": "aviso", "texto": "Calidad de sueño percibida baja: ajustar carga y recuperación y observar su evolución." },
    { "when": { "somnolencia_gte": 7 }, "nivel": "aviso", "texto": "Somnolencia diurna alta: evitar sesiones exigentes si afecta a la seguridad y recomendar consulta sanitaria si persiste." },
    { "when": { "horas_lt": 5 }, "nivel": "aviso", "texto": "Promedio inferior a 5 horas: dato relevante para recuperación y seguridad; conviene abordarlo con la clienta." }
  ]
},
{
  "id": "checkin_koko_estres_recuperacion",
  "nombre": "Check-in KoKo de estrés y recuperación (interno)",
  "categoria": "3. Hábitos y estilo de vida",
  "tipo": "Formulario interno",
  "poblaciones": "Todos, Menopausia",
  "descripcion": "Dos escalas breves y originales sobre estrés actual y sensación de recuperación, más una pregunta abierta sobre la principal carga de la semana.",
  "resultado": "Estrés 0-10 y recuperación 0-10, comparados con la propia persona",
  "tiempo": "1-2 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Protocolo interno KoKo",
  "encuadre": "Información contextual para ajustar volumen, intensidad y expectativas. No es un test psicológico ni establece diagnósticos.",
  "reglaUso": "Usar cuando la anamnesis señale estrés, fatiga o baja recuperación; puede repetirse en el check-in semanal.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
    { "id": "estres", "label": "Estrés percibido esta semana (0 = nada, 10 = extremo)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "recuperacion", "label": "Sensación de recuperación (0 = nada recuperado, 10 = totalmente)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "carga_principal", "label": "Principal fuente de carga o preocupación (opcional)", "type": "text" },
    { "id": "obs", "label": "Observaciones del entrenador", "type": "observacion" }
  ],
  "computed": [
    { "id": "estres_actual", "label": "Estrés percibido", "formula": "identidad", "inputs": ["estres"], "max": 10 },
    { "id": "recuperacion_actual", "label": "Recuperación percibida", "formula": "identidad", "inputs": ["recuperacion"], "max": 10 }
  ],
  "interpret": [
    { "when": { "estres_gte": 8 }, "nivel": "aviso", "texto": "Estrés percibido muy alto: reducir exigencia si procede y priorizar adherencia y recuperación." },
    { "when": { "recuperacion_lte": 3 }, "nivel": "aviso", "texto": "Recuperación percibida baja: revisar sueño, carga total y respuesta a las sesiones." }
  ]
},
{
  "id": "cuestionario_de_barreras_para_el_ejercic",
  "nombre": "Cuestionario de barreras para el ejercicio",
  "categoria": "3. Hábitos y estilo de vida",
  "tipo": "Cuestionario",
  "poblaciones": "Todos",
  "descripcion": "Lista de barreras percibidas (tiempo, cansancio, vergüenza, dolor, familia, coste…) valoradas en Likert; puede usarse la EBBS o una versión interna reducida de 10 ítems.",
  "resultado": "Top 3 barreras → plan de contingencia",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Casa",
  "referencia": "Sechrist, Walker & Pender 1987, Research in Nursing & Health (EBBS)",
  "encuadre": "Apto EP: adherencia y coaching.",
  "reglaUso": "Universal, en casa; alimenta el plan de adherencia y la autoeficacia.",
  "implementacion": "items",
  "enInforme": true,
  "fields": []
 },
{
  "id": "checkin_koko_bienestar",
  "nombre": "Check-in KoKo de bienestar cotidiano (interno)",
  "categoria": "4. Bienestar y calidad de vida",
  "tipo": "Formulario interno",
  "poblaciones": "Todos",
  "descripcion": "Cuatro escalas originales sobre ánimo general, energía, interés por las actividades y capacidad para el día a día durante la última semana.",
  "resultado": "Media interna 0-10, destinada a seguimiento individual y sin puntos de corte clínicos",
  "tiempo": "2 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Protocolo interno KoKo",
  "encuadre": "Contextualiza el entrenamiento. No es un cuestionario diagnóstico ni un cribado de depresión.",
  "reglaUso": "Puede usarse al inicio y en reevaluaciones para comparar cambios con la propia persona.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
    { "id": "animo", "label": "Estado de ánimo general en la última semana (0 = muy bajo, 10 = muy bueno)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "energia", "label": "Energía disponible para el día a día (0-10)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "interes", "label": "Interés o ganas de hacer actividades habituales (0-10)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "funcionamiento", "label": "Capacidad percibida para afrontar las tareas cotidianas (0-10)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "comentario", "label": "Comentario de la clienta (opcional)", "type": "text" },
    { "id": "obs", "label": "Observaciones del entrenador", "type": "observacion" }
  ],
  "computed": [
    { "id": "bienestar_medio", "label": "Bienestar cotidiano medio", "formula": "media", "inputs": ["animo", "energia", "interes", "funcionamiento"], "max": 10 }
  ],
  "interpret": [
    { "when": { "bienestar_medio_lte": 3 }, "nivel": "aviso", "texto": "Resultado bajo en este check-in interno: hablarlo con la clienta antes de interpretar o entregar el informe y adaptar las expectativas del entrenamiento." }
  ]
},
{
  "id": "nrs_de_dolor_0_10",
  "nombre": "NRS de dolor (0-10)",
  "categoria": "5. Dolor y función (PROMs)",
  "tipo": "Medida autoinformada",
  "poblaciones": "Con dolor",
  "descripcion": "Escala numérica 0-10 del dolor ahora, medio y peor de los últimos 7 días, más localización. Estándar universal de seguimiento entre sesiones.",
  "resultado": "3 valores 0-10; ≥4 dolor clínicamente relevante",
  "tiempo": "1 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Downie et al. 1978 · estándar internacional (uso libre)",
  "encuadre": "Ya en app SC; seguimiento del dolor percibido, no diagnóstico.",
  "reglaUso": "Cualquier cliente con dolor; se repite en el check-in semanal.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "zona",
    "label": "Zona de la molestia",
    "type": "text"
   },
   {
    "id": "actual",
    "label": "Dolor ahora (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10,
    "required": true
   },
   {
    "id": "peor",
    "label": "Peor dolor última semana (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10
   },
   {
    "id": "medio",
    "label": "Dolor medio última semana (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "actual_gte": 7
    },
    "nivel": "alerta",
    "texto": "Dolor intenso comunicado → adaptar la sesión y valorar recomendación de consulta con profesional sanitario."
   }
  ]
 },
{
  "id": "escala_funcional_personalizada_koko",
  "nombre": "Escala funcional personalizada KoKo (interna)",
  "categoria": "5. Dolor y función (PROMs)",
  "tipo": "Formulario interno",
  "poblaciones": "Con dolor, Todos",
  "descripcion": "La persona selecciona hasta tres actividades concretas que le resultan importantes y puntúa su capacidad actual de 0 a 10. Permite seguir cambios relevantes para ella sin utilizar cuestionarios con licencia.",
  "resultado": "Media 0-10 y puntuación individual por actividad; mayor puntuación = mejor capacidad",
  "tiempo": "3-5 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Protocolo interno KoKo; comparación intraindividual",
  "encuadre": "Medida funcional personalizada no diagnóstica. Se interpreta por evolución de la propia persona, no por baremos poblacionales.",
  "reglaUso": "Cualquier cliente con dolor o limitación. Elegir actividades concretas, observables y relevantes para su vida.",
  "implementacion": "campos",
  "enInforme": true,
  "pairedFields": [["act2", "act2_p"], ["act3", "act3_p"]],
  "fields": [
    { "id": "act1", "label": "Actividad 1 que le cuesta", "type": "text", "required": true, "help": "Ejemplo: subir dos plantas, coger a su hijo, dormir de lado." },
    { "id": "act1_p", "label": "Capacidad actividad 1 (0 = incapaz, 10 = sin limitación)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "act2", "label": "Actividad 2 (opcional)", "type": "text" },
    { "id": "act2_p", "label": "Capacidad actividad 2 (0-10)", "type": "escala", "min": 0, "max": 10 },
    { "id": "act3", "label": "Actividad 3 (opcional)", "type": "text" },
    { "id": "act3_p", "label": "Capacidad actividad 3 (0-10)", "type": "escala", "min": 0, "max": 10 },
    { "id": "obs", "label": "Observaciones del entrenador", "type": "observacion" }
  ],
  "computed": [
    { "id": "media_funcional", "label": "Capacidad funcional media", "formula": "media", "inputs": ["act1_p", "act2_p", "act3_p"], "max": 10 }
  ]
},
{
  "id": "rmdq_24_roland_morris",
  "nombre": "Roland-Morris RMDQ-24 (versión española)",
  "categoria": "5. Dolor y función (PROMs)",
  "tipo": "Cuestionario",
  "poblaciones": "Lumbar, Con dolor",
  "descripcion": "Cuestionario de 24 afirmaciones sobre cómo el dolor lumbar afecta a las actividades cotidianas hoy. Se marca Sí o No en cada afirmación.",
  "resultado": "0-24; mayor puntuación = mayor limitación funcional relacionada con la espalda",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Versión española de Fundación Kovacs: Kovacs et al., Spine 2002;27:538-542. Uso clínico libre con atribución.",
  "encuadre": "Seguimiento funcional del dolor lumbar; no mide la intensidad del dolor ni establece un diagnóstico.",
  "reglaUso": "Solo dolor lumbar tras cribado de seguridad. Repetir en reevaluación y comparar con la puntuación inicial.",
  "implementacion": "items",
  "enInforme": true
},
{
  "id": "confianza_movimiento_koko",
  "nombre": "Confianza para moverse KoKo (interna)",
  "categoria": "5. Dolor y función (PROMs)",
  "tipo": "Formulario interno",
  "poblaciones": "Con dolor, Miedo al movimiento",
  "descripcion": "Escala original de confianza para realizar movimientos o ejercicio pese a la molestia, acompañada de una pregunta abierta sobre el movimiento que más preocupa.",
  "resultado": "Confianza 0-10; mayor puntuación = mayor confianza",
  "tiempo": "2 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Protocolo interno KoKo",
  "encuadre": "Orienta la progresión, la comunicación y la exposición gradual. No mide ni diagnostica kinesiofobia.",
  "reglaUso": "Usar cuando la persona evita movimientos por miedo o expresa inseguridad ante el ejercicio.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
    { "id": "confianza", "label": "¿Qué confianza tienes para moverte y hacer ejercicio de forma adaptada? (0 = ninguna, 10 = total)", "type": "escala", "min": 0, "max": 10, "required": true },
    { "id": "movimiento_preocupa", "label": "Movimiento o actividad que más te preocupa (opcional)", "type": "text" },
    { "id": "motivo", "label": "¿Qué temes que pueda ocurrir? (opcional)", "type": "text" },
    { "id": "obs", "label": "Observaciones del entrenador", "type": "observacion" }
  ],
  "computed": [
    { "id": "confianza_movimiento", "label": "Confianza para moverse", "formula": "identidad", "inputs": ["confianza"], "max": 10 }
  ],
  "interpret": [
    { "when": { "confianza_lte": 3 }, "nivel": "aviso", "texto": "Confianza baja: comenzar con tareas muy tolerables, objetivos claros y progresión consensuada." }
  ]
},
{
  "id": "csi_parte_a_sensibilizacion_central",
  "nombre": "CSI parte A (sensibilización central)",
  "categoria": "5. Dolor y función (PROMs)",
  "tipo": "Cuestionario",
  "poblaciones": "Dolor persistente",
  "descripcion": "25 ítems de frecuencia 0-4 sobre síntomas asociados a sensibilización central (sueño, fatiga, sensibilidad, ánimo…).",
  "resultado": "0-100; ≥40 sospecha de sensibilización",
  "tiempo": "8-10 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Mayer et al. 2012, Pain Practice · versión española Cuesta-Vargas et al. 2016",
  "encuadre": "Ya en app SC; cribado → puntuaciones altas: expectativas realistas y derivación.",
  "reglaUso": "Solo dolor persistente con señales difusas (sueño, fatiga, sensibilidad). Ya en app.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "total",
    "label": "Puntuación total (0-100)",
    "type": "number",
    "min": 0,
    "max": 100,
    "required": true,
    "help": "Parte A: 25 ítems, rango 0-100. Umbral habitual ≥40 como indicio de sensibilización central. Instrumento con copyright: requiere permiso de los autores."
   },
   {
    "id": "fecha_casa",
    "label": "Fecha en que lo completó el cliente",
    "type": "date"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "total_gte": 40
    },
    "nivel": "aviso",
    "texto": "CSI ≥40: sensibilidad aumentada del sistema; progresión suave, educación y evitar provocar picos de dolor."
   }
  ]
 },
{
  "id": "cuestionario_koko_de_suelo_pelvico_al_en",
  "nombre": "Cuestionario Koko de suelo pélvico al entrenar (interno)",
  "categoria": "6. Salud femenina",
  "tipo": "Cuestionario",
  "poblaciones": "Menopausia, Mujer 40+, Postparto",
  "descripcion": "5-6 ítems sí/no orientados a la sala: pérdidas al saltar/toser/levantar peso, sensación de pesadez o bulto, urgencia, dolor pélvico con ejercicio, revisión de suelo pélvico previa.",
  "resultado": "Señales sí/no → adaptaciones inmediatas de programación",
  "tiempo": "2 min",
  "materiales": "Ninguno",
  "donde": "Centro",
  "referencia": "Protocolo interno Koko",
  "encuadre": "Cribado interno → señales: quitar impacto/valsalva y derivar a fisio de suelo pélvico.",
  "reglaUso": "Chequeo rápido EN SALA antes de bloques de impacto/carga; si aparecen síntomas, adaptar y recomendar valoración por fisioterapia de suelo pélvico.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "perdidas_impacto",
    "label": "¿Pérdidas de orina al saltar/correr/estornudar?",
    "type": "select",
    "options": [
     "No",
     "A veces",
     "Con frecuencia"
    ],
    "required": true
   },
   {
    "id": "pesadez",
    "label": "¿Sensación de pesadez o bulto vaginal al entrenar?",
    "type": "select",
    "options": [
     "No",
     "A veces",
     "Con frecuencia"
    ],
    "required": true
   },
   {
    "id": "dolor_pelvico",
    "label": "¿Dolor pélvico con esfuerzo?",
    "type": "select",
    "options": [
     "No",
     "A veces",
     "Con frecuencia"
    ]
   },
   {
    "id": "parto_12m",
    "label": "¿Parto en los últimos 12 meses?",
    "type": "select",
    "options": [
     "No",
     "Sí"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "perdidas_impacto": "Con frecuencia"
    },
    "nivel": "alerta",
    "texto": "Síntomas frecuentes → evitar impacto de momento y recomendar valoración con fisioterapeuta de suelo pélvico."
   },
   {
    "when": {
     "pesadez": "Con frecuencia"
    },
    "nivel": "alerta",
    "texto": "Sensación de pesadez frecuente → evitar cargas con Valsalva e impacto; recomendable valoración especializada."
   }
  ]
 },
{
  "id": "get_active_questionnaire_for_pregnancy_c",
  "nombre": "Get Active Questionnaire for Pregnancy (CSEP)",
  "categoria": "6. Salud femenina",
  "tipo": "Cuestionario",
  "poblaciones": "Embarazo (Koko MAMÁ)",
  "descripcion": "Cuestionario autoadministrado de cribado de contraindicaciones para ejercitarse durante el embarazo; sustituye al antiguo PARmed-X for Pregnancy.",
  "resultado": "Apta para ejercicio / necesita autorización de su profesional sanitario",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Canadian Society for Exercise Physiology · csep.ca (descarga libre)",
  "encuadre": "Cribado de seguridad → cualquier señal: autorización sanitaria antes de entrenar.",
  "reglaUso": "Obligatorio antes de la primera sesión en embarazo.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "resultado",
    "label": "Resultado del GAQ-P",
    "type": "select",
    "options": [
     "Sin contraindicación comunicada",
     "Requiere consulta con profesional sanitario"
    ],
    "required": true
   },
   {
    "id": "semana",
    "label": "Semana de gestación",
    "type": "number",
    "min": 4,
    "max": 42,
    "help": "Semanas completas de gestación en el momento de la valoración.",
    "unit": "semanas"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "cuestionario_postparto_koko_mama_interno",
  "nombre": "Cuestionario postparto Koko MAMÁ (interno)",
  "categoria": "6. Salud femenina",
  "tipo": "Formulario",
  "poblaciones": "Postparto",
  "descripcion": "Semanas postparto, tipo de parto, diástasis conocida o percibida, revisión de suelo pélvico realizada sí/no, lactancia, sueño, alta médica para ejercicio.",
  "resultado": "Perfil postparto → puerta de entrada al programa",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Centro",
  "referencia": "Protocolo interno Koko MAMÁ",
  "encuadre": "Recogida de información + derivación a fisio de suelo pélvico si señales; exigir alta/autorización cuando proceda.",
  "reglaUso": "Obligatorio en Koko MAMÁ postparto; exigir alta/autorización cuando proceda.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "semanas_pp",
    "label": "Semanas postparto",
    "type": "number",
    "min": 0,
    "max": 104,
    "required": true,
    "help": "Semanas transcurridas desde el parto.",
    "unit": "semanas"
   },
   {
    "id": "tipo_parto",
    "label": "Tipo de parto",
    "type": "select",
    "options": [
     "Vaginal",
     "Instrumental",
     "Cesárea"
    ]
   },
   {
    "id": "revision6s",
    "label": "¿Revisión postparto realizada?",
    "type": "select",
    "options": [
     "Sí",
     "No"
    ],
    "required": true
   },
   {
    "id": "sintomas_pelvicos",
    "label": "¿Pérdidas, pesadez o dolor pélvico?",
    "type": "select",
    "options": [
     "No",
     "Sí"
    ]
   },
   {
    "id": "diastasis",
    "label": "Diástasis comunicada o sospechada",
    "type": "select",
    "options": [
     "No",
     "Sí",
     "No sabe"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "revision6s": "No"
    },
    "nivel": "aviso",
    "texto": "Sin revisión postparto → trabajo suave y recomendar completar la revisión antes de progresar."
   }
  ]
 },
{
  "id": "diario_de_sofocos_y_sintomas_interno",
  "nombre": "Diario de sofocos y síntomas (interno)",
  "categoria": "6. Salud femenina",
  "tipo": "Registro en casa",
  "poblaciones": "Menopausia",
  "descripcion": "Registro diario simple: nº de sofocos, intensidad 0-10, calidad de sueño 0-10 y nota libre. 1-2 semanas antes y después de bloques de entrenamiento.",
  "resultado": "Tendencia de síntomas vs. entrenamiento",
  "tiempo": "7-14 días (1 min/día)",
  "materiales": "Harbiz o formulario",
  "donde": "Casa",
  "referencia": "Protocolo interno Koko",
  "encuadre": "Seguimiento de síntomas percibidos; no tratamiento.",
  "reglaUso": "Solo si MRS alta o la clienta quiere objetivar; 1-2 semanas por bloque.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "sofocos_dia",
    "label": "Sofocos/día (media semanal)",
    "type": "number",
    "min": 0,
    "max": 50,
    "help": "Media de sofocos por día durante la última semana, según el diario de la clienta.",
    "unit": "sofocos/día"
   },
   {
    "id": "sueno_afectado",
    "label": "¿Sueño afectado por síntomas?",
    "type": "select",
    "options": [
     "No",
     "A veces",
     "Con frecuencia"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "sppb_short_physical_performance_battery",
  "nombre": "SPPB (Short Physical Performance Battery)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física (batería)",
  "poblaciones": "60+",
  "descripcion": "Batería de 3 partes: equilibrio (pies juntos, semitándem y tándem 10 s cada), velocidad de marcha 4 m a paso habitual, y 5 veces levantarse de la silla sin brazos. Estándar de oro en función física del mayor.",
  "resultado": "0-12 puntos; <10 riesgo de limitación funcional",
  "tiempo": "8-10 min",
  "materiales": "Silla 43-45 cm, cronómetro, pasillo 4 m",
  "donde": "Centro",
  "referencia": "Guralnik et al. 1994, J Gerontology (uso libre)",
  "encuadre": "Apto EP: condición física funcional; puntuaciones muy bajas → recomendar valoración médica.",
  "reglaUso": "Batería de referencia en 60+. INCLUYE equilibrio progresivo, marcha 4 m y 5×levantarse: no repetirlos por separado.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "equilibrio",
    "label": "Equilibrio (0-4)",
    "type": "number",
    "min": 0,
    "max": 4,
    "required": true,
    "help": "Pies juntos, semitándem, tándem"
   },
   {
    "id": "marcha",
    "label": "Marcha 4 m (0-4)",
    "type": "number",
    "min": 0,
    "max": 4,
    "required": true,
    "help": "Subescala de velocidad de marcha en 4 metros, de 0 (no lo completa) a 4 (más rápido).",
    "unit": "de 0 a 4"
   },
   {
    "id": "silla",
    "label": "5 levantadas de silla (0-4)",
    "type": "number",
    "min": 0,
    "max": 4,
    "required": true,
    "help": "Subescala de 5 levantadas de silla, de 0 (no lo completa) a 4 (más rápido).",
    "unit": "de 0 a 4"
   },
   {
    "id": "marcha_seg",
    "label": "Tiempo marcha 4 m",
    "type": "number",
    "unit": "s",
    "step": 0.1
   },
   {
    "id": "silla_seg",
    "label": "Tiempo 5 levantadas",
    "type": "number",
    "unit": "s",
    "step": 0.1
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "total",
    "label": "SPPB total",
    "formula": "suma3",
    "inputs": [
     "equilibrio",
     "marcha",
     "silla"
    ],
    "max": 12
   }
  ],
  "interpret": [
   {
    "when": {
     "total_lte": 6
    },
    "nivel": "alerta",
    "texto": "SPPB ≤6: limitación importante → programa de función básica y valorar recomendación de consulta sanitaria."
   },
   {
    "when": {
     "total_between": [
      7,
      9
     ]
    },
    "nivel": "aviso",
    "texto": "SPPB 7-9: rendimiento intermedio; margen claro de mejora con fuerza y equilibrio."
   }
  ]
 },
{
  "id": "tug_timed_up_and_go",
  "nombre": "TUG (Timed Up and Go)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física",
  "poblaciones": "60+",
  "descripcion": "Levantarse de una silla, andar 3 m, girar, volver y sentarse, cronometrado.",
  "resultado": "Segundos; ≥13,5 s riesgo de caídas",
  "tiempo": "3 min",
  "materiales": "Silla con respaldo, cono, cronómetro",
  "donde": "Centro",
  "referencia": "Podsiadlo & Richardson 1991, J Am Geriatr Soc",
  "encuadre": "Ya en app SC; riesgo alto → derivación recomendada.",
  "reglaUso": "Cribado rápido de caídas en 60+ cuando NO se hace el SPPB completo. Ya en app.",
  "implementacion": "items",
  "enInforme": true
 },
{
  "id": "sts_30_sentadillas_en_30_s",
  "nombre": "STS-30 (sentadillas en 30 s)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física",
  "poblaciones": "60+, Todos",
  "descripcion": "Máximas repeticiones de sentarse-levantarse en 30 s, brazos cruzados. Parte del Senior Fitness Test.",
  "resultado": "Repeticiones; baremos por edad/sexo (Rikli & Jones)",
  "tiempo": "2 min",
  "materiales": "Silla 43 cm sin brazos, cronómetro",
  "donde": "Ambos",
  "referencia": "Rikli & Jones 1999, J Aging Phys Act (Senior Fitness Test)",
  "encuadre": "Ya en app SC.",
  "reglaUso": "Fuerza funcional de piernas para todos; en 60+ con baremos SFT. Preferido sobre 5STS. Ya en app.",
  "implementacion": "items",
  "enInforme": true
 },
{
  "id": "arm_curl_30_s_flexiones_de_codo",
  "nombre": "Arm curl 30 s (flexiones de codo)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física",
  "poblaciones": "60+",
  "descripcion": "Máximas flexiones de codo en 30 s con mancuerna: 2,3 kg mujeres / 3,6 kg hombres, sentado. Parte del Senior Fitness Test.",
  "resultado": "Repeticiones; baremos por edad/sexo",
  "tiempo": "2 min",
  "materiales": "Mancuernas 2,3 y 3,6 kg, silla, cronómetro",
  "donde": "Centro",
  "referencia": "Rikli & Jones 1999 (Senior Fitness Test)",
  "encuadre": "Apto EP: fuerza de miembro superior.",
  "reglaUso": "Solo 60+ (baremos SFT).",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "reps",
    "label": "Repeticiones en 30 s",
    "type": "number",
    "min": 0,
    "max": 50,
    "required": true,
    "help": "Mancuerna 2,3 kg mujer / 3,6 kg hombre"
   },
   {
    "id": "brazo",
    "label": "Brazo evaluado",
    "type": "select",
    "options": [
     "Derecho",
     "Izquierdo"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "2_minute_step_test_marcha_en_el_sitio",
  "nombre": "2-minute step test (marcha en el sitio)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física",
  "poblaciones": "60+, casa",
  "descripcion": "Pasos en el sitio durante 2 min elevando la rodilla a la altura media entre rótula y cresta ilíaca; se cuentan las veces que sube la rodilla derecha. Sustituto del 6MWT cuando no hay pasillo.",
  "resultado": "Nº de elevaciones; baremos por edad/sexo",
  "tiempo": "3 min",
  "materiales": "Marca en pared/cinta, cronómetro",
  "donde": "Ambos",
  "referencia": "Rikli & Jones 1999 (Senior Fitness Test)",
  "encuadre": "Apto EP: capacidad aeróbica funcional; ideal para re-test en casa.",
  "reglaUso": "Aeróbico en 60+/descondicionados y para re-test en casa. Adulto en forma → YMCA.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "pasos",
    "label": "Elevaciones de rodilla derecha en 2 min",
    "type": "number",
    "min": 0,
    "max": 200,
    "required": true,
    "help": "Altura de rodilla: punto medio entre rótula y cresta ilíaca"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "back_scratch_manos_tras_la_espalda",
  "nombre": "Back scratch (manos tras la espalda)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física",
  "poblaciones": "60+",
  "descripcion": "Una mano por encima del hombro y otra por debajo por la espalda; se mide la distancia (o solapamiento) entre dedos medios, ambos lados.",
  "resultado": "cm (negativo = separación); baremos por edad/sexo",
  "tiempo": "2 min",
  "materiales": "Regla o cinta métrica",
  "donde": "Centro",
  "referencia": "Rikli & Jones 1999 (Senior Fitness Test)",
  "encuadre": "Apto EP: flexibilidad de hombro.",
  "reglaUso": "Solo 60+ (baremos SFT). En <60 usar puños tras espalda.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "dist_d",
    "label": "Distancia mano derecha arriba",
    "type": "number",
    "unit": "cm",
    "min": -40,
    "max": 15,
    "step": 0.5,
    "help": "Negativo = no llegan a tocarse"
   },
   {
    "id": "dist_i",
    "label": "Distancia mano izquierda arriba",
    "type": "number",
    "unit": "cm",
    "min": -40,
    "max": 15,
    "step": 0.5
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "chair_sit_and_reach",
  "nombre": "Chair sit-and-reach",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física",
  "poblaciones": "60+",
  "descripcion": "Sentado al borde de la silla con una pierna extendida, alcanzar con las manos la punta del pie; se mide la distancia dedos-punta del pie.",
  "resultado": "cm; baremos por edad/sexo",
  "tiempo": "2 min",
  "materiales": "Silla, regla",
  "donde": "Centro",
  "referencia": "Rikli & Jones 1999 (Senior Fitness Test)",
  "encuadre": "Apto EP: flexibilidad de cadena posterior.",
  "reglaUso": "Solo 60+.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "dist_d",
    "label": "Pierna derecha",
    "type": "number",
    "unit": "cm",
    "min": -40,
    "max": 25,
    "step": 0.5,
    "help": "Negativo = no llega a la puntera"
   },
   {
    "id": "dist_i",
    "label": "Pierna izquierda",
    "type": "number",
    "unit": "cm",
    "min": -40,
    "max": 25,
    "step": 0.5
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "tinetti_poma_t",
  "nombre": "Tinetti POMA-T",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Observacional",
  "poblaciones": "60+",
  "descripcion": "Evaluación observacional del entrenador: 9 ítems de equilibrio (sentado, levantarse, empujón, ojos cerrados, giro 360°) y 8 de marcha (inicio, longitud, simetría, trayectoria, tronco).",
  "resultado": "0-28; <19 alto riesgo de caídas, 19-23 riesgo moderado",
  "tiempo": "10 min",
  "materiales": "Silla sin brazos, pasillo",
  "donde": "Centro",
  "referencia": "Tinetti 1986, J Am Geriatr Soc",
  "encuadre": "Ya en app SC; observacional, riesgo alto → derivación.",
  "reglaUso": "Solo si TUG/SPPB señalan riesgo o hay historia de caídas. Ya en app.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "equilibrio",
    "label": "Subescala equilibrio (0-16)",
    "type": "number",
    "min": 0,
    "max": 16,
    "required": true,
    "help": "Subescala de equilibrio del POMA, de 0 a 16 puntos.",
    "unit": "de 0 a 16"
   },
   {
    "id": "marcha",
    "label": "Subescala marcha (0-12)",
    "type": "number",
    "min": 0,
    "max": 12,
    "required": true,
    "help": "Subescala de marcha del POMA, de 0 a 12 puntos.",
    "unit": "de 0 a 12"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "total",
    "label": "Tinetti total",
    "formula": "suma2",
    "inputs": [
     "equilibrio",
     "marcha"
    ],
    "max": 28
   }
  ],
  "interpret": [
   {
    "when": {
     "total_lte": 18
    },
    "nivel": "alerta",
    "texto": "Tinetti ≤18: riesgo alto de caída → trabajo supervisado y recomendable valoración sanitaria."
   },
   {
    "when": {
     "total_between": [
      19,
      23
     ]
    },
    "nivel": "aviso",
    "texto": "Tinetti 19-23: riesgo moderado de caída; priorizar equilibrio y fuerza de piernas."
   }
  ]
 },
{
  "id": "short_fes_i_miedo_a_caerse",
  "nombre": "Short FES-I (miedo a caerse)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Cuestionario",
  "poblaciones": "60+",
  "descripcion": "7 ítems 1-4 sobre preocupación por caerse al realizar actividades cotidianas (vestirse, ducharse, escaleras, salir a la calle…). Versión larga de 16 ítems disponible.",
  "resultado": "7-28; ≥11 preocupación alta",
  "tiempo": "3-5 min",
  "materiales": "Ninguno",
  "donde": "Casa",
  "referencia": "Yardley et al. 2005, Age and Ageing (ProFaNE, uso libre)",
  "encuadre": "Percepción de miedo a caer; orienta trabajo de equilibrio y confianza.",
  "reglaUso": "Solo 60+ con caídas previas o miedo declarado.",
  "implementacion": "items",
  "enInforme": true,
  "fields": [],
  "interpret": [
   {
    "when": {
     "total_gte": 14
    },
    "nivel": "aviso",
    "texto": "Preocupación elevada por caerse; exposición gradual y trabajo de confianza."
   }
  ]
 },
{
  "id": "sitting_rising_test_srt_levantarse_del_s",
  "nombre": "Sitting-Rising Test (SRT, levantarse del suelo)",
  "categoria": "7. Adulto mayor — función",
  "tipo": "Prueba física",
  "poblaciones": "60+, Todos",
  "descripcion": "Sentarse en el suelo y levantarse usando los mínimos apoyos posibles. Se parte de 5+5 puntos y se resta 1 por cada apoyo (mano, rodilla, antebrazo) y 0,5 por pérdida de equilibrio.",
  "resultado": "0-10; asociado a mortalidad y función global",
  "tiempo": "2 min",
  "materiales": "Esterilla",
  "donde": "Ambos",
  "referencia": "Brito, Araújo et al. 2014, Eur J Prev Cardiol",
  "encuadre": "Apto EP: función global; muy vistoso para clientes y re-test.",
  "reglaUso": "Todos. Si el cliente hace el Circuito Koko, NO repetir (ya está incluido).",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "bajar",
    "label": "Puntos al sentarse (0-5)",
    "type": "number",
    "min": 0,
    "max": 5,
    "step": 0.5,
    "required": true,
    "help": "Restar 1 por cada apoyo, 0,5 por pérdida de equilibrio"
   },
   {
    "id": "subir",
    "label": "Puntos al levantarse (0-5)",
    "type": "number",
    "min": 0,
    "max": 5,
    "step": 0.5,
    "required": true,
    "help": "Se parte de 5 puntos y se resta 1 por cada apoyo usado (mano, rodilla, antebrazo, lateral de la pierna) y 0,5 por pérdida evidente de equilibrio.",
    "unit": "de 0 a 5"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "total",
    "label": "SRT total",
    "formula": "suma2",
    "inputs": [
     "bajar",
     "subir"
    ],
    "max": 10
   }
  ]
 },
{
  "id": "ymca_3_minute_step_test",
  "nombre": "YMCA 3-minute step test",
  "categoria": "8. Capacidad aeróbica",
  "tipo": "Prueba física",
  "poblaciones": "General adulto",
  "descripcion": "Subir y bajar un step de 30,5 cm a 96 ppm (metrónomo) durante 3 min; al acabar, sentarse y contar FC durante 1 min completo.",
  "resultado": "FC de recuperación (lpm); baremos por edad/sexo",
  "tiempo": "5 min",
  "materiales": "Step 30,5 cm, metrónomo (app), cronómetro, pulsómetro opcional",
  "donde": "Centro",
  "referencia": "Golding et al., YMCA Fitness Testing and Assessment Manual",
  "encuadre": "Apto EP: aeróbico submáximo sencillo y rápido.",
  "reglaUso": "Aeróbico por defecto en adulto <60. La FC del minuto de recuperación ES el resultado.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "fc_rec",
    "label": "FC 1 min tras acabar (sentado)",
    "type": "number",
    "unit": "lpm",
    "min": 40,
    "max": 220,
    "required": true,
    "help": "Step 30,5 cm · 24 pasos/min · 3 minutos · metrónomo 96"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "fc_de_recuperacion_1_min_hrr",
  "nombre": "FC de recuperación 1 min (HRR)",
  "categoria": "8. Capacidad aeróbica",
  "tipo": "Medida",
  "poblaciones": "Todos",
  "descripcion": "Tras un esfuerzo estandarizado (p. ej. final del step test o 6MWT), medir la caída de FC en el primer minuto de recuperación pasiva.",
  "resultado": "lpm de caída; ≤12 lpm merece atención",
  "tiempo": "2 min",
  "materiales": "Pulsómetro",
  "donde": "Centro",
  "referencia": "Cole et al. 1999, New England Journal of Medicine",
  "encuadre": "Medida informativa de recuperación; valores llamativos repetidos → recomendar consulta.",
  "reglaUso": "Se toma tras el YMCA u otro esfuerzo estandarizado; no es prueba independiente.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "fc_pico",
    "label": "FC al terminar el esfuerzo",
    "type": "number",
    "unit": "lpm",
    "min": 60,
    "max": 220,
    "required": true
   },
   {
    "id": "fc_1min",
    "label": "FC al minuto de parar",
    "type": "number",
    "unit": "lpm",
    "min": 40,
    "max": 220,
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "hrr",
    "label": "Recuperación 1 min",
    "formula": "resta",
    "inputs": [
     "fc_pico",
     "fc_1min"
    ],
    "unit": "lpm"
   }
  ],
  "interpret": [
   {
    "when": {
     "hrr_lte": 12
    },
    "nivel": "aviso",
    "texto": "Recuperación ≤12 lpm: dato a tener en cuenta; si se repite, recomendable comentarlo con profesional sanitario."
   }
  ]
 },
{
  "id": "talk_test",
  "nombre": "Talk test",
  "categoria": "8. Capacidad aeróbica",
  "tipo": "Prueba práctica",
  "poblaciones": "Todos",
  "descripcion": "Durante esfuerzo continuo, comprobar si puede hablar frases completas (moderado), frases cortas (umbral) o no puede hablar (vigoroso). Educativo para autorregular intensidad.",
  "resultado": "Zona de intensidad práctica",
  "tiempo": "Durante la sesión",
  "materiales": "Ninguno",
  "donde": "Ambos",
  "referencia": "Persinger, Foster et al. 2004, Med Sci Sports Exerc",
  "encuadre": "Apto EP: educación de intensidad.",
  "reglaUso": "Educativo durante las primeras sesiones; sin puntuación.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "resultado",
    "label": "¿Puede hablar con frases completas durante el esfuerzo?",
    "type": "select",
    "options": [
     "Sí, cómodo (Z1-Z2)",
     "Con esfuerzo (Z3)",
     "No, solo palabras sueltas (Z4+)"
    ],
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "dinamometria_manual_fuerza_prensil",
  "nombre": "Dinamometría manual (fuerza prensil)",
  "categoria": "9. Fuerza y potencia",
  "tipo": "Medida",
  "poblaciones": "Todos",
  "descripcion": "3 intentos por mano alternando, codo a 90°, 30 s de descanso; se registra el máximo de cada mano y la asimetría.",
  "resultado": "kg máximo + asimetría %; puntos de corte EWGSOP2: <16 kg mujer / <27 kg hombre",
  "tiempo": "5 min",
  "materiales": "Dinamómetro de mano (Camry ~35 € / Jamar ~300-400 €)",
  "donde": "Centro",
  "referencia": "Roberts et al. 2011, Age Ageing (protocolo Southampton) · Cruz-Jentoft et al. 2019 (EWGSOP2)",
  "encuadre": "Ya en app SC; por debajo del corte → recomendar valoración médica (posible sarcopenia).",
  "reglaUso": "Universal. Prioritaria si el cribado interno de autonomía y fuerza muestra dificultades.",
  "implementacion": "items",
  "enInforme": true
 },
{
  "id": "estimacion_de_1rm_submaxima_basicos",
  "nombre": "Estimación de 1RM submáxima (básicos)",
  "categoria": "9. Fuerza y potencia",
  "tipo": "Prueba física",
  "poblaciones": "Fitness/fuerza, General adulto",
  "descripcion": "Series de 3-8 repeticiones al fallo técnico en 2-3 básicos (press banca, sentadilla goblet o barra, remo, press militar, peso muerto) y estimación de 1RM con fórmula de Brzycki o Epley. Nunca 1RM directo en noveles.",
  "resultado": "1RM estimado por ejercicio (kg) → % de carga para programar",
  "tiempo": "15-20 min (2-3 ejercicios)",
  "materiales": "Material de sala habitual",
  "donde": "Centro",
  "referencia": "Brzycki 1993, JOPERD · Epley 1985",
  "encuadre": "Apto EP: valoración de fuerza estándar del entrenamiento.",
  "reglaUso": "Solo perfiles fuerza/fitness con técnica validada antes en el checklist Koko.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "ejercicio",
    "label": "Ejercicio",
    "type": "select",
    "options": [
     "Sentadilla",
     "Peso muerto",
     "Press banca",
     "Press militar",
     "Remo",
     "Otro"
    ],
    "required": true
   },
   {
    "id": "carga",
    "label": "Carga usada",
    "type": "number",
    "unit": "kg",
    "min": 1,
    "max": 300,
    "step": 0.5,
    "required": true
   },
   {
    "id": "reps",
    "label": "Repeticiones completadas (2-10)",
    "type": "number",
    "min": 1,
    "max": 12,
    "required": true,
    "unit": "reps"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "rm",
    "label": "1RM estimado (Epley)",
    "formula": "epley",
    "inputs": [
     "carga",
     "reps"
    ],
    "unit": "kg"
   }
  ]
 },
{
  "id": "push_up_test_flexiones",
  "nombre": "Push-up test (flexiones)",
  "categoria": "9. Fuerza y potencia",
  "tipo": "Prueba física",
  "poblaciones": "General adulto, Fitness/fuerza",
  "descripcion": "Máximas flexiones consecutivas con técnica válida y sin pausa; opción estándar o sobre rodillas (registrar variante).",
  "resultado": "Repeticiones; baremos ACSM por edad/sexo",
  "tiempo": "3 min",
  "materiales": "Esterilla",
  "donde": "Ambos",
  "referencia": "ACSM's Guidelines for Exercise Testing and Prescription (normas)",
  "encuadre": "Apto EP: resistencia de empuje.",
  "reglaUso": "Adulto general/fitness; registrar variante (estándar/rodillas).",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "modo",
    "label": "Modalidad",
    "type": "select",
    "options": [
     "Estándar",
     "Con rodillas",
     "Inclinada (banco)"
    ],
    "required": true
   },
   {
    "id": "reps",
    "label": "Repeticiones máximas sin pausa",
    "type": "number",
    "min": 0,
    "max": 100,
    "required": true,
    "unit": "reps"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "salto_cmj_con_app_my_jump",
  "nombre": "Salto CMJ con app (My Jump)",
  "categoria": "9. Fuerza y potencia",
  "tipo": "Prueba física",
  "poblaciones": "Fitness/fuerza, General adulto",
  "descripcion": "Salto con contramovimiento y manos en cadera; la app calcula la altura por tiempo de vuelo en vídeo a cámara lenta. 3 intentos, mejor marca.",
  "resultado": "Altura en cm; potencia de miembro inferior",
  "tiempo": "5 min",
  "materiales": "Smartphone + app My Jump (~11 €)",
  "donde": "Centro",
  "referencia": "Bosco et al. 1983 · validación app: Balsalobre-Fernández et al. 2015, J Sports Sciences",
  "encuadre": "Apto EP: potencia; evitar en dolor agudo de rodilla o suelo pélvico sintomático.",
  "reglaUso": "Perfil fitness. Evitar con dolor de rodilla o suelo pélvico sintomático. (Salto horizontal descartado por solape.)",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "altura",
    "label": "Altura CMJ (mejor de 3)",
    "type": "number",
    "unit": "cm",
    "min": 2,
    "max": 70,
    "step": 0.1,
    "required": true
   },
   {
    "id": "intentos",
    "label": "Intentos realizados",
    "type": "number",
    "min": 1,
    "max": 5,
    "help": "Número de saltos válidos realizados. Se registra el mejor.",
    "unit": "intentos"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "farmer_s_carry_koko_protocolo_interno",
  "nombre": "Farmer's carry Koko (protocolo interno)",
  "categoria": "9. Fuerza y potencia",
  "tipo": "Prueba física",
  "poblaciones": "General adulto, Fitness/fuerza",
  "descripcion": "Transporte con una mancuerna/kettlebell en cada mano a % del peso corporal definido (p. ej. 2×25 % PC): distancia máxima con postura correcta o tiempo en distancia fija de 20 m.",
  "resultado": "Metros o segundos; agarre + core + capacidad de carga real",
  "tiempo": "5 min",
  "materiales": "Mancuernas/kettlebells, pasillo 20 m",
  "donde": "Centro",
  "referencia": "Protocolo interno Koko (sin baremos publicados; comparación intra-sujeto)",
  "encuadre": "Apto EP: prueba funcional de marca; estandarizar carga y criterios para repetibilidad.",
  "reglaUso": "Fitness/general con % del peso corporal. En 60+ usar 'cargar la compra'.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "carga_total",
    "label": "Carga total (ambas manos)",
    "type": "number",
    "unit": "kg",
    "min": 2,
    "max": 150,
    "required": true
   },
   {
    "id": "distancia",
    "label": "Distancia completada",
    "type": "number",
    "unit": "m",
    "min": 1,
    "max": 100,
    "required": true
   },
   {
    "id": "tecnica",
    "label": "Postura mantenida",
    "type": "select",
    "options": [
     "Buena",
     "Aceptable",
     "Se degrada"
    ],
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "bateria_mcgill_flexores_srensen_puente_l",
  "nombre": "Batería McGill (flexores, Sørensen, puente lateral)",
  "categoria": "10. Resistencia muscular y core",
  "tipo": "Prueba física (batería)",
  "poblaciones": "Lumbar (no agudo), Fitness/fuerza",
  "descripcion": "3 tiempos isométricos: flexores de tronco a 55-60°, extensores (Biering-Sørensen en banco) y puente lateral derecho e izquierdo. Lo relevante son los ratios entre ellos (flex/ext <1; lateral/ext ~0,75; asimetría lateral <5 %).",
  "resultado": "Segundos por prueba + ratios de equilibrio muscular",
  "tiempo": "10-12 min",
  "materiales": "Banco, esterilla, cronómetro",
  "donde": "Centro",
  "referencia": "McGill, Childs & Liebenson 1999, Arch Phys Med Rehabil",
  "encuadre": "Apto EP: resistencia de tronco; no en dolor lumbar agudo.",
  "reglaUso": "Lumbar NO agudo y perfiles fuerza; los ratios importan más que los tiempos absolutos.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "flexores",
    "label": "Flexores de tronco",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 300,
    "required": true
   },
   {
    "id": "sorensen",
    "label": "Extensores (Sørensen)",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 300,
    "required": true
   },
   {
    "id": "lateral_d",
    "label": "Puente lateral derecho",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 200,
    "required": true
   },
   {
    "id": "lateral_i",
    "label": "Puente lateral izquierdo",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 200,
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "ratio_lat",
    "label": "Asimetría lateral",
    "formula": "asimetria",
    "inputs": [
     "lateral_d",
     "lateral_i"
    ],
    "unit": "%"
   }
  ],
  "interpret": [
   {
    "when": {
     "ratio_lat_gte": 20
    },
    "nivel": "aviso",
    "texto": "Asimetría lateral >20%: dato a trabajar con progresión unilateral."
   }
  ]
 },
{
  "id": "wall_sit_sentadilla_isometrica_en_pared",
  "nombre": "Wall sit (sentadilla isométrica en pared)",
  "categoria": "10. Resistencia muscular y core",
  "tipo": "Prueba física",
  "poblaciones": "General adulto",
  "descripcion": "Mantener sentadilla a 90° con espalda en la pared hasta el fallo o pérdida de posición.",
  "resultado": "Segundos; comparación intra-sujeto",
  "tiempo": "2 min",
  "materiales": "Pared, cronómetro",
  "donde": "Ambos",
  "referencia": "Uso extendido (valores orientativos)",
  "encuadre": "Apto EP: resistencia de cuádriceps; precaución en dolor femoropatelar.",
  "reglaUso": "Resistencia isométrica de piernas; precaución femoropatelar. Pieza del re-test en casa.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "tiempo",
    "label": "Tiempo mantenido",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 300,
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "sentadillas_maximas_en_1_min_interno",
  "nombre": "Sentadillas máximas en 1 min (interno)",
  "categoria": "10. Resistencia muscular y core",
  "tipo": "Prueba física",
  "poblaciones": "General adulto",
  "descripcion": "Máximas sentadillas libres con técnica válida (profundidad y criterios definidos) en 60 s.",
  "resultado": "Repeticiones; comparación intra-sujeto",
  "tiempo": "2 min",
  "materiales": "Cronómetro",
  "donde": "Ambos",
  "referencia": "Protocolo interno Koko",
  "encuadre": "Apto EP: resistencia de miembro inferior; útil como re-test en casa por vídeo.",
  "reglaUso": "Resistencia dinámica de piernas; pieza del re-test en casa por vídeo.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "reps",
    "label": "Repeticiones en 60 s",
    "type": "number",
    "min": 0,
    "max": 80,
    "required": true,
    "unit": "reps"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "puente_de_gluteo_unilateral_a_fatiga_int",
  "nombre": "Puente de glúteo unilateral a fatiga (interno)",
  "categoria": "10. Resistencia muscular y core",
  "tipo": "Prueba física",
  "poblaciones": "General adulto, Rodilla/cadera",
  "descripcion": "Repeticiones de puente a una pierna con pelvis nivelada hasta fallo técnico o fatiga referida ≥8/10, por lado.",
  "resultado": "Reps por lado + asimetría",
  "tiempo": "3 min",
  "materiales": "Esterilla",
  "donde": "Ambos",
  "referencia": "Protocolo interno Koko (inspirado en pruebas clínicas de glúteo)",
  "encuadre": "Apto EP: resistencia y simetría de cadena posterior.",
  "reglaUso": "Con asimetrías de cadera/rodilla o cadena posterior floja.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "reps_d",
    "label": "Repeticiones pierna derecha",
    "type": "number",
    "min": 0,
    "max": 60,
    "required": true,
    "unit": "reps"
   },
   {
    "id": "reps_i",
    "label": "Repeticiones pierna izquierda",
    "type": "number",
    "min": 0,
    "max": 60,
    "required": true,
    "unit": "reps"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "asim",
    "label": "Asimetría",
    "formula": "asimetria",
    "inputs": [
     "reps_d",
     "reps_i"
    ],
    "unit": "%"
   }
  ]
 },
{
  "id": "knee_to_wall_dorsiflexion_de_tobillo",
  "nombre": "Knee-to-wall (dorsiflexión de tobillo)",
  "categoria": "11. Movilidad y flexibilidad",
  "tipo": "Prueba física",
  "poblaciones": "Todos, Rodilla",
  "descripcion": "En zancada, acercar la rodilla a la pared sin levantar el talón; se mide la distancia máxima del dedo gordo a la pared. Ambos lados.",
  "resultado": "cm por lado; asimetría >1,5-2 cm relevante",
  "tiempo": "3 min",
  "materiales": "Cinta métrica, pared",
  "donde": "Ambos",
  "referencia": "Bennell et al. 1998, Aust J Physiotherapy",
  "encuadre": "Apto EP: movilidad de tobillo, clave para sentadilla y escaleras.",
  "reglaUso": "Universal; clave si la sentadilla profunda sale limitada.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "dist_d",
    "label": "Distancia dedo-pared derecha",
    "type": "number",
    "unit": "cm",
    "min": 0,
    "max": 25,
    "step": 0.5,
    "required": true
   },
   {
    "id": "dist_i",
    "label": "Distancia dedo-pared izquierda",
    "type": "number",
    "unit": "cm",
    "min": 0,
    "max": 25,
    "step": 0.5,
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "diff_gte_2": [
      "dist_d",
      "dist_i"
     ]
    },
    "nivel": "aviso",
    "texto": "Diferencia ≥2 cm entre tobillos: asimetría a trabajar; relevante en sentadilla y zancadas."
   }
  ]
 },
{
  "id": "movilidad_de_hombro_punos_tras_la_espald",
  "nombre": "Movilidad de hombro (puños tras la espalda)",
  "categoria": "11. Movilidad y flexibilidad",
  "tipo": "Observacional / medida",
  "poblaciones": "Todos",
  "descripcion": "Un puño sobre el hombro y otro bajo la espalda; se mide la distancia entre puños y se compara con la longitud de la mano. Ambos lados.",
  "resultado": "0-3 según criterios; distancia en cm",
  "tiempo": "3 min",
  "materiales": "Cinta métrica",
  "donde": "Centro",
  "referencia": "Adaptado de Cook et al. 2006, NAJSPT",
  "encuadre": "Ya en app SC (FMS-3); dolor = 0 y derivar.",
  "reglaUso": "Adultos <60 (ya en app). En 60+ → back scratch.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "dist_d",
    "label": "Distancia entre puños (dcha arriba)",
    "type": "number",
    "unit": "cm",
    "min": 0,
    "max": 60,
    "step": 0.5
   },
   {
    "id": "dist_i",
    "label": "Distancia entre puños (izda arriba)",
    "type": "number",
    "unit": "cm",
    "min": 0,
    "max": 60,
    "step": 0.5
   },
   {
    "id": "dolor",
    "label": "¿Dolor durante la prueba?",
    "type": "select",
    "options": [
     "No",
     "Sí"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "test_de_thomas_modificado",
  "nombre": "Test de Thomas modificado",
  "categoria": "11. Movilidad y flexibilidad",
  "tipo": "Observacional",
  "poblaciones": "General adulto, Lumbar",
  "descripcion": "Tumbado al borde del banco abrazando una rodilla; se observa si el muslo contrario queda horizontal (psoas), la rodilla flexiona ~80-90° (recto femoral) y si hay abducción (TFL).",
  "resultado": "Normal/acortado por estructura y lado",
  "tiempo": "3 min",
  "materiales": "Banco o camilla",
  "donde": "Centro",
  "referencia": "Harvey 1998, Br J Sports Medicine",
  "encuadre": "Apto EP: observacional de extensibilidad de cadera; no diagnóstico.",
  "reglaUso": "Si extensión de cadera limitada o cliente muy sedente.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "psoas_d",
    "label": "Cadera derecha (muslo)",
    "type": "select",
    "options": [
     "Baja de la camilla",
     "Horizontal",
     "Queda elevado"
    ],
    "required": true
   },
   {
    "id": "psoas_i",
    "label": "Cadera izquierda (muslo)",
    "type": "select",
    "options": [
     "Baja de la camilla",
     "Horizontal",
     "Queda elevado"
    ],
    "required": true
   },
   {
    "id": "rf_d",
    "label": "Rodilla derecha (cuádriceps)",
    "type": "select",
    "options": [
     "Flexiona ≥80°",
     "45-80°",
     "<45°"
    ]
   },
   {
    "id": "rf_i",
    "label": "Rodilla izquierda (cuádriceps)",
    "type": "select",
    "options": [
     "Flexiona ≥80°",
     "45-80°",
     "<45°"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "wall_angel_extension_toracica_en_pared_i",
  "nombre": "Wall angel / extensión torácica en pared (interno)",
  "categoria": "11. Movilidad y flexibilidad",
  "tipo": "Observacional",
  "poblaciones": "General adulto (postural)",
  "descripcion": "De espaldas a la pared con lumbar, dorsal y occipucio en contacto, deslizar los brazos en 'W→Y' sin perder contactos; se anotan compensaciones.",
  "resultado": "Criterios cumplidos sí/no + observaciones",
  "tiempo": "3 min",
  "materiales": "Pared",
  "donde": "Ambos",
  "referencia": "Protocolo interno Koko",
  "encuadre": "Apto EP: movilidad torácica y de hombro.",
  "reglaUso": "Perfil postural/oficina.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "contacto",
    "label": "Contacto lumbar-pared mantenido",
    "type": "select",
    "options": [
     "Sí",
     "Parcial",
     "No"
    ],
    "required": true
   },
   {
    "id": "munecas",
    "label": "¿Muñecas llegan a la pared arriba?",
    "type": "select",
    "options": [
     "Sí",
     "Casi",
     "No"
    ],
    "required": true
   },
   {
    "id": "compensacion",
    "label": "Compensaciones observadas",
    "type": "select",
    "options": [
     "Ninguna",
     "Costillas abiertas",
     "Hombros elevados",
     "Codos caen"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "sentadilla_profunda_con_pica_overhead_sq",
  "nombre": "Sentadilla profunda con pica (overhead squat)",
  "categoria": "11. Movilidad y flexibilidad",
  "tipo": "Observacional",
  "poblaciones": "Todos",
  "descripcion": "Sentadilla profunda con pica sobre la cabeza; se observan talones, rodillas, tronco, profundidad y posición de la pica. Puntuación 0-3.",
  "resultado": "0-3; dolor = 0 → derivar",
  "tiempo": "3 min",
  "materiales": "Pica",
  "donde": "Centro",
  "referencia": "Cook et al. 2006, NAJSPT · NASM OPT (versión observacional)",
  "encuadre": "Ya en app SC (FMS-3).",
  "reglaUso": "Screening universal de patrón (ya en app). La técnica CON carga va en el checklist Koko.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "profundidad",
    "label": "Profundidad alcanzada",
    "type": "select",
    "options": [
     "Completa (muslo bajo paralela)",
     "Paralela",
     "Por encima de paralela"
    ],
    "required": true
   },
   {
    "id": "talones",
    "label": "¿Talones apoyados?",
    "type": "select",
    "options": [
     "Sí",
     "Se elevan"
    ],
    "required": true
   },
   {
    "id": "pica",
    "label": "Pica sobre la cabeza",
    "type": "select",
    "options": [
     "Se mantiene alineada",
     "Se adelanta",
     "No puede mantenerla"
    ]
   },
   {
    "id": "valgo",
    "label": "Rodillas",
    "type": "select",
    "options": [
     "Alineadas",
     "Valgo leve",
     "Valgo marcado"
    ]
   },
   {
    "id": "observacion_patron",
    "label": "Patrón observado / limitación principal",
    "type": "text"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "aslr_elevacion_activa_de_pierna_recta",
  "nombre": "ASLR (elevación activa de pierna recta)",
  "categoria": "11. Movilidad y flexibilidad",
  "tipo": "Observacional",
  "poblaciones": "Todos",
  "descripcion": "Tumbado, elevar una pierna recta manteniendo la otra apoyada; se valora hasta dónde llega el maléolo respecto al muslo contrario y las compensaciones. Puntuación 0-3.",
  "resultado": "0-3 por lado; dolor = 0 → derivar",
  "tiempo": "3 min",
  "materiales": "Pica de referencia, esterilla",
  "donde": "Centro",
  "referencia": "Cook et al. 2006, NAJSPT",
  "encuadre": "Ya en app SC (FMS-3).",
  "reglaUso": "Universal (ya en app).",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "pierna_d",
    "label": "Pierna derecha",
    "type": "select",
    "options": [
     ">70° sin compensar",
     "45-70°",
     "<45° o compensa"
    ],
    "required": true
   },
   {
    "id": "pierna_i",
    "label": "Pierna izquierda",
    "type": "select",
    "options": [
     ">70° sin compensar",
     "45-70°",
     "<45° o compensa"
    ],
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "apoyo_monopodal_ojos_abiertos_y_cerrados",
  "nombre": "Apoyo monopodal (ojos abiertos y cerrados)",
  "categoria": "12. Equilibrio",
  "tipo": "Prueba física",
  "poblaciones": "Todos, 60+",
  "descripcion": "Mantener el equilibrio a una pierna con manos en cadera, hasta 45-60 s; repetir con ojos cerrados. Ambos lados.",
  "resultado": "Segundos por condición y lado; <10 s con ojos abiertos en mayores = señal de riesgo",
  "tiempo": "4 min",
  "materiales": "Cronómetro",
  "donde": "Ambos",
  "referencia": "Springer et al. 2007, J Geriatr Phys Ther (valores normativos)",
  "encuadre": "Apto EP: equilibrio estático; asegurar apoyo cercano.",
  "reglaUso": "Adultos <60 (incluir ojos cerrados). En 60+ → 4-Stage.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "oa_d",
    "label": "Ojos abiertos — derecha",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 60,
    "step": 0.5,
    "required": true
   },
   {
    "id": "oa_i",
    "label": "Ojos abiertos — izquierda",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 60,
    "step": 0.5,
    "required": true
   },
   {
    "id": "oc_d",
    "label": "Ojos cerrados — derecha",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 60,
    "step": 0.5
   },
   {
    "id": "oc_i",
    "label": "Ojos cerrados — izquierda",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 60,
    "step": 0.5
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "oa_min_lte": 10
    },
    "nivel": "aviso",
    "texto": "<10 s con ojos abiertos: equilibrio a priorizar; asociado a mayor riesgo de caída."
   }
  ]
 },
{
  "id": "4_stage_balance_test_cdc_steadi",
  "nombre": "4-Stage Balance Test (CDC STEADI)",
  "categoria": "12. Equilibrio",
  "tipo": "Prueba física",
  "poblaciones": "60+",
  "descripcion": "Cuatro posiciones progresivas de 10 s: pies juntos, semitándem, tándem y monopodal. Protocolo de prevención de caídas del CDC.",
  "resultado": "Posición máxima mantenida 10 s; no llegar a tándem = riesgo",
  "tiempo": "3 min",
  "materiales": "Cronómetro",
  "donde": "Centro",
  "referencia": "CDC STEADI toolkit · cdc.gov/steadi (uso libre)",
  "encuadre": "Apto EP: cribado de equilibrio; riesgo → programa de equilibrio + derivación si cae.",
  "reglaUso": "Solo 60+; incluye el monopodal como última fase.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "pies_juntos",
    "label": "Pies juntos",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 10,
    "step": 0.5
   },
   {
    "id": "semitandem",
    "label": "Semitándem",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 10,
    "step": 0.5
   },
   {
    "id": "tandem",
    "label": "Tándem",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 10,
    "step": 0.5,
    "required": true
   },
   {
    "id": "monopodal",
    "label": "Monopodal",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 10,
    "step": 0.5
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "tandem_lt": 10
    },
    "nivel": "aviso",
    "texto": "Tándem <10 s: indicador CDC de riesgo de caída aumentado; trabajar equilibrio."
   }
  ]
 },
{
  "id": "sebt_simplificado_3_direcciones",
  "nombre": "SEBT simplificado (3 direcciones)",
  "categoria": "12. Equilibrio",
  "tipo": "Prueba física",
  "poblaciones": "Fitness/fuerza, Rodilla",
  "descripcion": "Sobre una pierna, alcanzar con la otra lo más lejos posible en dirección anterior, posteromedial y posterolateral; distancia normalizada a la longitud de la pierna. 3 intentos por dirección.",
  "resultado": "cm normalizados + asimetría; >4 cm de asimetría anterior = relevante",
  "tiempo": "8-10 min",
  "materiales": "3 cintas métricas en Y en el suelo",
  "donde": "Centro",
  "referencia": "Star Excursion Balance Test (SEBT), versión simplificada interna de 3 direcciones; no se presenta como Y Balance Test comercial",
  "encuadre": "Prueba interna de alcance dinámico basada en el SEBT; control y asimetrías, sin equivalencia automática con el Y Balance Test comercial.",
  "reglaUso": "Perfil fitness o retorno tras molestia de rodilla/tobillo.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "long_pierna",
    "label": "Longitud de pierna",
    "type": "number",
    "unit": "cm",
    "min": 60,
    "max": 120,
    "required": true,
    "help": "EIAS a maléolo interno"
   },
   {
    "id": "ant_d",
    "label": "Anterior — dcha",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 150,
    "required": true
   },
   {
    "id": "ant_i",
    "label": "Anterior — izda",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 150,
    "required": true
   },
   {
    "id": "pm_d",
    "label": "Posteromedial — dcha",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 170
   },
   {
    "id": "pm_i",
    "label": "Posteromedial — izda",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 170
   },
   {
    "id": "pl_d",
    "label": "Posterolateral — dcha",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 170
   },
   {
    "id": "pl_i",
    "label": "Posterolateral — izda",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 170
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "diff_gte_4": [
      "ant_d",
      "ant_i"
     ]
    },
    "nivel": "aviso",
    "texto": "Diferencia anterior ≥4 cm entre piernas: asimetría asociada a mayor riesgo de lesión de miembro inferior."
   }
  ]
 },
{
  "id": "functional_reach_test",
  "nombre": "Functional Reach Test",
  "categoria": "12. Equilibrio",
  "tipo": "Prueba física",
  "poblaciones": "60+",
  "descripcion": "De pie junto a la pared con el brazo a 90°, alcanzar hacia delante lo máximo sin mover los pies; se mide el desplazamiento del puño.",
  "resultado": "cm; <25 cm indica riesgo aumentado de caídas",
  "tiempo": "3 min",
  "materiales": "Regla/cinta en pared",
  "donde": "Centro",
  "referencia": "Duncan et al. 1990, J Gerontology",
  "encuadre": "Apto EP: equilibrio anticipatorio.",
  "reglaUso": "Opcional en 60+ para afinar equilibrio anticipatorio.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "alcance",
    "label": "Alcance funcional (mejor de 3)",
    "type": "number",
    "unit": "cm",
    "min": 0,
    "max": 50,
    "step": 0.5,
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "alcance_lt": 25
    },
    "nivel": "aviso",
    "texto": "<25 cm: margen de equilibrio reducido; <15 cm se asocia a riesgo de caída elevado."
   }
  ]
 },
{
  "id": "peso_corporal_modos_visible_ciego_no_com",
  "nombre": "Peso corporal (modos visible / ciego / no compartir)",
  "categoria": "13. Antropometría y composición",
  "tipo": "Medida",
  "poblaciones": "Todos",
  "descripcion": "Pesaje en condiciones estandarizadas (misma báscula, hora similar, ropa ligera). Se mantiene el sistema de la app SC: visible, peso ciego (se registra y usa en cálculos pero no se muestra) o no compartir.",
  "resultado": "kg (según modo elegido por el cliente)",
  "tiempo": "1 min",
  "materiales": "Báscula",
  "donde": "Centro",
  "referencia": "Sistema de modos: app Evaluación SC (protocolo interno)",
  "encuadre": "Medida informativa; respetar siempre el modo elegido (enfoque body-neutral de marca).",
  "reglaUso": "Universal respetando el modo elegido por el cliente.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "modo",
    "label": "Modo de pesaje",
    "type": "select",
    "options": [
     "Visible",
     "Ciego (no se muestra al cliente)",
     "No pesar hoy"
    ],
    "required": true,
    "help": "Respetar la preferencia del cliente; en modo ciego, no comentar la cifra"
   },
   {
    "id": "peso",
    "label": "Peso",
    "type": "number",
    "unit": "kg",
    "min": 30,
    "max": 250,
    "step": 0.1
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "talla",
  "nombre": "Talla",
  "categoria": "13. Antropometría y composición",
  "tipo": "Medida",
  "poblaciones": "Todos",
  "descripcion": "Estatura descalza, talones-glúteos-espalda en contacto, mirada horizontal (plano de Frankfurt).",
  "resultado": "cm",
  "tiempo": "1 min",
  "materiales": "Tallímetro de pared (~30-100 €)",
  "donde": "Centro",
  "referencia": "Protocolo antropométrico estándar (ISAK)",
  "encuadre": "Medida informativa.",
  "reglaUso": "Una vez (intake).",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "talla",
    "label": "Talla",
    "type": "number",
    "unit": "cm",
    "min": 120,
    "max": 220,
    "step": 0.5,
    "required": true
   }
  ]
 },
{
  "id": "imc",
  "nombre": "IMC",
  "categoria": "13. Antropometría y composición",
  "tipo": "Cálculo",
  "poblaciones": "Todos",
  "descripcion": "Peso/talla². Interpretar con cautela en personas muy musculadas y en mayores (donde la masa muscular pesa más que la etiqueta).",
  "resultado": "kg/m² + categoría OMS",
  "tiempo": "0 min (calculado)",
  "materiales": "—",
  "donde": "Centro",
  "referencia": "OMS",
  "encuadre": "Indicador poblacional, no diagnóstico individual; no mostrar si el peso está en modo ciego/no compartir.",
  "reglaUso": "Automático; NO mostrar si el peso está en modo ciego/no compartir.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "peso",
    "label": "Peso",
    "type": "number",
    "unit": "kg",
    "min": 30,
    "max": 250,
    "step": 0.1,
    "required": true
   },
   {
    "id": "talla",
    "label": "Talla",
    "type": "number",
    "unit": "cm",
    "min": 120,
    "max": 220,
    "step": 0.5,
    "required": true
   }
  ],
  "computed": [
   {
    "id": "imc",
    "label": "IMC",
    "formula": "imc",
    "inputs": [
     "peso",
     "talla"
    ],
    "unit": "kg/m²"
   }
  ],
  "interpret": [
   {
    "when": {
     "always": true
    },
    "nivel": "nota",
    "texto": "El IMC no distingue masa muscular de grasa: usar junto a perímetros y contexto, nunca solo."
   }
  ]
 },
{
  "id": "perimetro_de_cintura",
  "nombre": "Perímetro de cintura",
  "categoria": "13. Antropometría y composición",
  "tipo": "Medida",
  "poblaciones": "Pérdida de peso, Menopausia, Todos",
  "descripcion": "Cinta en el punto medio entre última costilla y cresta ilíaca, al final de una espiración normal, 2 medidas.",
  "resultado": "cm; riesgo cardiometabólico aumentado: >88 cm mujer / >102 cm hombre",
  "tiempo": "2 min",
  "materiales": "Cinta métrica antropométrica (~10 €)",
  "donde": "Centro",
  "referencia": "OMS 2008 · IDF 2005 (puntos de corte)",
  "encuadre": "Medida informativa de riesgo, no diagnóstico; opcional y seleccionable como pediste.",
  "reglaUso": "Bloque opcional; recomendable en pérdida de peso y menopausia.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "cintura",
    "label": "Perímetro de cintura",
    "type": "number",
    "unit": "cm",
    "min": 50,
    "max": 180,
    "step": 0.5,
    "required": true,
    "help": "Punto medio entre última costilla y cresta ilíaca, al final de espiración normal"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "indice_cintura_altura_whtr",
  "nombre": "Índice cintura-altura (WHtR)",
  "categoria": "13. Antropometría y composición",
  "tipo": "Cálculo",
  "poblaciones": "Pérdida de peso",
  "descripcion": "Cintura/talla. Más informativo que el IMC para riesgo cardiometabólico y no necesita el peso (compatible con modo peso ciego/no compartir).",
  "resultado": "Ratio; objetivo <0,5",
  "tiempo": "0 min (calculado)",
  "materiales": "—",
  "donde": "Centro",
  "referencia": "Ashwell et al. 2012, Obesity Reviews",
  "encuadre": "Indicador informativo; buena alternativa cuando el peso no se comparte.",
  "reglaUso": "Automático con cintura+talla; indicador principal (funciona sin enseñar el peso).",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "cintura",
    "label": "Cintura",
    "type": "number",
    "unit": "cm",
    "min": 50,
    "max": 180,
    "step": 0.5,
    "required": true
   },
   {
    "id": "talla",
    "label": "Talla",
    "type": "number",
    "unit": "cm",
    "min": 120,
    "max": 220,
    "step": 0.5,
    "required": true
   }
  ],
  "computed": [
   {
    "id": "whtr",
    "label": "Índice cintura-altura",
    "formula": "ratio",
    "inputs": [
     "cintura",
     "talla"
    ]
   }
  ],
  "interpret": [
   {
    "when": {
     "whtr_gte": 0.5
    },
    "nivel": "aviso",
    "texto": "WHtR ≥0,5: dato a tener en cuenta; objetivo orientativo mantener cintura por debajo de la mitad de la talla."
   }
  ]
 },
{
  "id": "ratio_cintura_cadera",
  "nombre": "Ratio cintura-cadera",
  "categoria": "13. Antropometría y composición",
  "tipo": "Medida / cálculo",
  "poblaciones": "Pérdida de peso, Menopausia",
  "descripcion": "Cintura (punto medio) / cadera (máximo perímetro glúteo).",
  "resultado": "Ratio; riesgo: ≥0,85 mujer / ≥0,90 hombre (OMS)",
  "tiempo": "2 min",
  "materiales": "Cinta métrica",
  "donde": "Centro",
  "referencia": "OMS 2008",
  "encuadre": "Indicador informativo, opcional.",
  "reglaUso": "Automático si se mide cadera; secundario frente al WHtR.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "cintura",
    "label": "Cintura",
    "type": "number",
    "unit": "cm",
    "min": 50,
    "max": 180,
    "step": 0.5,
    "required": true
   },
   {
    "id": "cadera",
    "label": "Cadera (punto más ancho)",
    "type": "number",
    "unit": "cm",
    "min": 60,
    "max": 200,
    "step": 0.5,
    "required": true
   }
  ],
  "computed": [
   {
    "id": "icc",
    "label": "Ratio cintura-cadera",
    "formula": "ratio",
    "inputs": [
     "cintura",
     "cadera"
    ]
   }
  ]
 },
{
  "id": "perimetros_segmentarios_brazo_muslo_pant",
  "nombre": "Perímetros segmentarios (brazo, muslo, pantorrilla, pecho)",
  "categoria": "13. Antropometría y composición",
  "tipo": "Medida",
  "poblaciones": "Fitness/fuerza, Pérdida de peso, 60+",
  "descripcion": "Perímetros estandarizados con cinta (puntos ISAK simplificados). La pantorrilla <31 cm sirve además como cribado sencillo de baja masa muscular en mayores.",
  "resultado": "cm por segmento; seguimiento de tendencia",
  "tiempo": "5 min",
  "materiales": "Cinta métrica",
  "donde": "Centro",
  "referencia": "Protocolo ISAK simplificado · pantorrilla: Landi et al. 2014, Clinical Nutrition",
  "encuadre": "Medida informativa; bloque opcional y seleccionable.",
  "reglaUso": "Bloque opcional; en mayores, el perímetro de pantorrilla aporta contexto junto al cribado funcional y la dinamometría.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "brazo_d",
    "label": "Brazo relajado dcho",
    "type": "number",
    "unit": "cm",
    "min": 15,
    "max": 60,
    "step": 0.5
   },
   {
    "id": "brazo_i",
    "label": "Brazo relajado izdo",
    "type": "number",
    "unit": "cm",
    "min": 15,
    "max": 60,
    "step": 0.5
   },
   {
    "id": "muslo_d",
    "label": "Muslo medio dcho",
    "type": "number",
    "unit": "cm",
    "min": 30,
    "max": 90,
    "step": 0.5
   },
   {
    "id": "muslo_i",
    "label": "Muslo medio izdo",
    "type": "number",
    "unit": "cm",
    "min": 30,
    "max": 90,
    "step": 0.5
   },
   {
    "id": "pantorrilla_d",
    "label": "Pantorrilla dcha",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 60,
    "step": 0.5,
    "help": "Pantorrilla <31 cm en 60+ orienta a baja masa muscular"
   },
   {
    "id": "pantorrilla_i",
    "label": "Pantorrilla izda",
    "type": "number",
    "unit": "cm",
    "min": 20,
    "max": 60,
    "step": 0.5
   },
   {
    "id": "pecho",
    "label": "Pecho",
    "type": "number",
    "unit": "cm",
    "min": 60,
    "max": 160,
    "step": 0.5
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "bioimpedancia_bascula_bia",
  "nombre": "Bioimpedancia (báscula BIA)",
  "categoria": "13. Antropometría y composición",
  "tipo": "Medida",
  "poblaciones": "Pérdida de peso, General adulto",
  "descripcion": "Estimación de % graso y masa magra en condiciones estandarizadas (ayuno 3-4 h, sin ejercicio previo, vejiga vacía, hidratación normal). Error individual notable: usar para tendencia, no como valor absoluto.",
  "resultado": "% graso, masa magra, agua (estimados)",
  "tiempo": "3 min",
  "materiales": "Báscula BIA segmental (~100-400 €, p. ej. Tanita/Omron doméstica-avanzada)",
  "donde": "Centro",
  "referencia": "Kyle et al. 2004, Clinical Nutrition (ESPEN: usos y limitaciones)",
  "encuadre": "Estimación informativa, no diagnóstica; comunicar el margen de error; respetar modo de peso.",
  "reglaUso": "Opcional en pérdida de peso; condiciones estandarizadas y leer TENDENCIA, no el valor suelto.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "grasa_pct",
    "label": "% grasa corporal",
    "type": "number",
    "unit": "%",
    "min": 3,
    "max": 60,
    "step": 0.1
   },
   {
    "id": "musculo_kg",
    "label": "Masa muscular",
    "type": "number",
    "unit": "kg",
    "min": 10,
    "max": 100,
    "step": 0.1
   },
   {
    "id": "agua_pct",
    "label": "% agua",
    "type": "number",
    "unit": "%",
    "min": 30,
    "max": 75,
    "step": 0.1
   },
   {
    "id": "condiciones",
    "label": "Condiciones estándar cumplidas",
    "type": "select",
    "options": [
     "Sí",
     "Parcial",
     "No"
    ],
    "help": "Ayunas o >3h tras comer, vejiga vacía, sin ejercicio previo, descalzo"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "condiciones": "No"
    },
    "nivel": "nota",
    "texto": "Medición fuera de condiciones estándar: usar solo como referencia de tendencia, no como valor absoluto."
   }
  ]
 },
{
  "id": "fc_en_reposo",
  "nombre": "FC en reposo",
  "categoria": "14. Constantes básicas",
  "tipo": "Medida",
  "poblaciones": "Todos",
  "descripcion": "Tras 5 min sentado en calma, medir FC con pulsómetro, pulsioxímetro o palpación 60 s.",
  "resultado": "lpm; seguimiento de tendencia con el entrenamiento",
  "tiempo": "5 min (incluye reposo)",
  "materiales": "Pulsómetro de banda (~50 €) o pulsioxímetro (~25-40 €)",
  "donde": "Ambos",
  "referencia": "Estándar de valoración pre-ejercicio (ACSM)",
  "encuadre": "Medida informativa; taquicardia/bradicardia llamativa en reposo repetida → recomendar consulta.",
  "reglaUso": "Universal al inicio de la cita (aprovechando los 5 min de reposo de la TA).",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "fc",
    "label": "FC en reposo (sentado 5 min)",
    "type": "number",
    "unit": "lpm",
    "min": 35,
    "max": 140,
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "fc_gte": 100
    },
    "nivel": "aviso",
    "texto": "FC en reposo ≥100 lpm: dato a tener en cuenta; si se repite, recomendable comentarlo con profesional sanitario."
   }
  ]
 },
{
  "id": "tension_arterial_en_reposo",
  "nombre": "Tensión arterial en reposo",
  "categoria": "14. Constantes básicas",
  "tipo": "Medida",
  "poblaciones": "Todos (especialmente 60+, Pérdida de peso, Menopausia)",
  "descripcion": "2 tomas separadas 1 min, sentado tras 5 min de reposo, brazo apoyado a la altura del corazón, manguito de talla correcta; registrar la media.",
  "resultado": "mmHg; ≥180/110 = no entrenar hoy y derivar; elevada repetida → recomendar consulta médica",
  "tiempo": "5 min",
  "materiales": "Tensiómetro automático de brazo validado (~50-100 €)",
  "donde": "Centro",
  "referencia": "ACSM Guidelines (cribado preparticipación) · umbrales ESC/ESH",
  "encuadre": "MEDIDA de cribado de seguridad, no diagnóstico de hipertensión; nunca etiquetar, solo derivar.",
  "reglaUso": "Universal en la primera evaluación. ≥180/110 → no entrenar hoy y derivar.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "sistolica",
    "label": "Sistólica",
    "type": "number",
    "unit": "mmHg",
    "min": 70,
    "max": 250,
    "required": true
   },
   {
    "id": "diastolica",
    "label": "Diastólica",
    "type": "number",
    "unit": "mmHg",
    "min": 40,
    "max": 150,
    "required": true
   },
   {
    "id": "brazo",
    "label": "Brazo",
    "type": "select",
    "options": [
     "Derecho",
     "Izquierdo"
    ]
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "sistolica_gte": 180
    },
    "nivel": "alerta",
    "texto": "TA muy elevada hoy → no realizar esfuerzo intenso y recomendar consulta con profesional sanitario."
   },
   {
    "when": {
     "sistolica_gte": 140
    },
    "nivel": "aviso",
    "texto": "TA elevada en esta medición: repetir otro día en reposo; si persiste, recomendable consulta sanitaria."
   }
  ]
 },
{
  "id": "spo2_pulsioximetria_opcional",
  "nombre": "SpO2 (pulsioximetría, opcional)",
  "categoria": "14. Constantes básicas",
  "tipo": "Medida",
  "poblaciones": "Casos concretos",
  "descripcion": "Saturación de oxígeno en reposo en dedo, como dato complementario cuando hay disnea llamativa o antecedente respiratorio declarado.",
  "resultado": "%; valores bajos → no entrenar y recomendar consulta",
  "tiempo": "1 min",
  "materiales": "Pulsioxímetro (~25-40 €)",
  "donde": "Centro",
  "referencia": "Medida estándar (informativa)",
  "encuadre": "Medida informativa de seguridad; no interpretar clínicamente, solo derivar si llama la atención.",
  "reglaUso": "Solo con disnea llamativa o antecedente respiratorio declarado.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "spo2",
    "label": "SpO2",
    "type": "number",
    "unit": "%",
    "min": 70,
    "max": 100,
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "interpret": [
   {
    "when": {
     "spo2_lte": 93
    },
    "nivel": "alerta",
    "texto": "SpO2 ≤93% en reposo → no realizar esfuerzo y recomendar consulta con profesional sanitario."
   }
  ]
 },
{
  "id": "breq_3_regulacion_de_la_motivacion",
  "nombre": "BREQ-3 (regulación de la motivación)",
  "categoria": "15. Motivación y adherencia",
  "tipo": "Cuestionario",
  "poblaciones": "Todos",
  "descripcion": "23 ítems 0-4 que sitúan la motivación hacia el ejercicio en el continuo de la teoría de la autodeterminación (amotivación → externa → introyectada → identificada → integrada → intrínseca).",
  "resultado": "Perfil motivacional + índice de autodeterminación",
  "tiempo": "5-8 min",
  "materiales": "Ninguno",
  "donde": "Casa",
  "referencia": "Markland & Tobin 2004 · adaptación española González-Cutre et al. 2010, Psicothema (uso libre)",
  "encuadre": "Apto EP: perfila el enfoque de coaching y la comunicación.",
  "reglaUso": "Intake en casa; perfila la comunicación del entrenador.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "autonoma",
    "label": "Motivación autónoma (media)",
    "type": "number",
    "min": 0,
    "max": 4,
    "step": 0.1,
    "help": "Media de las subescalas intrínseca e identificada (0-4). Valores altos indican que entrena porque quiere, no por presión.",
    "unit": "de 0 a 4"
   },
   {
    "id": "controlada",
    "label": "Motivación controlada (media)",
    "type": "number",
    "min": 0,
    "max": 4,
    "step": 0.1,
    "help": "Media de las subescalas introyectada y externa (0-4). Valores altos indican motivación por presión o culpa, peor predictor de adherencia.",
    "unit": "de 0 a 4"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "paces_disfrute_del_ejercicio",
  "nombre": "PACES (disfrute del ejercicio)",
  "categoria": "15. Motivación y adherencia",
  "tipo": "Cuestionario",
  "poblaciones": "Todos",
  "descripcion": "16 ítems bipolares 1-7 sobre cuánto disfruta la actividad física ('lo odio ↔ me encanta'). Predictor potente de adherencia.",
  "resultado": "16-112; a más puntuación, más disfrute",
  "tiempo": "5 min",
  "materiales": "Ninguno",
  "donde": "Casa",
  "referencia": "Kendzierski & DeCarlo 1991, J Sport Exerc Psychol (adaptaciones al español disponibles)",
  "encuadre": "Apto EP: adherencia.",
  "reglaUso": "Opcional; útil cuando la adherencia flojea.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "total",
    "label": "Puntuación total (8-56)",
    "type": "number",
    "min": 8,
    "max": 56,
    "required": true,
    "help": "Escala de disfrute del ejercicio. Anota la puntuación total y el rango de la versión utilizada (existen versiones de 18, 16 y 8 ítems). Mayor puntuación = más disfrute, buen predictor de adherencia."
   },
   {
    "id": "fecha_casa",
    "label": "Fecha en que lo completó el cliente",
    "type": "date"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "autoeficacia_para_el_ejercicio",
  "nombre": "Autoeficacia para el ejercicio",
  "categoria": "15. Motivación y adherencia",
  "tipo": "Cuestionario",
  "poblaciones": "Todos",
  "descripcion": "Confianza 0-100 en mantener el ejercicio ante barreras concretas (cansancio, mal tiempo, vacaciones, sin compañía…). 5-12 situaciones.",
  "resultado": "Media 0-100; <50 → trabajar plan de contingencias",
  "tiempo": "3 min",
  "materiales": "Ninguno",
  "donde": "Casa",
  "referencia": "Bandura 2006 (guía de construcción) · Marcus et al. 1992",
  "encuadre": "Apto EP: adherencia y coaching.",
  "reglaUso": "Opcional; <50 → plan de contingencias con el cuestionario de barreras.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "total",
    "label": "Puntuación total (0-100)",
    "type": "number",
    "min": 0,
    "max": 100,
    "required": true,
    "help": "Confianza percibida en mantener el ejercicio ante obstáculos. Anota la puntuación total y el rango de la escala utilizada. Mayor puntuación = mayor confianza y mejor adherencia esperable."
   },
   {
    "id": "fecha_casa",
    "label": "Fecha en que lo completó el cliente",
    "type": "date"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "circuito_funcional_koko",
  "nombre": "Circuito funcional Koko",
  "categoria": "16. Protocolos propios Koko",
  "tipo": "Prueba física (batería interna)",
  "poblaciones": "General adulto, Mujer 40+",
  "descripcion": "Mini-circuito cronometrado de marca: levantarse del suelo + transportar 2 bolsas lastradas 10 m + subir y bajar escalón ×10 + alcance a estante alto con carga ligera. Criterios de ejecución definidos por escrito.",
  "resultado": "Tiempo total + observaciones; comparación intra-sujeto en re-test de pago",
  "tiempo": "8 min",
  "materiales": "Esterilla, 2 bolsas/kettlebells, escalón, estante o marca alta",
  "donde": "Centro",
  "referencia": "Protocolo interno Koko (sin baremos publicados)",
  "encuadre": "Apto EP: prueba funcional de marca; documentar protocolo para repetibilidad entre los 9 entrenadores.",
  "reglaUso": "Alternativa de marca a SRT + cargar la compra: uno u otro por cliente, nunca ambos.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "tiempo_total",
    "label": "Tiempo total del circuito",
    "type": "number",
    "unit": "s",
    "min": 30,
    "max": 1200,
    "required": true
   },
   {
    "id": "rpe",
    "label": "RPE al terminar (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10
   },
   {
    "id": "estaciones",
    "label": "Estaciones/versión del circuito aplicada",
    "type": "text"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "test_de_cargar_la_compra",
  "nombre": "Test de 'cargar la compra'",
  "categoria": "16. Protocolos propios Koko",
  "tipo": "Prueba física",
  "poblaciones": "60+, Mujer 40+",
  "descripcion": "Caminar 20 m con una bolsa lastrada en cada mano (carga fija, p. ej. 2×4 kg en mayores) sin apoyarlas ni alterar la postura; registrar si completa, tiempo y sensación de esfuerzo.",
  "resultado": "Completa sí/no + tiempo + RPE; muy traducible a la vida diaria",
  "tiempo": "3 min",
  "materiales": "2 bolsas o kettlebells, pasillo 20 m",
  "donde": "Centro",
  "referencia": "Protocolo interno Koko (inspirado en pruebas de transporte de carga)",
  "encuadre": "Apto EP: función cotidiana; excelente para comunicar progreso.",
  "reglaUso": "60+/M40; versión ligera del farmer's carry.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "carga_mano",
    "label": "Carga por mano",
    "type": "number",
    "unit": "kg",
    "min": 1,
    "max": 30,
    "step": 0.5,
    "required": true
   },
   {
    "id": "distancia",
    "label": "Distancia",
    "type": "number",
    "unit": "m",
    "min": 5,
    "max": 100,
    "required": true
   },
   {
    "id": "resultado",
    "label": "Resultado",
    "type": "select",
    "options": [
     "Completa sin dificultad",
     "Completa con esfuerzo",
     "No completa"
    ],
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "checklist_koko_de_tecnica_en_basicos",
  "nombre": "Checklist Koko de técnica en básicos",
  "categoria": "16. Protocolos propios Koko",
  "tipo": "Observacional",
  "poblaciones": "Todos",
  "descripcion": "Valoración 0-2 por criterio (0 no cumple / 1 parcial / 2 cumple) en 4 patrones con carga ligera: sentadilla, bisagra de cadera, empuje y tracción. 4-5 criterios por patrón, definidos por escrito con foto.",
  "resultado": "Puntuación por patrón → prioridades técnicas del programa",
  "tiempo": "8-10 min",
  "materiales": "Pica, mancuerna ligera, goma",
  "donde": "Centro",
  "referencia": "Protocolo interno Koko",
  "encuadre": "Apto EP: observacional de técnica; el checklist escrito homogeneiza el criterio entre entrenadores.",
  "reglaUso": "Universal antes de programar fuerza; la técnica se valida aquí, no dentro del 1RM.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "sentadilla",
    "label": "Sentadilla",
    "type": "select",
    "options": [
     "Correcta",
     "Corregible",
     "A construir"
    ],
    "required": true
   },
   {
    "id": "bisagra",
    "label": "Bisagra de cadera",
    "type": "select",
    "options": [
     "Correcta",
     "Corregible",
     "A construir"
    ],
    "required": true
   },
   {
    "id": "empuje",
    "label": "Empuje (press/flexión)",
    "type": "select",
    "options": [
     "Correcta",
     "Corregible",
     "A construir"
    ]
   },
   {
    "id": "traccion",
    "label": "Tracción (remo)",
    "type": "select",
    "options": [
     "Correcta",
     "Corregible",
     "A construir"
    ]
   },
   {
    "id": "carga",
    "label": "Transporte de carga",
    "type": "select",
    "options": [
     "Correcta",
     "Corregible",
     "A construir"
    ]
   },
   {
    "id": "prioridad",
    "label": "Patrón prioritario a trabajar",
    "type": "text"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "pasos_diarios_media_semanal",
  "nombre": "Pasos diarios (media semanal)",
  "categoria": "17. Seguimiento en casa",
  "tipo": "Registro en casa",
  "poblaciones": "Todos, Pérdida de peso",
  "descripcion": "Media de pasos de 7 días desde el móvil o pulsera del cliente, reportada en Harbiz. Línea base y seguimiento de actividad no estructurada (NEAT).",
  "resultado": "Pasos/día; cortes orientativos Tudor-Locke (<5.000 sedentario, ≥7.500 activo)",
  "tiempo": "7 días (0 min activos)",
  "materiales": "Móvil o pulsera del cliente + Harbiz",
  "donde": "Casa",
  "referencia": "Tudor-Locke et al. 2011, Int J Behav Nutr Phys Act",
  "encuadre": "Apto EP: hábitos de actividad.",
  "reglaUso": "Seguimiento continuo; hace innecesario repetir el IPAQ.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "pasos",
    "label": "Media diaria de pasos (semana)",
    "type": "number",
    "min": 0,
    "max": 40000,
    "required": true,
    "help": "Media diaria de la última semana, de móvil o pulsera. Referencia: el beneficio sobre mortalidad empieza a apreciarse en torno a 2.500-4.000 pasos y se acumula hasta unos 8.000-10.000.",
    "unit": "pasos/día"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "srpe_esfuerzo_percibido_de_sesion",
  "nombre": "sRPE (esfuerzo percibido de sesión)",
  "categoria": "17. Seguimiento en casa",
  "tipo": "Registro en casa",
  "poblaciones": "Todos",
  "descripcion": "30 min después de cada sesión, puntuar el esfuerzo global 0-10; multiplicado por los minutos da la carga interna de la sesión. Se reporta en Harbiz.",
  "resultado": "Carga sesión (UA) y carga semanal; monitoriza tolerancia",
  "tiempo": "30 s/sesión",
  "materiales": "Harbiz",
  "donde": "Casa",
  "referencia": "Foster et al. 2001, J Strength Cond Research",
  "encuadre": "Apto EP: control de carga estándar del entrenamiento.",
  "reglaUso": "Tras cada sesión en Harbiz.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "rpe",
    "label": "sRPE de la sesión (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10,
    "required": true
   },
   {
    "id": "duracion",
    "label": "Duración de sesión",
    "type": "number",
    "unit": "min",
    "min": 5,
    "max": 240
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ],
  "computed": [
   {
    "id": "carga",
    "label": "Carga de sesión",
    "formula": "producto",
    "inputs": [
     "rpe",
     "duracion"
    ],
    "unit": "UA"
   }
  ]
 },
{
  "id": "check_in_semanal_koko",
  "nombre": "Check-in semanal Koko",
  "categoria": "17. Seguimiento en casa",
  "tipo": "Registro en casa",
  "poblaciones": "Todos",
  "descripcion": "Formulario semanal de 1 minuto: energía 0-10, sueño 0-10, dolor 0-10, ánimo 0-10, adherencia a comidas 0-10 y nota libre. El gran dato longitudinal barato del sistema.",
  "resultado": "5 escalas 0-10 + comentario; tendencias y alertas simples",
  "tiempo": "1 min/semana",
  "materiales": "Harbiz o formulario",
  "donde": "Casa",
  "referencia": "Protocolo interno Koko (formato wellness cuestionario tipo Hooper adaptado)",
  "encuadre": "Apto EP: seguimiento de bienestar percibido; caídas sostenidas → conversación y derivación si procede.",
  "reglaUso": "Semanal universal; sus ítems de sueño, dolor o ánimo activan el check-in específico, la NRS o una conversación de seguimiento.",
  "implementacion": "registro",
  "enInforme": true,
  "fields": [
   {
    "id": "energia",
    "label": "Energía (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10,
    "required": true
   },
   {
    "id": "sueno",
    "label": "Sueño (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10,
    "required": true
   },
   {
    "id": "dolor",
    "label": "Molestias (0-10, 0 = ninguna)",
    "type": "escala",
    "min": 0,
    "max": 10,
    "required": true
   },
   {
    "id": "adherencia",
    "label": "Adherencia a la semana planificada (0-10)",
    "type": "escala",
    "min": 0,
    "max": 10,
    "required": true
   },
   {
    "id": "nota",
    "label": "Comentario libre del cliente",
    "type": "text"
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 },
{
  "id": "re_test_en_casa_por_video_sts_30_sentadi",
  "nombre": "Re-test en casa por vídeo (STS-30 / sentadillas 1' / wall sit / monopodal)",
  "categoria": "17. Seguimiento en casa",
  "tipo": "Prueba física guiada",
  "poblaciones": "Todos",
  "descripcion": "El cliente graba en casa pruebas seguras y sencillas siguiendo un vídeo-guía Koko (silla estándar, encuadre indicado) y las sube a Harbiz; el entrenador puntúa con los mismos criterios: STS-30, sentadillas máximas en 1 min, wall sit y apoyo monopodal.",
  "resultado": "Mismas métricas que la versión presencial",
  "tiempo": "10 min",
  "materiales": "Silla, móvil, vídeo-guía Koko, Harbiz",
  "donde": "Casa",
  "referencia": "Protocolo interno Koko sobre pruebas validadas",
  "encuadre": "Apto EP: permite ofrecer el re-test de pago sin ocupar sala; estandarizar bien el vídeo-guía.",
  "reglaUso": "Producto de pago sin ocupar sala; misma batería y criterios que la versión presencial.",
  "implementacion": "campos",
  "enInforme": true,
  "fields": [
   {
    "id": "sts30",
    "label": "STS-30 (reps)",
    "type": "number",
    "min": 0,
    "max": 40,
    "help": "Repeticiones completas de sentarse y levantarse en 30 segundos.",
    "unit": "reps"
   },
   {
    "id": "sent1min",
    "label": "Sentadillas 1 min (reps)",
    "type": "number",
    "min": 0,
    "max": 80,
    "help": "Sentadillas completas en 1 minuto.",
    "unit": "reps"
   },
   {
    "id": "wallsit",
    "label": "Wall sit",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 300
   },
   {
    "id": "monopodal",
    "label": "Monopodal ojos abiertos (peor pierna)",
    "type": "number",
    "unit": "s",
    "min": 0,
    "max": 60
   },
   {
    "id": "supervision",
    "label": "Realizado",
    "type": "select",
    "options": [
     "En videollamada",
     "Vídeo enviado",
     "Autoinformado"
    ],
    "required": true
   },
   {
    "id": "obs",
    "label": "Observaciones del entrenador",
    "type": "observacion"
   }
  ]
 }
];