// CAPA DE DATOS — IndexedDB con registros cifrados.
// Stores:
//  - evaluaciones: { id, ts, blob:{iv,ct} }  → contenido cifrado con la clave del PIN
//  - audit:        { id, ts, blob:{iv,ct} }  → trazabilidad mínima, también cifrada
// La configuración no sensible (salt, verifier, plazo de borrado, versión de
// consentimiento) vive en localStorage: no contiene datos personales.

import { encryptJSON, decryptJSON } from './crypto.js';

const DB_NAME = 'koko_valoraciones';
const DB_VER = 1;

function openDB() {
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('evaluaciones')) db.createObjectStore('evaluaciones', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('audit')) db.createObjectStore('audit', { keyPath: 'id' });
    };
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

async function tx(store, mode, fn) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const out = fn(s);
    t.oncomplete = () => { db.close(); res(out?.result ?? out); };
    t.onerror = () => { db.close(); rej(t.error); };
  });
}

function getAll(store) {
  return tx(store, 'readonly', s => {
    return new Promise((res) => {
      const req = s.getAll();
      req.onsuccess = () => res(req.result);
    });
  }).then(p => p);
}

export const uid = () => crypto.randomUUID();

// ---------- Evaluaciones ----------
export async function saveEval(key, evalObj) {
  const blob = await encryptJSON(key, evalObj);
  await tx('evaluaciones', 'readwrite', s => s.put({ id: evalObj.id, ts: evalObj.ts, blob }));
}

export async function loadEvals(key) {
  const rows = await getAll('evaluaciones');
  const out = [];
  for (const r of rows) {
    try { out.push(await decryptJSON(key, r.blob)); } catch { /* clave distinta: ignorar */ }
  }
  return out.sort((a, b) => b.ts - a.ts);
}

export async function deleteEval(id) {
  await tx('evaluaciones', 'readwrite', s => s.delete(id));
}

export async function wipeAll() {
  await tx('evaluaciones', 'readwrite', s => s.clear());
  await tx('audit', 'readwrite', s => s.clear());
}

// Sustitución atómica de todos los registros al cambiar el PIN.
// Primero cifra todo en memoria; solo después abre una única transacción que
// reemplaza ambos almacenes. Si algo falla, IndexedDB revierte la transacción.
export async function replaceAllWithKey(key, evals, audit) {
  const evalRows = [];
  for (const e of evals) evalRows.push({ id:e.id, ts:e.ts, blob:await encryptJSON(key, e) });
  const auditRows = [];
  for (const a of audit) auditRows.push({ id:a.id, ts:a.ts, blob:await encryptJSON(key, a) });

  const db = await openDB();
  await new Promise((res, rej) => {
    const t = db.transaction(['evaluaciones', 'audit'], 'readwrite');
    const es = t.objectStore('evaluaciones');
    const as = t.objectStore('audit');
    es.clear(); as.clear();
    for (const row of evalRows) es.put(row);
    for (const row of auditRows) as.put(row);
    t.oncomplete = () => { db.close(); res(); };
    t.onerror = () => { db.close(); rej(t.error || new Error('No se pudo completar el re-cifrado')); };
    t.onabort = () => { db.close(); rej(t.error || new Error('Re-cifrado cancelado')); };
  });
}

// ---------- Trazabilidad (registro mínimo, sin datos de salud) ----------
export async function logAudit(key, event, cliente, entrenador, extra = {}) {
  const entry = { id: uid(), ts: Date.now(), event, cliente, entrenador, ...extra };
  const blob = await encryptJSON(key, entry);
  await tx('audit', 'readwrite', s => s.put({ id: entry.id, ts: entry.ts, blob }));
}

// Re-guardar una entrada existente (usado al cambiar el PIN para re-cifrar todo)
export async function saveAuditRaw(key, entry) {
  const blob = await encryptJSON(key, entry);
  await tx('audit', 'readwrite', s => s.put({ id: entry.id, ts: entry.ts, blob }));
}

export async function loadAudit(key) {
  const rows = await getAll('audit');
  const out = [];
  for (const r of rows) {
    try { out.push(await decryptJSON(key, r.blob)); } catch { }
  }
  return out.sort((a, b) => b.ts - a.ts);
}

// ---------- Purga automática ----------
// LIMITACIÓN DOCUMENTADA: una PWA no puede ejecutar tareas en segundo plano de forma
// fiable. La purga se ejecuta CADA VEZ QUE SE DESBLOQUEA la app. Si nadie la abre en
// semanas, los datos siguen cifrados en el dispositivo hasta la siguiente apertura.
export async function purgeExpired(key, dias, entrenador = 'sistema') {
  const limite = Date.now() - dias * 24 * 60 * 60 * 1000;
  const evals = await loadEvals(key);
  let purged = 0;
  for (const e of evals) {
    if (e.ts < limite) {
      await deleteEval(e.id);
      await logAudit(key, 'borrado_automatico', e.cliente?.nombre || '¿?', entrenador, { evalId: e.id });
      purged++;
    }
  }
  return purged;
}

// ---------- Config no sensible (localStorage) ----------
const CFG = 'koko_cfg';
export function getCfg() {
  try { return JSON.parse(localStorage.getItem(CFG)) || {}; } catch { return {}; }
}
export function setCfg(patch) {
  localStorage.setItem(CFG, JSON.stringify({ ...getCfg(), ...patch }));
}

// Solicitar almacenamiento persistente para reducir el riesgo de que el SO
// borre IndexedDB bajo presión de espacio.
export async function requestPersist() {
  if (navigator.storage?.persist) {
    try { return await navigator.storage.persist(); } catch { return false; }
  }
  return false;
}