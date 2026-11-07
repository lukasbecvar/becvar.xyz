// Fonts – bundled and served from our own domain (no Google Fonts / CDN).
// Only latin + latin-ext subsets are needed (English and Czech).
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-ext-400.css';
import '@fontsource/manrope/latin-500.css';
import '@fontsource/manrope/latin-ext-500.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-ext-600.css';
import '@fontsource/manrope/latin-700.css';
import '@fontsource/manrope/latin-ext-700.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/manrope/latin-ext-800.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-ext-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-ext-500.css';

// Only the Bootstrap Icons actually used on the page (see vite.config.js).
import 'virtual:icons.css';
import './styles/main.css';

import { $ } from './js/dom.js';
import { initI18n } from './js/i18n.js';
import { initHeader } from './js/header.js';
import { initHero } from './js/hero.js';
import { initTerminal } from './js/terminal.js';
import { initProjects } from './js/projects.js';
import { initContact } from './js/contact.js';
import { initMarquee, initReveal, initSpotlight } from './js/effects.js';
import { BIRTH_DATE, CODING_SINCE } from './data/profile.js';
import { PROJECTS } from './data/projects.js';

function fillComputedValues() {
    const now = new Date();
    let age = now.getFullYear() - BIRTH_DATE.getFullYear();
    if (now < new Date(now.getFullYear(), BIRTH_DATE.getMonth(), BIRTH_DATE.getDate())) age--;

    const years = now.getFullYear() - CODING_SINCE;
    $('#age').textContent = String(age);
    $('#years').textContent = String(years);
    $('#years').dataset.count = String(years);
    $('#repo-count').textContent = String(PROJECTS.length);
    $('#repo-count').dataset.count = String(PROJECTS.length);
    $('#year').textContent = String(now.getFullYear());
}

// i18n first so every later module renders in the right language
initI18n();
fillComputedValues();
initHeader();
initHero();
initTerminal(PROJECTS.length);
initProjects(); // must run before initReveal so project cards get observed
initContact();
initMarquee();
initReveal();
initSpotlight();
