// MOTOR DE PRUEBAS — fórmulas, interpretación no clínica, renderizado dinámico y runner.
import { useState, useMemo } from 'react';
import { BATERIA } from './bateria.js';
import { CUESTIONARIOS } from './cuestionarios.js';
import { C, S, Btn, Field, Page, Modal, IconBtn } from './ui.jsx';
import { infoBreve, infoMedico, infoManual, infoPuntuacion } from './infotests.js';

// Fórmulas con nombre (nunca eval()): seguras y auditables.
export const FORMULAS = {
  imc: v => v[0] > 0 && v[1] > 0 ? +(v[0]/((v[1]/100)**2)).toFixed(1) : null,
  ratio: v => v[1] > 0 ? +(v[0]/v[1]).toFixed(2) : null,
  resta: v => v[0]!=null && v[1]!=null ? +(v[0]-v[1]).toFixed(0) : null,
  suma2: v => v[0]!=null && v[1]!=null ? v[0]+v[1] : null,
  suma3: v => v.every(x=>x!=null) ? v[0]+v[1]+v[2] : null,
  suma7: v => v.every(x=>x!=null) ? v.reduce((a,b)=>a+b,0) : null,
  producto: v => v[0]!=null && v[1]!=null ? v[0]*v[1] : null,
  epley: v => v[0]>0 && v[1]>0 ? +(v[0]*(1+v[1]/30)).toFixed(1) : null,
  asimetria: v => v[0]>0 && v[1]>0 ? +((Math.abs(v[0]-v[1])/Math.max(v[0],v[1])*100)).toFixed(1) : null,
  identidad: v => v[0] != null ? +v[0] : null,
  media: v => {
    const validos = v.filter(x => x != null && !Number.isNaN(+x)).map(Number);
    return validos.length ? +(validos.reduce((a,b)=>a+b,0)/validos.length).toFixed(1) : null;
  },
};

// Evalúa reglas declarativas de interpretación definidas en bateria.js
export function evalInterpret(rules, data, computed) {
  const all = { ...data, ...computed };
  const num = k => { const x = parseFloat(all[k]); return isNaN(x) ? null : x; };
  const out = [];
  for (const r of rules || []) {
    const w = r.when;
    const conds = [];
    for (const [k, v] of Object.entries(w)) {
      if (k === 'always') conds.push(true);
      else if (k.endsWith('_gte')) { const n = num(k.slice(0,-4)); conds.push(n!=null && n >= v); }
      else if (k.endsWith('_lte')) { const n = num(k.slice(0,-4)); conds.push(n!=null && n <= v); }
      else if (k.endsWith('_lt')) { const n = num(k.slice(0,-3)); conds.push(n!=null && n < v); }
      else if (k.endsWith('_between')) { const n = num(k.slice(0,-8)); conds.push(n!=null && n>=v[0] && n<=v[1]); }
      else if (k === 'diff_gte_2' || k === 'diff_gte_4') {
        const d = parseFloat(k.split('_')[2]); const a = num(v[0]), b = num(v[1]);
        conds.push(a!=null && b!=null && Math.abs(a-b) >= d);
      }
      else if (k === 'oa_min_lte') { const a = num('oa_d'), b = num('oa_i'); conds.push(a!=null&&b!=null&&Math.min(a,b)<=v); }
      else conds.push(String(all[k]) === String(v));
    }
    if (conds.length && conds.every(Boolean)) out.push({ nivel: r.nivel, texto: r.texto });
  }
  return out;
}

const vacio = v => v === undefined || v === null || v === '';

function itemsDe(Q) {
  if (!Q) return [];
  if (Q.sections) return Q.sections.flatMap(s => s.items || []);
  if (Q.secciones) return Q.secciones.flatMap(s => s.items || []);
  return Q.items || [];
}

function camposDe(test) {
  if (test.implementacion === 'items') return CUESTIONARIOS[test.id]?.fields || [];
  return test.fields || [];
}

