// PANELES — resultados in situ, temporales, admin y ayuda.
import { useState } from 'react';
import { BATERIA } from './bateria.js';
import { hashPassword } from './crypto.js';
import { PruebaItems, CampoInput, scoreOf, NRSZonas } from './motor.jsx';
import { evidenciaDe } from './evidencia.js';
import { C, S, Btn, Field, Page, fmt, diasRestantes, PROTOCOLO, APP_VERSION, CONSENT_VERSION, NormBar } from './ui.jsx';

// ---------- Resultados in situ (pantalla que se enseña al cliente) ----------
function StatBox({ label, value, color }) {
  return <div style={{background:'#fff', border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 10px', textAlign:'center', boxShadow:'0 1px 4px rgba(32,38,43,.06)'}}>
    <div style={{fontSize:28, fontWeight:800, color: color || C.brandText, lineHeight:1}}>{value}</div>
    <div style={{fontSize:11, color:C.ink2, marginTop:6, lineHeight:1.3, textTransform:'uppercase', letterSpacing:.5}}>{label}</div>
  </div>;
}

export function Resultados({ ev, cfg, onHome, onExport }) {
  const realizadas = Object.entries(ev.resultados || {}).filter(([,r]) => (r.estado || 'completa') !== 'omitida');
  const omitidas = Object.entries(ev.resultados || {}).filter(([,r]) => (r.estado || 'completa') === 'omitida');
  const alertas = realizadas.flatMap(([,r]) => (r.avisos||[]).filter(a=>a.nivel==='alerta'));
  const avisos = realizadas.flatMap(([,r]) => (r.avisos||[]).filter(a=>a.nivel==='aviso'));
  const nPruebas = realizadas.length;

  // Agrupar resultados por categoría de la batería
  const porCat = [];
  { const m = new Map();
    for (const [tid, r] of realizadas) {
      const t = BATERIA.find(x=>x.id===tid);
      const cat = t?.categoria || 'Otras pruebas';
      if (!m.has(cat)) m.set(cat, []);
      m.get(cat).push([tid, r, t]);
    }
    porCat.push(...[...m.entries()].sort((a,b)=>a[0].localeCompare(b[0])));
  }

  return <Page title="Resultados de la evaluación" sub={`${ev.cliente.nombre} · ${fmt(ev.ts)}`} onBack={onHome}>

    {/* Cabecera de marca — presentación al cliente */}
    <div style={{background:C.negro, borderRadius:16, padding:'26px 20px 22px', marginBottom:16, textAlign:'center', boxShadow:'0 2px 8px rgba(32,38,43,.15)'}}>
      <img src="/logo.png" alt="" style={{maxHeight:64, maxWidth:'50%', marginBottom:8}} onError={e=>{e.currentTarget.style.display='none';}} />
      <div style={{fontSize:28, fontWeight:800, letterSpacing:7, color:C.brand}}>KOKO</div>
      <div style={{fontSize:9, letterSpacing:6, color:'#878787', marginTop:3}}>FITNESS EXPERIENCE</div>
      <div style={{height:1, background:'#2a2a2a', margin:'16px 40px'}} />
      <div style={{color:'#fff', fontSize:20, fontWeight:700}}>{ev.cliente.nombre}</div>
      <div style={{color:'#9aa5a0', fontSize:13, marginTop:6}}>
        Valoración física y funcional · {ev.tipoEval} · {fmt(ev.ts)}
      </div>
      <div style={{color:'#9aa5a0', fontSize:12.5, marginTop:2}}>
        Entrenador: {ev.entrenador}{ev.cliente.edad ? ` · Edad: ${ev.cliente.edad}` : ''}{ev.cliente.modalidad ? ` · ${ev.cliente.modalidad}` : ''}
      </div>
    </div>

    {/* Resumen en cifras */}
    <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, marginBottom:16}}>
      <StatBox label="Pruebas realizadas" value={nPruebas} />
      <StatBox label="Observaciones de seguridad" value={alertas.length} color={alertas.length ? C.danger : C.ok} />
      <StatBox label="Datos a tener en cuenta" value={avisos.length} color={avisos.length ? C.warn : C.ok} />
    </div>

    {alertas.length > 0 && <div style={{background:'#fdf2f2', border:`1px solid ${C.danger}`, borderLeft:`5px solid ${C.danger}`, borderRadius:12, padding:16, marginBottom:14}}>
      <b style={{color:C.danger}}>Observaciones relevantes para la seguridad</b>
      <ul style={{margin:'8px 0 0', paddingLeft:20, fontSize:14, lineHeight:1.6}}>{alertas.map((a,i)=><li key={i} style={{marginBottom:4}}>{a.texto}</li>)}</ul>
    </div>}
    {avisos.length > 0 && <div style={{background:'#fff8ee', border:`1px solid ${C.warn}`, borderLeft:`5px solid ${C.warn}`, borderRadius:12, padding:16, marginBottom:14}}>
      <b style={{color:C.warn}}>Datos a tener en cuenta para adaptar el entrenamiento</b>
      <ul style={{margin:'8px 0 0', paddingLeft:20, fontSize:14, lineHeight:1.6}}>{avisos.map((a,i)=><li key={i} style={{marginBottom:4}}>{a.texto}</li>)}</ul>
    </div>}

    {/* Resultados agrupados por categoría */}
    {porCat.map(([cat, rows]) => <div key={cat} style={{marginBottom:6}}>
      <div style={{display:'flex', alignItems:'center', gap:12, margin:'20px 0 12px'}}>
        <span style={{fontSize:12.5, fontWeight:800, letterSpacing:1.5, textTransform:'uppercase', color:C.brandText, whiteSpace:'nowrap'}}>
          {cat.replace(/^\d+\.\s*/, '')}
        </span>
        <div style={{flex:1, height:3, background:C.brand, borderRadius:2, opacity:.45}} />
      </div>
      <div style={{display:'grid', gap:12}}>
        {rows.map(([tid, r, t]) => {
          const sc = r.score;
          const evi = evidenciaDe(t, r, ev);
          const datos = Object.entries(r.data||{}).filter(([k,v]) => k!=='obs' && k!=='marcadas' && k!=='zonas' && v!=='' && v!=null);
          return <div key={tid} style={{background:'#fff', border:`1px solid ${sc?.alerta ? C.warn : C.border}`,
            borderTop:`4px solid ${sc?.alerta ? C.warn : C.brand}`, borderRadius:12, padding:'16px 18px',
            boxShadow:'0 1px 4px rgba(32,38,43,.06)'}}>
            <div style={{fontWeight:700, fontSize:15, color:C.brandText, marginBottom:10}}>{t?.nombre || tid}</div>
            {sc?.primary && <div style={{display:'flex', alignItems:'baseline', gap:10, marginBottom:10, flexWrap:'wrap'}}>
              <span style={{fontSize:11.5, color:C.ink2, textTransform:'uppercase', letterSpacing:.6}}>{sc.primary.label}</span>
              <span style={{fontSize:32, fontWeight:800, color:C.brandText, lineHeight:1}}>{sc.primary.value ?? '—'}{sc.primary.unit && <span style={{fontSize:17}}> {sc.primary.unit}</span>}</span>
              {sc.primary.max && !sc.primary.raw && <span style={{fontSize:15, color:C.ink2}}>/ {sc.primary.max}</span>}
            </div>}
            {(sc?.secondary||[]).length > 0 && <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:8}}>
              {sc.secondary.map((x,i)=><span key={i} style={{background:C.soft, borderRadius:14, padding:'5px 12px', fontSize:12.5, color:C.ink}}>
                {x.label}: <b>{x.value ?? '—'}{x.unit||''}</b></span>)}
            </div>}
            {!sc?.primary && datos.length > 0 && <div style={{display:'flex', flexWrap:'wrap', gap:6, marginBottom:8}}>
              {datos.map(([k,v])=><span key={k} style={{background:C.soft, borderRadius:14, padding:'5px 12px', fontSize:12.5, color:C.ink}}>
                {k}: <b>{Array.isArray(v)?v.join(', '):String(v)}</b></span>)}
            </div>}
            {sc?.norm && <NormBar norm={sc.norm} />}
            {sc?.interpretation && <div style={{background:C.soft, borderRadius:8, padding:'9px 13px', fontSize:13.5, fontStyle:'italic', margin:'10px 0 0', lineHeight:1.55}}>{sc.interpretation}</div>}
            {evi && <div style={{borderLeft:`4px solid ${C.brandDark}`, background:'#f6faf7', borderRadius:'0 8px 8px 0', padding:'10px 14px', margin:'10px 0 0'}}>
              <div style={{fontSize:11, fontWeight:800, letterSpacing:.8, color:C.brandText, marginBottom:4}}>📚 QUÉ DICE LA EVIDENCIA</div>
              <p style={{fontSize:13, margin:0, lineHeight:1.6}}>{evi.texto}</p>
              <p style={{fontSize:11, color:C.ink2, margin:'6px 0 0'}}>Fuentes: {evi.fuente}</p>
            </div>}
            {(r.avisos||[]).map((a,i)=><p key={i} style={{fontSize:13, fontWeight:600, color: a.nivel==='alerta'?C.danger:C.warn, margin:'8px 0 0'}}>⚠ {a.texto}</p>)}
            {r.data?.obs && <p style={{fontSize:12.5, color:C.ink2, borderLeft:`3px solid ${C.accent}`, paddingLeft:10, margin:'10px 0 0'}}>Observación del entrenador: {r.data.obs}</p>}
          </div>;
        })}
      </div>
    </div>)}

    {omitidas.length > 0 && <div style={{background:C.soft, border:`1px solid ${C.border}`, borderRadius:12, padding:'14px 18px', marginTop:16}}>
      <b style={{color:C.ink2}}>Pruebas omitidas durante la valoración</b>
      <p style={{fontSize:12.5, color:C.ink2, margin:'6px 0 0'}}>
        {omitidas.map(([id]) => BATERIA.find(x=>x.id===id)?.nombre || id).join(' · ')}
      </p>
    </div>}

    {(ev.paraCasa||[]).length > 0 && <div style={{background:'#faf5ec', border:`1px solid ${C.accent}`, borderTop:`4px solid ${C.accent}`, borderRadius:12, padding:'16px 18px', marginTop:16, boxShadow:'0 1px 4px rgba(32,38,43,.06)'}}>
      <b style={{color:C.accentText}}>Pruebas para completar en casa</b>
      <p style={{fontSize:13, margin:'6px 0 8px', lineHeight:1.55}}>Estas pruebas se harán en casa: el entrenador las enviará al correo del cliente{ev.cliente.email ? <> (<b>{ev.cliente.email}</b>)</> : null}.</p>
      <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
        {ev.paraCasa.map(id => { const t = BATERIA.find(x=>x.id===id);
          return <span key={id} style={{background:'#fff', border:`1px solid ${C.accent}`, borderRadius:14, padding:'5px 12px', fontSize:12.5}}>🏠 {t?.nombre || id}</span>; })}
      </div>
    </div>}

    <p style={{fontSize:11.5, color:C.ink2, margin:'18px 4px 0', lineHeight:1.6, textAlign:'center'}}>
      Valoración física y funcional no clínica: sin finalidad diagnóstica ni sanitaria. Los valores de referencia son orientativos.<br/>
      Espacio KoKo S.L. · espaciokoko@gmail.com
    </p>

    <div style={{...S.card, marginTop:16, background:C.soft}}>
      <b style={{fontSize:14}}>Exportar para preparar el informe</b>
      <p style={{fontSize:12, color:C.ink2, margin:'6px 0 12px'}}>Los archivos se marcan como TEMPORALES con fecha máxima de borrado. La exportación es manual: nada se envía automáticamente.</p>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10}}>
        <Btn v="ghost" onClick={()=>onExport(ev,'html')}>HTML informe</Btn>
        <Btn v="ghost" onClick={()=>onExport(ev,'json')}>JSON completo</Btn>
        <Btn v="ghost" onClick={()=>onExport(ev,'csv')}>CSV resumen</Btn>
      </div>
    </div>
    <Btn full onClick={onHome} style={{marginTop:14}}>Volver al inicio</Btn>
  </Page>;
}

