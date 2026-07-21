// CAPA DE CIFRADO — Web Crypto API
// Clave derivada del PIN con PBKDF2 (250.000 iteraciones, SHA-256) → AES-GCM 256.
// Los datos NUNCA se guardan en claro. Sin el PIN correcto no hay forma de leerlos.
// LIMITACIÓN DOCUMENTADA: si el PIN es corto (4 dígitos) un atacante con acceso
// físico a los datos podría probar las 10.000 combinaciones. Recomendado PIN ≥6 dígitos
// o contraseña alfanumérica. Si se olvida el PIN, los datos son IRRECUPERABLES.

const ITER = 250000;
const enc = new TextEncoder();
const dec = new TextDecoder();

function b64(buf) { return btoa(String.fromCharCode(...new Uint8Array(buf))); }
function unb64(s) { return Uint8Array.from(atob(s), c => c.charCodeAt(0)); }

export async function deriveKey(pin, saltB64) {
  const salt = unb64(saltB64);
  const base = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function newSalt() {
  return b64(crypto.getRandomValues(new Uint8Array(16)));
}

export async function encryptJSON(key, obj) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = enc.encode(JSON.stringify(obj));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
  return { iv: b64(iv), ct: b64(ct) };
}

export async function decryptJSON(key, blob) {
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(blob.iv) },
    key,
    unb64(blob.ct)
  );
  return JSON.parse(dec.decode(pt));
}

// Hash SHA-256 en hexadecimal — para contraseñas de acceso de usuarios (admin/entrenadores).
// No protege los datos (eso lo hace el PIN + AES-GCM): solo controla el acceso por rol.
export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', enc.encode(String(text)));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// Verificador de PIN: ciframos un valor conocido al configurar; al desbloquear
// intentamos descifrarlo. AES-GCM es autenticado: PIN incorrecto → excepción.
const MAGIC = 'KOKO_VALORACIONES_OK';

export async function createVerifier(key) {
  return encryptJSON(key, { magic: MAGIC });
}

export async function checkVerifier(key, verifier) {
  try {
    const v = await decryptJSON(key, verifier);
    return v.magic === MAGIC;
  } catch {
    return false;
  }
}

// Contraseñas de usuario: PBKDF2 con salt individual.
// Se mantiene compatibilidad de lectura con los hashes SHA-256 de versiones anteriores.
const PASS_ITER = 250000;

export async function hashPassword(password, saltB64 = newSalt()) {
  const base = await crypto.subtle.importKey('raw', enc.encode(String(password)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name:'PBKDF2', salt:unb64(saltB64), iterations:PASS_ITER, hash:'SHA-256' },
    base,
    256
  );
  return `pbkdf2$${PASS_ITER}$${saltB64}$${b64(bits)}`;
}

function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i=0; i<a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export async function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return false;
  if (!stored.startsWith('pbkdf2$')) return (await sha256Hex(password)) === stored;
  const [kind, iterText, saltB64, expectedB64] = stored.split('$');
  if (kind !== 'pbkdf2' || !saltB64 || !expectedB64) return false;
  const iterations = Number(iterText);
  if (!Number.isInteger(iterations) || iterations < 100000) return false;
  const base = await crypto.subtle.importKey('raw', enc.encode(String(password)), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name:'PBKDF2', salt:unb64(saltB64), iterations, hash:'SHA-256' },
    base,
    256
  );
  return equalBytes(new Uint8Array(bits), unb64(expectedB64));
}

