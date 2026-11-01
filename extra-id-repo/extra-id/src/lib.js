// Extra ID — общая библиотека (popup, background)
import { t } from './i18n.js';
import { REGIONS } from './regions.js';

// Версия уведомления о данных: при её росте экран приветствия показывается снова.
export const CONSENT_REV = 4;

export const DEFAULT_SETTINGS = {
  consent: 0,
  uiRev: 6,
  lang: 'auto',
  genRegion: 'auto',
  theme: 'auto',
  accentMode: 'custom',
  accent: '#4968ff',
  density: 'cozy',
  radius: 'round',
  fontSize: 'm',
  width: 380,
  passLen: 16,
  passSymbols: true,
  uniquePasswords: true,
  autoMailbox: true,
  emailMode: 'plausible',
  fill: { first: true, last: true, patronymic: true, login: true, email: true, password: true, birth: true, phone: false },
};

const VAULT_DATA = 'vaultData';
const VAULT_KEY = 'vaultKey';
const LEGACY_KEYS = ['personas', 'activeId', 'settings'];

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 32768) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 32768));
  }
  return btoa(binary);
}

const base64ToBytes = (value) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

async function storageKey() {
  return navigator.locks.request('extra-id-vault-key', async () => {
    const stored = await chrome.storage.local.get(VAULT_KEY);
    if (stored[VAULT_KEY]) return crypto.subtle.importKey('raw', base64ToBytes(stored[VAULT_KEY]), { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const raw = await crypto.subtle.exportKey('raw', key);
    await chrome.storage.local.set({ [VAULT_KEY]: bytesToBase64(new Uint8Array(raw)) });
    return key;
  });
}

async function encryptVault(data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(data));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await storageKey(), encoded);
  return { version: 1, iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(encrypted)) };
}

async function decryptVault(vault) {
  const decoded = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: base64ToBytes(vault.iv) },
    await storageKey(),
    base64ToBytes(vault.data),
  );
  return JSON.parse(new TextDecoder().decode(decoded));
}

function normaliseSites(sites) {
  if (!Array.isArray(sites)) return [];
  return sites.filter((site) =>
    site && typeof site.host === 'string' && /^[a-z0-9.-]+$/i.test(site.host) && site.host.length <= 253,
  ).map((site) => {
    const entry = { host: site.host.toLowerCase(), at: Number(site.at) || Date.now() };
    if (typeof site.password === 'string' && site.password && site.password.length <= 1024) entry.password = site.password;
    return entry;
  });
}

// Старые данные хранили скрытую «историю паролей» с привязкой к сайтам. Переносим пароль прямо в запись сайта.
function foldHistory(persona, sites) {
  const merged = sites.map((site) => ({ ...site }));
  const explicit = new Set(merged.filter((site) => site.password).map((site) => site.host));
  const entries = Array.isArray(persona.passwordHistory) ? [...persona.passwordHistory].reverse() : [];
  for (const entry of entries) {
    if (!entry || typeof entry.password !== 'string' || !entry.password || entry.password.length > 1024) continue;
    for (const used of normaliseSites(entry.sites)) {
      if (explicit.has(used.host)) continue;
      const site = merged.find((item) => item.host === used.host);
      if (site) site.password = entry.password;
      else merged.push({ host: used.host, at: used.at, password: entry.password });
    }
  }
  return merged.sort((x, y) => y.at - x.at);
}

function normalisePersonas(personas) {
  return personas.map((persona) => {
    const { expiresAt, passwordHistory, ...current } = persona;
    return {
      ...current,
      color: /^#[0-9a-f]{6}$/i.test(persona.color || '') ? persona.color : COLORS[0],
      sites: foldHistory(persona, normaliseSites(persona.sites)),
      mail: persona.mail && typeof persona.mail.id === 'string' && typeof persona.mail.password === 'string'
        ? { id: persona.mail.id, password: persona.mail.password, provider: 'mail.tm' }
        : null,
      mailboxes: (() => {
        const old = Array.isArray(persona.mailboxes) ? persona.mailboxes : [];
        const valid = old.filter((box) => box && typeof box.email === 'string' && box.mail && typeof box.mail.id === 'string' && typeof box.mail.password === 'string')
          .map((box) => ({ email: box.email, mail: { id: box.mail.id, password: box.mail.password, provider: 'mail.tm' }, createdAt: Number(box.createdAt) || Date.now() }));
        if (persona.mail && typeof persona.email === 'string' && !valid.some((box) => box.mail.id === persona.mail.id)) valid.push({ email: persona.email, mail: { ...persona.mail }, createdAt: Number(persona.createdAt) || Date.now() });
        return valid;
      })(),
    };
  });
}