export function validationErrors(test, data = {}) {
  const errores = [];
  if (!test) return ['Prueba no encontrada'];

  if (test.id === 'nrs_de_dolor_0_10') {
    const zonas = data.zonas && data.zonas.length ? data.zonas : [data];
    if (!zonas.length || zonas.some(z => z.actual == null)) errores.push('Dolor ahora (0-10) en todas las zonas');
  } else if (test.implementacion === 'items') {
    const Q = CUESTIONARIOS[test.id];
    if (!Q) return ['Definición del cuestionario no encontrada'];
    if (Q.tipo === 'checklist') {
      if (!data._reviewed) errores.push('Confirmar que se han revisado todas las señales');
    } else if (Q.tipo === 'medida') {
      for (const f of Q.fields || []) {
        if (f.required && vacio(data[f.id])) errores.push(f.label);
      }
    } else {
      for (const it of itemsDe(Q)) {
        if (!it.optional && vacio(data[it.id])) errores.push(it.text || it.title || it.id);
      }
      if (Q.vas?.required && vacio(data[Q.vas.id])) errores.push(Q.vas.label);
    }
  } else {
    for (const f of test.fields || []) {
      if (f.required && vacio(data[f.id])) errores.push(f.label);
    }
  }

  for (const f of camposDe(test)) {
    const v = data[f.id];
    if (vacio(v) || f.type !== 'number') continue;
    if (f.min != null && +v < f.min) errores.push(`${f.label}: mínimo ${f.min}`);
    if (f.max != null && +v > f.max) errores.push(`${f.label}: máximo ${f.max}`);
  }

  for (const [a,b] of test.pairedFields || []) {
    const av = !vacio(data[a]), bv = !vacio(data[b]);
    if (av !== bv) errores.push(`Completar juntos ${a} y ${b}`);
  }
  if (test.id === 'ipaq_sf_actividad_fisica_forma_corta') {
    for (const [dias, minutos, etiqueta] of [
      ['vig_dias','vig_min','actividad intensa'],
      ['mod_dias','mod_min','actividad moderada'],
      ['cam_dias','cam_min','caminar'],
    ]) {
      if (+data[dias] > 0 && vacio(data[minutos])) errores.push(`Indicar minutos de ${etiqueta}`);
    }
  }
  return [...new Set(errores)];
}

export function validateEvaluation(ev) {
  const errores = [];
  if (!ev?.cliente?.nombre?.trim()) errores.push('Falta el nombre del cliente');
  if (!ev?.consent) errores.push('Falta el consentimiento registrado');

  for (const [tid, r] of Object.entries(ev?.resultados || {})) {
    if ((r.estado || 'completa') === 'omitida') continue;
    const test = BATERIA.find(t => t.id === tid);
    if (!test) { errores.push(`${tid}: prueba no disponible en esta versión`); continue; }
    const es = validationErrors(test, r.data || {});
    if (es.length) errores.push(`${test.nombre}: ${es.join(', ')}`);
    if ((test.implementacion === 'items' || (test.computed || []).length) && !r.score) {
      errores.push(`${test.nombre}: resultado no calculado`);
    }
    const edadCliente = Number(ev.cliente?.edad);
    if (Number.isFinite(edadCliente) && r.data?.edad != null && Number(r.data.edad) !== edadCliente)
      errores.push(`${test.nombre}: la edad no coincide con la ficha`);
    if (ev.cliente?.sexo && r.data?.sexo && r.data.sexo !== ev.cliente.sexo && ev.cliente.sexo !== 'Otro')
      errores.push(`${test.nombre}: el sexo no coincide con la ficha`);
  }
  return [...new Set(errores)];
}

