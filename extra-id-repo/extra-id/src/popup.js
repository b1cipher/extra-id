import {
  DEFAULT_SETTINGS, COLORS, load, save, makeIdentity, createPersona, updatePersona, generatePassword, createMailbox, deleteMailbox,
  listMessages, readMessage, extractCodes, senderKnown, fillTab, archiveHas, archiveMessage, archivedMessages, deleteArchivedMailbox,
  fullName, formatBirth, regionOf, CONSENT_REV, recordSite, renewSitePassword, removeSite, normHost, mailPause,
  makeLogin, latinOf,
} from './lib.js';
import { t, setLang, lang, intlLocale, LANGS } from './i18n.js';
import { REGIONS } from './regions.js';
import { INFO_LINKS, infoFor } from './info.js';

const PRIVACY_PAGE = chrome.runtime.getURL('privacy.html');

// ───────────── мелкие помощники ─────────────

const $ = (s) => document.querySelector(s);

function h(tag, props = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const c of kids.flat()) {
    if (c == null || c === false) continue;
    el.append(c.nodeType ? c : document.createTextNode(c));
  }
  return el;
}

const ICONS = {
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 6 12 13 2 6"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  trash: '<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10"/>',
  'refresh-cw': '<path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2"/>',
};
function icon(name) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', '14');
  s.setAttribute('height', '14');
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '2');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  // Разбираем статическую SVG-разметку через DOMParser вместо innerHTML (требование линтера AMO)
  const doc = new DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${ICONS[name]}</svg>`, 'image/svg+xml');
  for (const node of [...doc.documentElement.childNodes]) s.appendChild(document.importNode(node, true));
  return s;
}

let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
}

const fmtDate = (ts) => new Date(ts).toLocaleDateString(intlLocale(), { day: 'numeric', month: 'short' });
const fmtMoment = (ts) => new Date(ts).toLocaleString(intlLocale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
}

// ───────────── состояние ─────────────

let S = {
  personas: [], activeId: null, settings: DEFAULT_SETTINGS,
  tab: 'personas', editing: null,
  mail: { personaId: null, msgs: null, open: null, error: null, loading: false },
};
let pollTimer = null;
const active = () => S.personas.find((p) => p.id === S.activeId) || null;
const persist = () => save({ personas: S.personas, activeId: S.activeId, settings: S.settings });
const resetMail = (personaId = null) => { S.mail = { personaId, msgs: null, open: null, error: null, loading: false }; };
const newRegion = () => (S.settings.genRegion === 'auto' ? lang() : S.settings.genRegion);
const langName = (code) => LANGS.find((l) => l.code === code)?.name || code;

function applyAppearance() {
  const st = S.settings, r = document.documentElement, p = active();
  const accent = st.accentMode === 'persona' && p ? p.color : st.accent;
  r.dataset.theme = st.theme;
  r.lang = lang();
  r.style.setProperty('--accent', accent);
  r.style.setProperty('--on-accent', luminance(accent) > 0.62 ? '#0b1020' : '#ffffff');
  r.style.setProperty('--radius', { sharp: '0px', soft: '12px', round: '18px' }[st.radius] || '0px');
  r.style.setProperty('--pad', { compact: '5px', cozy: '8px', roomy: '12px' }[st.density]);
  r.style.setProperty('--fs', { s: '12px', m: '13px', l: '14.5px' }[st.fontSize]);
  r.style.setProperty('--w', st.width + 'px');
}

async function copy(text, { btn } = {}) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    toast(t('toastCopyFailed'));
    return;
  }
  if (btn) {
    const prev = btn.firstChild;
    btn.classList.add('ok');
    btn.replaceChildren(icon('check'));
    setTimeout(() => { btn.classList.remove('ok'); btn.replaceChildren(prev); }, 1100);
  }
  toast(t('toastCopied'));
}

// ───────────── рендер ─────────────

const TABS = { personas: 'tabPersonas', mail: 'tabMail', info: 'tabInfo', settings: 'tabSettings' };

function render({ animate = true } = {}) {
  clearInterval(pollTimer);
  pollTimer = null;
  applyAppearance();
  const p = active();
  $('#chip').replaceChildren(p ? fullName(p) : t('noPersona'));
  document.querySelectorAll('#tabs button').forEach((b) => {
    b.textContent = t(TABS[b.dataset.tab]);
    b.classList.toggle('on', b.dataset.tab === S.tab);
    if (b.dataset.tab === S.tab) b.setAttribute('aria-current', 'page');
    else b.removeAttribute('aria-current');
  });
  const views = { personas: viewPersonas, mail: viewMail, info: viewInfo, settings: viewSettings };
  const gate = needConsent();
  $('#tabs').hidden = gate;
  const content = gate ? viewConsent() : S.editing ? viewEdit() : views[S.tab]();
  if (animate) content.classList.add('view-enter');
  $('#view').replaceChildren(content);
  $('#footer').replaceChildren(
    h('span', {}, 'Extra ID ' + chrome.runtime.getManifest().version),
    h('a', { href: PRIVACY_PAGE, target: '_blank', rel: 'noopener' }, t('consentView')),
  );
}

function renderKeepScroll(animate = true) {
  const y = $('#view').scrollTop;
  render({ animate });
  $('#view').scrollTop = y;
}

function goTab(tab) {
  S.tab = tab;
  S.editing = null;
  S.mail.open = null;
  render();
  $('#view').scrollTop = 0;
}

// ───────────── приветствие ─────────────

const needConsent = () => S.settings.consent !== CONSENT_REV;

function viewConsent() {
  const continueButton = h('button', { class: 'btn primary wide', disabled: true, onclick: async () => {
    S.settings.consent = CONSENT_REV;
    await persist();
    render();
  } }, t('welcomeStart'));
  const mark = h('span', { class: 'check-mark', 'aria-hidden': 'true' });
  const checkButton = h('button', { class: 'check-button', type: 'button', 'aria-pressed': 'false', onclick: () => {
    const checked = checkButton.getAttribute('aria-pressed') !== 'true';
    checkButton.setAttribute('aria-pressed', String(checked));
    mark.textContent = checked ? '✓' : '';
    continueButton.disabled = !checked;
  } }, mark, t('welcomeCheck'));
  return h('div', { class: 'stack welcome' },
    h('h1', {}, t('welcomeTitle')),
    h('p', {}, t('welcomeIntro')),
    h('p', {}, t('welcomeLocal')),
    h('p', {}, t('welcomeForm')),
    h('p', {}, t('welcomeServices')),
    h('a', { class: 'link welcome-privacy', href: PRIVACY_PAGE, target: '_blank', rel: 'noopener' }, t('consentView')),
    checkButton,
    continueButton,
  );
}

// ───────────── вкладка «Персоны» ─────────────

function row(label, value, { secret = false, mono = false, empty = '—' } = {}) {
  let shown = !secret;
  const val = h('div', { class: 'val' + (mono || secret ? ' mono' : '') }, secret ? '••••••••••' : value || empty);
  const actions = [];
  if (secret) {
    actions.push(h('button', { class: 'icon', title: t('ttShow'), onclick: () => {
      shown = !shown;
      val.textContent = shown ? value : '••••••••••';
    } }, icon('eye')));
  }
  if (value) {
    const b = h('button', { class: 'icon', title: t('ttCopy') }, icon('copy'));
    b.addEventListener('click', () => copy(value, { btn: b }));
    actions.push(b);
  }
  return h('div', { class: 'row' }, h('div', { class: 'grow' }, h('div', { class: 'lab' }, label), val), actions);
}

const initials = (p) => ((p.last || '')[0] || '') + ((p.first || '')[0] || '');
const avatar = (p, small) => h('div', { class: 'avatar' + (small ? ' sm' : ''), style: `--c:${p.color}` }, initials(p));

function viewPersonas() {
  const p = active();
  const wrap = h('div', { class: 'stack' });
  if (!p) {
    wrap.append(h('div', { class: 'empty' },
      h('p', {}, t('emptyPersonas')),
      h('button', { class: 'btn primary', onclick: (e) => newPersona(e.currentTarget) }, t('btnCreatePersona'))));
    return wrap;
  }

  wrap.append(h('div', { class: 'id-card accent-card' },
    h('div', { class: 'id-head' }, avatar(p),
      h('div', { class: 'grow' }, h('div', { class: 'pname' }, fullName(p)),
        p.note ? h('small', {}, p.note) : h('small', {}, p.email || t('noMailbox'))),
      h('button', { class: 'icon', title: t('ttEdit'), onclick: () => { S.editing = { draft: structuredClone({ ...p, region: regionOf(p) }) }; render(); } }, icon('edit'))),
    row(t('lblLogin'), p.login),
    S.settings.uniquePasswords ? null : row(t('lblPassword'), p.password, { secret: true }),
    row(t('lblEmail'), p.email || '', { empty: t('noMailbox') }),
    p.phone ? row(t('lblPhone'), p.phone) : null,
    row(t('lblBirth'), formatBirth(p.birth, regionOf(p))),
    h('div', { class: 'actions' }, h('button', { class: 'btn primary', onclick: fillPage }, t('btnFill') + ' (Alt+Shift+F)')),
  ));
  wrap.append(viewSites(p));

  const others = S.personas.filter((x) => x.id !== p.id);
  if (others.length) {
    wrap.append(h('div', { class: 'subhead' }, t('switchPersona')));
    wrap.append(h('div', {}, others.map((x) => h('button', { class: 'item', onclick: () => selectPersona(x.id) },
      avatar(x, true),
      h('div', { class: 'grow' }, h('div', {}, fullName(x)), h('small', {}, x.email || t('noMail')))))));
  }
  wrap.append(h('button', { class: 'btn wide', onclick: (e) => newPersona(e.currentTarget) }, t('btnNewPersona')));
  return wrap;
}

// Опасное действие (удаление, смена пароля) требует второго клика в течение 3 секунд
function armed(btn, iconName, action) {
  let timer = 0;
  btn.addEventListener('click', () => {
    if (!timer) {
      btn.classList.add('armed');
      btn.setAttribute('aria-pressed', 'true');
      btn.replaceChildren(icon('check'));
      timer = setTimeout(() => {
        timer = 0;
        btn.classList.remove('armed');
        btn.removeAttribute('aria-pressed');
        btn.replaceChildren(icon(iconName));
      }, 3000);
      return;
    }
    clearTimeout(timer);
    timer = 0;
    action();
  });
  return btn;
}

async function reloadPersonas() {
  S.personas = (await load()).personas;
  renderKeepScroll();
}

function viewSites(p) {
  const unique = S.settings.uniquePasswords;
  const siteInput = h('input', { type: 'text', placeholder: t('historySitePlaceholder'), 'aria-label': t('historySitePlaceholder') });
  const addSite = h('button', { class: 'btn', onclick: async () => {
    let host;
    try {
      host = normHost(new URL(siteInput.value.includes('://') ? siteInput.value : `https://${siteInput.value}`).hostname);
      if (!host) throw new Error();
    } catch {
      toast(t('historySiteInvalid'));
      return;
    }
    try {
      await recordSite(p.id, host, unique ? generatePassword(S.settings.passLen, S.settings.passSymbols) : '');
      await reloadPersonas();
      toast(t('historySiteSaved'));
    } catch (error) {
      toast(t('toastFail', { err: error.message }));
    }
  } }, t('historyAddSite'));

  const entries = (p.sites || []).map((site) => {
    const entry = site.password
      ? row(`${site.host} · ${fmtDate(site.at)}`, site.password, { secret: true })
      : h('div', { class: 'row' }, h('div', { class: 'grow' }, h('div', { class: 'lab' }, fmtDate(site.at)), h('div', { class: 'val' }, site.host)));
    if (site.password) {
      entry.append(armed(h('button', { class: 'icon', title: t('ttNewSitePass') }, icon('refresh')), 'refresh', async () => {
        await renewSitePassword(p.id, site.host, S.settings);
        await reloadPersonas();
      }));
    }
    entry.append(armed(h('button', { class: 'icon', title: t('ttRemoveSite') }, icon('x')), 'x', async () => {
      await removeSite(p.id, site.host);
      await reloadPersonas();
    }));
    return entry;
  });

  return h('section', { class: 'sec journal-section' },
    h('h3', {}, t('historyTitle')),
    entries.length ? h('div', { class: 'sites-list' }, entries) : h('small', {}, t('historyNoSites')),
    h('div', { class: 'line' }, siteInput, addSite),
  );
}