function normaliseData(data = {}) {
  const source = data.settings || {};
  const settings = { ...DEFAULT_SETTINGS, ...source, fill: { ...DEFAULT_SETTINGS.fill, ...(source.fill || {}) } };
  if (source.uiRev !== DEFAULT_SETTINGS.uiRev) {
    for (const k of ['uiRev', 'accentMode', 'accent', 'radius', 'density', 'fontSize', 'width']) settings[k] = DEFAULT_SETTINGS[k];
  }
  if (!['unique', 'plausible'].includes(settings.emailMode)) settings.emailMode = 'plausible';
  delete settings.phoneMode;
  delete settings.clipboardClear;
  delete settings.expiryDays;
  return {
    personas: normalisePersonas(Array.isArray(data.personas) ? data.personas : []),
    activeId: data.activeId || null,
    settings,
  };
}

async function readData() {
  const stored = await chrome.storage.local.get([VAULT_DATA, ...LEGACY_KEYS]);
  if (stored[VAULT_DATA]) {
    const data = await decryptVault(stored[VAULT_DATA]);
    if (LEGACY_KEYS.some((key) => stored[key] !== undefined)) await chrome.storage.local.remove(LEGACY_KEYS);
    return data;
  }
  if (!stored.personas && !stored.activeId && !stored.settings) return {};
  const migrated = normaliseData({ personas: stored.personas, activeId: stored.activeId, settings: stored.settings });
  await writeData(migrated);
  await chrome.storage.local.remove(LEGACY_KEYS);
  return migrated;
}

async function writeData(data) {
  await chrome.storage.local.set({ [VAULT_DATA]: await encryptVault(data) });
}

export async function load() {
  return navigator.locks.request('extra-id-vault', async () => normaliseData(await readData()));
}

export function save(patch) {
  return navigator.locks.request('extra-id-vault', async () => {
    const current = normaliseData(await readData());
    const next = normaliseData({ ...current, ...patch });
    await writeData(next);
    return next;
  });
}

export function updatePersona(id, change) {
  return navigator.locks.request('extra-id-vault', async () => {
    const data = normaliseData(await readData());
    const persona = data.personas.find((item) => item.id === id);
    if (!persona) return false;
    change(persona);
    await writeData(data);
    return true;
  });
}

export function createPersona(settings, region) {
  return navigator.locks.request('extra-id-vault', async () => {
    const data = normaliseData(await readData());
    const persona = makeIdentity(settings, region, data.personas.map((item) => item.login));
    data.personas.unshift(persona);
    data.activeId = persona.id;
    await writeData(data);
    return persona;
  });
}

// ───────────── случайность и генераторы ─────────────

export function rndInt(n) {
  const lim = Math.floor(0x100000000 / n) * n;
  const a = new Uint32Array(1);
  do { crypto.getRandomValues(a); } while (a[0] >= lim);
  return a[0] % n;
}
const pick = (a) => a[rndInt(a.length)];
const digits = (n) => Array.from({ length: n }, () => rndInt(10)).join('');
const pad2 = (n) => String(n).padStart(2, '0');

export const COLORS = ['#1d4ed8', '#0f766e', '#374151', '#9a3412', '#9f1239', '#4d7c0f', '#6d28d9', '#0e7490'];

const TR_RU = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
const TR_UK = { ...TR_RU, г: 'h', ґ: 'g', є: 'ye', и: 'y', і: 'i', ї: 'yi', х: 'kh', щ: 'shch' };

export const translit = (s, map = TR_RU) => [...s.toLowerCase()].map((c) => map[c] ?? (/[a-z0-9]/.test(c) ? c : '')).join('');