// ---------- Panel de evaluaciones temporales ----------
const ESTADOS = {
  pendiente: { label:'Pendiente de exportar', color:C.warn },
  exportada: { label:'Exportada', color:C.brand },
  informe: { label:'Informe generado — lista para borrar', color:C.ok }
};

export function Temporales({ evals, cfg, onExport, onBorrar, onInforme, onGuardar, onBack }) {
  const [verConsent, setVerConsent] = useState(null);
  const [confirmar, setConfirmar] = useState(null);
  const [editId, setEditId] = useState(null);
  return <Page title="Evaluaciones temporales" sub={`${evals.length} en el dispositivo · borrado automático a los ${cfg.dias} días`} onBack={onBack}>
    {evals.length === 0 && <div style={{...S.card, textAlign:'center', color:C.ink2}}>No hay evaluaciones temporales. Todo limpio.</div>}
    <div style={{display:'grid', gap:12}}>
      {evals.map(ev => {
        const dr = diasRestantes(ev.ts, cfg.dias);
        const est = ESTADOS[ev.estado || 'pendiente'];
        return <div key={ev.id} style={S.card}>
          <div style={{display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8}}>
            <div>
              <div style={{fontWeight:700, fontSize:16}}>{ev.cliente.nombre}</div>
              <div style={{fontSize:13, color:C.ink2}}>{fmt(ev.ts)} · {ev.tipoEval} · {ev.entrenador} · {Object.keys(ev.resultados).length} pruebas</div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:13, fontWeight:700, color: est.color}}>{est.label}</div>
              <div style={{fontSize:13, color: dr<=1?C.danger:C.ink2, fontWeight: dr<=1?700:400}}>{dr} día(s) para borrado automático</div>
            </div>
          </div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginTop:12}}>
            <Btn style={{padding:'8px 12px', fontSize:13}} onClick={()=>setEditId(editId===ev.id?null:ev.id)}>{editId===ev.id ? 'Cerrar valoración ▴' : 'Ver / editar valoración ▾'}</Btn>
            <Btn v="ghost" style={{padding:'8px 12px', fontSize:13}} onClick={()=>onExport(ev,'html')}>Exportar HTML</Btn>
            <Btn v="ghost" style={{padding:'8px 12px', fontSize:13}} onClick={()=>onExport(ev,'json')}>JSON</Btn>
            <Btn v="ghost" style={{padding:'8px 12px', fontSize:13}} onClick={()=>onExport(ev,'csv')}>CSV</Btn>
            {ev.estado !== 'informe' && <Btn v="soft" style={{padding:'8px 12px', fontSize:13}} onClick={()=>onInforme(ev)}>Marcar informe generado</Btn>}
            <Btn v="soft" style={{padding:'8px 12px', fontSize:13}} onClick={()=>setVerConsent(ev)}>Ver consentimiento</Btn>
            <Btn v="danger" style={{padding:'8px 12px', fontSize:13, marginLeft:'auto'}} onClick={()=>setConfirmar(ev)}>Borrar</Btn>
          </div>
          {editId===ev.id && <EvalEditor ev={ev} onGuardar={onGuardar} onClose={()=>setEditId(null)} />}
        </div>;
      })}
    </div>

    {verConsent && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:20}}
      onClick={()=>setVerConsent(null)}>
      <div style={{...S.card, maxWidth:480, width:'100%', maxHeight:'85vh', overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
        <h3 style={{margin:'0 0 10px', color:C.brandText}}>Consentimiento registrado</h3>
        {verConsent.consent ? <>
          <p style={{fontSize:14, margin:'4px 0'}}><b>Cliente:</b> {verConsent.consent.nombre}</p>
          <p style={{fontSize:14, margin:'4px 0'}}><b>Fecha y hora:</b> {fmt(verConsent.consent.ts)}</p>
          <p style={{fontSize:14, margin:'4px 0'}}><b>Versión del texto:</b> {verConsent.consent.version}</p>
          {verConsent.consent.firma && <>
            <p style={{fontSize:13, color:C.ink2, margin:'10px 0 4px'}}>Firma:</p>
            <img src={verConsent.consent.firma} alt="Firma" style={{width:'100%', border:`1px solid ${C.border}`, borderRadius:8, background:'#fff'}} />
          </>}
        </> : <p style={{color:C.danger}}>Sin consentimiento registrado.</p>}
        <Btn full v="soft" onClick={()=>setVerConsent(null)} style={{marginTop:12}}>Cerrar</Btn>
      </div>
    </div>}

    {confirmar && <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, padding:20}}
      onClick={()=>setConfirmar(null)}>
      <div style={{...S.card, maxWidth:420, width:'100%'}} onClick={e=>e.stopPropagation()}>
        <p style={{fontSize:15, margin:'0 0 14px'}}>¿Borrar de forma <b>inmediata e irreversible</b> la evaluación de <b>{confirmar.cliente.nombre}</b>?</p>
        <div style={{display:'flex', gap:10}}>
          <Btn v="danger" full onClick={()=>{ onBorrar(confirmar); setConfirmar(null); }}>Sí, borrar ahora</Btn>
          <Btn v="soft" full onClick={()=>setConfirmar(null)}>Cancelar</Btn>
        </div>
      </div>
    </div>}
  </Page>;
}