async function selectPersona(id) {
  S.activeId = id;
  resetMail();
  await persist();
  render();
}

async function newPersona(btn) {
  const label = btn.textContent;
  btn.disabled = true;
  btn.textContent = t('busyCreating');
  let warn = '';
  try {
    const persona = await createPersona(S.settings, newRegion());
    if (S.settings.autoMailbox) {
      try {
        const mailbox = await createMailbox(`${latinOf(persona.first, regionOf(persona))}.${latinOf(persona.last, regionOf(persona))}`, S.settings.emailMode);
        await updatePersona(persona.id, (current) => Object.assign(current, mailbox));
      } catch (error) {
        warn = error.message;
      }
    }
    const fresh = await load();
    S.personas = fresh.personas;
    S.activeId = persona.id;
    resetMail();
    goTab('personas');
    toast(warn ? t('toastCreatedNoMail', { err: warn }) : t('toastCreated'));
  } catch (error) {
    btn.disabled = false;
    btn.textContent = label;
    toast(t('toastFail', { err: error.message }));
  }
}

let filling = false;
async function fillPage() {
  const p = active();
  if (!p || filling) return;
  filling = true;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !/^https?:/.test(tab.url || '')) { filling = false; return toast(t('toastOpenWeb')); }
  try {
    const n = await fillTab({ tab, persona: p, settings: S.settings, mode: 'form' });
    const fresh = await load();
    S.personas = fresh.personas;
    render();
    toast(n ? t('toastFilled', { n }) : t('toastNoFields'));
  } catch (e) {
    toast(t('toastFail', { err: e.message }));
  } finally {
    filling = false;
  }
}

