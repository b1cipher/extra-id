// Extra ID — локализация интерфейса.
// Статические импорты: service worker не умеет динамический import().
import ru from './locales/ru.js';
import en from './locales/en.js';
import es from './locales/es.js';
import pt from './locales/pt.js';
import de from './locales/de.js';
import ja from './locales/ja.js';
import hi from './locales/hi.js';
import fr from './locales/fr.js';
import id from './locales/id.js';
import it from './locales/it.js';
import pl from './locales/pl.js';
import uk from './locales/uk.js';

const DICTS = { ru, en, es, pt, de, ja, hi, fr, id, it, pl, uk };

// name — название языка на нём самом, не переводится
export const LANGS = [
  { code: 'en', name: 'English (UK)', intl: 'en-GB' },
  { code: 'es', name: 'Español', intl: 'es-ES' },
  { code: 'pt', name: 'Português (Brasil)', intl: 'pt-BR' },
  { code: 'de', name: 'Deutsch', intl: 'de-DE' },
  { code: 'fr', name: 'Français', intl: 'fr-FR' },
  { code: 'it', name: 'Italiano', intl: 'it-IT' },
  { code: 'pl', name: 'Polski', intl: 'pl-PL' },
  { code: 'uk', name: 'Українська', intl: 'uk-UA' },
  { code: 'ru', name: 'Русский', intl: 'ru-RU' },
  { code: 'ja', name: '日本語', intl: 'ja-JP' },
  { code: 'hi', name: 'हिन्दी', intl: 'hi-IN' },
  { code: 'id', name: 'Bahasa Indonesia', intl: 'id-ID' },
];

let cur = 'en';

export function detectLang() {
  const raw = (globalThis.chrome?.i18n?.getUILanguage?.() || globalThis.navigator?.language || 'en').slice(0, 2).toLowerCase();
  return DICTS[raw] ? raw : 'en';
}

// pref: 'auto' или код языка
export function setLang(pref) {
  cur = pref && pref !== 'auto' && DICTS[pref] ? pref : detectLang();
  return cur;
}

export const lang = () => cur;
export const intlLocale = () => LANGS.find((l) => l.code === cur).intl;
export const hasLang = (code) => Boolean(DICTS[code]);
export const dictOf = (code) => DICTS[code];

export function t(key, params = {}) {
  const s = DICTS[cur][key] ?? DICTS.en[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (m, k) => (params[k] ?? m));
}