const FOLD = { ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss', ł: 'l', ø: 'o', æ: 'ae', đ: 'd', ı: 'i' };
export const fold = (s) => s.toLowerCase().replace(/[äöüßłøæđı]/g, (c) => FOLD[c]).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');

// латинская форма имени для логина и почты
export const latinize = (s, region) => (region === 'ru' ? translit(s) : region === 'uk' ? translit(s, TR_UK) : fold(s));

function feminize(s, region) {
  if (region === 'ru') return /(ов|ев|ин|ын)$/.test(s) ? s + 'а' : /ий$/.test(s) ? s.slice(0, -2) + 'ая' : s;
  if (region === 'uk') return /(ов|ев|ін|їн|ин)$/.test(s) ? s + 'а' : /ий$/.test(s) ? s.slice(0, -2) + 'а' : s;
  if (region === 'pl') return /ki$/.test(s) ? s.slice(0, -1) + 'a' : s;
  return s;
}

const parse = (e) => (e.includes('|') ? e.split('|') : [e, null]);

// Выбор с перекосом к началу списка (списки упорядочены от частых имён к редким):
// минимум из двух равномерных бросков даёт треугольное распределение, без внешних зависимостей.
const pickCommon = (a) => a[Math.min(rndInt(a.length), rndInt(a.length))];

// Латинская форма имени из набора региона: для японского берём романдзи из записи «漢字|romaji».
export function latinOf(name, region) {
  const R = REGIONS[region];
  if (R) {
    for (const key of ['male', 'female', 'sur']) {
      const hit = R[key].find((entry) => entry.split('|')[0] === name && entry.includes('|'));
      if (hit) return fold(hit.split('|')[1]);
    }
  }
  return latinize(name || '', region);
}

// Логин: имя/фамилия в одном из «человеческих» шаблонов + случайный числовой хвост.
// Хвост — 4–6 цифр БЕЗ запрета повторов (раньше все цифры были разными — это заметный отпечаток
// генератора и всего 151 200 вариантов из 10^6). Первая цифра не ноль, хвост не бывает
// «серией» вроде 111111/123456. Итог: латиница, цифры и одиночные точки, ≤ 20 символов,
// начинается с буквы — проходит правила большинства сайтов и mail.tm.
export function makeLogin(firstLatin, lastLatin, used = []) {
  const f = (firstLatin || 'user').replace(/[^a-z0-9]/g, '') || 'user';
  const l = (lastLatin || 'anon').replace(/[^a-z0-9]/g, '') || 'anon';
  const bases = [`${f}${l}`, `${f[0]}.${l}`, `${f}.${l}`, `${f}${l[0]}`, l, `${l}.${f[0]}`];
  const taken = new Set(used.map((login) => String(login).toLowerCase()));
  const weak = (d) => /^(\d)\1+$/.test(d) || '0123456789'.includes(d) || '9876543210'.includes(d);
  for (let attempt = 0; attempt < 64; attempt++) {
    const len = 4 + rndInt(3);
    let suffix;
    do { suffix = String(1 + rndInt(9)) + digits(len - 1); } while (weak(suffix));
    const room = 20 - suffix.length;
    // берём шаблон, который помещается целиком (без обрезанных на полуслове фамилий); если не помещается ни один — самый короткий
    const fits = bases.filter((b) => b.length <= room);
    const base = (fits.length ? pick(fits) : bases.reduce((a, b) => (b.length < a.length ? b : a))).slice(0, room).replace(/\.+$/, '');
    const candidate = `${base || 'user'}${suffix}`;
    if (!taken.has(candidate)) return candidate;
  }
  // Практически недостижимо: 64 подряд занятых случайных логина. Берём длинный хвост.
  let candidate;
  do { candidate = `${f[0]}${l}`.slice(0, 11) + digits(9); } while (taken.has(candidate));
  return candidate;
}

export function generatePassword(len = 16, symbols = true) {
  len = Math.min(64, Math.max(8, len | 0));
  const sets = ['abcdefghijkmnopqrstuvwxyz', 'ABCDEFGHJKLMNPQRSTUVWXYZ', '23456789'];
  if (symbols) sets.push('!@#$%^&*-_=+?');
  const all = sets.join('');
  const chars = sets.map((s) => pick([...s]));
  while (chars.length < len) chars.push(pick([...all]));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = rndInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

export function makeIdentity(s, region = 'ru', usedLogins = []) {
  if (!REGIONS[region]) region = 'ru';
  const R = REGIONS[region];
  const female = rndInt(2) === 1;
  const [first, firstL] = parse(pickCommon(female ? R.female : R.male));
  let [last, lastL] = parse(pickCommon(R.sur));
  if (female) last = feminize(last, region);
  let patronymic = '';
  if (R.pat) {
    const [m, f] = parse(pickCommon(R.pat));
    patronymic = female ? (f ?? m.replace(/ич$/, 'на')) : m;
  }
  // возраст 22–47 лет: заведомо совершеннолетний и «взрослее» порога 21+
  const year = new Date().getFullYear() - 22 - rndInt(26);
  const login = makeLogin(
    firstL ? fold(firstL) : latinize(first, region),
    lastL ? fold(lastL) : latinize(last, region),
    usedLogins,
  );
  const createdAt = Date.now();
  const password = generatePassword(s.passLen, s.passSymbols);
  return {
    id: crypto.randomUUID(),
    region,
    first, last, patronymic,
    login,
    password,

    birth: `${year}-${pad2(1 + rndInt(12))}-${pad2(1 + rndInt(28))}`,
    phone: '',
    email: '',
    mail: null,
    color: pick(COLORS),
    note: '',
    sites: [],
    createdAt,
  };
}

export const regionOf = (p) => (REGIONS[p?.region] ? p.region : 'ru');

// Имя для показа и для «полных» полей (в японском фамилия идёт первой)
export function fullNames(p) {
  const r = regionOf(p), f = p.first || '', l = p.last || '', pa = p.patronymic || '';
  if (REGIONS[r].nameOrder === 'last-first') {
    const x = [l, f].filter(Boolean).join(' ');
    return { full: x, fio: x };
  }
  const fl = [f, l].filter(Boolean).join(' ');
  return { full: fl, fio: r === 'ru' || r === 'uk' ? [l, f, pa].filter(Boolean).join(' ') : fl };
}
export const fullName = (p) => fullNames(p).full;

export function formatBirth(iso, region) {
  const [y, m, d] = (iso || '').split('-');
  if (!y) return '—';
  return (REGIONS[region]?.dateFmt || 'DD.MM.YYYY').replace('YYYY', y).replace('MM', m).replace('DD', d);
}

// ───────────── временная почта (mail.tm) ─────────────

const MAIL = 'https://api.mail.tm';
const MAIL_PAUSE = 'mailPauseUntil';
const MAIL_NEXT = 'mailNextAt';
const list = (data) => (Array.isArray(data) ? data : data?.['hydra:member'] ?? data?.member ?? []);

async function waitForMailSlot() {
  await navigator.locks.request('extra-id-mail-requests', async () => {
    const stored = await chrome.storage.session.get(MAIL_NEXT);
    const wait = Math.max(0, (stored[MAIL_NEXT] || 0) - Date.now());
    if (wait) await new Promise((resolve) => setTimeout(resolve, wait));
    await chrome.storage.session.set({ [MAIL_NEXT]: Date.now() + 220 });
  });
}

export async function mailPause() {
  const stored = await chrome.storage.session.get(MAIL_PAUSE);
  return Math.max(0, (stored[MAIL_PAUSE] || 0) - Date.now());
}

async function pauseMail(response) {
  const retryAfter = response.headers.get('Retry-After');
  const seconds = Number(retryAfter);
  const requested = Number.isFinite(seconds) && seconds > 0
    ? seconds * 1000
    : (Date.parse(retryAfter) - Date.now());
  const delay = Number.isFinite(requested) && requested > 0 ? Math.min(requested, 300000) : 60000;
  const until = Date.now() + delay;
  await chrome.storage.session.set({ [MAIL_PAUSE]: until });
  return delay;
}

async function mj(path, { method = 'GET', token, body } = {}) {
  let remaining = await mailPause();
  if (remaining) throw new Error(t('errMailWait', { n: Math.ceil(remaining / 1000) }));
  await waitForMailSlot();
  remaining = await mailPause();
  if (remaining) throw new Error(t('errMailWait', { n: Math.ceil(remaining / 1000) }));
  let res;
  try {
    res = await fetch(MAIL + path, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error(t('errMailUnreachable'));
  }
  if (res.status === 429) {
    const delay = await pauseMail(res);
    throw new Error(t('errMailWait', { n: Math.ceil(delay / 1000) }));
  }
  if (!res.ok) {
    const error = new Error(t('errMailStatus', { n: res.status }));
    error.status = res.status;
    throw error;
  }
  return res.status === 204 ? null : res.json();
}

export async function createMailbox(local, mode = 'plausible') {
  const domains = list(await mj('/domains')).filter((domain) =>
    domain && typeof domain.domain === 'string' && domain.isActive !== false && !domain.isPrivate,
  );
  if (!domains.length) throw new Error(t('errNoDomains'));
  const password = generatePassword(20, false);
  const base = (local || 'user').toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/^[._-]+|[._-]+$/g, '').slice(0, 24) || 'user';
  // 31^20 ≈ 2^99 вариантов: случайный адрес практически не пересечётся с чужими.
  const alphabet = 'abcdefghjkmnpqrstuvwxyz23456789';
  const randomLocal = () => Array.from({ length: 20 }, () => alphabet[rndInt(alphabet.length)]).join('');
  // Правдоподобный адрес всегда получает случайный цифровой хвост: имя без суффикса
  // не уникально и часто уже занято. Пять цифр дают 90 000 вариантов на домен (от 10000 до 99999).
  const plausibleLocal = () => {
    const suffix = String(10000 + rndInt(90000));
    const room = 64 - suffix.length;
    const stem = base.slice(0, room).replace(/[._-]+$/g, '') || 'user';
    return `${stem}${suffix}`;
  };
  // Проверяем несколько активных доменов и повторяем только при ответе «адрес занят/недопустим».
  for (const domain of domains.slice(0, 4)) {
    for (let attempt = 0; attempt < 8; attempt++) {
      const name = mode === 'unique' ? randomLocal() : plausibleLocal();
      try {
        const acc = await mj('/accounts', { method: 'POST', body: { address: `${name}@${domain.domain}`, password } });
        return { email: acc.address, mail: { id: acc.id, password, provider: 'mail.tm' } };
      } catch (error) {
        if (error.status !== 422) throw error;
      }
    }
  }
  throw new Error(t('errMailTaken'));
}

// Зашифрованный локальный архив писем в IndexedDB. Ключ тот же, что защищает хранилище персон.
const ARCHIVE_DB = 'extra-id-mail-archive';
let archiveDbPromise;
function archiveDb() {
  if (!archiveDbPromise) archiveDbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(ARCHIVE_DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore('messages', { keyPath: 'key' });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return archiveDbPromise;
}
export async function archiveHas(mailId, messageId) {
  const db = await archiveDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('messages').objectStore('messages').get(`${mailId}:${messageId}`);
    req.onsuccess = () => resolve(Boolean(req.result));
    req.onerror = () => reject(req.error);
  });
}
export async function archiveMessage(mailId, message) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(JSON.stringify(message));
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await storageKey(), encoded);
  const record = { key: `${mailId}:${message.id}`, iv: bytesToBase64(iv), data: bytesToBase64(new Uint8Array(encrypted)), savedAt: Date.now() };
  const db = await archiveDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction('messages', 'readwrite').objectStore('messages').put(record);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}