async function removePersona(p) {
  if (!p) return;
  const boxes = (p.mailboxes?.length ? p.mailboxes : (p.mail ? [{ email: p.email, mail: p.mail }] : []));
  for (const box of boxes) {
    try { await deleteMailbox({ ...p, ...box }); } catch { /* continue removing remaining boxes */ }
    try { await deleteArchivedMailbox(box.mail.id); } catch { /* archive cleanup must not block persona deletion */ }
  }
  S.personas = S.personas.filter((x) => x.id !== p.id);
  if (S.activeId === p.id) S.activeId = S.personas[0]?.id || null;
}

// ───────────── редактор персоны ─────────────

function select(options, value, onchange) {
  return h('select', { onchange: (e) => onchange(e.target.value) },
    options.map(([v, label]) => h('option', { value: String(v), selected: String(v) === String(value) }, label)));
}

function viewEdit() {
  const d = S.editing.draft;
  const field = (label, key, type = 'text') =>
    h('label', { class: 'field' }, h('span', {}, label),
      h('input', { type, value: d[key] || '', oninput: (e) => { d[key] = e.target.value; } }));

  // Логин с кнопкой «новый»: ещё один вариант без пересоздания всей персоны (если сайт сказал «имя занято»)
  const loginField = () => {
    const input = h('input', { type: 'text', value: d.login || '', autocomplete: 'off', spellcheck: 'false', oninput: (e) => { d.login = e.target.value; } });
    const again = h('button', { class: 'icon', type: 'button', title: t('ttNewLogin'), 'aria-label': t('ttNewLogin'), onclick: () => {
      const region = regionOf(d);
      d.login = makeLogin(latinOf(d.first, region), latinOf(d.last, region), S.personas.filter((persona) => persona.id !== d.id).map((persona) => persona.login));
      input.value = d.login;
    } }, icon('refresh'));
    return h('label', { class: 'field' }, h('span', {}, t('lblLogin')), h('div', { class: 'line' }, input, again));
  };

  const regenerate = (region) => {
    const fresh = makeIdentity(S.settings, region, S.personas.filter((persona) => persona.id !== d.id).map((persona) => persona.login));
    Object.assign(d, { region, first: fresh.first, last: fresh.last, patronymic: fresh.patronymic, birth: fresh.birth });
    if (!d.mail) d.login = fresh.login;
    render();
  };

  const colorRow = h('div', { class: 'swatches' });
  COLORS.forEach((c) => {
    const b = h('button', { class: 'swatch' + (d.color === c ? ' on' : ''), style: `background:${c}`, title: c, onclick: () => {
      d.color = c;
      [...colorRow.children].forEach((x) => x.classList.toggle('on', x === b));
    } });
    colorRow.append(b);
  });

  const mailBox = d.mail
    ? h('div', { class: 'field' }, h('span', {}, t('lblMail')), h('div', {}, d.email))
    : h('button', { class: 'btn', onclick: async (e) => {
      const b = e.currentTarget;
      b.disabled = true;
      b.textContent = t('busyMailbox');
      try {
        Object.assign(d, await createMailbox(`${latinOf(d.first, regionOf(d))}.${latinOf(d.last, regionOf(d))}`, S.settings.emailMode));
        const original = S.personas.find((persona) => persona.id === d.id);
        if (original) {
          original.email = d.email;
          original.mail = d.mail;
          await persist();
        }
        toast(t('toastMailboxCreated'));
        render();
      } catch (err) {
        b.disabled = false;
        b.textContent = t('btnCreateMailbox');
        toast(err.message);
      }
    } }, t('btnCreateMailbox'));

  let confirmDel = false;
  const delBtn = h('button', { class: 'btn danger', onclick: async () => {
    if (!confirmDel) {
      confirmDel = true;
      delBtn.textContent = t('confirmDelete');
      setTimeout(() => { confirmDel = false; delBtn.textContent = t('btnDelete'); }, 4000);
      return;
    }
    try {
      await removePersona(S.personas.find((x) => x.id === d.id) || d);
    } catch (error) {
      toast(t('toastDeleteFailed', { err: error.message }));
      return;
    }
    S.editing = null;
    resetMail();
    await persist();
    render();
    toast(t('toastDeleted'));
  } }, t('btnDelete'));

  return h('div', { class: 'stack' },
    h('div', { class: 'subhead' }, t('edTitle')),
    h('label', { class: 'field' }, h('span', {}, t('lblRegion')),
      select(LANGS.map((l) => [l.code, l.name]), regionOf(d), regenerate)),
    h('div', { class: 'field' }, h('span', {}, t('lblColor')), colorRow),
    field(t('lblFirst'), 'first'), field(t('lblLast'), 'last'),
    REGIONS[regionOf(d)].pat ? field(t('lblPatronymic'), 'patronymic') : null,
    loginField(), S.settings.uniquePasswords ? null : field(t('lblPassword'), 'password', 'password'),
    field(t('lblBirth'), 'birth', 'date'), field(t('lblPhone'), 'phone'), field(t('lblNote'), 'note'),
    mailBox,
    h('div', { class: 'line' },
      h('button', { class: 'btn primary', onclick: async () => {
        const i = S.personas.findIndex((x) => x.id === d.id);
        if (S.personas.some((persona) => persona.id !== d.id && (persona.login || '').toLowerCase() === (d.login || '').trim().toLowerCase())) {
          toast(t('loginTaken'));
          return;
        }
        d.login = (d.login || '').trim();
        if (!d.login) { toast(t('loginEmpty')); return; }
        if (!d.password) { toast(t('passwordEmpty')); return; }
        if (i >= 0) {
          S.personas[i] = d;
        }
        S.editing = null;
        await persist();
        render();
        toast(t('toastSaved'));
      } }, t('btnSave')),
      h('button', { class: 'btn', onclick: () => { S.editing = null; render(); } }, t('btnCancel'))),
    h('div', { class: 'line' },
      h('button', { class: 'btn', onclick: () => regenerate(regionOf(d)) }, t('btnRegen')),
      delBtn),
  );
}

