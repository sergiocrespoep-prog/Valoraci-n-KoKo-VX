// VISTAS — bloqueo, inicio, alta de evaluación, consentimiento y selección de pruebas.
import { useState, useMemo } from 'react';
import { BATERIA } from './bateria.js';
import { PERFILES, sugerirPerfil } from './perfiles.js';
import { TestInfoIcons } from './motor.jsx';
import { deriveKey, newSalt, createVerifier, checkVerifier, hashPassword, verifyPassword } from './crypto.js';
import * as DB from './db.js';
import { C, S, Btn, Field, Page, FirmaPad, CONSENT_TEXTO, CONSENT_VERSION } from './ui.jsx';

// ---------- Bloqueo / configuración inicial ----------
export function LockScreen({ onUnlock }) {
  const cfg = DB.getCfg();
  const setup = !cfg.salt;
  const needsAdmin = setup || !cfg.usuarios?.length;
  const [pin, setPin] = useState('');
  const [pin2, setPin2] = useState('');
  const [adminNombre, setAdminNombre] = useState('Sergio');
  const [adminPass, setAdminPass] = useState('');
  const [adminPass2, setAdminPass2] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const validarAdmin = () => {
    if (!needsAdmin) return null;
    if (adminNombre.trim().length < 2) return 'Indica el nombre del primer administrador.';
    if (adminPass.length < 8) return 'La contraseña del administrador debe tener al menos 8 caracteres.';
    if (adminPass !== adminPass2) return 'Las contraseñas del administrador no coinciden.';
    return null;
  };

  const crearAdmin = async () => {
    const pass = await hashPassword(adminPass);
    const id = adminNombre.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\w]/g,'').toLowerCase() || 'admin';
    return { id, nombre:adminNombre.trim(), rol:'admin', pass };
  };

  const go = async () => {
    setErr(''); setBusy(true);
    try {
      const errorAdmin = validarAdmin();
      if (errorAdmin) { setErr(errorAdmin); setBusy(false); return; }

      if (setup) {
        if (pin.length < 6) { setErr('El PIN de cifrado debe tener al menos 6 caracteres.'); setBusy(false); return; }
        if (pin !== pin2) { setErr('Los PIN no coinciden.'); setBusy(false); return; }
        const salt = newSalt();
        const key = await deriveKey(pin, salt);
        const verifier = await createVerifier(key);
        const admin = await crearAdmin();
        DB.setCfg({
          salt, verifier, dias:7, inactividadMin:5,
          entrenadores:[admin.nombre],
          usuarios:[admin]
        });
        await DB.requestPersist();
        onUnlock(key);
      } else {
        const key = await deriveKey(pin, cfg.salt);
        const ok = await checkVerifier(key, cfg.verifier);
        if (!ok) { setErr('PIN incorrecto.'); setBusy(false); return; }
        if (needsAdmin) {
          const admin = await crearAdmin();
          DB.setCfg({ usuarios:[admin], entrenadores:[admin.nombre] });
        }
        onUnlock(key);
      }
    } catch {
      setErr('Error inesperado. No se ha modificado la configuración.');
    }
    setBusy(false);
  };

  const resetAll = async () => {
    await DB.wipeAll();
    localStorage.removeItem('koko_cfg');
    location.reload();
  };

  return <div style={{minHeight:'100vh', background:C.brand, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
    <div style={{background:'#fff', borderRadius:14, padding:'34px 30px', maxWidth:460, width:'100%'}}>
      <div style={{background:C.negro, borderRadius:12, padding:'18px 12px 14px', marginBottom:18, textAlign:'center'}}>
        <img src="/logo.png" alt="" style={{maxHeight:80, maxWidth:'70%', marginBottom:6}} onError={e=>{e.currentTarget.style.display='none';}} />
        <div style={{fontSize:30, fontWeight:800, letterSpacing:6, color:C.brand}}>KOKO</div>
        <div style={{fontSize:10, letterSpacing:5, color:'#878787', marginTop:3}}>FITNESS EXPERIENCE</div>
      </div>
      <div style={{textAlign:'center', marginBottom:22}}>
        <h1 style={{margin:'6px 0 2px', fontSize:24, color:C.brandText}}>Valoraciones Espacio KoKo</h1>
        <p style={{fontSize:13, color:C.ink2, margin:0}}>{setup ? 'Primera configuración' : 'Introduce el PIN para desbloquear'}</p>
      </div>
      <input type="password" autoFocus placeholder={setup ? 'Nuevo PIN de cifrado (mínimo 6)' : 'PIN de cifrado'}
        value={pin} onChange={e=>setPin(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!setup&&!needsAdmin&&go()}
        style={{...S.input, textAlign:'center', fontSize:20, letterSpacing:4, marginBottom:12}} />
      {setup && <input type="password" placeholder="Repite el PIN de cifrado"
        value={pin2} onChange={e=>setPin2(e.target.value)}
        style={{...S.input, textAlign:'center', fontSize:20, letterSpacing:4, marginBottom:12}} />}
      {needsAdmin && <div style={{borderTop:`1px solid ${C.border}`, marginTop:8, paddingTop:14}}>
        <p style={{fontSize:13, color:C.ink2, margin:'0 0 10px'}}>Crea el primer acceso de administrador. Esta versión no incluye contraseñas predeterminadas.</p>
        <input placeholder="Nombre del administrador" value={adminNombre} onChange={e=>setAdminNombre(e.target.value)}
          style={{...S.input, marginBottom:10}} />
        <input type="password" placeholder="Contraseña del administrador (mínimo 8)" value={adminPass} onChange={e=>setAdminPass(e.target.value)}
          style={{...S.input, marginBottom:10}} />
        <input type="password" placeholder="Repite la contraseña" value={adminPass2} onChange={e=>setAdminPass2(e.target.value)}
          onKeyDown={e=>e.key==='Enter'&&go()} style={{...S.input, marginBottom:12}} />
      </div>}
      {err && <p style={{color:C.danger, fontSize:13, textAlign:'center'}}>{err}</p>}
      <Btn full onClick={go} disabled={busy}>{busy ? 'Comprobando…' : setup ? 'Configurar y empezar' : 'Desbloquear'}</Btn>
      {setup && <p style={{fontSize:12, color:C.ink2, marginTop:14, lineHeight:1.5}}>
        El PIN cifra todos los datos del dispositivo. <b>Si se pierde, los datos no se pueden recuperar.</b>
      </p>}
      {!setup && <div style={{marginTop:18, textAlign:'center'}}>
        {!confirmReset
          ? <button onClick={()=>setConfirmReset(true)} style={{background:'none', border:'none', color:C.ink2, fontSize:12, cursor:'pointer', textDecoration:'underline'}}>He olvidado el PIN</button>
          : <div style={{background:'#fdf2f2', border:`1px solid ${C.danger}`, borderRadius:8, padding:12}}>
              <p style={{fontSize:13, color:C.danger, margin:'0 0 10px'}}>La única opción es restablecer la app y borrar todos los datos cifrados. ¿Continuar?</p>
              <div style={{display:'flex', gap:8, justifyContent:'center'}}>
                <Btn v="danger" onClick={resetAll} style={{padding:'8px 14px', fontSize:13}}>Borrar todo</Btn>
                <Btn v="soft" onClick={()=>setConfirmReset(false)} style={{padding:'8px 14px', fontSize:13}}>Cancelar</Btn>
              </div>
            </div>}
      </div>}
    </div>
  </div>;
}

// ---------- Selección de usuario (tras desbloquear con el PIN) ----------
export function UserLogin({ cfg, onLogin }) {
  const usuarios = cfg.usuarios || [];
  const [sel, setSel] = useState(null);
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [fallos, setFallos] = useState(0);
  const [bloqueadoHasta, setBloqueadoHasta] = useState(0);

  const go = async () => {
    if (Date.now() < bloqueadoHasta) {
      setErr('Demasiados intentos. Espera 30 segundos.');
      return;
    }
    const u = usuarios.find(x => x.id === sel);
    if (!u) { setErr('Selecciona tu usuario.'); return; }
    setBusy(true); setErr('');
    const ok = await verifyPassword(pass, u.pass);
    if (!ok) {
      const n = fallos + 1;
      if (n >= 5) {
        setBloqueadoHasta(Date.now() + 30000);
        setFallos(0);
        setErr('Demasiados intentos. Acceso bloqueado durante 30 segundos.');
      } else {
        setFallos(n);
        setErr(`Contraseña incorrecta. Intento ${n} de 5.`);
      }
      setBusy(false);
      return;
    }

    // Migra de forma transparente los hashes SHA-256 de versiones anteriores.
    if (!String(u.pass).startsWith('pbkdf2$')) {
      const nuevo = await hashPassword(pass);
      DB.setCfg({ usuarios: usuarios.map(x => x.id === u.id ? {...x, pass:nuevo} : x) });
    }
    setBusy(false);
    setFallos(0);
    onLogin({ id:u.id, nombre:u.nombre, rol:u.rol });
  };

  if (!usuarios.length) return <div style={{padding:30}}>No hay usuarios configurados. Vuelve a bloquear la app y crea un administrador.</div>;

  return <div style={{minHeight:'100vh', background:C.brand, display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
    <div style={{background:'#fff', borderRadius:14, padding:'34px 30px', maxWidth:430, width:'100%'}}>
      <div style={{textAlign:'center', marginBottom:20}}>
        <div style={{fontSize:12, letterSpacing:2, color:C.ink2, textTransform:'uppercase'}}>KoKo Trainer</div>
        <h1 style={{margin:'6px 0 2px', fontSize:22, color:C.brandText}}>¿Quién eres?</h1>
        <p style={{fontSize:13, color:C.ink2, margin:0}}>Selecciona tu usuario e introduce tu contraseña</p>
      </div>
      <div style={{display:'grid', gap:8, marginBottom:14}}>
        {usuarios.map(u => <button key={u.id} onClick={()=>{setSel(u.id); setErr(''); setPass('');}} style={{
          display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 16px', borderRadius:8,
          fontSize:15, fontWeight:600, cursor:'pointer', fontFamily:'inherit',
          border:`1px solid ${sel===u.id?C.brandDark:C.border}`, background:sel===u.id?C.brand:'#fff', color:sel===u.id?C.brandText:C.ink}}>
          <span>{u.nombre}</span>
          <span style={{fontSize:11, fontWeight:400, opacity:.8, textTransform:'uppercase', letterSpacing:1}}>{u.rol}</span>
        </button>)}
      </div>
      {sel && <input type="password" autoFocus placeholder="Contraseña"
        value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}
        style={{...S.input, textAlign:'center', fontSize:18, marginBottom:12}} />}
      {err && <p style={{color:C.danger, fontSize:13, textAlign:'center'}}>{err}</p>}
      <Btn full onClick={go} disabled={busy || !sel || Date.now()<bloqueadoHasta}>{busy ? 'Comprobando…' : 'Entrar'}</Btn>
    </div>
  </div>;
}

// ---------- Inicio ----------
export function Home({ evals, cfg, purgadas, go, user, onLogout }) {
  const pendientes = evals.length;
  const esAdmin = user?.rol === 'admin';
  return <Page title="Valoraciones Espacio KoKo" sub="Evaluación física y funcional no clínica">
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14, fontSize:13, color:C.ink2}}>
      <span>Sesión: <b style={{color:C.ink}}>{user?.nombre}</b> ({user?.rol})</span>
      <button onClick={onLogout} style={{background:'none', border:'none', color:C.brandText, fontSize:13, cursor:'pointer', textDecoration:'underline'}}>Cambiar de usuario</button>
    </div>
    {purgadas > 0 && <div style={{background:'#eef7f1', border:`1px solid ${C.ok}`, borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:14}}>
      Se han borrado automáticamente {purgadas} evaluación(es) que superaban los {cfg.dias} días.
    </div>}
    {pendientes > 0 && <div style={{background:'#fff8ee', border:`1px solid ${C.warn}`, borderRadius:8, padding:'10px 14px', marginBottom:14, fontSize:14}}>
      Hay <b>{pendientes}</b> evaluación(es) temporal(es) en el dispositivo. Exportar y borrar tras generar el informe (máx. {cfg.dias} días).
    </div>}
    <div style={{display:'grid', gap:12}}>
      <Btn full onClick={()=>go('nueva')} style={{padding:'20px', fontSize:17}}>+ Nueva ficha / evaluación</Btn>
      <div style={{display:'grid', gridTemplateColumns: esAdmin ? '1fr 1fr' : '1fr', gap:12}}>
        <Btn v="ghost" onClick={()=>go('temporales')}>Evaluaciones temporales ({pendientes})</Btn>
        {esAdmin && <Btn v="ghost" onClick={()=>go('admin')}>Panel admin</Btn>}
      </div>
      <Btn v="soft" onClick={()=>go('ayuda')}>Protocolo y ayuda</Btn>
    </div>
    <p style={{fontSize:12, color:C.ink2, marginTop:22, lineHeight:1.6}}>
      Los datos de cada evaluación se guardan <b>cifrados y solo en esta tablet</b>, durante un máximo de {cfg.dias} días.
      Esta app no realiza diagnósticos ni envía datos a internet. Responsable: Espacio KoKo S.L. (CIF B06913354) · espaciokoko@gmail.com
    </p>
  </Page>;
}

// Chips de selección múltiple (para objetivo, dolor y situación en la ficha)
function Chips({ options, value = [], onChange }) {
  const toggle = o => onChange(value.includes(o) ? value.filter(x => x !== o) : [...value, o]);
  return <div style={{display:'flex', flexWrap:'wrap', gap:8}}>
    {options.map(o => { const on = value.includes(o);
      return <button key={o} type="button" onClick={()=>toggle(o)} style={{
        padding:'9px 14px', borderRadius:20, fontSize:13.5, cursor:'pointer', fontFamily:'inherit', fontWeight: on?700:400,
        border:`1px solid ${on?C.brandDark:C.border}`, background: on?C.brand:'#fff', color: on?C.brandText:C.ink}}>
        {on?'✓ ':''}{o}</button>; })}
  </div>;
}

// ---------- Alta de evaluación ----------
export function NuevaEval({ cfg, user, onNext, onBack }) {
  const entrenadores = (cfg.usuarios?.map(u=>u.nombre)) || cfg.entrenadores || [];
  const [d, setD] = useState({ modalidad:'Presencial', tipoEval:'Inicial', entrenador: user?.nombre || entrenadores[0] || '' });
  const set = (k,v) => setD(p=>({...p,[k]:v}));
  const ok = (d.nombre||'').trim().length >= 3 && (d.email||'').includes('@') && d.entrenador;
  return <Page title="Nueva evaluación" sub="Datos del cliente" onBack={onBack}>
    <div style={S.card}>
      <Field label="Nombre y apellidos *"><input style={S.input} value={d.nombre||''} onChange={e=>set('nombre',e.target.value)} /></Field>
      <Field label="Email *"><input style={S.input} type="email" value={d.email||''} onChange={e=>set('email',e.target.value)} /></Field>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
        <Field label="Teléfono (opcional)"><input style={S.input} inputMode="tel" value={d.tel||''} onChange={e=>set('tel',e.target.value)} /></Field>
        <Field label="Edad"><input style={S.input} type="number" min="18" max="99" value={d.edad||''} onChange={e=>set('edad',e.target.value)} /></Field>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
        <Field label="Sexo (si es relevante para la valoración)">
          <select style={S.input} value={d.sexo||''} onChange={e=>set('sexo',e.target.value)}>
            <option value="">—</option><option>Mujer</option><option>Hombre</option><option>Otro</option>
          </select>
        </Field>
        <Field label="Modalidad">
          <select style={S.input} value={d.modalidad} onChange={e=>set('modalidad',e.target.value)}>
            <option>Presencial</option><option>Online</option>
          </select>
        </Field>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
        <Field label="Tipo de evaluación">
          <select style={S.input} value={d.tipoEval} onChange={e=>set('tipoEval',e.target.value)}>
            <option>Inicial</option><option>Reevaluación</option><option>Seguimiento / check-in</option>
          </select>
        </Field>
        <Field label="Entrenador responsable *">
          <select style={S.input} value={d.entrenador} onChange={e=>set('entrenador',e.target.value)}>
            {entrenadores.map(x=><option key={x}>{x}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Objetivo principal (puedes marcar varios)" help="Se usa para sugerir el perfil de pruebas.">
        <Chips options={['Salud general','Pérdida de peso','Ganar fuerza / masa muscular','Rendimiento deportivo','Mejorar dolor / molestias','Movilidad y autonomía']}
          value={d.objetivos||[]} onChange={v=>set('objetivos',v)} />
      </Field>
      <Field label="¿Dolor o molestia actual? (marca las zonas que apliquen; ninguna = sin dolor)">
        <Chips options={['Lumbar / espalda','Cuello / cervical','Hombro / brazo','Rodilla / cadera','Otra zona']}
          value={d.dolorZonas||[]} onChange={v=>set('dolorZonas',v)} />
      </Field>
      <Field label="Situación especial (puedes marcar varias)">
        <Chips options={['Embarazo','Postparto (<12 meses)','Menopausia']}
          value={d.situaciones||[]} onChange={v=>set('situaciones',v)} />
      </Field>
      <Field label="Observaciones generales"><textarea style={{...S.input, minHeight:70}} value={d.observaciones||''} onChange={e=>set('observaciones',e.target.value)} /></Field>
      <Btn full disabled={!ok} onClick={()=>onNext(d)}>Continuar al consentimiento →</Btn>
    </div>
  </Page>;
}

// ---------- Consentimiento RGPD ----------
export function Consentimiento({ cliente, onAccept, onReject, onBack }) {
  const [checked, setChecked] = useState(false);
  const [nombre, setNombre] = useState(cliente.nombre || '');
  const [firma, setFirma] = useState(null);
  const ok = checked && nombre.trim().length >= 3 && firma;
  return <Page title="Consentimiento RGPD" sub="Debe aceptarse antes de comenzar" onBack={onBack}>
    <div style={S.card}>
      <div style={{maxHeight:280, overflowY:'auto', background:C.soft, borderRadius:8, padding:16, fontSize:14, lineHeight:1.65, whiteSpace:'pre-line', marginBottom:16}}>
        {CONSENT_TEXTO}
      </div>
      <label style={{display:'flex', gap:12, alignItems:'flex-start', marginBottom:16, cursor:'pointer'}}>
        <input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)} style={{width:22, height:22, marginTop:2}} />
        <span style={{fontSize:14}}>He leído y <b>acepto expresamente</b> el tratamiento de mis datos descrito arriba (versión {CONSENT_VERSION}).</span>
      </label>
      <Field label="Nombre completo del cliente"><input style={S.input} value={nombre} onChange={e=>setNombre(e.target.value)} /></Field>
      <Field label="Firma del cliente"><FirmaPad onChange={setFirma} /></Field>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:10}}>
        <Btn full disabled={!ok} onClick={()=>onAccept({ ts: Date.now(), version: CONSENT_VERSION, nombre: nombre.trim(), firma })}>
          Acepto y comienzo la evaluación
        </Btn>
        <Btn v="soft" full onClick={onReject}>No acepto</Btn>
      </div>
      <p style={{fontSize:12, color:C.ink2, marginTop:10}}>Se registra fecha y hora automáticamente. Sin aceptación no es posible continuar.</p>
    </div>
  </Page>;
}

