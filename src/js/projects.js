import { $, $$, escapeHtml } from './dom.js';
import { getLang, onLangChange, t } from './i18n.js';
import { GITHUB_USER, LANG_COLORS, PROJECTS } from '../data/projects.js';

const description = (p) => (getLang() === 'cs' && p.descCs ? p.descCs : p.desc);
const badgeText = (p) => t(p.status === 'open' ? 'proj.badge.open' : 'proj.badge.closed');

function card(p, index) {
    const color = LANG_COLORS[p.lang] ?? '#888';
    const url = `https://github.com/${GITHUB_USER}/${encodeURIComponent(p.name)}`;
    const classes = ['project', 'reveal', p.featured && 'is-featured'].filter(Boolean).join(' ');

    return `
        <a class="${classes}" data-status="${p.status}" href="${url}" target="_blank" rel="noopener"
           style="--delay: ${(index % 3) * 0.08}s">
            <div class="project-top">
                <i class="bi bi-folder2"></i>
                <span class="badge${p.status === 'open' ? ' badge-open' : ''}">${escapeHtml(badgeText(p))}</span>
            </div>
            <h3>${escapeHtml(p.name)}</h3>
            <p class="project-desc">${escapeHtml(description(p))}</p>
            <div class="project-foot">
                <span class="lang"><i style="background: ${color}"></i>${escapeHtml(p.lang)}</span>
                <span class="project-link">GitHub <i class="bi bi-arrow-up-right"></i></span>
            </div>
        </a>`;
}

export function initProjects() {
    const list = $('#projects');
    list.innerHTML = PROJECTS.map(card).join('');

    const openCount = PROJECTS.filter((p) => p.status === 'open').length;
    $('#count-all').textContent = PROJECTS.length;
    $('#count-open').textContent = openCount;
    $('#count-closed').textContent = PROJECTS.length - openCount;

    const filters = $$('.filter');
    const applyFilter = (filter) => {
        for (const button of filters) {
            const active = button.dataset.filter === filter;
            button.classList.toggle('is-active', active);
            button.setAttribute('aria-pressed', String(active));
        }
        for (const item of $$('.project', list)) {
            item.hidden = filter !== 'all' && item.dataset.status !== filter;
        }
    };

    for (const button of filters) {
        button.addEventListener('click', () => {
            list.classList.remove('is-filtering');
            void list.offsetWidth; // restart the fade-in animation
            list.classList.add('is-filtering');
            applyFilter(button.dataset.filter);
        });
    }
    applyFilter('open');

    // update texts in place so reveal state and the active filter are kept
    onLangChange(() => {
        $$('.project', list).forEach((item, i) => {
            $('.project-desc', item).textContent = description(PROJECTS[i]);
            $('.badge', item).textContent = badgeText(PROJECTS[i]);
        });
    });
}