// ───────────── вкладка «Почта» ─────────────

function mailboxPersonas() {
  const activePersona = active();
  const owners = [activePersona, ...S.personas.filter((p) => p.id !== activePersona?.id)].filter(Boolean);
  return owners.flatMap((owner) => {
    const boxes = Array.isArray(owner.mailboxes) ? [...owner.mailboxes] : [];
    if (owner.mail && owner.email && !boxes.some((box) => box.mail?.id === owner.mail.id)) boxes.push({ email: owner.email, mail: owner.mail, createdAt: owner.createdAt || Date.now() });
    return boxes.map((box) => ({ ...owner, id: `${owner.id}::${box.mail.id}`, ownerId: owner.id, email: box.email, mail: box.mail, mailboxCreatedAt: box.createdAt }));
  });
}

function selectedMailbox() {
  const boxes = mailboxPersonas();
  return boxes.find((p) => p.id === S.mail.personaId) || boxes.find((p) => p.ownerId === active()?.id && p.mail?.id === active()?.mail?.id) || boxes[0] || null;
}

function selectMailbox(id) {
  if (S.mail.personaId === id) return;
  resetMail(id);
  renderKeepScroll();
}

function mailboxButton(p, current) {
  const isActive = p.ownerId === active()?.id && p.mail?.id === active()?.mail?.id;
  return h('button', { class: 'mailbox-item' + (p.id === current.id ? ' on' : ''), onclick: () => selectMailbox(p.id) },
    avatar(p, true), h('span', { class: 'grow' }, h('strong', {}, p.email), h('small', {}, fullName(p))),
    isActive ? h('span', { class: 'mailbox-active' }, t('mailActive')) : null);
}

function viewMail() {
  const activePersona = active();
  if (!activePersona) return h('div', { class: 'empty' }, h('p', {}, t('mailNeedPersona')));
  const boxes = mailboxPersonas();
  if (!boxes.length) return h('div', { class: 'empty' }, h('p', {}, t('mailNoBox')),
    h('button', { class: 'btn primary', onclick: async (e) => {
      const b = e.currentTarget;
      b.disabled = true;
      b.textContent = t('busyCreating');
      try {
        Object.assign(activePersona, await createMailbox(`${latinOf(activePersona.first, regionOf(activePersona))}.${latinOf(activePersona.last, regionOf(activePersona))}`, S.settings.emailMode));
        activePersona.mailboxes = [{ email: activePersona.email, mail: activePersona.mail, createdAt: Date.now() }];
        await persist();
        resetMail(activePersona.id);
        render();
      } catch (err) {
        b.disabled = false;
        b.textContent = t('btnCreateBox');
        toast(err.message);
      }
    } }, t('btnCreateBox')));
  const p = selectedMailbox();
  if (S.mail.personaId !== p.id) resetMail(p.id);
  const copyBtn = h('button', { class: 'icon', title: t('ttCopyAddr') }, icon('copy'));
  copyBtn.addEventListener('click', () => copy(p.email, { btn: copyBtn }));
  const currentBox = boxes.find((box) => box.ownerId === activePersona.id && box.mail.id === activePersona.mail?.id) || p;
  const others = boxes.filter((box) => box.id !== currentBox.id);
  const wrap = h('div', { class: 'stack' },
    h('section', { class: 'mailbox-panel' }, h('div', { class: 'section-label' }, t('mailCurrentBox')), mailboxButton(currentBox, p),
      others.length ? h('div', { class: 'mailbox-list' }, h('div', { class: 'section-label' }, t('mailOtherBoxes')), others.map((box) => mailboxButton(box, p))) : null),
    h('section', { class: 'mail-panel' }, h('div', { class: 'mail-toolbar' }, h('div', { class: 'grow' }, h('div', { class: 'pname' }, p.email), h('a', { class: 'link mail-credit', href: 'https://mail.tm', target: '_blank', rel: 'noopener noreferrer' }, 'mail.tm')),
      copyBtn, h('button', { class: 'icon mail-rotate', title: t('mailRotate'), 'aria-label': t('mailRotate'), onclick: (e) => rotateMailbox(S.personas.find((owner) => owner.id === p.ownerId) || activePersona, e.currentTarget) }, icon('plus')), h('button', { class: 'icon', title: t('ttRefresh'), 'aria-label': t('ttRefresh'), onclick: refreshMail }, icon('refresh'))), h('div', { id: 'mailBody' })));
  queueMicrotask(() => { drawMail(); refreshMail(); });
  pollTimer = setInterval(refreshMail, 45000);
  return wrap;
}

async function rotateMailbox(persona, button) {
  if (button) button.disabled = true;
  try {
    const fresh = await createMailbox(`${latinOf(persona.first, regionOf(persona))}.${latinOf(persona.last, regionOf(persona))}`, S.settings.emailMode);
    if (!Array.isArray(persona.mailboxes)) persona.mailboxes = [];
    if (persona.mail && persona.email && !persona.mailboxes.some((box) => box.mail.id === persona.mail.id)) {
      persona.mailboxes.push({ email: persona.email, mail: persona.mail, createdAt: Date.now() });
    }
    persona.email = fresh.email;
    persona.mail = fresh.mail;
    persona.mailboxes.push({ email: fresh.email, mail: fresh.mail, createdAt: Date.now() });
    await persist();
    resetMail(`${persona.id}::${fresh.mail.id}`);
    render();
    toast(t('mailRotated'));
  } catch (error) {
    if (button) button.disabled = false;
    toast(error.message);
  }
}