export async function archivedMessages(mailId) {
  const db = await archiveDb();
  const records = await new Promise((resolve, reject) => {
    const req = db.transaction('messages').objectStore('messages').getAll();
    req.onsuccess = () => resolve(req.result.filter((item) => item.key.startsWith(`${mailId}:`)));
    req.onerror = () => reject(req.error);
  });
  const result = [];
  for (const record of records) {
    try {
      const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: base64ToBytes(record.iv) }, await storageKey(), base64ToBytes(record.data));
      result.push(JSON.parse(new TextDecoder().decode(raw)));
    } catch { /* повреждённая запись не должна ломать весь архив */ }
  }
  return result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}
export async function deleteArchivedMailbox(mailId) {
  const db = await archiveDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('messages', 'readwrite');
    const store = tx.objectStore('messages');
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (!cursor) return;
      if (String(cursor.key).startsWith(`${mailId}:`)) cursor.delete();
      cursor.continue();
    };
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

const tokens = new Map();
async function tokenFor(p) {
  if (tokens.has(p.id)) return tokens.get(p.id);
  const response = await mj('/token', { method: 'POST', body: { address: p.email, password: p.mail.password } });
  tokens.set(p.id, response.token);
  return response.token;
}
async function authed(p, path, opts = {}) {
  try {
    return await mj(path, { ...opts, token: await tokenFor(p) });
  } catch (error) {
    if (error.status !== 401) throw error;
    tokens.delete(p.id);
    return mj(path, { ...opts, token: await tokenFor(p) });
  }
}
export const listMessages = async (p, page = 1) => list(await authed(p, `/messages?page=${Math.max(1, Math.floor(page))}`));
export const readMessage = (p, id) => authed(p, `/messages/${encodeURIComponent(id)}`);
export async function deleteMailbox(p) {
  if (!p.mail) return;
  try {
    await authed(p, `/accounts/${encodeURIComponent(p.mail.id)}`, { method: 'DELETE' });
  } catch (error) {
    if (error.status !== 401 && error.status !== 404) throw error;
  }
  tokens.delete(p.id);
}