// ---------- Ver / editar una valoración guardada ----------
// Despliega la valoración completa dentro de la lista de temporales y permite
// modificar los datos de cada prueba. Las puntuaciones se recalculan al guardar.
function EvalEditor({ ev, onGuardar, onClose }) {
  const [all, setAll] = useState(() => {
    const o = {};
    for (const [tid, r] of Object.entries(ev.resultados || {})) {
      o[tid] = { data: { ...(r.data || {}) }, estado: r.estado || 'completa' };
    }
    return o;
  });
  const [openTest, setOpenTest] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState('');

  const setData = (tid, d) => { setAll(p => ({ ...p, [tid]: { data:d, estado:'completa' } })); setDirty(true); setMsg(''); };

  const guardar = async () => {
    const resultados = {};
    for (const [tid, entry] of Object.entries(all)) {
      const t = BATERIA.find(x => x.id === tid);
      const data = entry.data || {};
      if (entry.estado === 'omitida') {
        resultados[tid] = { data:{}, score:null, avisos:[], estado:'omitida' };
        continue;
      }
      const score = t ? scoreOf(t, data) : (ev.resultados[tid]?.score ?? null);
      resultados[tid] = { data, score, avisos: score?.avisos || [], estado:'completa' };
    }
    await onGuardar({ ...ev, resultados });
    setDirty(false);
    setMsg('Cambios guardados y puntuaciones recalculadas.');
  };

  const tids = Object.keys(all);
  return <div style={{marginTop:12, borderTop:`1px solid ${C.border}`, paddingTop:12}}>
    {tids.length === 0 && <p style={{fontSize:13, color:C.ink2}}>Esta valoración no tiene pruebas realizadas en sala{(ev.paraCasa||[]).length ? ' (solo pruebas señaladas para casa)' : ''}.</p>}
    {tids.length > 0 && <p style={{fontSize:12.5, color:C.ink2, margin:'0 0 10px'}}>Toca una prueba para desplegarla y modificar sus datos. Al guardar se recalculan puntuaciones, avisos y comparativas.</p>}
    <div style={{display:'grid', gap:8}}>
      {tids.map(tid => {
        const t = BATERIA.find(x => x.id === tid);
        if (!t) return null;
        const open = openTest === tid;
        const sc = ev.resultados[tid]?.score;
        const omitida = all[tid]?.estado === 'omitida';
        const resumen = omitida ? 'Omitida' : (sc?.primary ? `${sc.primary.label}: ${sc.primary.value ?? '—'}${sc.primary.unit || ''}` : '');
        return <div key={tid} style={{border:`1px solid ${open?C.brandDark:C.border}`, borderRadius:8, overflow:'hidden'}}>
          <div onClick={()=>setOpenTest(open?null:tid)}
            style={{display:'flex', alignItems:'center', gap:10, padding:'11px 14px', cursor:'pointer', background: open ? C.soft : '#fff'}}>
            <div style={{flex:1, minWidth:0}}>
              <b style={{fontSize:14, color:C.brandText}}>{t.nombre}</b>
              {resumen && <span style={{marginLeft:10, fontSize:12.5, color:C.ink2}}>{resumen}</span>}
            </div>
            <span style={{fontSize:16, color:C.ink2}}>{open?'▾':'▸'}</span>
          </div>
          {open && <div style={{padding:'12px 14px', borderTop:`1px solid ${C.border}`}}>
            {sc?.norm && <NormBar norm={sc.norm} />}
            {sc?.interpretation && <p style={{fontSize:12.5, fontStyle:'italic', color:C.ink2, margin:'4px 0 10px'}}>{sc.interpretation}</p>}
            {t.id === 'nrs_de_dolor_0_10'
              ? <NRSZonas data={all[tid]?.data || {}} onChange={d=>setData(tid, d)} />
              : t.implementacion === 'items'
              ? <PruebaItems test={t} data={all[tid]?.data || {}} onChange={d=>setData(tid, d)} />
              : (t.fields||[]).map(f => <CampoInput key={f.id} f={f} value={all[tid]?.data?.[f.id]} onChange={v=>setData(tid, {...(all[tid]?.data || {}), [f.id]: v})} />)}
          </div>}
        </div>;
      })}
    </div>
    {(ev.paraCasa||[]).length > 0 && <p style={{fontSize:12.5, color:C.accentText, marginTop:10}}>
      Pendientes de hacer en casa: {ev.paraCasa.map(id => BATERIA.find(x=>x.id===id)?.nombre || id).join(' · ')}
    </p>}
    {msg && <p style={{fontSize:13, color:C.ok, margin:'10px 0 0'}}>{msg}</p>}
    <div style={{display:'flex', gap:10, marginTop:12}}>
      <Btn onClick={guardar} disabled={!dirty}>Guardar cambios</Btn>
      <Btn v="soft" onClick={onClose}>Cerrar</Btn>
    </div>
  </div>;
}

