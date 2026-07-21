// EXPORTACIÓN — JSON completo, CSV resumido y HTML imprimible.
// Los archivos exportados salen del control de la PWA y deben borrarse manualmente.

import { CONSENT_TEXTO } from './ui.jsx';
import { evidenciaDe } from './evidencia.js';

const ETIQUETA = 'ARCHIVO TEMPORAL — TRASLADAR AL ALMACENAMIENTO AUTORIZADO Y BORRAR DE DESCARGAS';

const AVISO_INFORME = 'Este documento recoge una valoración física y funcional no clínica orientada a adaptar el entrenamiento. No constituye un diagnóstico médico ni psicológico ni sustituye la valoración de un profesional sanitario. Los resultados dependen de la información facilitada, del protocolo, del material y de las condiciones del día. Los valores de referencia solo se aplican cuando coinciden la población y el protocolo correspondientes.';

const fmt = ts => new Date(ts).toLocaleString('es-ES', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
const fmtD = ts => new Date(ts).toLocaleDateString('es-ES');
const esc = value => String(value ?? '')
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
  .replaceAll('"','&quot;').replaceAll("'",'&#039;');

export function fechaMaxBorrado(ts, dias) {
  return fmtD(ts + dias * 24 * 3600 * 1000);
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const safe = s => String(s || 'cliente').normalize('NFD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_').toLowerCase();
const estadoDe = r => r?.estado || (r?.score ? 'completa' : 'incompleta');

export function exportarJSON(ev, dias) {
  const out = {
    _ETIQUETA: ETIQUETA,
    _fechaObjetivoPurgaLocal: fechaMaxBorrado(ev.ts, dias),
    _nota: 'La app solo puede purgar datos locales al volver a abrirse. Este archivo descargado debe borrarse manualmente.',
    _responsable: 'Espacio KoKo S.L. · CIF B06913354 · Carretera de Carmona 110 Bajo G, 41007 Sevilla · espaciokoko@gmail.com',
    ...ev
  };
  download(JSON.stringify(out, null, 2), `TEMPORAL_${safe(ev.cliente.nombre)}_${fmtD(ev.ts).replaceAll('/','-')}.json`, 'application/json');
}

export function exportarCSV(ev, dias, bateria) {
  const rows = [
    ['# ' + ETIQUETA],
    ['# Fecha objetivo de purga local', fechaMaxBorrado(ev.ts, dias)],
    ['# Nota', 'El CSV descargado debe borrarse manualmente'],
    ['Cliente', ev.cliente.nombre],
    ['Fecha evaluación', fmt(ev.ts)],
    ['Entrenador', ev.entrenador],
    ['Tipo', ev.tipoEval],
    ['Consentimiento', ev.consent ? `Aceptado ${fmt(ev.consent.ts)} (v${ev.consent.version})` : 'NO'],
    [],
    ['Prueba', 'Estado', 'Resultado principal', 'Detalle', 'Interpretación no clínica']
  ];
  for (const [tid, r] of Object.entries(ev.resultados || {})) {
    const t = bateria.find(x => x.id === tid);
    const sc = r.score;
    const estado = estadoDe(r);
    let val = '', det = '', interp = '';
    if (sc) {
      val = sc.primary ? `${sc.primary.value ?? ''}${sc.primary.unit ? ' ' + sc.primary.unit : ''}` : '';
      det = (sc.secondary || []).map(s => `${s.label}: ${s.value ?? ''}${s.unit ? ' ' + s.unit : ''}`).join(' | ');
      interp = sc.interpretation || '';
    } else if (estado !== 'omitida') {
      det = Object.entries(r.data || {}).filter(([k]) => k !== 'obs' && !k.startsWith('_'))
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join('; ') : v}`).join(' | ');
    }
    rows.push([t?.nombre || tid, estado, val, det, interp]);
    if (r.data?.obs) rows.push(['', '', '', 'Obs. entrenador: ' + r.data.obs, '']);
  }
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replaceAll('"', '""')}"`).join(';')).join('\n');
  download('\ufeff' + csv, `TEMPORAL_${safe(ev.cliente.nombre)}_${fmtD(ev.ts).replaceAll('/','-')}.csv`, 'text/csv;charset=utf-8');
}

function normBarHTML(norm) {
  if (!norm || norm.value == null || isNaN(+norm.value) || norm.max == null) return '';
  const { min = 0, max, unit = '', zones = [], refs = [] } = norm;
  if (max <= min) return '';
  const pct = v => ((Math.max(min, Math.min(max, v)) - min) / (max - min)) * 100;
  const colorSeguro = c => /^#[0-9a-fA-F]{6}$/.test(c || '') ? c : '#d8dde2';
  const zonesHTML = zones.map((z, idx) => {
    const from = idx === 0 ? min : zones[idx - 1].to;
    return `<div style="position:absolute;top:0;bottom:0;left:${pct(from)}%;width:${pct(z.to)-pct(from)}%;background:${colorSeguro(z.color)}"></div>`;
  }).join('');
  const refsHTML = refs.map(r => `<div title="${esc(r.label)}" style="position:absolute;top:-4px;bottom:-4px;left:${pct(r.v)}%;width:2px;background:#20262b;opacity:.55"></div>`).join('');
  const labelsHTML = zones.length ? `<div style="display:flex;margin-top:3px">${zones.map((z, idx) => {
    const from = idx === 0 ? min : zones[idx - 1].to;
    return `<div style="width:${pct(z.to)-pct(from)}%;font-size:10px;color:#5a646d;text-align:center;overflow:hidden;white-space:nowrap">${esc(z.label || '')}</div>`;
  }).join('')}</div>` : '';
  const legend = `<div style="font-size:12px;margin-top:5px"><b style="color:#3e4b46">▼ Resultado: ${esc(norm.value)}${esc(unit)}</b>${refs.map(r => `<span style="margin-left:14px;color:#5a646d">▏${esc(r.label)}: ${esc(r.v)}${esc(unit)}</span>`).join('')}</div>`;
  return `<div style="margin:12px 0 4px"><div style="font-size:11px;color:#5a646d;margin-bottom:12px;text-transform:uppercase;letter-spacing:.5px">Comparativa orientativa</div><div style="position:relative;height:16px;border-radius:8px;background:#eef1f3;overflow:visible">${zonesHTML}${refsHTML}<div style="position:absolute;top:-8px;left:${pct(+norm.value)}%;transform:translateX(-50%)"><div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid #3e4b46"></div></div></div>${labelsHTML}${legend}</div>`;
}

function datosRegistradosHTML(test, data) {
  const fields = test?.fields || [];
  const rows = [];
  for (const f of fields) {
    if (f.type === 'nota' || f.type === 'observacion') continue;
    const v = data?.[f.id];
    if (v === '' || v == null) continue;
    rows.push(`<span><b>${esc(f.label)}:</b> ${esc(Array.isArray(v) ? v.join(', ') : v)}${f.unit ? ' ' + esc(f.unit) : ''}</span>`);
  }
  return rows.length ? `<div class="datos"><div class="datos-t">Datos registrados</div>${rows.join('')}</div>` : '';
}

function pruebaHTML(t, r, ev) {
  const sc = r.score;
  const evi = evidenciaDe(t, r, ev);
  const val = sc?.primary ? `${sc.primary.value ?? '—'}${sc.primary.unit ? ' ' + sc.primary.unit : ''}${sc.primary.max && !sc.primary.raw ? ' / ' + sc.primary.max : ''}` : '—';
  const sec = (sc?.secondary || []).map(s => `${esc(s.label)}: <b>${esc(s.value ?? '—')}${s.unit ? ' ' + esc(s.unit) : ''}</b>`).join(' &nbsp;·&nbsp; ');
  return `<div class="prueba ${sc?.alerta ? 'alerta' : ''}">
    <h3>${esc(t?.nombre || 'Prueba')}</h3>
    ${t?.descripcion ? `<p class="paraque"><b>Para qué sirve:</b> ${esc(t.descripcion)}</p>` : ''}
    ${sc?.primary ? `<p class="val">${esc(sc.primary.label)}: <strong>${esc(val)}</strong></p>` : ''}
    ${sec ? `<p class="sec">${sec}</p>` : ''}
    ${datosRegistradosHTML(t, r.data)}
    ${sc?.norm ? normBarHTML(sc.norm) : ''}
    ${sc?.interpretation ? `<p class="interp">${esc(sc.interpretation)}</p>` : ''}
    ${evi ? `<div class="evi"><div class="evi-t">QUÉ DICE LA EVIDENCIA</div><p>${esc(evi.texto)}</p><p class="evi-f">Fuentes: ${esc(evi.fuente)}</p></div>` : ''}
    ${(r.avisos || []).map(a => `<p class="aviso ${esc(a.nivel)}">⚠ ${esc(a.texto)}</p>`).join('')}
    ${r.data?.obs ? `<p class="obs">Observación del entrenador: ${esc(r.data.obs)}</p>` : ''}
  </div>`;
}

export function exportarHTML(ev, dias, bateria) {
  const entradas = Object.entries(ev.resultados || {});
  const completas = entradas.filter(([,r]) => estadoDe(r) === 'completa');
  const omitidas = entradas.filter(([,r]) => estadoDe(r) === 'omitida');
  const filas = completas.map(([tid,r]) => pruebaHTML(bateria.find(x => x.id === tid), r, ev)).join('');
  const omitidasHTML = omitidas.length ? `<div class="resumen-sec"><b>Pruebas omitidas:</b> ${omitidas.map(([id]) => esc(bateria.find(x=>x.id===id)?.nombre || id)).join(' · ')}</div>` : '';
  const pendientes = ev.paraCasa || [];
  const firmaValida = typeof ev.consent?.firma === 'string' && ev.consent.firma.startsWith('data:image/png;base64,');

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Valoración ${esc(ev.cliente.nombre)} — KoKo Trainer</title>
<style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#20262b;max-width:820px;margin:24px auto;padding:0 20px;line-height:1.5}
  .temporal{background:#8c1d1d;color:#fff;text-align:center;padding:10px;font-weight:700;letter-spacing:.4px;border-radius:6px;font-size:12px}
  header{border-bottom:3px solid #BCC7C2;padding-bottom:12px;margin:18px 0} h1{font-size:24px;margin:8px 0 2px;color:#3e4b46} h2{font-size:16px;color:#456}
  .meta{font-size:13px;color:#556}.meta b{color:#20262b}.resumen{background:#f1f4f2;border-radius:8px;padding:12px 14px;margin:12px 0;font-size:13px}.resumen-sec{margin-top:6px;color:#556}
  .prueba{border:1px solid #d8dde2;border-radius:8px;padding:12px 16px;margin:10px 0;break-inside:avoid}.prueba.alerta{border-color:#b45309;background:#fffbeb}.prueba h3{margin:0 0 6px;font-size:15px;color:#3e4b46}
  .paraque{font-size:12.5px;color:#556;margin:4px 0 8px}.val{font-size:15px;margin:4px 0}.sec{font-size:13px;color:#445;margin:4px 0}.interp{font-size:13px;font-style:italic;margin:6px 0;color:#333}
  .datos{display:flex;flex-wrap:wrap;gap:5px 14px;font-size:11.5px;color:#556;margin:8px 0}.datos-t{width:100%;font-size:10px;text-transform:uppercase;letter-spacing:.7px;color:#878787}.aviso{font-size:13px;font-weight:600;color:#92400e;margin:4px 0}.aviso.alerta{color:#8c1d1d}.obs{font-size:12px;color:#556;border-left:3px solid #cbd5e0;padding-left:8px;margin:6px 0}
  .evi{border-left:4px solid #a4b3ad;background:#f6faf7;border-radius:0 8px 8px 0;padding:10px 14px;margin:10px 0}.evi-t{font-size:10.5px;font-weight:800;letter-spacing:.8px;color:#3e4b46;margin-bottom:4px}.evi p{font-size:12.5px;margin:0;line-height:1.6}.evi-f{font-size:10.5px!important;color:#878787;margin-top:6px!important}
  footer{margin-top:28px;border-top:1px solid #d8dde2;padding-top:12px;font-size:11px;color:#667}.legal{background:#f1f4f2;border-radius:6px;padding:12px;font-size:12px;margin-top:16px}
  @media print{.temporal{-webkit-print-color-adjust:exact;print-color-adjust:exact}body{margin:0;max-width:none}}
</style></head><body>
<div class="temporal">${esc(ETIQUETA)} · Purga local prevista al reabrir después de: ${esc(fechaMaxBorrado(ev.ts, dias))}</div>
<header><h1>Valoración física y funcional no clínica</h1><h2>KoKo Trainer · Espacio KoKo S.L.</h2><p class="meta">
Cliente: <b>${esc(ev.cliente.nombre)}</b>${ev.cliente.edad ? ` · Edad: <b>${esc(ev.cliente.edad)}</b>` : ''}${ev.cliente.sexo ? ` · Sexo de referencia: <b>${esc(ev.cliente.sexo)}</b>` : ''}<br>
Fecha: <b>${esc(fmt(ev.ts))}</b> · Tipo: <b>${esc(ev.tipoEval)}</b> · Entrenador: <b>${esc(ev.entrenador)}</b><br>
Consentimiento: <b>${ev.consent ? `aceptado el ${esc(fmt(ev.consent.ts))} (versión ${esc(ev.consent.version)})` : 'NO REGISTRADO'}</b></p></header>
<div class="resumen"><b>Estado de la valoración:</b> ${completas.length} pruebas completadas · ${omitidas.length} omitidas · ${pendientes.length} pendientes para casa.${omitidasHTML}</div>
${ev.cliente.observaciones ? `<p class="meta"><b>Observaciones generales:</b> ${esc(ev.cliente.observaciones)}</p>` : ''}
${filas}
${pendientes.length ? `<div class="prueba" style="border-color:#c96f2e;background:#fdf6ee"><h3 style="color:#c96f2e">Pruebas pendientes para casa</h3><p class="sec">No se realizaron en sala y no se han interpretado:</p><ul>${pendientes.map(id => `<li>${esc(bateria.find(x=>x.id===id)?.nombre || id)}</li>`).join('')}</ul></div>` : ''}
<div class="legal">${esc(AVISO_INFORME)}</div>
${ev.consent ? `<div style="page-break-before:always"></div><section style="border:1px solid #d8dde2;border-radius:8px;padding:16px 20px;margin-top:24px"><h2 style="color:#3e4b46;font-size:18px;margin:0 0 8px">Registro de consentimiento</h2><p class="meta">Aceptado por <b>${esc(ev.consent.nombre)}</b> el <b>${esc(fmt(ev.consent.ts))}</b> · Versión <b>${esc(ev.consent.version)}</b></p><div style="background:#f4f6f8;border-radius:6px;padding:14px;font-size:12px;line-height:1.6;white-space:pre-line;margin:10px 0">${esc(CONSENT_TEXTO)}</div>${firmaValida ? `<p style="font-size:12px;color:#5a646d">Firma del cliente:</p><img src="${ev.consent.firma}" alt="Firma del cliente" style="max-width:420px;width:100%;border:1px solid #d8dde2;border-radius:8px;background:#fff">` : ''}</section>` : ''}
<footer>Responsable del tratamiento: Espacio KoKo S.L. · CIF B06913354 · Carretera de Carmona 110 Bajo G, 41007 Sevilla · espaciokoko@gmail.com<br>Archivo temporal descargado: trasladar al almacenamiento autorizado y borrar de Descargas.</footer>
</body></html>`;
  download(html, `TEMPORAL_${safe(ev.cliente.nombre)}_${fmtD(ev.ts).replaceAll('/','-')}.html`, 'text/html');
}

export function exportarAuditCSV(entries) {
  const rows = [['Fecha','Evento','Referencia','Entrenador','Extra']];
  for (const e of entries) rows.push([fmt(e.ts), e.event, e.cliente || '', e.entrenador || '', e.evalId || '']);
  const csv = rows.map(r => r.map(c => `"${String(c ?? '').replaceAll('"','""')}"`).join(';')).join('\n');
  download('\ufeff' + csv, `registro_trazabilidad_koko_${fmtD(Date.now()).replaceAll('/','-')}.csv`, 'text/csv;charset=utf-8');
}