// ───────────── письма и журнал ─────────────

export function extractCodes(text) {
  const all = (text.match(/(?<!\d)\d{4,8}(?!\d)/g) || []).filter((c) => !/^(19|20)\d\d$/.test(c));
  return [...new Set(all)].slice(0, 3);
}

export function normHost(host) {
  const clean = String(host || '').toLowerCase().replace(/^www\./, '');
  return /^[a-z0-9.-]+$/.test(clean) && clean.includes('.') && clean.length <= 253 ? clean : '';
}

// Мини-список публичных суффиксов (без внешних загрузок): двухуровневые зоны и «общие» хостинги,
// где поддомены принадлежат РАЗНЫМ людям. Нужен, чтобы пароль, созданный для a.github.io,
// никогда не подставлялся на b.github.io, но login.example.com и example.com считались одним сайтом.
const MULTI_TLD = new Set(['co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'com.au', 'net.au', 'org.au', 'co.nz', 'co.jp', 'ne.jp', 'or.jp', 'com.br', 'com.ar', 'com.mx', 'com.tr', 'com.ua', 'co.za', 'co.in', 'com.cn', 'com.hk', 'com.sg', 'com.tw', 'co.kr', 'co.id', 'com.pl', 'com.pt', 'com.es', 'com.co', 'com.pe', 'com.ng', 'com.eg', 'com.sa', 'com.vn', 'com.my', 'com.ph']);
const SHARED_HOSTS = new Set(['github.io', 'gitlab.io', 'vercel.app', 'netlify.app', 'pages.dev', 'workers.dev', 'web.app', 'firebaseapp.com', 'herokuapp.com', 'onrender.com', 'blogspot.com', 'wordpress.com', 'myshopify.com', 'azurewebsites.net', 'cloudfront.net', 'amazonaws.com', 'appspot.com', 'glitch.me', 'repl.co', 'fly.dev', 'railway.app', 'ngrok.io', 'ngrok-free.app', 'tumblr.com', 'weebly.com', 'wixsite.com', 'itch.io', 'notion.site', 'carrd.co', 'framer.website', 'webflow.io']);

export function siteKey(host) {
  const clean = String(host || '').toLowerCase();
  if (/^\d+(\.\d+){3}$/.test(clean)) return clean;
  const parts = clean.split('.').filter(Boolean);
  if (parts.length < 3) return clean;
  const last2 = parts.slice(-2).join('.');
  const n = MULTI_TLD.has(last2) || SHARED_HOSTS.has(last2) ? 3 : 2;
  return parts.slice(-n).join('.');
}

export function senderKnown(fromAddr, sites) {
  const domain = (String(fromAddr).split('@')[1] || '').toLowerCase();
  if (!domain) return false;
  const key = siteKey(domain);
  return (sites || []).some((site) => siteKey(String(site.host || '').toLowerCase()) === key);
}

// Запись сайта в списке: точное совпадение или тот же сайт под другим поддоменом.
export function findSite(sites, host) {
  const list = sites || [];
  return list.find((site) => site.host === host) || list.find((site) => siteKey(site.host) === siteKey(host));
}

export async function recordSite(id, host, password = '') {
  const cleanHost = normHost(host);
  if (!cleanHost) return;
  await updatePersona(id, (persona) => {
    const sites = (persona.sites ||= []);
    let site = sites.find((entry) => entry.host === cleanHost);
    if (site) sites.splice(sites.indexOf(site), 1);
    else site = { host: cleanHost };
    site.at = Date.now();
    if (password && !site.password) site.password = password;
    sites.unshift(site);
  });
}

export async function renewSitePassword(id, host, settings) {
  const password = generatePassword(settings.passLen, settings.passSymbols);
  await updatePersona(id, (persona) => {
    const site = (persona.sites || []).find((entry) => entry.host === host);
    if (site) { site.password = password; site.at = Date.now(); }
  });
}

export async function removeSite(id, host) {
  await updatePersona(id, (persona) => { persona.sites = (persona.sites || []).filter((entry) => entry.host !== host); });
}

// ───────────── автозаполнение ─────────────

// Функция сериализуется и выполняется внутри страницы: никаких внешних ссылок!
// Подсказки полей понимают 12 языков интерфейса: ru, uk, en, es, pt, de, fr, it, pl, id, ja, hi.
export function pageFill(p, enabled, mode) {
  const BAD = ['hidden', 'checkbox', 'radio', 'submit', 'button', 'file', 'image', 'reset', 'range', 'color', 'search'];
  const fillable = (el) => {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return false;
    if (el.disabled || el.readOnly || BAD.includes(el.type)) return false;
    const st = getComputedStyle(el), r = el.getBoundingClientRect();
    return st.display !== 'none' && st.visibility !== 'hidden' && (r.width > 0 || r.height > 0);
  };
  const hint = (el) => {
    const lab = el.labels && el.labels[0] ? el.labels[0].textContent : '';
    return [el.type, el.id, el.name, el.placeholder, el.autocomplete, el.getAttribute('aria-label') || '', lab].join(' ').toLowerCase();
  };
  const NAME = '(?<![а-яёa-z])имя(?![а-яёa-z])';
  const RX = {
    email: /mail|courriel|correo|почт|пошт|メール|ईमेल|इमेल/,
    phone: /phone|mobile|(^|[^a-z])tel([^a-z]|$)|тел[еф]|моб|telefon|teléfono|téléphone|telepon|ponsel|celular|cellulare|handy|portable|電話|携帯|फ़ोन|फोन|मोबाइल/,
    birth: /birth|bday|geburt|naissance|nacimiento|nascimento|nascita|urodzen|lahir|народж|рожд|生年月日|誕生|जन्म/,
    login: /user.?name|login|логін|логин|nick|ник|пользовател|користувач|benutzer|nutzername|usuario|usuário|utilisateur|identifiant|pseudo|utente|użytkownik|uzytkownik|pengguna|ユーザー|उपयोगकर्ता/,
    patronymic: /patronym|middle|отчеств|по.?батьков|batkov/,
    skip: /company|organi[sz]|shop|store|product|компан|організ|организ|товар|назв|empresa|société|societe|entreprise|firma|azienda|perusahaan|会社|कंपनी|ragione/,
    fullComplete: /full.?name|nome completo|nombre completo|nom complet|vollst|pełne|pelne|nama lengkap|повне|полное|氏名|姓名|お名前|名前|フルネーム/,
    last: /last|family|surname|фамил|прізвищ|nachname|familienname|apellido|sobrenome|cognome|nazwisko|nama belakang|nom de famille|उपनाम|अंतिम नाम|姓/,
    frNom: /(?<![\p{L}])nom(?![\p{L}])/u,
    fio: /фио|ф\.и\.о/,
    first: new RegExp(`first|given|fname|vorname|prénom|prenom|nombre|nome|imię|imie|nama depan|ім['’ʼ]я|名|पहला नाम|प्रथम नाम|${NAME}`),
    full: /(^|[^a-z])name([^a-z]|$)|nama|नाम/,
  };
  // Платёжные поля не заполняем никогда: расширение не работает с данными карт.
  const PAY = /(^|[^a-z])(card|cvc|cvv|cvn|iban|ccnum|credit|cc-[a-z]+)|карт[аыуе]|tarjeta|carte bancaire|kreditkarte|cartão|cartao|クレジット|カード/;
  const kindOf = (el) => {
    const h = hint(el), t = (el.type || '').toLowerCase();
    if (t === 'password' || /(^|\s)(new|current)-password/.test(h)) return 'password';
    if (PAY.test(h)) return null;
    if (t === 'email' || RX.email.test(h)) return 'email';
    if (t === 'tel' || RX.phone.test(h)) return 'phone';
    if (t === 'date' || RX.birth.test(h)) return 'birth';
    if (RX.login.test(h)) return 'login';
    if (RX.patronymic.test(h)) return 'patronymic';
    if (RX.skip.test(h)) return null;
    if (RX.fullComplete.test(h)) return 'full';
    if (RX.last.test(h) || RX.frNom.test(h)) return 'last';
    if (RX.fio.test(h)) return 'fio';
    if (RX.first.test(h)) return 'first';
    if (RX.full.test(h)) return 'full';
    return null;
  };
  const valueOf = (kind, el) => {
    if (kind === 'birth') {
      if (!p.birth) return '';
      if (el.type === 'date') return p.birth;
      const [y, m, d] = p.birth.split('-');
      return (p.dateFmt || 'DD.MM.YYYY').replace('YYYY', y).replace('MM', m).replace('DD', d);
    }
    return p[kind] || '';
  };
  const allowed = (kind) => (kind === 'fio' || kind === 'full' ? enabled.first || enabled.last : enabled[kind]);
  const setVal = (el, v) => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    el.focus();
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const active = document.activeElement;
  if (mode === 'field') {
    if (!active || !fillable(active)) return { count: 0, passwordUsed: false };
    const kind = kindOf(active) || 'full';
    if (kind === 'password' && enabled.password === false) return { count: 0, passwordUsed: false };
    const v = valueOf(kind, active);
    if (!v) return { count: 0, passwordUsed: false };
    setVal(active, v);
    return { count: 1, passwordUsed: kind === 'password' };
  }

  let root = active && active.form ? active.form : null;
  if (!root) {
    let best = 0;
    for (const f of document.forms) {
      const n = [...f.querySelectorAll('input,textarea')].filter((e) => fillable(e) && kindOf(e)).length;
      if (n > best) { best = n; root = f; }
    }
  }
  root = root || document;
  let count = 0;
  let passwordUsed = false;
  for (const el of root.querySelectorAll('input,textarea')) {
    if (!fillable(el)) continue;
    const kind = kindOf(el);
    if (!kind || !allowed(kind)) continue;
    const v = valueOf(kind, el);
    if (!v) continue;
    setVal(el, v);
    count++;
    if (kind === 'password') passwordUsed = true;
  }
  return { count, passwordUsed };
}

// Убирает пароль у записи сайта; removeEntry=true удаляет запись целиком (если мы только что её создали).
async function dropSitePassword(id, host, removeEntry) {
  await updatePersona(id, (persona) => {
    if (removeEntry) { persona.sites = (persona.sites || []).filter((entry) => entry.host !== host); return; }
    const site = (persona.sites || []).find((entry) => entry.host === host);
    if (site) delete site.password;
  });
}

export async function fillTab({ tab, persona, settings, mode = 'form', frameId = 0 }) {
  let host = '';
  try { host = normHost(new URL(tab.url).hostname); } catch {}
  // Пароль сайта: если на этом сайте уже регистрировались — тот же, иначе новый. Без настройки — общий пароль персоны.
  const unique = Boolean(settings.uniquePasswords && host);
  const known = unique ? findSite(persona.sites, host) : null;
  const siteHost = known?.host || host;
  const fresh = unique && !known?.password;
  const password = unique
    ? known?.password || generatePassword(settings.passLen, settings.passSymbols)
    : persona.password || '';
  // Новый пароль СНАЧАЛА сохраняем, потом вставляем: если окно закроется или запись упадёт,
  // пользователь не окажется с паролем в форме, которого нет в расширении.
  if (fresh) await recordSite(persona.id, siteHost, password);
  const data = {};
  for (const k of ['first', 'last', 'patronymic', 'login', 'email', 'phone', 'birth']) data[k] = persona[k] || '';
  data.password = password;
  Object.assign(data, fullNames(persona), { dateFmt: REGIONS[regionOf(persona)].dateFmt });
  const target = { tabId: tab.id, frameIds: [frameId] };
  let n = 0;
  let passwordUsed = false;
  try {
    // На обычных http-страницах (не localhost) пароль не вставляем: он ушёл бы по сети открытым текстом
    let secure = true;
    try { const u = new URL(tab.url); secure = u.protocol === 'https:' || /^(localhost|127\.0\.0\.1)$/.test(u.hostname); } catch {}
    const enabled = secure ? settings.fill : { ...settings.fill, password: false };
    const res = await chrome.scripting.executeScript({ target, func: pageFill, args: [data, enabled, mode] });
    n = res.reduce((sum, result) => sum + (result.result?.count || 0), 0);
    passwordUsed = res.some((result) => result.result?.passwordUsed);
  } catch (error) {
    if (fresh) { try { await dropSitePassword(persona.id, siteHost, !known); } catch {} }
    throw error;
  }
  if (fresh && (!n || !passwordUsed)) {
    // Поля пароля не нашлось — не храним пароль, которого нет на сайте; запись сайта оставляем, только если что-то заполнили.
    try { await dropSitePassword(persona.id, siteHost, !known && !n); } catch {}
  } else if (n && host && !fresh) {
    try { await recordSite(persona.id, siteHost, ''); } catch {}
  }
  return n;
}
