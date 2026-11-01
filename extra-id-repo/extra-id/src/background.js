import { load, fillTab, fullName, CONSENT_REV } from './lib.js';
import { setLang, t } from './i18n.js';

const MENU_FIELD = 'extraid-field';
const MENU_FORM = 'extraid-form';

async function buildMenus() {
  const { settings } = await load();
  setLang(settings.lang);
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({ id: MENU_FIELD, title: t('menuField'), contexts: ['editable'] });
  chrome.contextMenus.create({ id: MENU_FORM, title: t('menuForm'), contexts: ['editable', 'page'] });
  await refreshMenus();
}

// В пункте меню видно, какая персона активна; язык меню следует настройке языка
async function refreshMenus() {
  const { personas, activeId, settings } = await load();
  setLang(settings.lang);
  const p = personas.find((x) => x.id === activeId);
  const who = p ? ` (${fullName(p)})` : '';
  try {
    await chrome.contextMenus.update(MENU_FIELD, { title: t('menuField') + who });
    await chrome.contextMenus.update(MENU_FORM, { title: t('menuForm') + who });
  } catch { /* меню ещё не создано */ }
}

chrome.runtime.onInstalled.addListener(buildMenus);
chrome.storage.onChanged.addListener((ch) => {
  if (ch.vaultData) refreshMenus();
});

function flash(tabId, text, color) {
  chrome.action.setBadgeBackgroundColor({ tabId, color });
  chrome.action.setBadgeText({ tabId, text });
  setTimeout(() => chrome.action.setBadgeText({ tabId, text: '' }), 2200);
}

async function runFill(tab, mode, frameId = 0) {
  if (!tab?.id || !/^https?:/.test(tab.url || '')) return;
  const { personas, activeId, settings } = await load();
  const persona = personas.find((x) => x.id === activeId);
  // без подтверждённого уведомления о данных расширение ничего не заполняет
  if (!persona || settings.consent !== CONSENT_REV) return flash(tab.id, '!', '#dc2626');
  try {
    const n = await fillTab({ tab, persona, settings, mode, frameId });
    flash(tab.id, n ? String(n) : '0', n ? '#16a34a' : '#d97706');
  } catch {
    flash(tab.id, '×', '#dc2626');
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => runFill(tab, info.menuItemId === MENU_FIELD ? 'field' : 'form', info.frameId || 0));

// Горячая клавиша (по умолчанию Alt+Shift+F): заполнить форму на текущей странице активной персоной
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === 'fill-form') runFill(tab, 'form');
});