// Puntuación unificada de cualquier prueba
export function scoreOf(test, data) {
  if (validationErrors(test, data).length) return null;
  // NRS de dolor: admite varias zonas de molestia, cada una con ahora/peor/medio
  if (test.id === 'nrs_de_dolor_0_10') {
    const zonas = (data.zonas && data.zonas.length ? data.zonas
      : [{ zona: data.zona || '', actual: data.actual, peor: data.peor, medio: data.medio }])
      .filter(z => z.actual != null || z.peor != null || z.medio != null || (z.zona || '').trim());
    if (!zonas.length) return null;
    const peorActual = Math.max(...zonas.map(z => z.actual ?? 0));
    const avisos = zonas.filter(z => (z.actual ?? 0) >= 7).map(z => ({
      nivel: 'alerta',
      texto: `Dolor intenso comunicado${z.zona ? ` en ${z.zona}` : ''} → adaptar la sesión y valorar recomendación de consulta con profesional sanitario.`
    }));
    return {
      primary: { label: zonas.length > 1 ? 'Dolor ahora (zona peor)' : 'Dolor ahora', value: peorActual, max: 10 },
      secondary: zonas.map(z => ({ label: z.zona || 'Zona sin nombre', value: `${z.actual ?? '—'} / ${z.peor ?? '—'} / ${z.medio ?? '—'}` })),
      interpretation: (zonas.length > 1 ? `${zonas.length} zonas registradas. ` : '') + 'Cada zona: dolor ahora / peor / medio de la última semana (0-10).',
      avisos, alerta: avisos.length > 0, higherIsWorse: true
    };
  }
  if (test.implementacion === 'items') {
    const Q = CUESTIONARIOS[test.id];
    const sc = Q?.score ? Q.score(data) : null;
    if (sc) sc.avisos = sc.alerta && sc.interpretation ? [{ nivel:'alerta', texto: sc.interpretation }] : [];
    return sc;
  }
  const computed = {};
  for (const c of test.computed || []) {
    const vals = c.inputs.map(k => { const x = parseFloat(data[k]); return isNaN(x)?null:x; });
    computed[c.id] = FORMULAS[c.formula]?.(vals) ?? null;
  }
  const avisos = evalInterpret(test.interpret, data, computed);
  const compArr = (test.computed||[]).map(c => ({ label: c.label, value: computed[c.id] ?? '—', unit: c.unit, max: c.max }));
  if (!compArr.length && !avisos.length) return null;
  return {
    primary: compArr.length ? compArr[0] : null,
    secondary: compArr.slice(1),
    avisos,
    alerta: avisos.some(a=>a.nivel==='alerta'),
    interpretation: null
  };
}

// ---------- Renderizado de un campo genérico ----------
export function CampoInput({ f, value, onChange }) {
  if (f.type === 'select') return <Field label={f.label + (f.required?' *':'')} help={f.help}>
    <select style={S.input} value={value ?? ''} onChange={e=>onChange(e.target.value)}>
      <option value="">—</option>{f.options.map(o=><option key={o}>{o}</option>)}
    </select></Field>;
  if (f.type === 'escala') return <Field label={f.label + (f.required?' *':'')} help={f.help}>
    <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
      {Array.from({length:(f.max-f.min+1)},(_,i)=>f.min+i).map(n =>
        <button key={n} onClick={()=>onChange(n)} style={{
          width:44, height:44, borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
          border:`1px solid ${value===n?C.brandDark:C.border}`, background: value===n?C.brand:'#fff', color: value===n?C.brandText:C.ink
        }}>{n}</button>)}
    </div></Field>;
  if (f.type === 'nota') return <div style={{background:'#fdf6ee', borderLeft:`3px solid ${C.accent}`, borderRadius:8,
    padding:'11px 14px', marginBottom:16, fontSize:12.5, lineHeight:1.55, color:C.ink}}>{f.label}</div>;
  if (f.type === 'checkbox') return <label style={{display:'flex', gap:10, alignItems:'center', marginBottom:14, cursor:'pointer'}}>
    <input type="checkbox" checked={!!value} onChange={e=>onChange(e.target.checked)} style={{width:20, height:20}} />
    <span style={{fontSize:14}}>{f.label}</span></label>;
  if (f.type === 'observacion') return <Field label={f.label}>
    <textarea style={{...S.input, minHeight:64}} value={value||''} onChange={e=>onChange(e.target.value)} /></Field>;
  if (f.type === 'date') return <Field label={f.label} help={f.help}>
    <input type="date" style={S.input} value={value||''} onChange={e=>onChange(e.target.value)} /></Field>;
  if (f.type === 'number') return <Field label={f.label + (f.required?' *':'') + (f.unit?` (${f.unit})`:'')} help={f.help}>
    <input type="number" style={S.input} inputMode="decimal" min={f.min} max={f.max} step={f.step||1}
      value={value ?? ''} onChange={e=>onChange(e.target.value===''?'':+e.target.value)} /></Field>;
  return <Field label={f.label + (f.required?' *':'')} help={f.help}>
    <input style={S.input} value={value||''} onChange={e=>onChange(e.target.value)} /></Field>;
}