async function refreshMail() {
  const p = selectedMailbox();
  if (!p?.mail || S.tab !== 'mail' || S.mail.loading) return;
  const mailboxId = p.id;
  S.mail.loading = true;
  try {
    const pause = await mailPause();
    if (pause) throw new Error(t('errMailWait', { n: Math.ceil(pause / 1000) }));
    const msgs = await listMessages(p);
    if (selectedMailbox()?.id !== mailboxId) return;
    // Архивируем до 8 ещё не сохранённых писем за цикл. Важно проверять весь список,
    // а не только первые 8 элементов: иначе после первого цикла прогресс остановится.
    let archivedThisCycle = 0;
    let archiveFailed = false;
    for (let page = 1; page <= 20 && archivedThisCycle < 8 && !archiveFailed; page++) {
      const pageMessages = page === 1 ? msgs : await listMessages(p, page);
      if (!pageMessages.length) break;
      for (const item of pageMessages) {
        if (archivedThisCycle >= 8) break;
        try {
          if (await archiveHas(p.mail.id, item.id)) continue;
          await archiveMessage(p.mail.id, await readMessage(p, item.id));
          archivedThisCycle++;
        } catch { archiveFailed = true; break; } // best-effort archive; retry on the next refresh
      }
      // Mail.tm uses pages of 30 messages; a shorter page is the last one.
      if (pageMessages.length < 30) break;
    }
    let saved = [];
    try { saved = await archivedMessages(p.mail.id); } catch { /* mailbox still works if local archive is unavailable */ }
    const byId = new Map([...saved, ...msgs].map((item) => [item.id, item]));
    S.mail.msgs = [...byId.values()].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    S.mail.error = null;
  } catch (error) {
    if (selectedMailbox()?.id !== mailboxId) return;
    try {
      const saved = await archivedMessages(p.mail.id);
      S.mail.msgs = saved;
    } catch { S.mail.msgs = S.mail.msgs || []; }
    S.mail.error = error.message;
  } finally {
    S.mail.loading = false;
  }
  if (!S.mail.open) drawMail();
}

function drawMail() {
  const body = $('#mailBody');
  if (!body) return;
  if (!S.mail.open) document.querySelector('.mailbox-panel')?.removeAttribute('hidden');
  const p = selectedMailbox();
  if (!p) return;

  if (!S.mail.msgs) {
    body.replaceChildren(S.mail.error
      ? h('div', { class: 'empty' }, h('p', {}, S.mail.error), h('button', { class: 'btn', onclick: () => refreshMail() }, t('btnRetry')))
      : h('div', { class: 'muted center' }, t('mailLoading')));
    return;
  }
  if (!S.mail.msgs.length) {
    body.replaceChildren(h('div', { class: 'stack' },
      S.mail.error ? h('div', { class: 'banner' }, S.mail.error) : null,
      h('div', { class: 'muted center' }, t('mailEmpty')),
      S.mail.error ? h('button', { class: 'btn', onclick: () => refreshMail() }, t('btnRetry')) : null));
    return;
  }
  body.replaceChildren(h('div', { class: 'stack' },
    S.mail.error ? h('div', { class: 'banner' }, S.mail.error) : null,
    S.mail.msgs.map((m) => {
    const known = senderKnown(m.from?.address || '', p.sites);
    return h('button', { class: 'msg', onclick: () => openMessage(m) },
      h('div', { class: 'meta' }, h('span', {}, m.from?.name || m.from?.address || t('mailNoSender')), h('span', {}, fmtDate(m.createdAt))),
      h('div', { class: 'subj' }, m.subject || t('mailNoSubject')),
      h('div', { class: 'meta' }, h('span', {}, (m.intro || '').slice(0, 60)),
        h('span', { class: 'badge ' + (known ? 'ok' : 'warn') }, known ? t('badgeKnown') : t('badgeUnknown'))));
  })));
}

async function openMessage(m) {
  const p = selectedMailbox();
  const body = $('#mailBody');
  if (!p || !body) return;
  S.mail.open = m.id;
  body.replaceChildren(h('div', { class: 'muted center' }, t('mailOpening')));
  let full;
  try {
    let saved = [];
    try { saved = await archivedMessages(p.mail.id); } catch { /* fetch from provider if local archive is unavailable */ }
    full = saved.find((item) => item.id === m.id);
    if (!full) {
      full = await readMessage(p, m.id);
      try { await archiveMessage(p.mail.id, full); } catch { /* displaying the message takes priority */ }
    }
  } catch (e) {
    S.mail.open = null;
    toast(e.message);
    return drawMail();
  }
  let text = full.text || '';
  const doc = full.html?.[0] ? new DOMParser().parseFromString(full.html[0], 'text/html') : null;
  if (!text.trim() && doc) text = doc.body.textContent || '';
  const codes = extractCodes(`${full.subject || ''}\n${text}`);
  const links = collectLinks(text, doc);
  const known = senderKnown(full.from?.address || '', p.sites);
  const restLinks = links[0]?.main ? links.slice(1) : links;
  document.querySelector('.mailbox-panel')?.setAttribute('hidden', '');
  body.replaceChildren(h('div', { class: 'stack' },
    h('button', { class: 'btn', onclick: () => { S.mail.open = null; drawMail(); } }, '‹ ' + t('mailBack')),
    h('div', {}, h('div', { class: 'pname' }, full.subject || t('mailNoSubject')),
      h('small', {}, t('mailFrom', { addr: full.from?.address || '—' })),
      h('span', { class: 'badge ' + (known ? 'ok' : 'warn') }, known ? t('badgeKnown') : t('badgeUnknownLong'))),
    links[0]?.main ? linkCard(links[0], true) : null,
    codes.length ? h('div', { class: 'codes' }, codes.map((c) => h('button', { class: 'code', title: t('ttCopyCode'), onclick: () => copy(c) }, c))) : null,
    h('pre', { class: 'body' }, linkify(text.trim() || t('mailBlank'))),
    restLinks.length ? h('div', { class: 'linklist' }, h('div', { class: 'section-label' }, t('mailLinks')), restLinks.map((l) => linkCard(l))) : null,
  ));
}

