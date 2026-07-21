// UI BASE — tema, componentes y constantes. Colores editables solo aquí.
import { useState, useEffect, useRef } from 'react';

export const APP_VERSION = '2.0.0';
export const CONSENT_VERSION = '2.0';

// Paleta oficial KoKo: celeste #BCC7C2 (institucional), marrón #C8B297 (acento),
// gris #878787 (texto secundario / líneas), blanco #FFFFFF (fondo principal).
export const C = {
  bg:'#ffffff', paper:'#ffffff', ink:'#20262b', ink2:'#878787',
  brand:'#BCC7C2',      // celeste KoKo — fondos, botones, elementos gráficos
  brandDark:'#a4b3ad',  // celeste oscurecido — bordes y estados activos
  brandText:'#3e4b46',  // tono oscuro de la familia celeste — titulares y texto sobre celeste
  accent:'#C8B297',     // marrón KoKo — elementos destacados
  accentText:'#6e5a3e', // marrón oscurecido — texto sobre marrón
  border:'#dfe5e2', ok:'#2e7d4f', warn:'#b45309', danger:'#8c1d1d',
  soft:'#f1f4f2', negro:'#0e0e0e'
};

export const CONSENT_TEXTO = `INFORMACIÓN BÁSICA SOBRE PROTECCIÓN DE DATOS

Responsable: Espacio KoKo S.L. (CIF B06913354), Carretera de Carmona 110 Bajo G, 41007 Sevilla. Contacto: espaciokoko@gmail.com.

Finalidad: adaptar el entrenamiento físico, mejorar la seguridad del servicio, realizar seguimiento de la evolución y elaborar un informe de valoración física y funcional no clínica.

Esta valoración no realiza diagnósticos médicos ni psicológicos. Algunos apartados recogen bienestar, estrés, sueño, dolor, confianza en el movimiento, embarazo, postparto u otras circunstancias exclusivamente para contextualizar y adaptar el entrenamiento.

Datos tratados: identificación y contacto; condición física; dolor, lesiones, limitaciones y antecedentes relevantes comunicados; hábitos; embarazo, postparto y síntomas relacionados con el ejercicio; resultados de cuestionarios internos y pruebas físicas. Solo se recogerán datos necesarios para prestar el servicio.

Base jurídica: consentimiento del cliente para el tratamiento ordinario y consentimiento explícito para los datos relativos a la salud. Facilitar estos datos es voluntario, pero sin ellos no puede realizarse esta valoración personalizada.

Conservación: los datos brutos de la evaluación se guardan cifrados en esta app local. La app intenta eliminarlos en la primera apertura posterior a 7 días. Los archivos exportados quedan fuera del control de la app y el profesional debe trasladarlos al almacenamiento autorizado y borrarlos de Descargas. El informe final en PDF se conservará mientras el cliente esté activo y durante 2 años adicionales, salvo solicitud de supresión o necesidad legal de conservación.

Destinatarios: personal autorizado de Espacio KoKo y proveedores necesarios para almacenamiento o envío del informe que actúen como encargados del tratamiento. No se prevén cesiones a terceros salvo obligación legal. La app local no envía datos a internet. No se usan fotos, vídeos ni herramientas de IA con los datos del cliente.

No se adoptan decisiones automatizadas ni se elaboran perfiles con efectos jurídicos. Las interpretaciones automáticas son ayudas para el entrenador y requieren revisión humana antes de generar el informe.

Derechos: puedes solicitar acceso, rectificación, supresión, limitación, portabilidad y oposición cuando proceda, así como retirar el consentimiento en cualquier momento, escribiendo a espaciokoko@gmail.com. La retirada no afecta al tratamiento realizado anteriormente. También puedes reclamar ante la Agencia Española de Protección de Datos.

CONSENTIMIENTO EXPLÍCITO

Declaro que he leído la información anterior y consiento expresamente que Espacio KoKo S.L. trate los datos descritos, incluidos los datos relativos a mi salud, con las finalidades indicadas.`;

export const PROTOCOLO = [
  'El cliente debe recibir la información de privacidad y prestar consentimiento explícito antes de evaluar.',
  'No se realizan fotos ni vídeos ni se introducen datos del cliente en herramientas de IA.',
  'Solo se recogen datos necesarios para adaptar el entrenamiento.',
  'Los cuestionarios incompletos no se puntúan ni se interpretan.',
  'Las pruebas omitidas quedan registradas como omitidas, nunca como resultado cero.',
  'El entrenador debe revisar coherencia, edad, sexo, rangos y alertas antes de exportar el informe.',
  'Los datos locales se purgan al abrir la app cuando superan el plazo configurado.',
  'Los archivos exportados deben salir de Descargas y borrarse manualmente.',
  'El PDF se comparte solo mediante el canal autorizado con la clienta y el personal que corresponda.',
  'No se envían fichas completas ni datos de salud por WhatsApp.'
];