// ---------- Panel admin ----------
export function Admin({ cfg, evals, onCfg, onBorrarTodas, onCambiarPin, onExportAudit, onBack }) {
  const [pin1, setPin1] = useState('');
  const [pin2, setPin2] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmTodo, setConfirmTodo] = useState(false);
  const antiguos = evals.filter(e => Date.now() - e.ts > cfg.dias*86400000).length;

  const cambiar = async () => {
    setMsg('');
    if (pin1.length < 6) { setMsg('Mínimo 6 caracteres.'); return; }
    if (pin1 !== pin2) { setMsg('No coinciden.'); return; }
    setMsg('Re-cifrando datos…');
    await onCambiarPin(pin1);
    setPin1(''); setPin2(''); setMsg('PIN cambiado y datos re-cifrados con la nueva clave.');
  };

  return <Page title="Panel de administración" onBack={onBack}>
    <div style={{display:'grid', gap:14}}>

      <div style={S.card}>
        <b>Estado</b>
        <p style={{fontSize:14, margin:'8px 0 0', lineHeight:1.8}}>
          Evaluaciones temporales en el dispositivo: <b>{evals.length}</b><br/>
          Evaluaciones con más de {cfg.dias} días (deberían ser 0): <b style={{color: antiguos?C.danger:C.ok}}>{antiguos} {antiguos===0?'✓':'⚠ se borrarán al recargar'}</b><br/>
          Versión de la app: <b>{APP_VERSION}</b> · Versión del consentimiento: <b>{CONSENT_VERSION}</b>
        </p>
      </div>

      <div style={S.card}>
        <b>Plazos y bloqueo</b>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:10}}>
          <Field label="Días hasta borrado automático" help="Por defecto 7. El borrado se ejecuta cada vez que se desbloquea la app.">
            <input type="number" min="1" max="30" style={S.input} value={cfg.dias}
              onChange={e=>onCfg({ dias: Math.max(1, Math.min(30, +e.target.value || 7)) })} />
          </Field>
          <Field label="Minutos de inactividad hasta bloqueo">
            <input type="number" min="1" max="60" style={S.input} value={cfg.inactividadMin ?? 5}
              onChange={e=>onCfg({ inactividadMin: Math.max(1, Math.min(60, +e.target.value || 5)) })} />
          </Field>
        </div>
      </div>

      <UsuariosCard cfg={cfg} onCfg={onCfg} />

      <div style={S.card}>
        <b>Cambiar PIN</b>
        <p style={{fontSize:12, color:C.ink2, margin:'6px 0 10px'}}>Se re-cifran todos los datos con la nueva clave. No cierres la app durante el proceso.</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
          <input type="password" placeholder="Nuevo PIN (mín. 6)" style={S.input} value={pin1} onChange={e=>setPin1(e.target.value)} />
          <input type="password" placeholder="Repetir" style={S.input} value={pin2} onChange={e=>setPin2(e.target.value)} />
        </div>
        {msg && <p style={{fontSize:13, color: msg.includes('cambiado')?C.ok:C.warn, margin:'8px 0 0'}}>{msg}</p>}
        <Btn v="ghost" onClick={cambiar} style={{marginTop:10}}>Cambiar PIN</Btn>
      </div>

      <div style={S.card}>
        <b>Trazabilidad</b>
        <p style={{fontSize:12, color:C.ink2, margin:'6px 0 10px'}}>Registro mínimo (fecha, evento, cliente, entrenador). Sin datos de salud.</p>
        <Btn v="ghost" onClick={onExportAudit}>Exportar registro (CSV)</Btn>
      </div>

      <div style={{...S.card, borderColor:C.danger}}>
        <b style={{color:C.danger}}>Zona de borrado</b>
        {!confirmTodo
          ? <div style={{marginTop:10}}><Btn v="danger" onClick={()=>setConfirmTodo(true)}>Borrar TODAS las evaluaciones</Btn></div>
          : <div style={{marginTop:10}}>
              <p style={{fontSize:14, color:C.danger, margin:'0 0 10px'}}>Esto elimina de forma irreversible las {evals.length} evaluaciones del dispositivo (el registro de trazabilidad se conserva). ¿Confirmar?</p>
              <div style={{display:'flex', gap:10}}>
                <Btn v="danger" onClick={()=>{ onBorrarTodas(); setConfirmTodo(false); }}>Sí, borrar todo</Btn>
                <Btn v="soft" onClick={()=>setConfirmTodo(false)}>Cancelar</Btn>
              </div>
            </div>}
      </div>
    </div>
  </Page>;
}