// ───── ссылки в письмах ─────
// Открываем только https. Ссылки берём и из текста, и из href в HTML-версии; «ссылка подтверждения» идёт первой.
const URL_RX = /https:\/\/[^\s<>"'`()[\]{}]+/g;
const trimUrl = (u) => u.replace(/[.,;:!?»”’]+$/, '');
const MAIN_RX = /verif|confirm|activat|validate|magic|token|signin|sign-in|login|reset|auth|подтверд|актив|підтверд|bestät|confirmar|confirmer|conferma|potwierd|konfirmasi/i;
const NOISE_RX = /unsubscribe|optout|opt-out|preferences|отпис|відпис|abmeld/i;

function safeUrl(raw) {
  try {
    const u = new URL(trimUrl(raw));
    return u.protocol === 'https:' && u.hostname ? u : null;
  } catch { return null; }
}

function collectLinks(text, doc) {
  const seen = new Map();
  const add = (raw, label = '') => {
    const u = safeUrl(raw);
    if (!u) return;
    const href = u.href;
    if (!seen.has(href)) seen.set(href, { href, host: u.hostname.replace(/^www\./, ''), label: label.trim().slice(0, 80) });
    else if (label && !seen.get(href).label) seen.get(href).label = label.trim().slice(0, 80);
  };
  doc?.querySelectorAll('a[href]').forEach((a) => add(a.getAttribute('href') || '', a.textContent || ''));
  (text.match(URL_RX) || []).forEach((u) => add(u));
  const all = [...seen.values()].slice(0, 12).map((l) => ({ ...l, main: MAIN_RX.test(l.href + ' ' + l.label) && !NOISE_RX.test(l.href + ' ' + l.label) }));
  const rank = (l) => (l.main ? 0 : NOISE_RX.test(l.href + ' ' + l.label) ? 2 : 1);
  return all.sort((x, y) => rank(x) - rank(y));
}

function linkCard(l, featured = false) {
  const path = (() => { try { const u = new URL(l.href); return (u.pathname + u.search).replace(/^\/$/, ''); } catch { return ''; } })();
  const copyBtn = h('button', { class: 'icon', type: 'button', title: t('ttCopyLink'), 'aria-label': t('ttCopyLink') }, icon('copy'));
  copyBtn.addEventListener('click', () => copy(l.href, { btn: copyBtn }));
  return h('div', { class: 'linkcard' + (featured ? ' featured' : '') },
    h('button', { class: 'linkmain', type: 'button', title: l.href, onclick: () => chrome.tabs.create({ url: l.href }) },
      h('span', { class: 'linkicon', 'aria-hidden': 'true' }, icon('external')),
      h('span', { class: 'grow' },
        featured ? h('small', { class: 'linkkind' }, t('mailLinkMain')) : null,
        h('strong', {}, l.host),
        h('small', { class: 'linkpath' }, l.label && l.label !== l.href ? l.label : path.slice(0, 70)))),
    copyBtn);
}

// Превращает https-ссылки в тексте письма в кликабельные якоря (через DOM-узлы, без innerHTML)
function linkify(text) {
  const out = [];
  let last = 0;
  for (const m of text.matchAll(URL_RX)) {
    const url = trimUrl(m[0]);
    const u = safeUrl(url);
    if (m.index > last) out.push(text.slice(last, m.index));
    if (u) {
      out.push(h('a', { class: 'inline-link', href: u.href, target: '_blank', rel: 'noopener noreferrer', title: u.href }, url));
      last = m.index + url.length;
    } else {
      last = m.index;
    }
  }
  out.push(text.slice(last));
  return out;
}

// ───────────── вкладка «Информация» ─────────────

// Ссылки автора задаются в info.js; разрешены только https: и mailto:
const safeLink = (link) => Boolean(link) && typeof link.url === 'string' && /^(https:\/\/|mailto:)/i.test(link.url);

function linkLabel(link) {
  const label = link.label;
  if (label && typeof label === 'object') return label[lang()] || label.en || Object.values(label)[0] || link.url;
  return label || link.url;
}

function viewInfo() {
  const c = infoFor(lang());
  const sections = [
    group(c.faqTitle, c.faq.map(([q, a]) => h('details', { class: 'faq-item' }, h('summary', {}, q), h('p', {}, a)))),
    group(c.tipsTitle, c.tips.map(([title, text]) =>
      h('div', { class: 'srow col tip' }, h('div', { class: 'stext' }, h('span', {}, title), h('small', {}, text))))),
  ];
  const linkRow = (link) => {
    const label = linkLabel(link);
    if (/^mailto:/i.test(link.url)) {
      // mailto в расширении открывается пустой вкладкой браузера, поэтому адрес просто копируется
      const addr = decodeURIComponent(link.url.replace(/^mailto:/i, '').split('?')[0]);
      return h('button', { class: 'srow data-row', type: 'button', title: t('ttCopy'), onclick: () => copy(addr) },
        h('span', { class: 'dicon', 'aria-hidden': 'true' }, icon('mail')),
        h('div', { class: 'stext' }, h('span', {}, label), h('small', {}, addr)),
        h('span', { class: 'row-end', 'aria-hidden': 'true' }, icon('copy')));
    }
    return h('a', { class: 'srow data-row', href: link.url, target: '_blank', rel: 'noopener noreferrer' },
      h('span', { class: 'dicon', 'aria-hidden': 'true' }, icon('external')),
      h('div', { class: 'stext' }, h('span', {}, label), h('small', {}, (() => { try { return new URL(link.url).hostname; } catch { return ''; } })())),
      h('span', { class: 'row-end', 'aria-hidden': 'true' }, icon('external')));
  };
  const more = (INFO_LINKS.more || []).filter(safeLink);
  const contacts = (INFO_LINKS.contacts || []).filter(safeLink);
  const donate = (INFO_LINKS.donate || []).filter(safeLink);
  if (more.length) sections.push(group(c.moreTitle, more.map(linkRow)));
  if (contacts.length) sections.push(group(c.contactsTitle, contacts.map(linkRow)));
  if (donate.length) {
    sections.push(h('section', { class: 'group donate' }, h('h3', {}, c.donateTitle),
      donate.map((link) => h('a', { class: 'btn primary donate-btn', href: link.url, target: '_blank', rel: 'noopener noreferrer' }, icon('heart'), linkLabel(link)))));
  }
  return h('div', { class: 'settings' }, sections);
}

// ───────────── вкладка «Настройки» ─────────────

// Группа настроек: заголовок над карточкой, внутри строки «название — элемент управления» (как в chrome://settings)
function group(title, ...rows) {
  return h('section', { class: 'group' }, h('h3', {}, title), h('div', { class: 'cardlist' }, rows.flat().filter(Boolean)));
}

const srow = (label, control, hint, cls = '') => h('div', { class: 'srow ' + cls },
  h('div', { class: 'stext' }, h('span', {}, label), hint ? h('small', {}, hint) : null),
  h('div', { class: 'sctl' }, control));

const seg = (key, opts, after) => {
  const box = h('div', { class: 'seg' });
  opts.forEach(([v, label]) => {
    const b = h('button', { type: 'button', class: S.settings[key] === v ? 'on' : '', 'aria-pressed': S.settings[key] === v ? 'true' : 'false', onclick: async () => {
      S.settings[key] = v;
      [...box.children].forEach((c) => {
        c.classList.toggle('on', c === b);
        c.setAttribute('aria-pressed', String(c === b));
      });
      applyAppearance();
      await persist();
      if (after) after();
    } }, label);
    box.append(b);
  });
  return box;
};

function toggle(label, get, set, hint) {
  return h('label', { class: 'srow toggle' },
    h('div', { class: 'stext' }, h('span', {}, label), hint ? h('small', {}, hint) : null),
    h('input', { type: 'checkbox', checked: get(), onchange: async (e) => { set(e.target.checked); await persist(); } }));
}

async function wipeAll() {
  let failed = 0;
  for (const persona of S.personas) {
    const boxes = (persona.mailboxes?.length ? persona.mailboxes : (persona.mail ? [{ email: persona.email, mail: persona.mail }] : []));
    for (const box of boxes) {
      try { await deleteMailbox({ ...persona, ...box }); } catch { failed++; }
      try { await deleteArchivedMailbox(box.mail.id); } catch { failed++; }
    }
  }
  S.personas = [];
  S.activeId = null;
  resetMail();
  await persist();
  render();
  toast(failed ? t('toastWipeMailFailed', { n: failed }) : t('toastWiped'));
}

function viewSettings() {
  const st = S.settings;

  // ── цвет акцента ──
  const swatches = h('div', { class: 'swatches' });
  const custom = h('input', { type: 'color', value: st.accent, title: t('ttCustomColor'), 'aria-label': t('ttCustomColor'), oninput: async (e) => {
    st.accent = e.target.value;
    st.accentMode = 'custom';
    markSw();
    applyAppearance();
    await persist();
  } });
  const personaBtn = h('button', { class: 'btn small-btn', type: 'button', onclick: async () => {
    st.accentMode = 'persona';
    markSw();
    applyAppearance();
    await persist();
  } }, t('accPersona'));
  function markSw() {
    [...swatches.querySelectorAll('.swatch')].forEach((s) => s.classList.toggle('on', st.accentMode === 'custom' && s.dataset.c === st.accent));
    personaBtn.classList.toggle('on', st.accentMode === 'persona');
  }
  COLORS.forEach((c) => swatches.append(h('button', { class: 'swatch', type: 'button', 'data-c': c, style: `background:${c}`, title: c, 'aria-label': c, onclick: async () => {
    st.accent = c;
    st.accentMode = 'custom';
    custom.value = c;
    markSw();
    applyAppearance();
    await persist();
  } })));
  swatches.append(custom);
  markSw();

  // ── пароль ──
  const lenLab = h('b', { class: 'len' }, st.passLen);
  const passLen = h('input', { type: 'range', min: 8, max: 32, value: st.passLen, 'aria-label': t('stPassLen'), oninput: async (e) => {
    st.passLen = Number(e.target.value);
    lenLab.textContent = st.passLen;
    await persist();
  } });

  // ── поля автозаполнения ──
  const KINDS = { first: 'lblFirst', last: 'lblLast', patronymic: 'lblPatronymic', login: 'lblLogin', email: 'lblEmail', password: 'lblPassword', birth: 'lblBirth', phone: 'lblPhone' };
  const chips = h('div', { class: 'chips' }, Object.entries(KINDS).map(([k, key]) =>
    h('label', {}, h('input', { type: 'checkbox', checked: st.fill[k], onchange: async (e) => { st.fill[k] = e.target.checked; await persist(); } }), t(key))));

  const langSel = select([['auto', t('optAuto')], ...LANGS.map((l) => [l.code, l.name])], st.lang, async (v) => {
    st.lang = v;
    setLang(v);
    await persist();
    renderKeepScroll(false);
  });
  const regionSel = select([['auto', t('regAuto')], ...LANGS.map((l) => [l.code, l.name])], st.genRegion, async (v) => {
    st.genRegion = v;
    await persist();
  });
  const emailSel = select([['plausible', t('emailModePlausible')], ['unique', t('emailModeUnique')]], st.emailMode, async (v) => {
    st.emailMode = v;
    await persist();
  });

  // ── данные: каждая строка — целиком кнопка (как в настройках Chrome), без дублирования подписей ──
  const importInput = h('input', { type: 'file', accept: 'application/json,.json', hidden: true, onchange: importData });
  const dataRow = (iconName, title, hint, onclick, cls = '') => {
    const name = h('span', {}, title);
    const row = h('button', { class: 'srow data-row ' + cls, type: 'button', onclick: (e) => onclick(e, name) },
      h('span', { class: 'dicon', 'aria-hidden': 'true' }, icon(iconName)),
      h('div', { class: 'stext' }, name, h('small', {}, hint)));
    return row;
  };
  let wipeTimer = 0;
  const wipeRow = dataRow('trash', t('btnWipe'), t('hintWipe'), async (e, name) => {
    const row = e.currentTarget;
    if (!wipeTimer) {
      row.classList.add('armed');
      name.textContent = t('confirmWipe');
      wipeTimer = setTimeout(() => { wipeTimer = 0; row.classList.remove('armed'); name.textContent = t('btnWipe'); }, 4000);
      return;
    }
    clearTimeout(wipeTimer);
    wipeTimer = 0;
    row.disabled = true;
    await wipeAll();
  }, 'danger-row');

  return h('div', { class: 'settings' },
    group(t('stAppearance'),
      srow(t('stLang'), langSel),
      srow(t('stTheme'), seg('theme', [['auto', t('thAuto')], ['light', t('thLight')], ['dark', t('thDark')]])),
      h('div', { class: 'srow col' }, h('div', { class: 'stext' }, h('span', {}, t('stAccent'))), h('div', { class: 'swatches' }, personaBtn, swatches)),
      srow(t('stDensity'), seg('density', [['compact', t('dnCompact')], ['cozy', t('dnCozy')], ['roomy', t('dnRoomy')]])),
      srow(t('stRadius'), seg('radius', [['sharp', t('rdSharp')], ['soft', t('rdSoft')], ['round', t('rdRound')]])),
      srow(t('stFont'), seg('fontSize', [['s', 'S'], ['m', 'M'], ['l', 'L']])),
      srow(t('stWidth'), seg('width', [[340, t('wNarrow')], [380, t('wNormal')], [440, t('wWide')]]))),
    group(t('stNew'),
      srow(t('stRegion'), regionSel),
      toggle(t('stAutoMail'), () => st.autoMailbox, (v) => { st.autoMailbox = v; }, t('hintAutoMail')),
      srow(t('stEmailMode'), emailSel, t('hintEmailMode')),
      toggle(t('stUniquePass'), () => st.uniquePasswords, (v) => { st.uniquePasswords = v; }, t('hintUniquePass')),
      srow(t('stPassLen'), h('div', { class: 'range' }, passLen, lenLab)),
      toggle(t('stPassSym'), () => st.passSymbols, (v) => { st.passSymbols = v; })),
    group(t('stFill'), h('div', { class: 'srow col' }, chips)),
    group(t('stData'),
      dataRow('download', t('btnExport'), t('hintExport'), async (e) => {
        const row = e.currentTarget;
        row.disabled = true;
        try { await exportData(); } finally { row.disabled = false; }
      }),
      dataRow('upload', t('btnImport'), t('hintImport'), () => importInput.click()),
      wipeRow, importInput),
  );
}

async function exportData() {
  const mailArchive = {};
  for (const persona of S.personas) {
    const boxes = (persona.mailboxes?.length ? persona.mailboxes : (persona.mail ? [{ email: persona.email, mail: persona.mail }] : []));
    for (const box of boxes) {
      try { mailArchive[box.mail.id] = await archivedMessages(box.mail.id); } catch { /* skip unreadable archive partition */ }
    }
  }
  const blob = new Blob([JSON.stringify({ version: 4, personas: S.personas, settings: S.settings, mailArchive }, null, 2)], { type: 'application/json' });
  const stamp = new Date().toISOString().slice(0, 10);
  const a = h('a', { href: URL.createObjectURL(blob), download: `extra-id-backup-${stamp}.json` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast(t('toastExported'));
}

function importProfile(source) {
  if (!source || typeof source !== 'object' || typeof source.id !== 'string' || typeof source.first !== 'string'
      || typeof source.login !== 'string' || typeof source.password !== 'string'
      || source.id.length > 80 || source.first.length > 120 || source.login.length > 100 || source.password.length > 1024) {
    throw new Error(t('errInvalidProfile'));
  }
  if (!source.login.trim() || !source.password) throw new Error(t('errInvalidProfile'));
  const text = (value) => typeof value === 'string' ? value : '';
  const timestamp = (value) => Number.isFinite(value) && value > 0 ? value : Date.now();
  const sites = (items) => Array.isArray(items) ? items.filter((site) =>
    site && typeof site.host === 'string' && /^[a-z0-9.-]+$/i.test(site.host) && site.host.length <= 253,
  ).map((site) => ({
    host: site.host.toLowerCase(), at: timestamp(site.at),
    ...(typeof site.password === 'string' && site.password && site.password.length <= 1024 ? { password: site.password } : {}),
  })) : [];
  if (source.mail && (typeof source.mail.id !== 'string' || typeof source.mail.password !== 'string')) {
    throw new Error(t('errInvalidProfile'));
  }
  return {
    id: source.id,
    region: regionOf(source),
    first: text(source.first), last: text(source.last), patronymic: text(source.patronymic),
    login: source.login.trim(), password: source.password,
    birth: /^\d{4}-\d{2}-\d{2}$/.test(source.birth || '') ? source.birth : '',
    phone: text(source.phone), email: text(source.email),
    mail: source.mail ? { id: source.mail.id, password: source.mail.password, provider: 'mail.tm' } : null,
    mailboxes: (() => { const boxes = Array.isArray(source.mailboxes) ? source.mailboxes.filter((box) => box && typeof box.email === 'string' && box.mail && typeof box.mail.id === 'string' && typeof box.mail.password === 'string').map((box) => ({ email: box.email, mail: { id: box.mail.id, password: box.mail.password, provider: 'mail.tm' }, createdAt: Number(box.createdAt) || Date.now() })) : []; if (source.mail && source.email && !boxes.some((box) => box.mail.id === source.mail.id)) boxes.push({ email: source.email, mail: { id: source.mail.id, password: source.mail.password, provider: 'mail.tm' }, createdAt: Date.now() }); return boxes; })(),
    color: /^#[0-9a-f]{6}$/i.test(source.color || '') ? source.color : COLORS[0],
    note: text(source.note),
    sites: sites(source.sites),
    passwordHistory: Array.isArray(source.passwordHistory) ? source.passwordHistory
      .filter((entry) => entry && typeof entry.password === 'string' && entry.password.length <= 1024)
      .map((entry) => ({ password: entry.password, changedAt: timestamp(entry.changedAt), sites: sites(entry.sites) })) : [],
    createdAt: timestamp(source.createdAt),
  };
}

async function importData(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    if (file.size > 50_000_000) throw new Error(t('errImportSize'));
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.personas)) throw new Error(t('errNoList'));
    const known = new Set(S.personas.map((persona) => persona.id));
    const logins = new Set(S.personas.map((persona) => persona.login.toLowerCase()));
    const fresh = [];
    for (const source of data.personas) {
      const persona = importProfile(source);
      if (known.has(persona.id) || logins.has(persona.login.toLowerCase())) continue;
      known.add(persona.id);
      logins.add(persona.login.toLowerCase());
      fresh.push(persona);
    }
    S.personas.push(...fresh);
    if (data.mailArchive && typeof data.mailArchive === 'object') {
      const ownMailIds = new Set(S.personas.flatMap((persona) => (persona.mailboxes || []).map((box) => box.mail.id)));
      for (const [mailId, messages] of Object.entries(data.mailArchive)) {
        if (!Array.isArray(messages) || !ownMailIds.has(mailId)) continue;
        for (const message of messages.slice(0, 5000)) {
          if (message && typeof message.id === 'string') { try { await archiveMessage(mailId, message); } catch { /* continue importing other messages */ } }
        }
      }
    }
    if (!S.activeId && S.personas.length) S.activeId = S.personas[0].id;
    await persist();
    render();
    toast(t('toastImported', { n: fresh.length }));
  } catch (error) {
    toast(t('toastImportFail', { err: error.message }));
  } finally {
    event.target.value = '';
  }
}

// ───────────── запуск ─────────────

document.querySelectorAll('#tabs button').forEach((b) => b.addEventListener('click', () => goTab(b.dataset.tab)));
Object.assign(S, await load());
setLang(S.settings.lang);
render();
