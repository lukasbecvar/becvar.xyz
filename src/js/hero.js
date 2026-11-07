import { $, el, reduceMotion, canHover } from './dom.js';
import { getLang, onLangChange, typedWords } from './i18n.js';

/** Split the name into letters so each one can animate in. */
function splitName() {
    const heading = $('#hero-name');
    if (!heading || reduceMotion) return;

    const full = heading.textContent.trim();
    const label = el('span', 'sr-only', full);
    heading.textContent = '';

    let index = 0;
    full.split(' ').forEach((word, wi) => {
        if (wi > 0) heading.append(' ');
        const wordEl = el('span', 'word');
        wordEl.setAttribute('aria-hidden', 'true');
        for (const ch of word) {
            const charEl = el('span', 'char', ch);
            charEl.style.setProperty('--i', index++);
            wordEl.append(charEl);
        }
        heading.append(wordEl);
    });
    heading.append(label);
}

/**
 * Typing effect cycling through roles.
 * Runs even with reduced motion (it is text, not movement) – only the per-letter
 * CSS animations are disabled in that case.
 */
function initTyped() {
    const typed = $('#typed');
    const article = $('#typed-article');
    const wrap = typed.parentNode;
    const englishWords = typed.dataset.words.split('|');

    let words = typedWords(englishWords);
    let wordIndex = 0;
    let deleting = true;

    const srText = el('span', 'sr-only');
    wrap.append(srText);
    typed.setAttribute('aria-hidden', 'true');
    article.setAttribute('aria-hidden', 'true');

    // English needs "a" / "an" in front of the role, Czech needs nothing.
    const updateArticle = (word) => {
        article.textContent = getLang() === 'en' ? (/^[aeiou]/i.test(word) ? 'an' : 'a') : '';
        article.hidden = getLang() !== 'en';
    };
    const updateScreenReaderText = () => {
        srText.textContent = words.join(', ');
    };

    const addChar = (ch) => typed.append(el('span', 't-ch', ch === ' ' ? ' ' : ch));
    const setTyping = (on) => wrap.classList.toggle('is-typing', on);

    typed.textContent = '';
    [...words[0]].forEach(addChar);
    updateArticle(words[0]);
    updateScreenReaderText();

    const tick = () => {
        if (deleting) {
            setTyping(true);
            if (typed.lastChild) {
                typed.lastChild.remove();
                return setTimeout(tick, 28);
            }
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typed.dataset.i = String(wordIndex % 4);
            updateArticle(words[wordIndex]);
            return setTimeout(tick, 300);
        }

        const word = words[wordIndex];
        const typedCount = typed.childNodes.length;
        if (typedCount < word.length) {
            addChar(word.charAt(typedCount));
            return setTimeout(tick, 55 + Math.random() * 65);
        }

        setTyping(false);
        typed.classList.remove('is-done');
        void typed.offsetWidth; // restart the CSS animation
        typed.classList.add('is-done');
        deleting = true;
        return setTimeout(tick, 2400);
    };
    setTimeout(tick, 2600);

    onLangChange(() => {
        words = typedWords(englishWords);
        updateScreenReaderText();
        // delete the current word, then continue with the first word in the new language
        wordIndex = -1;
        deleting = true;
    });
}

/** Terminal tilt + glow parallax that follows the mouse. */
function initPointerEffects() {
    const hero = $('.hero');
    const terminal = $('#terminal-box');
    if (!canHover || reduceMotion || !hero || !terminal) return;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        terminal.style.transform = `perspective(1200px) rotateY(${x * 10}deg) rotateX(${y * -8}deg)`;
        hero.style.setProperty('--gx', x.toFixed(3));
        hero.style.setProperty('--gy', y.toFixed(3));
    });
    hero.addEventListener('mouseleave', () => {
        terminal.style.transform = '';
        hero.style.setProperty('--gx', '0');
        hero.style.setProperty('--gy', '0');
    });
}

export function initHero() {
    splitName();
    initTyped();
    initPointerEffects();
}