export const fmt = ts => new Date(ts).toLocaleString('es-ES',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'});
export const diasRestantes = (ts, dias) => Math.max(0, Math.ceil((ts + dias*86400000 - Date.now())/86400000));

export const S = {
  btn: (v='primary', extra={}) => ({
    padding:'13px 20px', borderRadius:8, fontSize:15, fontWeight:600, cursor:'pointer',
    fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
    border:'1px solid transparent',
    ...(v==='primary' ? {background:C.brand, color:C.brandText, borderColor:C.brandDark} :
       v==='ghost' ? {background:'transparent', color:C.brand, borderColor:C.brand} :
       v==='danger' ? {background:C.danger, color:'#fff'} :
       v==='warn' ? {background:C.warn, color:'#fff'} :
       v==='accent' ? {background:C.accent, color:C.accentText, borderColor:'#b89f7f'} :
       {background:C.soft, color:C.ink, borderColor:C.border}),
    ...extra
  }),
  input: { width:'100%', padding:'13px 14px', border:`1px solid ${C.border}`, borderRadius:8, fontSize:16, fontFamily:'inherit', background:C.paper, color:C.ink },
  label: { fontSize:13, fontWeight:600, color:C.ink2, marginBottom:6, display:'block' },
  card: { background:C.paper, border:`1px solid ${C.border}`, borderRadius:10, padding:18 },
};

export function Btn({children, v='primary', full, style, ...p}) {
  return <button {...p} style={S.btn(v, {...(full?{width:'100%'}:{}), ...(p.disabled?{opacity:.45,cursor:'not-allowed'}:{}), ...style})}>{children}</button>;
}

export function Field({label, children, help}) {
  return <div style={{marginBottom:16}}>
    <label style={S.label}>{label}</label>
    {children}
    {help && <div style={{fontSize:12, color:C.ink2, marginTop:4}}>{help}</div>}
  </div>;
}

export function Header({title, sub, onBack, right}) {
  return <header style={{background:C.brand, color:C.brandText, padding:'14px 20px', position:'sticky', top:0, zIndex:20, borderBottom:`1px solid ${C.brandDark}`}}>
    <div style={{maxWidth:960, margin:'0 auto', display:'flex', alignItems:'center', gap:14}}>
      {onBack && <button onClick={onBack} aria-label="Volver" style={{background:'none',border:'none',color:C.brandText,fontSize:26,cursor:'pointer',padding:'0 4px'}}>←</button>}
      <div style={{flex:1, minWidth:0}}>
        <div style={{fontSize:11, letterSpacing:1.5, opacity:.75, textTransform:'uppercase'}}>KoKo Trainer</div>
        <h1 style={{margin:0, fontSize:20, fontWeight:700}}>{title}</h1>
        {sub && <div style={{fontSize:13, opacity:.85, marginTop:2}}>{sub}</div>}
      </div>
      {right}
    </div>
  </header>;
}

export function Page({children, ...h}) {
  return <div style={{minHeight:'100vh', background:C.bg, color:C.ink}}>
    <Header {...h} />
    <main style={{maxWidth:960, margin:'0 auto', padding:'20px 16px 60px'}}>{children}</main>
    <footer style={{textAlign:'center', padding:'12px', fontSize:11, color:C.ink2}}>
      Valoraciones Espacio KoKo v{APP_VERSION} · App desarrollada por sergiocrespoep@gmail.com
    </footer>
  </div>;
}

// Modal genérico (guías de las pruebas, etc.)
export function Modal({ title, icon, onClose, children }) {
  return <div style={{position:'fixed', inset:0, background:'rgba(0,0,0,.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:60, padding:20}} onClick={onClose}>
    <div style={{...S.card, maxWidth:580, width:'100%', maxHeight:'85vh', overflowY:'auto'}} onClick={e=>e.stopPropagation()}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, gap:10}}>
        <h3 style={{margin:0, color:C.brandText, fontSize:16}}>{icon ? icon+' ' : ''}{title}</h3>
        <button onClick={onClose} aria-label="Cerrar" style={{background:'none', border:'none', fontSize:24, cursor:'pointer', color:C.ink2, lineHeight:1}}>×</button>
      </div>
      {children}
      <Btn full v="soft" onClick={onClose} style={{marginTop:14}}>Cerrar</Btn>
    </div>
  </div>;
}

// Botón redondo de icono (guías de prueba)
export function IconBtn({ icon, label, onClick, small }) {
  return <button type="button" onClick={onClick} title={label} aria-label={label} style={{
    width: small?30:38, height: small?30:38, borderRadius:'50%', border:`1px solid ${C.border}`,
    background:'#fff', cursor:'pointer', fontSize: small?14:17, padding:0,
    display:'inline-flex', alignItems:'center', justifyContent:'center', flexShrink:0
  }}>{icon}</button>;
}

// Barra comparativa: sitúa el resultado del cliente frente a valores de referencia
// poblacionales o puntos de corte publicados. norm = { min, max, unit, value, zones:[{to,color,label}], refs:[{v,label}] }
export const NORM_COLORS = { ok:'#dcefe3', mid:'#fdeeda', bad:'#f9e0e0' };
export function NormBar({ norm }) {
  if (!norm || norm.value == null || isNaN(+norm.value)) return null;
  const { min = 0, max, unit = '', zones = [], refs = [] } = norm;
  if (max == null || max <= min) return null;
  const val = Math.max(min, Math.min(max, +norm.value));
  const pct = v => ((Math.max(min, Math.min(max, v)) - min) / (max - min)) * 100;
  return <div style={{margin:'12px 0 4px'}}>
    <div style={{fontSize:11, color:C.ink2, marginBottom:12, textTransform:'uppercase', letterSpacing:.5}}>Comparativa con valores de referencia</div>
    <div style={{position:'relative', height:16, borderRadius:8, background:C.soft}}>
      {zones.map((z,i)=>{
        const from = i===0 ? min : zones[i-1].to;
        return <div key={i} style={{position:'absolute', top:0, bottom:0, left:pct(from)+'%', width:(pct(z.to)-pct(from))+'%',
          background:z.color, borderRadius: `${pct(from)===0?8:0}px ${pct(z.to)===100?8:0}px ${pct(z.to)===100?8:0}px ${pct(from)===0?8:0}px`}} />;
      })}
      {refs.map((r,i)=><div key={i} title={r.label}
        style={{position:'absolute', top:-4, bottom:-4, left:pct(r.v)+'%', width:2, background:C.ink, opacity:.55}} />)}
      <div style={{position:'absolute', top:-8, left:pct(val)+'%', transform:'translateX(-50%)'}}>
        <div style={{width:0, height:0, borderLeft:'7px solid transparent', borderRight:'7px solid transparent', borderTop:`10px solid ${C.brandText}`}} />
      </div>
    </div>
    {zones.length > 0 && <div style={{display:'flex', marginTop:3}}>
      {zones.map((z,i)=>{
        const from = i===0 ? min : zones[i-1].to;
        return <div key={i} style={{width:(pct(z.to)-pct(from))+'%', fontSize:10, color:C.ink2, textAlign:'center', overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis'}}>{z.label||''}</div>;
      })}
    </div>}
    <div style={{fontSize:12, marginTop:5}}>
      <b style={{color:C.brandText}}>▼ Cliente: {norm.value}{unit}</b>
      {refs.map((r,i)=><span key={i} style={{marginLeft:14, color:C.ink2}}>▏{r.label}: {r.v}{unit}</span>)}
    </div>
  </div>;
}

// Firma simple en canvas táctil. Se guarda como PNG (trazo, no foto) dentro del blob cifrado.
export function FirmaPad({ onChange }) {
  const ref = useRef(null);
  const drawing = useRef(false);
  const [empty, setEmpty] = useState(true);
  useEffect(() => {
    const cv = ref.current;
    cv.width = cv.offsetWidth * 2; cv.height = 160 * 2;
    const ctx = cv.getContext('2d');
    ctx.scale(2,2); ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = C.ink;
  }, []);
  const pos = e => {
    const r = ref.current.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX - r.left, y: t.clientY - r.top };
  };
  const start = e => { e.preventDefault(); drawing.current = true; const {x,y} = pos(e); const ctx = ref.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(x,y); };
  const move = e => { if (!drawing.current) return; e.preventDefault(); const {x,y} = pos(e); const ctx = ref.current.getContext('2d'); ctx.lineTo(x,y); ctx.stroke(); if (empty) setEmpty(false); onChange(ref.current.toDataURL('image/png')); };
  const end = () => { drawing.current = false; };
  const clear = () => { const cv = ref.current; cv.getContext('2d').clearRect(0,0,cv.width,cv.height); setEmpty(true); onChange(null); };
  return <div>
    <canvas ref={ref} style={{width:'100%', height:160, background:'#fff', border:`2px dashed ${C.border}`, borderRadius:8, touchAction:'none'}}
      onMouseDown={start} onMouseMove={move} onMouseUp={end} onMouseLeave={end}
      onTouchStart={start} onTouchMove={move} onTouchEnd={end} />
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6}}>
      <span style={{fontSize:12, color:C.ink2}}>{empty ? 'Firma aquí con el dedo' : 'Firma registrada'}</span>
      <Btn v="soft" onClick={clear} style={{padding:'6px 14px', fontSize:13}}>Borrar firma</Btn>
    </div>
  </div>;
}