// ---------- Cuestionarios ítem a ítem ----------
export function PruebaItems({ test, data, onChange }) {
  const Q = CUESTIONARIOS[test.id];
  if (!Q) return null;
  const set = (k,v) => onChange({...data, [k]:v});

  if (Q.tipo === 'si_no') {
    const itemSiNo = it => <div key={it.id} style={{...S.card, padding:14, marginBottom:10}}>
      <div style={{fontSize:14, marginBottom:10}}>{it.text}</div>
      <div style={{display:'flex', gap:8}}>
        {['No','Sí'].map((o,i)=><button key={o} onClick={()=>set(it.id,i)} style={{
          flex:1, padding:'11px', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
          border:`1px solid ${data[it.id]===i?C.brandDark:C.border}`, background:data[it.id]===i?C.brand:'#fff', color:data[it.id]===i?C.brandText:C.ink}}>{o}</button>)}
      </div></div>;
    if (Q.secciones) return <div>
      <p style={{fontSize:14, fontStyle:'italic', color:C.ink2}}>{Q.instruccion}</p>
      {Q.secciones.map(sec => <div key={sec.titulo}>
        <h3 style={{fontSize:15, color:C.brandText, margin:'18px 0 10px'}}>{sec.titulo}</h3>
        {sec.items.map(itemSiNo)}
      </div>)}
    </div>;
    return <div>
      <p style={{fontSize:14, fontStyle:'italic', color:C.ink2}}>{Q.instruccion}</p>
      {Q.items.map(itemSiNo)}
      {Q.nota && <p style={{fontSize:11, color:C.ink2, fontStyle:'italic'}}>{Q.nota}</p>}
    </div>;
  }

  if (Q.tipo === 'checklist') return <div>
    <p style={{fontSize:14, fontStyle:'italic', color:C.ink2}}>{Q.instruccion}</p>
    {Q.items.map(txt => {
      const marked = (data.marcadas||[]).includes(txt);
      return <div key={txt} onClick={()=>{
        const cur = data.marcadas||[];
        onChange({...data, marcadas: marked ? cur.filter(x=>x!==txt) : [...cur, txt], _reviewed:true});
      }} style={{display:'flex', gap:12, alignItems:'center', padding:'12px 14px', marginBottom:8, borderRadius:8, cursor:'pointer',
        border:`1px solid ${marked?C.danger:C.border}`, background: marked?'#fdf2f2':'#fff'}}>
        <div style={{width:20, height:20, borderRadius:5, flexShrink:0, border:`2px solid ${marked?C.danger:C.border}`,
          background: marked?C.danger:'#fff', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13}}>{marked?'✓':''}</div>
        <span style={{fontSize:14}}>{txt}</span>
      </div>;
    })}
    <label style={{display:'flex', gap:10, alignItems:'flex-start', padding:'12px 14px', border:`1px solid ${data._reviewed?C.ok:C.border}`, borderRadius:8, cursor:'pointer', background:data._reviewed?'#eef7f1':'#fff'}}>
      <input type="checkbox" checked={!!data._reviewed} onChange={e=>set('_reviewed',e.target.checked)} style={{width:20,height:20,marginTop:1}} />
      <span style={{fontSize:14}}>Confirmo que he revisado todas las señales, incluidas las no marcadas.</span>
    </label>
  </div>;

  const renderItem = (it, scale) => {
    const sc = it.scale || scale || Q.scale;
    return <div key={it.id} style={{...S.card, padding:14, marginBottom:10}}>
      <div style={{fontSize:14, marginBottom:10}}>{it.text}</div>
      <div style={{display:'grid', gridTemplateColumns:`repeat(${sc.length},1fr)`, gap:5}}>
        {sc.map((o,i)=><button key={i} onClick={()=>set(it.id,i)} style={{
          padding:'10px 4px', borderRadius:6, fontSize:11.5, lineHeight:1.25, cursor:'pointer', fontFamily:'inherit',
          fontWeight: data[it.id]===i?700:400,
          border:`1px solid ${data[it.id]===i?C.brandDark:C.border}`, background:data[it.id]===i?C.brand:'#fff', color:data[it.id]===i?C.brandText:C.ink}}>{o}</button>)}
      </div></div>;
  };

  if (Q.tipo === 'likert') return <div>
    <p style={{fontSize:14, fontStyle:'italic', color:C.ink2}}>{Q.instruccion}</p>
    {Q.sections ? Q.sections.map(sec => <div key={sec.title}>
      <h3 style={{fontSize:15, color:C.brandText, margin:'18px 0 10px'}}>{sec.title}</h3>
      {sec.items.map(it => renderItem(it, sec.scale))}
    </div>) : Q.items.map(it => renderItem(it))}
    {Q.nota && <p style={{fontSize:11, color:C.ink2, fontStyle:'italic'}}>{Q.nota}</p>}
  </div>;

  if (Q.tipo === 'opciones') return <div>
    <p style={{fontSize:14, fontStyle:'italic', color:C.ink2}}>{Q.instruccion}</p>
    {Q.items.map(it => <div key={it.id} style={{marginBottom:18}}>
      <h3 style={{fontSize:15, color:C.brandText, margin:'0 0 8px'}}>{it.title}{it.optional && <span style={{fontSize:12, color:C.ink2, fontWeight:400}}> (opcional)</span>}</h3>
      <div style={{display:'grid', gap:6}}>
        {it.options.map((o,i)=><button key={i} onClick={()=>set(it.id,i)} style={{
          textAlign:'left', padding:'12px 14px', borderRadius:8, fontSize:14, cursor:'pointer', fontFamily:'inherit', lineHeight:1.4,
          border:`1px solid ${data[it.id]===i?C.brandDark:C.border}`, background:data[it.id]===i?C.brand:'#fff', color:data[it.id]===i?C.brandText:C.ink}}>{o}</button>)}
      </div></div>)}
    {Q.vas && <div style={{...S.card, background:C.soft}}>
      <label style={S.label}>{Q.vas.label}</label>
      <input type="range" min={Q.vas.min} max={Q.vas.max} value={data[Q.vas.id] ?? Q.vas.def}
        onChange={e=>set(Q.vas.id, +e.target.value)} style={{width:'100%'}} />
      <div style={{textAlign:'center', fontSize:24, fontWeight:700, color:C.brandText}}>{data[Q.vas.id] ?? Q.vas.def}</div>
    </div>}
    {Q.nota && <p style={{fontSize:11, color:C.ink2, fontStyle:'italic'}}>{Q.nota}</p>}
  </div>;

  if (Q.tipo === 'medida') return <div>
    <div style={{background:'#fdf6ee', borderLeft:`3px solid ${C.accent}`, borderRadius:8, padding:12, marginBottom:16, fontSize:13.5, lineHeight:1.55}}>
      <b style={{color:C.accent, fontSize:11, letterSpacing:1}}>PROTOCOLO</b><br/>{Q.protocolo}
    </div>
    {Q.fields.map(f => <CampoInput key={f.id} f={f} value={data[f.id]} onChange={v=>set(f.id,v)} />)}
  </div>;
  return null;
}