// ---------- Selección de bloques y pruebas ----------
// Selección libre o por perfil de cliente. Las pruebas que se pueden hacer en casa
// pueden marcarse "para casa": no se hacen ahora y quedan señaladas en el informe
// para que el entrenador las envíe al correo del cliente.
export function Bloques({ cliente, onStart, onBack }) {
  const cats = useMemo(() => {
    const m = new Map();
    for (const t of BATERIA) { if (!m.has(t.categoria)) m.set(t.categoria, []); m.get(t.categoria).push(t); }
    return [...m.entries()];
  }, []);
  const [openCat, setOpenCat] = useState(null);
  const [sel, setSel] = useState(new Set(['checklist_de_banderas_rojas_dolor']));
  const [casa, setCasa] = useState(new Set());
  const [perfilAct, setPerfilAct] = useState(null);

  const sug = useMemo(() => sugerirPerfil(cliente), [cliente]);
  const sugPerfil = sug ? PERFILES.find(p => p.id === sug.perfilId) : null;

  // Aplicar un perfil: las pruebas de solo-casa se marcan automáticamente "para casa"
  const aplicarPerfil = (p, extras = []) => {
    const ids = [...new Set([...p.tests, ...extras])];
    const nSel = new Set(), nCasa = new Set();
    for (const id of ids) {
      const t = BATERIA.find(x => x.id === id);
      if (!t) continue;
      if (t.donde === 'Casa') nCasa.add(id); else nSel.add(id);
    }
    setSel(nSel); setCasa(nCasa); setPerfilAct(p.id); setOpenCat(null);
  };

  const seleccionLibre = () => { setSel(new Set(['checklist_de_banderas_rojas_dolor'])); setCasa(new Set()); setPerfilAct(null); };

  const toggle = id => {
    setCasa(c => { const n = new Set(c); n.delete(id); return n; });
    setSel(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };
  const toggleCasa = (id) => {
    setCasa(c => { const n = new Set(c); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setSel(p => { const n = new Set(p); n.delete(id); return n; });
  };
  const toggleCat = (tests) => setSel(p => {
    const n = new Set(p); const all = tests.every(t=>n.has(t.id) || casa.has(t.id));
    tests.forEach(t => { if (all) { n.delete(t.id); } else if (!casa.has(t.id)) n.add(t.id); });
    if (all) setCasa(c => { const nc = new Set(c); tests.forEach(t=>nc.delete(t.id)); return nc; });
    return n;
  });

  const total = sel.size + casa.size;

  return <Page title="Pruebas a realizar" sub={`${sel.size} en sala${casa.size ? ` · ${casa.size} para casa` : ''}`} onBack={onBack}>

    {sugPerfil && <div style={{background:'#f0f6f8', border:`1px solid ${C.brand}`, borderRadius:10, padding:'12px 16px', marginBottom:12}}>
      <div style={{fontSize:14}}>Perfil sugerido según la ficha: <b style={{color:C.brandText}}>{sugPerfil.nombre}</b>
        <span style={{color:C.ink2}}> ({sug.motivo}{sug.extras.length ? ' · incluye cuestionarios de la zona de dolor' : ''})</span></div>
      <div style={{marginTop:8}}>
        <Btn onClick={()=>aplicarPerfil(sugPerfil, sug.extras)} style={{padding:'8px 14px', fontSize:13}}>Aplicar perfil sugerido</Btn>
      </div>
    </div>}

    <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:8}}>
      <button onClick={seleccionLibre} style={S.btn(perfilAct===null?'primary':'soft',{padding:'8px 12px', fontSize:12.5})}>Selección libre</button>
      {PERFILES.map(p => <button key={p.id} onClick={()=>aplicarPerfil(p, sug?.perfilId===p.id ? sug.extras : [])}
        style={S.btn(perfilAct===p.id?'primary':'soft',{padding:'8px 12px', fontSize:12.5})}>{p.nombre}</button>)}
    </div>
    {perfilAct && <p style={{fontSize:12.5, color:C.ink2, margin:'0 0 12px'}}>{PERFILES.find(p=>p.id===perfilAct)?.desc} Puedes añadir o quitar cualquier prueba.</p>}
    {!perfilAct && <p style={{fontSize:13, color:C.ink2, margin:'0 0 12px'}}>Elige un perfil para preseleccionar pruebas o marca libremente. Toca una categoría para desplegarla.</p>}

    <div style={{display:'grid', gap:10}}>
      {cats.map(([cat, tests]) => {
        const nSel = tests.filter(t=>sel.has(t.id)).length;
        const nCasa = tests.filter(t=>casa.has(t.id)).length;
        const open = openCat === cat;
        return <div key={cat} style={{...S.card, padding:0, overflow:'hidden'}}>
          <div style={{display:'flex', alignItems:'center', padding:'14px 16px', cursor:'pointer', background: (nSel+nCasa)? '#f0f6f8':'#fff'}}
               onClick={()=>setOpenCat(open?null:cat)}>
            <div style={{flex:1, fontWeight:600, fontSize:15}}>{cat} <span style={{color:C.ink2, fontWeight:400}}>({nSel}{nCasa?`+${nCasa}🏠`:''}/{tests.length})</span></div>
            <button onClick={e=>{e.stopPropagation(); toggleCat(tests);}} style={S.btn('soft',{padding:'6px 12px', fontSize:12})}>
              {tests.every(t=>sel.has(t.id)||casa.has(t.id)) ? 'Quitar todas' : 'Todas'}
            </button>
            <span style={{marginLeft:10, fontSize:18, color:C.ink2}}>{open?'▾':'▸'}</span>
          </div>
          {open && <div style={{borderTop:`1px solid ${C.border}`}}>
            {tests.map(t => {
              const enCasa = casa.has(t.id);
              const marcada = sel.has(t.id);
              return <div key={t.id} onClick={()=>toggle(t.id)}
                style={{display:'flex', gap:12, padding:'12px 16px', borderBottom:`1px solid ${C.soft}`, cursor:'pointer',
                        background: enCasa ? '#fdf6ee' : marcada ? '#eef5f7' : '#fff'}}>
                <div style={{width:22, height:22, borderRadius:6, flexShrink:0, marginTop:2,
                  border:`2px solid ${marcada?C.brandDark: enCasa?C.accent:C.border}`, background: marcada?C.brand: enCasa?C.accent:'#fff',
                  color:C.brandText, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13}}>{marcada?'✓': enCasa?'🏠':''}</div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:14, fontWeight:600}}>{t.nombre}
                    <span style={{marginLeft:8, fontSize:11, background:C.soft, color:C.ink2, padding:'2px 8px', borderRadius:10}}>{t.donde}</span>
                    <span style={{marginLeft:4, fontSize:11, background:C.soft, color:C.ink2, padding:'2px 8px', borderRadius:10}}>{t.tiempo}</span>
                  </div>
                  <div style={{fontSize:12, color:C.ink2, marginTop:2}}>{t.reglaUso}</div>
                  {enCasa && <div style={{fontSize:12, color:C.accent, fontWeight:600, marginTop:2}}>Señalada para hacer en casa: se enviará al cliente, no se hace ahora.</div>}
                </div>
                <div style={{display:'flex', gap:5, alignSelf:'center', flexShrink:0}}><TestInfoIcons test={t} small /></div>
                {t.donde !== 'Centro' && <button onClick={e=>{e.stopPropagation(); toggleCasa(t.id);}}
                  style={S.btn(enCasa?'accent':'soft',{padding:'6px 10px', fontSize:11.5, alignSelf:'center', flexShrink:0})}>
                  {enCasa ? 'Quitar de casa' : '🏠 Para casa'}
                </button>}
              </div>;
            })}
          </div>}
        </div>;
      })}
    </div>
    <div style={{position:'sticky', bottom:12, marginTop:16}}>
      <Btn full disabled={total===0} onClick={()=>onStart([...sel], [...casa])}>
        {sel.size>0 ? `Empezar (${sel.size} en sala${casa.size?` · ${casa.size} para casa`:''}) →` : `Registrar solo pruebas para casa (${casa.size}) →`}
      </Btn>
    </div>
  </Page>;
}