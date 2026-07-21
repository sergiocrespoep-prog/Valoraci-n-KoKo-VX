// APP PRINCIPAL — máquina de estados, bloqueo por inactividad, purga automática y trazabilidad.
import { useState, useEffect, useRef, useCallback } from 'react';
import * as DB from './db.js';
import { deriveKey, newSalt, createVerifier } from './crypto.js';
import { BATERIA } from './bateria.js';
import * as EXP from './export.js';
import { LockScreen, UserLogin, Home, NuevaEval, Consentimiento, Bloques } from './vistas.jsx';
import { Runner, validateEvaluation } from './motor.jsx';
import { Resultados, Temporales, Admin, Ayuda } from './paneles.jsx';

export default function App() {
  const [key, setKey] = useState(null);          // CryptoKey en memoria; nunca se persiste
  const [user, setUser] = useState(null);        // usuario activo (admin o entrenador)
  const [cfg, setCfgState] = useState(DB.getCfg());
  const [view, setView] = useState('home');
  const [evals, setEvals] = useState([]);
  const [purgadas, setPurgadas] = useState(0);
  const [draft, setDraft] = useState(null);      // datos del cliente en curso
  const [consent, setConsent] = useState(null);
  const [testsSel, setTestsSel] = useState([]);
  const [testsCasa, setTestsCasa] = useState([]); // pruebas señaladas para hacer en casa (enviar al cliente)
  const [currentEv, setCurrentEv] = useState(null);

  const refresh = useCallback(async (k) => {
    setEvals(await DB.loadEvals(k));
  }, []);

  // Desbloqueo: purga automática + carga
  const onUnlock = async (k) => {
    const c = DB.getCfg();
    const n = await DB.purgeExpired(k, c.dias || 7);
    setPurgadas(n);
    setCfgState(DB.getCfg());
    await refresh(k);
    setKey(k);
    setView('home');
  };

  // Bloqueo por inactividad (la clave se descarta de memoria)
  const timer = useRef(null);
  useEffect(() => {
    if (!key) return;
    const mins = cfg.inactividadMin ?? 5;
    const reset = () => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => { setKey(null); setUser(null); }, mins * 60000);
    };
    const evs = ['pointerdown', 'keydown', 'touchstart'];
    evs.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { clearTimeout(timer.current); evs.forEach(e => window.removeEventListener(e, reset)); };
  }, [key, cfg.inactividadMin]);

  if (!key) return <LockScreen onUnlock={onUnlock} />;
  if (!user) return <UserLogin cfg={cfg} onLogin={async u => {
    setUser(u);
    await DB.logAudit(key, 'acceso_usuario', '—', u.nombre, { rol: u.rol });
  }} />;

  // ---------- Acciones ----------
  const setCfg = (patch) => { DB.setCfg(patch); setCfgState(DB.getCfg()); };

  const onConsentAccept = async (c) => {
    setConsent(c);
    await DB.logAudit(key, 'consentimiento_aceptado', draft.nombre, draft.entrenador, { version: c.version });
    setView('bloques');
  };

  const onConsentReject = async () => {
    await DB.logAudit(key, 'consentimiento_rechazado', draft?.nombre || '¿?', draft?.entrenador || '');
    setDraft(null); setConsent(null);
    setView('home');
  };

  const onRunnerFinish = async (resultados, casaOverride) => {
    const ev = {
      id: DB.uid(), ts: Date.now(),
      cliente: draft, tipoEval: draft.tipoEval, entrenador: draft.entrenador,
      consent, resultados, paraCasa: casaOverride ?? testsCasa, estado: 'pendiente'
    };
    await DB.saveEval(key, ev);
    await DB.logAudit(key, 'evaluacion_creada', draft.nombre, draft.entrenador, { evalId: ev.id });
    await refresh(key);
    setCurrentEv(ev);
    setDraft(null); setConsent(null); setTestsSel([]); setTestsCasa([]);
    setView('resultados');
  };

  const onExport = async (ev, tipo) => {
    const dias = cfg.dias || 7;
    if (tipo === 'html') {
      const errores = validateEvaluation(ev);
      if (errores.length) {
        window.alert('No se puede generar el informe hasta corregir:\n\n• ' + errores.join('\n• '));
        return;
      }
    }
    if (tipo === 'json') EXP.exportarJSON(ev, dias);
    else if (tipo === 'csv') EXP.exportarCSV(ev, dias, BATERIA);
    else EXP.exportarHTML(ev, dias, BATERIA);
    if ((ev.estado || 'pendiente') === 'pendiente') {
      const upd = { ...ev, estado: 'exportada' };
      await DB.saveEval(key, upd);
      if (currentEv?.id === ev.id) setCurrentEv(upd);
    }
    await DB.logAudit(key, 'exportacion', ev.cliente.nombre, ev.entrenador, { evalId: ev.id, formato: tipo });
    await refresh(key);
  };

  const onBorrar = async (ev) => {
    await DB.deleteEval(ev.id);
    await DB.logAudit(key, 'borrado_manual', ev.cliente.nombre, ev.entrenador, { evalId: ev.id });
    await refresh(key);
  };

  const onGuardarEval = async (ev) => {
    await DB.saveEval(key, ev);
    await DB.logAudit(key, 'evaluacion_modificada', ev.cliente.nombre, ev.entrenador, { evalId: ev.id });
    if (currentEv?.id === ev.id) setCurrentEv(ev);
    await refresh(key);
  };

  const onInforme = async (ev) => {
    const upd = { ...ev, estado: 'informe' };
    await DB.saveEval(key, upd);
    await DB.logAudit(key, 'informe_generado', ev.cliente.nombre, ev.entrenador, { evalId: ev.id });
    await refresh(key);
  };

  const onBorrarTodas = async () => {
    for (const ev of evals) await DB.deleteEval(ev.id);
    await DB.logAudit(key, 'borrado_total', `${evals.length} evaluaciones`, 'admin');
    await refresh(key);
  };

  const onCambiarPin = async (nuevoPin) => {
    // Re-cifrado completo con nueva clave derivada de nuevo salt
    const allEvals = await DB.loadEvals(key);
    const allAudit = await DB.loadAudit(key);
    const salt = newSalt();
    const nk = await deriveKey(nuevoPin, salt);
    const verifier = await createVerifier(nk);
    // El cifrado se prepara antes y la sustitución se hace en una sola transacción.
    await DB.replaceAllWithKey(nk, allEvals, allAudit);
    await DB.logAudit(nk, 'cambio_pin', '—', user.nombre);
    DB.setCfg({ salt, verifier });
    setCfgState(DB.getCfg());
    setKey(nk);
    await refresh(nk);
  };

  const onExportAudit = async () => {
    const entries = await DB.loadAudit(key);
    EXP.exportarAuditCSV(entries);
  };

  // ---------- Enrutado ----------
  if (view === 'nueva') return <NuevaEval cfg={cfg} user={user} onBack={()=>setView('home')} onNext={d=>{ setDraft(d); setView('consent'); }} />;
  if (view === 'consent') return <Consentimiento cliente={draft} onBack={()=>setView('nueva')} onAccept={onConsentAccept} onReject={onConsentReject} />;
  if (view === 'bloques') return <Bloques cliente={draft} onBack={()=>setView('consent')} onStart={(ids, casaIds)=>{
    setTestsSel(ids); setTestsCasa(casaIds || []);
    if (ids.length === 0) onRunnerFinish({}, casaIds || []);  // solo pruebas para casa: se registra sin runner
    else setView('runner');
  }} />;
  if (view === 'runner') return <Runner testsIds={testsSel} cliente={draft} onBack={()=>setView('bloques')} onFinish={onRunnerFinish} />;
  if (view === 'resultados' && currentEv) return <Resultados ev={evals.find(e=>e.id===currentEv.id) || currentEv} cfg={cfg} onHome={()=>setView('home')} onExport={onExport} />;
  if (view === 'temporales') return <Temporales evals={evals} cfg={cfg} onBack={()=>setView('home')} onExport={onExport} onBorrar={onBorrar} onInforme={onInforme} onGuardar={onGuardarEval} />;
  if (view === 'admin' && user.rol === 'admin') return <Admin cfg={cfg} evals={evals} onBack={()=>setView('home')} onCfg={setCfg} onBorrarTodas={onBorrarTodas} onCambiarPin={onCambiarPin} onExportAudit={onExportAudit} />;
  if (view === 'ayuda') return <Ayuda onBack={()=>setView('home')} />;
  return <Home evals={evals} cfg={cfg} purgadas={purgadas} go={setView} user={user} onLogout={()=>setUser(null)} />;
}