// ---------- Gestión de usuarios y accesos (solo admins) ----------
function UsuariosCard({ cfg, onCfg }) {
  const usuarios = cfg.usuarios || [];
  const [nu, setNu] = useState({ nombre:'', pass:'', rol:'entrenador' });
  const [resetId, setResetId] = useState(null);
  const [resetPass, setResetPass] = useState('');
  const [msg, setMsg] = useState('');

  const slug = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w]/g,'').toLowerCase();
  const nAdmins = usuarios.filter(u=>u.rol==='admin').length;

  const crear = async () => {
    setMsg('');
    const nombre = nu.nombre.trim();
    if (nombre.length < 2) { setMsg('Nombre demasiado corto.'); return; }
    if (nu.pass.length < 8) { setMsg('La contraseña debe tener al menos 8 caracteres.'); return; }
    const id = slug(nombre);
    if (usuarios.some(u=>u.id===id)) { setMsg('Ya existe un usuario con ese nombre.'); return; }
    const pass = await hashPassword(nu.pass);
    onCfg({ usuarios: [...usuarios, { id, nombre, rol: nu.rol, pass }] });
    setNu({ nombre:'', pass:'', rol:'entrenador' });
    setMsg(`Acceso creado para ${nombre} (${nu.rol}).`);
  };

  const restablecer = async () => {
    if (resetPass.length < 8) { setMsg('La nueva contraseña debe tener al menos 8 caracteres.'); return; }
    const pass = await hashPassword(resetPass);
    onCfg({ usuarios: usuarios.map(u => u.id===resetId ? {...u, pass} : u) });
    setMsg(`Contraseña actualizada para ${usuarios.find(u=>u.id===resetId)?.nombre}.`);
    setResetId(null); setResetPass('');
  };

  const eliminar = (u) => {
    if (u.rol==='admin' && nAdmins<=1) { setMsg('No se puede eliminar el último admin.'); return; }
    onCfg({ usuarios: usuarios.filter(x=>x.id!==u.id) });
    setMsg(`Acceso de ${u.nombre} eliminado.`);
  };

  return <div style={S.card}>
    <b>Usuarios y accesos</b>
    <p style={{fontSize:12, color:C.ink2, margin:'6px 0 10px'}}>
      Los <b>admins</b> pueden crear fichas y accesos para entrenadores. No existen contraseñas predeterminadas. Cada acceso debe utilizar una contraseña propia de al menos 8 caracteres.
    </p>
    <div style={{display:'grid', gap:8, marginBottom:14}}>
      {usuarios.map(u => <div key={u.id} style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:`1px solid ${C.border}`, borderRadius:8, flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:120}}>
          <b style={{fontSize:14}}>{u.nombre}</b>
          <span style={{marginLeft:8, fontSize:11, background: u.rol==='admin' ? C.brand : C.soft, color: u.rol==='admin' ? C.brandText : C.ink2, padding:'2px 8px', borderRadius:10, textTransform:'uppercase', letterSpacing:.5}}>{u.rol}</span>
        </div>
        <Btn v="soft" style={{padding:'6px 12px', fontSize:12}} onClick={()=>{setResetId(u.id===resetId?null:u.id); setResetPass(''); setMsg('');}}>Nueva contraseña</Btn>
        <Btn v="danger" style={{padding:'6px 12px', fontSize:12}} onClick={()=>eliminar(u)}>Eliminar</Btn>
        {resetId===u.id && <div style={{width:'100%', display:'flex', gap:8, marginTop:6}}>
          <input type="password" placeholder="Nueva contraseña (mín. 8)" style={{...S.input, flex:1}} value={resetPass} onChange={e=>setResetPass(e.target.value)} />
          <Btn v="ghost" style={{padding:'8px 14px', fontSize:13}} onClick={restablecer}>Guardar</Btn>
        </div>}
      </div>)}
    </div>
    <b style={{fontSize:13}}>Crear nuevo acceso</b>
    <div style={{display:'grid', gridTemplateColumns:'2fr 2fr 1fr', gap:10, marginTop:8}}>
      <input style={S.input} placeholder="Nombre" value={nu.nombre} onChange={e=>setNu({...nu, nombre:e.target.value})} />
      <input type="password" style={S.input} placeholder="Contraseña (mín. 8)" value={nu.pass} onChange={e=>setNu({...nu, pass:e.target.value})} />
      <select style={S.input} value={nu.rol} onChange={e=>setNu({...nu, rol:e.target.value})}>
        <option value="entrenador">Entrenador</option>
        <option value="admin">Admin</option>
      </select>
    </div>
    <Btn v="ghost" onClick={crear} style={{marginTop:10}}>Crear acceso</Btn>
    {msg && <p style={{fontSize:13, color: msg.includes('creado')||msg.includes('actualizada')||msg.includes('eliminado') ? C.ok : C.warn, margin:'8px 0 0'}}>{msg}</p>}
  </div>;
}