// ---------- Iconos de guía de cada prueba (ℹ️ 🩺 📖 📏) ----------
const GUIAS = {
  info:   { icon:'ℹ️', titulo:'Para qué sirve', fn: infoBreve },
  medico: { icon:'🩺', titulo:'Qué mide esta valoración', fn: infoMedico },
  manual: { icon:'📖', titulo:'Manual paso a paso', fn: infoManual },
  regla:  { icon:'📏', titulo:'Puntuaciones y valores de referencia', fn: infoPuntuacion }
};

export function TestInfoIcons({ test, conRegla = false, small = false }) {
  const [modal, setModal] = useState(null);
  const abrir = (e, m) => { e.stopPropagation(); setModal(m); };
  const g = modal ? GUIAS[modal] : null;
  return <>
    <span style={{display:'inline-flex', gap:6}} onClick={e=>e.stopPropagation()}>
      <IconBtn small={small} icon="ℹ️" label="Para qué sirve" onClick={e=>abrir(e,'info')} />
      <IconBtn small={small} icon="🩺" label="Qué mide" onClick={e=>abrir(e,'medico')} />
      <IconBtn small={small} icon="📖" label="Manual paso a paso" onClick={e=>abrir(e,'manual')} />
      {conRegla && <IconBtn small={small} icon="📏" label="Puntuaciones y referencias" onClick={e=>abrir(e,'regla')} />}
    </span>
    {g && <Modal icon={g.icon} title={`${g.titulo} — ${test.nombre}`} onClose={()=>setModal(null)}>
      {g.fn(test).map((sec, i) => <div key={i} style={{marginBottom:12}}>
        <div style={{fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:.8, color:C.brandText, marginBottom:4}}>{sec.h}</div>
        {sec.p && <p style={{fontSize:14, lineHeight:1.6, margin:0, whiteSpace:'pre-line'}}>{sec.p}</p>}
        {sec.list && <ul style={{margin:'4px 0 0', paddingLeft:18, fontSize:13.5, lineHeight:1.7}}>
          {sec.list.map((li, j) => <li key={j}>{li}</li>)}
        </ul>}
      </div>)}
    </Modal>}
  </>;
}

