import { $, $$, canHover, reduceMotion } from './dom.js';

/** Animated number count-up for elements with `data-count`. */
function countUp(node) {
    const target = parseInt(node.dataset.count, 10);
    if (!target || reduceMotion) return;
    const duration = 1200;
    let start = null;

    const step = (time) => {
        start ??= time;
        const k = Math.min((time - start) / duration, 1);
        node.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

/** Reveal `.reveal` elements when they scroll into view. */
export function initReveal() {
    const items = $$('.reveal');

    if (!('IntersectionObserver' in window) || reduceMotion) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }

    document.documentElement.classList.add('js-reveal');
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-visible');
                $$('[data-count]', entry.target).forEach(countUp);
                observer.unobserve(entry.target);
            }
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );
    items.forEach((item) => observer.observe(item));
}

/** Soft spotlight following the cursor over cards. */
export function initSpotlight() {
    if (!canHover || reduceMotion) return;
    $$('.card, .about-card, .project, .stat, .mail-box, .tl-body').forEach((c) => c.classList.add('spot'));

    document.addEventListener(
        'mousemove',
        (e) => {
            const target = e.target.closest?.('.spot');
            if (!target) return;
            const rect = target.getBoundingClientRect();
            target.style.setProperty('--mx', `${e.clientX - rect.left}px`);
            target.style.setProperty('--my', `${e.clientY - rect.top}px`);
        },
        { passive: true },
    );
}

/** Duplicate the technology list so the marquee loops seamlessly. */
export function initMarquee() {
    const list = $('#marquee-list');
    if (!list) return;
    const copy = list.cloneNode(true);
    copy.removeAttribute('id');
    copy.setAttribute('aria-hidden', 'true');
    list.after(copy);
}
