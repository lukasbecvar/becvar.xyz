import { $$ } from './dom.js';
import { CS, TYPED_WORDS_CS } from '../i18n/cs.js';

const LANGS = ['en', 'cs'];
const STORAGE_KEY = 'lang';

/** English strings that only exist in JS (everything else is read from the HTML). */
const EN = {
    'proj.badge.open': 'active',
    'proj.badge.closed': 'archived',
    'contact.copied': 'Copied',
};
const DICTS = { en: EN, cs: CS };

let lang = 'en';
const listeners = [];

function detectLang() {
    const fromUrl = /[?&]lang=(en|cs)\b/.exec(window.location.search);
    if (fromUrl) return fromUrl[1];
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (LANGS.includes(saved)) return saved;
    } catch {
        /* storage unavailable */
    }
    return 'en';
}

/** Parse `data-i18n-attr="aria-label:key;content:key2"`. */
const attrPairs = (node) =>
    node
        .getAttribute('data-i18n-attr')
        .split(';')
        .map((pair) => pair.split(':'));

/** Remember the English originals from the markup so we can switch back. */
function collectEnglish() {
    for (const node of $$('[data-i18n]')) EN[node.dataset.i18n] = node.innerHTML;
    for (const node of $$('[data-i18n-attr]')) {
        for (const [attr, key] of attrPairs(node)) EN[key] = node.getAttribute(attr);
    }
}

export const getLang = () => lang;

export function t(key) {
    return DICTS[lang][key] ?? EN[key] ?? key;
}

export function typedWords(englishWords) {
    return lang === 'cs' ? TYPED_WORDS_CS : englishWords;
}

function applyTexts() {
    document.documentElement.lang = lang;
    for (const node of $$('[data-i18n]')) {
        const value = t(node.dataset.i18n);
        if (node.innerHTML !== value) node.innerHTML = value;
    }
    for (const node of $$('[data-i18n-attr]')) {
        for (const [attr, key] of attrPairs(node)) node.setAttribute(attr, t(key));
    }
    for (const button of $$('.lang-switch button')) {
        button.setAttribute('aria-pressed', String(button.dataset.lang === lang));
    }
}

/** Subscribe to language changes (called with the new language). */
export function onLangChange(fn) {
    listeners.push(fn);
}

export function setLang(next) {
    if (next === lang || !LANGS.includes(next)) return;
    lang = next;
    try {
        window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
        /* storage unavailable */
    }
    applyTexts();
    listeners.forEach((fn) => fn(lang));
}

export function initI18n() {
    collectEnglish();
    lang = detectLang();
    applyTexts();
    document.documentElement.classList.remove('i18n-pending');

    for (const button of $$('.lang-switch button')) {
        button.addEventListener('click', () => setLang(button.dataset.lang));
    }
}