// ---------- Ayuda / protocolo ----------
export function Ayuda({ onBack }) {
  return <Page title="Protocolo y ayuda" onBack={onBack}>
    <div style={S.card}>
      <b style={{fontSize:16, color:C.brandText}}>Protocolo KoKo Trainer</b>
      <ol style={{fontSize:14, lineHeight:1.9, paddingLeft:20, margin:'10px 0 0'}}>
        {PROTOCOLO.map((p,i)=><li key={i}>{p}</li>)}
      </ol>
    </div>
    <div style={{...S.card, marginTop:14}}>
      <b style={{fontSize:15, color:C.brandText}}>Lenguaje en sala y en informes</b>
      <p style={{fontSize:14, lineHeight:1.7, margin:'8px 0 0'}}>
        Nunca usar: diagnóstico, tratamiento, paciente, terapia, patología detectada, historia clínica, prescripción.<br/>
        Usar siempre: cliente, evaluación física, valoración funcional, observación relevante, limitación comunicada,
        dato a tener en cuenta para adaptar el entrenamiento, recomendable consultar con profesional sanitario si procede.
      </p>
    </div>
    <div style={{...S.card, marginTop:14, background:'#fff8ee', borderColor:C.warn}}>
      <b style={{fontSize:15, color:C.warn}}>Limitaciones técnicas conocidas</b>
      <ul style={{fontSize:13, lineHeight:1.8, paddingLeft:20, margin:'8px 0 0'}}>
        <li>El borrado automático se ejecuta al desbloquear la app: si nadie la abre, los datos siguen cifrados en el dispositivo hasta la siguiente apertura.</li>
        <li>Una PWA no puede impedir capturas de pantalla del sistema. No dejar la tablet desatendida con datos en pantalla.</li>
        <li>Si se olvida el PIN, los datos son irrecuperables por diseño (cifrado real).</li>
        <li>Borrar los datos de navegación de Chrome elimina también los datos de la app.</li>
      </ul>
    </div>
  </Page>;
}