// ---------- NRS de dolor con varias zonas de molestia ----------
const ZONA_VACIA = { zona: '', actual: null, peor: null, medio: null };
export function NRSZonas({ data, onChange }) {
  const zonas = data.zonas && data.zonas.length ? data.zonas
    : [{ zona: data.zona || '', actual: data.actual ?? null, peor: data.peor ?? null, medio: data.medio ?? null }];
  const setZonas = zs => onChange({ ...data, zonas: zs });
  const upd = (i, k, v) => setZonas(zonas.map((z, j) => j === i ? { ...z, [k]: v } : z));

  const Escala = ({ value, onChange }) => <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
    {Array.from({length:11},(_,n)=>n).map(n =>
      <button key={n} onClick={()=>onChange(n)} style={{
        width:44, height:44, borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
        border:`1px solid ${value===n?C.brandDark:C.border}`, background: value===n?C.brand:'#fff', color: value===n?C.brandText:C.ink
      }}>{n}</button>)}
  </div>;

  return <div>
    {zonas.map((z, i) => <div key={i} style={{border:`1px solid ${C.border}`, borderRadius:10, padding:'14px 16px', marginBottom:12, background:'#fff'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
        <b style={{fontSize:14, color:C.brandText}}>Zona {i+1}{z.zona ? ` — ${z.zona}` : ''}</b>
        {zonas.length > 1 && <button onClick={()=>setZonas(zonas.filter((_,j)=>j!==i))}
          style={{background:'none', border:'none', color:C.danger, fontSize:13, cursor:'pointer', textDecoration:'underline'}}>Quitar zona</button>}
      </div>
      <Field label="Zona de la molestia"><input style={S.input} value={z.zona||''} onChange={e=>upd(i,'zona',e.target.value)} placeholder="Ej.: hombro derecho, lumbar…" /></Field>
      <Field label="Dolor ahora (0-10) *"><Escala value={z.actual} onChange={v=>upd(i,'actual',v)} /></Field>
      <Field label="Peor dolor última semana (0-10)"><Escala value={z.peor} onChange={v=>upd(i,'peor',v)} /></Field>
      <Field label="Dolor medio última semana (0-10)"><Escala value={z.medio} onChange={v=>upd(i,'medio',v)} /></Field>
    </div>)}
    <Btn v="soft" onClick={()=>setZonas([...zonas, { ...ZONA_VACIA }])} style={{marginBottom:16}}>+ Añadir otra zona de molestia</Btn>
    <Field label="Observaciones del entrenador">
      <textarea style={{...S.input, minHeight:64}} value={data.obs||''} onChange={e=>onChange({...data, obs:e.target.value})} />
    </Field>
  </div>;
}

// ---------- Runner secuencial ----------
export function Runner({ testsIds, cliente, onFinish, onBack }) {
  const [idx, setIdx] = useState(0);
  const [all, setAll] = useState({});
  const tid = testsIds[idx];
  const test = BATERIA.find(t => t.id === tid);

  const demograficos = useMemo(() => {
    const fields = test?.implementacion === 'items'
      ? (CUESTIONARIOS[test.id]?.fields || [])
      : (test?.fields || []);
    const d = {};
    if (fields.some(f => f.id === 'edad') && cliente?.edad) d.edad = Number(cliente.edad);
    if (fields.some(f => f.id === 'sexo') && ['Mujer','Hombre'].includes(cliente?.sexo)) d.sexo = cliente.sexo;
    return d;
  }, [test, cliente]);

  const data = all[tid]?.data || demograficos;
  const setData = d => setAll(p => ({...p, [tid]: { ...(p[tid] || {}), data: d }}));
  const errores = useMemo(() => validationErrors(test, data), [test, data]);

  const avanzar = withResult => {
    if (idx + 1 >= testsIds.length) onFinish(withResult);
    else { setAll(withResult); setIdx(idx+1); }
  };

  const completar = () => {
    const score = scoreOf(test, data);
    if (!score && (test.implementacion === 'items' || (test.computed || []).length)) return;
    avanzar({...all, [tid]: { data, score, avisos: score?.avisos || [], estado:'completa' }});
  };

  const saltar = () => {
    avanzar({...all, [tid]: { data:{}, score:null, avisos:[], estado:'omitida' }});
  };

  return <Page title={test.nombre} sub={`Prueba ${idx+1} de ${testsIds.length} · ${test.categoria}`} onBack={idx>0 ? ()=>setIdx(idx-1) : onBack}>
    <div style={{height:5, background:C.soft, borderRadius:3, marginBottom:16}}>
      <div style={{height:'100%', width:`${((idx+1)/testsIds.length)*100}%`, background:C.brand, borderRadius:3, transition:'width .3s'}} />
    </div>
    <div style={{background:'#fff', border:`1px solid ${C.border}`, borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:13, color:C.ink2}}>
      <b style={{color:C.ink}}>{test.descripcion}</b><br/>
      <span style={{color:C.accent, fontWeight:600}}>Encuadre: </span>{test.encuadre}
      <div style={{display:'flex', alignItems:'center', gap:10, marginTop:10, flexWrap:'wrap'}}>
        <TestInfoIcons test={test} conRegla />
        <span style={{fontSize:11.5, color:C.ink2}}>ℹ️ para qué sirve · 🩺 qué mide · 📖 paso a paso · 📏 puntuaciones y referencias</span>
      </div>
    </div>
    {test.id === 'nrs_de_dolor_0_10'
      ? <NRSZonas data={data} onChange={setData} />
      : test.implementacion === 'items'
      ? <PruebaItems test={test} data={data} onChange={setData} />
      : <div>{(test.fields||[]).map(f => <CampoInput key={f.id} f={f} value={data[f.id]} onChange={v=>setData({...data,[f.id]:v})} />)}</div>}
    {errores.length > 0 && <div style={{fontSize:13, color:C.warn, background:'#fff8ee', border:`1px solid ${C.warn}`, borderRadius:8, padding:'10px 12px'}}>
      <b>No se puede completar todavía:</b> {errores.join(' · ')}
    </div>}
    <div style={{display:'grid', gridTemplateColumns:'1fr 2fr', gap:10, marginTop:18}}>
      <Btn v="soft" onClick={saltar}>Omitir prueba</Btn>
      <Btn onClick={completar} disabled={errores.length>0}>{idx+1>=testsIds.length ? 'Finalizar evaluación ✓' : 'Guardar y seguir →'}</Btn>
    </div>
  </Page>;
}

