import { $, $$, reduceMotion } from './dom.js';

/** Sticky header state, back-to-top button, scroll progress and hero parallax. */
function initScroll() {
    const header = $('#header');
    const toTop = $('#to-top');
    const progress = $('#scroll-progress');
    const heroBg = $('#hero-bg');
    let ticking = false;

    const update = () => {
        ticking = false;
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;

        header.classList.toggle('is-scrolled', y > 20);
        toTop.classList.toggle('is-visible', y > 600);
        progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

        if (!reduceMotion && heroBg && y < window.innerHeight * 1.2) {
            heroBg.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(1.08)`;
        }
    };

    window.addEventListener(
        'scroll',
        () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        },
        { passive: true },
    );
    update();
}

/** Mobile navigation overlay. */
function initMobileNav() {
    const nav = $('#nav');
    const toggle = $('#nav-toggle');
    const icon = $('i', toggle);

    const setOpen = (open) => {
        nav.classList.toggle('is-open', open);
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        icon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    $$('a', nav).forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) setOpen(false);
    });
}

/** Highlight the nav link of the section currently in view. */
function initActiveLink() {
    if (!('IntersectionObserver' in window)) return;
    const links = $$('.nav a[href^="#"]');

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                for (const link of links) {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
                }
            }
        },
        { rootMargin: '-45% 0px -50% 0px' },
    );
    $$('main section[id]').forEach((section) => observer.observe(section));
}

export function initHeader() {
    initScroll();
    initMobileNav();
    initActiveLink();
}
